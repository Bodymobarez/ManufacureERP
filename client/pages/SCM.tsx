import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModuleLayout } from '@/components/shared/ModuleLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  ShoppingCart, Truck, Star, DollarSign, FileText, Ship, Globe,
  Eye, Edit, Plus, Package, AlertTriangle, CheckCircle, Clock, XCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  mockSuppliers, mockPurchaseOrders, mockRFQs, mockShipments, mockIncoterms,
  SupplierMaster, PurchaseOrder, RFQ, Shipment, Incoterm, getSupplierName, generateId
} from '@/store/scmData';
import { baseCurrencies, formatCurrency, convertCurrency } from '@/store/currencyData';
import { SupplierForm, RFQForm, POForm } from '@/components/scm/SCMForms';

export default function SCM() {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';
  const [displayCurrency, setDisplayCurrency] = useState('USD');

  // State
  const [suppliers, setSuppliers] = useState<SupplierMaster[]>(mockSuppliers);
  const [purchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [rfqs] = useState<RFQ[]>(mockRFQs);
  const [shipments] = useState<Shipment[]>(mockShipments);
  const [incoterms] = useState<Incoterm[]>(mockIncoterms);

  // Dialog states
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierMaster | null>(null);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isEditSupplierOpen, setIsEditSupplierOpen] = useState(false);
  const [isViewSupplierOpen, setIsViewSupplierOpen] = useState(false);
  const [isAddRFQOpen, setIsAddRFQOpen] = useState(false);
  const [isEditRFQOpen, setIsEditRFQOpen] = useState(false);
  const [isAddPOOpen, setIsAddPOOpen] = useState(false);
  const [isEditPOOpen, setIsEditPOOpen] = useState(false);

  // Currency conversion helper
  const convertToDisplay = (amountUSD: number) => {
    if (displayCurrency === 'USD') return amountUSD;
    return convertCurrency(amountUSD, 'USD', displayCurrency);
  };

  // Stats
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  const activePOs = purchaseOrders.filter(po => !['completed', 'cancelled'].includes(po.status)).length;
  const totalPOValueUSD = purchaseOrders.reduce((sum, po) => sum + po.total, 0);
  const avgSupplierRating = suppliers.length > 0 ? suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length : 0;
  const pendingRFQs = rfqs.filter(rfq => ['draft', 'sent', 'under_review'].includes(rfq.status)).length;
  const inTransitShipments = shipments.filter(s => s.status === 'in_transit' || s.status === 'at_port').length;

  // Handlers
  const handleSaveSupplier = (data: any) => {
    const newSupplier: SupplierMaster = {
      ...data,
      id: selectedSupplier?.id || generateId(),
      code: selectedSupplier?.code || `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
      rating: selectedSupplier?.rating || 0,
      onTimeDeliveryRate: selectedSupplier?.onTimeDeliveryRate || 0,
      qualityRating: selectedSupplier?.qualityRating || 0,
      priceRating: selectedSupplier?.priceRating || 0,
      complianceRating: selectedSupplier?.complianceRating || 0,
      categories: data.categories || [],
      createdAt: selectedSupplier?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    if (selectedSupplier) {
      setSuppliers(suppliers.map(s => s.id === selectedSupplier.id ? newSupplier : s));
      toast({ title: isRTL ? 'تم تحديث المورد' : 'Supplier updated' });
    } else {
      setSuppliers([...suppliers, newSupplier]);
      toast({ title: isRTL ? 'تم إضافة المورد' : 'Supplier added' });
    }
    setSelectedSupplier(null);
    setIsAddSupplierOpen(false);
    setIsEditSupplierOpen(false);
  };

  // Supplier columns
  const supplierColumns: Column<SupplierMaster>[] = [
    {
      key: 'code',
      header: 'Code',
      headerAr: 'الكود',
      render: (item) => <span className="font-mono text-sm font-medium">{item.code}</span>
    },
    {
      key: 'name',
      header: 'Supplier',
      headerAr: 'المورد',
      render: (item) => (
        <div>
          <p className="font-medium">{getSupplierName(item, i18n.language)}</p>
          <p className="text-xs text-muted-foreground">{item.companyName}</p>
        </div>
      )
    },
    {
      key: 'classification',
      header: 'Type',
      headerAr: 'النوع',
      render: (item) => (
        <div>
          <Badge variant="outline" className="text-xs">
            {item.classification === 'local' ? (isRTL ? 'محلي' : 'Local') : (isRTL ? 'دولي' : 'International')}
          </Badge>
          <p className="text-xs text-muted-foreground mt-1 capitalize">{item.type.replace('_', ' ')}</p>
        </div>
      )
    },
    {
      key: 'country',
      header: 'Country',
      headerAr: 'الدولة',
      render: (item) => <span className="text-sm">{item.country}</span>
    },
    {
      key: 'rating',
      header: 'Rating',
      headerAr: 'التقييم',
      render: (item) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-medium">{item.rating.toFixed(1)}</span>
        </div>
      )
    },
    {
      key: 'performance',
      header: 'Performance',
      headerAr: 'الأداء',
      render: (item) => (
        <div className="text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-muted-foreground">{isRTL ? 'التسليم:' : 'Delivery:'}</span>
            <span className="font-medium">{item.onTimeDeliveryRate.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{isRTL ? 'الجودة:' : 'Quality:'}</span>
            <span className="font-medium">{item.qualityRating.toFixed(1)}</span>
          </div>
        </div>
      )
    },
    {
      key: 'leadTime',
      header: 'Lead Time',
      headerAr: 'مدة التسليم',
      render: (item) => <span className="text-sm">{item.leadTimeDays} {isRTL ? 'يوم' : 'days'}</span>
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
          <Button variant="ghost" size="sm" onClick={() => { setSelectedSupplier(item); setIsViewSupplierOpen(true); }}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setSelectedSupplier(item); setIsEditSupplierOpen(true); }}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // PO Columns
  const poColumns: Column<PurchaseOrder>[] = [
    {
      key: 'poNumber',
      header: 'PO #',
      headerAr: 'رقم الأمر',
      render: (item) => <span className="font-mono font-medium">{item.poNumber}</span>
    },
    {
      key: 'supplier',
      header: 'Supplier',
      headerAr: 'المورد',
      render: (item) => {
        const supplier = suppliers.find(s => s.id === item.supplierId);
        return supplier ? <span>{getSupplierName(supplier, i18n.language)}</span> : '-';
      }
    },
    {
      key: 'type',
      header: 'Type',
      headerAr: 'النوع',
      render: (item) => (
        <Badge variant={item.type === 'import' ? 'default' : 'secondary'}>
          {item.type === 'import' ? (isRTL ? 'استيراد' : 'Import') : (isRTL ? 'محلي' : 'Local')}
        </Badge>
      )
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      headerAr: 'تاريخ الطلب',
    },
    {
      key: 'expectedDeliveryDate',
      header: 'Expected Delivery',
      headerAr: 'التسليم المتوقع',
    },
    {
      key: 'total',
      header: 'Total',
      headerAr: 'الإجمالي',
      render: (item) => formatCurrency(convertToDisplay(item.total), displayCurrency)
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
        icon={ShoppingCart}
        title="Supply Chain Management (SCM)"
        titleAr="إدارة سلسلة التوريد"
        subtitle="Suppliers, RFQ, Purchase Orders, Shipments, Incoterms, Contracts & Price Lists"
        subtitleAr="الموردون، طلبات عروض الأسعار، أوامر الشراء، الشحنات، شروط التجارة الدولية، العقود وقوائم الأسعار"
        colorGradient="from-indigo-500 to-indigo-600"
        actionLabel="New Supplier"
        actionLabelAr="مورد جديد"
        onAction={() => setIsAddSupplierOpen(true)}
      />

      {/* Currency Selector */}
      <div className="flex justify-end mb-4">
        <select
          value={displayCurrency}
          onChange={(e) => setDisplayCurrency(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm bg-background"
        >
          {baseCurrencies.map(curr => (
            <option key={curr.code} value={curr.code}>
              {isRTL ? curr.nameAr : curr.name} ({curr.symbol})
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <StatCard title="Active Suppliers" titleAr="الموردين النشطين" value={activeSuppliers} icon={Truck} iconColor="text-indigo-500" />
        <StatCard title="Open POs" titleAr="أوامر الشراء المفتوحة" value={activePOs} icon={ShoppingCart} iconColor="text-blue-500" />
        <StatCard title="PO Value" titleAr="قيمة الطلبات" value={formatCurrency(convertToDisplay(totalPOValueUSD), displayCurrency)} icon={DollarSign} iconColor="text-green-500" />
        <StatCard title="Avg. Rating" titleAr="متوسط التقييم" value={avgSupplierRating.toFixed(1)} icon={Star} iconColor="text-yellow-500" />
        <StatCard title="Pending RFQs" titleAr="طلبات عروض الأسعار" value={pendingRFQs} icon={FileText} iconColor="text-orange-500" />
        <StatCard title="In Transit" titleAr="قيد الشحن" value={inTransitShipments} icon={Ship} iconColor="text-purple-500" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="suppliers" className="space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-7 gap-1 w-full">
          <TabsTrigger value="suppliers">{isRTL ? 'الموردون' : 'Suppliers'}</TabsTrigger>
          <TabsTrigger value="rfq">{isRTL ? 'طلبات العروض' : 'RFQs'}</TabsTrigger>
          <TabsTrigger value="pos">{isRTL ? 'أوامر الشراء' : 'Purchase Orders'}</TabsTrigger>
          <TabsTrigger value="shipments">{isRTL ? 'الشحنات' : 'Shipments'}</TabsTrigger>
          <TabsTrigger value="incoterms">{isRTL ? 'شروط التجارة' : 'Incoterms'}</TabsTrigger>
          <TabsTrigger value="contracts">{isRTL ? 'العقود' : 'Contracts'}</TabsTrigger>
          <TabsTrigger value="priceLists">{isRTL ? 'قوائم الأسعار' : 'Price Lists'}</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers">
          <div className="bg-card border border-border rounded-xl p-6">
            <DataTable
              data={suppliers}
              columns={supplierColumns}
              searchKey="name"
              searchPlaceholder={isRTL ? 'البحث في الموردين...' : 'Search suppliers...'}
              searchPlaceholderAr="البحث في الموردين..."
            />
          </div>
        </TabsContent>

        <TabsContent value="rfq">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isRTL ? 'طلبات عروض الأسعار' : 'Request for Quotations'}</h3>
              <Button onClick={() => setIsAddRFQOpen(true)}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'طلب جديد' : 'New RFQ'}
              </Button>
            </div>
            <DataTable
              data={rfqs}
              columns={[
                { key: 'rfqNumber', header: 'RFQ #', headerAr: 'رقم الطلب', render: (item) => <span className="font-mono font-medium">{item.rfqNumber}</span> },
                { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status} /> },
                { key: 'requestedDate', header: 'Requested Date', headerAr: 'تاريخ الطلب' },
                { key: 'requiredDate', header: 'Required Date', headerAr: 'التاريخ المطلوب' },
                { key: 'items', header: 'Items', headerAr: 'الأصناف', render: (item) => item.items.length },
                { key: 'suppliers', header: 'Suppliers', headerAr: 'الموردون', render: (item) => item.supplierIds.length },
                {
                  key: 'actions',
                  header: 'Actions',
                  headerAr: 'الإجراءات',
                  render: (item) => (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedRFQ(item); setIsEditRFQOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  ),
                },
              ]}
              searchKey="rfqNumber"
              searchPlaceholder={isRTL ? 'البحث في طلبات العروض...' : 'Search RFQs...'}
              searchPlaceholderAr="البحث في طلبات العروض..."
            />
          </div>
        </TabsContent>

        <TabsContent value="pos">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isRTL ? 'أوامر الشراء' : 'Purchase Orders'}</h3>
              <Button onClick={() => setIsAddPOOpen(true)}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'أمر جديد' : 'New PO'}
              </Button>
            </div>
            <DataTable
              data={purchaseOrders}
              columns={poColumns}
              searchKey="poNumber"
              searchPlaceholder={isRTL ? 'البحث في أوامر الشراء...' : 'Search purchase orders...'}
              searchPlaceholderAr="البحث في أوامر الشراء..."
              onRowClick={(item) => { setSelectedPO(item); setIsEditPOOpen(true); }}
            />
          </div>
        </TabsContent>

        <TabsContent value="shipments">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'قريباً: إدارة الشحنات' : 'Coming Soon: Shipment Management'}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="incoterms">
          <div className="bg-card border border-border rounded-xl p-6">
            <DataTable
              data={incoterms}
              columns={[
                { key: 'code', header: 'Code', headerAr: 'الكود' },
                { key: 'name', header: 'Name', headerAr: 'الاسم', render: (item) => isRTL ? item.nameAr : item.name },
                { key: 'description', header: 'Description', headerAr: 'الوصف', render: (item) => isRTL ? item.descriptionAr : item.description },
                { key: 'riskTransferPoint', header: 'Risk Transfer', headerAr: 'نقل المخاطر', render: (item) => isRTL ? item.riskTransferPointAr : item.riskTransferPoint },
                { key: 'isActive', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.isActive ? 'active' : 'inactive'} /> },
              ]}
              searchKey="code"
              searchPlaceholder={isRTL ? 'البحث في شروط التجارة...' : 'Search incoterms...'}
              searchPlaceholderAr="البحث في شروط التجارة..."
            />
          </div>
        </TabsContent>

        <TabsContent value="contracts">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'قريباً: إدارة العقود' : 'Coming Soon: Contract Management'}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="priceLists">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'قريباً: قوائم الأسعار' : 'Coming Soon: Price Lists'}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Supplier Form Dialog */}
      <Dialog open={isAddSupplierOpen || isEditSupplierOpen} onOpenChange={isAddSupplierOpen ? setIsAddSupplierOpen : setIsEditSupplierOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditSupplierOpen ? (isRTL ? 'تعديل مورد' : 'Edit Supplier') : (isRTL ? 'إضافة مورد جديد' : 'Add New Supplier')}</DialogTitle>
            <DialogDescription>{isRTL ? 'أدخل تفاصيل المورد الجديد أو قم بتعديل الحالي.' : 'Enter new supplier details or edit existing one.'}</DialogDescription>
          </DialogHeader>
          <SupplierForm
            initialData={selectedSupplier || undefined}
            onSave={handleSaveSupplier}
            onCancel={() => {
              setIsAddSupplierOpen(false);
              setIsEditSupplierOpen(false);
              setSelectedSupplier(null);
            }}
            currencies={baseCurrencies}
            isRTL={isRTL}
          />
        </DialogContent>
      </Dialog>

      {/* Supplier Details Dialog */}
      <Dialog open={isViewSupplierOpen} onOpenChange={setIsViewSupplierOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isRTL ? 'تفاصيل المورد' : 'Supplier Details'}</DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <div className="grid gap-4 py-4">
              <div>
                <h4 className="font-bold text-lg">{getSupplierName(selectedSupplier, i18n.language)}</h4>
                <p className="text-sm text-muted-foreground font-mono">{selectedSupplier.code}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-1">{isRTL ? 'اسم الشركة:' : 'Company:'}</p>
                  <p className="text-muted-foreground">{isRTL ? selectedSupplier.companyNameAr : selectedSupplier.companyName}</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{isRTL ? 'الدولة:' : 'Country:'}</p>
                  <p className="text-muted-foreground">{selectedSupplier.country}</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{isRTL ? 'التصنيف:' : 'Classification:'}</p>
                  <p className="text-muted-foreground capitalize">{selectedSupplier.classification}</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{isRTL ? 'النوع:' : 'Type:'}</p>
                  <p className="text-muted-foreground capitalize">{selectedSupplier.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{isRTL ? 'التقييم:' : 'Rating:'}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{selectedSupplier.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-1">{isRTL ? 'معدل التسليم في الوقت:' : 'On-Time Delivery:'}</p>
                  <p className="text-muted-foreground">{selectedSupplier.onTimeDeliveryRate.toFixed(0)}%</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{isRTL ? 'البريد الإلكتروني:' : 'Email:'}</p>
                  <p className="text-muted-foreground">{selectedSupplier.email}</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{isRTL ? 'الهاتف:' : 'Phone:'}</p>
                  <p className="text-muted-foreground">{selectedSupplier.phone}</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{isRTL ? 'شروط الدفع:' : 'Payment Terms:'}</p>
                  <p className="text-muted-foreground">{selectedSupplier.paymentTerms}</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{isRTL ? 'مدة التسليم:' : 'Lead Time:'}</p>
                  <p className="text-muted-foreground">{selectedSupplier.leadTimeDays} {isRTL ? 'يوم' : 'days'}</p>
                </div>
              </div>
              <div>
                <p className="font-medium mb-1">{isRTL ? 'الحالة:' : 'Status:'}</p>
                <StatusBadge status={selectedSupplier.status} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewSupplierOpen(false)}>{isRTL ? 'إغلاق' : 'Close'}</Button>
            {selectedSupplier && (
              <Button onClick={() => { setIsViewSupplierOpen(false); setSelectedSupplier(selectedSupplier); setIsEditSupplierOpen(true); }}>
                {isRTL ? 'تعديل' : 'Edit'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RFQ Form Dialog */}
      <RFQForm
        open={isAddRFQOpen || isEditRFQOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddRFQOpen(false);
            setIsEditRFQOpen(false);
            setSelectedRFQ(null);
          }
        }}
        rfq={selectedRFQ}
        suppliers={suppliers}
        onSave={(data) => {
          toast({ title: isRTL ? (selectedRFQ ? 'تم تحديث طلب عرض السعر' : 'تم إنشاء طلب عرض السعر') : (selectedRFQ ? 'RFQ updated' : 'RFQ created') });
          setIsAddRFQOpen(false);
          setIsEditRFQOpen(false);
          setSelectedRFQ(null);
        }}
        isRTL={isRTL}
      />

      {/* PO Form Dialog */}
      <POForm
        open={isAddPOOpen || isEditPOOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddPOOpen(false);
            setIsEditPOOpen(false);
            setSelectedPO(null);
          }
        }}
        po={selectedPO}
        suppliers={suppliers}
        rfqs={rfqs}
        incoterms={incoterms}
        currencies={baseCurrencies}
        onSave={(data) => {
          toast({ title: isRTL ? (selectedPO ? 'تم تحديث أمر الشراء' : 'تم إنشاء أمر الشراء') : (selectedPO ? 'PO updated' : 'PO created') });
          setIsAddPOOpen(false);
          setIsEditPOOpen(false);
          setSelectedPO(null);
        }}
        isRTL={isRTL}
      />
    </ModuleLayout>
  );
}

