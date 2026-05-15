/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
//import { ROUTES } from "../../routes/routes";
import { authRule } from "../../rules/authRules";
import { useNavigate } from "react-router";
import { LoginFormInterface } from "../../interfaces/authInterface";
import { authorizationStore } from "../../store/authenticationStore";
import { toast } from "sonner";
import { handleAttemptLoginOnRegister } from "../../libs/services";

import { FaRegEye, FaRegEyeSlash, FaEnvelope, FaLock, FaUserShield } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  //const router = ROUTES;
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
        window.location.replace("/dashboard");
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
      <title>Portal de Administración - Dore's</title>
      <div className="w-full flex flex-col gap-6 relative transition-colors duration-300">
        <div className="flex flex-col items-center justify-center text-center w-full mb-2">
          <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 border border-gray-100 dark:border-zinc-700 shadow-sm transition-colors duration-300">
            <FaUserShield className="text-3xl text-[#da1f26] dark:text-red-500" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
            Acceso Administrativo
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2 font-medium max-w-[250px] transition-colors duration-300">
            Ingresa tus credenciales para acceder al panel de control.
          </p>
        </div>

        <form onSubmit={handleSubmit(authLogin)} className="w-full">
          <div className="flex flex-col gap-5 relative">
            <Input
              isClearable
              label="Correo Institucional"
              variant="bordered"
              type="text"
              size="lg"
              startContent={<FaEnvelope className="text-gray-400 dark:text-zinc-500 mr-2" />}
              {...register("email", { required: true })}
              errorMessage={errors?.email?.message?.toString()}
              isInvalid={!!errors?.email}
              classNames={{
                inputWrapper: "border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:border-[#da1f26] focus-within:!bg-white dark:focus-within:!bg-zinc-800 focus-within:!border-[#da1f26] focus-within:!ring-2 focus-within:!ring-[#da1f26]/20 transition-all rounded-xl h-14",
                label: "text-gray-600 dark:text-zinc-400 font-bold",
                input: "font-medium text-gray-800 dark:text-white"
              }}
            />
            <Input
              size="lg"
              variant="bordered"
              fullWidth
              startContent={<FaLock className="text-gray-400 dark:text-zinc-500 mr-2" />}
              {...register("password", { required: true })}
              errorMessage={errors?.password?.message?.toString()}
              isInvalid={!!errors?.password}
              classNames={{
                inputWrapper: "border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:border-[#da1f26] focus-within:!bg-white dark:focus-within:!bg-zinc-800 focus-within:!border-[#da1f26] focus-within:!ring-2 focus-within:!ring-[#da1f26]/20 transition-all rounded-xl h-14",
                label: "text-gray-600 dark:text-zinc-400 font-bold",
                input: "font-medium text-gray-800 dark:text-white"
              }}
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none text-gray-400 dark:text-zinc-500 hover:text-[#da1f26] dark:hover:text-red-400 transition-colors p-2"
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

            <div className="flex justify-between items-center w-full mt-1">
              <a href="#" className="text-sm font-bold text-[#da1f26] dark:text-red-400 hover:text-[#b3141b] dark:hover:text-red-300 transition-colors">
                ¿Olvidó su contraseña?
              </a>
            </div>

            <div className="mt-4">
              <Button
                className="text-white font-bold text-lg bg-gray-900 dark:bg-zinc-800 shadow-xl shadow-gray-900/20 dark:shadow-black/40 hover:-translate-y-0.5 hover:bg-black dark:hover:bg-zinc-700 active:translate-y-0 active:scale-95 transition-all w-full h-14 rounded-xl"
                size="lg"
                isLoading={isLoading}
                type="submit"
              >
                INGRESAR AL PANEL
              </Button>
            </div>
          </div>
        </form>

        <div className="flex items-center gap-4 py-4">
          <span className="h-[1px] flex-1 bg-gray-100 dark:bg-zinc-800 transition-colors duration-300"></span>
          <span className="text-xs text-gray-400 dark:text-zinc-600 font-bold uppercase tracking-widest transition-colors duration-300"><FaUserShield /></span>
          <span className="h-[1px] flex-1 bg-gray-100 dark:bg-zinc-800 transition-colors duration-300"></span>
        </div>

        <div className="flex justify-center items-center text-sm flex-col gap-6">
          <p className="text-gray-500 dark:text-zinc-400 font-medium text-center max-w-[280px] transition-colors duration-300">
            El acceso está restringido únicamente a personal autorizado de <span className="font-bold text-gray-700 dark:text-zinc-300 transition-colors duration-300">DORE'S</span>.
          </p>

          <Button
            variant="light"
            size="md"
            className="text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-white font-bold transition-colors group mt-2"
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
