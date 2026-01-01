import { Link, useLocation } from "react-router-dom";
import { Factory, Menu, X, BarChart3, Layers, BoxesIcon, TrendingUp, ShoppingCart, Calendar, Wrench, Cpu, CheckCircle, Users, DollarSign } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';

  const navItems = [
    { 
      icon: BarChart3, 
      label: t("header.dashboard"), 
      labelAr: "لوحة التحكم",
      href: "/dashboard" 
    },
    { 
      icon: Layers, 
      label: t("header.plm"), 
      labelAr: "إدارة دورة المنتج",
      href: "/plm" 
    },
    { 
      icon: BoxesIcon, 
      label: t("header.inventory"), 
      labelAr: "المخزون",
      href: "/inventory" 
    },
    { 
      icon: Factory, 
      label: t("header.production"), 
      labelAr: "الإنتاج",
      href: "/production" 
    },
    { 
      icon: Cpu, 
      label: t("header.iot"), 
      labelAr: "إنترنت الأشياء",
      href: "/iot" 
    },
    { 
      icon: CheckCircle, 
      label: t("header.quality"), 
      labelAr: "الجودة",
      href: "/quality" 
    },
    { 
      icon: Users, 
      label: t("header.hrm"), 
      labelAr: "الموارد البشرية",
      href: "/hrm" 
    },
    { 
      icon: DollarSign, 
      label: t("header.accounting"), 
      labelAr: "المحاسبة",
      href: "/accounting" 
    },
    { 
      icon: ShoppingCart, 
      label: t("header.procurement"), 
      labelAr: "المشتريات",
      href: "/procurement" 
    },
    { 
      icon: TrendingUp, 
      label: t("header.sales"), 
      labelAr: "المبيعات",
      href: "/sales" 
    },
    { 
      icon: Calendar, 
      label: "MRP II", 
      labelAr: "تخطيط المواد",
      href: "/mrp" 
    },
    { 
      icon: Wrench, 
      label: "CMMS", 
      labelAr: "الصيانة",
      href: "/cmms" 
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="container max-w-[1920px] mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-primary hover:text-primary/90 transition-colors"
          >
            <img
              src="/Adsolution logotrans.png"
              alt="Adsolution Logo"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation - Mega Menu */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <NavigationMenuItem key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {isRTL ? item.labelAr : item.label}
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-border py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent/10"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{isRTL ? item.labelAr : item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
