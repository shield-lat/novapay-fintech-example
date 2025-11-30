"use client";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-900">NovaPay</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Producto
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
              Precios
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
              Nosotros
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link href="/login">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors">
                  Iniciar Sesión
                </button>
              </Link>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="#features"
              className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Producto
            </Link>
            <Link
              href="#pricing"
              className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Precios
            </Link>
            <Link
              href="#about"
              className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Nosotros
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-600 font-medium hover:bg-red-50 rounded-md"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link href="/login">
                <button 
                  className="w-full text-left px-3 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar Sesión
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
