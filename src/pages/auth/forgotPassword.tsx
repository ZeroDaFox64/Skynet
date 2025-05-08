/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from "@heroui/react";
import { toast } from "sonner";
import { api } from "../../libs/api";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordRule } from "../../rules/authRules";
import { ForgotPasswordInterface } from "../../interfaces/authInterface";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import LogoLink from "../../components/ui/LogoLink"

import { MdOutlineAlternateEmail } from "react-icons/md";
import { BiMailSend } from "react-icons/bi";
import { FaCheck } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function App() {
  const [sendEmailTimeout, setSendEmailTimeout] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInterface>({
    resolver: zodResolver(forgotPasswordRule),
  });

  const timer = () => {
    setSendEmailTimeout(true);
    setTimeout(() => {
      setSendEmailTimeout(false);
    }, 60000);
  };

  const sendEmail = async (data: ForgotPasswordInterface) => {
    if (sendEmailTimeout) return;
    try {
      const res = await api.post("/authentication/send-reset-link", {
        email: data.email,
      });

      if (res.status === 200) {
        timer();
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
          <LogoLink route="/"/>
        </div>
        <div className="flex flex-col items-center justify-center gap-5 px-5">
          <MdOutlineAlternateEmail size={100} className="mb-3" />
          <div className="text-xl font-bold max-w-[400px] text-center">
            Ingresa el correo electrónico con el que te registraste
          </div>
          <form
            onSubmit={handleSubmit(sendEmail)}
            className="flex flex-col gap-4 w-full max-w-lg"
          >
            <Input
              autoFocus
              label="Correo electrónico"
              size="sm"
              isDisabled={sendEmailTimeout}
              {...register("email", { required: true })}
              errorMessage={errors?.email?.message?.toString()}
              isInvalid={!!errors?.email}
            />
            <Button
              color={sendEmailTimeout ? "default" : "primary"}
              type="submit"
              variant="bordered"
              className={`rounded-md font-semibold  ${
                sendEmailTimeout ? "cursor-not-allowed" : ""
              }`}
              isDisabled={sendEmailTimeout}
            >
              {sendEmailTimeout ? (
                <>
                  <p>Correo de recuperación enviado</p> <FaCheck size={20} />
                </>
              ) : (
                <>
                  <p>Recuperar contraseña</p> <BiMailSend size={20} />
                </>
              )}
            </Button>
          </form>
          <div className="flex justify-center items-center">
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
        <footer className="w-full h-[60px] text-center font-semibold">
          All rights reserved © 2024 Nitto
        </footer>
      </div>
    </>
  );
}
