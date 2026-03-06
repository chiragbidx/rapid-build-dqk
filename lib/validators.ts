import { z } from "zod";

export const copyFromInfoSchema = z.object({
  type: z.literal("info"),
  productName: z.string().min(2).max(50),
  productDesc: z.string().min(5).max(500),
});

export const copyFromUrlSchema = z.object({
  type: z.literal("url"),
  websiteUrl: z
    .string()
    .url()
    .refine((val) => /^https?:\/\//.test(val), { message: "Must be a valid http(s) URL." }),
});