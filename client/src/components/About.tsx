import { Card, CardContent } from "@/components/ui/card";
import profileImage from "@assets/generated_images/Professional_therapist_headshot_d6da5109.png";
import officeImage from "@assets/generated_images/Therapy_office_interior_578cbac1.png";

export default function About() {
  return (
    <section className="py-16 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4" data-testid="about-title">
            About Dr. Michael Thompson
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="about-subtitle">
            Licensed Clinical Psychologist with over 15 years of experience helping individuals 
            overcome challenges and achieve emotional wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="order-2 lg:order-1">
            <img 
              src={profileImage} 
              alt="Dr. Michael Thompson" 
              className="rounded-lg shadow-md w-full max-w-md mx-auto"
              data-testid="profile-image"
            />
          </div>

          {/* About Content */}
          <div className="order-1 lg:order-2">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="credentials-title">
                  Professional Credentials
                </h3>
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li data-testid="credential-1">• Licensed Clinical Psychologist (CA #PSY12345)</li>
                  <li data-testid="credential-2">• Ph.D. in Clinical Psychology, UCLA</li>
                  <li data-testid="credential-3">• Master's in Counseling Psychology, USC</li>
                  <li data-testid="credential-4">• Member, American Psychological Association</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="specializations-title">
                  Areas of Specialization
                </h3>
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li data-testid="specialization-1">• Anxiety and Depression Treatment</li>
                  <li data-testid="specialization-2">• Relationship and Couples Therapy</li>
                  <li data-testid="specialization-3">• Trauma and PTSD Recovery</li>
                  <li data-testid="specialization-4">• Stress Management and Mindfulness</li>
                </ul>

                <p className="text-muted-foreground" data-testid="personal-note">
                  "My approach combines evidence-based therapeutic techniques with genuine compassion. 
                  I believe in creating a collaborative partnership where you feel heard, understood, 
                  and empowered to make positive changes in your life."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Office Image */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-serif font-semibold text-foreground mb-6" data-testid="office-title">
            A Comfortable, Welcoming Environment
          </h3>
          <img 
            src={officeImage} 
            alt="Therapy Office" 
            className="rounded-lg shadow-md mx-auto max-w-4xl w-full"
            data-testid="office-image"
          />
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto" data-testid="office-description">
            My practice is designed to provide a calm, private space where you can feel 
            comfortable sharing and exploring your thoughts and feelings.
          </p>
        </div>
      </div>
    </section>
  );
}