import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { 
  getFinancialSummary, 
  getRecentTransactions, 
  getReceivables, 
  getCashflowProjection 
} from '@/lib/data-service';

// Initialize Gemini outside handler to reuse instance
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  try {
    // Check API Key
    if (!apiKey) {
      console.error("Server Error: GEMINI_API_KEY is missing");
      return NextResponse.json({ error: "Configuración de IA incompleta. Revisa el .env" }, { status: 500 });
    }

    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    console.log("Procesando mensaje:", message);

    // 1. Obtener Contexto de Datos
    let contextData = "";
    const lowerMsg = message.toLowerCase();

    try {
      // Siempre traer resumen financiero
      const summary = await getFinancialSummary();
      contextData += `RESUMEN: ${JSON.stringify(summary)}\n`;

      // Traer otros datos según keywords
      if (lowerMsg.includes('transaccion') || lowerMsg.includes('movimiento') || lowerMsg.includes('gasto') || lowerMsg.includes('ingreso')) {
        const transactions = await getRecentTransactions(5);
        contextData += `TRANSACCIONES: ${JSON.stringify(transactions)}\n`;
      }

      if (lowerMsg.includes('debe') || lowerMsg.includes('cobrar') || lowerMsg.includes('factura') || lowerMsg.includes('cliente')) {
        const receivables = await getReceivables();
        contextData += `POR COBRAR: ${JSON.stringify(receivables)}\n`;
      }

      if (lowerMsg.includes('futuro') || lowerMsg.includes('proyeccion') || lowerMsg.includes('flujo')) {
        const forecast = await getCashflowProjection();
        contextData += `PROYECCION: ${JSON.stringify(forecast)}\n`;
      }
    } catch (dbError: any) {
      console.error("Database Error (Non-fatal):", dbError);
      contextData += "NOTA: Error parcial al leer base de datos. Responde con lo que sepas.\n";
    }

    // 2. Generar Respuesta
    if (!genAI) throw new Error("Gemini client failed to initialize");
    // Cambiamos a 'gemini-pro' que es el modelo estándar más compatible actualmente
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `
      Eres "NovaBot", analista financiero de NovaPay.
      DATOS: ${contextData}
      
      Pregunta: "${message}"
      Responde en Español, profesional y breve. Usa los datos si aplican.
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });

  } catch (error: any) {
    console.error('CRITICAL API ERROR:', error);
    return NextResponse.json(
      { error: `Error interno: ${error.message}` },
      { status: 500 }
    );
  }
}
