/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, Input } from "@heroui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "../../routes/routes";
import { registerRule } from "../../rules/authRules";
import { Link, useNavigate } from "react-router";
import { RegisterFormInterface } from "../../interfaces/authInterface";
import { authorizationStore } from "../../store/authenticationStore";
import { toast } from "sonner";
import { handleAttemptLoginOnRegister } from "../../libs/services";
import db_store from "../../db_store";
import { api } from "../../libs/api";

import { IoMdArrowRoundBack } from "react-icons/io";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaLink } from "react-icons/fa6";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const navigate = useNavigate();

  const router = ROUTES;

  const { setUser, setOtp, setSession } = authorizationStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInterface>({
    resolver: zodResolver(registerRule),
  });

  const handleRegisterData = async (data: RegisterFormInterface) => {
    setIsLoading(true);

    try {
      const res = await api.post("user/register", data);
      
      if (res.status === 200) {
        toast.success("Usuario registrado correctamente");
        const token = await api.post("authentication/send-otp", { email: data.email });
        const resLogin = await handleAttemptLoginOnRegister({
          email: data.email,
          password: data.password,
        });
        setUser(resLogin.data.user);
        setSession(resLogin.data.token);
        setOtp(token.data.token);
        navigate("/home");
      }
    } catch (err: any) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) {
          toast.error(data.message);
        } else {
          toast.error(
            "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
          );
        }
      } else {
        toast.error(
          "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>Inicia sesión | {db_store.name}</title>
      <div className="grid gap-5 w-full max-w-lg">
        <div className="place-content-start w-full">
          <h3 className="text-3xl font-bold">¡Bienvenido!</h3>
        </div>
        <form onSubmit={handleSubmit(handleRegisterData)}>
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
              isClearable
              label="Nombre de usuario"
              type="text"
              size="sm"
              {...register("username", { required: true })}
              errorMessage={errors?.username?.message?.toString()}
              isInvalid={!!errors?.username}
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
            <Input
              size="sm"
              fullWidth
              {...register("password_confirmation", { required: true })}
              errorMessage={errors?.password_confirmation?.message?.toString()}
              isInvalid={!!errors?.password_confirmation}
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaRegEye size={20} />
                  ) : (
                    <FaRegEyeSlash size={20} />
                  )}
                </button>
              }
              label="Confirmar contraseña"
              type={showConfirmPassword ? "text" : "password"}
            />
            <div className="flex items-center text-xs">
              <Checkbox
                size="sm"
                isSelected={isSelected}
                onValueChange={setIsSelected}
              >
                Terminos y condiciones
              </Checkbox>
            </div>
            <div>
              <Button
                className={`text-white font-medium bg-emerald-400 ${
                  !isSelected ? "cursor-not-allowed" : ""
                }`}
                fullWidth
                isLoading={isLoading}
                type="submit"
                disabled={!isSelected}
              >
                Registrarse
              </Button>
            </div>
          </div>
        </form>
        <span className="h-[0.2px] bg-quanto/50"></span>
        <div className="flex justify-center items-center text-xs flex-col">
          <div>
            <Link to={`${router.LOGIN}`} className="text-sm">
              Ya tienes una cuenta?{" "}
              <span className="text-blue-500">Inicia sesión ahora</span>
            </Link>
          </div>
          <Button
            isIconOnly
            size="lg"
            className="mt-10 bg-emerald-400"
            onPress={() => navigate("/")}
          >
            <IoMdArrowRoundBack size={25} className="text-white"/>
          </Button>
        </div>
      </div>
    </>
  );
}
