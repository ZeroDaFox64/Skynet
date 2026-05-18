import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { socket } from "../landing/home";
import { authorizationStore } from "../../store/authenticationStore";
import { api } from "../../libs/api";
import * as XLSX from 'xlsx';
import ThemeSwitch from "../../components/ui/ThemeSwith";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  isHost?: boolean;
  avatar?: string;
}

interface Split {
  username: string;
  amount: number;
}

interface SplitRequest {
  id: string;
  consumoId: string;
  requesterUsername: string;
  ownerUsername: string;
  amount: number;
  consumptionName: string;
  totalPrice: number;
}

interface Consumption {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  username: string;
  note?: string;
  splits?: Split[];
}

interface RoomState {
  users: User[];
  consumptions: Consumption[];
  splitRequests?: SplitRequest[];
  isClosed?: boolean;
}

export default function MesaView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = authorizationStore();

  const [roomState, setRoomState] = useState<RoomState>(() => {
    const local = localStorage.getItem(`mesa_state`);
    return local ? JSON.parse(local) : { users: [], consumptions: [] };
  });
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<any | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Consumption | null>(null);
  const [itemToEdit, setItemToEdit] = useState<{ consumption: Consumption, quantity: number, note?: string } | null>(null);
  const [selectedNote, setSelectedNote] = useState<{ name: string, note: string } | null>(null);
  const [itemToSplit, setItemToSplit] = useState<Consumption | null>(null);
  const [splitAmount, setSplitAmount] = useState<number>(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showAbandonModal, setShowAbandonModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [tasaBcv, setTasaBcv] = useState<number>(510); // Fallback inicial
  const [copied, setCopied] = useState(false);

  const [username] = useState(() => {
    return localStorage.getItem('mesa_username') || user?.name || `Invitado_${Math.floor(Math.random() * 1000)}`;
  });

  const [avatarUrl] = useState(() => {
    return localStorage.getItem('mesa_avatar') || `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random().toString(36).substring(7)}`;
  });

  useEffect(() => {
    if (!user?.name) {
      localStorage.setItem('mesa_username', username);
    }
  }, [username, user?.name]);

  const isHost = localStorage.getItem("is_host") === "true";

  // Obtener la tasa del BCV
  useEffect(() => {
    const TasaEnv = import.meta.env.VITE_TASA_ENV || 510
    setTasaBcv(Number(TasaEnv));
  }, []);

  // Obtener productos disponibles desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const res = await api.get("/product/all");
        const data = res.data || res;
        // Dependiendo de si responde con { products: [...] } o { data: [...] } o el array directo
        const productList = data.products || data.data || (Array.isArray(data) ? data : []);
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();

      const localState = localStorage.getItem(`mesa_state`);
      const parsedState = localState ? JSON.parse(localState) : null;
      const localConsumptions = parsedState?.consumptions || [];
      const isClosed = parsedState?.isClosed || false;

      socket.emit("join_mesa", {
        mesaId: id,
        username,
        localConsumptions,
        isClosed,
        isHost,
        avatar: avatarUrl
      });
    }

    // Escuchar el estado completo de la mesa (usuarios y consumos)
    socket.on("room_state_update", (state: RoomState) => {
      setRoomState(state);
      // Persistir toda la información de la mesa en localStorage
      localStorage.setItem(`mesa_state`, JSON.stringify(state));
    });

    // Escuchar si la mesa fue eliminada por el host
    socket.on("mesa_destroyed", () => {
      if (!isHost) {
        toast.error("El host se ha desconectado y ha eliminado la mesa.");
      }
      localStorage.removeItem("mesa_id");
      localStorage.removeItem(`mesa_state`);
      socket.disconnect();
      navigate("/");
    });

    // Escuchar si hay un error al unirse (ej. mesa sin host)
    socket.on("join_error", (data) => {
      toast.error(data.message);
      localStorage.removeItem("mesa_id");
      localStorage.removeItem(`mesa_state`);
      socket.disconnect();
      navigate("/");
    });

    return () => {
      socket.off("room_state_update");
      socket.off("mesa_destroyed");
      socket.off("join_error");
    };
  }, [id, username, isHost, navigate]);

  const handleConfirmAbandonarMesa = () => {
    if (isHost) {
      socket.emit("DESTROY_MESA", { mesaId: id });
    }
    localStorage.removeItem("mesa_id");
    localStorage.removeItem(`mesa_state`);
    socket.disconnect();
    navigate("/");
  };

  const handleCopyCode = () => {
    if (id) {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddConsumption = () => {
    if (!selectedProduct || quantity < 1) return;

    // Comparar asegurando que ambos sean strings, ya que los IDs de la base de datos suelen ser números
    const product = products.find(p => String(p.id) === selectedProduct || String(p._id) === selectedProduct);

    if (!product) {
      console.error("Producto no encontrado. ID seleccionado:", selectedProduct);
      return;
    }

    const newItem = {
      productId: product.id || product._id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: quantity,
      username
    };

    // Emitir el evento de añadir ítem
    socket.emit("ADD_ITEM", { mesaId: id, item: newItem });

    // Resetear formulario y volver a categorías
    setSelectedProduct("");
    setQuantity(1);
    setSelectedCategory(null);
  };

  const handleDeleteConsumption = (consumoId: string) => {
    socket.emit("DELETE_ITEM", { mesaId: id, consumoId });
    setItemToDelete(null);
  };

  const handleUpdateItem = (consumoId: string, newQuantity: number, newNote?: string) => {
    socket.emit("UPDATE_ITEM", { mesaId: id, consumoId, newQuantity, newNote });
    setItemToEdit(null);
  };

  const handleRequestSplit = () => {
    if (itemToSplit && splitAmount > 0) {
      socket.emit("REQUEST_SPLIT", {
        mesaId: id,
        consumoId: itemToSplit.id,
        amount: splitAmount,
        requesterUsername: username
      });
      setItemToSplit(null);
      setSplitAmount(0);
    }
  };

  const handleRespondSplit = (requestId: string, accepted: boolean) => {
    socket.emit("RESPOND_SPLIT", { mesaId: id, requestId, accepted });
  };

  const exportToExcel = () => {
    // Función auxiliar para generar una "barra de progreso" de texto
    const generateProgressBar = (value: number, total: number) => {
      if (total === 0) return "";
      const percentage = (value / total) * 100;
      const filled = Math.round(percentage / 10);
      return "█".repeat(filled) + "░".repeat(10 - filled) + ` ${percentage.toFixed(0)}%`;
    };

    // 1. Preparar datos de Resumen por Usuario
    const userSummary = roomState.users.map(u => {
      const ownItems = roomState.consumptions.filter(c => c.username === u.username);
      const subtotalOwn = ownItems.reduce((acc, c) => acc + (c.price * c.quantity), 0);
      const othersPayingMe = ownItems.reduce((acc, c) => acc + (c.splits?.reduce((sAcc, s) => sAcc + s.amount, 0) || 0), 0);

      const iAmPayingOthersItems = roomState.consumptions.filter(c => c.username !== u.username);
      const iAmPayingOthersAmount = iAmPayingOthersItems.reduce((acc, c) => acc + (c.splits?.find(s => s.username === u.username)?.amount || 0), 0);

      const finalTotal = subtotalOwn - othersPayingMe + iAmPayingOthersAmount;

      // DESGLOSE DE CANTIDADES
      // Calculamos cuánto "consumió" proporcionalmente de cada producto
      const consumptionDetails: string[] = [];

      // Sus productos propios (menos lo que le quitaron)
      ownItems.forEach(c => {
        const itemTotalAmount = c.price * c.quantity;
        const itemSplitsAmount = c.splits?.reduce((acc, s) => acc + s.amount, 0) || 0;
        const myPortionAmount = itemTotalAmount - itemSplitsAmount;
        const myPortionQuantity = c.quantity * (myPortionAmount / itemTotalAmount);
        if (myPortionQuantity > 0) {
          consumptionDetails.push(`${myPortionQuantity.toFixed(2)}x ${c.name}`);
        }
      });

      // Lo que pagó de otros
      iAmPayingOthersItems.forEach(c => {
        const mySplit = c.splits?.find(s => s.username === u.username);
        if (mySplit) {
          const itemTotalAmount = c.price * c.quantity;
          const myPortionQuantity = c.quantity * (mySplit.amount / itemTotalAmount);
          consumptionDetails.push(`${myPortionQuantity.toFixed(2)}x ${c.name} (Comp)`);
        }
      });

      return {
        usuario: u.username,
        subtotalPropio: subtotalOwn,
        descuentoPorCompartir: othersPayingMe,
        deudaPorCompartir: iAmPayingOthersAmount,
        baseUSD: finalTotal,
        ivaUSD: finalTotal * 0.16,
        totalUSD: finalTotal * 1.16,
        totalVES: (finalTotal * 1.16) * tasaBcv,
        detalles: consumptionDetails.join(", ")
      };
    });

    // 2. Preparar datos de Resumen por Categoría
    const categorySummary: { [key: string]: number } = {};
    roomState.consumptions.forEach(c => {
      const fullProduct = products.find(p => p.name === c.name || p.id === c.productId);
      const cat = fullProduct?.product_category || "Otros";
      categorySummary[cat] = (categorySummary[cat] || 0) + (c.price * c.quantity);
    });

    // 3. Crear el libro y las hojas
    const wb = XLSX.utils.book_new();

    // --- HOJA 1: RESUMEN GENERAL ---
    const summaryData = [
      ["REPORTE DE CONSUMO - DORE'S"],
      [`Mesa: ${id}`, `Fecha: ${new Date().toLocaleDateString()}`],
      [],
      ["GRÁFICO DE DISTRIBUCIÓN POR PERSONA"],
      ["Usuario", "Total ($)", "Distribución Visual"],
    ];

    userSummary.forEach(s => {
      summaryData.push([
        s.usuario,
        s.totalUSD.toFixed(2),
        generateProgressBar(s.totalUSD, totalUSD)
      ]);
    });

    summaryData.push([]);
    summaryData.push(["RESUMEN DE PAGOS DETALLADO"]);
    summaryData.push(["Usuario", "Propio ($)", "Créditos ($)", "Debitos ($)", "Subtotal ($)", "IVA 16% ($)", "Total ($)", "Total (Bs.)", "Desglose de Productos Consumidos"]);
    userSummary.forEach(s => {
      summaryData.push([
        s.usuario,
        s.subtotalPropio.toFixed(2),
        s.descuentoPorCompartir.toFixed(2),
        s.deudaPorCompartir.toFixed(2),
        s.baseUSD.toFixed(2),
        s.ivaUSD.toFixed(2),
        s.totalUSD.toFixed(2),
        s.totalVES.toFixed(2),
        s.detalles
      ]);
    });

    summaryData.push([]);
    summaryData.push(["SUBTOTAL GENERAL:", "", "", "", `$${subtotalUSD.toFixed(2)}`]);
    summaryData.push(["IVA (16%):", "", "", "", "", `$${ivaUSD.toFixed(2)}`]);
    summaryData.push(["TOTAL GENERAL DE LA MESA:", "", "", "", "", "", `$${totalUSD.toFixed(2)}`, `Bs. ${totalVES.toFixed(2)}`]);

    summaryData.push([]);
    summaryData.push(["GRÁFICO DE CONSUMO POR CATEGORÍA"]);
    summaryData.push(["Categoría", "Monto ($)", "Distribución Visual"]);
    Object.entries(categorySummary).forEach(([cat, amount]) => {
      summaryData.push([cat, amount.toFixed(2), generateProgressBar(amount, totalUSD)]);
    });

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

    // Ajustar anchos de columna para que se vea bien
    wsSummary['!cols'] = [
      { wch: 20 }, // Usuario / Categoría
      { wch: 15 }, // Propio
      { wch: 15 }, // Créditos
      { wch: 15 }, // Debitos
      { wch: 15 }, // Subtotal
      { wch: 15 }, // IVA
      { wch: 15 }, // Total USD
      { wch: 15 }, // Total Bs
      { wch: 80 }  // Desglose (muy ancho)
    ];

    XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen y Gráficos");

    // --- HOJA 2: DETALLE DE CONSUMOS ---
    const detailData = [
      ["DETALLE COMPLETO DE CONSUMOS"],
      ["Usuario", "Producto", "Precio Unit Base ($)", "Cant", "Subtotal ($)", "IVA 16% ($)", "Total con IVA ($)", "Desglose de Pago"]
    ];

    roomState.consumptions.forEach(item => {
      const itemPriceTotal = item.price * item.quantity;
      const itemIva = itemPriceTotal * 0.16;
      const itemGrandTotal = itemPriceTotal + itemIva;
      let details = "Total pagado por el dueño";

      if (item.splits && item.splits.length > 0) {
        const totalSplits = item.splits!.reduce((acc, split) => acc + split.amount, 0);
        const ownerAmount = itemPriceTotal - totalSplits;
        details = `${item.username}: $${ownerAmount.toFixed(2)}, ` + item.splits!.map(s => `${s.username}: $${s.amount.toFixed(2)}`).join(', ');
      }

      detailData.push([
        item.username,
        item.name,
        item.price.toFixed(2),
        item.quantity.toString(),
        itemPriceTotal.toFixed(2),
        itemIva.toFixed(2),
        itemGrandTotal.toFixed(2),
        details
      ]);
    });

    const wsDetail = XLSX.utils.aoa_to_sheet(detailData);
    XLSX.utils.book_append_sheet(wb, wsDetail, "Detalle");

    // 4. Exportar
    XLSX.writeFile(wb, `Reporte_Mesa_${id}.xlsx`);
  };

  // Categorías fijas de la base de datos para que siempre aparezcan los botones
  const categories = ['bebida', 'hamburguesa', 'pollo', 'pizza', 'postre', 'otros'];

  const getCategoryEmoji = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'hamburguesa': return '🍔';
      case 'pollo': return '🍗';
      case 'bebida': return '🥤';
      case 'pizza': return '🍕';
      case 'postre': return '🍨';
      default: return '🍟';
    }
  };

  // Cálculos de total considerando la cantidad
  const subtotalUSD = roomState.consumptions.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  const ivaUSD = subtotalUSD * 0.16;
  const totalUSD = subtotalUSD + ivaUSD;
  const totalVES = totalUSD * tasaBcv;

  const mySubtotalUSD = roomState.consumptions.reduce((sum, item) => {
    const totalItemPrice = (item.price || 0) * (item.quantity || 1);

    if (item.username === username) {
      // Si el consumo es mío, pago el precio base menos lo que otros me están pagando
      const splitsPaidByOthers = item.splits?.reduce((acc, split) => acc + split.amount, 0) || 0;
      return sum + (totalItemPrice - splitsPaidByOthers);
    } else {
      // Si el consumo no es mío, solo pago la porción que solicité compartir
      const mySplit = item.splits?.find(s => s.username === username);
      return sum + (mySplit ? mySplit.amount : 0);
    }
  }, 0);
  const myIvaUSD = mySubtotalUSD * 0.16;
  const myTotalUSD = mySubtotalUSD + myIvaUSD;
  const myTotalVES = myTotalUSD * tasaBcv;

  return (
    <div className="flex flex-col min-h-screen bg-[#f9fafb] dark:bg-zinc-950 font-sans p-4 lg:p-8 transition-colors duration-300 relative">
      <div className="absolute top-4 right-4 z-[100] lg:top-8 lg:right-8">
        <ThemeSwitch />
      </div>
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 pt-12 lg:pt-0">

        {/* Columna Izquierda: Información y Usuarios */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-[2rem] shadow-sm text-center relative overflow-hidden">
            {roomState.isClosed && (
              <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
            )}
            <h1 className="text-3xl font-black text-[#da1f26] dark:text-[#f87171] mb-2 uppercase tracking-tight">
              Mesa Actual
            </h1>

            {isHost && !roomState.isClosed && (
              <button
                onClick={() => setShowCloseModal(true)}
                className="mt-2 text-sm font-bold bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/50 px-4 py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm"
              >
                Cerrar Mesa 🔒
              </button>
            )}

            <div className="bg-gray-50 dark:bg-zinc-800/50 py-4 px-6 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 mt-4 relative group">
              <p className="text-sm text-gray-500 dark:text-zinc-400 font-bold mb-1">CÓDIGO DE INVITACIÓN</p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-4xl font-black tracking-widest text-gray-900 dark:text-white">
                  {id}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleCopyCode}
                    className={`p-2 rounded-xl transition-all ${copied ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-300 dark:hover:bg-zinc-600'}`}
                    title="Copiar Código"
                  >
                    {copied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="p-2 rounded-xl transition-all bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-300 dark:hover:bg-zinc-600"
                    title="Compartir"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAbandonModal(true)}
              className="mt-6 bg-gray-900 dark:bg-zinc-800 text-white font-bold py-3 px-6 rounded-xl w-full hover:-translate-y-0.5 hover:bg-black dark:hover:bg-zinc-700 transition-all"
            >
              Abandonar Mesa
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-[2rem] shadow-sm flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              Usuarios Conectados ({roomState.users.length})
            </h3>
            <ul className="flex flex-col gap-3">
              {roomState.users.map((u, i) => (
                <li key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
                  {u.avatar ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-700">
                      <img src={u.avatar} alt={u.username} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#da1f26]/10 text-[#da1f26] font-bold flex items-center justify-center">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-semibold text-gray-800 dark:text-zinc-200">
                    {u.username} {u.id === socket.id ? '(Tú)' : ''}
                    {u.isHost && <span title="Host de la Mesa" className="ml-1 text-lg">👑</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Columna Central y Derecha: Consumos y Total */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">

          {roomState.isClosed && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-900/50 p-6 sm:p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm animate-in fade-in">
              <div>
                <h2 className="text-3xl font-black text-red-600 dark:text-red-400 mb-2">Mesa Cerrada 🔒</h2>
                <p className="text-red-700/80 dark:text-red-300/80 font-medium text-lg leading-tight">Esta mesa ha finalizado. Ya no se pueden realizar modificaciones.</p>
              </div>
              <button
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white font-black py-4 px-8 rounded-2xl flex items-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-95 whitespace-nowrap w-full sm:w-auto justify-center"
              >
                <span className="text-2xl">📊</span> Descargar Excel
              </button>
            </div>
          )}

          <div className={`bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-[2rem] shadow-sm transition-all ${roomState.isClosed ? 'opacity-60 pointer-events-none grayscale-[0.2]' : ''}`}>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Menú de Productos</h2>

            {isLoadingProducts ? (
              <div className="text-center py-8 text-gray-500 font-medium">Cargando menú...</div>
            ) : !selectedCategory ? (
              // Vista 1: Cuadrícula de Categorías
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as string)}
                    className="p-6 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 hover:bg-[#da1f26]/5 dark:hover:bg-red-950/20 border-2 border-gray-100 dark:border-zinc-700 hover:border-[#da1f26] dark:hover:border-[#da1f26] transition-all flex flex-col items-center justify-center text-center gap-3 group"
                  >
                    <span className="text-4xl group-hover:scale-110 transition-transform">{getCategoryEmoji(cat as string)}</span>
                    <span className="font-bold text-gray-900 dark:text-white capitalize">{cat as string}</span>
                  </button>
                ))}
              </div>
            ) : (
              // Vista 2: Productos de la categoría seleccionada
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-4 border-b border-gray-100 dark:border-zinc-800 pb-4">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedProduct("");
                      setQuantity(1);
                    }}
                    className="text-gray-500 hover:text-[#da1f26] font-bold flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-xl transition-colors"
                  >
                    ← Categorías
                  </button>
                  <h3 className="text-xl font-black capitalize text-gray-900 dark:text-white flex items-center gap-2">
                    {getCategoryEmoji(selectedCategory)} {selectedCategory}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
                  {products.filter(p => p.product_category === selectedCategory).map(p => (
                    <div
                      key={p.id || p._id}
                      className={`rounded-2xl border-2 transition-all flex flex-col overflow-hidden group ${selectedProduct === String(p.id || p._id)
                        ? 'border-[#da1f26] shadow-md transform scale-[1.02] bg-[#da1f26]/5 dark:bg-red-950/20'
                        : 'border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-gray-300 dark:hover:border-zinc-500'
                        }`}
                    >
                      <div
                        className="h-32 w-full bg-cover bg-center cursor-pointer border-b border-gray-100 dark:border-zinc-700"
                        style={{ backgroundImage: `url(${p.front_image || 'https://via.placeholder.com/300?text=Sin+Imagen'})` }}
                        onClick={() => setSelectedProduct(String(p.id || p._id))}
                      />
                      <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                        <div className="cursor-pointer" onClick={() => setSelectedProduct(String(p.id || p._id))}>
                          <p className="font-bold text-lg leading-tight text-gray-900 dark:text-white line-clamp-2">{p.name}</p>
                          <p className="text-[#da1f26] dark:text-red-400 font-black text-xl mt-1">${parseFloat(p.price).toFixed(2)}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailProduct(p);
                          }}
                          className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white border-2 border-gray-100 dark:border-zinc-700 hover:border-gray-900 dark:hover:border-white rounded-lg py-1.5 px-3 mt-1 w-max transition-colors"
                        >
                          Detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedProduct && (
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 pt-4 border-t border-gray-100 dark:border-zinc-800 animate-in fade-in">
                    <p className="font-bold text-gray-600 dark:text-zinc-300 w-full sm:w-auto">Cantidad:</p>
                    <div className="flex items-center gap-4 w-full sm:w-auto flex-1 justify-end">
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-24 border-2 border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white p-3 rounded-xl font-black text-center focus:border-[#da1f26] focus:outline-none transition-colors"
                        title="Cantidad"
                      />
                      <button
                        onClick={handleAddConsumption}
                        className="bg-[#da1f26] hover:bg-[#b3141b] text-white font-black py-3 px-8 rounded-xl shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all w-full sm:w-auto"
                      >
                        AÑADIR A LA CUENTA
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-[2rem] shadow-sm flex-1 flex flex-col">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Detalle de la Cuenta</h2>

            <div className="flex-1 overflow-y-auto max-h-[400px] mb-6 pr-2">
              {roomState.consumptions.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-zinc-500 italic font-medium">
                  Aún no hay consumos registrados en esta mesa.
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {/* Mis Consumos */}
                  {(() => {
                    const myItems = roomState.consumptions.filter(item =>
                      item.username === username || item.splits?.some(s => s.username === username)
                    );
                    if (myItems.length === 0) return null;
                    return (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black uppercase tracking-widest text-[#da1f26] bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">Mis Consumos</span>
                          <div className="h-[1px] flex-1 bg-gray-100 dark:bg-zinc-800"></div>
                        </div>
                        {myItems.map((item) => {
                          const canModify = !roomState.isClosed && (isHost || item.username === username);
                          const totalItemPrice = item.price * item.quantity;
                          const totalSplits = item.splits?.reduce((acc, split) => acc + split.amount, 0) || 0;
                          const canSplit = !roomState.isClosed && item.username !== username && totalSplits < totalItemPrice && (!item.splits || !item.splits.find(s => s.username === username));
                          const ownerAmount = totalItemPrice - totalSplits;
                          const isShared = item.splits && item.splits.length > 0;

                          return (
                            <div key={item.id} className={`flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl border gap-3 transition-colors ${isShared ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30' : 'bg-gray-50 dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-700/50'}`}>
                              <div className="flex-1">
                                <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                                  <span className={`px-2 py-0.5 rounded-md text-sm ${isShared ? 'bg-green-200 dark:bg-green-800' : 'bg-gray-200 dark:bg-zinc-700'}`}>{item.quantity}x</span>
                                  {item.name}
                                  {isShared && <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800" title="Consumo Compartido">🤝 Compartido</span>}
                                </p>
                                {isShared ? (
                                  <div className="mt-2 flex flex-col gap-1 border-l-2 border-green-300 dark:border-green-700 pl-3 py-1">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
                                      {item.username}: <span className="text-green-600 dark:text-green-400 font-bold">${ownerAmount.toFixed(2)}</span>
                                    </p>
                                    {item.splits!.map((split, i) => (
                                      <p key={i} className="text-sm text-gray-600 dark:text-zinc-400">
                                        {split.username}: <span className="text-green-600 dark:text-green-400 font-bold">${split.amount.toFixed(2)}</span>
                                      </p>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                                    Pedido por: <span className="font-semibold text-gray-700 dark:text-zinc-300">{item.username}</span>
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-gray-200 dark:border-zinc-700/50 pt-3 sm:pt-0">
                                <div className="text-left sm:text-right">
                                  <p className="font-black text-gray-900 dark:text-white text-xl leading-none mb-1">${(item.price * item.quantity).toFixed(2)}</p>
                                  <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">+ IVA: ${(item.price * item.quantity * 0.16).toFixed(2)}</p>
                                  <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Bs. {(item.price * item.quantity * 1.16 * tasaBcv).toFixed(2)}</p>
                                </div>

                                <div className="flex gap-2">
                                  {item.note && (
                                    <button
                                      onClick={() => setSelectedNote({ name: item.name, note: item.note! })}
                                      className="w-11 h-11 flex items-center justify-center bg-white dark:bg-zinc-800 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 active:scale-95 transition-all"
                                      title="Ver Nota"
                                    >
                                      <span className="text-xl">📝</span>
                                    </button>
                                  )}
                                  {canSplit && (
                                    <button
                                      onClick={() => {
                                        setItemToSplit(item);
                                        const totalItemPrice = item.price * item.quantity;
                                        const available = totalItemPrice - (item.splits?.reduce((a, s) => a + s.amount, 0) || 0);
                                        setSplitAmount(parseFloat((available / 2).toFixed(2)));
                                      }}
                                      className="w-11 h-11 flex items-center justify-center bg-white dark:bg-zinc-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 active:scale-95 transition-all"
                                      title="Pagar una parte"
                                    >
                                      <span className="text-xl">🤝</span>
                                    </button>
                                  )}
                                  {canModify && (
                                    <>
                                      <button
                                        onClick={() => setItemToEdit({ consumption: item, quantity: item.quantity, note: item.note })}
                                        className="w-11 h-11 flex items-center justify-center bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 active:scale-95 transition-all"
                                        title="Editar Pedido"
                                      >
                                        <span className="text-lg">✏️</span>
                                      </button>
                                      <button
                                        onClick={() => setItemToDelete(item)}
                                        className="w-11 h-11 flex items-center justify-center bg-white dark:bg-zinc-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 active:scale-95 transition-all"
                                        title="Eliminar Consumo"
                                      >
                                        <span className="text-lg">🗑️</span>
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Otros Consumos */}
                  {(() => {
                    const otherItems = roomState.consumptions.filter(item =>
                      item.username !== username && !item.splits?.some(s => s.username === username)
                    );
                    if (otherItems.length === 0) return null;
                    return (
                      <div className="flex flex-col gap-3 opacity-80">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-50 dark:bg-zinc-800 px-3 py-1 rounded-full">Consumos de la Mesa</span>
                          <div className="h-[1px] flex-1 bg-gray-100 dark:bg-zinc-800"></div>
                        </div>
                        {otherItems.map((item) => {
                          //const canModify = !roomState.isClosed && (isHost || item.username === username);
                          const totalItemPrice = item.price * item.quantity;
                          const totalSplits = item.splits?.reduce((acc, split) => acc + split.amount, 0) || 0;
                          const canSplit = !roomState.isClosed && item.username !== username && totalSplits < totalItemPrice && (!item.splits || !item.splits.find(s => s.username === username));
                          const ownerAmount = totalItemPrice - totalSplits;
                          const isShared = item.splits && item.splits.length > 0;

                          return (
                            <div key={item.id} className={`flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl border gap-3 transition-colors ${isShared ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30' : 'bg-gray-50 dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-700/50'}`}>
                              <div className="flex-1">
                                <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                                  <span className={`px-2 py-0.5 rounded-md text-sm ${isShared ? 'bg-green-200 dark:bg-green-800' : 'bg-gray-200 dark:bg-zinc-700'}`}>{item.quantity}x</span>
                                  {item.name}
                                  {isShared && <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800" title="Consumo Compartido">🤝 Compartido</span>}
                                </p>
                                {isShared ? (
                                  <div className="mt-2 flex flex-col gap-1 border-l-2 border-green-300 dark:border-green-700 pl-3 py-1">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
                                      {item.username}: <span className="text-green-600 dark:text-green-400 font-bold">${ownerAmount.toFixed(2)}</span>
                                    </p>
                                    {item.splits!.map((split, i) => (
                                      <p key={i} className="text-sm text-gray-600 dark:text-zinc-400">
                                        {split.username}: <span className="text-green-600 dark:text-green-400 font-bold">${split.amount.toFixed(2)}</span>
                                      </p>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                                    Pedido por: <span className="font-semibold text-gray-700 dark:text-zinc-300">{item.username}</span>
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-gray-200 dark:border-zinc-700/50 pt-3 sm:pt-0">
                                <div className="text-left sm:text-right">
                                  <p className="font-black text-gray-900 dark:text-white text-xl leading-none mb-1">${(item.price * item.quantity).toFixed(2)}</p>
                                  <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">+ IVA: ${(item.price * item.quantity * 0.16).toFixed(2)}</p>
                                  <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Bs. {(item.price * item.quantity * 1.16 * tasaBcv).toFixed(2)}</p>
                                </div>

                                <div className="flex gap-2">
                                  {item.note && (
                                    <button
                                      onClick={() => setSelectedNote({ name: item.name, note: item.note! })}
                                      className="w-11 h-11 flex items-center justify-center bg-white dark:bg-zinc-800 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 active:scale-95 transition-all"
                                      title="Ver Nota"
                                    >
                                      <span className="text-xl">📝</span>
                                    </button>
                                  )}
                                  {canSplit && (
                                    <button
                                      onClick={() => {
                                        setItemToSplit(item);
                                        const totalItemPrice = item.price * item.quantity;
                                        const available = totalItemPrice - (item.splits?.reduce((a, s) => a + s.amount, 0) || 0);
                                        setSplitAmount(parseFloat((available / 2).toFixed(2)));
                                      }}
                                      className="w-11 h-11 flex items-center justify-center bg-white dark:bg-zinc-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 active:scale-95 transition-all"
                                      title="Pagar una parte"
                                    >
                                      <span className="text-xl">🤝</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t-2 border-gray-100 dark:border-zinc-800 flex flex-col gap-4">
              <div className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-700/50">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-gray-500 dark:text-zinc-400">Subtotal Mesa: ${subtotalUSD.toFixed(2)}</p>
                  <p className="text-sm font-bold text-gray-400 dark:text-zinc-500">IVA (16%): ${ivaUSD.toFixed(2)}</p>
                  <p className="text-lg font-black text-gray-800 dark:text-zinc-200 mt-1">Total Mesa</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-800 dark:text-zinc-200 leading-none">${totalUSD.toFixed(2)}</p>
                  <p className="text-sm font-bold text-gray-500 dark:text-zinc-400 mt-1">Bs. {totalVES.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex justify-between items-end px-2 mt-2">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-gray-500 dark:text-zinc-400">Mi Subtotal: ${mySubtotalUSD.toFixed(2)}</p>
                  <p className="text-sm font-bold text-gray-400 dark:text-zinc-500">Mi IVA (16%): ${myIvaUSD.toFixed(2)}</p>
                  <p className="text-xl font-black text-[#da1f26] dark:text-[#f87171] mt-1">Mi Cuenta</p>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-black text-[#da1f26] dark:text-[#f87171] leading-none mb-2">${myTotalUSD.toFixed(2)}</p>
                  <p className="text-xl font-bold text-gray-600 dark:text-zinc-300">Bs. {myTotalVES.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modal de Detalles del Producto */}
      {detailProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setDetailProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black text-white rounded-full z-10 transition-colors"
              title="Cerrar"
            >
              ✕
            </button>
            <div
              className="h-64 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${detailProduct.front_image || 'https://via.placeholder.com/500?text=Sin+Imagen'})` }}
            />
            <div className="p-8">
              <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">{detailProduct.sku}</p>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 leading-tight">{detailProduct.name}</h2>
              <p className="text-[#da1f26] dark:text-red-400 font-black text-3xl mb-6">${parseFloat(detailProduct.price).toFixed(2)}</p>

              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Descripción del Producto:</h3>
              <p className="text-gray-600 dark:text-zinc-400 leading-relaxed text-sm bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
                {detailProduct.description || "No hay descripción disponible para este producto."}
              </p>

              <button
                onClick={() => {
                  setSelectedProduct(String(detailProduct.id || detailProduct._id));
                  setDetailProduct(null);
                }}
                className="w-full mt-8 bg-gray-900 dark:bg-zinc-800 text-white font-black py-4 rounded-xl hover:bg-black dark:hover:bg-zinc-700 transition-colors shadow-lg"
              >
                Elegir Producto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Eliminar Consumo */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              🗑️
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">¿Eliminar Consumo?</h3>
            <p className="text-gray-500 dark:text-zinc-400 mb-8 leading-relaxed">
              Estás a punto de eliminar <strong className="text-gray-800 dark:text-zinc-200">{itemToDelete.quantity}x {itemToDelete.name}</strong> pedido por <span className="font-bold">{itemToDelete.username}</span>. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-3.5 font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteConsumption(itemToDelete.id)}
                className="flex-1 py-3.5 font-bold text-white bg-[#da1f26] hover:bg-[#b3141b] rounded-xl shadow-lg transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Compartir Mesa */}
      {showShareModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              🔗
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Invita a tus amigos</h3>
            <p className="text-gray-500 dark:text-zinc-400 mb-6 leading-relaxed font-medium">
              Comparte este código o escanea el QR para unirte a la mesa:
            </p>
            
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="bg-white p-2 rounded-2xl shadow-sm mb-4 border border-gray-200">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent("https://japan-gallery.onrender.com")}`} 
                  alt="QR Code" 
                  className="w-40 h-40 rounded-xl"
                />
              </div>
              <p className="text-3xl font-black tracking-widest text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-800 py-2 px-6 rounded-2xl">
                {id}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`¡Únete a mi mesa en nuestro restaurante!\n\n🌐 Enlace: https://japan-gallery.onrender.com\n🔑 Código de Mesa: ${id}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 font-bold text-white bg-[#25D366] hover:bg-[#128C7E] rounded-xl shadow-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6 fill-current"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 413.2c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.1l-4.4-7.1c-18.9-30-28.8-64.5-28.8-101.2 0-103 83.8-186.8 186.8-186.8 54.7 0 106.2 21.3 144.9 60.1 38.7 38.7 60.1 90.2 60.1 144.9 0 102.9-83.8 186.8-186.7 186.8zm102.6-140.2c-5.6-2.8-33.3-16.5-38.4-18.4-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.4 18.4-17.7 22.2-3.3 3.7-6.5 4.2-12.1 1.4-5.6-2.8-23.7-8.8-45.2-28.1-16.6-14.9-27.8-33.4-31.1-39-3.3-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.6-6.5 8.4-9.8 2.8-3.3 3.7-5.6 5.6-9.3 1.9-3.7 .9-7-4-10-5.1-6-12.1-30.7-16.5-42-4.3-11.1-8.7-9.6-12.5-9.8-3.7-.2-8.3-.2-12.1-.2-4.6 0-12.1 1.7-18.4 8.6-6.3 6.9-24.2 23.7-24.2 57.7s24.7 66.8 28.1 71.4c3.3 4.6 48.6 74.2 117.8 104.1 16.5 7.1 29.3 11.4 39.3 14.6 16.6 5.3 31.7 4.5 43.6 2.7 13.4-2 41.2-16.8 46.9-33 5.6-16.2 5.6-30.1 4-33-1.6-3-6-4.6-11.6-7.4z"/></svg>
                Compartir por WhatsApp
              </a>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-3.5 font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Cerrar Mesa */}
      {showCloseModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              🔒
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">¿Cerrar Mesa?</h3>
            <p className="text-gray-500 dark:text-zinc-400 mb-8 leading-relaxed font-medium">
              Al cerrar la mesa, nadie podrá añadir, editar o dividir más consumos. Podrás descargar el reporte de pagos. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCloseModal(false)}
                className="flex-1 py-3.5 font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  socket.emit("CLOSE_MESA", { mesaId: id });
                  setShowCloseModal(false);
                }}
                className="flex-1 py-3.5 font-bold text-white bg-[#da1f26] hover:bg-[#b3141b] rounded-xl shadow-lg transition-colors"
              >
                Cerrar Mesa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Ver Nota */}
      {selectedNote && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
            <div className="w-20 h-20 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              📝
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Nota del Pedido</h3>
            <p className="text-gray-500 dark:text-zinc-400 mb-6 font-bold text-lg">
              {selectedNote.name}
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-2xl border border-yellow-100 dark:border-yellow-900/30 mb-6 text-left">
              <p className="text-gray-800 dark:text-zinc-200 italic font-medium">"{selectedNote.note}"</p>
            </div>
            <button
              onClick={() => setSelectedNote(null)}
              className="w-full py-3.5 font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal para Modificar Pedido */}
      {itemToEdit && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              ✏️
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Modificar Pedido</h3>
            <p className="text-gray-500 dark:text-zinc-400 mb-6 font-bold text-lg">
              {itemToEdit.consumption.name}
            </p>
            <div className="flex items-center justify-center gap-6 mb-4 bg-gray-50 dark:bg-zinc-800/50 py-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
              <button
                onClick={() => setItemToEdit(prev => prev && { ...prev, quantity: Math.max(1, prev.quantity - 1) })}
                className="w-14 h-14 bg-white dark:bg-zinc-700 text-3xl text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-600 shadow-sm border border-gray-200 dark:border-zinc-600 transition-colors"
              >
                -
              </button>
              <span className="text-4xl font-black w-12 text-gray-900 dark:text-white">{itemToEdit.quantity}</span>
              <button
                onClick={() => setItemToEdit(prev => prev && { ...prev, quantity: prev.quantity + 1 })}
                className="w-14 h-14 bg-white dark:bg-zinc-700 text-3xl text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-600 shadow-sm border border-gray-200 dark:border-zinc-600 transition-colors"
              >
                +
              </button>
            </div>
            
            <div className="mb-6">
              <textarea
                placeholder="Añadir una nota (ej. Sin cebolla, extra queso...)"
                value={itemToEdit.note || ""}
                onChange={(e) => setItemToEdit(prev => prev && { ...prev, note: e.target.value })}
                className="w-full border-2 border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none h-24"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setItemToEdit(null)}
                className="flex-1 py-3.5 font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleUpdateItem(itemToEdit.consumption.id, itemToEdit.quantity, itemToEdit.note)}
                className="flex-1 py-3.5 font-bold text-white bg-[#da1f26] hover:bg-[#b3141b] rounded-xl shadow-lg transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Solicitar Split */}
      {itemToSplit && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              🤝
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Dividir Pago</h3>
            <p className="text-gray-500 dark:text-zinc-400 mb-6 font-bold text-lg leading-tight">
              {itemToSplit.name}
            </p>

            <div className="mb-6 bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
              <p className="text-gray-600 dark:text-zinc-400 mb-4 font-semibold text-sm uppercase tracking-wide">¿Cuánto pagarás exactamente?</p>
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="font-black text-4xl text-gray-400">$</span>
                <input
                  type="number"
                  min="0.01" max={itemToSplit ? (itemToSplit.price * itemToSplit.quantity - (itemToSplit.splits?.reduce((acc, s) => acc + s.amount, 0) || 0)).toFixed(2) : 9999}
                  step="0.01"
                  value={splitAmount || ''}
                  onChange={(e) => {
                    let val = parseFloat(e.target.value);
                    const available = itemToSplit ? (itemToSplit.price * itemToSplit.quantity - (itemToSplit.splits?.reduce((acc, s) => acc + s.amount, 0) || 0)) : 0;
                    if (val > available) val = available;
                    if (val < 0) val = 0;
                    setSplitAmount(isNaN(val) ? 0 : val);
                  }}
                  className="w-32 bg-transparent text-4xl font-black text-green-600 border-b-2 border-gray-300 dark:border-zinc-700 focus:border-green-600 focus:outline-none text-center"
                />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Equivalente a Bs. {((splitAmount || 0) * tasaBcv).toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">Disponible: ${itemToSplit ? (itemToSplit.price * itemToSplit.quantity - (itemToSplit.splits?.reduce((acc, s) => acc + s.amount, 0) || 0)).toFixed(2) : '0.00'}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setItemToSplit(null)}
                className="flex-1 py-3.5 font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRequestSplit}
                className="flex-1 py-3.5 font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg transition-colors"
              >
                Enviar Solicitud
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificaciones de solicitudes de split (Solo para el dueño) */}
      <div className="fixed top-4 right-4 z-[150] flex flex-col gap-3">
                {roomState.splitRequests?.filter(r => r.ownerUsername === username).map(req => (
                  <div key={req.id} className="bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-700 w-80 animate-in slide-in-from-right">
                    <div className="flex items-center gap-3 mb-3 border-b border-gray-100 dark:border-zinc-700 pb-3">
                      <span className="text-2xl bg-yellow-100 p-2 rounded-full">🔔</span>
                      <h4 className="font-black text-gray-900 dark:text-white">Solicitud de Pago</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 leading-relaxed">
                      <strong className="text-gray-900 dark:text-zinc-200">{req.requesterUsername}</strong> quiere pagar <strong className="text-green-600 dark:text-green-400">${req.amount.toFixed(2)}</strong> de tu <strong>{req.consumptionName}</strong>.
                    </p>
                    <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-3 mb-4 text-center">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Monto a cubrir</p>
                      <p className="text-2xl font-black text-green-600 dark:text-green-500">${req.amount.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRespondSplit(req.id, false)}
                        className="flex-1 py-2 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200"
                      >
                        Rechazar
                      </button>
                      <button
                        onClick={() => handleRespondSplit(req.id, true)}
                        className="flex-1 py-2 font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm"
                      >
                        Aceptar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal de confirmación para Abandonar Mesa */}
              {showAbandonModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[200] p-4 animate-in fade-in">
                  <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] w-full max-w-md shadow-2xl border border-gray-100 dark:border-zinc-800 scale-100 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center shrink-0">
                        <span className="text-3xl">🚪</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Abandonar Mesa</h2>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Esta acción no se puede deshacer.</p>
                      </div>
                    </div>
                    <div className="mb-8">
                      {isHost ? (
                        <p className="text-gray-600 dark:text-zinc-300 font-medium leading-relaxed bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-300">
                          ⚠️ Eres el <strong>Host</strong> de esta mesa. Si abandonas la mesa, <strong className="font-black">SE ELIMINARÁN TODOS LOS REGISTROS</strong> y se desconectará al resto de los usuarios. ¿Estás absolutamente seguro de querer proceder?
                        </p>
                      ) : (
                        <p className="text-gray-600 dark:text-zinc-300 font-medium leading-relaxed">
                          ¿Estás seguro de que deseas abandonar la mesa? Tus registros de consumo permanecerán en la cuenta, pero dejarás de ver las actualizaciones en tiempo real.
                        </p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowAbandonModal(false)}
                        className="flex-1 py-3.5 font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleConfirmAbandonarMesa}
                        className="flex-1 py-3.5 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/30 transition-colors"
                      >
                        Sí, Abandonar
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
            );
}
