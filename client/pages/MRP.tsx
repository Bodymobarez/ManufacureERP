import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ModuleLayout } from '@/components/shared/ModuleLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MegaMenuTabs } from '@/components/shared/MegaMenuTabs';
import { 
  Calendar, TrendingUp, Package, AlertTriangle, CheckCircle, Plus, Eye,
  BarChart3, ClipboardList, ShoppingCart, Factory, Boxes, Clock, FileText,
  Target, Settings, ArrowRight, Zap
} from 'lucide-react';
import {
  mockDemandForecasts, mockMasterProductionSchedules, mockMaterialRequirements,
  mockCapacityPlans, mockLineBalances,
  DemandForecast, MasterProductionSchedule, MaterialRequirement, CapacityPlan, LineBalance
} from '@/store/mrpData';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function MRP() {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';

  const [demandForecasts, setDemandForecasts] = useState<DemandForecast[]>(mockDemandForecasts);
  const [mps, setMps] = useState<MasterProductionSchedule[]>(mockMasterProductionSchedules);
  const [materialRequirements, setMaterialRequirements] = useState<MaterialRequirement[]>(mockMaterialRequirements);
  const [capacityPlans, setCapacityPlans] = useState<CapacityPlan[]>(mockCapacityPlans);
  const [lineBalances, setLineBalances] = useState<LineBalance[]>(mockLineBalances);

  // Active tab
  const [activeTab, setActiveTab] = useState<string>('forecast');

  // Stats
  const totalForecastQuantity = demandForecasts.reduce((sum, f) => sum + f.forecastQuantity, 0);
  const activeMPS = mps.filter(m => ['approved', 'in_progress'].includes(m.status)).length;
  const materialShortages = materialRequirements.filter(m => m.status === 'shortage').length;
  const capacityUtilization = capacityPlans.length > 0 ? capacityPlans.reduce((sum, c) => sum + c.utilizationPercent, 0) / capacityPlans.length : 0;
  const totalShortageValue = materialRequirements
    .filter(m => m.shortage > 0)
    .reduce((sum, m) => sum + m.shortage, 0);
  const readyForProduction = mps.filter(m => m.materialsReady && m.laborReady && m.equipmentReady).length;
  const pendingApprovals = mps.filter(m => m.status === 'draft').length;

  // Mega Menu Tabs Configuration
  const megaMenuTabs = useMemo(() => [
    {
      id: 'forecast',
      label: 'Demand Forecast',
      labelAr: 'التنبؤ بالطلب',
      subtitle: 'Sales Forecasting',
      subtitleAr: 'التنبؤ بالمبيعات',
      icon: <TrendingUp className="w-4 h-4" />,
      onClick: () => setActiveTab('forecast'),
    },
    {
      id: 'mps',
      label: 'MPS',
      labelAr: 'جدولة الإنتاج',
      subtitle: 'Master Production Schedule',
      subtitleAr: 'جدولة الإنتاج الرئيسية',
      icon: <Calendar className="w-4 h-4" />,
      onClick: () => setActiveTab('mps'),
    },
    {
      id: 'materials',
      label: 'Materials',
      labelAr: 'متطلبات المواد',
      subtitle: 'Material Requirements',
      subtitleAr: 'متطلبات المواد',
      icon: <Package className="w-4 h-4" />,
      onClick: () => setActiveTab('materials'),
    },
    {
      id: 'capacity',
      label: 'Capacity',
      labelAr: 'تخطيط الطاقة',
      subtitle: 'Capacity Planning',
      subtitleAr: 'تخطيط الطاقة',
      icon: <Target className="w-4 h-4" />,
      onClick: () => setActiveTab('capacity'),
    },
    {
      id: 'balance',
      label: 'Line Balance',
      labelAr: 'توزان الخط',
      subtitle: 'Production Line Balance',
      subtitleAr: 'توزان خط الإنتاج',
      icon: <Zap className="w-4 h-4" />,
      onClick: () => setActiveTab('balance'),
    },
    {
      id: 'purchasing',
      label: 'Purchasing',
      labelAr: 'الشراء',
      subtitle: 'Purchase Requisitions',
      subtitleAr: 'طلبات الشراء',
      icon: <ShoppingCart className="w-4 h-4" />,
      onClick: () => setActiveTab('purchasing'),
    },
    {
      id: 'production',
      label: 'Production Plan',
      labelAr: 'تخطيط الإنتاج',
      subtitle: 'Production Planning',
      subtitleAr: 'تخطيط الإنتاج',
      icon: <Factory className="w-4 h-4" />,
      onClick: () => setActiveTab('production'),
    },
    {
      id: 'inventory',
      label: 'Inventory Plan',
      labelAr: 'تخطيط المخزون',
      subtitle: 'Inventory Planning',
      subtitleAr: 'تخطيط المخزون',
      icon: <Boxes className="w-4 h-4" />,
      onClick: () => setActiveTab('inventory'),
    },
    {
      id: 'leadtime',
      label: 'Lead Time',
      labelAr: 'أوقات التسليم',
      subtitle: 'Lead Time Management',
      subtitleAr: 'إدارة أوقات التسليم',
      icon: <Clock className="w-4 h-4" />,
      onClick: () => setActiveTab('leadtime'),
    },
    {
      id: 'reports',
      label: 'Reports',
      labelAr: 'التقارير',
      subtitle: 'MRP Reports',
      subtitleAr: 'تقارير MRP',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => setActiveTab('reports'),
    },
  ], []);

  // MPS Columns
  const mpsColumns: Column<MasterProductionSchedule>[] = [
    {
      key: 'code',
      header: 'MPS Code',
      headerAr: 'كود الجدولة',
      render: (item) => <span className="font-mono font-medium">{item.code}</span>
    },
    {
      key: 'product',
      header: 'Product',
      headerAr: 'المنتج',
      render: (item) => (
        <div>
          <p className="font-medium">{isRTL ? item.productNameAr : item.productName}</p>
          <p className="text-sm text-muted-foreground font-mono">{item.productCode}</p>
        </div>
      )
    },
    {
      key: 'quantity',
      header: 'Planned Qty',
      headerAr: 'الكمية المخططة',
      render: (item) => <span className="font-medium">{item.plannedQuantity.toLocaleString()}</span>
    },
    {
      key: 'dates',
      header: 'Dates',
      headerAr: 'التواريخ',
      render: (item) => (
        <div className="text-sm">
          <p>Start: {item.plannedStartDate}</p>
          <p>End: {item.plannedEndDate}</p>
        </div>
      )
    },
    {
      key: 'capacity',
      header: 'Capacity',
      headerAr: 'القدرة',
      render: (item) => {
        const util = Math.round((item.capacityRequired / item.capacityAvailable) * 100);
        return (
          <div className="w-24">
            <Progress value={util} className="h-2" />
            <span className="text-xs text-muted-foreground">{util}%</span>
          </div>
        );
      }
    },
    {
      key: 'readiness',
      header: 'Readiness',
      headerAr: 'الجاهزية',
      render: (item) => (
        <div className="flex gap-1">
          {item.materialsReady && <CheckCircle className="w-4 h-4 text-green-500" />}
          {item.laborReady && <CheckCircle className="w-4 h-4 text-green-500" />}
          {item.equipmentReady && <CheckCircle className="w-4 h-4 text-green-500" />}
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

  // Material Requirement Columns
  const mrColumns: Column<MaterialRequirement>[] = [
    {
      key: 'material',
      header: 'Material',
      headerAr: 'المادة',
      render: (item) => (
        <div>
          <p className="font-medium">{isRTL ? item.materialNameAr : item.materialName}</p>
          <p className="text-sm text-muted-foreground font-mono">{item.materialCode}</p>
        </div>
      )
    },
    {
      key: 'required',
      header: 'Required',
      headerAr: 'مطلوب',
      render: (item) => <span className="font-medium">{item.requiredQuantity.toLocaleString()} {item.unit}</span>
    },
    {
      key: 'available',
      header: 'Available',
      headerAr: 'متاح',
      render: (item) => (
        <div className="text-sm">
          <p>Stock: {item.currentStock.toLocaleString()}</p>
          <p className="text-muted-foreground">Available: {item.availableStock.toLocaleString()}</p>
        </div>
      )
    },
    {
      key: 'shortage',
      header: 'Shortage',
      headerAr: 'نقص',
      render: (item) => (
        <span className={`font-medium ${item.shortage > 0 ? 'text-red-500' : 'text-green-600'}`}>
          {item.shortage > 0 ? `-${item.shortage.toLocaleString()}` : 'OK'}
        </span>
      )
    },
    {
      key: 'requiredDate',
      header: 'Required Date',
      headerAr: 'التاريخ المطلوب',
      render: (item) => <span className="text-sm">{item.requiredDate}</span>
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status} />
    },
  ];

  return (
    <ModuleLayout>
      <PageHeader
        icon={Calendar}
        title="MRP II - Material Requirement Planning"
        titleAr="تخطيط متطلبات المواد - MRP II"
        subtitle="Demand forecasting, master production scheduling, capacity planning, material requirements"
        subtitleAr="التنبؤ بالطلب، جدولة الإنتاج الرئيسية، تخطيط الطاقة، متطلبات المواد"
        colorGradient="from-blue-500 to-blue-600"
        actionLabel="New MPS"
        actionLabelAr="جدولة جديدة"
        onAction={() => {}}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <StatCard title="Forecast Qty" titleAr="الكمية المتوقعة" value={totalForecastQuantity.toLocaleString()} icon={TrendingUp} iconColor="text-blue-500" />
        <StatCard title="Active MPS" titleAr="الجدولات النشطة" value={activeMPS} icon={Calendar} iconColor="text-green-500" />
        <StatCard title="Shortages" titleAr="نقص المواد" value={materialShortages} icon={AlertTriangle} iconColor="text-red-500" />
        <StatCard title="Capacity Util." titleAr="استخدام الطاقة" value={`${Math.round(capacityUtilization)}%`} icon={Target} iconColor="text-orange-500" />
        <StatCard title="Ready" titleAr="جاهز للإنتاج" value={readyForProduction} icon={CheckCircle} iconColor="text-green-500" />
        <StatCard title="Pending" titleAr="في الانتظار" value={pendingApprovals} icon={Clock} iconColor="text-yellow-500" />
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

        <TabsContent value="mps" className="space-y-4">
          <DataTable data={mps} columns={mpsColumns} />
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'التنبؤ بالطلب' : 'Demand Forecast'}</h3>
              <Button className="gap-2" onClick={() => toast({ title: isRTL ? 'إنشاء تنبؤ جديد' : 'Create new forecast' })}>
                <Plus className="w-4 h-4" />{isRTL ? 'تنبؤ جديد' : 'New Forecast'}
              </Button>
            </div>
            <DataTable
              data={demandForecasts}
              columns={[
                {
                  key: 'product',
                  header: 'Product',
                  headerAr: 'المنتج',
                  render: (item) => (
                    <div>
                      <p className="font-medium">{isRTL ? item.productNameAr : item.productName}</p>
                      <p className="text-sm text-muted-foreground font-mono">{item.productCode}</p>
                    </div>
                  )
                },
                {
                  key: 'period',
                  header: 'Period',
                  headerAr: 'الفترة',
                  render: (item) => <span className="font-mono">{item.period}</span>
                },
                {
                  key: 'forecast',
                  header: 'Forecast Qty',
                  headerAr: 'الكمية المتوقعة',
                  render: (item) => <span className="font-medium">{item.forecastQuantity.toLocaleString()}</span>
                },
                {
                  key: 'confidence',
                  header: 'Confidence',
                  headerAr: 'مستوى الثقة',
                  render: (item) => (
                    <div className="w-24">
                      <Progress value={item.confidenceLevel} className="h-2" />
                      <span className="text-xs text-muted-foreground">{item.confidenceLevel}%</span>
                    </div>
                  )
                },
                {
                  key: 'method',
                  header: 'Method',
                  headerAr: 'الطريقة',
                  render: (item) => <Badge variant="outline">{item.forecastMethod}</Badge>
                },
              ]}
              searchKey="productCode"
            />
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'متطلبات المواد' : 'Material Requirements'}</h3>
              <Button variant="outline" className="gap-2" onClick={() => toast({ title: isRTL ? 'إنشاء طلب شراء' : 'Create purchase requisition' })}>
                <ShoppingCart className="w-4 h-4" />{isRTL ? 'طلب شراء' : 'Purchase Req'}
              </Button>
            </div>
            <DataTable data={materialRequirements} columns={mrColumns} searchKey="materialCode" />
          </div>
        </TabsContent>

        <TabsContent value="capacity" className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'تخطيط الطاقة' : 'Capacity Planning'}</h3>
            <div className="space-y-4">
              {capacityPlans.map(plan => (
                <div key={plan.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{isRTL ? plan.productionLineNameAr : plan.productionLineName}</h4>
                      <p className="text-sm text-muted-foreground">{plan.date}</p>
                    </div>
                    <Badge variant={plan.bottleneck ? 'destructive' : 'default'}>
                      {plan.utilizationPercent}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{isRTL ? 'القدرة المخططة' : 'Planned Capacity'}</span>
                      <span className="font-medium">{plan.plannedCapacity}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{isRTL ? 'القدرة المخصصة' : 'Allocated Capacity'}</span>
                      <span className="font-medium">{plan.allocatedCapacity}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{isRTL ? 'القدرة المتاحة' : 'Available Capacity'}</span>
                      <span className="font-medium text-green-600">{plan.availableCapacity}h</span>
                    </div>
                    <Progress value={plan.utilizationPercent} className="h-2 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="balance" className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'توزان الخط' : 'Line Balancing'}</h3>
            <div className="space-y-4">
              {lineBalances.map(balance => (
                <div key={balance.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{isRTL ? balance.productName : balance.productName}</h4>
                      <p className="text-sm text-muted-foreground">{balance.productionLineName}</p>
                    </div>
                    <Badge variant={balance.balanceEfficiency >= 85 ? 'default' : 'secondary'}>
                      {balance.balanceEfficiency}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{isRTL ? 'إجمالي SMV' : 'Total SMV'}</span>
                      <span className="font-medium">{balance.totalSMV}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{isRTL ? 'الكمية المستهدفة' : 'Target Quantity'}</span>
                      <span className="font-medium">{balance.targetQuantity.toLocaleString()}</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">{isRTL ? 'العمليات' : 'Operations'}</p>
                      <div className="space-y-1">
                        {balance.operations.map(op => (
                          <div key={op.id} className="flex items-center justify-between text-xs p-2 bg-muted/50 rounded">
                            <span>{isRTL ? op.operationNameAr : op.operationName}</span>
                            <span className="font-mono">{op.smv} SMV</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== PURCHASING TAB ==================== */}
        <TabsContent value="purchasing" className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'طلبات الشراء' : 'Purchase Requisitions'}</h3>
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'قريباً: طلبات الشراء من MRP' : 'Coming soon: Purchase Requisitions from MRP'}
              <div className="mt-2 text-sm">
                {isRTL ? 'سيتم إنشاء طلبات الشراء تلقائياً من متطلبات المواد' : 'Purchase requisitions will be auto-generated from material requirements'}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ==================== PRODUCTION PLAN TAB ==================== */}
        <TabsContent value="production" className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'تخطيط الإنتاج' : 'Production Planning'}</h3>
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'قريباً: تخطيط الإنتاج من MPS' : 'Coming soon: Production Planning from MPS'}
              <div className="mt-2 text-sm">
                {isRTL ? 'سيتم إنشاء أوامر الإنتاج تلقائياً من جدولة الإنتاج الرئيسية' : 'Production orders will be auto-generated from Master Production Schedule'}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ==================== INVENTORY PLAN TAB ==================== */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'تخطيط المخزون' : 'Inventory Planning'}</h3>
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'قريباً: تخطيط المخزون' : 'Coming soon: Inventory Planning'}
              <div className="mt-2 text-sm">
                {isRTL ? 'تخطيط مستويات المخزون بناءً على الطلب المتوقع' : 'Plan inventory levels based on forecasted demand'}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ==================== LEAD TIME TAB ==================== */}
        <TabsContent value="leadtime" className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'إدارة أوقات التسليم' : 'Lead Time Management'}</h3>
            <div className="space-y-4">
              {materialRequirements.map(mr => (
                <div key={mr.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{isRTL ? mr.materialNameAr : mr.materialName}</p>
                      <p className="text-sm text-muted-foreground font-mono">{mr.materialCode}</p>
                    </div>
                    <Badge variant={mr.leadTimeDays <= 7 ? 'default' : mr.leadTimeDays <= 15 ? 'secondary' : 'destructive'}>
                      {mr.leadTimeDays} {isRTL ? 'يوم' : 'days'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>{isRTL ? 'التاريخ المطلوب' : 'Required Date'}</span>
                    <span className="font-medium">{mr.requiredDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{isRTL ? 'تاريخ الطلب الموصى به' : 'Recommended Order Date'}</span>
                    <span className="font-medium text-blue-600">
                      {new Date(new Date(mr.requiredDate).getTime() - mr.leadTimeDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== REPORTS TAB ==================== */}
        <TabsContent value="reports" className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'تقارير MRP' : 'MRP Reports'}</h3>
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'قريباً: تقارير MRP' : 'Coming soon: MRP Reports'}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </ModuleLayout>
  );
}



