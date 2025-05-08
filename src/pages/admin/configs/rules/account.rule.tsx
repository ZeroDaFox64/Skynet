import { z } from "zod";

export const accountRule = z.object({
  // Requeridos
  email: z.string().email(),
  password: z
    .string()
    .max(20, { message: "La contraseña no puede tener más de 20 caracteres" }),
  service: z.string(),
  provider: z.string(),
  contract_date: z.string(),
  cutoff_date: z.string(),
  // Opcionales
  type: z.string().optional(),
  status: z.string().optional(),
  availability: z.string().optional(),
  maintenance: z.string().optional(),
  observations: z
    .string()
    .max(400, {
      message: "Las observaciones no pueden tener más de 200 caracteres",
    })
    .nullable()
    .optional(),
});
