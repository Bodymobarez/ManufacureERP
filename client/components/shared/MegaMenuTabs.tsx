// ==================== MEGA MENU TABS COMPONENT ====================

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MegaMenuTab {
  id: string;
  label: string;
  labelAr: string;
  subtitle?: string;
  subtitleAr?: string;
  icon?: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}

interface MegaMenuTabsProps {
  tabs: MegaMenuTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  isRTL?: boolean;
  className?: string;
}

export function MegaMenuTabs({ tabs, activeTab, onTabChange, isRTL = false, className }: MegaMenuTabsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex gap-2 flex-wrap justify-start items-stretch pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id || tab.isActive;
          return (
            <button
              key={tab.id}
              onClick={() => {
                tab.onClick?.();
                onTabChange?.(tab.id);
              }}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1.5 px-5 py-4 rounded-xl transition-all duration-200 min-w-[150px] flex-1 max-w-[200px]",
                "hover:bg-accent/50 hover:scale-105",
                isActive
                  ? "bg-white dark:bg-gray-800 shadow-lg border-2 border-primary scale-105"
                  : "bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
              )}
            >
              {tab.icon && (
                <div className={cn("mb-0.5", isActive ? "text-primary" : "text-muted-foreground")}>
                  {tab.icon}
                </div>
              )}
              <span className={cn(
                "text-sm font-bold text-center leading-tight",
                isActive ? "text-primary" : "text-foreground"
              )}>
                {isRTL ? tab.labelAr : tab.label}
              </span>
              {tab.subtitle && (
                <span className={cn(
                  "text-xs text-center leading-tight mt-0.5",
                  isActive ? "text-primary/80 font-medium" : "text-muted-foreground"
                )}>
                  {isRTL ? tab.subtitleAr : tab.subtitle}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

