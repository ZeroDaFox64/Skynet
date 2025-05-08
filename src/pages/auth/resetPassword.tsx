/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from "@heroui/react";
import { toast } from "sonner";
import { api } from "../../libs/api";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordRule } from "../../rules/authRules";
import { ResetPasswordInterface } from "../../interfaces/authInterface";
import { useNavigate, useParams } from "react-router";
import LogoLink from "../../components/ui/LogoLink";

import { MdOutlineAlternateEmail } from "react-icons/md";
import { BiMailSend } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInterface>({
    resolver: zodResolver(resetPasswordRule),
  });

  const sendEmail = async (data: ResetPasswordInterface) => {
    try {
      const res = await api.put("/authentication/reset-password", {
        password: data.password,
        token: token,
      });

      if (res.status === 200) {
        navigate("/authentication/login");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
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
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-5 h-screen">
        <div className="flex justify-start p-5">
          <LogoLink route="/" />
        </div>
        <div className="flex flex-col items-center justify-center gap-5 px-5">
          <MdOutlineAlternateEmail size={100} className="mb-3" />
          <div className="text-xl font-bold max-w-[400px] text-center">
            Ingresa tu nueva contraseña
          </div>
          <form
            onSubmit={handleSubmit(sendEmail)}
            className="flex flex-col gap-4 w-full max-w-lg"
          >
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
              {...register("confirm_password", { required: true })}
              errorMessage={errors?.confirm_password?.message?.toString()}
              isInvalid={!!errors?.confirm_password}
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
            <Button
              color={"primary"}
              type="submit"
              variant="bordered"
              className={`rounded-md font-semibold`}
            >
              <p>Cambiar contraseña</p> <BiMailSend size={20} />
            </Button>
          </form>
        </div>
        <footer className="w-full h-[60px] text-center font-semibold">
          All rights reserved © 2024 Nitto
        </footer>
      </div>
    </>
  );
}
