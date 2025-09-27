import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";

export default function Services() {
  const { t } = useTranslation('services');
  
  // Individual therapy service data
  const service = {
    icon: Brain,
    title: t('services.individual.title'),
    description: t('services.individual.description'),
    duration: t('services.individual.duration'),
    approach: t('services.individual.approach'),
    id: "individual"
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4" data-testid="services-title">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="services-subtitle">
            {t('subtitle')}
          </p>
        </div>

        {/* Featured Service Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="hover-elevate bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-serif mb-3" data-testid="service-title-individual">
                  {service.title}
                </CardTitle>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="service-description-individual">
                  {service.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center justify-center gap-3 p-4 bg-background/50 rounded-lg">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground block">{t('session_length')}</span>
                    <span className="text-muted-foreground" data-testid="service-duration-individual">
                      {service.duration}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 p-4 bg-background/50 rounded-lg">
                  <Brain className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground block">{t('approach_label')}</span>
                    <span className="text-muted-foreground" data-testid="service-approach-individual">
                      {service.approach}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  variant="default" 
                  size="lg"
                  className="px-8"
                  asChild
                  data-testid="button-learn-more-individual"
                >
                  <Link href="/#contact">
                    {t('learn_more')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approach Section */}
        <Card className="bg-muted/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-serif font-semibold text-foreground mb-4" data-testid="approach-title">
              {t('approach.title')}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed" data-testid="approach-description">
              {t('approach.description')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <h4 className="font-semibold text-foreground mb-2" data-testid="approach-principle-1-title">
                  {t('approach.principles.collaborative.title')}
                </h4>
                <p className="text-sm text-muted-foreground" data-testid="approach-principle-1-description">
                  {t('approach.principles.collaborative.description')}
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-foreground mb-2" data-testid="approach-principle-2-title">
                  {t('approach.principles.strength.title')}
                </h4>
                <p className="text-sm text-muted-foreground" data-testid="approach-principle-2-description">
                  {t('approach.principles.strength.description')}
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-foreground mb-2" data-testid="approach-principle-3-title">
                  {t('approach.principles.cultural.title')}
                </h4>
                <p className="text-sm text-muted-foreground" data-testid="approach-principle-3-description">
                  {t('approach.principles.cultural.description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}