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
      handlerValue: (value: any) => {
        return (
          <Edit entity="user" id={value?.id} />
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
      name: "Rol",
      key: "role",
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
      name: "Fecha de registro",
      key: "createdAt",
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        return moment(value).format("DD/MM/YYYY");
      },
    },
    {
      name: "Última modificación",
      key: "updatedAt",
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
      name: "password",
      label: "Contraseña",
      component: "TEXT",
      required: true,
    },
    {
      name: "role",
      label: "Rol",
      required: true,
      component: "SELECT",
      default: "user",
      options: [
        { value: "user", label: "Usuario" },
        { value: "admin", label: "Administrador", disabled: true },
      ],
    },
    {
      name: "name",
      label: "Nombre",
      component: "TEXT",
    },
    {
      name: "company_id",
      label: "Empresa",
      component: "ASYNC_SELECT",
      endpoint: "/company",
      key: "companies",
      title: "name",
      value: "id",
    },
  ],
};
