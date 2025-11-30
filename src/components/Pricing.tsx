"use client";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Inicial",
    price: 299,
    description: "Perfecto para empresas en crecimiento que inician su automatización.",
    features: [
      "IA de Flujo de Caja (Predicción 30 días)",
      "Integración básica QuickBooks",
      "Soporte por Email",
      "Hasta $500k volumen anual",
    ],
  },
  {
    name: "Crecimiento",
    price: 599,
    description: "Automatización avanzada para empresas en expansión.",
    features: [
      "IA de Flujo de Caja (Predicción 60 días)",
      "Integración NetSuite & Xero",
      "Tesorería Autónoma (Rendimientos)",
      "Agente de Cobranza Generativa",
      "Hasta $5M volumen anual",
    ],
    mostPopular: true,
  },
  {
    name: "Empresarial",
    price: 999,
    description: "Todo el poder de NovaFlow para firmas establecidas.",
    features: [
      "IA de Flujo de Caja (Predicción 90 días)",
      "Integraciones ERP Personalizadas",
      "Gerente de Cuenta Dedicado",
      "Análisis de Riesgo Avanzado",
      "Volumen Ilimitado",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Precios Simples y Transparentes
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Elige el plan que se adapte a tu volumen de transacciones y complejidad.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col p-8 bg-gray-800 rounded-2xl border ${
                tier.mostPopular ? "border-blue-500 shadow-2xl shadow-blue-900/20" : "border-gray-700"
              }`}
            >
              {tier.mostPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </span>
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                <p className="mt-4 text-gray-400">{tier.description}</p>
                <div className="mt-6 flex items-baseline text-white">
                  <span className="text-5xl font-extrabold tracking-tight">${tier.price}</span>
                  <span className="ml-1 text-xl font-semibold text-gray-400">/mes</span>
                </div>
              </div>
              <ul className="flex-1 space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-green-400" aria-hidden="true" />
                    </div>
                    <p className="ml-3 text-base text-gray-300">{feature}</p>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-4 px-8 rounded-xl font-bold transition-colors ${
                  tier.mostPopular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                Elegir {tier.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
