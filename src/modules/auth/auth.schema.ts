import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email noto'g'ri formatda"),
  password: z
    .string()
    .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
  name: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lsin").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email noto'g'ri formatda"),
  password: z.string().min(1, "Parol kiritilishi shart"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken kiritilishi shart"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
