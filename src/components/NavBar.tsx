import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
} from "@heroui/react";
import ThemeSwitch from "./ui/ThemeSwith";
import DropMenu from "./utils/DropMenu";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { ROUTES } from "../routes/routes";
import { authorizationStore } from "../store/authenticationStore";
import { logout } from "../libs/services";
import db from "../db_store";
import { IoLogOut } from "react-icons/io5";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout: logoutStore } = authorizationStore();
  const navigate = useNavigate();

  return (
    <Navbar
      shouldHideOnScroll
      className="shadow-none z-40 bg-pink"
      maxWidth="full"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden mr-2"
        />
        <NavbarBrand>
          {/* <LogoLink route="/" /> */}
          <p className="font-bold text-2xl text-emerald-400">Gallery</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex items-center gap-3 mr-1">
          <ThemeSwitch />
        </NavbarItem>
        {db.backoffice && user ? (
          <DropMenu />
        ) : (
          <div className="hidden sm:flex gap-3">
            <Button
              radius="full"
              className="bg-emerald-600 text-white font-semibold"
              as={Link}
              to={`${ROUTES.AUTH}/${ROUTES.LOGIN}`}
            >
              Iniciar Sesión
            </Button>
            <Button
              radius="full"
              className="border-store border-2 text-store bg-transparent font-semibold"
              as={Link}
              to={`${ROUTES.AUTH}/${ROUTES.REGISTER}`}
            >
              Registrarse
            </Button>
          </div>
        )}
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem>
          <div className="w-full flex flex-col pt-10 gap-5 mb-16">
            <Link className="font-semibold text-xl w-fit" to="/">
              Inicio
            </Link>
            <Link className="font-semibold text-xl w-fit" to="/social-links">
              Redes y soporte
            </Link>
          </div>
          {db.backoffice && !user ? (
            <div className="flex flex-col items-center gap-2">
              <Button
                radius="full"
                size="lg"
                className="bg-store text-white font-semibold w-full max-w-[250px]"
                as={Link}
                to={`${ROUTES.AUTH}/${ROUTES.LOGIN}`}
              >
                Inicia sesión
              </Button>
              <span className=" text-gray-600">ó</span>
              <Button
                radius="full"
                size="lg"
                className="border-store border-2 text-store bg-transparent font-semibold w-full max-w-[250px]"
                as={Link}
                to={`${ROUTES.AUTH}/${ROUTES.REGISTER}`}
              >
                Regístrate
              </Button>
            </div>
          ) : (
            <Button
              radius="full"
              fullWidth
              className="bg-store text-white font-semibold"
              onPress={() => logout(navigate, logoutStore)}
            >
              Cerrar sesión <IoLogOut size={20} />
            </Button>
          )}
          <div className="flex flex-col items-center mt-16">
            <ThemeSwitch />
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
