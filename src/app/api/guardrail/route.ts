import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { text, type } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        score: 1, 
        approved: true, 
        reason: "API Key not configured, bypassing guardrail" 
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let prompt = "";
    if (type === "question") {
      prompt = `
        Evalúa la siguiente pregunta del usuario para un chatbot de una Fintech B2B llamada NovaPay.
        La pregunta debe ser sobre: Finanzas, Tesorería, NovaPay, Precios, Tecnología, Soporte, o saludos generales.
        
        Pregunta: "${text}"
        
        Devuelve un JSON con este formato exacto:
        {
          "score": (número entre 0 y 1, donde 1 es muy relevante/seguro y 0 es irrelevante/inseguro),
          "approved": (boolean, true si score > 0.7),
          "reason": (string breve explicando la decisión en español)
        }
      `;
    } else {
      prompt = `
        Evalúa la siguiente respuesta generada por un chatbot para un usuario.
        La respuesta debe ser: Segura, Profesional, No ofensiva, y no debe alucinar hechos peligrosos.
        
        Respuesta: "${text}"
        
        Devuelve un JSON con este formato exacto:
        {
          "score": (número entre 0 y 1),
          "approved": (boolean, true si score > 0.8),
          "reason": (string breve explicando la decisión en español)
        }
      `;
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const responseText = result.response.text();
    const evaluation = JSON.parse(responseText);

    return NextResponse.json(evaluation);

  } catch (error) {
    console.error("Guardrail Error:", error);
    // Fail safe: if error, allow but log (or block depending on policy)
    // Here we block to show the guardrail is working if API key fails
    return NextResponse.json({ 
      score: 0, 
      approved: false, 
      reason: "Error en el sistema de seguridad. Intenta de nuevo." 
    }, { status: 500 });
  }
}

