import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <h1 className="text-xl font-serif font-bold text-foreground" data-testid="logo-text">
                Dr. Michael Thompson
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
            <Button 
              onClick={() => {
                const bookingSection = document.getElementById('appointment-booking');
                bookingSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="button-book-consultation"
            >
              Book Consultation
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
              {navigation.map((item) => (
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
              ))}
              <div className="px-3 pt-2">
                <Button 
                  className="w-full"
                  onClick={() => {
                    const bookingSection = document.getElementById('appointment-booking');
                    bookingSection?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  data-testid="mobile-button-book-consultation"
                >
                  Book Consultation
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}