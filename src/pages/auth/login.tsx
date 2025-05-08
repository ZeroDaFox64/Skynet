import LoginForm from "./loginForm";
import { Image } from "@heroui/react";

export default function App() {
  return (
    <div className="flex sm:flex-row flex-col">
      <div className="w-full h-full bg-slate-500">
        <Image src='/bg_backoffice.webp' radius="none" className="h-[300px] sm:h-screen sm:w-full object-cover object-center" />
      </div>
      <div className="flex items-center justify-center w-full h-full sm:h-screen max-w-xl p-5">
        <LoginForm />
      </div>
    </div>
  )
}