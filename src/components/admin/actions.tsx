/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Chip } from "@heroui/react";
import { Link } from "react-router";

import { FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useState } from "react";
import { toast } from "sonner";
import { SiCrunchyroll, SiPrime, SiNetflix } from "react-icons/si";
import { IoRadio } from "react-icons/io5";
import { TbBrandDisney } from "react-icons/tb";
import { FaCopy } from "react-icons/fa";
import moment from "moment";

export function CopyData({ data }: { data: any }) {
  const type = data?.type === "shared" ? "Cuenta compartida" : "Cuenta personal";

  const message = `
📋 *Detalles de la suscripción* 📋

🔑 *CREDENCIALES*: 
- Correo: ${data?.account?.email}
- Contraseña: ${data?.account?.password}
${data?.pin ? `- PIN: ${data?.pin}
` : ``}
🎬 *SERVICIO*: 
- ${data?.service?.name}
- Tipo: ${type}

📅 *PERIODO DE CONTRATO*: 
- Fecha de inicio: ${data?.contract_date ? moment(data?.contract_date).format("DD/MM/YYYY") : "-"}
- Fecha de corte: ${data?.cutoff_date ? moment(data?.cutoff_date).format("DD/MM/YYYY") : "-"}

${data?.cutoff_date > moment().format("YYYY-MM-DD") ? `Te quedan ${moment(data?.cutoff_date).diff(moment(), "days")} días de suscripción.` : "*SUSCRIPCION VENCIDA*"}

✨ *¡Gracias por preferirnos!* ✨  
Si necesitas ayuda, responde a este mensaje. ¡Estamos aquí para ayudarte!`;

  return (
    <Button color="primary" size="sm" isIconOnly radius="full" className="text-primary-100" onPress={() => { navigator.clipboard.writeText(message); toast.success("Copiado al portapapeles"); }}>
      <FaCopy size={15} className="text-info-100" />
    </Button>
  );
}

export function Delete() {
  return (
    <Button color="danger" size="sm" isIconOnly radius="full">
      <FaTrash size={15} className="text-danger-100" />
    </Button>
  );
}

export function View({ entity, id }: { entity: string, id: string }) {
  return (
    <Button
      color="warning"
      className="text-warning-100"
      size="sm"
      isIconOnly
      radius="full"
      as={Link}
      to={`/view/${entity}/${id}`}
    >
      <FaEye size={15} />
    </Button>
  );
}

export function Edit(props: { entity: string; id: string }) {
  const { entity, id } = props;
  return (
    <Button
      color="success"
      size="sm"
      isIconOnly
      as={Link}
      to={`/edit/${entity}/${id}`}
      radius="full"
    >
      <MdEdit size={15} className="text-success-100" />
    </Button>
  );
}

export function Password({ children }: { children: any }) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("******");

  const handleChange = () => {
    if (showPassword === false) {
      setPassword(children);
      setShowPassword(true);
      try {
        navigator.clipboard.writeText(children);
        toast.success("Copiado al portapapeles");
      } catch (err: any) {
        toast.error("No se pudo copiar al portapapeles 😔 ", err);
      }
    } else {
      setPassword("******");
      setShowPassword(false);
    }
  };

  return (
    <div
      className={`flex gap-2 items-center ${showPassword ? "" : "text-gray-400"
        }`}
    >
      {password}
      <Button
        size="sm"
        className={`bg-transparent ${showPassword ? "" : "text-gray-400"}`}
        isIconOnly
        onPress={() => handleChange()}
        radius="full"
      >
        {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
      </Button>
    </div>
  );
}

export function ServiceChips(serviceId: any) {
  if (serviceId.service === "Crunchyroll")
    return (
      <div className="flex gap-2">
        <Chip className="bg-crunchyroll dark:text-[#ffa143] text-[#ff7134] bg-opacity-30" startContent={<SiCrunchyroll />}>
          Crunchyroll
        </Chip>
      </div>
    );

  if (serviceId.service === "Netflix")
    return (
      <div className="flex gap-2">
        <Chip className="bg-netflix dark:text-[#E40B1E] text-[#E40B1E] bg-opacity-30" startContent={<SiNetflix />}>
          Netflix
        </Chip>
      </div>
    );

  if (serviceId.service === "Prime Video")
    return (
      <div className="flex gap-2">
        <Chip color="primary" variant="flat" startContent={<SiPrime />}>
          Prime Video
        </Chip>
      </div>
    );

  if (serviceId.service === "HBO max")
    return (
      <div className="flex gap-2">
        <Chip color="secondary" variant="flat" startContent={<IoRadio />}>
          HBO max
        </Chip>
      </div>
    );

  if (serviceId.service === "Disney+ / Star+")
    return (
      <div className="flex gap-2">
        <Chip className="bg-disney dark:text-[#48c3c7] text-[#21999d] bg-opacity-30" startContent={<TbBrandDisney />}
        >
          Disney+ / Star+
        </Chip>
      </div>
    );
  return (
    <div className="flex gap-2">
      <Chip color="secondary" variant="flat" startContent={<IoRadio />}>
        {serviceId.service}
      </Chip>
    </div>
  );
}
