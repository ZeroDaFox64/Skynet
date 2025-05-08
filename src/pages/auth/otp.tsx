/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputOtp } from "@heroui/react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { api } from "../../libs/api";
import { useState } from "react";
import { authorizationStore } from "../../store/authenticationStore";
import LogoLink from "../../components/ui/LogoLink";

import { GoShieldLock, GoShieldCheck } from "react-icons/go";

export default function App() {
  const [otp, setOtp] = useState(null);
  const [otpTimeout, setOtpTimeout] = useState(false);
  const { user, setUser } = authorizationStore();

  const navigate = useNavigate();

  const verifyed = async () => {
    if (user?.rol === "verified user") {
      toast.warning("Ya has verificado tu cuenta");
      return;
    }

    try {
      const res = await api.post("/authentication/verify-otp", {
        otp: otp,
        email: user?.email,
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        setUser(res.data.user);
        navigate("/");
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
    } finally {
      setOtp(null);
    }
  };

  const resendCode = async () => {
    if (user?.rol === "verified user") {
      toast.warning("Ya has verificado tu cuenta");
      return;
    }
    if (otpTimeout) return;
    try {
      const res = await api.post("authentication/send-otp", {
        email: user?.email,
      });
      if (res.status === 200) {
        setOtpTimeout(true);
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
    } finally {
      setOtp(null);
    }

    setTimeout(() => {
      setOtpTimeout(false);
    }, 60000);
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-5 h-screen">
        <div className="flex justify-start p-5">
          <LogoLink route="/" />
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          {user?.rol === "verified user" ? (
            <>
              <GoShieldCheck size={100} className="mb-3" />
              <p className="text-3xl font-bold max-w-[400px] text-center">
                Verificación exitosa
              </p>
              <p className="text-base text-default-500 text-center">
                Puedes ir a la{" "}
                <Link to="/" className="text-blue-500">
                  página de inicio
                </Link>
              </p>
            </>
          ) : (
            <>
              <GoShieldLock size={100} className="mb-3" />
              <div className="text-xl font-bold max-w-[400px] text-center">
                Ingresa el código de verificación que enviamos a tu correo
              </div>
              <InputOtp
                length={6}
                size="lg"
                autoFocus
                onChange={(e: any) => setOtp(e.target.value)}
                onComplete={verifyed}
              />
              {otpTimeout ? (
                <div className="text-center text-default-500">
                  <span className="text-sm">
                    Código enviado, espera un minuto para reenviar un código
                    nuevamente
                  </span>
                </div>
              ) : (
                <p className="text-base text-default-500">
                  No has recibido el código?{" "}
                  <span
                    className={`text-blue-500 cursor-pointer`}
                    onClick={resendCode}
                  >
                    Reenviar código
                  </span>
                </p>
              )}
            </>
          )}
        </div>
        <footer className="w-full h-[60px] text-center font-semibold">
          All rights reserved © 2024 Nitto
        </footer>
      </div>
    </>
  );
}
