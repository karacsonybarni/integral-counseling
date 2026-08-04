import { ArrowRight, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import profileImage from "@/assets/barna-armchair.jpeg";
import { scrollToSection } from "@/lib/routing";

export default function Hero() {
  const { t } = useTranslation("home");
  const details = ["duration", "format", "languages"] as const;

  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-background pb-20 pt-10 sm:pb-28 sm:pt-16 lg:pb-32 lg:pt-20">
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            {t("hero.eyebrow")}
          </p>
          <h1
            className="max-w-3xl text-balance font-serif text-5xl font-medium leading-[1.03] tracking-[-0.035em] text-foreground sm:text-6xl lg:text-7xl"
            data-testid="hero-title"
          >
            {t("hero.title")}
          </h1>
          <p
            className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            data-testid="hero-description"
          >
            {t("hero.subtitle")}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("contact");
              }}
              className="group inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-[0_12px_30px_-12px_hsl(var(--primary)/0.65)] transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transform-none"
              data-testid="button-schedule-consultation"
            >
              {t("hero.appointment")}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
            </a>
            <a
              href="#services"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("services");
              }}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-background/70 px-7 py-3 font-semibold text-foreground transition hover:border-primary/40 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              data-testid="button-learn-more"
            >
              {t("hero.cta")}
            </a>
          </div>

          <ul className="mt-9 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-6">
            {details.map((detail) => (
              <li key={detail} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {t(`hero.details.${detail}`)}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[31rem] lg:mx-0 lg:justify-self-end">
          <div className="absolute -left-7 top-16 hidden h-28 w-28 rounded-full border border-accent/40 lg:block" aria-hidden="true" />
          <div className="absolute -right-6 bottom-20 h-28 w-28 rounded-full bg-accent/20 blur-2xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem_2rem_8rem_2rem] border border-border/70 bg-card p-2 shadow-[0_28px_80px_-40px_hsl(var(--foreground)/0.45)] sm:rounded-[2.5rem_2.5rem_10rem_2.5rem]">
            <img
              src={profileImage}
              alt={t("hero.profile_alt")}
              width={902}
              height={825}
              decoding="async"
              className="aspect-[4/4.35] w-full rounded-[1.55rem_1.55rem_7.5rem_1.55rem] object-cover object-top sm:rounded-[2rem_2rem_9rem_2rem]"
              data-testid="profile-image"
            />
          </div>
          <div className="relative -mt-14 ml-4 max-w-[20rem] rounded-2xl border border-border/80 bg-card/95 p-5 shadow-xl backdrop-blur sm:ml-[-2rem] sm:p-6">
            <p className="font-serif text-lg leading-snug text-foreground">
              {t("hero.note")}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {t("hero.note_label")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
