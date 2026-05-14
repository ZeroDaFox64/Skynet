import { z } from "zod";

export const companyRule = z.object({
  rif: z.string({ required_error: "El RIF es requerido" }),
  name: z.string({ required_error: "El nombre de la empresa es requerido" }),
  email: z.string({ required_error: "El correo electrónico es requerido" }).email("Correo electrónico inválido"),
  phone: z.string({ required_error: "El teléfono es requerido" }),
  address: z.string({ required_error: "La dirección es requerida" }),
  city: z.string({ required_error: "La ciudad es requerida" }),
  state: z.string({ required_error: "El estado o provincia es requerido" }),
  country: z.string({ required_error: "El país es requerido" }),
  description: z.string({ required_error: "La descripción es requerida" }),
});
