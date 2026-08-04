import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { getLocalizedPath, scrollToSection, storePendingScrollTarget } from "@/lib/routing";

export default function Header() {
  const [location, navigate] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const { t, i18n } = useTranslation("nav");

  const homePath = getLocalizedPath("/", i18n.language);
  const navigation = [
    { name: t("about"), href: getLocalizedPath("/#about", i18n.language), action: "scroll" as const, target: "about" },
    { name: t("services"), href: getLocalizedPath("/#services", i18n.language), action: "scroll" as const, target: "services" },
    { name: t("contact"), href: getLocalizedPath("/#contact", i18n.language), action: "scroll" as const, target: "contact" },
  ];

  const isActive = (href: string) => {
    const normalizedLocation = location.split("?")[0];
    if (href === homePath) {
      return normalizedLocation === homePath;
    }
    if (href.includes("#")) {
      return false;
    }
    return normalizedLocation.startsWith(href);
  };

  const baseNavClasses = "inline-flex items-center text-sm font-medium leading-none transition-colors duration-200";
  const focusRingClasses = "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring";
  const activeNavClasses = "text-primary";
  const inactiveNavClasses = "text-muted-foreground hover:text-foreground";
  const linkNavClasses = `${baseNavClasses} min-h-11 px-2 ${focusRingClasses}`;
  const buttonNavClasses = `${baseNavClasses} min-h-11 px-2 ${focusRingClasses}`;

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  const handleScrollNavigation = (target: string, closeMenu?: boolean) => {
    const normalizedLocation = location.split("?")[0];

    if (closeMenu) {
      setIsMobileMenuOpen(false);
    }

    if (normalizedLocation === homePath) {
      scrollToSection(target);
      return;
    }

    storePendingScrollTarget(target);
    navigate(homePath);
  };

  const handleSectionLink = (
    event: MouseEvent<HTMLAnchorElement>,
    target: string,
    closeMenu?: boolean,
  ) => {
    event.preventDefault();
    handleScrollNavigation(target, closeMenu);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link
            href={homePath}
            className={`inline-flex min-h-11 items-center ${focusRingClasses}`}
          >
            <span data-testid="logo-text">
              <span className="block font-serif text-xl font-semibold leading-tight text-foreground">
                {t("logo")}
              </span>
              <span className="mt-0.5 hidden text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:block">
                {t("tagline")}
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2" aria-label={t("primary_navigation")}>
            {navigation.map((item) => {
              if (item.action === "scroll") {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(event) => handleSectionLink(event, item.target!)}
                    className={`${buttonNavClasses} ${
                      isActive(item.href) ? activeNavClasses : inactiveNavClasses
                    }`}
                    data-testid={`nav-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </Link>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${linkNavClasses} ${
                    isActive(item.href) ? activeNavClasses : inactiveNavClasses
                  }`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              );
            })}
            <LanguageSwitcher />
            <Button asChild className="rounded-full px-5">
              <Link
                href={getLocalizedPath("/#appointment-booking", i18n.language)}
                onClick={(event) =>
                  handleSectionLink(event, "appointment-booking")
                }
                data-testid="button-book-consultation"
              >
                {t("appointment")}
              </Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            ref={mobileMenuButtonRef}
            type="button"
            className={`lg:hidden inline-flex h-11 w-11 items-center justify-center ${focusRingClasses}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? t("close_menu") : t("open_menu")}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div id="mobile-navigation" className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-1" aria-label={t("primary_navigation")}>
              {navigation.map((item) => {
                if (item.action === "scroll") {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={(event) => handleSectionLink(event, item.target!, true)}
                      className={`flex min-h-11 items-center rounded-md px-3 py-2 text-base font-medium text-left ${
                        isActive(item.href) ? "text-primary" : "text-muted-foreground"
                      } ${focusRingClasses}`}
                      data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </Link>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex min-h-11 items-center rounded-md px-3 py-2 text-base font-medium ${
                        isActive(item.href) ? "text-primary" : "text-muted-foreground"
                      } ${focusRingClasses}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="px-3 pt-2 space-y-2">
                <LanguageSwitcher />
                <Button asChild className="w-full">
                  <Link
                    href={getLocalizedPath("/#appointment-booking", i18n.language)}
                    onClick={(event) =>
                      handleSectionLink(event, "appointment-booking", true)
                    }
                    data-testid="mobile-button-book-consultation"
                  >
                    {t("appointment")}
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
