import { ArrowDownRight, Braces, Compass, Mountain } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation("about");
  const facts = ["training", "background", "languages"] as const;

  return (
    <section className="bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="section-kicker">{t("eyebrow")}</p>
            <h2
              className="mt-4 text-balance font-serif text-4xl font-medium leading-tight tracking-[-0.025em] text-foreground sm:text-5xl"
              data-testid="about-title"
            >
              {t("title")}
            </h2>
            <ArrowDownRight className="mt-8 hidden h-10 w-10 text-accent lg:block" aria-hidden="true" />
          </div>

          <div>
            <p className="max-w-3xl font-serif text-2xl leading-relaxed text-foreground sm:text-3xl" data-testid="about-subtitle">
              {t("lead")}
            </p>
            <div className="mt-8 grid gap-6 text-base leading-relaxed text-muted-foreground sm:grid-cols-2">
              <p>{t("story.systems")}</p>
              <p>{t("story.integral")}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-3">
          {facts.map((fact, index) => {
            const Icon = [Compass, Braces, Mountain][index];
            return (
              <div key={fact} className="bg-background p-7 sm:p-8">
                <Icon className="h-6 w-6 text-primary" strokeWidth={1.7} aria-hidden="true" />
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {t(`facts.${fact}.label`)}
                </p>
                <p className="mt-2 text-lg font-semibold leading-snug text-foreground" data-testid={`about-fact-${fact}`}>
                  {t(`facts.${fact}.value`)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 grid items-start gap-8 border-t border-border pt-10 lg:grid-cols-[0.8fr_1.2fr]">
          <h3 className="font-serif text-3xl text-foreground">{t("beyond.title")}</h3>
          <div>
            <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground" data-testid="personal-note">
              {t("beyond.description")}
            </p>
            <p className="mt-6 border-l-2 border-accent pl-5 text-sm leading-relaxed text-muted-foreground">
              {t("boundary")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
