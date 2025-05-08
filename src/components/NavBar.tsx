import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  Badge,
} from "@heroui/react";
import ThemeSwitch from "./ui/ThemeSwith";
import DropMenu from "./utils/DropMenu";
import LogoLink from "./ui/LogoLink";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { ROUTES } from "../routes/routes";
import { authorizationStore } from "../store/authenticationStore";
import { logout } from "../libs/services";
import db from "../db_store";

import { MdShoppingCart } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { toast } from "sonner";

const VerifiedLinks = [
  { name: "Mi Perfil", path: "/user/profile" },
  { name: "Suscripciones", path: "/user/subscriptions" },
];
const SuperAdminLinks = [{ name: "Panel de Control", path: "/dashboard" }];
const UnverifiedLinks = [
  { name: "Verificar Cuenta", path: "/authentication/otp" },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout: logoutStore } = authorizationStore();
  const navigate = useNavigate();

  return (
    <Navbar
      shouldHideOnScroll
      className="shadow-xl z-40 bg-pink"
      maxWidth="full"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden mr-2"
        />
        <NavbarBrand>
          <LogoLink route="/" />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-10" justify="center">
        <NavbarItem>
          <Link className="font-semibold text-store" to="/">
            Inicio
          </Link>
        </NavbarItem>
        <NavbarItem>
          <a className="font-semibold text-store" href="#catalog">
            Productos
          </a>
        </NavbarItem>
        <NavbarItem>
          <a className="font-semibold text-store" href="#banner">
            Promociones
          </a>
        </NavbarItem>
        <NavbarItem>
          <Link className="font-semibold text-store" to="/social-links">
            Redes y soporte
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex items-center gap-3 mr-1">
          <ThemeSwitch />
          <Badge color="danger" content="" shape="circle" size="md">
            <Button
              isIconOnly
              onPress={() => toast.info("Próximamente...")}
              size="sm"
              aria-label="notifications"
              radius="full"
              variant="light"
            >
              <MdShoppingCart size={27} />
            </Button>
          </Badge>
        </NavbarItem>
        {db.backoffice && user ? (
          <DropMenu />
        ) : (
          <div className="hidden sm:flex gap-3">
            <Button
              radius="full"
              className="bg-store text-white font-semibold"
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
            {db.backoffice && user && (
              <>
                {user?.rol === "verified user" || user?.rol === "superadmin" ? (
                  <>
                    {VerifiedLinks.map((item, index) => (
                      <Link
                        className="font-semibold text-xl w-fit"
                        to={item.path}
                        key={index}
                      >
                        {item.name}
                      </Link>
                    ))}
                    {user?.rol === "superadmin" && (
                      <>
                        {SuperAdminLinks.map((item, index) => (
                          <Link
                            className="font-semibold text-xl w-fit"
                            to={item.path}
                            key={index}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {UnverifiedLinks.map((item, index) => (
                      <Link
                        className="font-semibold text-xl w-fit"
                        to={item.path}
                        key={index}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </>
                )}
              </>
            )}
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
