/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "../../routes/routes";
import { authRule } from "../../rules/authRules";
import { NavLink, Link, useNavigate } from "react-router";
import { LoginFormInterface } from "../../interfaces/authInterface";
import { authorizationStore } from "../../store/authenticationStore";
import { toast } from "sonner";
import { handleAttemptLoginOnRegister } from "../../libs/services";
import db_store from "../../db_store";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const router = ROUTES;
  const { setUser, setSession } = authorizationStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInterface>({
    resolver: zodResolver(authRule),
  });

  const authLogin = async (dataLogin: LoginFormInterface) => {
    setIsLoading(true);

    try {
      const res = await handleAttemptLoginOnRegister(dataLogin);
      if (res.status === 200) {
        toast.success(`Bienvenido de nuevo ${res.data.user.username}!!`);
        setUser(res.data.user);
        setSession(res.data.token);
        window.location.replace("/");
      } else if (res.status === 400) {
        toast.error(res.data.message);
      } else if (res.status === 404) {
        toast.error("Usuario no encontrado");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      toast.error(
        "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>Inicia sesión | {db_store.name}</title>
      <div className="grid gap-5 w-full max-w-lg">
        <div className="place-content-start w-full">
          <h3 className="text-3xl font-bold">Bienvenido de nuevo</h3>
        </div>
        <form onSubmit={handleSubmit(authLogin)}>
          <div className="flex flex-col flex-wrap gap-5 relative">
            <Input
              isClearable
              label="Correo electrónico"
              type="text"
              size="sm"
              {...register("email", { required: true })}
              errorMessage={errors?.email?.message?.toString()}
              isInvalid={!!errors?.email}
            />
            <Input
              size="sm"
              fullWidth
              {...register("password", { required: true })}
              errorMessage={errors?.password?.message?.toString()}
              isInvalid={!!errors?.password}
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaRegEye size={20} />
                  ) : (
                    <FaRegEyeSlash size={20} />
                  )}
                </button>
              }
              label="Contraseña"
              type={showPassword ? "text" : "password"}
            />
            <div className="flex justify-between items-center text-xs">
              <div>
                <NavLink
                  to={`/${router.AUTH}/${router.FORGOT_PASSWORD}`}
                  className="text-blue-500 text-sm"
                  end
                >
                  Olvidé mi contraseña
                </NavLink>
              </div>
            </div>
            <div>
              <Button
                className="text-white font-medium bg-store"
                fullWidth
                isLoading={isLoading}
                type="submit"
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
        </form>
        <span className="h-[0.2px] bg-quanto/50"></span>
        <div className="flex justify-center items-center text-xs flex-col">
          <div>
            <Link to={`/${router.AUTH}/${router.REGISTER}`} className="text-sm">
              No tienes una cuenta?{" "}
              <span className="text-blue-500">Regístrate ahora</span>
            </Link>
          </div>
          <Button
            isIconOnly
            color="danger"
            size="lg"
            className="mt-10"
            onPress={() => navigate("/")}
          >
            <IoMdArrowRoundBack size={25} />
          </Button>
        </div>
      </div>
    </>
  );
}
