/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { Chip } from "@heroui/react";
import { Edit } from '../../../components/admin/actions';

import { FaCrown } from "react-icons/fa";

export const userTableConfig = {
  name: "Usuarios",
  columns: [
    { 
      name: "Acciones", 
      key: "actions", 
      handlerValue: (value : any) => {
        return (
          <Edit entity="user" id={value?._id}/>
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
      name: "Teléfono",
      key: "phone",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        const phone = value.replace(/\D/g, '');
        return <a href={`https://api.whatsapp.com/send?phone=${phone}`} target="_blank" rel="noopener noreferrer">+{phone}</a>;
      },
    },
    {
      name: "Nombre de usuario",
      key: "username",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        return value;
      },
    },
    {
      name: "Rol",
      key: "rol",
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        if (value === "superadmin")
          return (
            <Chip color="warning" variant="flat" startContent={<FaCrown />}>
              Super Admin
            </Chip>
          );
        if (value === "admin")
          return (
            <Chip color="warning" variant="flat">
              Admin
            </Chip>
          );
        if (value === "verified user")
          return (
            <Chip color="success" variant="flat">
              Verificado
            </Chip>
          );
        if (value === "user") return <Chip variant="flat">No verificado</Chip>;
      },
    },
    {
      name: "Nombre",
      key: "name",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        return value;
      },
    },
    {
      name: "Apellido",
      key: "lastname",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        return value;
      },
    },
    {
      name: "Fecha de registro",
      key: "created_at",
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        return moment(value).format("DD/MM/YYYY");
      },
    },
  ],
};

export const userFormConfig = {
  name: "Registrar un nuevo usuario",
  description: "Clientes nuevos",
  fields: [
    {
      name: "email",
      label: "Correo electrónico",
      component: "TEXT",
      required: true,
    },
    {
      name: "username",
      label: "Nombre de usuario",
      component: "TEXT",
      required: true,
    },
    {
      name: "rol",
      label: "Rol",
      required: true,
      component: "SELECT",
      default: "user",
      options: [
        { value: "user", label: "No verificado" },
        { value: "verified user", label: "Verificado" },
        { value: "admin", label: "Administrador", disabled: true },
        { value: "superadmin", label: "Super Administrador", disabled: true },
      ],
    },
    {
      name: "name",
      label: "Nombre",
      component: "TEXT",
    },
    {
      name: "lastname",
      label: "Apellido",
      component: "TEXT",
    },
    {
      name: "phone",
      label: "Teléfono",
      component: "TEXT",
    },
    {
      name: "observations",
      label: "Observaciones adicionales",
      component: "TEXTAREA",
    },
  ],
};
