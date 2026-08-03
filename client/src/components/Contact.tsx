import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import SubmissionSuccessMessage from "@/components/SubmissionSuccessMessage";
import SubmissionErrorMessage from "@/components/SubmissionErrorMessage";
import { Phone, Mail, MapPin, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { createContactInquirySchema, type ContactInquiryInput } from "@/lib/forms";
import { THERAPIST_EMAIL, THERAPIST_PHONE_HREF } from "@/lib/contactDetails";
import { submitWebsiteForm } from "@/lib/formSubmission";

export default function Contact() {
  const { t, i18n } = useTranslation("contact");
  const startedAtRef = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const validationSchema = useMemo(() => createContactInquirySchema(t), [t]);

  const form = useForm<ContactInquiryInput>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      preferredContact: ""
    }
  });

  const handleSubmit = async (data: ContactInquiryInput) => {
    setSuccessMessageVisible(false);
    setErrorMessageVisible(false);

    try {
      await submitWebsiteForm({
        formType: "contact",
        language: i18n.language,
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferredContact: data.preferredContact,
        preferredContactLabel: data.preferredContact
          ? t(`contact_methods.${data.preferredContact}`)
          : undefined,
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
      console.error("Error submitting form:", error);
      setErrorMessageVisible(true);
    }
  };

  return (
    <section className="py-16 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4" data-testid="contact-title">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="contact-subtitle">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="form-title">{t('form.title')}</CardTitle>
            </CardHeader>
            <CardContent>
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
                              data-testid="input-name"
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
                              data-testid="input-email"
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
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.contact_method')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-contact-preference">
                              <SelectValue placeholder={t('form.contact_method_placeholder')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">{t('contact_methods.email')}</SelectItem>
                            <SelectItem value="phone">{t('contact_methods.phone')}</SelectItem>
                            <SelectItem value="either">{t('contact_methods.either')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("form.message")} ({t("form.required")})
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            required
                            placeholder={t('form.message_placeholder')}
                            rows={4}
                            data-testid="textarea-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={form.formState.isSubmitting}
                    data-testid="button-submit-form"
                  >
                    {form.formState.isSubmitting ? t("form.sending") : t("form.submit")}
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
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle data-testid="contact-info-title">{t('info.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-foreground">{t('contact_methods.phone')}</p>
                    <a
                      href={THERAPIST_PHONE_HREF}
                      className="inline-flex min-h-11 items-center rounded-sm text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      data-testid="contact-phone"
                    >
                      {t("info.phone")}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-foreground">{t('contact_methods.email')}</p>
                    <a
                      href={`mailto:${THERAPIST_EMAIL}`}
                      className="inline-flex min-h-11 items-center rounded-sm text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      data-testid="contact-email"
                    >
                      {t("info.email")}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-foreground">{t('info.address')}</p>
                    <p className="text-muted-foreground" data-testid="contact-address">
                      {t('info.address_line1')}<br />
                      {t('info.address_line2')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-foreground">{t('info.hours')}</p>
                    <p className="text-muted-foreground" data-testid="contact-hours">
                      {t('info.hours_by_appointment')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2" data-testid="emergency-title">
                  {t('emergency.title')}
                </h3>
                <p className="text-sm text-muted-foreground mb-3" data-testid="emergency-description">
                  {t('emergency.description')}
                </p>
                <ul className="text-sm space-y-1">
                  <li data-testid="emergency-hotline">{t('emergency.crisis_hotline')}</li>
                  <li data-testid="emergency-911">{t('emergency.emergency_services')}</li>
                  <li data-testid="emergency-text">{t('emergency.crisis_text')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
