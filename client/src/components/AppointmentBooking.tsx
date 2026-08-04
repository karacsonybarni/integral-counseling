import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import SubmissionSuccessMessage from "@/components/SubmissionSuccessMessage";
import SubmissionErrorMessage from "@/components/SubmissionErrorMessage";
import { AlertCircle, ArrowRight, Calendar, Clock, LoaderCircle, MapPin, MessageCircle, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { createAppointmentSchema, type AppointmentInput } from "@/lib/forms";
import { THERAPIST_EMAIL } from "@/lib/contactDetails";
import {
  submitWebsiteForm,
  WebsiteFormSubmissionError,
} from "@/lib/formSubmission";
import {
  getCalendarAvailability,
  type CalendarAvailability,
} from "@/lib/calendarAvailability";
import { cn } from "@/lib/utils";

const DEFAULT_TIME_ZONE = "Europe/Budapest";

export default function AppointmentBooking() {
  const { t, i18n } = useTranslation("appointment");
  const startedAtRef = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const [slotConflict, setSlotConflict] = useState(false);
  const [availability, setAvailability] = useState<CalendarAvailability>({
    slots: [],
    timeZone: DEFAULT_TIME_ZONE,
  });
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState(false);
  const validationSchema = useMemo(() => createAppointmentSchema(t), [t]);

  const form = useForm<AppointmentInput>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
    },
  });

  const locale = i18n.language === "hu" ? "hu-HU" : "en-US";
  const selectedDate = form.watch("preferredDate");
  const selectedSlot = form.watch("preferredTime");

  const slotsByDate = useMemo(() => {
    const groups = new Map<string, string[]>();

    for (const slot of availability.slots) {
      const dateKey = getDateKey(slot, availability.timeZone);
      const dateSlots = groups.get(dateKey) || [];
      dateSlots.push(slot);
      groups.set(dateKey, dateSlots);
    }

    return groups;
  }, [availability]);

  const availableDates = Array.from(slotsByDate.keys());
  const selectedDateSlots = slotsByDate.get(selectedDate) || [];

  const loadAvailability = useCallback(async () => {
    setAvailabilityLoading(true);
    setAvailabilityError(false);

    try {
      const nextAvailability = await getCalendarAvailability();
      setAvailability(nextAvailability);

      const currentDate = form.getValues("preferredDate");
      const nextDates = nextAvailability.slots.map((slot) =>
        getDateKey(slot, nextAvailability.timeZone),
      );
      if (!currentDate || !nextDates.includes(currentDate)) {
        form.setValue("preferredDate", nextDates[0] || "");
        form.setValue("preferredTime", "");
      }
    } catch (error) {
      console.error("Error loading calendar availability:", error);
      setAvailabilityError(true);
    } finally {
      setAvailabilityLoading(false);
    }
  }, [form]);

  useEffect(() => {
    void loadAvailability();
  }, [loadAvailability]);

  const bookingDetails = [
    { key: "duration", icon: Clock },
    { key: "format", icon: MapPin },
    { key: "calendar", icon: MessageCircle },
  ] as const;

  const clearSubmissionMessages = () => {
    setSuccessMessageVisible(false);
    setErrorMessageVisible(false);
    setSlotConflict(false);
  };

  const handleSubmit = async (data: AppointmentInput) => {
    setSuccessMessageVisible(false);
    setErrorMessageVisible(false);
    setSlotConflict(false);

    try {
      await submitWebsiteForm({
        formType: "appointment",
        language: i18n.language,
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferredDate: data.preferredDate,
        preferredDateLabel: formatSlotDate(data.preferredTime),
        preferredTime: formatSlotTime(data.preferredTime),
        slotStart: data.preferredTime,
        message: data.message,
        startedAt: startedAtRef.current,
        website: honeypotRef.current?.value || "",
      });

      form.reset();
      if (honeypotRef.current) {
        honeypotRef.current.value = "";
      }
      startedAtRef.current = Date.now();
      setSuccessMessageVisible(true);
      await loadAvailability();
    } catch (error) {
      console.error("Error booking appointment:", error);
      const conflict =
        error instanceof WebsiteFormSubmissionError &&
        error.code === "SLOT_UNAVAILABLE";
      setSlotConflict(conflict);
      setErrorMessageVisible(true);

      if (conflict) {
        form.setValue("preferredTime", "");
        await loadAvailability();
      }
    }
  };

  const formatSlotDate = (slot: string) =>
    new Intl.DateTimeFormat(locale, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: availability.timeZone,
    }).format(new Date(slot));

  const formatDateButton = (slot: string) =>
    new Intl.DateTimeFormat(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: availability.timeZone,
    }).format(new Date(slot));

  const formatSlotTime = (slot: string) =>
    new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
      timeZone: availability.timeZone,
    }).format(new Date(slot));

  return (
    <section className="bg-card py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-[0.68fr_1fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-32">
          <p className="section-kicker">{t("eyebrow")}</p>
          <h2 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight tracking-[-0.025em] text-foreground sm:text-5xl" data-testid="booking-title">
            {t("title")}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground" data-testid="booking-subtitle">
            {t("subtitle")}
          </p>

          <ul className="mt-9 space-y-4">
            {bookingDetails.map(({ key, icon: Icon }) => (
              <li key={key} className="flex items-center gap-4 text-foreground">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <span className="font-medium">{t(`details.${key}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        <Card className="min-w-0 rounded-3xl border-border/80 bg-background shadow-[0_24px_70px_-48px_hsl(var(--foreground)/0.45)]">
          <CardHeader className="border-b border-border p-6 sm:p-8">
            <CardTitle className="flex items-center gap-3 font-serif text-2xl font-medium" data-testid="booking-form-title">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              {t("form.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <Form {...form}>
              <form
                noValidate
                aria-busy={form.formState.isSubmitting}
                onSubmit={form.handleSubmit(handleSubmit, () => {
                  setSuccessMessageVisible(false);
                  setErrorMessageVisible(false);
                })}
                className="space-y-6"
              >
                <input
                  ref={honeypotRef}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.name")} ({t("form.required")})</FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="name" required placeholder={t("form.name_placeholder")} data-testid="input-booking-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.email")} ({t("form.required")})</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} autoComplete="email" required placeholder={t("form.email_placeholder")} data-testid="input-booking-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.phone")}</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} autoComplete="tel" placeholder={t("form.phone_placeholder")} className="max-w-xs" data-testid="input-booking-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="rounded-2xl border border-border bg-muted/20 p-4 sm:p-5">
                  {availabilityLoading ? (
                    <div className="flex min-h-32 items-center justify-center gap-3 text-muted-foreground" role="status">
                      <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
                      <span>{t("availability.loading")}</span>
                    </div>
                  ) : availabilityError ? (
                    <div className="flex min-h-32 flex-col items-center justify-center gap-3 text-center" role="alert">
                      <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
                      <p className="text-sm text-muted-foreground">{t("availability.error")}</p>
                      <Button type="button" variant="outline" size="sm" onClick={() => void loadAvailability()}>
                        <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                        {t("availability.retry")}
                      </Button>
                    </div>
                  ) : availableDates.length === 0 ? (
                    <div className="flex min-h-32 flex-col items-center justify-center gap-2 text-center" role="status">
                      <Calendar className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                      <p className="font-medium">{t("availability.empty_title")}</p>
                      <p className="text-sm text-muted-foreground">{t("availability.empty_description")}</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <FormField
                        control={form.control}
                        name="preferredDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.date")} ({t("form.required")})</FormLabel>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label={t("form.date")}>
                              {availableDates.map((dateKey) => {
                                const firstSlot = slotsByDate.get(dateKey)?.[0] || "";
                                return (
                                  <button
                                    key={dateKey}
                                    type="button"
                                    aria-pressed={field.value === dateKey}
                                    onClick={() => {
                                      clearSubmissionMessages();
                                      field.onChange(dateKey);
                                      form.setValue("preferredTime", "", { shouldValidate: true });
                                    }}
                                    className={cn(
                                      "min-h-12 rounded-xl border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                      field.value === dateKey
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border bg-background hover:border-primary/50 hover:bg-primary/5",
                                    )}
                                  >
                                    {formatDateButton(firstSlot)}
                                  </button>
                                );
                              })}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferredTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.time")} ({t("form.required")})</FormLabel>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="group" aria-label={t("form.time")}>
                              {selectedDateSlots.map((slot) => (
                                <button
                                  key={slot}
                                  type="button"
                                  aria-pressed={field.value === slot}
                                  onClick={() => {
                                    clearSubmissionMessages();
                                    field.onChange(slot);
                                  }}
                                  className={cn(
                                    "flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                    field.value === slot
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border bg-background hover:border-primary/50 hover:bg-primary/5",
                                  )}
                                >
                                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                                  {formatSlotTime(slot)}
                                </button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.message")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder={t("form.message_placeholder")} rows={3} data-testid="textarea-booking-message" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="group min-h-12 w-full rounded-full text-base"
                  disabled={form.formState.isSubmitting || availabilityLoading || availabilityError || !selectedSlot}
                  data-testid="button-book-appointment"
                >
                  {form.formState.isSubmitting ? t("form.booking") : t("form.submit")}
                  <ArrowRight className="ml-2 h-4 w-4 motion-safe:group-hover:translate-x-1 motion-safe:transition-transform" aria-hidden="true" />
                </Button>

                {successMessageVisible && (
                  <SubmissionSuccessMessage title={t("success.title")} description={t("success.description")} />
                )}

                {errorMessageVisible && (
                  <SubmissionErrorMessage
                    title={slotConflict ? t("conflict.title") : t("error.title")}
                    description={slotConflict ? t("conflict.description") : t("error.description")}
                    email={THERAPIST_EMAIL}
                    emailAction={t("error.email_action", { email: THERAPIST_EMAIL })}
                  />
                )}

                <div className="rounded-2xl bg-muted/50 p-4 text-center text-sm leading-relaxed text-muted-foreground">
                  <p data-testid="booking-disclaimer">{t("disclaimer")}</p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function getDateKey(slot: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).formatToParts(new Date(slot));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}
