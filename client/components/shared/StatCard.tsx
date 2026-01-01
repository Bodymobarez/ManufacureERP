import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  titleAr: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  subtitleAr?: string;
}

export function StatCard({
  title,
  titleAr,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor = 'text-primary',
  subtitle,
  subtitleAr,
}: StatCardProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="bg-card border border-border rounded-xl p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
            {isRTL ? titleAr : title}
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {changeType === 'increase' ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
              )}
              <span
                className={cn(
                  'text-xs sm:text-sm font-medium',
                  changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                )}
              >
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground hidden sm:block">
              {isRTL ? subtitleAr : subtitle}
            </p>
          )}
        </div>
        <div className={cn('p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0', iconColor)}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        </div>
      </div>
    </div>
  );
}

