import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),

  email: z.email("Invalid email")
    .min(1, "Email is required"),

  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password cannot exceed 32 characters"),

  confirmPassword: z.string()
    .min(8, "Confirm Password must be at least 8 characters")
    .max(32, "Confirm Password cannot exceed 32 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = z.object({
  email: z.email("Invalid email")
    .min(1, "Email is required"),

  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password cannot exceed 32 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email")
    .min(1, "Email is required"),
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password cannot exceed 32 characters"),

  confirmPassword: z.string()
    .min(8, "Confirm Password must be at least 8 characters")
    .max(32, "Confirm Password cannot exceed 32 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


