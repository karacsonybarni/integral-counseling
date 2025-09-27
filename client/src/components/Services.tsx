import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, Brain, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Services() {
  const { t } = useTranslation('services');
  
  const services = [
    {
      icon: Brain,
      title: t('services.individual.title'),
      description: t('services.individual.description'),
      duration: t('services.individual.duration'),
      approach: t('services.individual.approach'),
      id: "individual"
    },
    {
      icon: Users,
      title: t('services.couples.title'),
      description: t('services.couples.description'),
      duration: t('services.couples.duration'),
      approach: t('services.couples.approach'),
      id: "couples"
    },
    {
      icon: Heart,
      title: t('services.trauma.title'),
      description: t('services.trauma.description'),
      duration: t('services.trauma.duration'),
      approach: t('services.trauma.approach'),
      id: "trauma"
    },
    {
      icon: Clock,
      title: t('services.stress.title'),
      description: t('services.stress.description'),
      duration: t('services.stress.duration'),
      approach: t('services.stress.approach'),
      id: "stress"
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {services.map((service) => (
            <Card key={service.id} className="hover-elevate">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <service.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl" data-testid={`service-title-${service.id}`}>
                    {service.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4" data-testid={`service-description-${service.id}`}>
                  {service.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground" data-testid={`service-duration-${service.id}`}>
                      {t('session_length')} {service.duration}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">{t('approach_label')} </span>
                    <span className="text-muted-foreground" data-testid={`service-approach-${service.id}`}>
                      {service.approach}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => console.log(`Learn more about ${service.title}`)}
                  data-testid={`button-learn-more-${service.id}`}
                >
                  {t('learn_more')}
                </Button>
              </CardContent>
            </Card>
          ))}
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