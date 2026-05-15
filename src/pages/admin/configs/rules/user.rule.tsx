import { z } from "zod";

export const userRule = z.object({
  // Requeridos
  email: z
    .string({
      required_error: "El correo electrónico es requerido",
      invalid_type_error: "El correo electrónico debe ser un texto",
    })
    .email("El correo electrónico no es válido"),
  role: z.string(),
  // Opcionales
  company_id: z.coerce.number().optional().nullable(),
  name: z.string()
    .max(30, "El nombre no puede tener más de 30 caracteres")
    .nullable()
    .optional(),
});