import { authorizationStore } from "../../store/authenticationStore";
import { FaUserShield, FaUsers, FaBuilding, FaBoxOpen } from "react-icons/fa6";
import AdminHeader from "./adminHeader";

export default function Dashboard() {
  // Obtenemos al usuario para darle una bienvenida personalizada
  const { user } = authorizationStore();
  const adminName = user?.username || "Administrador";

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-zinc-950 font-sans transition-colors duration-300">
      {/* Barra de navegación superior */}
      <AdminHeader />

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Banner de Bienvenida */}
        <div className="relative bg-gradient-to-br from-[#da1f26] to-[#b3141b] dark:from-[#9c1319] dark:to-[#730d11] rounded-[2.5rem] p-8 sm:p-14 overflow-hidden shadow-2xl shadow-red-900/15 dark:shadow-red-900/30 mb-10 transition-colors duration-300">
          {/* Elementos decorativos de fondo */}
          <div className="absolute top-0 right-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#fff200] via-transparent to-transparent"></div>
          <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-[#fff200] opacity-10 blur-[100px]"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                  <FaUserShield className="text-[#fff200] text-2xl" />
                </div>
                <h2 className="text-xl font-bold text-white/90 tracking-wide uppercase text-sm">Acceso Autorizado</h2>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4">
                ¡Hola de nuevo, <br className="hidden sm:block" />
                <span className="text-[#fff200]">{adminName}</span>! 👋
              </h1>
              <p className="text-lg sm:text-xl text-white/80 font-medium max-w-2xl leading-relaxed">
                Bienvenido a la Plataforma de Gestión de Consumo y Trazabilidad Financiera.
              </p>
            </div>

            <div className="hidden lg:flex items-center justify-center mr-10">
              <div className="text-[10rem] opacity-20 transform rotate-12 filter drop-shadow-2xl animate-pulse">📊</div>
            </div>
          </div>
        </div>

        {/* Tarjetas de Accesos Rápidos (CRUDs actuales) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-sm dark:shadow-none border border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-red-900/5 dark:hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 text-[#da1f26] dark:text-red-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#da1f26] group-hover:text-white dark:group-hover:bg-red-600 transition-colors">
              <FaUsers size={28} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Gestión de Usuarios</h3>
            <p className="text-gray-500 dark:text-zinc-400 font-medium text-sm mt-2 leading-relaxed transition-colors duration-300">Administra el personal, comensales y controla los roles y permisos de acceso al sistema.</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-sm dark:shadow-none border border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-red-900/5 dark:hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 text-[#da1f26] dark:text-red-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#da1f26] group-hover:text-white dark:group-hover:bg-red-600 transition-colors">
              <FaBuilding size={28} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Gestión de Compañía</h3>
            <p className="text-gray-500 dark:text-zinc-400 font-medium text-sm mt-2 leading-relaxed transition-colors duration-300">Configura los detalles de la empresa, sucursales y parámetros generales de la plataforma.</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-sm dark:shadow-none border border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-red-900/5 dark:hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 text-[#da1f26] dark:text-red-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#da1f26] group-hover:text-white dark:group-hover:bg-red-600 transition-colors">
              <FaBoxOpen size={28} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Catálogo de Productos</h3>
            <p className="text-gray-500 dark:text-zinc-400 font-medium text-sm mt-2 leading-relaxed transition-colors duration-300">Administra el inventario, categorías y precios base de los ítems disponibles para consumo.</p>
          </div>
        </div>

      </main>
    </div>
  )
}
