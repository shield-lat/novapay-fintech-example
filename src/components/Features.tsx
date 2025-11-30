"use client";
import { LineChart, Wallet, Bot, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    name: "IA de Flujo de Caja",
    description:
      "IA generativa que lee facturas, contratos y correos para predecir déficits o superávits con 95% de precisión.",
    icon: LineChart,
  },
  {
    name: "Tesorería Autónoma",
    description:
      "Mueve automáticamente el efectivo excedente a fondos de inversión o ejecuta micro-créditos para déficits.",
    icon: Wallet,
  },
  {
    name: "Cobranza Generativa",
    description:
      "Agente de IA que redacta y envía recordatorios de pago, ajustando el tono según el historial de la relación.",
    icon: Bot,
  },
  {
    name: "Integración Inteligente",
    description:
      "Conectividad profunda con QuickBooks, Xero, NetSuite y los principales bancos vía Open Banking.",
    icon: Zap,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
            NovaFlow Core
          </h2>
          <p className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Capa de Inteligencia para tu Banco
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Deja de perder dinero por ineficiencias. NovaPay se conecta a tus cuentas existentes y optimiza cada dólar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="absolute top-6 left-6 bg-blue-600 rounded-lg p-3">
                <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="pt-16">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.name}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
