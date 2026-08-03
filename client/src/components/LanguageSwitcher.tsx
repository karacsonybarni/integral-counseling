import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Globe } from "lucide-react";
import { getLocalizedPath } from "@/lib/routing";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation("nav");
  const [location, setLocation] = useLocation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLocation(getLocalizedPath(location, lng));
  };

  const currentLang = (i18n.resolvedLanguage || i18n.language || "hu").split("-")[0];
  const languages = [
    { code: "hu", name: "Magyar" },
    { code: "en", name: "English" }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
          aria-label={t("change_language", {
            language: languages.find((lang) => lang.code === currentLang)?.name,
          })}
          data-testid="button-language-switcher"
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t("language")}</span>
          <span className="text-xs font-medium">
            {languages.find(lang => lang.code === currentLang)?.code.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="flex min-h-11 items-center"
            aria-current={currentLang === lang.code ? "true" : undefined}
            data-testid={`option-language-${lang.code}`}
          >
            <span className="mr-2 inline-flex w-4" aria-hidden="true">
              {currentLang === lang.code && <Check className="h-4 w-4" />}
            </span>
            <span className="mr-2 font-mono text-xs" aria-hidden="true">
              {lang.code.toUpperCase()}
            </span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
