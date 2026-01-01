import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ModuleLayout } from '@/components/shared/ModuleLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MegaMenuTabs } from '@/components/shared/MegaMenuTabs';
import { 
  Wrench, AlertTriangle, CheckCircle, TrendingDown, Calendar, DollarSign, Plus, Eye,
  ClipboardList, Package, BarChart3, Settings, Clock, FileText, Activity, Target
} from 'lucide-react';
import {
  mockMaintenanceSchedules, mockMaintenanceWorkOrders, mockBreakdownRecords,
  mockSpareParts, mockMaintenanceMetrics,
  MaintenanceSchedule, MaintenanceWorkOrder, BreakdownRecord, SparePart
} from '@/store/cmmsData';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, convertCurrency } from '@/store/currencyData';
import { useToast } from '@/hooks/use-toast';

export default function CMMS() {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';

  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>(mockMaintenanceSchedules);
  const [workOrders, setWorkOrders] = useState<MaintenanceWorkOrder[]>(mockMaintenanceWorkOrders);
  const [breakdowns, setBreakdowns] = useState<BreakdownRecord[]>(mockBreakdownRecords);
  const [spareParts, setSpareParts] = useState<SparePart[]>(mockSpareParts);
  const [metrics] = useState(mockMaintenanceMetrics);

  // Active tab
  const [activeTab, setActiveTab] = useState<string>('schedules');

  // Stats
  const scheduledMaintenance = schedules.filter(s => s.status === 'scheduled').length;
  const overdueMaintenance = schedules.filter(s => s.status === 'overdue').length;
  const activeWorkOrders = workOrders.filter(wo => ['pending', 'assigned', 'in_progress'].includes(wo.status)).length;
  const totalMaintenanceCost = workOrders.reduce((sum, wo) => sum + wo.totalCost, 0);
  const avgMTBF = metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.mtbf, 0) / metrics.length : 0;
  const avgMTTR = metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.mttr, 0) / metrics.length : 0;
  const totalBreakdowns = breakdowns.length;
  const criticalBreakdowns = breakdowns.filter(b => b.priority === 'critical').length;
  const totalSparePartsValue = spareParts.reduce((sum, sp) => sum + sp.unitPrice * sp.quantity, 0);

  // Mega Menu Tabs Configuration
  const megaMenuTabs = useMemo(() => [
    {
      id: 'schedules',
      label: 'Schedules',
      labelAr: 'الجدولات',
      subtitle: 'Maintenance Schedules',
      subtitleAr: 'جدولات الصيانة',
      icon: <Calendar className="w-4 h-4" />,
      onClick: () => setActiveTab('schedules'),
    },
    {
      id: 'workorders',
      label: 'Work Orders',
      labelAr: 'أوامر العمل',
      subtitle: 'Maintenance WO',
      subtitleAr: 'أوامر الصيانة',
      icon: <ClipboardList className="w-4 h-4" />,
      onClick: () => setActiveTab('workorders'),
    },
    {
      id: 'breakdowns',
      label: 'Breakdowns',
      labelAr: 'الأعطال',
      subtitle: 'Breakdown Records',
      subtitleAr: 'سجلات الأعطال',
      icon: <AlertTriangle className="w-4 h-4" />,
      onClick: () => setActiveTab('breakdowns'),
    },
    {
      id: 'spareparts',
      label: 'Spare Parts',
      labelAr: 'قطع الغيار',
      subtitle: 'Parts Inventory',
      subtitleAr: 'مخزون القطع',
      icon: <Package className="w-4 h-4" />,
      onClick: () => setActiveTab('spareparts'),
    },
    {
      id: 'metrics',
      label: 'Metrics',
      labelAr: 'المقاييس',
      subtitle: 'MTBF/MTTR',
      subtitleAr: 'MTBF/MTTR',
      icon: <Activity className="w-4 h-4" />,
      onClick: () => setActiveTab('metrics'),
    },
    {
      id: 'costs',
      label: 'Costs',
      labelAr: 'التكاليف',
      subtitle: 'Maintenance Costs',
      subtitleAr: 'تكاليف الصيانة',
      icon: <DollarSign className="w-4 h-4" />,
      onClick: () => setActiveTab('costs'),
    },
    {
      id: 'reports',
      label: 'Reports',
      labelAr: 'التقارير',
      subtitle: 'CMMS Reports',
      subtitleAr: 'تقارير CMMS',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => setActiveTab('reports'),
    },
  ], []);

  // Work Order Columns
  const woColumns: Column<MaintenanceWorkOrder>[] = [
    {
      key: 'code',
      header: 'WO Code',
      headerAr: 'كود أمر العمل',
      render: (item) => <span className="font-mono font-medium">{item.code}</span>
    },
    {
      key: 'machine',
      header: 'Machine',
      headerAr: 'الماكينة',
      render: (item) => (
        <div>
          <p className="font-medium">{isRTL ? item.machineNameAr : item.machineName}</p>
          <p className="text-sm text-muted-foreground font-mono">{item.machineCode}</p>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      headerAr: 'النوع',
      render: (item) => <span className="capitalize">{item.type}</span>
    },
    {
      key: 'priority',
      header: 'Priority',
      headerAr: 'الأولوية',
      render: (item) => (
        <StatusBadge 
          status={item.priority === 'critical' ? 'critical' : item.priority === 'high' ? 'high' : 'medium'} 
        />
      )
    },
    {
      key: 'assigned',
      header: 'Assigned To',
      headerAr: 'مكلف',
      render: (item) => item.assignedTechnicianName || <span className="text-muted-foreground">-</span>
    },
    {
      key: 'dates',
      header: 'Dates',
      headerAr: 'التواريخ',
      render: (item) => (
        <div className="text-sm">
          <p>Scheduled: {item.scheduledDate || item.requestedDate}</p>
          {item.completionDate && <p>Completed: {item.completionDate}</p>}
        </div>
      )
    },
    {
      key: 'cost',
      header: 'Cost',
      headerAr: 'التكلفة',
      render: (item) => (
        <div className="text-sm">
          <p className="font-medium">{formatCurrency(item.totalCost, item.costCurrency)}</p>
          {item.downtimeHours && <p className="text-muted-foreground">{item.downtimeHours}h downtime</p>}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status} />
    },
  ];

  // Breakdown Columns
  const breakdownColumns: Column<BreakdownRecord>[] = [
    {
      key: 'code',
      header: 'Breakdown #',
      headerAr: 'رقم العطل',
      render: (item) => <span className="font-mono font-medium">{item.code}</span>
    },
    {
      key: 'machine',
      header: 'Machine',
      headerAr: 'الماكينة',
      render: (item) => (
        <div>
          <p className="font-medium">{isRTL ? item.machineNameAr : item.machineName}</p>
          <p className="text-sm text-muted-foreground font-mono">{item.machineCode}</p>
        </div>
      )
    },
    {
      key: 'failure',
      header: 'Failure',
      headerAr: 'العطل',
      render: (item) => (
        <div>
          <p className="font-medium">{isRTL ? item.descriptionAr : item.description}</p>
          <p className="text-xs text-muted-foreground capitalize">{item.failureType}</p>
        </div>
      )
    },
    {
      key: 'severity',
      header: 'Severity',
      headerAr: 'الشدة',
      render: (item) => (
        <StatusBadge 
          status={item.severity === 'critical' ? 'critical' : item.severity === 'major' ? 'high' : 'medium'} 
        />
      )
    },
    {
      key: 'downtime',
      header: 'Downtime',
      headerAr: 'وقت التوقف',
      render: (item) => (
        <div className="text-sm">
          <p className="font-medium">{item.downtimeHours}h</p>
          <p className="text-muted-foreground">Est. Loss: {formatCurrency(item.impact.estimatedLoss, 'USD')}</p>
        </div>
      )
    },
    {
      key: 'dates',
      header: 'Dates',
      headerAr: 'التواريخ',
      render: (item) => (
        <div className="text-sm">
          <p>Failed: {item.failureDate}</p>
          {item.resolvedDate && <p>Resolved: {item.resolvedDate}</p>}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => item.resolvedDate ? (
        <StatusBadge status="completed" />
      ) : (
        <StatusBadge status="in_progress" />
      )
    },
  ];

  return (
    <ModuleLayout>
      <PageHeader
        icon={Wrench}
        title="CMMS - Maintenance Management"
        titleAr="إدارة الصيانة - CMMS"
        subtitle="Preventive maintenance, breakdown management, spare parts, MTBF/MTTR tracking"
        subtitleAr="الصيانة الوقائية، إدارة الأعطال، قطع الغيار، تتبع MTBF/MTTR"
        colorGradient="from-purple-500 to-purple-600"
        actionLabel="New Work Order"
        actionLabelAr="أمر عمل جديد"
        onAction={() => {}}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <StatCard title="Scheduled" titleAr="مجدولة" value={scheduledMaintenance} icon={Calendar} iconColor="text-blue-500" />
        <StatCard title="Overdue" titleAr="متأخرة" value={overdueMaintenance} icon={AlertTriangle} iconColor="text-red-500" />
        <StatCard title="Active WOs" titleAr="أوامر نشطة" value={activeWorkOrders} icon={Wrench} iconColor="text-orange-500" />
        <StatCard title="Avg MTBF" titleAr="متوسط MTBF" value={`${Math.round(avgMTBF)}h`} icon={TrendingDown} iconColor="text-green-500" />
        <StatCard title="Avg MTTR" titleAr="متوسط MTTR" value={`${Math.round(avgMTTR)}h`} icon={CheckCircle} iconColor="text-cyan-500" />
        <StatCard title="Total Cost" titleAr="التكلفة الإجمالية" value={formatCurrency(totalMaintenanceCost, 'USD')} icon={DollarSign} iconColor="text-purple-500" />
      </div>

      {/* Mega Menu Tabs */}
      <MegaMenuTabs
        tabs={megaMenuTabs.map(tab => ({
          ...tab,
          isActive: activeTab === tab.id,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isRTL={isRTL}
        className="mb-6"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">

        <TabsContent value="workorders" className="space-y-4">
          <DataTable data={workOrders} columns={woColumns} />
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            {isRTL ? 'جدولات الصيانة الوقائية' : 'Preventive maintenance schedules'}
          </div>
          {/* Add schedule table here */}
        </TabsContent>

        <TabsContent value="breakdowns" className="space-y-4">
          <DataTable data={breakdowns} columns={breakdownColumns} />
        </TabsContent>

        <TabsContent value="spareparts" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            {isRTL ? 'إدارة قطع الغيار' : 'Spare parts inventory management'}
          </div>
          {/* Add spare parts table here */}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'مقاييس الصيانة' : 'Maintenance Metrics'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{isRTL ? 'متوسط الوقت بين الأعطال' : 'Average MTBF'}</span>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{Math.round(avgMTBF)} {isRTL ? 'ساعة' : 'hours'}</p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{isRTL ? 'متوسط وقت الإصلاح' : 'Average MTTR'}</span>
                  <Target className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{Math.round(avgMTTR)} {isRTL ? 'ساعة' : 'hours'}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {metrics.map(metric => (
                <div key={metric.id} className="border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{isRTL ? metric.machineNameAr : metric.machineName}</p>
                      <p className="text-sm text-muted-foreground font-mono">{metric.machineCode}</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">MTBF: </span>
                        <span className="font-medium">{metric.mtbf}h</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">MTTR: </span>
                        <span className="font-medium">{metric.mttr}h</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== COSTS TAB ==================== */}
        <TabsContent value="costs" className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'تكاليف الصيانة' : 'Maintenance Costs'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{isRTL ? 'إجمالي تكاليف الصيانة' : 'Total Maintenance Cost'}</span>
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{formatCurrency(totalMaintenanceCost, 'USD')}</p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{isRTL ? 'قيمة قطع الغيار' : 'Spare Parts Value'}</span>
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{formatCurrency(totalSparePartsValue, 'USD')}</p>
              </div>
            </div>
            <div className="space-y-2">
              {workOrders.slice(0, 10).map(wo => (
                <div key={wo.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium font-mono">{wo.code}</p>
                    <p className="text-sm text-muted-foreground">{isRTL ? wo.machineNameAr : wo.machineName}</p>
                  </div>
                  <span className="font-medium">{formatCurrency(wo.totalCost, wo.costCurrency)}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== REPORTS TAB ==================== */}
        <TabsContent value="reports" className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'تقارير CMMS' : 'CMMS Reports'}</h3>
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'قريباً: تقارير CMMS' : 'Coming soon: CMMS Reports'}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </ModuleLayout>
  );
}



