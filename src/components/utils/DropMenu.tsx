import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { IoLogOut } from "react-icons/io5";
import { authorizationStore } from "../../store/authenticationStore";
import { logout, getUser } from "../../libs/services";

function DropMenu() {
  const { user, setUser, logout: logoutStore, session } = authorizationStore();
  const navigate = useNavigate();

  const VerifiedLinks = [
    { name: "Mi Perfil", path: "/profile" },
    { name: "Suscripciones", path: "/user/subscriptions" },
  ];
  const SuperAdminLinks = [{ name: "Panel de Control", path: "/dashboard" }];
  const UnverifiedLinks = [
    { name: "Verificar Cuenta", path: "/authentication/otp" },
  ];

  useEffect(() => {
    getUser(setUser, session, logoutStore, navigate, user);
  }, []);

  return (
    <>
      {user && (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              showFallback
              as="button"
              className="transition-transform"
              size="md"
              src={user?.avatar}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile_1" className="h-10">
              <p className="font-semibold">Bienvenid@ {user?.username}</p>
            </DropdownItem>
            {user?.rol === "verified user" || user?.rol === "superadmin" ? (
              <>
                {VerifiedLinks.map((item, index) => (
                  <DropdownItem key={index} onPress={() => navigate(item.path)}>
                    {item.name}
                  </DropdownItem>
                ))}
                {user?.rol === "superadmin" && (
                  <>
                    {SuperAdminLinks.map((item, index) => (
                      <DropdownItem
                        key={index}
                        onPress={() => navigate(item.path)}
                      >
                        {item.name}
                      </DropdownItem>
                    ))}
                  </>
                )}
              </>
            ) : (
              <>
                {UnverifiedLinks.map((item, index) => (
                  <DropdownItem key={index} onPress={() => navigate(item.path)}>
                    {item.name}
                  </DropdownItem>
                ))}
              </>
            )}
            <DropdownItem key="logout" color="danger" className="mt-2">
              <Button
                size="sm"
                fullWidth
                className="bg-store text-white font-semibold rounded-full"
                onPress={() => logout(navigate, logoutStore)}
              >
                Cerrar sesión <IoLogOut size={20} />
              </Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </>
  );
}

export default DropMenu;
