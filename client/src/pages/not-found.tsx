import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { getLocalizedPath } from "@/lib/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  const { t, i18n } = useTranslation("common");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-[60vh] items-center justify-center px-4 py-16"
      >
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-3">
              <AlertCircle className="h-8 w-8 shrink-0 text-destructive" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-foreground">
                {t("not_found.title")}
              </h1>
            </div>

            <p className="mt-4 text-muted-foreground">
              {t("not_found.description")}
            </p>
            <Button asChild className="mt-6">
              <Link href={getLocalizedPath("/", i18n.language)}>
                {t("not_found.home")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
