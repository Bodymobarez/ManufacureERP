import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface StatusConfig {
  label: string;
  labelAr: string;
  className: string;
}

const statusConfigs: Record<string, StatusConfig> = {
  // General
  active: { label: 'Active', labelAr: 'نشط', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  inactive: { label: 'Inactive', labelAr: 'غير نشط', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  draft: { label: 'Draft', labelAr: 'مسودة', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  
  // Work Orders
  planned: { label: 'Planned', labelAr: 'مخطط', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  in_progress: { label: 'In Progress', labelAr: 'قيد التنفيذ', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  completed: { label: 'Completed', labelAr: 'مكتمل', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  cancelled: { label: 'Cancelled', labelAr: 'ملغى', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  
  // Quality
  passed: { label: 'Passed', labelAr: 'ناجح', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  failed: { label: 'Failed', labelAr: 'فاشل', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  conditional: { label: 'Conditional', labelAr: 'مشروط', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  pending: { label: 'Pending', labelAr: 'معلق', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  
  // Purchase Orders
  sent: { label: 'Sent', labelAr: 'مرسل', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  confirmed: { label: 'Confirmed', labelAr: 'مؤكد', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  partially_received: { label: 'Partial', labelAr: 'جزئي', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  
  // Sales Orders
  ready: { label: 'Ready', labelAr: 'جاهز', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  shipped: { label: 'Shipped', labelAr: 'تم الشحن', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  delivered: { label: 'Delivered', labelAr: 'تم التسليم', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  in_production: { label: 'In Production', labelAr: 'قيد الإنتاج', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  
  // Priority
  low: { label: 'Low', labelAr: 'منخفض', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  medium: { label: 'Medium', labelAr: 'متوسط', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  high: { label: 'High', labelAr: 'عالي', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  urgent: { label: 'Urgent', labelAr: 'عاجل', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  
  // Machine Status
  running: { label: 'Running', labelAr: 'يعمل', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  idle: { label: 'Idle', labelAr: 'خامل', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  maintenance: { label: 'Maintenance', labelAr: 'صيانة', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  breakdown: { label: 'Breakdown', labelAr: 'عطل', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  
  // Employee
  present: { label: 'Present', labelAr: 'حاضر', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  absent: { label: 'Absent', labelAr: 'غائب', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  late: { label: 'Late', labelAr: 'متأخر', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  on_leave: { label: 'On Leave', labelAr: 'إجازة', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  
  // Invoice
  paid: { label: 'Paid', labelAr: 'مدفوع', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  overdue: { label: 'Overdue', labelAr: 'متأخر', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  
  // Supplier
  blacklisted: { label: 'Blacklisted', labelAr: 'محظور', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  
  // Product
  discontinued: { label: 'Discontinued', labelAr: 'متوقف', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  
  // Payroll
  approved: { label: 'Approved', labelAr: 'موافق عليه', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const config = statusConfigs[status] || {
    label: status,
    labelAr: status,
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {isRTL ? config.labelAr : config.label}
    </span>
  );
}



