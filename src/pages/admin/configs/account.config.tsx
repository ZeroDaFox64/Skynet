/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { Edit, Password, ServiceChips, View } from "../../../components/admin/actions";
import { Chip } from "@heroui/react";

import { FaUsers, FaUser } from "react-icons/fa6";
import { IoTimerOutline } from "react-icons/io5";
import { BsFillPersonFill } from "react-icons/bs";

export const accountTableConfig = {
  name: "Cuentas",
  columns: [
    {
      name: "Acciones",
      key: "actions",
      handlerValue: (value: any) => {
        return (
          <div className="flex gap-2">
            <Edit entity="account" id={value?._id} />
            <View entity="account" id={value?._id} />
          </div>
        );
      },
    },
    {
      name: "Correo electrónico",
      key: "email",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        return value;
      },
    },
    {
      name: "Contraseña",
      key: "password",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        return <Password>{value}</Password>;
      },
    },
    {
      name: "Servicio",
      key: "service",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value.name !== "string") return '-'
        return <ServiceChips service={value.name} />;
      },
    },
    {
      name: "Tipo",
      key: "type",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
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
      name: "Usuarios",
      key: "users",
      isFilterable: true,
      handlerValue: (value: any, row: any) => {
        if (!value) return '-'
        return <p className="font-semibold flex items-center gap-2">{value?.length}/{row.type === "shared" ? 5 : 1} <BsFillPersonFill size={18} /></p>
      }
    },
    {
      name: "Disponibilidad",
      key: "availability",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        if (value === "empty")
          return (
            <Chip color="default" variant="flat">
              Vacía
            </Chip>
          );
        if (value === "partial")
          return (
            <Chip color="warning" variant="flat">
              Parcial
            </Chip>
          );
        if (value === "full")
          return (
            <Chip color="success" variant="flat">
              Llena
            </Chip>
          );
      },
    },
    {
      name: "Estado",
      key: "status",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        if (value === "available")
          return (
            <Chip color="success" variant="flat">
              Disponible
            </Chip>
          );
        if (value === "close_to_expiration")
          return (
            <Chip color="warning" variant="flat">
              Próxima a vencer
            </Chip>
          );
        if (value === "under_review")
          return (
            <Chip color="danger" variant="flat">
              En revisión
            </Chip>
          );
        if (value === "expired")
          return (
            <Chip color="danger" variant="flat">
              Vencida
            </Chip>
          );
      },
    },
    {
      name: "Mantenimiento",
      key: "maintenance",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        if (value === "false")
          return (
            <Chip color="success" variant="flat">
              Listo
            </Chip>
          );
        if (value === "true")
          return (
            <Chip color="danger" variant="flat">
              En espera
            </Chip>
          );
      },
    },
    // {
    //   name: "F. Contrato",
    //   key: "contract_date",
    //   isFilterable: true,
    //   handlerValue: (value: any) => {
    //     if (typeof value !== "string") return '-'
    //     return moment(value).format("DD/MM/YYYY");
    //   },
    // },
    {
      name: "F. Vencimiento",
      key: "cutoff_date",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        // si falta 2 meses o menos para el vencimiento
        if (moment(value).isBefore(moment().add(2, "months"))) {
          return (
            <span className="text-danger flex items-center gap-2">
              <IoTimerOutline size={20} className="text-danger" />  {moment(value).format("DD/MM/YYYY")}
            </span>
          );
        }

        // si falta 3 meses o menos para el vencimiento
        if (moment(value).isBefore(moment().add(3, "months"))) {
          return (
            <span className="text-warning flex items-center gap-2">
              <IoTimerOutline size={20} className="text-warning" />  {moment(value).format("DD/MM/YYYY")}
            </span>
          );
        }

        // por defecto, devolver la fecha formateada
        return moment(value).format("DD/MM/YYYY");
      },
    },
  ],
};

export const accountFormConfig = {
  name: "Registrar una nueva cuenta",
  description: "Cuentas nuevas",
  fields: [
    {
      name: "email",
      label: "Correo electrónico",
      component: "TEXT",
      required: true,
    },
    {
      name: "password",
      label: "Contraseña",
      component: "TEXT",
      required: true,
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
    },
    {
      name: "provider",
      label: "Proveedor",
      component: "ASYNC_SELECT",
      required: true,
      default: "",
      endpoint: "/provider",
      key: "providers",
      title: "name",
      value: "_id",
    },
    {
      name: "contract_date",
      label: "Fecha de contrato",
      component: "DATE",
      required: true,
    },
    {
      name: "cutoff_date",
      label: "Fecha de vencimiento",
      component: "DATE",
      required: true,
    },
    {
      name: "type",
      label: "Tipo de cuenta",
      default: "shared",
      component: "SELECT",
      options: [
        { value: "shared", label: "Compartida" },
        { value: "single", label: "Completa" },
      ],
    },
    {
      name: "availability",
      label: "Disponibilidad de la cuenta",
      default: "empty",
      component: "SELECT",
      options: [
        { value: "empty", label: "Totalmente vacía" },
        { value: "partial", label: "Parcialmente llena" },
        { value: "full", label: "Totalmente llena" },
      ],
    },
    {
      name: "status",
      label: "Estado de la cuenta",
      default: "available",
      component: "SELECT",
      options: [
        { value: "available", label: "Disponible" },
        { value: "under_review", label: "En revisión ( fuera de servicio )" },
        { value: "expired", label: "Vencida ( fuera de servicio )" },
      ],
    },
    {
      name: "maintenance",
      label: "¿Necesita mantenimiento?",
      default: "false",
      component: "SELECT",
      options: [
        { value: "false", label: "No, no es necesario" },
        { value: "true", label: "Sí, en espera por mantenimiento" },
      ],
    },
    {
      name: "observations",
      label: "Observaciones adicionales",
      component: "TEXTAREA",
    },
  ],
};
