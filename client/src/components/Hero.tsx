import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation('home');
  
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6" data-testid="hero-title">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed" data-testid="hero-description">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="group" 
              onClick={() => {
                const bookingSection = document.getElementById('appointment-booking');
                bookingSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="button-schedule-consultation"
            >
              {t('hero.appointment')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => {
                const servicesSection = document.getElementById('services');
                servicesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="button-learn-more"
            >
              {t('hero.cta')}
            </Button>
          </div>
        </div>
        
        {/* Key Benefits */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="benefit-title-1">
              {t('benefits.safe.title')}
            </h3>
            <p className="text-muted-foreground" data-testid="benefit-description-1">
              {t('benefits.safe.description')}
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="benefit-title-2">
              {t('benefits.evidence.title')}
            </h3>
            <p className="text-muted-foreground" data-testid="benefit-description-2">
              {t('benefits.evidence.description')}
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="benefit-title-3">
              {t('benefits.personalized.title')}
            </h3>
            <p className="text-muted-foreground" data-testid="benefit-description-3">
              {t('benefits.personalized.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}