import { z } from "zod";

export const userRule = z.object({
  // Requeridos
  email: z
    .string({
      required_error: "El correo electrónico es requerido",
      invalid_type_error: "El correo electrónico debe ser un texto",
    })
    .email("El correo electrónico no es válido"),
  username: z
    .string({
      required_error: "El nombre de usuario es requerido",
      invalid_type_error: "El nombre de usuario debe ser un texto",
    })
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(10, "El nombre de usuario no puede tener más de 10 caracteres"),
  rol: z.string(),
  // Opcionales
  phone: z
    .string({
      invalid_type_error: "El número de teléfono debe ser un texto",
    })
    .regex(/^\d{1,3}\d{7,14}$/, {
      message:
        "El número de teléfono debe tener el formato [código de país][número de suscriptor]",
    })
    .optional(),
  name: z.string()
    .max(30, "El nombre no puede tener más de 30 caracteres")
    .nullable()
    .optional(),
  lastname: z.string()
    .max(30, "El apellido no puede tener más de 30 caracteres")
    .nullable()
    .optional(),
  observations: z.string().nullable().optional(),
});