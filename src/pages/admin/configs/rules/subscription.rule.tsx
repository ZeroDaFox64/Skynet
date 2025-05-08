import { z } from "zod";

export const subscriptionRule = z.object({
  // Requeridos
  user: z.string(),
  type: z.string(),
  service: z.string(),
  contract_date: z.string(),
  // Opcionales
  account: z.string().optional(),
  pin: z
    .string()
    .max(6, { message: "La contraseña no puede tener más de 6 caracteres" })
    .nullable()
    .optional(),
  nickname: z
    .string()
    .max(20, { message: "El nickname no puede tener más de 20 caracteres" })
    .nullable()
    .optional(),
  pay_status: z.string().nullable().optional(),
  observations: z
    .string()
    .max(500, {
      message: "Las observaciones no pueden tener más de 500 caracteres",
    })
    .nullable()
    .optional(),
  cutoff_date: z.string().optional(),
  cutoff_number: z
    .coerce.number()
    .refine((val) => val >= 1, {
      message: "El valor debe ser mayor que 0",
    })
    .refine((val) => val <= 24, {
      message: "El valor debe ser menor que 24",
    })
    .optional(),
});
