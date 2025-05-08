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
            <Edit entity="product" id={value?._id} />
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
  ],
};

export const productFormConfig = {
  name: "Registrar un nuevo producto",
  description: "Productos nuevos",
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
      component: "ASYNC_SELECT",
      endpoint: "/productCategory",
      default: "",
      key: "productCategories",
      title: "name",
      value: "_id",
      required: true,
    },
    {
      name: "price",
      label: "Precio unitario",
      component: "NUMBER",
      default: 1,
      required: true,
      minValue: 1,
      maxValue: 1000,
      startContent: "$",
    },
    {
      name: "discount",
      label: "Descuento porcentual",
      component: "NUMBER",
      default: 0,
      minValue: 0,
      maxValue: 100,
      startContent: "%",
    },
    {
      name: "link_mercadolibre",
      label: "Link a MercadoLibre",
      component: "TEXT",
      default: "",
    },
    {
      name: "genre",
      label: "Géneros",
      component: "TEXT",
      default: "",
    },
    {
      name: "description",
      label: "Descripción",
      component: "TEXTAREA",
      default: "",
    },
    {
      name: "features",
      label: "Características del producto",
      component: "FEATURES",
      default: [],
    },
    {
      name: "front_image",
      label: "Imagen frontal del producto",
      component: "IMAGE",
      required: true,
      default: "",
    },
    {
      name: "images",
      label: "Imágenes del producto",
      component: "IMAGE",
      multiple: true,
      default: [],
    },
  ],
};
