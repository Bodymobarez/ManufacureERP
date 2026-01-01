import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ModuleLayout } from '@/components/shared/ModuleLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MegaMenuTabs } from '@/components/shared/MegaMenuTabs';
import {
  Package, Warehouse, Layers, ArrowLeftRight, AlertTriangle, QrCode, Barcode,
  TrendingDown, Calendar, Eye, Edit, Trash2, Plus, Download, Upload, FileText,
  CheckCircle, Clock, XCircle, ArrowRight, History, Boxes, Move, DollarSign,
  BarChart3, Settings, FileSearch
} from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  mockRawMaterials, mockWarehouses, mockBatches, mockStockMovements, mockTransferOrders,
  mockDefects, mockInventoryValuations, getMaterialName, getWarehouseName,
  getLowStockMaterials, getExpiringBatches, RawMaterial, Warehouse as WHType, Batch, TransferOrder, DefectRecord
} from '@/store/inventoryData';
import {
  MaterialForm, BatchForm, TransferForm, DefectForm, BarcodeScanner, StockIssueForm
} from '@/components/inventory/InventoryForms';

export default function Inventory() {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';

  // State
  const [materials, setMaterials] = useState<RawMaterial[]>(mockRawMaterials);
  const [warehouses] = useState<WHType[]>(mockWarehouses);
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [transfers, setTransfers] = useState<TransferOrder[]>(mockTransferOrders);
  const [defects, setDefects] = useState<DefectRecord[]>(mockDefects);
  const [movements] = useState(mockStockMovements);
  const [valuations] = useState(mockInventoryValuations);

  // Dialog states
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferOrder | null>(null);
  const [selectedDefect, setSelectedDefect] = useState<DefectRecord | null>(null);

  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [isEditMaterialOpen, setIsEditMaterialOpen] = useState(false);
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [isAddTransferOpen, setIsAddTransferOpen] = useState(false);
  const [isAddDefectOpen, setIsAddDefectOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null);

  // Filter states
  const [materialTypeFilter, setMaterialTypeFilter] = useState('all');
  const [warehouseFilter, setWarehouseFilter] = useState('all');

  // Active tab
  const [activeTab, setActiveTab] = useState<string>('materials');

  // Stats
  const totalMaterials = materials.length;
  const lowStockCount = getLowStockMaterials().length;
  const pendingTransfers = transfers.filter(t => t.status === 'pending' || t.status === 'in_transit').length;
  const activeDefects = defects.filter(d => d.status === 'reported' || d.status === 'under_review').length;
  const expiringBatches = getExpiringBatches(30).length;
  const totalInventoryValue = valuations[0]?.totalValue || 52847.50;

  // Mega Menu Tabs Configuration
  const megaMenuTabs = useMemo(() => [
    {
      id: 'materials',
      label: 'Materials',
      labelAr: 'المواد',
      subtitle: 'Raw Materials',
      subtitleAr: 'المواد الخام',
      icon: <Package className="w-4 h-4" />,
      onClick: () => setActiveTab('materials'),
    },
    {
      id: 'warehouses',
      label: 'Warehouses',
      labelAr: 'المستودعات',
      subtitle: 'Warehouse Management',
      subtitleAr: 'إدارة المستودعات',
      icon: <Warehouse className="w-4 h-4" />,
      onClick: () => setActiveTab('warehouses'),
    },
    {
      id: 'batches',
      label: 'Batches',
      labelAr: 'الدفعات',
      subtitle: 'Batch Tracking',
      subtitleAr: 'تتبع الدفعات',
      icon: <Boxes className="w-4 h-4" />,
      onClick: () => setActiveTab('batches'),
    },
    {
      id: 'transfers',
      label: 'Transfers',
      labelAr: 'التحويلات',
      subtitle: 'Stock Transfers',
      subtitleAr: 'تحويلات المخزون',
      icon: <Move className="w-4 h-4" />,
      onClick: () => setActiveTab('transfers'),
    },
    {
      id: 'movements',
      label: 'Movements',
      labelAr: 'الحركات',
      subtitle: 'Stock Movements',
      subtitleAr: 'حركات المخزون',
      icon: <History className="w-4 h-4" />,
      onClick: () => setActiveTab('movements'),
    },
    {
      id: 'valuation',
      label: 'Valuation',
      labelAr: 'التقييم',
      subtitle: 'Inventory Value',
      subtitleAr: 'قيمة المخزون',
      icon: <DollarSign className="w-4 h-4" />,
      onClick: () => setActiveTab('valuation'),
    },
    {
      id: 'defects',
      label: 'Defects',
      labelAr: 'العيوب',
      subtitle: 'Defect Records',
      subtitleAr: 'سجلات العيوب',
      icon: <AlertTriangle className="w-4 h-4" />,
      onClick: () => setActiveTab('defects'),
    },
    {
      id: 'reports',
      label: 'Reports',
      labelAr: 'التقارير',
      subtitle: 'Inventory Reports',
      subtitleAr: 'تقارير المخزون',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => setActiveTab('reports'),
    },
  ], []);

  // Filtered materials
  const filteredMaterials = materials.filter(m => {
    if (materialTypeFilter !== 'all' && m.type !== materialTypeFilter) return false;
    if (warehouseFilter !== 'all' && m.warehouseId !== warehouseFilter) return false;
    return true;
  });

  // Handlers
  const handleSaveMaterial = (data: any) => {
    const newMaterial: RawMaterial = {
      ...data,
      id: selectedMaterial?.id || `mat-${Date.now()}`,
      currentStock: selectedMaterial?.currentStock || 0,
      reservedStock: selectedMaterial?.reservedStock || 0,
      availableStock: selectedMaterial?.availableStock || 0,
      warehouseName: warehouses.find(w => w.id === data.warehouseId)?.name || '',
      status: 'active',
      createdAt: selectedMaterial?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (selectedMaterial) {
      setMaterials(materials.map(m => m.id === selectedMaterial.id ? newMaterial : m));
      toast({ title: isRTL ? 'تم تحديث المادة' : 'Material updated successfully' });
    } else {
      setMaterials([...materials, newMaterial]);
      toast({ title: isRTL ? 'تم إضافة المادة' : 'Material added successfully' });
    }
    setSelectedMaterial(null);
    setIsAddMaterialOpen(false);
    setIsEditMaterialOpen(false);
  };

  const handleSaveBatch = (data: any) => {
    const newBatch: Batch = {
      ...data,
      id: `batch-${Date.now()}`,
      batchNumber: `BT-${new Date().getFullYear()}-${String(batches.length + 1).padStart(3, '0')}`,
      remainingQuantity: data.quantity,
      qualityStatus: 'pending',
      receivedDate: new Date().toISOString().split('T')[0],
      traceability: [{
        id: `t-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'received',
        quantity: data.quantity,
        toLocation: data.location,
        performedBy: 'Current User',
        referenceType: 'work_order',
        referenceId: data.poNumber,
      }],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBatches([...batches, newBatch]);
    
    // Update material stock
    setMaterials(materials.map(m => {
      if (m.id === data.materialId) {
        return {
          ...m,
          currentStock: m.currentStock + data.quantity,
          availableStock: m.availableStock + data.quantity,
          lastReceived: new Date().toISOString().split('T')[0],
          status: m.currentStock + data.quantity > m.reorderPoint ? 'active' : 'low_stock',
        };
      }
      return m;
    }));

    toast({ title: isRTL ? 'تم استلام الدفعة بنجاح' : 'Batch received successfully' });
    setIsAddBatchOpen(false);
  };

  const handleSaveTransfer = (data: any) => {
    const newTransfer: TransferOrder = {
      ...data,
      id: `to-${Date.now()}`,
      transferNumber: `TO-${new Date().getFullYear()}-${String(transfers.length + 1).padStart(4, '0')}`,
      status: 'pending',
      requestedBy: 'emp-1',
      requestedByName: 'Current User',
      requestedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTransfers([...transfers, newTransfer]);
    toast({ title: isRTL ? 'تم إنشاء أمر التحويل' : 'Transfer order created' });
    setIsAddTransferOpen(false);
  };

  const handleSaveDefect = (data: any) => {
    const newDefect: DefectRecord = {
      ...data,
      id: `def-${Date.now()}`,
      batchId: `batch-${Date.now()}`,
      detectedBy: 'emp-1',
      detectedByName: 'Current User',
      detectedDate: new Date().toISOString().split('T')[0],
      status: 'reported',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setDefects([...defects, newDefect]);
    toast({ title: isRTL ? 'تم تسجيل العيب' : 'Defect reported successfully' });
    setIsAddDefectOpen(false);
  };

  const handleScan = (code: string, type: 'barcode' | 'qr') => {
    const material = materials.find(m => m.code === code);
    const batch = batches.find(b => b.batchNumber === code);
    
    if (material) {
      setSelectedMaterial(material);
      toast({ title: isRTL ? `تم العثور على: ${material.nameAr}` : `Found: ${material.name}` });
    } else if (batch) {
      setSelectedBatch(batch);
      toast({ title: isRTL ? `تم العثور على دفعة: ${batch.batchNumber}` : `Found batch: ${batch.batchNumber}` });
    } else {
      toast({ title: isRTL ? 'لم يتم العثور على نتائج' : 'No results found', variant: 'destructive' });
    }
  };

  const handleIssueStock = (data: any) => {
    setMaterials(materials.map(m => {
      if (m.id === data.materialId) {
        return {
          ...m,
          currentStock: m.currentStock - data.quantity,
          availableStock: m.availableStock - data.quantity,
          lastIssued: new Date().toISOString().split('T')[0],
          status: (m.currentStock - data.quantity) <= m.reorderPoint ? 'low_stock' : 'active',
        };
      }
      return m;
    }));
    toast({ title: isRTL ? 'تم صرف المخزون' : 'Stock issued successfully' });
  };

  const handleDeleteMaterial = (material: RawMaterial) => {
    setMaterials(materials.filter(m => m.id !== material.id));
    toast({ title: isRTL ? 'تم حذف المادة' : 'Material deleted' });
    setDeleteConfirm(null);
  };

  // Material columns
  const materialColumns: Column<RawMaterial>[] = [
    {
      key: 'code',
      header: 'Code',
      headerAr: 'الكود',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Barcode className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono font-medium">{item.code}</span>
        </div>
      )
    },
    {
      key: 'name',
      header: 'Material',
      headerAr: 'المادة',
      render: (item) => (
        <div>
          <p className="font-medium">{getMaterialName(item, i18n.language)}</p>
          <p className="text-xs text-muted-foreground">{item.category} / {item.subcategory}</p>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      headerAr: 'النوع',
      render: (item) => {
        const typeLabels: Record<string, { en: string; ar: string; color: string }> = {
          fabric: { en: 'Fabric', ar: 'قماش', color: 'bg-blue-100 text-blue-800' },
          accessory: { en: 'Accessory', ar: 'إكسسوار', color: 'bg-purple-100 text-purple-800' },
          component: { en: 'Component', ar: 'مكون', color: 'bg-green-100 text-green-800' },
          packaging: { en: 'Packaging', ar: 'تغليف', color: 'bg-orange-100 text-orange-800' },
          chemical: { en: 'Chemical', ar: 'كيماوي', color: 'bg-red-100 text-red-800' },
        };
        const t = typeLabels[item.type];
        return <Badge className={t?.color}>{isRTL ? t?.ar : t?.en}</Badge>;
      }
    },
    {
      key: 'stock',
      header: 'Stock',
      headerAr: 'المخزون',
      render: (item) => (
        <div>
          <p className="font-medium">{item.currentStock.toLocaleString()} {item.unit}</p>
          <p className="text-xs text-muted-foreground">
            {isRTL ? 'متاح' : 'Available'}: {item.availableStock.toLocaleString()}
          </p>
          <Progress 
            value={Math.min((item.currentStock / item.maxStock) * 100, 100)} 
            className={`h-1.5 mt-1 ${item.currentStock <= item.reorderPoint ? 'bg-red-100' : ''}`}
          />
        </div>
      )
    },
    {
      key: 'location',
      header: 'Location',
      headerAr: 'الموقع',
      render: (item) => (
        <div className="text-sm">
          <p>{item.warehouseName}</p>
          <p className="text-xs text-muted-foreground font-mono">{item.location}</p>
        </div>
      )
    },
    {
      key: 'cost',
      header: 'Unit Cost',
      headerAr: 'تكلفة الوحدة',
      render: (item) => <span>${item.unitCost.toFixed(2)}</span>
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => {
        const statusColors: Record<string, string> = {
          active: 'bg-green-100 text-green-800',
          low_stock: 'bg-yellow-100 text-yellow-800',
          out_of_stock: 'bg-red-100 text-red-800',
          discontinued: 'bg-gray-100 text-gray-800',
        };
        return <Badge className={statusColors[item.status]}>{item.status.replace('_', ' ')}</Badge>;
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      headerAr: 'الإجراءات',
      render: (item) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedMaterial(item); }}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setSelectedMaterial(item); setIsEditMaterialOpen(true); }}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm({ type: 'material', id: item.id, name: getMaterialName(item, i18n.language) })}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      )
    },
  ];

  // Batch columns
  const batchColumns: Column<Batch>[] = [
    {
      key: 'batchNumber',
      header: 'Batch #',
      headerAr: 'رقم الدفعة',
      render: (item) => <span className="font-mono font-medium">{item.batchNumber}</span>
    },
    {
      key: 'material',
      header: 'Material',
      headerAr: 'المادة',
      render: (item) => (
        <div>
          <p className="font-medium">{isRTL ? item.materialNameAr : item.materialName}</p>
          <p className="text-xs text-muted-foreground font-mono">{item.materialCode}</p>
        </div>
      )
    },
    {
      key: 'quantity',
      header: 'Quantity',
      headerAr: 'الكمية',
      render: (item) => (
        <div>
          <p>{item.remainingQuantity.toLocaleString()} / {item.quantity.toLocaleString()} {item.unit}</p>
          <Progress value={(item.remainingQuantity / item.quantity) * 100} className="h-1.5 mt-1" />
        </div>
      )
    },
    {
      key: 'supplier',
      header: 'Supplier',
      headerAr: 'المورد',
      render: (item) => (
        <div className="text-sm">
          <p>{item.supplierName}</p>
          {item.supplierBatchNumber && <p className="text-xs text-muted-foreground">{item.supplierBatchNumber}</p>}
        </div>
      )
    },
    {
      key: 'dates',
      header: 'Dates',
      headerAr: 'التواريخ',
      render: (item) => (
        <div className="text-sm">
          <p>{isRTL ? 'استلام' : 'Received'}: {item.receivedDate}</p>
          {item.expiryDate && (
            <p className={`text-xs ${new Date(item.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-red-600' : 'text-muted-foreground'}`}>
              {isRTL ? 'انتهاء' : 'Expiry'}: {item.expiryDate}
            </p>
          )}
        </div>
      )
    },
    {
      key: 'quality',
      header: 'Quality',
      headerAr: 'الجودة',
      render: (item) => <StatusBadge status={item.qualityStatus} />
    },
    {
      key: 'actions',
      header: 'Actions',
      headerAr: 'الإجراءات',
      render: (item) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setSelectedBatch(item)}>
            <History className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  ];

  return (
    <ModuleLayout>
      <PageHeader
        icon={Package}
        title="Inventory Management"
        titleAr="إدارة المخزون"
        subtitle="Raw materials, fabrics, accessories, batch tracking, multi-warehouse operations"
        subtitleAr="المواد الخام والأقمشة والإكسسوارات وتتبع الدفعات وعمليات المستودعات المتعددة"
        colorGradient="from-emerald-500 to-emerald-600"
        actionLabel="New Material"
        actionLabelAr="مادة جديدة"
        onAction={() => setIsAddMaterialOpen(true)}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard title="Total Items" titleAr="إجمالي الأصناف" value={totalMaterials} icon={Package} iconColor="text-emerald-500" />
        <StatCard title="Low Stock" titleAr="مخزون منخفض" value={lowStockCount} icon={TrendingDown} iconColor="text-red-500" changeType="decrease" />
        <StatCard title="Pending Transfers" titleAr="تحويلات معلقة" value={pendingTransfers} icon={ArrowLeftRight} iconColor="text-blue-500" />
        <StatCard title="Active Defects" titleAr="عيوب نشطة" value={activeDefects} icon={AlertTriangle} iconColor="text-orange-500" />
        <StatCard title="Expiring (30d)" titleAr="تنتهي خلال 30 يوم" value={expiringBatches} icon={Calendar} iconColor="text-yellow-500" />
        <StatCard title="Inventory Value" titleAr="قيمة المخزون" value={`$${(totalInventoryValue / 1000).toFixed(1)}K`} icon={FileText} iconColor="text-purple-500" />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="outline" className="gap-2" onClick={() => setIsScannerOpen(true)}>
          <QrCode className="w-4 h-4" />
          {isRTL ? 'مسح باركود' : 'Scan Barcode'}
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setIsAddBatchOpen(true)}>
          <Download className="w-4 h-4" />
          {isRTL ? 'استلام مخزون' : 'Receive Stock'}
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setIsIssueOpen(true)}>
          <Upload className="w-4 h-4" />
          {isRTL ? 'صرف مخزون' : 'Issue Stock'}
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setIsAddTransferOpen(true)}>
          <ArrowLeftRight className="w-4 h-4" />
          {isRTL ? 'تحويل مخزون' : 'Transfer Stock'}
        </Button>
        <Button variant="outline" className="gap-2 text-orange-600" onClick={() => setIsAddDefectOpen(true)}>
          <AlertTriangle className="w-4 h-4" />
          {isRTL ? 'تسجيل عيب' : 'Report Defect'}
        </Button>
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

        {/* ==================== MATERIALS TAB ==================== */}
        <TabsContent value="materials">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'المواد الخام والأقمشة والإكسسوارات' : 'Raw Materials, Fabrics & Accessories'}</h3>
              <div className="flex gap-2">
                <Select value={materialTypeFilter} onValueChange={setMaterialTypeFilter}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder={isRTL ? 'النوع' : 'Type'} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'الكل' : 'All Types'}</SelectItem>
                    <SelectItem value="fabric">{isRTL ? 'قماش' : 'Fabric'}</SelectItem>
                    <SelectItem value="accessory">{isRTL ? 'إكسسوار' : 'Accessory'}</SelectItem>
                    <SelectItem value="component">{isRTL ? 'مكون' : 'Component'}</SelectItem>
                    <SelectItem value="packaging">{isRTL ? 'تغليف' : 'Packaging'}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder={isRTL ? 'المستودع' : 'Warehouse'} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'كل المستودعات' : 'All Warehouses'}</SelectItem>
                    {warehouses.map(wh => (
                      <SelectItem key={wh.id} value={wh.id}>{isRTL ? wh.nameAr : wh.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="gap-2" onClick={() => setIsAddMaterialOpen(true)}>
                  <Plus className="w-4 h-4" />{isRTL ? 'إضافة مادة' : 'Add Material'}
                </Button>
              </div>
            </div>
            <DataTable data={filteredMaterials} columns={materialColumns} searchKey="name" searchPlaceholder="Search materials..." searchPlaceholderAr="بحث في المواد..." />
          </div>
        </TabsContent>

        {/* ==================== BATCHES TAB ==================== */}
        <TabsContent value="batches">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'تتبع الدفعات واللوتات' : 'Batch & Lot Tracking'}</h3>
              <Button className="gap-2" onClick={() => setIsAddBatchOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'استلام دفعة' : 'Receive Batch'}
              </Button>
            </div>
            <DataTable data={batches} columns={batchColumns} searchKey="batchNumber" searchPlaceholder="Search batches..." searchPlaceholderAr="بحث في الدفعات..." />
          </div>
        </TabsContent>

        {/* ==================== WAREHOUSES TAB ==================== */}
        <TabsContent value="warehouses">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'المستودعات المتعددة' : 'Multi-Warehouse Management'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {warehouses.map(wh => (
                <div key={wh.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Warehouse className="w-5 h-5 text-primary" />
                        <h4 className="font-medium">{isRTL ? wh.nameAr : wh.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">{wh.code}</p>
                    </div>
                    <Badge className={wh.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {wh.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                    </Badge>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{isRTL ? 'السعة' : 'Capacity'}</span>
                      <span>{wh.usedCapacity.toLocaleString()} / {wh.capacity.toLocaleString()}</span>
                    </div>
                    <Progress value={(wh.usedCapacity / wh.capacity) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">{Math.round((wh.usedCapacity / wh.capacity) * 100)}% {isRTL ? 'مستخدم' : 'used'}</p>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    <p>{wh.location}</p>
                    <p>{isRTL ? 'المدير' : 'Manager'}: {wh.managerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium">{isRTL ? 'المناطق' : 'Zones'}:</p>
                    <div className="flex flex-wrap gap-1">
                      {wh.zones.map(zone => (
                        <Badge key={zone.id} variant="outline" className="text-xs">{zone.code}: {zone.name}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== TRANSFERS TAB ==================== */}
        <TabsContent value="transfers">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'أوامر التحويل' : 'Transfer Orders'}</h3>
              <Button className="gap-2" onClick={() => setIsAddTransferOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'تحويل جديد' : 'New Transfer'}
              </Button>
            </div>
            <div className="space-y-4">
              {transfers.map(to => (
                <div key={to.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{to.transferNumber}</span>
                        <StatusBadge status={to.status} />
                        <Badge className={to.priority === 'urgent' ? 'bg-red-100 text-red-800' : to.priority === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}>
                          {to.priority}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{to.requestedDate}</span>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1 bg-muted/30 rounded p-2 text-center">
                      <p className="text-xs text-muted-foreground">{isRTL ? 'من' : 'From'}</p>
                      <p className="font-medium">{to.fromWarehouseName}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1 bg-muted/30 rounded p-2 text-center">
                      <p className="text-xs text-muted-foreground">{isRTL ? 'إلى' : 'To'}</p>
                      <p className="font-medium">{to.toWarehouseName}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {to.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm bg-muted/20 rounded p-2">
                        <span>{item.materialCode} - {item.materialName}</span>
                        <span className="font-medium">{item.requestedQty} {item.unit}</span>
                      </div>
                    ))}
                  </div>
                  {to.notes && <p className="text-sm text-muted-foreground mt-2">{to.notes}</p>}
                  {to.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="gap-1"><CheckCircle className="w-4 h-4" />{isRTL ? 'تأكيد' : 'Confirm'}</Button>
                      <Button size="sm" variant="outline" className="gap-1 text-red-600"><XCircle className="w-4 h-4" />{isRTL ? 'إلغاء' : 'Cancel'}</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== DEFECTS TAB ==================== */}
        <TabsContent value="defects">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'تتبع العيوب' : 'Defect Tracking'}</h3>
              <Button className="gap-2 bg-orange-600 hover:bg-orange-700" onClick={() => setIsAddDefectOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'تسجيل عيب' : 'Report Defect'}
              </Button>
            </div>
            <div className="space-y-4">
              {defects.map(def => {
                const severityColors: Record<string, string> = { minor: 'bg-yellow-100 text-yellow-800', major: 'bg-orange-100 text-orange-800', critical: 'bg-red-100 text-red-800' };
                return (
                  <div key={def.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`w-4 h-4 ${def.severity === 'critical' ? 'text-red-500' : def.severity === 'major' ? 'text-orange-500' : 'text-yellow-500'}`} />
                          <span className="font-medium">{def.defectType}</span>
                          <Badge className={severityColors[def.severity]}>{def.severity}</Badge>
                          <StatusBadge status={def.status} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{def.materialCode} - {def.materialName}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{def.detectedDate}</span>
                    </div>
                    <p className="text-sm mb-2">{isRTL ? def.descriptionAr : def.description}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{isRTL ? 'الدفعة' : 'Batch'}: {def.batchNumber}</span>
                      <span>{isRTL ? 'الكمية' : 'Qty'}: {def.quantity} {def.unit}</span>
                      <span>{isRTL ? 'اكتشف بواسطة' : 'By'}: {def.detectedByName}</span>
                    </div>
                    {def.dispositionAction && (
                      <div className="mt-2 p-2 bg-muted/30 rounded text-sm">
                        <span className="font-medium">{isRTL ? 'الإجراء' : 'Action'}: </span>
                        {def.dispositionAction.replace('_', ' ')}
                        {def.resolution && <span> - {def.resolution}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ==================== MOVEMENTS TAB ==================== */}
        <TabsContent value="movements">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'سجل حركات المخزون' : 'Stock Movement History'}</h3>
            </div>
            <div className="space-y-2">
              {movements.map(mov => {
                const typeIcons: Record<string, React.ReactNode> = {
                  receipt: <Download className="w-4 h-4 text-green-500" />,
                  issue: <Upload className="w-4 h-4 text-red-500" />,
                  transfer: <ArrowLeftRight className="w-4 h-4 text-blue-500" />,
                  adjustment: <FileText className="w-4 h-4 text-orange-500" />,
                  return: <History className="w-4 h-4 text-purple-500" />,
                };
                return (
                  <div key={mov.id} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                    {typeIcons[mov.type]}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{mov.materialCode}</span>
                        <span className="text-sm text-muted-foreground">{mov.materialName}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {mov.batchNumber && `${mov.batchNumber} • `}
                        {mov.fromWarehouseName && `${mov.fromWarehouseName} → `}
                        {mov.toWarehouseName}
                      </p>
                    </div>
                    <div className={`font-medium ${mov.type === 'receipt' ? 'text-green-600' : mov.type === 'issue' ? 'text-red-600' : ''}`}>
                      {mov.type === 'receipt' ? '+' : mov.type === 'issue' ? '-' : ''}{mov.quantity} {mov.unit}
                    </div>
                    <div className="text-end text-sm">
                      <p className="font-mono">{mov.referenceNumber}</p>
                      <p className="text-muted-foreground">{new Date(mov.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ==================== VALUATION TAB ==================== */}
        <TabsContent value="valuation">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'تقييم المخزون (FIFO/LIFO)' : 'Inventory Valuation (FIFO/LIFO)'}</h3>
              <Select defaultValue="fifo">
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fifo">FIFO ({isRTL ? 'الأول أولاً' : 'First In First Out'})</SelectItem>
                  <SelectItem value="lifo">LIFO ({isRTL ? 'الأخير أولاً' : 'Last In First Out'})</SelectItem>
                  <SelectItem value="weighted_avg">{isRTL ? 'المتوسط المرجح' : 'Weighted Average'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {valuations.map(val => (
              <div key={val.id}>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">{isRTL ? 'تاريخ التقييم' : 'Valuation Date'}</p>
                    <p className="text-xl font-bold">{val.valuationDate}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">{isRTL ? 'عدد الأصناف' : 'Total Items'}</p>
                    <p className="text-xl font-bold">{val.totalItems}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">{isRTL ? 'إجمالي الكميات' : 'Total Quantity'}</p>
                    <p className="text-xl font-bold">{val.totalQuantity.toLocaleString()}</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">{isRTL ? 'إجمالي القيمة' : 'Total Value'}</p>
                    <p className="text-xl font-bold text-primary">${val.totalValue.toLocaleString()}</p>
                  </div>
                </div>

                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-start p-3">{isRTL ? 'الكود' : 'Code'}</th>
                      <th className="text-start p-3">{isRTL ? 'المادة' : 'Material'}</th>
                      <th className="text-center p-3">{isRTL ? 'الكمية' : 'Quantity'}</th>
                      <th className="text-end p-3">{isRTL ? 'تكلفة الوحدة' : 'Unit Cost'}</th>
                      <th className="text-end p-3">{isRTL ? 'القيمة الإجمالية' : 'Total Value'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {val.items.map(item => (
                      <tr key={item.id} className="border-t">
                        <td className="p-3 font-mono">{item.materialCode}</td>
                        <td className="p-3">{item.materialName}</td>
                        <td className="text-center p-3">{item.quantity.toLocaleString()} {item.unit}</td>
                        <td className="text-end p-3">${item.unitCost.toFixed(2)}</td>
                        <td className="text-end p-3 font-medium">${item.totalValue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/20 font-medium">
                    <tr className="border-t">
                      <td colSpan={4} className="p-3 text-end">{isRTL ? 'الإجمالي' : 'Total'}</td>
                      <td className="text-end p-3 text-primary">${val.totalValue.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ==================== REPORTS TAB ==================== */}
        <TabsContent value="reports">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'تقارير المخزون' : 'Inventory Reports'}</h3>
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'قريباً: تقارير المخزون' : 'Coming soon: Inventory Reports'}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Forms and Dialogs */}
      <MaterialForm
        open={isAddMaterialOpen || isEditMaterialOpen}
        onOpenChange={(open) => { setIsAddMaterialOpen(open && !selectedMaterial); setIsEditMaterialOpen(open && !!selectedMaterial); if (!open) setSelectedMaterial(null); }}
        material={selectedMaterial}
        onSave={handleSaveMaterial}
      />

      <BatchForm
        open={isAddBatchOpen}
        onOpenChange={setIsAddBatchOpen}
        onSave={handleSaveBatch}
      />

      <TransferForm
        open={isAddTransferOpen}
        onOpenChange={setIsAddTransferOpen}
        onSave={handleSaveTransfer}
      />

      <DefectForm
        open={isAddDefectOpen}
        onOpenChange={setIsAddDefectOpen}
        onSave={handleSaveDefect}
      />

      <BarcodeScanner
        open={isScannerOpen}
        onOpenChange={setIsScannerOpen}
        onScan={handleScan}
      />

      <StockIssueForm
        open={isIssueOpen}
        onOpenChange={setIsIssueOpen}
        onSave={handleIssueStock}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isRTL ? 'تأكيد الحذف' : 'Confirm Delete'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL
                ? `هل أنت متأكد من حذف "${deleteConfirm?.name}"؟`
                : `Are you sure you want to delete "${deleteConfirm?.name}"?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isRTL ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => {
                if (deleteConfirm?.type === 'material') {
                  const mat = materials.find(m => m.id === deleteConfirm.id);
                  if (mat) handleDeleteMaterial(mat);
                }
              }}
            >
              {isRTL ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ModuleLayout>
  );
}
