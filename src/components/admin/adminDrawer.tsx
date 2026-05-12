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

import { IoMdCreate, IoMdAddCircle } from "react-icons/io";
import { FaUsers, FaChartPie, FaChartLine } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiFillProduct } from "react-icons/ai";
import { BiSolidBusiness } from "react-icons/bi";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router";
import { authorizationStore } from "../../store/authenticationStore";

export default function App() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const navigate = useNavigate();

  // Obtenemos el usuario del store para validar su rol
  const { user } = authorizationStore();
  const isAdmin = user?.role === "admin" || user?.role === "ADMIN";

  const handleNavigate = (link: string) => {
    navigate(link);
    onClose();
  };

  // Filtramos los items del menú basado en el rol del usuario
  const filteredMenuItems = menuItems.filter(item => {
    if (item.section === "Compañía" && !isAdmin) {
      return false;
    }
    return true;
  });

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
        <DrawerContent className="bg-white dark:bg-zinc-950 text-gray-900 dark:text-white border-r border-gray-100 dark:border-zinc-800">
          <>
            <DrawerHeader className="flex items-center gap-4 border-b border-gray-100 dark:border-zinc-800 pb-4 pt-6 px-6">
              <Button isIconOnly variant="light" color="danger" onPress={() => handleNavigate("/login")} className="shrink-0 hover:bg-red-50 dark:hover:bg-red-950/30">
                <TbLogout2 size={24} className="text-[#da1f26] dark:text-red-500" />
              </Button>
              <div className="flex flex-col">
                <p className="text-2xl font-black text-[#da1f26] dark:text-red-500 uppercase tracking-widest leading-none">DORE'S</p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Panel Central</p>
              </div>
            </DrawerHeader>
            <DrawerBody className="pt-6 px-4">
              <Accordion isCompact variant="light">
                {filteredMenuItems.map((item, index) => (
                  <AccordionItem
                    startContent={<div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 text-[#da1f26] dark:text-red-400 flex items-center justify-center shrink-0">{item?.icon}</div>}
                    key={index}
                    aria-label="item"
                    title={<span className="font-bold text-gray-800 dark:text-zinc-200">{item?.section}</span>}
                    subtitle={<span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">{item?.description}</span>}
                    isDisabled={item?.status === "disabled"}
                    className="mb-2"
                  >
                    <Listbox aria-label="listbox" className="pl-2">
                      {item?.items?.map((subItem, idx) => (
                        <ListboxItem
                          key={idx + subItem?.name}
                          onPress={() => handleNavigate(subItem?.link)}
                          description={<span className="text-xs opacity-70">{subItem?.description}</span>}
                          startContent={<div className="text-gray-400 dark:text-zinc-500 shrink-0">{subItem?.icon}</div>}
                          color="danger"
                          variant="flat"
                          aria-label="item"
                          className="dark:text-zinc-300 py-3"
                        >
                          <span className="font-bold text-sm">{subItem?.name}</span>
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
      <Button onPress={onOpen} isIconOnly className="bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
        <RxHamburgerMenu className="text-gray-700 dark:text-zinc-300" size={24} />
      </Button>
    </>
  );
}

const menuItems = [
  {
    section: "Resumen",
    description: "Panel principal",
    status: "enabled",
    icon: <FaChartPie size={16} />,
    items: [
      {
        name: "Dashboard",
        description: "Métricas y accesos rápidos",
        icon: <FaChartLine size={18} />,
        link: "/dashboard",
      },
    ],
  },
  {
    section: "Usuarios",
    description: "Gestión de personal",
    status: "enabled",
    icon: <FaUsers size={16} />,
    items: [
      {
        name: "Registrar usuario",
        description: "Añadir nuevo miembro",
        icon: <IoMdAddCircle size={18} />,
        link: "/add/user",
      },
      {
        name: "Lista de usuarios",
        description: "Ver todos los registros",
        icon: <IoMdCreate size={18} />,
        link: "/view/user",
      },
    ],
  },
  {
    section: "Catálogo",
    description: "Productos e inventario",
    status: "enabled",
    icon: <AiFillProduct size={16} />,
    items: [
      {
        name: "Registrar producto",
        description: "Añadir al inventario",
        icon: <IoMdAddCircle size={18} />,
        link: "/add/product",
      },
      {
        name: "Lista de productos",
        description: "Ver todos los ítems",
        icon: <IoMdCreate size={18} />,
        link: "/view/product",
      },
    ],
  },
  {
    section: "Compañía",
    description: "Configuración global",
    status: "enabled",
    icon: <BiSolidBusiness size={16} />,
    items: [
      {
        name: "Registrar compañía",
        description: "Añadir nueva empresa",
        icon: <IoMdAddCircle size={18} />,
        link: "/add/company",
      },
      {
        name: "Datos de la empresa",
        description: "Información general",
        icon: <IoMdCreate size={18} />,
        link: "/view/company",
      },
    ],
  },
];
