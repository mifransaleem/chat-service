import { z } from "zod";

export const firstOneToOneMessage = z.object({
  name: z.string(),
  password: z
    .string()
    .min(6)
    .max(32, "Password must be between 6 and 32 characters"),
  email: z.string().email(),
});

export type Signup = z.infer<typeof firstOneToOneMessage>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6)
    .max(32, "Password must be between 6 and 32 characters"),
});

export type Login = z.infer<typeof loginSchema>;
