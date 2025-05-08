import { Image } from "@heroui/react";
import { Link } from "react-router";

function App() {
  return (
    <>
      <div className="w-full h-screen flex justify-center items-start absolute">
      <Image
        src="/404.png"
        alt="404"
        className="max-w-[250px]"
      />
      </div>
      <div className="w-full h-screen flex flex-col justify-center items-center gap-3 relative z-10">
        <p className="text-5xl font-bold">404</p>
        <p>Página no encontrada</p>
        <Link to={"/"} className="text-blue-500">
          Ir al inicio
        </Link>
      </div>
    </>
  );
}

export default App;
