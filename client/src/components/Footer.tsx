import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Practice Information */}
          <div>
            <h3 className="text-lg font-serif font-semibold text-foreground mb-4" data-testid="footer-practice-title">
              Dr. Michael Thompson
            </h3>
            <p className="text-muted-foreground mb-4" data-testid="footer-practice-description">
              Licensed Clinical Psychologist providing compassionate, evidence-based therapy 
              to support your mental health journey.
            </p>
            <p className="text-sm text-muted-foreground" data-testid="footer-license">
              License #PSY12345 | State of California
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="footer-links-title">
              Quick Links
            </h3>
            <nav className="space-y-2">
              <Link href="/about">
                <span className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-about">
                  About
                </span>
              </Link>
              <br />
              <Link href="/services">
                <span className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-services">
                  Services
                </span>
              </Link>
              <br />
              <Link href="/contact">
                <span className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-contact">
                  Contact
                </span>
              </Link>
              <br />
              <Link href="/privacy">
                <span className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-privacy">
                  Privacy Policy
                </span>
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="footer-contact-title">
              Contact Information
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <p data-testid="footer-contact-phone">(555) 123-4567</p>
              <p data-testid="footer-contact-email">dr.thompson@example.com</p>
              <p data-testid="footer-contact-address">
                123 Wellness Way<br />
                Los Angeles, CA 90210
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm" data-testid="footer-copyright">
              © 2024 Dr. Michael Thompson. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms">
                <span className="text-muted-foreground hover:text-foreground text-sm transition-colors" data-testid="footer-link-terms">
                  Terms of Service
                </span>
              </Link>
              <Link href="/privacy">
                <span className="text-muted-foreground hover:text-foreground text-sm transition-colors" data-testid="footer-link-privacy-bottom">
                  Privacy Policy
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}