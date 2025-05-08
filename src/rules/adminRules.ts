import { z } from "zod";

export const adminRegisterRule = z
  .object({
    email: z.string().email({ message: "Correo Electrónico no válido" }),
    username: z
      .string()
      .min(1, { message: "El nombre de usuario es obligatorio" }),
    name: z.string().optional(),
    lastname: z.string().optional(),
    phone: z.string().optional(),
  })