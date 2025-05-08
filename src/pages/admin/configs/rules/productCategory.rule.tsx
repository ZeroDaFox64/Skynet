import { z } from "zod";

export const productCategoryRule = z.object({
  // Requeridos
  name: z
    .string({
      required_error: "El nombre es requerido",
    })
    .max(20, { message: "El nombre no puede tener más de 20 caracteres" }),
  // Opcionales
  description: z
    .string()
    .max(1000, {
      message: "La descripción no puede tener más de 1000 caracteres",
    })
    .nullable()
    .optional(),
});
