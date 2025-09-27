import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6" data-testid="hero-title">
            Professional Mental Health Support
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed" data-testid="hero-description">
            I provide compassionate, evidence-based therapy to help you navigate life's challenges. 
            Together, we'll work towards healing, growth, and lasting positive change in a safe, 
            supportive environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="group" data-testid="button-schedule-consultation">
              Schedule a Consultation
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" data-testid="button-learn-more">
              Learn More About My Approach
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
              Confidential & Safe
            </h3>
            <p className="text-muted-foreground" data-testid="benefit-description-1">
              A judgment-free space where you can explore your thoughts and feelings openly.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="benefit-title-2">
              Evidence-Based
            </h3>
            <p className="text-muted-foreground" data-testid="benefit-description-2">
              Treatment approaches grounded in proven psychological research and methods.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="benefit-title-3">
              Personalized Care
            </h3>
            <p className="text-muted-foreground" data-testid="benefit-description-3">
              Tailored treatment plans that address your unique needs and goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}