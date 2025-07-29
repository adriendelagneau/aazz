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




export const paragraphSchema = z.object({
  content: z.string().min(1, "Paragraph content is required"),
  order: z.number().int().nonnegative(),
});

export const partSchema = z.object({
  title: z.string().optional(),
  order: z.number().int().nonnegative(),
  paragraphs: z.array(paragraphSchema).min(1, "At least one paragraph is required"),
});

export const articleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  excerpt: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  isBreaking: z.boolean().optional(),
  tagIds: z.array(z.string().uuid()),
  parts: z.array(partSchema).min(1, "At least one part is required"),
  asset: z
    .object({
      type: z.enum(["IMAGE", "VIDEO", "AUDIO"]),
      url: z.string().url("Valid URL required"),
      legend: z.string().optional(),
      altText: z.string().optional(),
    })
    .optional(),
});

export type ArticleSchema = z.infer<typeof articleSchema>;

export const authorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  userId: z.string().min(1, "User ID is required"),
});

export type AuthorSchema = z.infer<typeof authorSchema>;






export const assetSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO"]),
  url: z.string().url("Invalid asset URL"),
  legend: z.string().optional(),
  altText: z.string().optional(),
});

export const videoShortSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  duration: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Duration must be a positive number",
    }),
  asset: assetSchema, // contains the url now
});

export type VideoShortInput = z.infer<typeof videoShortSchema>;