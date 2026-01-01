import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../locales/en.json";
import arTranslation from "../locales/ar.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  ar: {
    translation: arTranslation,
  },
};

// Get language from localStorage or browser default
const getInitialLanguage = (): string => {
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem("language");
    if (saved && (saved === "en" || saved === "ar")) {
      return saved;
    }
  }
  return "en";
};

const savedLanguage = getInitialLanguage();

// Update document direction based on language
export const updateDocumentDirection = (lang: string) => {
  if (typeof document !== "undefined") {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    
    // Add/remove Arabic font class
    if (lang === "ar") {
      document.documentElement.classList.add("font-arabic");
    } else {
      document.documentElement.classList.remove("font-arabic");
    }
  }
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("language", lang);
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  // Disable Trans component features that require html-parse-stringify
  react: {
    transSupportBasicHtmlNodes: false,
    transKeepBasicHtmlNodesFor: [],
  },
});

// Initialize with current language
updateDocumentDirection(savedLanguage);

// Subscribe to language changes
i18n.on("languageChanged", (lng) => {
  updateDocumentDirection(lng);
});

export default i18n;
