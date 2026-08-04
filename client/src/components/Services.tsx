import { ArrowRight, Eye, Footprints, Layers3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { scrollToSection } from "@/lib/routing";

export default function Services() {
  const { t } = useTranslation("services");
  const themes = ["direction", "patterns", "overload", "values"] as const;
  const principles = ["notice", "understand", "move"] as const;

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="section-kicker">{t("eyebrow")}</p>
          <h2
            className="mt-4 text-balance font-serif text-4xl font-medium leading-tight tracking-[-0.025em] text-foreground sm:text-5xl lg:text-6xl"
            data-testid="services-title"
          >
            {t("title")}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground" data-testid="services-subtitle">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-14 grid border-y border-border md:grid-cols-2">
          {themes.map((theme, index) => (
            <article
              key={theme}
              className={`group py-8 md:p-10 ${index % 2 === 0 ? "md:border-r md:border-border" : ""} ${index < 2 ? "border-b border-border" : ""}`}
            >
              <div className="flex items-start gap-5">
                <span className="mt-1 font-mono text-xs font-semibold tracking-[0.15em] text-accent">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-serif text-2xl leading-snug text-foreground" data-testid={`theme-${theme}-title`}>
                    {t(`themes.${theme}.title`)}
                  </h3>
                  <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">
                    {t(`themes.${theme}.description`)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 overflow-hidden rounded-[2rem] bg-foreground text-background sm:mt-28">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative overflow-hidden border-b border-background/15 p-8 sm:p-12 lg:border-b-0 lg:border-r">
              <div className="approach-ring" aria-hidden="true" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {t("approach.eyebrow")}
              </p>
              <h3 className="relative mt-5 max-w-lg text-balance font-serif text-4xl leading-tight sm:text-5xl" data-testid="approach-title">
                {t("approach.title")}
              </h3>
              <p className="relative mt-6 max-w-xl text-lg leading-relaxed text-background/70" data-testid="approach-description">
                {t("approach.description")}
              </p>
            </div>

            <div className="p-8 sm:p-12">
              {principles.map((principle, index) => {
                const Icon = [Eye, Layers3, Footprints][index];
                return (
                  <div
                    key={principle}
                    className={`grid grid-cols-[auto_1fr] gap-5 py-7 ${index > 0 ? "border-t border-background/15" : "pt-0"}`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-background/20 text-accent">
                      <Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold">{t(`approach.principles.${principle}.title`)}</h4>
                      <p className="mt-2 leading-relaxed text-background/65">
                        {t(`approach.principles.${principle}.description`)}
                      </p>
                    </div>
                  </div>
                );
              })}

              <a
                href="#appointment-booking"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection("appointment-booking");
                }}
                className="group mt-5 inline-flex min-h-12 items-center rounded-full bg-accent px-6 py-3 font-semibold text-foreground transition hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
                data-testid="button-learn-more-individual"
              >
                {t("approach.cta")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 sm:mt-28">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="section-kicker">{t("process.eyebrow")}</p>
              <h3 className="mt-4 font-serif text-4xl text-foreground">{t("process.title")}</h3>
            </div>
            <ol className="grid gap-8 sm:grid-cols-3">
              {["contact", "first", "continue"].map((step, index) => (
                <li key={step} className="border-t border-border pt-5">
                  <span className="font-mono text-xs font-semibold text-accent">0{index + 1}</span>
                  <h4 className="mt-4 text-lg font-semibold text-foreground">{t(`process.steps.${step}.title`)}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`process.steps.${step}.description`)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
