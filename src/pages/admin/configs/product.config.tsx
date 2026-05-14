/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit } from "../../../components/admin/actions";

export const productTableConfig = {
  name: "Productos",
  columns: [
    {
      name: "Acciones",
      key: "actions",
      handlerValue: (value: any) => {
        return (
          <div className="flex gap-2">
            <Edit entity="product" id={value?.id} />
          </div>
        );
      },
    },
    {
      name: "SKU",
      key: "sku",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value === "string") return value;
        return '-'
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
      name: "Categoría",
      key: "product_category",
      isFilterable: true,
      handlerValue: (value: any) => {
        if (typeof value === "string") return value;
        return '-'
      },
    },
    {
      name: "Precio",
      key: "price",
      handlerValue: (value: any) => {
        return `$${value}`;
      },
    },
  ],
};

export const productFormConfig = {
  name: "Registrar un nuevo producto",
  description: "Gestión de productos del catálogo",
  fields: [
    {
      name: "sku",
      label: "Código SKU",
      component: "TEXT",
      required: true,
      default: "",
    },
    {
      name: "name",
      label: "Nombre del producto",
      component: "TEXT",
      required: true,
      default: "",
    },
    {
      name: "product_category",
      label: "Categoría",
      component: "SELECT",
      required: true,
      options: [
        { value: "bebida", label: "Bebida" },
        { value: "hamburguesa", label: "Hamburguesa" },
        { value: "pollo", label: "Pollo" },
        { value: "pizza", label: "Pizza" },
        { value: "postre", label: "Postre" },
        { value: "otros", label: "Otros" },
      ],
    },
    {
      name: "price",
      label: "Precio unitario",
      component: "NUMBER",
      default: 1,
      required: true,
      minValue: 0,
      step: 0.01,
      maxValue: 1000000,
      startContent: "$",
    },
    {
      name: "description",
      label: "Descripción",
      component: "TEXTAREA",
      default: "",
    },
    {
      name: "front_image",
      label: "Imagen del producto (URL)",
      component: "TEXT",
      default: "",
    },
  ],
};
