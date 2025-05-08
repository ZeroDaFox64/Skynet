import { Button } from "@heroui/react";
import { Link } from "react-router";
import { FaTiktok } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { TbBrandWhatsappFilled } from "react-icons/tb";
import db_store from "../db_store";

export default function App({ light = false }) {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex gap-5 justify-center items-center">
        {db_store?.navbar?.instagram && (
          <Button
            as={Link}
            target="_blank"
            to={db_store?.navbar?.instagram}
            isIconOnly
            className={`rounded-full bg-transparent border-2 ${
              light ? "border-storesecondary" : "border-store"
            }`}
          >
            <AiFillInstagram
              className={`text-xl ${
                light ? "text-storesecondary" : "text-store"
              }`}
            />
          </Button>
        )}
        {db_store?.navbar?.tiktok && (
          <Button
            as={Link}
            target="_blank"
            to={db_store?.navbar?.tiktok}
            isIconOnly
            className={`rounded-full bg-transparent border-2 ${
              light ? "border-storesecondary" : "border-store"
            }`}
          >
            <FaTiktok
              className={`text-xl ${
                light ? "text-storesecondary" : "text-store"
              }`}
            />
          </Button>
        )}
        {db_store?.navbar?.whatsapp && (
          <Button
            as={Link}
            target="_blank"
            to={db_store?.navbar?.whatsapp}
            isIconOnly
            className={`rounded-full bg-transparent border-2 ${
              light ? "border-storesecondary" : "border-store"
            }`}
          >
            <TbBrandWhatsappFilled
              className={`text-xl ${
                light ? "text-storesecondary" : "text-store"
              }`}
            />
          </Button>
        )}
      </div>
      <p
        className={`${
          light ? "text-storesecondary" : "text-store"
        } text-sm font-semibold p-10 pt-5`}
      >
        {db_store?.footer?.title}
      </p>
    </div>
  );
}
