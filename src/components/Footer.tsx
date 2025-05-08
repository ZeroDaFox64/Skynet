import { Button } from "@heroui/react";
import { Link } from "react-router";
import { FaTiktok } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { TbBrandWhatsappFilled } from "react-icons/tb";

export default function App({ light = false }) {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <p
        className={`${
          light ? "text-storesecondary" : "text-emerald-400"
        } text-sm font-semibold p-10 pt-5`}
      >
        All rights reserved © 2025
      </p>
    </div>
  );
}
