import { z } from "zod";

export const productRule = z.object({
  // Requeridos
  sku: z
    .string({
      required_error: "El código SKU es requerido",
    })
    .max(50, { message: "El código SKU no puede tener más de 50 caracteres" }),
  name: z
    .string({
      required_error: "El nombre es requerido",
    })
    .max(100, { message: "El nombre no puede tener más de 100 caracteres" }),
  price: z
    .number()
    .min(0, { message: "El precio no puede ser negativo" })
    .optional(),
  discount: z
    .number()
    .min(0, { message: "El descuento no puede ser negativo" })
    .optional(),
  product_category: z.string({
    required_error: "La categoría es requerida",
  }),
  genre: z.string({
    required_error: "El género es requerido",
  }),
  // Opcionales
  description: z
    .string()
    .max(500, {
      message: "La descripción no puede tener más de 500 caracteres",
    })
    .optional(),
  link_mercadolibre: z
    .string()
    .max(500, {
      message: "El link a MercadoLibre no puede tener más de 500 caracteres",
    })
    .optional(),
  images: z.any().optional(),
  front_image: z.any().optional(),
  features: z.any().optional(),
});
