import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages: { code: string; label: string; flag: string; dir: 'ltr' | 'rtl' }[] = [
    { code: "en", label: "English", flag: "🇺🇸", dir: "ltr" },
    { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
  ];

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="p-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2 border border-border"
          aria-label="Select language"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">
            {currentLang.flag} {currentLang.label}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer flex items-center justify-between ${
              i18n.language === lang.code ? "bg-primary/10" : ""
            }`}
          >
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span style={{ direction: lang.dir }}>{lang.label}</span>
            </span>
            {i18n.language === lang.code && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
