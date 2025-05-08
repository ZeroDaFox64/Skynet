/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { Edit } from "../../../components/admin/actions";

export const productCategoryTableConfig = {
  name: "Categorías de productos",
  columns: [
    {
      name: "Acciones",
      key: "actions",
      handlerValue: (value: any) => {
        return (
          <div className="flex gap-2">
            <Edit entity="productCategory" id={value?._id} />
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
}
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

export const productCategoryFormConfig = {
  name: "Registrar una nueva categoría de producto",
  description: "Categorías de productos nuevos",
  fields: [
    {
      name: "name",
      label: "Nombre de la categoría",
      component: "TEXT",
      required: true,
    },
    {
      name: "description",
      label: "Descripción o detalles de la categoría",
      component: "TEXTAREA",
    },
  ],
};
