import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation('nav');

  // Get language-aware navigation links
  const getHref = (path: string) => {
    if (i18n.language === 'en') {
      return path === '/' ? '/en' : `/en${path}`;
    }
    return path;
  };

  const navigation = [
    { name: t('home'), href: getHref("/"), action: 'link' },
    { name: t('about'), href: getHref("/#about"), action: 'scroll', target: 'about' },
    { name: t('services'), href: getHref("/#services"), action: 'scroll', target: 'services' },
    { name: t('contact'), href: getHref("/#contact"), action: 'scroll', target: 'contact' },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  const baseNavClasses = "inline-flex items-center text-sm font-medium leading-none transition-colors duration-200";
  const focusRingClasses = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/40";
  const activeNavClasses = "text-primary";
  const inactiveNavClasses = "text-muted-foreground hover:text-foreground";
  const linkNavClasses = `${baseNavClasses} ${focusRingClasses}`;
  const buttonNavClasses = `${baseNavClasses} border-0 bg-transparent p-0 appearance-none ${focusRingClasses}`;

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <h1 className="text-xl font-serif font-bold text-foreground" data-testid="logo-text">
                {t('logo')}
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              if (item.action === 'scroll') {
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      const section = document.getElementById(item.target!);
                      section?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`${buttonNavClasses} ${
                      isActive(item.href)
                        ? activeNavClasses
                        : inactiveNavClasses
                    }`}
                    data-testid={`nav-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </button>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${linkNavClasses} ${
                    isActive(item.href)
                      ? activeNavClasses
                      : inactiveNavClasses
                  }`}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              );
            })}
            <LanguageSwitcher />
            <Button
              onClick={() => {
                const bookingSection = document.getElementById('appointment-booking');
                bookingSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="button-book-consultation"
            >
              {t('appointment')}
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => {
                if (item.action === 'scroll') {
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        const section = document.getElementById(item.target!);
                        section?.scrollIntoView({ behavior: 'smooth' });
                        setIsMobileMenuOpen(false);
                      }}
                      className={`block px-3 py-2 text-base font-medium text-left ${
                        isActive(item.href)
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                      data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </button>
                  );
                }
                return (
                  <Link key={item.name} href={item.href}>
                    <span
                      className={`block px-3 py-2 text-base font-medium ${
                        isActive(item.href)
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
              <div className="px-3 pt-2 space-y-2">
                <LanguageSwitcher />
                <Button
                  className="w-full"
                  onClick={() => {
                    const bookingSection = document.getElementById('appointment-booking');
                    bookingSection?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  data-testid="mobile-button-book-consultation"
                >
                  {t('appointment')}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
