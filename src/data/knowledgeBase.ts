export const companyData = {
  name: "NovaPay Solutions",
  tagline: "Tu tesorería, en piloto automático",
  description: "NovaPay Solutions es una Fintech/Neobank Serie B enfocada en democratizar la gestión de tesorería para PYMES. Nuestra plataforma NovaFlow Core utiliza IA para automatizar flujos de caja, cobros y pagos.",
  products: [
    {
      name: "NovaFlow Core",
      features: [
        "Cash Flow AI: Predicción de flujo de caja con 95% de precisión a 30, 60 y 90 días.",
        "Autonomous Treasury: Mueve fondos automáticamente entre cuentas para optimizar rendimientos.",
        "Generative Collections: Redacta y envía correos de cobranza personalizados usando IA."
      ]
    }
  ],
  pricing: [
    {
      plan: "Inicial",
      price: "$299/mes",
      features: ["Predicción básica", "5 usuarios", "Soporte por email"]
    },
    {
      plan: "Crecimiento",
      price: "$599/mes",
      features: ["Tesorería Autónoma", "Usuarios ilimitados", "Soporte prioritario", "API Access"]
    },
    {
      plan: "Enterprise",
      price: "Personalizado",
      features: ["Soporte dedicado 24/7", "Integraciones custom", "SLA garantizado"]
    }
  ],
  stats: {
    clients: "15,000+ PYMES",
    tpv: "$4.2B procesados anualmente",
    security: "SOC2 Type II, Encriptación AES-256"
  },
  policies: {
    security: "No compartimos datos con terceros sin consentimiento. Usamos encriptación de grado bancario.",
    support: "El soporte está disponible Lunes a Viernes de 9am a 6pm EST.",
    refunds: "Garantía de devolución de 30 días en el primer mes."
  }
};

export const systemPrompt = `Eres Nova, el asistente de IA de NovaPay.
Usa el siguiente contexto para responder preguntas sobre la empresa.
Si la respuesta no está en el contexto, di amablemente que no tienes esa información y sugiere contactar a soporte.
Mantén un tono profesional, útil y seguro.

Contexto:
${JSON.stringify(companyData, null, 2)}
`;

