import { z } from "zod";

export const serviceRule = z.object({
  // Requeridos
  name: z
    .string({
      required_error: "El nombre es requerido",
    })
    .max(20, { message: "El nombre no puede tener más de 20 caracteres" }),
  category: z.string({
    required_error: "La categoría es requerida",
  }),
  // Opcionales
  description: z
    .string()
    .max(500, {
      message: "La descripción no puede tener más de 500 caracteres",
    })
    .nullable()
    .optional(),
});
