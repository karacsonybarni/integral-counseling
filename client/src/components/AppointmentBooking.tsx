import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import SubmissionSuccessMessage from "@/components/SubmissionSuccessMessage";
import SubmissionErrorMessage from "@/components/SubmissionErrorMessage";
import { Calendar, Clock, ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { createAppointmentSchema, type AppointmentInput } from "@/lib/forms";
import { THERAPIST_EMAIL } from "@/lib/contactDetails";
import { submitWebsiteForm } from "@/lib/formSubmission";

export default function AppointmentBooking() {
  const { t, i18n } = useTranslation("appointment");
  const startedAtRef = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const validationSchema = useMemo(() => createAppointmentSchema(t), [t]);

  const form = useForm<AppointmentInput>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      message: ""
    }
  });

  // Available time slots use locale-neutral values and localized display labels.
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  // Generate available dates (next 30 weekdays)
  const getAvailableDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow

    while (dates.length < 30) {
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const availableDates = getAvailableDates();
  const bookingDetails = [
    { key: "duration", icon: Clock },
    { key: "format", icon: MapPin },
    { key: "reply", icon: MessageCircle },
  ] as const;

  const handleSubmit = async (data: AppointmentInput) => {
    setSuccessMessageVisible(false);
    setErrorMessageVisible(false);

    try {
      await submitWebsiteForm({
        formType: "appointment",
        language: i18n.language,
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferredDate: data.preferredDate,
        preferredDateLabel: formatDateValue(data.preferredDate),
        preferredTime: formatTimeValue(data.preferredTime),
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
    } catch (error) {
      console.error("Error booking appointment:", error);
      setErrorMessageVisible(true);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language === "hu" ? "hu-HU" : "en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
  };

  const getDateValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDateValue = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return formatDate(new Date(year, month - 1, day));
  };

  const formatTimeValue = (value: string) => {
    const [hour, minute] = value.split(":").map(Number);
    return new Intl.DateTimeFormat(i18n.language === "hu" ? "hu-HU" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(2000, 0, 1, hour, minute));
  };

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

        <Card className="rounded-3xl border-border/80 bg-background shadow-[0_24px_70px_-48px_hsl(var(--foreground)/0.45)]">
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
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("form.name")} ({t("form.required")})
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            autoComplete="name"
                            required
                            placeholder={t("form.name_placeholder")}
                            data-testid="input-booking-name"
                          />
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
                        <FormLabel>
                          {t("form.email")} ({t("form.required")})
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            autoComplete="email"
                            required
                            placeholder={t("form.email_placeholder")}
                            data-testid="input-booking-email"
                          />
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
                      <FormLabel>{t('form.phone')}</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          {...field}
                          autoComplete="tel"
                          placeholder={t("form.phone_placeholder")}
                          className="max-w-xs"
                          data-testid="input-booking-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date and Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="preferredDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("form.date")} ({t("form.required")})
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger
                              aria-required="true"
                              data-testid="select-booking-date"
                            >
                              <SelectValue placeholder={t('form.date_placeholder')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableDates.map((date) => (
                              <SelectItem key={getDateValue(date)} value={getDateValue(date)}>
                                {formatDate(date)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("form.time")} ({t("form.required")})
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger
                              aria-required="true"
                              data-testid="select-booking-time"
                            >
                              <SelectValue placeholder={t('form.time_placeholder')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" aria-hidden="true" />
                                  {formatTimeValue(time)}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.message')}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={t('form.message_placeholder')}
                          rows={3}
                          data-testid="textarea-booking-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit" 
                  className="group min-h-12 w-full rounded-full text-base"
                  disabled={form.formState.isSubmitting}
                  data-testid="button-book-appointment"
                >
                  {form.formState.isSubmitting ? t("form.booking") : t("form.submit")}
                  <ArrowRight className="ml-2 h-4 w-4 motion-safe:group-hover:translate-x-1 motion-safe:transition-transform" aria-hidden="true" />
                </Button>

                {successMessageVisible && (
                  <SubmissionSuccessMessage
                    title={t("success.title")}
                    description={t("success.description")}
                  />
                )}

                {errorMessageVisible && (
                  <SubmissionErrorMessage
                    title={t("error.title")}
                    description={t("error.description")}
                    email={THERAPIST_EMAIL}
                    emailAction={t("error.email_action", {
                      email: THERAPIST_EMAIL,
                    })}
                  />
                )}

                {/* Disclaimer */}
                <div className="rounded-2xl bg-muted/50 p-4 text-center text-sm leading-relaxed text-muted-foreground">
                  <p data-testid="booking-disclaimer">
                    {t('disclaimer')}
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
