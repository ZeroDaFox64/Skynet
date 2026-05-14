import { z } from "zod";

export const productRule = z.object({
  // Requeridos
  sku: z
    .string({
      required_error: "El código SKU es requerido",
    })
    .max(100, { message: "El código SKU no puede tener más de 100 caracteres" }),
  name: z
    .string({
      required_error: "El nombre es requerido",
    })
    .max(255, { message: "El nombre no puede tener más de 255 caracteres" }),
  price: z.coerce
    .number({
      required_error: "El precio es requerido",
      invalid_type_error: "El precio debe ser un número",
    })
    .min(0, { message: "El precio no puede ser negativo" }),
  product_category: z.enum(['bebida', 'hamburguesa', 'pollo', 'pizza', 'postre', 'otros'], {
    errorMap: () => ({ message: "Categoría no válida" }),
  }),
  // Opcionales
  description: z
    .string()
    .optional(),
  front_image: z.string().optional(),
});
