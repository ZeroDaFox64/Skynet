import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { socket } from "../landing/home";
import { authorizationStore } from "../../store/authenticationStore";
import axios from "axios";
import * as XLSX from 'xlsx';

interface User {
  id: string;
  username: string;
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
  const [itemToEdit, setItemToEdit] = useState<{ consumption: Consumption, quantity: number } | null>(null);
  const [itemToSplit, setItemToSplit] = useState<Consumption | null>(null);
  const [splitAmount, setSplitAmount] = useState<number>(0);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [tasaBcv, setTasaBcv] = useState<number>(36.5); // Fallback inicial

  const [username] = useState(() => {
    return user?.name || localStorage.getItem('guest_username') || `Invitado_${Math.floor(Math.random() * 1000)}`;
  });

  useEffect(() => {
    if (!user?.name) {
      localStorage.setItem('guest_username', username);
    }
  }, [username, user?.name]);

  const isHost = localStorage.getItem("is_host") === "true";

  // Obtener la tasa del BCV
  useEffect(() => {
    const fetchTasa = async () => {
      try {
        const res = await axios.get("https://ve.dolarapi.com/v1/dolares/oficial");
        if (res.data && res.data.promedio) {
          setTasaBcv(res.data.promedio);
        }
      } catch (error) {
        console.error("Error al obtener la tasa del BCV:", error);
      }
    };
    fetchTasa();
  }, []);

  // Obtener productos disponibles desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const res = await axios.get("http://localhost:4000/api/v1/product", { withCredentials: true });
        const data = res.data;
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
        isClosed
      });
    }

    // Escuchar el estado completo de la mesa (usuarios y consumos)
    socket.on("room_state_update", (state: RoomState) => {
      setRoomState(state);
      // Persistir toda la información de la mesa en localStorage
      localStorage.setItem(`mesa_state`, JSON.stringify(state));
    });

    return () => {
      socket.off("room_state_update");
    };
  }, [id, username]);

  const handleAbandonarMesa = () => {
    localStorage.removeItem("mesa_id");
    localStorage.removeItem(`mesa_state`);
    socket.disconnect();
    navigate("/");
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

  const handleUpdateQuantity = (consumoId: string, newQuantity: number) => {
    socket.emit("UPDATE_QUANTITY", { mesaId: id, consumoId, newQuantity });
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
    const wsData = [
      ["Usuario", "Producto", "Precio Unitario ($)", "Cantidad", "Total ($)", "Detalles de División"]
    ];

    roomState.consumptions.forEach(item => {
      const isShared = item.splits && item.splits.length > 0;
      let details = "N/A";
      const totalItemPrice = item.price * item.quantity;
      if (isShared) {
        const totalSplits = item.splits!.reduce((acc, split) => acc + split.amount, 0);
        const ownerAmount = totalItemPrice - totalSplits;
        details = `${item.username}: $${ownerAmount.toFixed(2)}, ` + item.splits!.map(s => `${s.username}: $${s.amount.toFixed(2)}`).join(', ');
      }

      wsData.push([
        item.username,
        item.name,
        item.price.toFixed(2),
        item.quantity.toString(),
        totalItemPrice.toFixed(2),
        details
      ]);
    });

    const totalMesa = roomState.consumptions.reduce((acc, c) => acc + (c.price * c.quantity), 0);
    wsData.push([]);
    wsData.push(["", "", "", "TOTAL GENERAL:", `$${totalMesa.toFixed(2)}`, ""]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Consumos");
    XLSX.writeFile(wb, `Reporte_Mesa_${id}.xlsx`);
  };

  // Extraer categorías únicas dinámicamente de los productos disponibles
  const categories = Array.from(new Set(products.map(p => p.product_category))).filter(Boolean);

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
  const totalUSD = roomState.consumptions.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  const totalVES = totalUSD * tasaBcv;

  const myTotalUSD = roomState.consumptions.reduce((sum, item) => {
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
  const myTotalVES = myTotalUSD * tasaBcv;

  return (
    <div className="flex flex-col min-h-screen bg-[#f9fafb] dark:bg-zinc-950 font-sans p-4 lg:p-8 transition-colors duration-300">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

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

            <div className="bg-gray-50 dark:bg-zinc-800/50 py-4 px-6 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 mt-4">
              <p className="text-sm text-gray-500 dark:text-zinc-400 font-bold mb-1">CÓDIGO DE INVITACIÓN</p>
              <p className="text-4xl font-black tracking-widest text-gray-900 dark:text-white">
                {id}
              </p>
            </div>
            <button
              onClick={handleAbandonarMesa}
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
                  <div className="w-10 h-10 rounded-full bg-[#da1f26]/10 text-[#da1f26] font-bold flex items-center justify-center">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-zinc-200">{u.username} {u.id === socket.id ? '(Tú)' : ''}</span>
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
                <div className="flex flex-col gap-3">
                  {roomState.consumptions.map((item, index) => {
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
                            <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Bs. {(item.price * item.quantity * tasaBcv).toFixed(2)}</p>
                          </div>

                          {/* Acciones de modificación permanentes y adaptadas para móviles */}
                          <div className="flex gap-2">
                            {canSplit && (
                              <button
                                onClick={() => {
                                  setItemToSplit(item);
                                  const totalItemPrice = item.price * item.quantity;
                                  const available = totalItemPrice - (item.splits?.reduce((a, s) => a + s.amount, 0) || 0);
                                  // Default to half the available, maxing at 50 if available is huge, or just available
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
                                  onClick={() => setItemToEdit({ consumption: item, quantity: item.quantity })}
                                  className="w-11 h-11 flex items-center justify-center bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 active:scale-95 transition-all"
                                  title="Editar Cantidad"
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
              )}
            </div>

            <div className="mt-auto pt-6 border-t-2 border-gray-100 dark:border-zinc-800 flex flex-col gap-4">
              <div className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-700/50">
                <p className="text-lg font-bold text-gray-500 dark:text-zinc-400">Total de la Mesa</p>
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-800 dark:text-zinc-200 leading-none">${totalUSD.toFixed(2)}</p>
                  <p className="text-sm font-bold text-gray-500 dark:text-zinc-400 mt-1">Bs. {totalVES.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex justify-between items-end px-2">
                <p className="text-xl font-bold text-gray-500 dark:text-zinc-400">Mi Cuenta</p>
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

      {/* Modal para Ajustar Cantidad */}
      {itemToEdit && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              ✏️
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Ajustar Cantidad</h3>
            <p className="text-gray-500 dark:text-zinc-400 mb-8 font-bold text-lg">
              {itemToEdit.consumption.name}
            </p>
            <div className="flex items-center justify-center gap-6 mb-8 bg-gray-50 dark:bg-zinc-800/50 py-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
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
            <div className="flex gap-4">
              <button
                onClick={() => setItemToEdit(null)}
                className="flex-1 py-3.5 font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleUpdateQuantity(itemToEdit.consumption.id, itemToEdit.quantity)}
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

    </div>
  );
}
