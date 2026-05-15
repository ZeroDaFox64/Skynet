/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { Edit } from '../../../components/admin/actions';

export const companyTableConfig = {
  name: "Empresas",
  columns: [
    {
      name: "Acciones",
      key: "actions",
      handlerValue: (value: any) => {
        return (
          <Edit entity="company" id={value?.id} />
        );
      },
    },
    {
      name: "RIF",
      key: "rif",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        return value;
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
  ],
};

export const companyFormConfig = {
  name: "Registrar una nueva empresa",
  description: "Registro de empresas aliadas o clientes",
  fields: [
    {
      name: "rif",
      label: "RIF",
      component: "TEXT",
      required: true,
    },
    {
      name: "name",
      label: "Nombre de la empresa",
      component: "TEXT",
      required: true,
    },
    {
      name: "email",
      label: "Correo electrónico",
      component: "TEXT",
      required: true,
    },
    {
      name: "phone",
      label: "Teléfono",
      component: "TEXT",
      required: true,
    },
    {
      name: "address",
      label: "Dirección",
      component: "TEXT",
      required: true,
    },
    {
      name: "city",
      label: "Ciudad",
      component: "TEXT",
      required: true,
    },
    {
      name: "state",
      label: "Estado / Provincia",
      component: "TEXT",
      required: true,
    },
    {
      name: "country",
      label: "País",
      component: "TEXT",
      required: true,
    },
    {
      name: "description",
      label: "Descripción de la empresa",
      component: "TEXTAREA",
      required: true,
    },
  ],
};
