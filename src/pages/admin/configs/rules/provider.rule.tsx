import { z } from "zod";

export const providerRule = z.object({
  // Requeridos
  name: z
    .string({
      required_error: "El nombre es requerido",
    })
    .max(20, { message: "El nombre no puede tener más de 20 caracteres" }),
  contact: z
    .string({
      required_error: "El contacto es requerido",
    })
    .max(200, { message: "El contacto no puede tener más de 200 caracteres" }),
  // Opcionales
  description: z
    .string()
    .max(1000, {
      message: "La descripción no puede tener más de 1000 caracteres",
    })
    .nullable()
    .optional(),
});
