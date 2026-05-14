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
import { api } from "../../libs/api";

import { IoMdArrowRoundBack } from "react-icons/io";
import { FaRegEye, FaRegEyeSlash, FaEnvelope, FaLock, FaUserPlus, FaUser } from "react-icons/fa6";

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
        navigate("/login");
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
      <title>Registro Administrativo - Dore's</title>
      <div className="w-full flex flex-col gap-5 relative transition-colors duration-300">
        <div className="flex flex-col items-center justify-center text-center w-full mb-1">
          <div className="w-14 h-14 bg-gray-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-3 border border-gray-100 dark:border-zinc-700 shadow-sm transition-colors duration-300">
            <FaUserPlus className="text-2xl text-[#da1f26] dark:text-red-500" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
            Solicitud de Acceso
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 font-medium max-w-[280px] transition-colors duration-300">
            Completa el formulario para registrar una nueva cuenta de administrador.
          </p>
        </div>

        <form onSubmit={handleSubmit(handleRegisterData)} className="w-full">
          <div className="flex flex-col gap-4 relative">
            <Input
              isClearable
              label="Correo Institucional"
              variant="bordered"
              type="text"
              size="md"
              startContent={<FaEnvelope className="text-gray-400 dark:text-zinc-500 mr-2" />}
              {...register("email", { required: true })}
              errorMessage={errors?.email?.message?.toString()}
              isInvalid={!!errors?.email}
              classNames={{
                inputWrapper: "border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:border-[#da1f26] focus-within:!bg-white dark:focus-within:!bg-zinc-800 focus-within:!border-[#da1f26] focus-within:!ring-2 focus-within:!ring-[#da1f26]/20 transition-all rounded-xl",
                label: "text-gray-600 dark:text-zinc-400 font-bold text-xs",
                input: "font-medium text-gray-800 dark:text-white"
              }}
            />
            <Input
              isClearable
              label="Nombre de usuario"
              variant="bordered"
              type="text"
              size="md"
              startContent={<FaUser className="text-gray-400 dark:text-zinc-500 mr-2" />}
              {...register("name", { required: true })}
              errorMessage={errors?.name?.message?.toString()}
              isInvalid={!!errors?.name}
              classNames={{
                inputWrapper: "border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:border-[#da1f26] focus-within:!bg-white dark:focus-within:!bg-zinc-800 focus-within:!border-[#da1f26] focus-within:!ring-2 focus-within:!ring-[#da1f26]/20 transition-all rounded-xl",
                label: "text-gray-600 dark:text-zinc-400 font-bold text-xs",
                input: "font-medium text-gray-800 dark:text-white"
              }}
            />
            <Input
              size="md"
              variant="bordered"
              fullWidth
              startContent={<FaLock className="text-gray-400 dark:text-zinc-500 mr-2" />}
              {...register("password", { required: true })}
              errorMessage={errors?.password?.message?.toString()}
              isInvalid={!!errors?.password}
              classNames={{
                inputWrapper: "border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:border-[#da1f26] focus-within:!bg-white dark:focus-within:!bg-zinc-800 focus-within:!border-[#da1f26] focus-within:!ring-2 focus-within:!ring-[#da1f26]/20 transition-all rounded-xl",
                label: "text-gray-600 dark:text-zinc-400 font-bold text-xs",
                input: "font-medium text-gray-800 dark:text-white"
              }}
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none text-gray-400 dark:text-zinc-500 hover:text-[#da1f26] dark:hover:text-red-400 transition-colors p-1"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaRegEye size={18} />
                  ) : (
                    <FaRegEyeSlash size={18} />
                  )}
                </button>
              }
              label="Contraseña"
              type={showPassword ? "text" : "password"}
            />
            <Input
              size="md"
              variant="bordered"
              fullWidth
              startContent={<FaLock className="text-gray-400 dark:text-zinc-500 mr-2" />}
              {...register("password_confirmation", { required: true })}
              errorMessage={errors?.password_confirmation?.message?.toString()}
              isInvalid={!!errors?.password_confirmation}
              classNames={{
                inputWrapper: "border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:border-[#da1f26] focus-within:!bg-white dark:focus-within:!bg-zinc-800 focus-within:!border-[#da1f26] focus-within:!ring-2 focus-within:!ring-[#da1f26]/20 transition-all rounded-xl",
                label: "text-gray-600 dark:text-zinc-400 font-bold text-xs",
                input: "font-medium text-gray-800 dark:text-white"
              }}
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none text-gray-400 dark:text-zinc-500 hover:text-[#da1f26] dark:hover:text-red-400 transition-colors p-1"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaRegEye size={18} />
                  ) : (
                    <FaRegEyeSlash size={18} />
                  )}
                </button>
              }
              label="Confirmar contraseña"
              type={showConfirmPassword ? "text" : "password"}
            />

            <div className="flex items-center mt-1">
              <Checkbox
                size="sm"
                isSelected={isSelected}
                onValueChange={setIsSelected}
                classNames={{
                  wrapper: "before:border-[#da1f26] after:bg-[#da1f26]",
                  label: "text-xs text-gray-600 dark:text-zinc-400 font-medium transition-colors duration-300",
                }}
              >
                Acepto los <a href="#" className="text-[#da1f26] dark:text-red-400 font-bold hover:underline transition-colors">términos</a> y <a href="#" className="text-[#da1f26] dark:text-red-400 font-bold hover:underline transition-colors">políticas de uso interno</a>
              </Checkbox>
            </div>

            <div className="mt-2">
              <Button
                className={`text-white font-bold text-lg bg-gray-900 dark:bg-zinc-800 shadow-xl shadow-gray-900/20 dark:shadow-black/40 hover:-translate-y-0.5 hover:bg-black dark:hover:bg-zinc-700 active:translate-y-0 active:scale-95 transition-all w-full h-12 rounded-xl ${!isSelected ? "opacity-70 cursor-not-allowed hover:translate-y-0 hover:bg-gray-900 dark:hover:bg-zinc-800 shadow-none" : ""
                  }`}
                size="lg"
                isLoading={isLoading}
                type="submit"
                disabled={!isSelected}
              >
                ENVIAR SOLICITUD
              </Button>
            </div>
          </div>
        </form>

        <div className="flex items-center gap-4 py-2">
          <span className="h-[1px] flex-1 bg-gray-100 dark:bg-zinc-800 transition-colors duration-300"></span>
          <span className="text-xs text-gray-400 dark:text-zinc-600 font-bold uppercase tracking-widest transition-colors duration-300"><FaUserPlus /></span>
          <span className="h-[1px] flex-1 bg-gray-100 dark:bg-zinc-800 transition-colors duration-300"></span>
        </div>

        <div className="flex justify-center items-center text-sm flex-col gap-4">
          <div className="text-gray-500 dark:text-zinc-400 font-medium transition-colors duration-300">
            ¿Ya tienes acceso?{" "}
            <Link to={`/${router.LOGIN}`} className="text-[#da1f26] dark:text-red-400 font-black hover:text-[#b3141b] dark:hover:text-red-300 transition-colors">
              Inicia sesión aquí
            </Link>
          </div>
          <Button
            variant="light"
            size="md"
            className="text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-white font-bold transition-colors group mt-1"
            onPress={() => navigate("/")}
            startContent={<IoMdArrowRoundBack size={18} className="group-hover:-translate-x-1 transition-transform" />}
          >
            Regresar al inicio
          </Button>
        </div>
      </div>
    </>
  );
}
