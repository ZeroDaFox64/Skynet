import { Link } from "react-router";
import Footer from "../../components/Footer";
import { FaTiktok } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { TbBrandWhatsappFilled } from "react-icons/tb";
import { Button, Image } from "@heroui/react";
import { CgDanger } from "react-icons/cg";
import { TbUserSquareRounded } from "react-icons/tb";
import db_store from "../../db_store";

import { toast } from "sonner";

const btnStyle =
  "bg-storesecondary text-store font-semibold rounded-full px-5 py-2 shadow-md";
const textStyle = "text-2xl font-semibold text-storesecondary";

export default function App() {
  return (
    <>
      <title>{db_store.name} | Redes</title>
      <div
        className="w-full h-screen bg-cover bg-center flex flex-col justify-between items-center px-3"
        style={{ backgroundImage: "url('/bg_links.webp')" }}
      >
        <div></div>
        <div className="w-full max-w-sm flex flex-col gap-3">
          <h2 className={textStyle}>Tienda en línea</h2>
          <Button
            as={Link}
            to="/"
            className={
              "bg-storesecondary text-store font-bold rounded-full px-3 py-2 shadow-md"
            }
            startContent={
              <Image
                src="/logo.png"
                alt="logo de Nitto"
                className="h-4 rounded-none"
              />
            }
          >
            | STORE
          </Button>
          <h2 className={textStyle}>Redes sociales</h2>
          <Button
            as={Link}
            to={db_store?.navbar?.whatsapp}
            target="blank_"
            className={btnStyle}
            startContent={
              <TbBrandWhatsappFilled size={20} className="text-store" />
            }
          >
            Whatsapp | Nitto Store
          </Button>
          <Button
            as={Link}
            to={db_store?.navbar?.facebook}
            target="blank_"
            className={btnStyle}
            startContent={
              <TbBrandWhatsappFilled size={20} className="text-store" />
            }
          >
            Whatsapp | Nitto Streaming
          </Button>
          <Button
            as={Link}
            to={db_store?.navbar?.instagram}
            target="blank_"
            className={btnStyle}
            startContent={<AiFillInstagram size={20} className="text-store" />}
          >
            Instagram
          </Button>
          <Button
            as={Link}
            to={db_store?.navbar?.whatsapp}
            target="blank_"
            className={btnStyle}
            startContent={<FaTiktok size={20} className="text-store" />}
          >
            TikTok
          </Button>
          <h2 className={textStyle}>Vias administrativas</h2>
          <Button
            // as={Link}
            // to="#"
            onPress={() => {
              toast.warning("Esta sección estará disponible pronto");
            }}
            className={btnStyle}
            startContent={<CgDanger size={20} className="text-store" />}
          >
            Reportar un problema
          </Button>
          <Button
            // as={Link}
            // to="#"
            onPress={() => {
              toast.warning("Esta sección estará disponible pronto");
            }}
            className={btnStyle}
            startContent={
              <TbUserSquareRounded size={20} className="text-stor" />
            }
          >
            Mayoristas y proveedores
          </Button>
        </div>
        <Footer light={true} />
      </div>
    </>
  );
}
