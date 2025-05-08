/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, CardFooter, Image } from "@heroui/react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import { DiAndroid } from "react-icons/di";

export default function App({ ContainerStyles = "" }) {
  const navigate = useNavigate();

  const handleNavigate = (link: string) => {
    if (!link) {
      toast.success("Sección disponible próximamente!!!");
      return;
    }
    navigate("/product/crunchyroll");
  };

  const sections = [
    {
      display: "col-span-12 sm:col-span-4",
      title: "OFERTAS DE TEMPORADA",
      sub_title: "Mangas y manhwas",
      image: "/images/front1.jfif",
    },
    {
      display: "col-span-12 sm:col-span-4",
      title: "REBAJAS DE INVIERNO",
      sub_title: "Figuras",
      image: "/images/front2.png",
    },
    {
      display: "col-span-12 sm:col-span-4",
      title: "RECARGAS Y GIFTCARDS",
      sub_title: "Servicio de recargas",
      image: "/images/front3.png",
    },
    {
      display: "col-span-12 sm:col-span-5",
      title: "APP MÓVIL - ANDROID",
      sub_title: "Descarga la aplicación móvil",
      image: "/images/app_mockup.png",
      download: "https://play.google.com/store/apps/detailss?id=com.nitto.app",
    },
    {
      display: "col-span-12 sm:col-span-7",
      title: "PROMOCIONES DE STREAMING",
      sub_title: "Suscripciones de Crunchyroll",
      image: "/images/front5.png",
      link: "/product/crunchyroll",
    },
  ];

  return (
    <section
      id="banner"
      className={`w-full flex justify-center items-center ${ContainerStyles}`}
    >
      <div className="max-w-[900px] gap-7 grid grid-cols-12 grid-rows-2 px-3 sm:gap-2 ">
        {sections.map((item: any, index: number) => (
          <Card className={`${item.display} h-[300px] rounded-xl`} key={index}>
            <Image
              removeWrapper
              onClick={() => handleNavigate(item.link)}
              alt="Card background"
              className="z-0 w-full h-full object-cover hover:scale-110 transition-all duration-500 cursor-pointer"
              src={item.image}
            />
            <CardFooter className="flex justify-between items-start absolute bg-black/60 bottom-0 backdrop-blur-md rounded-b-xl">
              <div>
                <p className="text-xs text-white/60 uppercase">{item.title}</p>
                <h4 className="text-white font-semibold text-lg">
                  {item.sub_title}
                </h4>
              </div>
              {item.download && (
                <a
                  href="/mobile/nitto.apk"
                  download="nitto_store.apk"
                  onClick={(e) => {
                    e.stopPropagation()
                    toast.success("Descargando...")
                  }}
                >
                  <Button
                    className="font-semibold text-store bg-storesecondary"
                    isIconOnly
                  >
                    <DiAndroid size={20} />
                  </Button>
                </a>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
