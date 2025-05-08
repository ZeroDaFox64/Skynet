import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UserStoreInterface } from "../interfaces/userInterface";

interface AuthorizationState {
  otp: string | null;
  setOtp: (otp: string) => void;
  session: string | null;
  setSession: (session: string) => void;
  user: UserStoreInterface | null;
  setUser: (data : UserStoreInterface) => void;
  logout: () => void;
}

export const authorizationStore = create<AuthorizationState>()(
  persist(
    (set) => ({
      otp: null,
      setOtp: (otp: string) => set({ otp }),
      session: null,
      setSession: (session: string) => set({ session }),
      user: null,
      setUser: (data : UserStoreInterface) => set({ user: data }),
      logout: () => set({ otp: null, session: null, user: null }),
    }),
    {
      name: "authorizationStore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
