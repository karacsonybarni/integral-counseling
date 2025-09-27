import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

interface LegalSection {
  title: string;
  body?: string;
  items?: string[];
}

interface LegalContact {
  title: string;
  body: string;
}

export default function Privacy() {
  const { t } = useTranslation('legal');
  const sections = t('privacy.sections', { returnObjects: true }) as LegalSection[];
  const contact = t('privacy.contact', { returnObjects: true }) as LegalContact;
  const note = t('privacy.note');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-serif font-bold text-foreground" data-testid="privacy-title">
              {t('privacy.title')}
            </h1>
            <p className="text-sm text-muted-foreground" data-testid="privacy-updated">
              {t('privacy.updated')}
            </p>
            <p className="text-muted-foreground whitespace-pre-line" data-testid="privacy-intro">
              {t('privacy.intro')}
            </p>
          </header>

          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                {section.title}
              </h2>
              {section.body && (
                <p className="text-muted-foreground whitespace-pre-line">
                  {section.body}
                </p>
              )}
              {section.items && (
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {section.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="space-y-3">
            <p className="text-muted-foreground whitespace-pre-line" data-testid="privacy-note">
              {note}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground" data-testid="privacy-contact-title">
              {contact.title}
            </h2>
            <p className="text-muted-foreground whitespace-pre-line" data-testid="privacy-contact-body">
              {contact.body}
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
