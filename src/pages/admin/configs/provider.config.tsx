/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { Edit } from "../../../components/admin/actions";

export const providerTableConfig = {
  name: "Proveedores",
  columns: [
    {
      name: "Acciones",
      key: "actions",
      handlerValue: (value: any) => {
        return (
          <div className="flex gap-2">
            <Edit entity="provider" id={value?._id} />
          </div>
        );
      },
    },
    {
      name: "Nombre",
      key: "name",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        if (value.length > 30) return value.substring(0, 50) + "...";
        return value;
      },
    },
    {
      name: "Contacto",
      key: "contact",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        if (value.length > 20) return value.substring(0, 50) + "...";
        return value;
      },
    },
    {
      name: "Descripción",
      key: "description",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        if (value.length > 20) return value.substring(0, 50) + "...";
        return value;
      },
    },
    {
      name: "Fecha de creación",
      key: "createdAt",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value !== "string") return '-'
        return moment(value).format("DD/MM/YYYY");
      },
    },
  ],
};

export const providerFormConfig = {
  name: "Registrar un nuevo proveedor",
  description: "Proveedores nuevos",
  fields: [
    {
      name: "name",
      label: "Nombre del proveedor",
      component: "TEXT",
      required: true,
    },
    {
      name: "contact",
      label: "Medios de contacto",
      component: "TEXT",
      required: true,
    },
    {
      name: "description",
      label: "Descripción o detalles del proveedor",
      component: "TEXTAREA",
    },
  ],
};
