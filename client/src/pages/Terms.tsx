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

export default function Terms() {
  const { t } = useTranslation('legal');
  const sections = t('terms.sections', { returnObjects: true }) as LegalSection[];
  const contact = t('terms.contact', { returnObjects: true }) as LegalContact;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-serif font-bold text-foreground" data-testid="terms-title">
              {t('terms.title')}
            </h1>
            <p className="text-sm text-muted-foreground" data-testid="terms-updated">
              {t('terms.updated')}
            </p>
            <p className="text-muted-foreground whitespace-pre-line" data-testid="terms-intro">
              {t('terms.intro')}
            </p>
          </header>

          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground" data-testid={`terms-section-${section.title}`}>
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
            <h2 className="text-xl font-semibold text-foreground" data-testid="terms-contact-title">
              {contact.title}
            </h2>
            <p className="text-muted-foreground whitespace-pre-line" data-testid="terms-contact-body">
              {contact.body}
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
