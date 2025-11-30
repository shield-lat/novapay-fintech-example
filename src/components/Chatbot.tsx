"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';

type Message = {
  role: "user" | "assistant";
  content: string;
};

// Actualizar sugerencias con preguntas relevantes para la nueva data
const SUGGESTIONS = [
  "💰 ¿Cuál es mi saldo actual?",
  "📉 Mis últimas transacciones",
  "⚠️ ¿Quién me debe dinero?",
  "🔮 Proyección de flujo"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSafetyMode, setIsSafetyMode] = useState(false); // Desactivado por defecto para probar la funcionalidad RAG primero
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy Nova, tu Asistente Financiero Inteligente. Tengo acceso a tus datos en tiempo real. ¿Qué quieres saber sobre tu empresa?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, statusMessage]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage = text;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);
    setStatusMessage("");

    try {
      // --- STEP 1: GUARDRAIL (QUESTION) - Optional ---
      if (isSafetyMode) {
        setStatusMessage("Analizando seguridad...");
        const guardReq = await fetch("/api/guardrail", {
          method: "POST",
          body: JSON.stringify({ text: userMessage, type: "question" }),
        });
        const guardRes = await guardReq.json();

        if (!guardRes.approved) {
            throw new Error(guardRes.reason || "Pregunta no segura");
        }
      }

      // --- STEP 2: RAG CHAT API ---
      setStatusMessage("Consultando datos financieros...");
      
      const chatReq = await fetch("/api/chat", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!chatReq.ok) throw new Error("Error en el servidor");

      const chatRes = await chatReq.json();
      const aiResponse = chatRes.response;

      // --- STEP 3: GUARDRAIL (ANSWER) - Optional ---
      if (isSafetyMode) {
        setStatusMessage("Verificando respuesta...");
        // ... lógica de guardrail de respuesta ...
      }

      // --- STEP 4: DISPLAY ANSWER ---
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);

    } catch (error: any) {
      console.error("Error in chat flow:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: error.message || "Lo siento, no pude procesar tu solicitud en este momento." },
      ]);
    } finally {
      setIsTyping(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-96 mb-4 border border-gray-200 overflow-hidden flex flex-col h-[600px]"
          >
            {/* Header */}
            <div className="bg-blue-900 p-4 flex justify-between items-center shadow-md">
              <div className="flex items-center space-x-3 text-white">
                <div className="bg-white/10 p-2 rounded-full border border-white/20">
                   <Bot className="h-6 w-6 text-blue-100" />
                </div>
                <div>
                  <span className="font-bold block text-sm">NovaPay Intelligence</span>
                  <span className="text-[10px] text-blue-200 flex items-center gap-1 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span>
                    Datos en Vivo
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-4 text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-2xl rounded-br-none"
                        : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-none"
                    }`}
                  >
                    {msg.role === "user" ? (
                        <p>{msg.content}</p>
                    ) : (
                        <div className="prose prose-sm max-w-none prose-p:leading-snug prose-strong:text-blue-700">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    )}
                  </div>
                </div>
              ))}
              
              {(isTyping || statusMessage) && (
                <div className="flex flex-col items-start space-y-2">
                  {statusMessage && (
                    <span className="text-xs text-blue-600 flex items-center gap-1.5 ml-2 font-medium animate-pulse">
                      <Bot className="h-3 w-3" />
                      {statusMessage}
                    </span>
                  )}
                  {isTyping && (
                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex space-x-1.5 items-center ml-1">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-150"></div>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 py-3 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
              {SUGGESTIONS.map((sugg) => (
                <button
                  key={sugg}
                  onClick={() => handleSend(sugg)}
                  className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg text-xs text-slate-600 hover:text-blue-700 transition-all duration-200"
                >
                  {sugg}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex space-x-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Pregunta sobre tus finanzas..."
                  className="flex-1 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() && !isTyping}
                  className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-900/30 transition-all flex items-center justify-center relative group border border-white/10"
          >
            <MessageCircle className="h-7 w-7" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 text-[10px] text-white items-center justify-center shadow-sm">1</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
