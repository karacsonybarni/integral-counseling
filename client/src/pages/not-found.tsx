import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { getLocalizedPath } from "@/lib/routing";

export default function NotFound() {
  const { t, i18n } = useTranslation("common");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-gray-900">
              {t("not_found.title")}
            </h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            {t("not_found.description")}
          </p>
          <Button asChild className="mt-6">
            <Link href={getLocalizedPath("/", i18n.language)}>
              {t("not_found.home")}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
