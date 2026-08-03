import { z } from "zod";

const optionalTrimmedString = z
  .string()
  .optional()
  .transform((value) => value?.trim() || undefined);

type ValidationKey =
  | "validation.name_required"
  | "validation.name_too_long"
  | "validation.email_invalid"
  | "validation.message_required"
  | "validation.message_too_long"
  | "validation.date_required"
  | "validation.time_required";

type ValidationTranslator = (key: ValidationKey) => string;

export function createContactInquirySchema(t: ValidationTranslator) {
  return z.object({
    name: z
      .string()
      .min(1, t("validation.name_required"))
      .max(100, t("validation.name_too_long"))
      .trim(),
    email: z.string().email(t("validation.email_invalid")).trim(),
    phone: optionalTrimmedString,
    message: z
      .string()
      .min(1, t("validation.message_required"))
      .max(2000, t("validation.message_too_long"))
      .trim(),
    preferredContact: optionalTrimmedString,
  });
}

export function createAppointmentSchema(t: ValidationTranslator) {
  return z.object({
    name: z
      .string()
      .min(1, t("validation.name_required"))
      .max(100, t("validation.name_too_long"))
      .trim(),
    email: z.string().email(t("validation.email_invalid")).trim(),
    phone: optionalTrimmedString,
    preferredDate: z.string().min(1, t("validation.date_required")),
    preferredTime: z.string().min(1, t("validation.time_required")),
    message: optionalTrimmedString,
  });
}

export type ContactInquiryInput = z.infer<
  ReturnType<typeof createContactInquirySchema>
>;
export type AppointmentInput = z.infer<ReturnType<typeof createAppointmentSchema>>;
