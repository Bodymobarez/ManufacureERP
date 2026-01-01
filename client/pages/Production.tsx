import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ModuleLayout } from '@/components/shared/ModuleLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MegaMenuTabs } from '@/components/shared/MegaMenuTabs';
import {
  Factory, Scissors, PlayCircle, PauseCircle, CheckCircle, Clock, AlertTriangle,
  Users, Package, Layers, RefreshCw, Eye, Edit, Trash2, Plus, TrendingUp,
  Activity, Target, Zap, Settings, ArrowRight, BarChart3, ClipboardList,
  Wrench, PackageCheck, FileText, Calendar, TrendingDown
} from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  mockProductionOrders, mockWorkOrders, mockProductionLines, mockWIPRecords,
  mockProductionDefects, mockReworkOrders, mockBatchTrackers, mockProductionProgress,
  stageConfigs, ProductionOrder, WorkOrder, ProductionLine, WIPRecord, ProductionDefect,
  ReworkOrder, BatchTracker, ProductionStage, getOrderProgress, getWorkOrderProgress,
  getLineName, getStageName, getLineUtilization, generateId
} from '@/store/productionData';
import {
  ProductionOrderForm, WorkOrderForm, ProductionDefectForm, ProgressUpdateForm, LineConfigForm
} from '@/components/production/ProductionForms';

export default function Production() {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';

  // State
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(mockProductionOrders);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [productionLines, setProductionLines] = useState<ProductionLine[]>(mockProductionLines);
  const [wipRecords] = useState<WIPRecord[]>(mockWIPRecords);
  const [defects, setDefects] = useState<ProductionDefect[]>(mockProductionDefects);
  const [reworkOrders] = useState<ReworkOrder[]>(mockReworkOrders);
  const [batchTrackers] = useState<BatchTracker[]>(mockBatchTrackers);
  const [progressData] = useState(mockProductionProgress);

  // Dialog states
  const [selectedPO, setSelectedPO] = useState<ProductionOrder | null>(null);
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);
  const [selectedLine, setSelectedLine] = useState<ProductionLine | null>(null);
  const [selectedDefect, setSelectedDefect] = useState<ProductionDefect | null>(null);

  const [isAddPOOpen, setIsAddPOOpen] = useState(false);
  const [isEditPOOpen, setIsEditPOOpen] = useState(false);
  const [isAddWOOpen, setIsAddWOOpen] = useState(false);
  const [isEditWOOpen, setIsEditWOOpen] = useState(false);
  const [isAddDefectOpen, setIsAddDefectOpen] = useState(false);
  const [isProgressUpdateOpen, setIsProgressUpdateOpen] = useState(false);
  const [isLineConfigOpen, setIsLineConfigOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null);

  // Filter states
  const [stageFilter, setStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Active tab
  const [activeTab, setActiveTab] = useState<string>('orders');

  // Stats
  const totalOrders = productionOrders.length;
  const activeOrders = productionOrders.filter(o => o.status === 'in_progress').length;
  const totalWorkOrders = workOrders.length;
  const activeWorkOrders = workOrders.filter(wo => wo.status === 'in_progress').length;
  const totalWIP = wipRecords.reduce((sum, w) => sum + w.quantity, 0);
  const activeDefects = defects.filter(d => d.status === 'reported' || d.status === 'in_rework').length;
  const avgEfficiency = Math.round(productionLines.reduce((sum, l) => sum + l.efficiency, 0) / productionLines.length);
  const totalCapacity = productionLines.reduce((sum, l) => sum + l.capacity, 0);
  const totalLoad = productionLines.reduce((sum, l) => sum + l.currentLoad, 0);

  // Mega Menu Tabs Configuration
  const megaMenuTabs = useMemo(() => [
    {
      id: 'orders',
      label: 'Production Orders',
      labelAr: 'أوامر الإنتاج',
      subtitle: 'Order Management',
      subtitleAr: 'إدارة الأوامر',
      icon: <ClipboardList className="w-4 h-4" />,
      onClick: () => setActiveTab('orders'),
    },
    {
      id: 'workorders',
      label: 'Work Orders',
      labelAr: 'أوامر العمل',
      subtitle: 'Work Management',
      subtitleAr: 'إدارة العمل',
      icon: <Factory className="w-4 h-4" />,
      onClick: () => setActiveTab('workorders'),
    },
    {
      id: 'wip',
      label: 'WIP',
      labelAr: 'قيد التنفيذ',
      subtitle: 'Work in Progress',
      subtitleAr: 'العمل قيد التنفيذ',
      icon: <Package className="w-4 h-4" />,
      onClick: () => setActiveTab('wip'),
    },
    {
      id: 'defects',
      label: 'Defects',
      labelAr: 'العيوب',
      subtitle: 'Defect Management',
      subtitleAr: 'إدارة العيوب',
      icon: <AlertTriangle className="w-4 h-4" />,
      onClick: () => setActiveTab('defects'),
    },
    {
      id: 'rework',
      label: 'Rework',
      labelAr: 'إعادة العمل',
      subtitle: 'Rework Orders',
      subtitleAr: 'أوامر إعادة العمل',
      icon: <RefreshCw className="w-4 h-4" />,
      onClick: () => setActiveTab('rework'),
    },
    {
      id: 'lines',
      label: 'Production Lines',
      labelAr: 'خطوط الإنتاج',
      subtitle: 'Line Management',
      subtitleAr: 'إدارة الخطوط',
      icon: <Layers className="w-4 h-4" />,
      onClick: () => setActiveTab('lines'),
    },
    {
      id: 'batches',
      label: 'Batches',
      labelAr: 'الدفعات',
      subtitle: 'Batch Tracking',
      subtitleAr: 'تتبع الدفعات',
      icon: <PackageCheck className="w-4 h-4" />,
      onClick: () => setActiveTab('batches'),
    },
    {
      id: 'planning',
      label: 'Planning',
      labelAr: 'التخطيط',
      subtitle: 'Production Planning',
      subtitleAr: 'تخطيط الإنتاج',
      icon: <Calendar className="w-4 h-4" />,
      onClick: () => setActiveTab('planning'),
    },
    {
      id: 'progress',
      label: 'Progress',
      labelAr: 'التقدم',
      subtitle: 'Progress Tracking',
      subtitleAr: 'تتبع التقدم',
      icon: <TrendingUp className="w-4 h-4" />,
      onClick: () => setActiveTab('progress'),
    },
    {
      id: 'efficiency',
      label: 'Efficiency',
      labelAr: 'الكفاءة',
      subtitle: 'Performance Metrics',
      subtitleAr: 'مؤشرات الأداء',
      icon: <Target className="w-4 h-4" />,
      onClick: () => setActiveTab('efficiency'),
    },
    {
      id: 'reports',
      label: 'Reports',
      labelAr: 'التقارير',
      subtitle: 'Production Reports',
      subtitleAr: 'تقارير الإنتاج',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => setActiveTab('reports'),
    },
  ], []);

  // Filtered work orders
  const filteredWorkOrders = workOrders.filter(wo => {
    if (stageFilter !== 'all' && wo.stage !== stageFilter) return false;
    if (statusFilter !== 'all' && wo.status !== statusFilter) return false;
    return true;
  });

  // Handlers
  const handleSavePO = (data: any) => {
    const newOrder: ProductionOrder = {
      ...data,
      id: selectedPO?.id || generateId(),
      orderNumber: selectedPO?.orderNumber || `PO-${new Date().getFullYear()}-${String(productionOrders.length + 1).padStart(4, '0')}`,
      completedQuantity: selectedPO?.completedQuantity || 0,
      unit: 'pieces',
      status: selectedPO?.status || 'draft',
      createdAt: selectedPO?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (selectedPO) {
      setProductionOrders(productionOrders.map(o => o.id === selectedPO.id ? newOrder : o));
      toast({ title: isRTL ? 'تم تحديث أمر الإنتاج' : 'Production order updated' });
    } else {
      setProductionOrders([...productionOrders, newOrder]);
      toast({ title: isRTL ? 'تم إنشاء أمر الإنتاج' : 'Production order created' });
    }
    setSelectedPO(null);
  };

  const handleSaveWO = (data: any) => {
    const newWO: WorkOrder = {
      ...data,
      id: selectedWO?.id || generateId(),
      workOrderNumber: selectedWO?.workOrderNumber || `WO-${new Date().getFullYear()}-${String(workOrders.length + 1).padStart(4, '0')}`,
      completedQuantity: selectedWO?.completedQuantity || 0,
      goodQuantity: selectedWO?.goodQuantity || 0,
      defectQuantity: selectedWO?.defectQuantity || 0,
      reworkQuantity: selectedWO?.reworkQuantity || 0,
      unit: 'pieces',
      status: selectedWO?.status || 'pending',
      materials: selectedWO?.materials || [],
      createdAt: selectedWO?.createdAt || new Date().toISOString().split('T')[0],
    };

    if (selectedWO) {
      setWorkOrders(workOrders.map(wo => wo.id === selectedWO.id ? newWO : wo));
      toast({ title: isRTL ? 'تم تحديث أمر العمل' : 'Work order updated' });
    } else {
      setWorkOrders([...workOrders, newWO]);
      toast({ title: isRTL ? 'تم إنشاء أمر العمل' : 'Work order created' });
    }
    setSelectedWO(null);
  };

  const handleSaveDefect = (data: any) => {
    const wo = workOrders.find(w => w.id === data.workOrderId);
    const line = productionLines.find(l => l.id === wo?.lineId);
    const newDefect: ProductionDefect = {
      ...data,
      id: generateId(),
      defectCode: `${data.stage.toUpperCase().slice(0, 3)}-${String(defects.length + 1).padStart(3, '0')}`,
      workOrderNumber: wo?.workOrderNumber || '',
      productionOrderId: wo?.productionOrderId || '',
      lineId: line?.id || '',
      lineName: line?.name || '',
      detectedBy: 'emp-current',
      detectedByName: 'Current User',
      detectedAt: new Date().toISOString(),
      status: 'reported',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDefects([...defects, newDefect]);
    toast({ title: isRTL ? 'تم تسجيل العيب' : 'Defect reported' });
  };

  const handleProgressUpdate = (data: any) => {
    setWorkOrders(workOrders.map(wo => {
      if (wo.id === data.workOrderId) {
        return {
          ...wo,
          completedQuantity: wo.completedQuantity + data.quantity,
          goodQuantity: wo.goodQuantity + data.quantity,
        };
      }
      return wo;
    }));
    toast({ title: isRTL ? 'تم تحديث التقدم' : 'Progress updated' });
  };

  const handleSaveLine = (data: any) => {
    const newLine: ProductionLine = {
      ...data,
      id: selectedLine?.id || generateId(),
      currentLoad: selectedLine?.currentLoad || 0,
      efficiency: selectedLine?.efficiency || 80,
      operatorCount: selectedLine?.operatorCount || 0,
      status: selectedLine?.status || 'idle',
      supervisorId: selectedLine?.supervisorId || '',
      machines: selectedLine?.machines || [],
      createdAt: selectedLine?.createdAt || new Date().toISOString().split('T')[0],
    };

    if (selectedLine) {
      setProductionLines(productionLines.map(l => l.id === selectedLine.id ? newLine : l));
      toast({ title: isRTL ? 'تم تحديث خط الإنتاج' : 'Line updated' });
    } else {
      setProductionLines([...productionLines, newLine]);
      toast({ title: isRTL ? 'تم إنشاء خط الإنتاج' : 'Line created' });
    }
    setSelectedLine(null);
  };

  const handleStartWorkOrder = (woId: string) => {
    setWorkOrders(workOrders.map(wo => {
      if (wo.id === woId) {
        return { ...wo, status: 'in_progress', actualStartTime: new Date().toISOString() };
      }
      return wo;
    }));
    toast({ title: isRTL ? 'تم بدء أمر العمل' : 'Work order started' });
  };

  const handlePauseWorkOrder = (woId: string) => {
    setWorkOrders(workOrders.map(wo => wo.id === woId ? { ...wo, status: 'paused' } : wo));
    toast({ title: isRTL ? 'تم إيقاف أمر العمل' : 'Work order paused' });
  };

  const handleCompleteWorkOrder = (woId: string) => {
    setWorkOrders(workOrders.map(wo => {
      if (wo.id === woId) {
        return { ...wo, status: 'completed', actualEndTime: new Date().toISOString() };
      }
      return wo;
    }));
    toast({ title: isRTL ? 'تم إكمال أمر العمل' : 'Work order completed' });
  };

  const handleConfirmPO = (poId: string) => {
    setProductionOrders(productionOrders.map(po => po.id === poId ? { ...po, status: 'confirmed' } : po));
    toast({ title: isRTL ? 'تم تأكيد أمر الإنتاج' : 'Production order confirmed' });
  };

  const handleStartPO = (poId: string) => {
    setProductionOrders(productionOrders.map(po => {
      if (po.id === poId) {
        return { ...po, status: 'in_progress', actualStartDate: new Date().toISOString().split('T')[0] };
      }
      return po;
    }));
    toast({ title: isRTL ? 'تم بدء أمر الإنتاج' : 'Production order started' });
  };

  // Production Order columns
  const poColumns: Column<ProductionOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order #',
      headerAr: 'رقم الأمر',
      render: (item) => <span className="font-mono font-medium">{item.orderNumber}</span>
    },
    {
      key: 'customer',
      header: 'Customer / Style',
      headerAr: 'العميل / الموديل',
      render: (item) => (
        <div>
          <p className="font-medium">{isRTL ? item.customerNameAr : item.customerName}</p>
          <p className="text-sm text-muted-foreground">{item.styleNumber} - {item.styleName}</p>
        </div>
      )
    },
    {
      key: 'quantity',
      header: 'Progress',
      headerAr: 'التقدم',
      render: (item) => (
        <div className="w-32">
          <div className="flex justify-between text-sm mb-1">
            <span>{item.completedQuantity.toLocaleString()}</span>
            <span className="text-muted-foreground">/ {item.orderQuantity.toLocaleString()}</span>
          </div>
          <Progress value={getOrderProgress(item)} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{getOrderProgress(item)}%</p>
        </div>
      )
    },
    {
      key: 'dates',
      header: 'Dates',
      headerAr: 'التواريخ',
      render: (item) => (
        <div className="text-sm">
          <p>{isRTL ? 'البدء' : 'Start'}: {item.plannedStartDate}</p>
          <p>{isRTL ? 'التسليم' : 'Delivery'}: {item.deliveryDate}</p>
        </div>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      headerAr: 'الأولوية',
      render: (item) => {
        const colors: Record<string, string> = {
          low: 'bg-gray-100 text-gray-800', medium: 'bg-blue-100 text-blue-800',
          high: 'bg-orange-100 text-orange-800', urgent: 'bg-red-100 text-red-800',
        };
        return <Badge className={colors[item.priority]}>{item.priority}</Badge>;
      }
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'actions',
      header: 'Actions',
      headerAr: 'الإجراءات',
      render: (item) => (
        <div className="flex gap-1">
          {item.status === 'draft' && (
            <Button variant="ghost" size="sm" onClick={() => handleConfirmPO(item.id)} className="text-green-600">
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
          {item.status === 'confirmed' && (
            <Button variant="ghost" size="sm" onClick={() => handleStartPO(item.id)} className="text-blue-600">
              <PlayCircle className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => { setSelectedPO(item); setIsEditPOOpen(true); }}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  ];

  // Work Order columns
  const woColumns: Column<WorkOrder>[] = [
    {
      key: 'workOrderNumber',
      header: 'WO #',
      headerAr: 'رقم أمر العمل',
      render: (item) => <span className="font-mono font-medium">{item.workOrderNumber}</span>
    },
    {
      key: 'stage',
      header: 'Stage',
      headerAr: 'المرحلة',
      render: (item) => {
        const config = stageConfigs.find(s => s.stage === item.stage);
        return (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config?.color }}></div>
            <span>{getStageName(item.stage, i18n.language)}</span>
          </div>
        );
      }
    },
    {
      key: 'line',
      header: 'Line',
      headerAr: 'الخط',
      render: (item) => <span>{item.lineName}</span>
    },
    {
      key: 'progress',
      header: 'Progress',
      headerAr: 'التقدم',
      render: (item) => (
        <div className="w-28">
          <div className="flex justify-between text-sm mb-1">
            <span>{item.completedQuantity}</span>
            <span className="text-muted-foreground">/ {item.targetQuantity}</span>
          </div>
          <Progress value={getWorkOrderProgress(item)} className="h-2" />
        </div>
      )
    },
    {
      key: 'quality',
      header: 'Quality',
      headerAr: 'الجودة',
      render: (item) => (
        <div className="text-sm">
          <p className="text-green-600">✓ {item.goodQuantity}</p>
          {item.defectQuantity > 0 && <p className="text-red-600">✗ {item.defectQuantity}</p>}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'actions',
      header: 'Actions',
      headerAr: 'الإجراءات',
      render: (item) => (
        <div className="flex gap-1">
          {item.status === 'pending' && (
            <Button variant="ghost" size="sm" onClick={() => handleStartWorkOrder(item.id)} className="text-green-600">
              <PlayCircle className="w-4 h-4" />
            </Button>
          )}
          {item.status === 'in_progress' && (
            <>
              <Button variant="ghost" size="sm" onClick={() => handlePauseWorkOrder(item.id)} className="text-yellow-600">
                <PauseCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setSelectedWO(item); setIsProgressUpdateOpen(true); }} className="text-blue-600">
                <TrendingUp className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleCompleteWorkOrder(item.id)} className="text-green-600">
                <CheckCircle className="w-4 h-4" />
              </Button>
            </>
          )}
          {item.status === 'paused' && (
            <Button variant="ghost" size="sm" onClick={() => handleStartWorkOrder(item.id)} className="text-green-600">
              <PlayCircle className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => { setSelectedWO(item); setIsEditWOOpen(true); }}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  ];

  return (
    <ModuleLayout>
      <PageHeader
        icon={Factory}
        title="Production Management (MES)"
        titleAr="نظام إدارة الإنتاج (MES)"
        subtitle="Production orders, work orders, stage tracking, WIP, defects, and line optimization"
        subtitleAr="أوامر الإنتاج وأوامر العمل وتتبع المراحل والعمل تحت التشغيل والعيوب وتحسين الخطوط"
        colorGradient="from-blue-500 to-blue-600"
        actionLabel="New Order"
        actionLabelAr="أمر جديد"
        onAction={() => setIsAddPOOpen(true)}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <StatCard title="Orders" titleAr="الأوامر" value={totalOrders} icon={Package} iconColor="text-blue-500" />
        <StatCard title="Active" titleAr="نشطة" value={activeOrders} icon={Activity} iconColor="text-green-500" />
        <StatCard title="Work Orders" titleAr="أوامر العمل" value={`${activeWorkOrders}/${totalWorkOrders}`} icon={Layers} iconColor="text-purple-500" />
        <StatCard title="WIP" titleAr="تحت التشغيل" value={totalWIP.toLocaleString()} icon={RefreshCw} iconColor="text-orange-500" />
        <StatCard title="Defects" titleAr="العيوب" value={activeDefects} icon={AlertTriangle} iconColor="text-red-500" />
        <StatCard title="Efficiency" titleAr="الكفاءة" value={`${avgEfficiency}%`} icon={Zap} iconColor="text-yellow-500" />
        <StatCard title="Load" titleAr="الحمولة" value={`${Math.round((totalLoad / totalCapacity) * 100)}%`} icon={Target} iconColor="text-indigo-500" />
        <StatCard title="Lines" titleAr="الخطوط" value={productionLines.length} icon={Factory} iconColor="text-cyan-500" />
      </div>

      {/* Stage Progress Visual */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold mb-4">{isRTL ? 'نظرة عامة على المراحل' : 'Stage Overview'}</h3>
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {stageConfigs.filter(s => s.isActive).map((stage, idx) => {
            const wipCount = wipRecords.filter(w => w.stage === stage.stage).reduce((sum, w) => sum + w.quantity, 0);
            const woInStage = workOrders.filter(wo => wo.stage === stage.stage && wo.status === 'in_progress').length;
            return (
              <div key={stage.id} className="flex items-center">
                <div className="flex flex-col items-center min-w-[100px]">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: stage.color + '20' }}>
                    <div className="text-2xl font-bold" style={{ color: stage.color }}>{wipCount}</div>
                  </div>
                  <span className="text-sm font-medium">{isRTL ? stage.nameAr : stage.name}</span>
                  <span className="text-xs text-muted-foreground">{woInStage} {isRTL ? 'أمر' : 'WO'}</span>
                </div>
                {idx < stageConfigs.filter(s => s.isActive).length - 1 && (
                  <ArrowRight className="w-5 h-5 text-muted-foreground mx-2" />
                )}
              </div>
            );
          })}
        </div>
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

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">

        {/* ==================== PRODUCTION ORDERS TAB ==================== */}
        <TabsContent value="orders">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'أوامر الإنتاج' : 'Production Orders'}</h3>
              <Button className="gap-2" onClick={() => setIsAddPOOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'أمر جديد' : 'New Order'}
              </Button>
            </div>
            <DataTable data={productionOrders} columns={poColumns} searchKey="orderNumber" searchPlaceholder="Search orders..." searchPlaceholderAr="بحث في الأوامر..." />
          </div>
        </TabsContent>

        {/* ==================== WORK ORDERS TAB ==================== */}
        <TabsContent value="workorders">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'أوامر العمل' : 'Work Orders'}</h3>
              <div className="flex gap-2">
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder={isRTL ? 'المرحلة' : 'Stage'} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'كل المراحل' : 'All Stages'}</SelectItem>
                    {stageConfigs.map(s => (
                      <SelectItem key={s.id} value={s.stage}>{isRTL ? s.nameAr : s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'كل الحالات' : 'All Status'}</SelectItem>
                    <SelectItem value="pending">{isRTL ? 'معلق' : 'Pending'}</SelectItem>
                    <SelectItem value="in_progress">{isRTL ? 'جاري' : 'In Progress'}</SelectItem>
                    <SelectItem value="paused">{isRTL ? 'متوقف' : 'Paused'}</SelectItem>
                    <SelectItem value="completed">{isRTL ? 'مكتمل' : 'Completed'}</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="gap-2" onClick={() => setIsAddWOOpen(true)}>
                  <Plus className="w-4 h-4" />{isRTL ? 'أمر عمل' : 'New WO'}
                </Button>
              </div>
            </div>
            <DataTable data={filteredWorkOrders} columns={woColumns} searchKey="workOrderNumber" />
          </div>
        </TabsContent>

        {/* ==================== WIP TAB ==================== */}
        <TabsContent value="wip">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'العمل تحت التشغيل (WIP)' : 'Work-in-Progress (WIP)'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wipRecords.map(wip => {
                const stageConfig = stageConfigs.find(s => s.stage === wip.stage);
                return (
                  <div key={wip.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stageConfig?.color }}></div>
                        <span className="font-medium">{getStageName(wip.stage, i18n.language)}</span>
                      </div>
                      <StatusBadge status={wip.status} />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isRTL ? 'أمر العمل' : 'WO'}</span>
                        <span className="font-mono">{wip.workOrderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isRTL ? 'الكمية' : 'Quantity'}</span>
                        <span className="font-bold text-lg">{wip.quantity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isRTL ? 'الموقع' : 'Location'}</span>
                        <span>{wip.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isRTL ? 'الدفعة' : 'Batch'}</span>
                        <span className="font-mono text-xs">{wip.batchNumber}</span>
                      </div>
                      {wip.serialStart && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{isRTL ? 'التسلسل' : 'Serial'}</span>
                          <span className="font-mono text-xs">{wip.serialStart} - {wip.serialEnd}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ==================== DEFECTS TAB ==================== */}
        <TabsContent value="defects">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'العيوب وإعادة التشغيل' : 'Defects & Rework'}</h3>
              <Button className="gap-2 bg-orange-600 hover:bg-orange-700" onClick={() => setIsAddDefectOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'تسجيل عيب' : 'Report Defect'}
              </Button>
            </div>
            <div className="space-y-4">
              {defects.map(def => {
                const severityColors: Record<string, string> = { minor: 'bg-yellow-100 text-yellow-800', major: 'bg-orange-100 text-orange-800', critical: 'bg-red-100 text-red-800' };
                const stageConfig = stageConfigs.find(s => s.stage === def.stage);
                return (
                  <div key={def.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm">{def.defectCode}</span>
                          <span className="font-medium">{def.defectType}</span>
                          <Badge className={severityColors[def.severity]}>{def.severity}</Badge>
                          <StatusBadge status={def.status} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {def.workOrderNumber} • {getStageName(def.stage, i18n.language)} • {def.lineName}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">{new Date(def.detectedAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm mb-2">{isRTL ? def.descriptionAr : def.description}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{isRTL ? 'الكمية' : 'Qty'}: {def.quantity}</span>
                      <span>{isRTL ? 'اكتشف بواسطة' : 'By'}: {def.detectedByName}</span>
                      {def.operatorName && <span>{isRTL ? 'المشغل' : 'Operator'}: {def.operatorName}</span>}
                    </div>
                    {def.reworkRequired && (
                      <div className="mt-2 p-2 bg-orange-50 rounded text-sm">
                        <span className="font-medium text-orange-700">{isRTL ? 'يحتاج إعادة تشغيل' : 'Rework Required'}</span>
                        {def.reworkInstructions && <p className="text-orange-600 mt-1">{def.reworkInstructions}</p>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Rework Orders Section */}
            {reworkOrders.length > 0 && (
              <div className="mt-8">
                <h4 className="text-md font-bold mb-4">{isRTL ? 'أوامر إعادة التشغيل' : 'Rework Orders'}</h4>
                <div className="space-y-4">
                  {reworkOrders.map(rw => (
                    <div key={rw.id} className="border border-orange-200 bg-orange-50/50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-mono font-medium">{rw.reworkNumber}</span>
                          <StatusBadge status={rw.status} />
                        </div>
                        <Badge className={rw.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>{rw.priority}</Badge>
                      </div>
                      <p className="text-sm">{isRTL ? rw.instructionsAr : rw.instructions}</p>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{isRTL ? 'الكمية' : 'Qty'}: {rw.reworkedQty}/{rw.quantity}</span>
                        <span>{isRTL ? 'مسند إلى' : 'Assigned'}: {rw.assignedToName}</span>
                        <span>{isRTL ? 'الوقت المقدر' : 'Est.'}: {rw.estimatedTime} {isRTL ? 'دقيقة' : 'mins'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ==================== LINES TAB ==================== */}
        <TabsContent value="lines">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'خطوط الإنتاج' : 'Production Lines'}</h3>
              <Button className="gap-2" onClick={() => { setSelectedLine(null); setIsLineConfigOpen(true); }}>
                <Plus className="w-4 h-4" />{isRTL ? 'خط جديد' : 'New Line'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productionLines.map(line => {
                const statusColors: Record<string, string> = { active: 'bg-green-100 text-green-800', idle: 'bg-gray-100 text-gray-800', maintenance: 'bg-yellow-100 text-yellow-800', offline: 'bg-red-100 text-red-800' };
                return (
                  <div key={line.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Factory className="w-5 h-5 text-primary" />
                          <h4 className="font-medium">{getLineName(line, i18n.language)}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono">{line.code}</p>
                      </div>
                      <Badge className={statusColors[line.status]}>{line.status}</Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{isRTL ? 'الحمولة' : 'Load'}</span>
                          <span>{line.currentLoad} / {line.capacity}</span>
                        </div>
                        <Progress value={getLineUtilization(line)} className="h-2" />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{isRTL ? 'الكفاءة' : 'Efficiency'}</span>
                        <span className={line.efficiency >= 90 ? 'text-green-600' : line.efficiency >= 75 ? 'text-yellow-600' : 'text-red-600'}>
                          {line.efficiency}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{isRTL ? 'العمال' : 'Operators'}</span>
                        <span><Users className="w-4 h-4 inline mr-1" />{line.operatorCount} / {line.maxOperators}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>{isRTL ? 'المشرف' : 'Supervisor'}: {line.supervisorName}</p>
                        <p>{line.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedLine(line); setIsLineConfigOpen(true); }}>
                        <Settings className="w-4 h-4 mr-1" />{isRTL ? 'إعدادات' : 'Config'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ==================== BATCHES TAB ==================== */}
        <TabsContent value="batches">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'تتبع الدفعات والتسلسل' : 'Batch & Serial Tracking'}</h3>
            <div className="space-y-4">
              {batchTrackers.map(batch => {
                const stageConfig = stageConfigs.find(s => s.stage === batch.currentStage);
                return (
                  <div key={batch.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-lg">{batch.batchNumber}</span>
                          <Badge className={batch.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{batch.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? 'الكمية' : 'Qty'}: {batch.quantity} | {isRTL ? 'التسلسل' : 'Serial'}: {batch.serialStart} - {batch.serialEnd}
                        </p>
                      </div>
                      <div className="text-end">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{isRTL ? 'المرحلة الحالية' : 'Current Stage'}:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stageConfig?.color }}></div>
                            <span className="font-medium">{getStageName(batch.currentStage, i18n.language)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{batch.currentLocation}</p>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <h5 className="text-sm font-medium mb-2">{isRTL ? 'سجل التتبع' : 'Tracking History'}</h5>
                      <div className="space-y-2">
                        {batch.history.map((h, idx) => {
                          const hStageConfig = stageConfigs.find(s => s.stage === h.stage);
                          return (
                            <div key={idx} className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: hStageConfig?.color }}></div>
                              <span className="text-muted-foreground w-32">{new Date(h.timestamp).toLocaleString()}</span>
                              <span className="font-medium">{h.action}</span>
                              <span className="text-muted-foreground">@ {getStageName(h.stage, i18n.language)}</span>
                              <span>({h.quantity} {isRTL ? 'قطعة' : 'pcs'})</span>
                              <span className="text-muted-foreground">{isRTL ? 'بواسطة' : 'by'} {h.operatorName}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ==================== PROGRESS TAB ==================== */}
        <TabsContent value="progress">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'مراقبة التقدم الفوري' : 'Real-time Progress Monitoring'}</h3>
            
            {/* Hourly Progress Chart */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3">{isRTL ? 'الإنتاج بالساعة (اليوم)' : 'Hourly Output (Today)'}</h4>
              <div className="flex items-end gap-2 h-40">
                {progressData.slice(-8).map((p, idx) => {
                  const height = (p.hourlyActual / Math.max(...progressData.map(d => d.hourlyActual))) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div className={`w-full rounded-t ${p.efficiency >= 100 ? 'bg-green-500' : p.efficiency >= 80 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{ height: `${height}%` }}>
                        <div className="text-center text-white text-xs py-1">{p.hourlyActual}</div>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">{new Date(p.timestamp).getHours()}:00</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Records */}
            <div className="space-y-2">
              {progressData.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-24">{new Date(p.timestamp).toLocaleTimeString()}</span>
                    <span className="font-medium">{getStageName(p.stage, i18n.language)}</span>
                    <span className="text-sm text-muted-foreground">{p.lineName}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{isRTL ? 'الهدف' : 'Target'}</p>
                      <p className="font-medium">{p.hourlyTarget}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{isRTL ? 'الفعلي' : 'Actual'}</p>
                      <p className="font-medium">{p.hourlyActual}</p>
                    </div>
                    <div className="text-center w-16">
                      <p className="text-xs text-muted-foreground">{isRTL ? 'الكفاءة' : 'Eff.'}</p>
                      <p className={`font-bold ${p.efficiency >= 100 ? 'text-green-600' : p.efficiency >= 80 ? 'text-blue-600' : 'text-orange-600'}`}>{p.efficiency}%</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{p.operatorName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== REWORK TAB ==================== */}
        <TabsContent value="rework">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'أوامر إعادة العمل' : 'Rework Orders'}</h3>
            <div className="space-y-4">
              {reworkOrders.map(rework => (
                <div key={rework.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-mono font-medium">{rework.reworkNumber}</span>
                      <p className="text-sm text-muted-foreground">{rework.workOrderNumber}</p>
                    </div>
                    <StatusBadge status={rework.status} />
                  </div>
                  <p className="text-sm">{isRTL ? rework.reasonAr : rework.reason}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {isRTL ? 'الكمية' : 'Quantity'}: {rework.quantity} {rework.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== PLANNING TAB ==================== */}
        <TabsContent value="planning">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'تخطيط الإنتاج' : 'Production Planning'}</h3>
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'قريباً: تخطيط الإنتاج' : 'Coming soon: Production Planning'}
            </div>
          </div>
        </TabsContent>

        {/* ==================== EFFICIENCY TAB ==================== */}
        <TabsContent value="efficiency">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'مؤشرات الكفاءة' : 'Efficiency Metrics'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productionLines.map(line => (
                <div key={line.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{getLineName(line, i18n.language)}</span>
                    <Badge variant={line.efficiency >= 90 ? 'default' : line.efficiency >= 70 ? 'secondary' : 'destructive'}>
                      {line.efficiency}%
                    </Badge>
                  </div>
                  <Progress value={line.efficiency} className="h-2" />
                  <div className="mt-2 text-xs text-muted-foreground">
                    {isRTL ? 'الاستخدام' : 'Utilization'}: {Math.round((line.currentLoad / line.capacity) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== REPORTS TAB ==================== */}
        <TabsContent value="reports">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'تقارير الإنتاج' : 'Production Reports'}</h3>
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'قريباً: تقارير الإنتاج' : 'Coming soon: Production Reports'}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Forms and Dialogs */}
      <ProductionOrderForm open={isAddPOOpen || isEditPOOpen} onOpenChange={(open) => { setIsAddPOOpen(open && !selectedPO); setIsEditPOOpen(open && !!selectedPO); if (!open) setSelectedPO(null); }} order={selectedPO} onSave={handleSavePO} />
      <WorkOrderForm open={isAddWOOpen || isEditWOOpen} onOpenChange={(open) => { setIsAddWOOpen(open && !selectedWO); setIsEditWOOpen(open && !!selectedWO); if (!open) setSelectedWO(null); }} workOrder={selectedWO} onSave={handleSaveWO} />
      <ProductionDefectForm open={isAddDefectOpen} onOpenChange={setIsAddDefectOpen} onSave={handleSaveDefect} />
      <ProgressUpdateForm open={isProgressUpdateOpen} onOpenChange={setIsProgressUpdateOpen} workOrderId={selectedWO?.id} onSave={handleProgressUpdate} />
      <LineConfigForm open={isLineConfigOpen} onOpenChange={setIsLineConfigOpen} line={selectedLine} onSave={handleSaveLine} />
    </ModuleLayout>
  );
}
