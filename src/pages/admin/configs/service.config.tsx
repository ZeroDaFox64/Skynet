/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { Edit } from "../../../components/admin/actions";
import { Chip } from "@heroui/react";

export const serviceTableConfig = {
  name: "Servicios",
  columns: [
    {
      name: "Acciones",
      key: "actions",
      handlerValue: (value: any) => {
        return (
          <div className="flex gap-2">
            <Edit entity="service" id={value?._id} />
          </div>
        );
      },
    },
    {
      name: "Nombre",
      key: "name",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value === "string") return value;
        return '-'
      },
    },
    {
      name: "Categoria",
      key: "category",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (value === "streaming")
          return (
            <Chip color="primary" variant="flat">
              Streaming
            </Chip>
          );
      },
    },
    {
      name: "Descripción",
      key: "description",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value === "string") return value;
        return '-'
      },
    },
    {
      name: "Fecha de creación",
      key: "createdAt",
      isFilterable: true,
      handlerValue: (value: any) => {
        return moment(value).format("DD/MM/YYYY");
      },
    },
  ],
};

export const serviceFormConfig = {
  name: "Registrar un nuevo servicio",
  description: "Servicios nuevos",
  fields: [
    {
      name: "name",
      label: "Nombre",
      component: "TEXT",
      required: true,
    },
    {
      name: "category",
      label: "Categoria",
      default: "streaming",
      component: "SELECT",
      required: true,
      options: [{ value: "streaming", label: "Servicio de streaming" }],
    },
    {
      name: "description",
      label: "Descripción del servicio",
      component: "TEXTAREA",
    },
  ],
};
