import { z } from 'zod';

export const loginSchema = z.object({
  user: z.string().trim().min(1, 'Debe ingresar el usuario'),
  password: z.string().trim().min(1, 'Debe ingresar la contraseña'),
});

export const validateLoginForm = (form = {}) => {
  const result = loginSchema.safeParse({
    user: form.user ?? '',
    password: form.password ?? '',
  });

  if (result.success) {
    return { isValid: true, errors: {}, data: result.data };
  }

  const errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }

  return { isValid: false, errors };
};