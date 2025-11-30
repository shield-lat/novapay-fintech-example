import { NextResponse } from "next/server";

// Shield Core Config
const SHIELD_URL = process.env.SHIELD_API_URL || "https://core.shield.lat";
const SHIELD_API_KEY = process.env.SHIELD_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, type, userId } = body;
    
    // Payload completo para Shield Core API
    const payload = {
      action_type: type === "question" ? "user_query" : "bot_response",
      cot_trace: "",
      input: text,
      model_name: "gemini-2.5-flash",
      payload: JSON.stringify({ 
        interaction_stage: type, 
        source: "novapay_landing",
        context: "fintech_chatbot"
      }),
      user_id: userId || "anonymous_user"
    };

    let shieldData;
    try {
      const isQuestion = type === "question";
      console.log(`\n${"=".repeat(60)}`);
      console.log(`📤 GUARDRAIL ${isQuestion ? "INPUT (PREGUNTA)" : "OUTPUT (RESPUESTA)"}`);
      console.log(`${"=".repeat(60)}`);
      console.log("   Texto:", text.substring(0, 100) + (text.length > 100 ? "..." : ""));
      console.log("   Action Type:", payload.action_type);
      console.log("   User:", userId || "anonymous");
      
      // Intentamos contactar a Shield Core
      const shieldReq = await fetch(`${SHIELD_URL}/v1/evaluate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SHIELD_API_KEY}`
        },
        body: JSON.stringify(payload)
      });

      console.log("📥 Shield Response:", shieldReq.status);
      
      if (!shieldReq.ok) {
        // Intentar leer el body del error
        const errorBody = await shieldReq.text();
        console.log("❌ Shield Error Body:", errorBody);
        throw new Error(`Shield API Error: ${shieldReq.status} - ${errorBody}`);
      }
      
      shieldData = await shieldReq.json();
      console.log("✅ Shield Core Response:", JSON.stringify(shieldData, null, 2));

    } catch (connectionError) {
      // === REGLA FAIL-OPEN ===
      // Si Shield está apagado o da error, dejamos PASAR el mensaje.
      console.warn("⚠️ Shield Core no disponible. Aplicando Bypass de Seguridad (Fail-Open).", connectionError);
      
      return NextResponse.json({ 
        approved: true, 
        reason: "Verificación omitida temporalmente (Servicio no disponible)",
        _meta: { bypass: true }
      });
    }

    // Si Shield respondió, respetamos su decisión
    // Respuesta Shield: { safe: boolean, decision: string, risk_tier: string, reasons: string[] }
    const isApproved = shieldData.safe === true;
    
    // Mensajes sutiles para el usuario en caso de bloqueo
    let userReason = "";
    if (!isApproved) {
        if (type === "question") {
            userReason = "Lo siento, no puedo procesar esa consulta específica debido a mis protocolos de seguridad.";
        } else {
            userReason = "Lo siento, no puedo mostrar esta respuesta porque contiene información no verificada.";
        }
    }

    return NextResponse.json({ 
      approved: isApproved, 
      reason: userReason,
      _meta: { 
        decision: shieldData.decision,
        risk_tier: shieldData.risk_tier, 
        reasons: shieldData.reasons,
        action_id: shieldData.action_id
      }
    });

  } catch (error: any) {
    console.error("Critical Guardrail Error:", error);
    // En caso de error grave en NUESTRO código (ej. JSON malformado), también aplicamos Fail-Open
    return NextResponse.json({ approved: true, reason: "Internal Bypass" });
  }
}
