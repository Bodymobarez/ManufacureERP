import { useTranslation } from 'react-i18next';
import { ModuleLayout } from '@/components/shared/ModuleLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  BarChart3, Package, Factory, CheckCircle, Users, DollarSign,
  TrendingUp, AlertTriangle, Clock, ArrowRight, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  mockWorkOrders, mockSalesOrders, mockKPIs, mockEmployees,
  mockMachines, mockStockItems, mockMaterials, mockProducts,
  getProductName
} from '@/store/data';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Calculate summary stats
  const activeWorkOrders = mockWorkOrders.filter(wo => wo.status === 'in_progress').length;
  const completedWorkOrders = mockWorkOrders.filter(wo => wo.status === 'completed').length;
  const pendingSalesOrders = mockSalesOrders.filter(so => ['confirmed', 'in_production'].includes(so.status)).length;
  const totalRevenue = mockSalesOrders.reduce((sum, so) => sum + so.total, 0);
  const runningMachines = mockMachines.filter(m => m.status === 'running').length;
  const lowStockItems = mockStockItems.filter(si => {
    const material = mockMaterials.find(m => m.id === si.materialId);
    return material && si.availableQuantity < material.minStock;
  }).length;

  const recentWorkOrders = mockWorkOrders.slice(0, 5);
  const recentSalesOrders = mockSalesOrders.slice(0, 5);

  return (
    <ModuleLayout>
      <PageHeader
        icon={BarChart3}
        title="Analytics Dashboard"
        titleAr="لوحة تحكم التحليلات"
        subtitle="Real-time overview of your manufacturing operations"
        subtitleAr="نظرة عامة فورية على عمليات التصنيع الخاصة بك"
        colorGradient="from-yellow-500 to-yellow-600"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Active Work Orders"
          titleAr="أوامر العمل النشطة"
          value={activeWorkOrders}
          change={12}
          changeType="increase"
          icon={Factory}
          iconColor="text-orange-500"
        />
        <StatCard
          title="Pending Sales Orders"
          titleAr="طلبات المبيعات المعلقة"
          value={pendingSalesOrders}
          change={-5}
          changeType="decrease"
          icon={Package}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Total Revenue (MTD)"
          titleAr="إجمالي الإيرادات (الشهر)"
          value={`$${(totalRevenue / 1000).toFixed(0)}K`}
          change={8.5}
          changeType="increase"
          icon={DollarSign}
          iconColor="text-green-500"
        />
        <StatCard
          title="Running Machines"
          titleAr="الآلات العاملة"
          value={`${runningMachines}/${mockMachines.length}`}
          change={3}
          changeType="increase"
          icon={TrendingUp}
          iconColor="text-purple-500"
        />
      </div>

      {/* KPI Metrics */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-6">
          {isRTL ? 'مؤشرات الأداء الرئيسية' : 'Key Performance Indicators'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockKPIs.map((kpi) => (
            <div key={kpi.id} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {isRTL ? kpi.nameAr : kpi.name}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  kpi.status === 'good' ? 'bg-green-100 text-green-700' :
                  kpi.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {kpi.target && `${isRTL ? 'الهدف' : 'Target'}: ${kpi.target}${kpi.unit}`}
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-foreground">
                  {kpi.value}{kpi.unit}
                </span>
                <span className={`text-sm mb-1 ${
                  kpi.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {kpi.changeType === 'increase' ? '↑' : '↓'} {Math.abs(kpi.change)}%
                </span>
              </div>
              {/* Progress bar */}
              {kpi.target && (
                <div className="mt-3">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        kpi.status === 'good' ? 'bg-green-500' :
                        kpi.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Alerts Section */}
      {lowStockItems > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                {isRTL ? 'تنبيه المخزون المنخفض' : 'Low Stock Alert'}
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {isRTL 
                  ? `${lowStockItems} مواد تحت الحد الأدنى للمخزون`
                  : `${lowStockItems} materials are below minimum stock level`}
              </p>
            </div>
            <Link 
              to="/inventory" 
              className="ms-auto text-sm font-medium text-yellow-700 hover:text-yellow-800 flex items-center gap-1"
            >
              {isRTL ? 'عرض' : 'View'} <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Work Orders */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">
              {isRTL ? 'أوامر العمل الأخيرة' : 'Recent Work Orders'}
            </h3>
            <Link to="/production" className="text-sm text-primary hover:underline flex items-center gap-1">
              {isRTL ? 'عرض الكل' : 'View All'} <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentWorkOrders.map((wo) => {
              const product = mockProducts.find(p => p.id === wo.productId);
              const progress = wo.quantity > 0 ? Math.round((wo.completedQuantity / wo.quantity) * 100) : 0;
              return (
                <div key={wo.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{wo.orderNumber}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {product ? getProductName(product, i18n.language) : wo.productId}
                    </p>
                  </div>
                  <div className="text-end">
                    <StatusBadge status={wo.status} />
                    <p className="text-xs text-muted-foreground mt-1">{progress}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Sales Orders */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">
              {isRTL ? 'طلبات المبيعات الأخيرة' : 'Recent Sales Orders'}
            </h3>
            <Link to="/sales" className="text-sm text-primary hover:underline flex items-center gap-1">
              {isRTL ? 'عرض الكل' : 'View All'} <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentSalesOrders.map((so) => (
              <div key={so.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{so.orderNumber}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {isRTL ? 'المطلوب' : 'Required'}: {so.requiredDate}
                  </p>
                </div>
                <div className="text-end">
                  <StatusBadge status={so.status} />
                  <p className="text-sm font-medium text-foreground mt-1">${so.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/hrm" className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
          <Users className="w-8 h-8 text-cyan-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">{mockEmployees.length}</p>
          <p className="text-sm text-muted-foreground">{isRTL ? 'الموظفين' : 'Employees'}</p>
        </Link>
        <Link to="/production" className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
          <Factory className="w-8 h-8 text-orange-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">{completedWorkOrders}</p>
          <p className="text-sm text-muted-foreground">{isRTL ? 'أوامر مكتملة' : 'Completed Orders'}</p>
        </Link>
        <Link to="/quality" className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
          <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">96.8%</p>
          <p className="text-sm text-muted-foreground">{isRTL ? 'معدل الجودة' : 'Quality Rate'}</p>
        </Link>
        <Link to="/iot" className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
          <Clock className="w-8 h-8 text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">78.5%</p>
          <p className="text-sm text-muted-foreground">{isRTL ? 'كفاءة المعدات' : 'OEE'}</p>
        </Link>
      </div>
    </ModuleLayout>
  );
}
