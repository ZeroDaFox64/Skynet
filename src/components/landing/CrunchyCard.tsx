/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@heroui/react";
import { Link } from "react-router";

import { SiCrunchyroll } from "react-icons/si";
import { TbCrown } from "react-icons/tb";
import { BiMoneyWithdraw } from "react-icons/bi";
import { GiCancel } from "react-icons/gi";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { TbFlameFilled } from "react-icons/tb";

export default function App({
  title,
  price,
  features,
  badFeatures,
  popular,
}: any) {
  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-3">
          <p className="font-bold text-gray-500 text-opacity-35 flex items-center gap-1">
            CRUNCHYROLL PREMIUM <TbCrown size={23} />
          </p>
          <div className="flex gap-3 w-full items-center">
            <SiCrunchyroll size={50} className="text-orange-500" />
            <div>
              <p className="text-lg font-semibold">{title}</p>
              <p className="text-2xl font-normal">${price.toFixed(2)} USD</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="flex flex-col gap-1">
          {features.map((feature: any, index: number) => (
            <p key={index} className="text-sm flex items-center gap-2">
              <RiCheckboxCircleLine size={15} /> {feature}
            </p>
          ))}
          {badFeatures &&
            badFeatures.map((feature: any, index: number) => (
              <p
                key={index}
                className="text-sm text-red-500 flex items-center gap-2"
              >
                <GiCancel size={15} /> {feature}
              </p>
            ))}
          {popular && (
            <div className="w-full flex justify-center items-center mt-5">
              <Chip color="danger"><span className="font-bold text-sm flex gap-1 items-center">MÁS VENDIDO <TbFlameFilled size={20}/></span></Chip>
            </div>
          )}
        </CardBody>
        <CardFooter>
          <Button
            className="bg-orange-500 text-orange-950 font-semibold"
            fullWidth
            to="https://api.whatsapp.com/send/?phone=584123000874"
            target="blank_"
            startContent={<BiMoneyWithdraw size={20} />}
            as={Link}
          >
            Comprar ahora
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
