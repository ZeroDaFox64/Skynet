import AdminDrawer from "./adminDrawer";
import ThemeSwitch from "../ui/ThemeSwith";

export default function AdminHeader() {
  return (
    <header className="w-full bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-black/20 sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo y Badge */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <img src="/image-removebg-preview.png" alt="Logo" className="h-14" />
            <span className="hidden sm:block px-3 py-1 bg-red-50 dark:bg-red-900/30 text-[#da1f26] dark:text-red-400 text-[10px] font-black rounded-full border border-red-100 dark:border-red-900/50 uppercase tracking-widest transition-colors duration-300">
              Panel de Control
            </span>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-5">
            <ThemeSwitch />
            <div className="h-8 w-[2px] bg-gray-100 dark:bg-zinc-800 rounded-full mx-1 transition-colors duration-300"></div>
            <AdminDrawer />
          </div>
        </div>
      </div>
    </header>
  );
}
