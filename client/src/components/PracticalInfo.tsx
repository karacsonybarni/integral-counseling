import { Clock3, CreditCard, Laptop, RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PracticalInfo() {
  const { t } = useTranslation("home");
  const details = ["duration", "firstSession", "format", "cancellation"] as const;
  const questions = ["existential", "spiritualScope"] as const;

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="section-kicker">{t("practical.eyebrow")}</p>
            <h2 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight tracking-[-0.025em] text-foreground sm:text-5xl">
              {t("practical.title")}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t("practical.subtitle")}
            </p>
          </div>

          <dl className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2">
            {details.map((detail, index) => {
              const Icon = [Clock3, CreditCard, Laptop, RefreshCcw][index];
              return (
                <div key={detail} className="bg-card p-7 sm:p-8">
                  <Icon className="h-6 w-6 text-primary" strokeWidth={1.7} aria-hidden="true" />
                  <dt className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {t(`practical.details.${detail}.label`)}
                  </dt>
                  <dd className="mt-2 text-lg font-semibold leading-snug text-foreground">
                    {t(`practical.details.${detail}.value`)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div className="mt-16 grid gap-10 border-t border-border pt-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="section-kicker">{t("practical.faq.eyebrow")}</p>
            <h3 className="mt-4 font-serif text-3xl text-foreground sm:text-4xl">
              {t("practical.faq.title")}
            </h3>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {questions.map((question) => (
              <AccordionItem key={question} value={question}>
                <AccordionTrigger className="py-5 text-left text-lg text-foreground hover:no-underline">
                  {t(`practical.faq.items.${question}.question`)}
                </AccordionTrigger>
                <AccordionContent className="max-w-3xl pb-5 text-base leading-relaxed text-muted-foreground">
                  {t(`practical.faq.items.${question}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
