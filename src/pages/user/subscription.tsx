/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Chip, Image } from "@heroui/react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { Divider } from "@heroui/react";
import { authorizationStore } from "../../store/authenticationStore";

import { BsFillTrash3Fill } from "react-icons/bs";
import { toast } from "sonner";
import { api } from "../../libs/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { FaWhatsapp } from "react-icons/fa";

export default function SubscriptionsPage() {
  const [data, setData] = useState<any>([]);
  const { user, session } = authorizationStore();

  const navigate = useNavigate();

  if (user?.role !== "verified user" && user?.role !== "superadmin") {
    navigate("/");
  }

  const getData = async () => {
    try {
      const res = await api.get(`/subscription/user/${user?.id}`, {
        headers: { Authorization: session },
      });

      if (res.status === 200) {
        setData(res.data);
      }
    } catch (err: any) {
      toast.error(
        "Ocurrió un error inesperado. Por favor, inténtalo de nuevo." + err
      );
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const message = 'Hola Nitto!! Vengo de la Nitto Store, quiero una suscripción en un servicio de streaming.'
  const encodeMessage = encodeURIComponent(message);

  return (
    <div className=" py-10 px-3 flex justify-center">
      <div className="flex flex-col w-full max-w-7xl gap-5">
        {data.length > 0 ? (
          <>
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold">Mis Suscripciones</h1>
              <p>Administra tus suscripciones activas.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.map((subscription: any, index: number) => (
                <SubscriptionCard
                  key={index}
                  email={subscription?.account?.email}
                  password={subscription?.account?.password}
                  service={subscription?.service?.name}
                  contract_date={subscription?.contract_date}
                  cutoff_date={subscription?.cutoff_date}
                  type={subscription?.type}
                  pay_status={subscription?.pay_status}
                  pin={subscription?.pin}
                  nickname={subscription?.nickname}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center h-[calc(100vh-264px)] justify-center px-3 gap-7">
            <p className="text-3xl text-center font-semibold">
              No tienes suscripciones activas
            </p>
            <div className="flex justify-center gap-4">
              <Image src="/icon_crunchy.png" alt="icono de suscripción" className="w-14 h-14" />
              <Image src="/icon_netflix.png" alt="icono de suscripción" className="w-14 h-14" />
              <Image src="/icon_hbo.png" alt="icono de suscripción" className="w-14 h-14" />
              <Image src="/icon_disney.png" alt="icono de suscripción" className="w-14 h-14" />
              <Image src="/icon_prime.png" alt="icono de suscripción" className="w-14 h-14" />
            </div>
            <p className="text-center text-gray-500 max-w-md">
              Puedes contratar una suscripción en nuestra tienda a través de WhatsApp
            </p>
            <Button color="success" variant="shadow" className="text-white font-semibold" onPress={() => window.open(`https://api.whatsapp.com/send?phone=584123000874&text=${encodeMessage}`)}>Contratar una suscripción <FaWhatsapp size={20} /></Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface SubscriptionCardProps {
  email: string;
  password: string;
  service: string;
  contract_date: string;
  cutoff_date: string;
  type: string;
  pay_status: string;
  pin?: string;
  nickname: string;
}

function SubscriptionCard({
  email,
  password,
  service,
  contract_date,
  cutoff_date,
  type,
  pay_status,
  pin,
  nickname,
}: SubscriptionCardProps) {
  let logo;

  if (service === "HBO max") {
    logo = "/icon_hbo.png";
  } else if (service === "Disney+ / Star+") {
    logo = "/icon_disney.png";
  } else if (service === "Prime Video") {
    logo = "/icon_prime.png";
  } else if (service === "Crunchyroll") {
    logo = "/icon_crunchy.png";
  }

  let status;
  if (pay_status === "paid" || pay_status === "notified") {
    status = (
      <Chip color="success" variant="flat">
        Pagada
      </Chip>
    );
  } else if (pay_status === "canceled") {
    status = (
      <Chip color="danger" variant="flat">
        Cancelada
      </Chip>
    );
  } else if (pay_status === "unrenewed") {
    status = (
      <Chip color="warning" variant="flat">
        No se renovará
      </Chip>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4 ">
            <div className="w-12 h-12 relative">
              <Image
                src={logo}
                alt={`logo del servicio ${service}`}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {nickname || "Sin nickname"}
              </h2>
              <p className="text-sm text-gray-500">Suscripción de {service}</p>
            </div>
          </div>
          {status}
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4 mb-4">
          <div className="flex justify-between">
            <span className="font-semibold text-lg">Precio mensual</span>
            <span className="text-lg">
              {type === "shared" ? "$2.00 USD" : "$7.00 USD"}
            </span>
          </div>
          <div className="flex flex-col items-start text-sm gap-2">
            <span>Correo: {email}</span>
            <span>Contraseña: {password}</span>
            {pin && <span>Pin: {pin}</span>}
            <span>Último pago: {contract_date}</span>
            <span>Próximo cobro: {cutoff_date}</span>
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-end">
        <Button
          variant="flat"
          color="danger"
          radius="full"
          className="font-semibold"
          onPress={() => toast.warning("Esta sección estará disponible pronto")}
        >
          Cancelar <BsFillTrash3Fill size={17} />
        </Button>
      </CardFooter>
    </Card>
  );
}
