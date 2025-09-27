import { Card, CardContent } from "@/components/ui/card";
import profileImage from "@assets/generated_images/Professional_therapist_headshot_d6da5109.png";
import officeImage from "@assets/generated_images/Therapy_office_interior_578cbac1.png";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation('about');
  
  return (
    <section className="py-16 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4" data-testid="about-title">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="about-subtitle">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="order-2 lg:order-1">
            <img 
              src={profileImage} 
              alt={t('title')} 
              className="rounded-lg shadow-md w-full max-w-md mx-auto"
              data-testid="profile-image"
            />
          </div>

          {/* About Content */}
          <div className="order-1 lg:order-2">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="credentials-title">
                  {t('credentials.title')}
                </h3>
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li data-testid="credential-1">{t('credentials.license')}</li>
                  <li data-testid="credential-2">{t('credentials.phd')}</li>
                  <li data-testid="credential-3">{t('credentials.masters')}</li>
                  <li data-testid="credential-4">{t('credentials.membership')}</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="specializations-title">
                  {t('specializations.title')}
                </h3>
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li data-testid="specialization-1">{t('specializations.anxiety')}</li>
                  <li data-testid="specialization-2">{t('specializations.couples')}</li>
                  <li data-testid="specialization-3">{t('specializations.trauma')}</li>
                  <li data-testid="specialization-4">{t('specializations.stress')}</li>
                </ul>

                <p className="text-muted-foreground" data-testid="personal-note">
                  {t('personal_note')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Office Image */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-serif font-semibold text-foreground mb-6" data-testid="office-title">
            {t('office.title')}
          </h3>
          <img 
            src={officeImage} 
            alt="Therapy Office" 
            className="rounded-lg shadow-md mx-auto max-w-4xl w-full"
            data-testid="office-image"
          />
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto" data-testid="office-description">
            {t('office.description')}
          </p>
        </div>
      </div>
    </section>
  );
}