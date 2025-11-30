import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-2xl font-bold text-blue-900">NovaPay</span>
            <p className="mt-4 text-sm text-gray-500">
              Miami, FL <br />
              Scale-up Serie B
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Producto</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Características</Link></li>
              <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Integraciones</Link></li>
              <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Precios</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Compañía</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Nosotros</Link></li>
              <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Carreras</Link></li>
              <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Estadísticas</h3>
            <ul className="mt-4 space-y-4">
              <li className="text-base text-gray-500">15,000 PYMES Activas</li>
              <li className="text-base text-gray-500">$4.2B TPV Procesado</li>
              <li className="text-base text-gray-500">$65M ARR</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} NovaPay Solutions, Inc. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
