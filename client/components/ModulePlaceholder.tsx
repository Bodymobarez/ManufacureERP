import { LucideIcon, ArrowRight, ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ModulePlaceholderProps {
  icon: LucideIcon;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  featuresKeys: string[];
  colorGradient: string;
}

export function ModulePlaceholder({
  icon: IconComponent,
  titleKey,
  subtitleKey,
  descriptionKey,
  featuresKeys,
  colorGradient,
}: ModulePlaceholderProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div
              className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${colorGradient} text-white mb-6`}
            >
              <IconComponent className="w-10 h-10" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
              {t(titleKey)}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">{t(subtitleKey)}</p>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              {t(descriptionKey)}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 p-8 bg-card rounded-xl border border-border">
            {featuresKeys.map((featureKey, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={`mt-1 h-2 w-2 rounded-full bg-gradient-to-r ${colorGradient} flex-shrink-0`}
                ></div>
                <p className="text-sm text-foreground">{t(featureKey)}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="inline-block p-6 bg-primary/5 rounded-lg border border-primary/20 mb-8">
              <p className="text-sm font-medium text-primary mb-2">{t("placeholder.comingSoon")}</p>
              <p className="text-base text-foreground max-w-md">
                {t("placeholder.inDevelopment", { moduleName: t(titleKey) })}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                {t("placeholder.backToHome")}
              </Link>
              <a
                href="#"
                className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {t("placeholder.viewDocs")} <ArrowIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
