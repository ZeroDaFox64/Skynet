import { z } from "zod";

export const authRule = z.object({
  email: z.string().email({ message: "Correo Electrónico no válido" }),
  password: z.string().min(1, { message: "La contrasaña es obligatoria" }),
});

export const changePasswordRule = z.object({
  password: z
    .string()
    .min(1, { message: "La contrasaña actual es obligatoria" }),
  new_password: z
    .string()
    .min(1, { message: "La nueva contraseña es obligatoria" })
    .refine(
      (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value),
      {
        message:
          "La contraseña debe tener al menos 8 caracteres, una letra minúscula, una mayúscula, un número y un carácter especial.",
      }
    ),
});

export const changeUsernameRule = z.object({
  username: z
    .string()
    .min(1, { message: "El nombre de usuario es obligatorio" }),
});

export const registerRule = z
  .object({
    email: z.string().email({ message: "Correo Electrónico no válido" }),
    username: z
      .string()
      .min(1, { message: "El nombre de usuario es obligatorio" }),
    password: z
      .string()
      .min(1, { message: "La contraseña es obligatoria" })
      .refine(
        (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value),
        {
          message:
            "La contraseña debe tener al menos 8 caracteres, una letra minúscula, una mayúscula, un número y un carácter especial.",
        }
      ),
    password_confirmation: z
      .string()
      .min(1, { message: "La contraseña de confirmación es obligatoria" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

export const forgotPasswordRule = z.object({
  email: z.string().email({ message: "Correo Electrónico no válido" }),
});

export const resetPasswordRule = z
  .object({
    password: z
      .string()
      .min(1, { message: "La contraseña es obligatoria" })
      .refine(
        (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value),
        {
          message:
            "La contraseña debe tener al menos 8 caracteres, una letra minúscula, una mayúscula, un número y un carácter especial.",
        }
      ),
    confirm_password: z
      .string()
      .min(1, { message: "La contraseña de confirmación es obligatoria" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });
