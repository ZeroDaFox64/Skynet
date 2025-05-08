/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { Edit, ServiceChips, View, CopyData } from "../../../components/admin/actions";
import { Chip } from "@heroui/react";
import NewSubModal from "../../../components/utils/NewSubModal";

import { FaFlag } from "react-icons/fa6";
import { FaCheck, FaUser, FaUsers } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { LiaSkullCrossbonesSolid } from "react-icons/lia";
import { IoTimerOutline } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";

function FechaActual() {
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
  const dia = String(fechaActual.getDate()).padStart(2, "0");
  const fechaFormateada = `${año}-${mes}-${dia}`;

  return fechaFormateada;
}

const today = FechaActual();

export const subscriptionTableConfig = {
  name: "Suscripciones",
  columns: [
    {
      name: "Acciones",
      key: "actions",
      handlerValue: (value: any) => {
        return (
          <div className="flex gap-2">
            <Edit entity="subscription" id={value?._id} />
            <View entity="subscription" id={value?._id} />
            <CopyData data={value} />
          </div>
        );
      },
    },
    {
      name: "Estado de pago",
      key: "pay_status",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return "-";
        if (value === "paid")
          return (
            <Chip color="success" variant="flat">
              <span className="flex items-center gap-2">
                <FaCheck />
                Pagado
              </span>
            </Chip>
          );
        if (value === "unrenewed")
          return (
            <Chip color="warning" variant="flat">
              <span className="flex items-center gap-2">
                <IoIosWarning size={18} />
                No va a renovar
              </span>
            </Chip>
          );
        if (value === "canceled")
          return (
            <Chip color="danger" variant="flat">
              <span className="flex items-center gap-2">
                <LiaSkullCrossbonesSolid size={20} />
                Cancelado
              </span>
            </Chip>
          );
        if (value === "notified")
          return (
            <Chip color="primary" variant="flat">
              <span className="flex items-center gap-2">
                <FaFlag />
                Por pagar
              </span>
            </Chip>
          );
      },
    },
    {
      name: "Usuario",
      key: "user",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value.phone !== "string" && typeof value.email !== "string") return "-";
        if (typeof value.phone !== "string") return <a href={`/edit/user/${value._id}`}>{value.email}</a>;
        const phone = value.phone.replace(/\D/g, '');
        return <a href={`https://api.whatsapp.com/send?phone=${phone}`} target="_blank" rel="noopener noreferrer">+{phone}</a>;
      },
    },
    {
      name: "Cuenta",
      key: "account",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value.email !== "string") return "-";
        return <a href={`/edit/account/${value._id}`}>{value.email}</a>;
      },
    },
    {
      name: "Días restantes",
      key: "countdown",
      isFilterable: true,
      handlerValue: (value: any, item: any) => {
        if (typeof value.cutoff_date !== "string") return "-";

        const fechaVencimiento = moment(item.cutoff_date); // Fecha de vencimiento
        const fechaActual = moment(); // Fecha actual

        // Calcular la diferencia en días
        const diasRestantes = fechaVencimiento.diff(fechaActual, "days");

        // Si la fecha de vencimiento ya pasó
        if (diasRestantes < 0) {
          return (
            <span className="flex items-center gap-2">
              <IoCalendarOutline size={18} /> {diasRestantes * -1} días vencida
            </span>
          );
        }

        // Si la fecha de vencimiento es hoy
        if (diasRestantes === 0) {
          return (
            <span className="flex items-center gap-2">
              <IoCalendarOutline size={18} /> Vence hoy
            </span>
          );
        }

        // Mostrar el tiempo restante en días
        return <span className="flex items-center gap-2"><IoCalendarOutline size={18}/>{diasRestantes} días</span>;
      },
    },
    {
      name: "F. de vencimiento",
      key: "cutoff_date",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return "-";

        const fechaActual = moment();
        const fechaVencimiento = moment(value);

        // Si la fecha ya pasó
        if (fechaVencimiento.isBefore(fechaActual)) {
          return (
            <span className="flex items-center gap-2 text-[#ff5656]">
              <IoTimerOutline size={20} /> {fechaVencimiento.format("DD/MM/YYYY")}
            </span>
          );
        }

        // Si se vence hoy
        if (fechaVencimiento.isSame(fechaActual)) {
          return (
            <span className="flex items-center gap-2 text-warning">
              <IoTimerOutline size={20} /> {fechaVencimiento.format("DD/MM/YYYY")}
            </span>
          );
        }

        // Si faltan 3 días o menos para el vencimiento
        if (fechaVencimiento.isBefore(fechaActual.add(3, "days"))) {
          return (
            <span className="flex items-center gap-2 text-[#7a8eff]">
              <IoTimerOutline size={20} /> {fechaVencimiento.format("DD/MM/YYYY")}
            </span>
          );
        }

        // Por defecto, devolver la fecha formateada
        return fechaVencimiento.format("DD/MM/YYYY");
      },
    },
    {
      name: "Tipo",
      key: "type",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return "-";
        if (value === "shared")
          return (
            <Chip color="primary" variant="flat" startContent={<FaUsers />}>
              Compartida
            </Chip>
          );
        if (value === "single")
          return (
            <Chip className="bg-disney dark:text-[#48c3c7] text-[#21999d] bg-opacity-30" startContent={<FaUser />}>
              Completa
            </Chip>
          );
      },
    },
    {
      name: "Servicio",
      key: "service",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value.name !== "string") return "-";
        return <ServiceChips service={value.name} />;
      },
    },
  ],
};

export const subscriptionFormConfig = {
  name: "Registrar una nueva suscripción",
  description: "Suscripciones nuevas",
  // onRegisterSuccess: () => {},
  successModal: (data: any) => {
    return (
      <NewSubModal data={data} />
    );
  },
  successDataKey: "newSubscription",
  fields: [
    {
      name: "user",
      label: "Usuario | Cliente",
      component: "ASYNC_SELECT",
      default: "",
      required: true,
      endpoint: "/user/all",
      key: "users",
      title: "phone",
      backupTitle: "email",
      value: "_id",
      show: 'onlyCreate',
    },
    {
      name: "service",
      label: "Servicio",
      component: "ASYNC_SELECT",
      required: true,
      default: "",
      endpoint: "/service",
      key: "services",
      title: "name",
      value: "_id",
      show: 'onlyCreate',
    },
    {
      name: "type",
      label: "Tipo de suscripción",
      component: "SELECT",
      required: true,
      default: "shared",
      options: [
        { value: "shared", label: "Compartida" },
        { value: "single", label: "Completa" },
      ],
    },
    {
      name: "contract_date",
      label: "F. de contrato",
      default: today,
      component: "DATE",
      required: true,
    },
    {
      name: "cutoff_date",
      label: "F. de corte",
      component: "DATE",
      show: "onlyEdit",
    },
    {
      name: "cutoff_number",
      label: "Duración de la suscripción ( en meses )",
      default: 1,
      component: "NUMBER",
      show: "onlyCreate",
    },
    {
      name: "pay_status",
      label: "Estado de pago",
      default: "paid",
      component: "SELECT",
      options: [
        { value: "paid", label: "Pagado" },
        { value: "canceled", label: "Cancelado" },
        { value: "unrenewed", label: "No va a renovar" },
        { value: "notified", label: "Notificado, por pagar" },
      ],
    },
    {
      name: "nickname",
      label: "Nickname | Nombre de usuario",
      default: "",
      component: "TEXT",
    },
    {
      name: "account",
      label: "Cuenta asignada",
      component: "ASYNC_SELECT",
      default: "",
      endpoint: "/account/all",
      key: "accounts",
      title: "email",
      secondTitle: "service",
      value: "_id",
      show: 'onlyCreate',
    },
    {
      name: "pin",
      label: "Pin de la suscripción",
      default: "",
      component: "TEXT",
    },
    {
      name: "observations",
      default: "",
      label: "Observaciones adicionales",
      component: "TEXTAREA",
    },
  ],
};
