import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  useDisclosure,
  Accordion,
  AccordionItem,
  Listbox,
  ListboxItem,
} from "@heroui/react";

import { FaUser } from "react-icons/fa";
import { IoMdCreate } from "react-icons/io";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiFillProduct } from "react-icons/ai";
import { PiPackageFill } from "react-icons/pi";
import { FaChartPie } from "react-icons/fa6";
import { BiSolidBusiness } from "react-icons/bi";
import { RiCoinsFill } from "react-icons/ri";
import { FaHistory } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";
import { FaHourglassStart } from "react-icons/fa";
import { FaHourglassHalf } from "react-icons/fa";
import { FaHourglassEnd } from "react-icons/fa";
import { SiCrunchyroll } from "react-icons/si";
import { TbLogout2 } from "react-icons/tb";
import { RiFileExcel2Line } from "react-icons/ri";
import { LuPowerOff, LuPower } from "react-icons/lu";
import { useNavigate } from "react-router";

export default function App() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const navigate = useNavigate();

  const handleNavigate = (link: string) => {
    navigate(link);
    onClose();
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="left"
        radius="none"
        size="md"
        backdrop="transparent"
        className="sm:max-w-[350px]"
      >
        <DrawerContent>
          <>
            <DrawerHeader className="flex items-center gap-3">
              <Button isIconOnly onPress={() => handleNavigate("/")}>
                <TbLogout2 size={25} />
              </Button>
              <p className="text-xl font-bold">Panel de control</p>
            </DrawerHeader>
            <DrawerBody>
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button className="bg-[#FFE600] rounded-lg" onPress={() => window.open("https://www.mercadolibre.com.ve/pagina/nittostore")}>
                  <img src="/logo_ml.png" alt="logo" className="w-[100px] " />
                </Button>
                <Button className="bg-[#007139] rounded-lg font-semibold" onPress={() => window.open("https://docs.google.com/spreadsheets/d/1R7jV5BEVK_kp5sOl2XYcW6sLiE5dJbIqQoUjHXTzq5I/edit?usp=drivesdk")}>
                  <RiFileExcel2Line size={20} /> Nitto Sheets
                </Button>
              </div>
              <Accordion isCompact>
                {menuItems.map((item, index) => (
                  <AccordionItem
                    startContent={item?.icon}
                    key={index}
                    aria-label="item"
                    title={item?.section}
                    subtitle={item?.description}
                    isDisabled={item?.status === "disabled"}
                  >
                    <Listbox aria-label="listbox">
                      {item?.items?.map((item, index) => (
                        <ListboxItem
                          key={index + item?.name}
                          onPress={() => handleNavigate(item?.link)}
                          description={item?.description}
                          startContent={item?.icon}
                          color="danger"
                          variant="flat"
                          aria-label="item"
                        >
                          {item?.name}
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </AccordionItem>
                ))}
              </Accordion>
            </DrawerBody>
          </>
        </DrawerContent>
      </Drawer>
      <Button onPress={onOpen} isIconOnly className="bg-transparent">
        <RxHamburgerMenu className="text-gray-500" size={25} />
      </Button>
    </>
  );
}

const menuItems = [
  {
    section: "Resumen",
    description: "Gráficos y estadísticas",
    status: "enabled",
    icon: <FaChartPie />,
    items: [
      {
        name: "Resumen de la tienda",
        description: "Gráficos y estadísticas",
        icon: <FaChartLine />,
        link: "/dashboard",
      },
    ],
  },
  {
    section: "Usuarios",
    description: "Clientes y perfiles",
    status: "enabled",
    icon: <FaUser />,
    items: [
      {
        name: "Registrar un usuario",
        description: "Clientes nuevos",
        icon: <IoMdAddCircle />,
        link: "/add/user",
      },
      {
        name: "Usuarios registrados",
        description: "Listado con filtros",
        icon: <IoMdCreate />,
        link: "/view/user",
      },
    ],
  },
  {
    section: "Cuentas",
    description: "Servicios de streaming",
    icon: <FaUsers />,
    status: "enabled",
    items: [
      {
        name: "Registrar una cuenta",
        description: "Cuentas nuevas",
        icon: <IoMdAddCircle />,
        link: "/add/account",
      },
      {
        name: "Cuentas registradas",
        description: "Listado con filtros",
        icon: <IoMdCreate />,
        link: "/view/account",
      },
    ],
  },
  {
    section: "Suscripciones",
    description: "Servicios de streaming",
    icon: <SiCrunchyroll />,
    status: "enabled",
    items: [
      {
        name: "Nueva suscripción",
        description: "Asignación de cuentas",
        icon: <IoMdAddCircle />,
        link: "/add/subscription",
      },
      {
        name: "Suscripciones registradas",
        description: "Listado con filtros",
        icon: <IoMdCreate />,
        link: "/view/subscription",
      },
      {
        name: "Suscripciones activas",
        description: "Usuarios activos",
        icon: <LuPower />,
        link: "/view/subscription/?status=active",
      },
      {
        name: "Suscripciones inactivas",
        description: "Usuarios inactivos",
        icon: <LuPowerOff />,
        link: "/view/subscription/?status=inactive",
      },
    ],
  },
  {
    section: "Catalogo",
    description: "Productos e inventario",
    icon: <AiFillProduct />,
    items: [
      {
        name: "Registrar un producto",
        description: "Gestión de productos e inventario",
        icon: <IoMdAddCircle />,
        link: "/add/product",
      },
      {
        name: "Productos registrados",
        description: "Listado con filtros",
        icon: <IoMdCreate />,
        link: "/view/product",
      },
    ],
  },
  {
    section: "Pedidos",
    description: "Administración de compras online",
    icon: <PiPackageFill />,
    status: "disabled",
    items: [
      {
        name: "Pedidos nuevos",
        description: "Sin atender",
        icon: <FaHourglassStart />,
        link: "#",
      },
      {
        name: "Pedidos en proceso",
        description: "En curso",
        icon: <FaHourglassHalf />,
        link: "#",
      },
      {
        name: "Pedidos cerrados",
        description: "Finalizados",
        icon: <FaHourglassEnd />,
        link: "#",
      },
    ],
  },
  {
    section: "Finanzas",
    description: "Historial de movimientos",
    icon: <FaChartPie />,
    status: "disabled",
    items: [
      {
        name: "Registrar venta",
        description: "Gestión de ingresos",
        icon: <IoMdAddCircle />,
        link: "#",
      },
      {
        name: "Registrar factura",
        description: "Gestión de egresos",
        icon: <IoMdRemoveCircle />,
        link: "#",
      },
      {
        name: "Ventas registradas",
        description: "Listado con filtros",
        icon: <FaHistory />,
        link: "#",
      },
      {
        name: "Resumen de ventas",
        description: "Reporte de datos",
        icon: <FaChartLine />,
        link: "#",
      },
    ],
  },
  {
    section: "Configuración",
    description: "Administración general",
    icon: <MdOutlineMiscellaneousServices />,
    status: "enabled",
    items: [
      {
        name: "Nitto",
        description: "Contenido de la tienda",
        icon: <BiSolidBusiness />,
        link: "#",
      },
      {
        name: "Monedas",
        description: "Tasas y tipos de cambio",
        icon: <RiCoinsFill />,
        link: "#",
      },
      {
        name: "Servicios",
        description: "Módulo de configuración",
        icon: <IoMdCreate />,
        link: "/view/service",
      },
      {
        name: "Categorías de productos",
        description: "Módulo de configuración",
        icon: <IoMdCreate />,
        link: "/view/productCategory",
      },
      {
        name: "Preveedores",
        description: "Módulo de configuración",
        icon: <IoMdCreate />,
        link: "/view/provider",
      },
      {
        name: "Métodos de pago",
        description: "Módulo de configuración",
        icon: <IoMdCreate />,
        link: "#",
      },
    ],
  },
];
