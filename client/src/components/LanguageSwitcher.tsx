import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation('nav');
  const [, setLocation] = useLocation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    
    // Update URL based on language
    const currentPath = window.location.pathname;
    if (lng === 'hu') {
      // For Hungarian, redirect to root or remove /en prefix
      if (currentPath.startsWith('/en')) {
        setLocation(currentPath.replace('/en', '') || '/');
      } else if (currentPath !== '/') {
        setLocation('/');
      }
    } else if (lng === 'en') {
      // For English, add /en prefix
      if (!currentPath.startsWith('/en')) {
        setLocation('/en');
      }
    }
  };

  const currentLang = i18n.language || 'hu';
  const languages = [
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
          data-testid="button-language-switcher"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{t('language')}</span>
          <span className="text-xs">
            {languages.find(lang => lang.code === currentLang)?.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={currentLang === lang.code ? "bg-accent" : ""}
            data-testid={`option-language-${lang.code}`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}