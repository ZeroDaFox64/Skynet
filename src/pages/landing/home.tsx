import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button, Input } from "@heroui/react";
import { FaPlus, FaUsers, FaHashtag, FaArrowRight } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";
import { authorizationStore } from "../../store/authenticationStore";

// Usar la URL configurada en VITE_API_URL (quitando el sufijo /api/v1)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
const SOCKET_URL = API_URL.endsWith('/api/v1') ? API_URL.slice(0, -7) : API_URL;

// Exportamos el socket por si otros componentes necesitan escucharlo directamente
export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false // Se conecta manualmente al unirse a una mesa
});

export default function Home() {
  const [view, setView] = useState<'options' | 'join'>('options');
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const { user } = authorizationStore();
  const username = user?.name || `Invitado_${Math.floor(Math.random() * 1000)}`;

  // 1. Persistencia Local (Recarga de página)
  useEffect(() => {
    const savedMesaId = localStorage.getItem("mesa_id");
    if (savedMesaId) {
      console.log("Restaurando sesión de mesa:", savedMesaId);
      socket.connect();
      socket.emit("join_mesa", { mesaId: savedMesaId, username });
      // navigate(`/mesa/${savedMesaId}`); 
    }
  }, [navigate, username]);

  const handleCreateMesa = () => {
    // Generar un ID único corto para la mesa (ej: 6 caracteres)
    const newMesaId = uuidv4().slice(0, 6).toUpperCase();
    
    // Guardar estado de pertenencia y rol localmente
    localStorage.setItem("mesa_id", newMesaId);
    localStorage.setItem("is_host", "true");
    
    // Conectar socket y unirse a la sala
    socket.connect();
    socket.emit("join_mesa", { mesaId: newMesaId, username });
    
    console.log(`Mesa creada con ID: ${newMesaId}`);
    // Redirigir al usuario a la vista de la mesa
    navigate(`/mesa/${newMesaId}`);
  };

  const handleJoinMesa = () => {
    if (!code.trim()) return;
    const joinCode = code.trim().toUpperCase();

    // Guardar estado de pertenencia y rol localmente
    localStorage.setItem("mesa_id", joinCode);
    localStorage.setItem("is_host", "false");
    
    // Conectar socket y unirse a la sala existente
    socket.connect();
    socket.emit("join_mesa", { mesaId: joinCode, username });
    
    console.log(`Unido a mesa con código: ${joinCode}`);
    // Redirigir a la vista de la mesa
    navigate(`/mesa/${joinCode}`);
  };

  return (
    <div className="flex min-h-screen font-sans bg-[#f9fafb] dark:bg-zinc-950 transition-colors duration-300">
      {/* Left side: Image and Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden bg-[#da1f26] dark:bg-[#9c1319]">
        {/* Placeholder image from Unsplash (Fried Chicken) */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80')" }}
        ></div>
        
        {/* Red and Yellow Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#da1f26]/90 to-[#b3141b]/95 dark:from-[#9c1319]/90 dark:to-[#730d11]/95"></div>
        
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#fff200] via-transparent to-transparent"></div>

        {/* Brand Content */}
        <div className="relative z-10 text-center flex flex-col items-center p-12">
          <div className="relative mb-8 transform hover:scale-105 transition-transform duration-500">
            <h1 className="text-7xl xl:text-8xl font-black text-[#fff200] drop-shadow-2xl tracking-tighter" style={{ WebkitTextStroke: '2px #8a1318' }}>
              DORE'S
            </h1>
            <div className="absolute -top-10 -right-10 text-6xl transform rotate-12 drop-shadow-xl animate-bounce">🍗</div>
          </div>
          <p className="text-3xl font-bold text-white max-w-md drop-shadow-lg leading-tight mb-4">
            Gestión de Mesas.
          </p>
          <p className="text-xl font-medium text-white/90 max-w-sm drop-shadow-md leading-relaxed">
            Crea una nueva mesa para comenzar a tomar pedidos o únete a una existente.
          </p>
          
          <div className="mt-12 flex gap-3">
            <div className="w-12 h-2 bg-[#fff200] rounded-full opacity-100 shadow-[0_0_10px_rgba(255,242,0,0.5)]"></div>
            <div className="w-4 h-2 bg-white rounded-full opacity-40"></div>
            <div className="w-4 h-2 bg-white rounded-full opacity-40"></div>
          </div>
        </div>
      </div>

      {/* Right side: Options */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-6 sm:p-12 relative overflow-y-auto">
        {/* Mobile background */}
        <div className="absolute top-0 left-0 w-full h-64 bg-[#da1f26] dark:bg-[#9c1319] lg:hidden rounded-b-[3rem] shadow-lg"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 pt-4">
             <h1 className="text-5xl font-black text-[#fff200] drop-shadow-md tracking-tighter" style={{ WebkitTextStroke: '1.5px #8a1318' }}>
              DORE'S <span className="text-3xl">🍗</span>
            </h1>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(218,31,38,0.08)] dark:shadow-black/20 border border-gray-100 dark:border-zinc-800 min-h-[450px] transition-colors duration-300">
            <title>Inicio - Mesas</title>
            
            {view === 'options' && (
              <div className="w-full flex flex-col gap-8 transition-all duration-300">
                <div className="place-content-start w-full">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
                    ¿Qué deseas hacer?
                  </h3>
                  <p className="text-base text-gray-500 dark:text-zinc-400 mt-2 font-medium transition-colors duration-300">
                    Selecciona una opción para continuar.
                  </p>
                </div>

                <div className="flex flex-col gap-5 mt-2">
                  <button 
                    onClick={handleCreateMesa}
                    className="flex items-center p-6 border-2 border-gray-100 dark:border-zinc-800 rounded-2xl hover:border-[#da1f26] dark:hover:border-[#da1f26] hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all group relative overflow-hidden shadow-sm hover:shadow-md dark:shadow-none bg-white dark:bg-zinc-900"
                  >
                    <div className="w-16 h-16 bg-[#da1f26]/10 dark:bg-red-950/40 text-[#da1f26] dark:text-red-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <FaPlus size={28} />
                    </div>
                    <div className="ml-5 text-left">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#da1f26] dark:group-hover:text-red-400 transition-colors">Crear nueva mesa</h4>
                      <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 font-medium leading-tight">Inicia una nueva sesión para tomar los pedidos.</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setView('join')}
                    className="flex items-center p-6 border-2 border-gray-100 dark:border-zinc-800 rounded-2xl hover:border-gray-900 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all group relative overflow-hidden shadow-sm hover:shadow-md dark:shadow-none bg-white dark:bg-zinc-900"
                  >
                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <FaUsers size={28} />
                    </div>
                    <div className="ml-5 text-left">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-zinc-200 transition-colors">Unirme a una mesa</h4>
                      <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 font-medium leading-tight">Ingresa mediante un código de acceso existente.</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {view === 'join' && (
              <div className="w-full flex flex-col gap-6 transition-all duration-300">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-white -ml-2 -mt-2 transition-colors"
                  onPress={() => setView('options')}
                >
                  <IoMdArrowRoundBack size={24} />
                </Button>

                <div className="place-content-start w-full">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
                    Unirse a Mesa
                  </h3>
                  <p className="text-base text-gray-500 dark:text-zinc-400 mt-2 font-medium transition-colors duration-300">
                    Ingresa el código proporcionado por el creador de la mesa para sincronizarte.
                  </p>
                </div>

                <div className="flex flex-col gap-5 mt-4">
                  <Input
                    isClearable
                    label="Código de la Mesa"
                    variant="bordered"
                    type="text"
                    size="lg"
                    value={code}
                    onValueChange={setCode}
                    startContent={<FaHashtag className="text-gray-400 dark:text-zinc-500 mr-2" />}
                    classNames={{
                      inputWrapper: "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-gray-900 dark:hover:border-zinc-500 focus-within:!border-gray-900 dark:focus-within:!border-zinc-500 focus-within:!ring-2 focus-within:!ring-gray-900/20 dark:focus-within:!ring-zinc-500/20 transition-all rounded-2xl h-16 shadow-sm dark:shadow-none",
                      label: "text-gray-600 dark:text-zinc-400 font-bold",
                      input: "font-bold text-gray-900 dark:text-white text-xl uppercase tracking-widest"
                    }}
                  />

                  <Button
                    className={`text-white font-bold text-lg bg-gray-900 dark:bg-zinc-800 shadow-xl shadow-gray-900/20 dark:shadow-black/40 hover:-translate-y-0.5 hover:bg-black dark:hover:bg-zinc-700 active:translate-y-0 active:scale-95 transition-all w-full h-14 rounded-xl mt-4 ${!code.trim() ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : ''}`}
                    size="lg"
                    onClick={handleJoinMesa}
                    endContent={<FaArrowRight className="ml-2" />}
                    disabled={!code.trim()}
                  >
                    CONECTAR A LA MESA
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}