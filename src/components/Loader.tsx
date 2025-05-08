import { CircularProgress } from "@heroui/react";

export default function Loading() {
  return (
    <div className="w-full h-screen bg-cover bg-center flex flex-col justify-center items-center fixed z-50"
    style={{ backgroundImage: "url('/bg_links.png')" }}>
      <div className="grid place-items-center">
        <CircularProgress color="danger" size="lg"/>
      </div>
      <p className="mt-5 ml-5 text-white text-2xl font-semibold">
        {`Cargando...`}
      </p>
    </div>
  );
}
