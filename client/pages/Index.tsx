import { MainHeader } from "@/components/MainHeader";
import { Sidebar } from "@/components/Sidebar";
import {
  Factory,
  BoxesIcon,
  Users,
  DollarSign,
  BarChart3,
  ShoppingCart,
  CheckCircle,
  Cpu,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Lock,
  Layers,
  Calendar,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Index() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const modules = [
    {
      icon: Layers,
      titleKey: "modules.plm.title",
      subtitleKey: "modules.plm.subtitle",
      descriptionKey: "modules.plm.description",
      href: "/plm",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: BoxesIcon,
      titleKey: "modules.inventory.title",
      subtitleKey: "modules.inventory.subtitle",
      descriptionKey: "modules.inventory.description",
      href: "/inventory",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Factory,
      titleKey: "modules.production.title",
      subtitleKey: "modules.production.subtitle",
      descriptionKey: "modules.production.description",
      href: "/production",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Cpu,
      titleKey: "modules.iot.title",
      subtitleKey: "modules.iot.subtitle",
      descriptionKey: "modules.iot.description",
      href: "/iot",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: CheckCircle,
      titleKey: "modules.quality.title",
      subtitleKey: "modules.quality.subtitle",
      descriptionKey: "modules.quality.description",
      href: "/quality",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Users,
      titleKey: "modules.hrm.title",
      subtitleKey: "modules.hrm.subtitle",
      descriptionKey: "modules.hrm.description",
      href: "/hrm",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      icon: DollarSign,
      titleKey: "modules.accounting.title",
      subtitleKey: "modules.accounting.subtitle",
      descriptionKey: "modules.accounting.description",
      href: "/accounting",
      color: "from-green-500 to-green-600",
    },
    {
      icon: ShoppingCart,
      titleKey: "modules.procurement.title",
      subtitleKey: "modules.procurement.subtitle",
      descriptionKey: "modules.procurement.description",
      href: "/procurement",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: TrendingUp,
      titleKey: "modules.sales.title",
      subtitleKey: "modules.sales.subtitle",
      descriptionKey: "modules.sales.description",
      href: "/sales",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: BarChart3,
      titleKey: "modules.dashboard.title",
      subtitleKey: "modules.dashboard.subtitle",
      descriptionKey: "modules.dashboard.description",
      href: "/dashboard",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Calendar,
      titleKey: "modules.mrp.title",
      subtitleKey: "modules.mrp.subtitle",
      descriptionKey: "modules.mrp.description",
      href: "/mrp",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: Wrench,
      titleKey: "modules.cmms.title",
      subtitleKey: "modules.cmms.subtitle",
      descriptionKey: "modules.cmms.description",
      href: "/cmms",
      color: "from-violet-500 to-violet-600",
    },
  ];

  const features = [
    {
      icon: Layers,
      titleKey: "features.modular",
      descriptionKey: "features.modularDesc",
    },
    {
      icon: Lock,
      titleKey: "features.security",
      descriptionKey: "features.securityDesc",
    },
    {
      icon: TrendingUp,
      titleKey: "features.ai",
      descriptionKey: "features.aiDesc",
    },
    {
      icon: Cpu,
      titleKey: "features.iot",
      descriptionKey: "features.iotDesc",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <Sidebar />
      <div className="lg:ms-64 flex flex-col min-h-screen">
        <MainHeader />

          {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32 lg:py-40">
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <div className="absolute top-0 start-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 end-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                {t("home.badge")}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground">
              {t("home.mainTitle")}{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {t("home.mainTitleHighlight")}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              {t("home.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                {t("home.ctaPrimary")} <ArrowIcon className="w-4 h-4" />
              </Link>
              <a
                href="#modules"
                className="px-8 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-semibold"
              >
                {t("home.ctaSecondary")}
              </a>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-16 border-t border-border">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">{t("home.stats.modules")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">360°</div>
                <div className="text-sm text-muted-foreground">{t("home.stats.visibility")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{isRTL ? "متعدد" : "Multi-"}</div>
                <div className="text-sm text-muted-foreground">{t("home.stats.multiFactory")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">ISO</div>
                <div className="text-sm text-muted-foreground">{t("home.stats.compliant")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Modules Grid */}
        <section id="modules" className="py-20 lg:py-32 bg-card">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              {t("home.modulesSection")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.modulesSectionDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Link
                  key={module.href}
                  to={module.href}
                  className="group relative overflow-hidden rounded-xl border border-border p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${module.color} transition-opacity`}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`inline-block p-3 rounded-lg bg-gradient-to-br ${module.color} text-white mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {t(module.titleKey)}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      {t(module.subtitleKey)}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {t(module.descriptionKey)}
                    </p>

                    <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                      {t("common.exploreModule")}
                      <ArrowIcon className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

        {/* Key Features Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-card">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              {t("features.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{t(feature.titleKey)}</h3>
                    <p className="text-muted-foreground">{t(feature.descriptionKey)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-8 py-4 rounded-lg bg-white text-primary font-bold hover:bg-slate-100 transition-colors"
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs">
                  E
                </div>
                {t("footer.brand")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("footer.tagline")}
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">{t("footer.modules")}</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/plm" className="hover:text-primary transition">
                    {t("header.plm")}
                  </Link>
                </li>
                <li>
                  <Link to="/inventory" className="hover:text-primary transition">
                    {t("header.inventory")}
                  </Link>
                </li>
                <li>
                  <Link to="/production" className="hover:text-primary transition">
                    {t("header.production")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">{t("footer.company")}</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("footer.about")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("footer.documentation")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("footer.support")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">{t("footer.resources")}</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("footer.apiDocs")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("footer.security")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("footer.compliance")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
