import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Layers, BoxesIcon, Factory, Cpu, CheckCircle, Users, DollarSign,
  ShoppingCart, TrendingUp, BarChart3, Calendar, Wrench, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  icon: any;
  label: string;
  labelAr: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: BarChart3, label: 'Dashboard', labelAr: 'لوحة التحكم', path: '/dashboard' },
  { icon: Layers, label: 'PLM', labelAr: 'إدارة دورة المنتج', path: '/plm' },
  { icon: BoxesIcon, label: 'Inventory', labelAr: 'المخزون', path: '/inventory' },
  { icon: Factory, label: 'Production', labelAr: 'الإنتاج', path: '/production' },
  { icon: Cpu, label: 'IoT & Machines', labelAr: 'إنترنت الأشياء', path: '/iot' },
  { icon: CheckCircle, label: 'Quality', labelAr: 'الجودة', path: '/quality' },
  { icon: Users, label: 'HRM', labelAr: 'الموارد البشرية', path: '/hrm' },
  { icon: DollarSign, label: 'Finance', labelAr: 'المالية', path: '/accounting' },
  { icon: ShoppingCart, label: 'Procurement', labelAr: 'المشتريات', path: '/procurement' },
  { icon: ShoppingCart, label: 'SCM', labelAr: 'سلسلة التوريد', path: '/scm' },
  { icon: TrendingUp, label: 'Sales', labelAr: 'المبيعات', path: '/sales' },
  { icon: Calendar, label: 'MRP II', labelAr: 'تخطيط المواد', path: '/mrp' },
  { icon: Wrench, label: 'CMMS', labelAr: 'الصيانة', path: '/cmms' },
];

export function Sidebar() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 start-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 z-40 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white border-e border-slate-700/50 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 sm:p-6 border-b border-slate-700/50">
            <Link
              to="/"
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <img
                src="/Adsolution logotrans.png"
                alt="Adsolution Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                    active
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 flex-shrink-0 transition-transform",
                    active && "scale-110"
                  )} />
                  <span className="font-medium text-sm">{isRTL ? item.labelAr : item.label}</span>
                  {active && (
                    <div className="ms-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="text-xs text-slate-400 text-center">
              {isRTL ? '© 2024 نظام ERP' : '© 2024 ERP System'}
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
}

