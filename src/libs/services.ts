/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoginFormInterface } from "../interfaces/authInterface";
import { toast } from "sonner";
import { api } from "./api";

export const handleAttemptLoginOnRegister = async (
  data: LoginFormInterface
) => {
  try {
    const res = await api.post("authentication/login", data);
    return res;
  } catch (error: any) {
    return error;
  }
};

export const logout = async (navigate: any, logoutStore: any) => {
    logoutStore();
    navigate("/");
};

export const getUser = async (setUser: any, session: string | null, logoutStore: any, navigate: any, user: any) => {
  if (session === null) {
    logoutStore();
    navigate("/");
    return;
  }
  
  const res = await api.get(`/user/${user.id}`, { headers: { Authorization: session } });
  try {
    if (res?.status === 200) return setUser(res?.data?.user);
    if (res?.status === 400 || res?.status === 401) {
      logoutStore();
      navigate("/");
      toast.warning(
        "Tu sesión ha expirado. Por favor, inicia sesión de nuevo."
      );
      return;
    }
  } catch (err: any) {
    logoutStore();
    navigate("/");
    toast.warning("Error al actualizar datos. " + err);
  }
};
