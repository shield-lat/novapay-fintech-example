"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ArrowUpRight, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import Chatbot from "@/components/Chatbot";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X /> : <Menu />}
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NovaPay
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-500">{session.user.role}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Bienvenido, {session.user.name?.split(' ')[0]}
          </h2>
          <p className="text-gray-600 mt-1">
            {session.user.companyName} • {session.user.role}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Saldo Total</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">$284,500</p>
            <p className="text-sm text-green-600 mt-2">+12.5% este mes</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Por Cobrar</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">$156,200</p>
            <p className="text-sm text-gray-600 mt-2">15 facturas pendientes</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Inversiones Activas</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">$45,000</p>
            <p className="text-sm text-gray-600 mt-2">3.8% rendimiento anual</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Panel de Control
          </h3>
          <p className="text-gray-600 mb-6">
            Accede a todas las funcionalidades de NovaPay desde aquí. Usa el asistente de IA para consultas rápidas.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
              <h4 className="font-medium text-gray-900">Transacciones</h4>
              <p className="text-sm text-gray-600 mt-1">Ver historial completo</p>
            </button>
            <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
              <h4 className="font-medium text-gray-900">Proyecciones</h4>
              <p className="text-sm text-gray-600 mt-1">Flujo de caja futuro</p>
            </button>
            <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
              <h4 className="font-medium text-gray-900">Reportes</h4>
              <p className="text-sm text-gray-600 mt-1">Análisis financiero</p>
            </button>
            <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
              <h4 className="font-medium text-gray-900">Configuración</h4>
              <p className="text-sm text-gray-600 mt-1">Ajustes de cuenta</p>
            </button>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}

