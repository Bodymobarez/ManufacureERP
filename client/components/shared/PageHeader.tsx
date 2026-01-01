import { LucideIcon, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  titleAr: string;
  subtitle?: string;
  subtitleAr?: string;
  colorGradient: string;
  actionLabel?: string;
  actionLabelAr?: string;
  onAction?: () => void;
}

export function PageHeader({
  icon: Icon,
  title,
  titleAr,
  subtitle,
  subtitleAr,
  colorGradient,
  actionLabel,
  actionLabelAr,
  onAction,
}: PageHeaderProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${colorGradient} text-white flex-shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground truncate">
            {isRTL ? titleAr : title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
              {isRTL ? subtitleAr : subtitle}
            </p>
          )}
        </div>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="gap-2 text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4 flex-shrink-0">
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">{isRTL ? actionLabelAr : actionLabel}</span>
        </Button>
      )}
    </div>
  );
}

