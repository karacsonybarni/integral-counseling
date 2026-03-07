import { Link } from "wouter";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { getLocalizedPath, scrollToSection, storePendingScrollTarget } from "@/lib/routing";

export default function Footer() {
  const [location, navigate] = useLocation();
  const { t, i18n } = useTranslation("footer");
  const homePath = getLocalizedPath("/", i18n.language);

  const handleScrollNavigation = (target: string) => {
    const normalizedLocation = location.split("?")[0];
    if (normalizedLocation === homePath) {
      scrollToSection(target);
      return;
    }

    storePendingScrollTarget(target);
    navigate(homePath);
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Practice Information */}
          <div>
            <h3 className="text-lg font-serif font-semibold text-foreground mb-4" data-testid="footer-practice-title">
              {t('practice_title')}
            </h3>
            <p className="text-muted-foreground mb-4" data-testid="footer-practice-description">
              {t('practice_description')}
            </p>
            <p className="text-sm text-muted-foreground" data-testid="footer-license">
              {t('license')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="footer-links-title">
              {t('quick_links')}
            </h3>
            <nav className="space-y-2">
              <button
                onClick={() => handleScrollNavigation("about")}
                className="block text-left text-muted-foreground hover:text-foreground transition-colors"
                data-testid="footer-link-about"
              >
                {t("about")}
              </button>
              <button
                onClick={() => handleScrollNavigation("services")}
                className="block text-left text-muted-foreground hover:text-foreground transition-colors"
                data-testid="footer-link-services"
              >
                {t("services")}
              </button>
              <button
                onClick={() => handleScrollNavigation("contact")}
                className="block text-left text-muted-foreground hover:text-foreground transition-colors"
                data-testid="footer-link-contact"
              >
                {t("contact")}
              </button>
              <Link
                href={getLocalizedPath("/privacy", i18n.language)}
                className="block text-left text-muted-foreground hover:text-foreground transition-colors"
                data-testid="footer-link-privacy"
              >
                {t("privacy")}
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="footer-contact-title">
              {t('contact_info')}
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <p data-testid="footer-contact-phone">{t('phone')}</p>
              <p data-testid="footer-contact-email">{t('email')}</p>
              <p data-testid="footer-contact-address">
                {t("address").split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    {index === 0 && <br />}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm" data-testid="footer-copyright">
              {t("copyright")}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href={getLocalizedPath("/terms", i18n.language)}>
                <span className="text-muted-foreground hover:text-foreground text-sm transition-colors" data-testid="footer-link-terms">
                  {t("terms")}
                </span>
              </Link>
              <Link href={getLocalizedPath("/privacy", i18n.language)}>
                <span className="text-muted-foreground hover:text-foreground text-sm transition-colors" data-testid="footer-link-privacy-bottom">
                  {t("privacy")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
