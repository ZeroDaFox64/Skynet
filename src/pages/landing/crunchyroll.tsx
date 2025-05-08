import { Button, Tab, Tabs } from "@heroui/react";
import CrunchyCard from "../../components/landing/CrunchyCard";

import { TbCrown } from "react-icons/tb";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { BiMoneyWithdraw } from "react-icons/bi";
import { toast } from "sonner";

export default function App() {
  const plans = {
    singleMonthly: {
      title: "Pantalla mensual",
      popular: true,
      price: 2,
      features: [
        "Acceso a todos los animes de Crunchyroll",
        "Sin anuncios de ningún tipo",
        "Episodios una hora después de su emisión en Japón",
        "Animes en Full HD",
        "Subtitulos y doblaje profesional en español",
        "Accede desde cualquier dispositivo",
        "Solo para un dispositivo al mismo tiempo",
        "1 Perfil personalizable solo para ti",
        "Acceso ininterrumpido durante un mes",
        "Servicio de atención al cliente",
      ],
      badFeatures: [
        "Solo puedes usar tu cuenta en 1 DISPOSITIVO a la vez",
      ],
    },
    fullMonthly: {
      title: "Cuenta mensual",
      price: 7,
      features: [
        "Acceso a todos los animes de Crunchyroll",
        "Sin anuncios de ningún tipo",
        "Episodios una hora después de su emisión en Japón",
        "Animes en Full HD",
        "Subtitulos y doblaje profesional en español",
        "Accede desde cualquier dispositivo",
        "Solo para un dispositivo al mismo tiempo",
        "5 Perfiles personalizables",
        "Acceso ininterrumpido durante un mes",
        "Servicio de atención al cliente",
        "Puedes usar tu cuenta en hasta 4 DISPOSITIVOS a la vez"
      ],
    },
    singleYearly: {
      title: "Pantalla anual",
      price: 20,
      features: [
        "Acceso a todos los animes de Crunchyroll",
        "Sin anuncios de ningún tipo",
        "Episodios una hora después de su emisión en Japón",
        "Animes en Full HD",
        "Subtitulos y doblaje profesional en español",
        "Accede desde cualquier dispositivo",
        "Solo para un dispositivo al mismo tiempo",
        "1 Perfil personalizable solo para ti",
        "Acceso ininterrumpido durante un año",
        "Servicio de atención al cliente",
      ],
      badFeatures: [
        "Solo puedes usar tu cuenta en 1 DISPOSITIVO a la vez",
      ],
    },
    fullYearly: {
      title: "Cuenta anual",
      price: 55,
      features: [
        "Acceso a todos los animes de Crunchyroll",
        "Sin anuncios de ningún tipo",
        "Episodios una hora después de su emisión en Japón",
        "Animes en Full HD",
        "Subtitulos y doblaje profesional en español",
        "Accede desde cualquier dispositivo",
        "Solo para un dispositivo al mismo tiempo",
        "5 Perfiles personalizables",
        "Acceso ininterrumpido durante un año",
        "Servicio de atención al cliente",
        "Puedes usar tu cuenta en hasta 4 DISPOSITIVOS a la vez"
      ],
    },
  };

  return (
    <>
        <>
          <div className="w-full h-[100dvh] flex justify-center items-center relative">
            <div
              className="absolute top-0 w-full h-[100dvh] flex flex-col bg-cover bg-opacity-95 justify-center items-center z-10 p-3"
              style={{ backgroundImage: "url('/crunchy-bg.webp')" }}
            >
              <p className="w-full font-semibold dark:text-gray-200 light:text-gray-700 text-xl max-w-4xl">
                Compra tu suscripción de
              </p>
              <h1 className="text-orange-600 text-7xl sm:text-8xl font-bold max-w-4xl w-full">
                Crunchyroll
              </h1>
              <p className="flex font-bold max-w-4xl dark:text-yellow-400 w-full items-center text-5xl">
                Premium <TbCrown size={70} />
              </p>
              <p className="w-full font-semibold dark:text-gray-200 light:text-gray-700 text-xl max-w-4xl">
                Con el mejor servicio del país
              </p>
              <div className="w-full max-w-4xl gap-3 flex mt-5">
                <Button
                  className="bg-orange-500 text-orange-950 font-semibold"
                  startContent={<BiMoneyWithdraw size={20} />}
                >
                  <a href="#plans" className="w-full h-full flex justify-center items-center">Ver planes</a>
                </Button>
                <Button
                  className="bg-yellow-500 text-yellow-950 font-semibold"
                  startContent={<IoMdInformationCircleOutline size={20} />}
                  onPress={() => toast.info('En desarrollo...')}
                >
                  Más información
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-5 justify-center items-center my-10">
            <Tabs
              aria-label="Opciones de pago"
              variant="underlined"
              placement="top"
              id="plans"
              fullWidth
            >
              <Tab
                key="monthly"
                title="Mensual"
                className="flex gap-3 flex-col sm:flex-row"
              >
                <CrunchyCard {...plans.singleMonthly} />
                <CrunchyCard {...plans.fullMonthly} />
              </Tab>
              <Tab
                key="yearly"
                title="Anual"
                className="flex gap-3 flex-col sm:flex-row"
              >
                <CrunchyCard {...plans.singleYearly} />
                <CrunchyCard {...plans.fullYearly} />
              </Tab>
            </Tabs>
          </div>
        </>
    </>
  );
}
