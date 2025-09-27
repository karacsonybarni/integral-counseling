import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, Brain, Heart } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Brain,
      title: "Individual Therapy",
      description: "One-on-one sessions tailored to your specific needs and goals.",
      duration: "50 minutes",
      approach: "Cognitive Behavioral Therapy, Mindfulness-Based Therapy",
      id: "individual"
    },
    {
      icon: Users,
      title: "Couples Therapy",
      description: "Strengthen relationships and improve communication patterns.",
      duration: "75 minutes",
      approach: "Emotionally Focused Therapy, Gottman Method",
      id: "couples"
    },
    {
      icon: Heart,
      title: "Trauma Recovery",
      description: "Specialized treatment for trauma, PTSD, and difficult life experiences.",
      duration: "50-90 minutes",
      approach: "EMDR, Trauma-Focused CBT, Somatic Therapy",
      id: "trauma"
    },
    {
      icon: Clock,
      title: "Stress Management",
      description: "Learn effective coping strategies for work and life pressures.",
      duration: "50 minutes",
      approach: "Mindfulness, Relaxation Techniques, CBT",
      id: "stress"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4" data-testid="services-title">
            Therapeutic Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="services-subtitle">
            Comprehensive mental health services designed to support your journey toward healing and growth.
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
                      Session Length: {service.duration}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Approach: </span>
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
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Approach Section */}
        <Card className="bg-muted/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-serif font-semibold text-foreground mb-4" data-testid="approach-title">
              My Therapeutic Approach
            </h3>
            <p className="text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed" data-testid="approach-description">
              I integrate various evidence-based approaches tailored to each client's unique needs. 
              My practice emphasizes creating a safe, non-judgmental space where you can explore 
              your thoughts and feelings while developing practical skills for lasting change.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <h4 className="font-semibold text-foreground mb-2" data-testid="approach-principle-1-title">
                  Collaborative Partnership
                </h4>
                <p className="text-sm text-muted-foreground" data-testid="approach-principle-1-description">
                  We work together as partners in your healing journey.
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-foreground mb-2" data-testid="approach-principle-2-title">
                  Strength-Based Focus
                </h4>
                <p className="text-sm text-muted-foreground" data-testid="approach-principle-2-description">
                  Building on your existing strengths and resilience.
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-foreground mb-2" data-testid="approach-principle-3-title">
                  Culturally Responsive
                </h4>
                <p className="text-sm text-muted-foreground" data-testid="approach-principle-3-description">
                  Honoring your unique background and experiences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}