import { z } from "zod";

const optionalTrimmedString = z
  .string()
  .optional()
  .transform((value) => value?.trim() || undefined);

export const contactInquirySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z.string().email("Please enter a valid email address").trim(),
  phone: optionalTrimmedString,
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message must be less than 2000 characters")
    .trim(),
  preferredContact: optionalTrimmedString,
});

export const appointmentSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z.string().email("Please enter a valid email address").trim(),
  phone: optionalTrimmedString,
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
  message: optionalTrimmedString,
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
