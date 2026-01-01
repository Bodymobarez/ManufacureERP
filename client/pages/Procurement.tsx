import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ModuleLayout } from '@/components/shared/ModuleLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MegaMenuTabs } from '@/components/shared/MegaMenuTabs';
import {
  ShoppingCart, Truck, Star, DollarSign, FileText, Ship, Globe,
  Eye, Edit, Plus, Package, AlertTriangle, CheckCircle, Clock, XCircle,
  ClipboardList, Receipt, FileCheck, BarChart3, Users, FileSearch,
  BookOpen, TrendingUp, Award, Calendar, Target, Settings
} from 'lucide-react';
import {
  mockSuppliers, mockPurchaseOrders, mockRFQs, mockShipments, mockIncoterms,
  mockContracts, mockPriceLists,
  SupplierMaster, PurchaseOrder, RFQ, Shipment, Incoterm, SupplierContract, SupplierPriceList,
  getSupplierName, generateId
} from '@/store/scmData';
import {
  mockPurchaseRequisitions, mockGoodsReceipts, mockSupplierInvoices, mockSupplierEvaluations, mockProcurementReports,
  PurchaseRequisition, GoodsReceipt, SupplierInvoice, SupplierEvaluation, ProcurementReport
} from '@/store/procurementData';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, baseCurrencies } from '@/store/currencyData';
import { SupplierForm, RFQForm, POForm } from '@/components/scm/SCMForms';

export default function Procurement() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { toast } = useToast();

  // State
  const [suppliers, setSuppliers] = useState<SupplierMaster[]>(mockSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [rfqs, setRFQs] = useState<RFQ[]>(mockRFQs);
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>(mockPurchaseRequisitions);
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceipt[]>(mockGoodsReceipts);
  const [supplierInvoices, setSupplierInvoices] = useState<SupplierInvoice[]>(mockSupplierInvoices);
  const [supplierEvaluations, setSupplierEvaluations] = useState<SupplierEvaluation[]>(mockSupplierEvaluations);
  const [contracts, setContracts] = useState<SupplierContract[]>(mockContracts);
  const [priceLists, setPriceLists] = useState<SupplierPriceList[]>(mockPriceLists);
  const [procurementReports, setProcurementReports] = useState<ProcurementReport[]>(mockProcurementReports);

  // Active tab
  const [activeTab, setActiveTab] = useState<string>('requisitions');

  // Dialog states
  const [isAddRequisitionOpen, setIsAddRequisitionOpen] = useState(false);
  const [isAddRFQOpen, setIsAddRFQOpen] = useState(false);
  const [isAddPOOpen, setIsAddPOOpen] = useState(false);
  const [isAddGRNOpen, setIsAddGRNOpen] = useState(false);
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isAddEvaluationOpen, setIsAddEvaluationOpen] = useState(false);
  const [isAddContractOpen, setIsAddContractOpen] = useState(false);
  const [isAddPriceListOpen, setIsAddPriceListOpen] = useState(false);

  const [selectedRequisition, setSelectedRequisition] = useState<PurchaseRequisition | null>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [selectedGRN, setSelectedGRN] = useState<GoodsReceipt | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<SupplierInvoice | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierMaster | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<SupplierEvaluation | null>(null);
  const [selectedContract, setSelectedContract] = useState<SupplierContract | null>(null);
  const [selectedPriceList, setSelectedPriceList] = useState<SupplierPriceList | null>(null);

  // Statistics
  const activePOs = purchaseOrders.filter(po => !['completed', 'cancelled'].includes(po.status)).length;
  const totalPOValue = purchaseOrders.reduce((sum, po) => sum + po.total, 0);
  const avgSupplierRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length;
  const pendingRequisitions = requisitions.filter(r => ['draft', 'submitted', 'under_review'].includes(r.status)).length;
  const pendingInvoices = supplierInvoices.filter(inv => inv.status === 'pending').length;
  const totalInvoiceValue = supplierInvoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0);

  // Mega Menu Tabs Configuration
  const megaMenuTabs = useMemo(() => [
    {
      id: 'requisitions',
      label: 'Requisitions',
      labelAr: 'طلبات الشراء',
      subtitle: 'Purchase Requests',
      subtitleAr: 'طلبات الشراء',
      icon: <ClipboardList className="w-4 h-4" />,
      onClick: () => setActiveTab('requisitions'),
    },
    {
      id: 'rfq',
      label: 'RFQ',
      labelAr: 'طلب عروض الأسعار',
      subtitle: 'Request for Quotation',
      subtitleAr: 'طلب عروض الأسعار',
      icon: <FileSearch className="w-4 h-4" />,
      onClick: () => setActiveTab('rfq'),
    },
    {
      id: 'orders',
      label: 'Purchase Orders',
      labelAr: 'أوامر الشراء',
      subtitle: 'PO Management',
      subtitleAr: 'إدارة أوامر الشراء',
      icon: <ShoppingCart className="w-4 h-4" />,
      onClick: () => setActiveTab('orders'),
    },
    {
      id: 'receipts',
      label: 'Goods Receipt',
      labelAr: 'استلام المواد',
      subtitle: 'GRN Management',
      subtitleAr: 'إدارة استلام المواد',
      icon: <Package className="w-4 h-4" />,
      onClick: () => setActiveTab('receipts'),
    },
    {
      id: 'invoices',
      label: 'Supplier Invoices',
      labelAr: 'فواتير الموردين',
      subtitle: 'Invoice Matching',
      subtitleAr: 'مطابقة الفواتير',
      icon: <Receipt className="w-4 h-4" />,
      onClick: () => setActiveTab('invoices'),
    },
    {
      id: 'suppliers',
      label: 'Suppliers',
      labelAr: 'الموردين',
      subtitle: 'Supplier Management',
      subtitleAr: 'إدارة الموردين',
      icon: <Truck className="w-4 h-4" />,
      onClick: () => setActiveTab('suppliers'),
    },
    {
      id: 'evaluations',
      label: 'Evaluations',
      labelAr: 'التقييمات',
      subtitle: 'Supplier Performance',
      subtitleAr: 'أداء الموردين',
      icon: <Award className="w-4 h-4" />,
      onClick: () => setActiveTab('evaluations'),
    },
    {
      id: 'contracts',
      label: 'Contracts',
      labelAr: 'العقود',
      subtitle: 'Supplier Contracts',
      subtitleAr: 'عقود الموردين',
      icon: <FileText className="w-4 h-4" />,
      onClick: () => setActiveTab('contracts'),
    },
    {
      id: 'pricelists',
      label: 'Price Lists',
      labelAr: 'قوائم الأسعار',
      subtitle: 'Supplier Pricing',
      subtitleAr: 'أسعار الموردين',
      icon: <DollarSign className="w-4 h-4" />,
      onClick: () => setActiveTab('pricelists'),
    },
    {
      id: 'shipments',
      label: 'Shipments',
      labelAr: 'الشحنات',
      subtitle: 'Logistics Tracking',
      subtitleAr: 'تتبع الشحنات',
      icon: <Ship className="w-4 h-4" />,
      onClick: () => setActiveTab('shipments'),
    },
    {
      id: 'reports',
      label: 'Reports',
      labelAr: 'التقارير',
      subtitle: 'Analytics & Reports',
      subtitleAr: 'التحليلات والتقارير',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => setActiveTab('reports'),
    },
  ], []);

  // Handler functions
  const handleSaveRequisition = (data: any) => {
    if (selectedRequisition) {
      setRequisitions(prev => prev.map(r => r.id === selectedRequisition.id ? { ...r, ...data } : r));
      toast({ title: isRTL ? 'تم التحديث' : 'Updated', description: isRTL ? 'تم تحديث طلب الشراء' : 'Purchase requisition updated' });
    } else {
      const newRequisition: PurchaseRequisition = {
        id: generateId(),
        requisitionNumber: `PR-${Date.now()}`,
        version: 1,
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setRequisitions(prev => [...prev, newRequisition]);
      toast({ title: isRTL ? 'تم الإنشاء' : 'Created', description: isRTL ? 'تم إنشاء طلب الشراء' : 'Purchase requisition created' });
    }
    setIsAddRequisitionOpen(false);
    setSelectedRequisition(null);
  };

  const handleSaveRFQ = (data: any) => {
    if (selectedRFQ) {
      setRFQs(prev => prev.map(r => r.id === selectedRFQ.id ? { ...r, ...data } : r));
      toast({ title: isRTL ? 'تم التحديث' : 'Updated', description: isRTL ? 'تم تحديث طلب العروض' : 'RFQ updated' });
    } else {
      const newRFQ: RFQ = {
        id: generateId(),
        rfqNumber: `RFQ-${Date.now()}`,
        version: 1,
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setRFQs(prev => [...prev, newRFQ]);
      toast({ title: isRTL ? 'تم الإنشاء' : 'Created', description: isRTL ? 'تم إنشاء طلب العروض' : 'RFQ created' });
    }
    setIsAddRFQOpen(false);
    setSelectedRFQ(null);
  };

  const handleSavePO = (data: any) => {
    if (selectedPO) {
      setPurchaseOrders(prev => prev.map(po => po.id === selectedPO.id ? { ...po, ...data } : po));
      toast({ title: isRTL ? 'تم التحديث' : 'Updated', description: isRTL ? 'تم تحديث أمر الشراء' : 'Purchase order updated' });
    } else {
      const newPO: PurchaseOrder = {
        id: generateId(),
        poNumber: `PO-${Date.now()}`,
        version: 1,
        ...data,
        amendments: [],
        createdBy: 'current-user',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setPurchaseOrders(prev => [...prev, newPO]);
      toast({ title: isRTL ? 'تم الإنشاء' : 'Created', description: isRTL ? 'تم إنشاء أمر الشراء' : 'Purchase order created' });
    }
    setIsAddPOOpen(false);
    setSelectedPO(null);
  };

  const handleSaveGRN = (data: any) => {
    if (selectedGRN) {
      setGoodsReceipts(prev => prev.map(gr => gr.id === selectedGRN.id ? { ...gr, ...data } : gr));
      toast({ title: isRTL ? 'تم التحديث' : 'Updated', description: isRTL ? 'تم تحديث استلام المواد' : 'Goods receipt updated' });
    } else {
      const newGRN: GoodsReceipt = {
        id: generateId(),
        grnNumber: `GRN-${Date.now()}`,
        ...data,
        createdBy: 'current-user',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setGoodsReceipts(prev => [...prev, newGRN]);
      toast({ title: isRTL ? 'تم الإنشاء' : 'Created', description: isRTL ? 'تم إنشاء استلام المواد' : 'Goods receipt created' });
    }
    setIsAddGRNOpen(false);
    setSelectedGRN(null);
  };

  const handleSaveInvoice = (data: any) => {
    if (selectedInvoice) {
      setSupplierInvoices(prev => prev.map(inv => inv.id === selectedInvoice.id ? { ...inv, ...data } : inv));
      toast({ title: isRTL ? 'تم التحديث' : 'Updated', description: isRTL ? 'تم تحديث الفاتورة' : 'Invoice updated' });
    } else {
      const newInvoice: SupplierInvoice = {
        id: generateId(),
        invoiceNumber: `INV-${Date.now()}`,
        supplierInvoiceNumber: data.supplierInvoiceNumber || `SUP-INV-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setSupplierInvoices(prev => [...prev, newInvoice]);
      toast({ title: isRTL ? 'تم الإنشاء' : 'Created', description: isRTL ? 'تم إنشاء الفاتورة' : 'Invoice created' });
    }
    setIsAddInvoiceOpen(false);
    setSelectedInvoice(null);
  };

  const handleSaveSupplier = (data: any) => {
    if (selectedSupplier) {
      setSuppliers(prev => prev.map(s => s.id === selectedSupplier.id ? { ...s, ...data } : s));
      toast({ title: isRTL ? 'تم التحديث' : 'Updated', description: isRTL ? 'تم تحديث المورد' : 'Supplier updated' });
    } else {
      const newSupplier: SupplierMaster = {
        id: generateId(),
        code: data.code || `SUP-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setSuppliers(prev => [...prev, newSupplier]);
      toast({ title: isRTL ? 'تم الإنشاء' : 'Created', description: isRTL ? 'تم إنشاء المورد' : 'Supplier created' });
    }
    setIsAddSupplierOpen(false);
    setSelectedSupplier(null);
  };

  const handleSaveEvaluation = (data: any) => {
    if (selectedEvaluation) {
      setSupplierEvaluations(prev => prev.map(e => e.id === selectedEvaluation.id ? { ...e, ...data } : e));
      toast({ title: isRTL ? 'تم التحديث' : 'Updated', description: isRTL ? 'تم تحديث التقييم' : 'Evaluation updated' });
    } else {
      const newEvaluation: SupplierEvaluation = {
        id: generateId(),
        evaluationNumber: `EVAL-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setSupplierEvaluations(prev => [...prev, newEvaluation]);
      toast({ title: isRTL ? 'تم الإنشاء' : 'Created', description: isRTL ? 'تم إنشاء التقييم' : 'Evaluation created' });
    }
    setIsAddEvaluationOpen(false);
    setSelectedEvaluation(null);
  };

  const handleSaveContract = (data: any) => {
    if (selectedContract) {
      setContracts(prev => prev.map(c => c.id === selectedContract.id ? { ...c, ...data } : c));
      toast({ title: isRTL ? 'تم التحديث' : 'Updated', description: isRTL ? 'تم تحديث العقد' : 'Contract updated' });
    } else {
      const newContract: SupplierContract = {
        id: generateId(),
        contractNumber: `CONTRACT-${Date.now()}`,
        ...data,
        createdBy: 'current-user',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setContracts(prev => [...prev, newContract]);
      toast({ title: isRTL ? 'تم الإنشاء' : 'Created', description: isRTL ? 'تم إنشاء العقد' : 'Contract created' });
    }
    setIsAddContractOpen(false);
    setSelectedContract(null);
  };

  const handleSavePriceList = (data: any) => {
    if (selectedPriceList) {
      setPriceLists(prev => prev.map(pl => pl.id === selectedPriceList.id ? { ...pl, ...data } : pl));
      toast({ title: isRTL ? 'تم التحديث' : 'Updated', description: isRTL ? 'تم تحديث قائمة الأسعار' : 'Price list updated' });
    } else {
      const newPriceList: SupplierPriceList = {
        id: generateId(),
        priceListNumber: `PL-${Date.now()}`,
        ...data,
        createdBy: 'current-user',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setPriceLists(prev => [...prev, newPriceList]);
      toast({ title: isRTL ? 'تم الإنشاء' : 'Created', description: isRTL ? 'تم إنشاء قائمة الأسعار' : 'Price list created' });
    }
    setIsAddPriceListOpen(false);
    setSelectedPriceList(null);
  };

  // Columns
  const requisitionColumns: Column<PurchaseRequisition>[] = [
    {
      key: 'requisitionNumber',
      header: 'Requisition #',
      headerAr: 'رقم الطلب',
      render: (item) => <span className="font-mono font-medium">{item.requisitionNumber}</span>
    },
    {
      key: 'department',
      header: 'Department',
      headerAr: 'القسم',
      render: (item) => isRTL ? item.departmentNameAr : item.departmentName
    },
    {
      key: 'requestedDate',
      header: 'Requested Date',
      headerAr: 'تاريخ الطلب',
    },
    {
      key: 'requiredDate',
      header: 'Required Date',
      headerAr: 'التاريخ المطلوب',
    },
    {
      key: 'totalEstimatedCost',
      header: 'Estimated Cost',
      headerAr: 'التكلفة المقدرة',
      render: (item) => formatCurrency(item.totalEstimatedCost, item.currency)
    },
    {
      key: 'priority',
      header: 'Priority',
      headerAr: 'الأولوية',
      render: (item) => <StatusBadge status={item.priority} />
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status} />
    },
  ];

  const rfqColumns: Column<RFQ>[] = [
    {
      key: 'rfqNumber',
      header: 'RFQ #',
      headerAr: 'رقم طلب العروض',
      render: (item) => <span className="font-mono font-medium">{item.rfqNumber}</span>
    },
    {
      key: 'requestedDate',
      header: 'Requested Date',
      headerAr: 'تاريخ الطلب',
    },
    {
      key: 'requiredDate',
      header: 'Required Date',
      headerAr: 'التاريخ المطلوب',
    },
    {
      key: 'suppliers',
      header: 'Suppliers',
      headerAr: 'الموردين',
      render: (item) => `${item.suppliers.length} ${isRTL ? 'مورد' : 'suppliers'}`
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status} />
    },
  ];

  const poColumns: Column<PurchaseOrder>[] = [
    {
      key: 'poNumber',
      header: 'PO Number',
      headerAr: 'رقم الأمر',
      render: (item) => <span className="font-mono font-medium">{item.poNumber}</span>
    },
    {
      key: 'supplier',
      header: 'Supplier',
      headerAr: 'المورد',
      render: (item) => item.supplierName
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
      render: (item) => formatCurrency(item.total, item.currency)
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status} />
    },
  ];

  const grnColumns: Column<GoodsReceipt>[] = [
    {
      key: 'grnNumber',
      header: 'GRN #',
      headerAr: 'رقم استلام المواد',
      render: (item) => <span className="font-mono font-medium">{item.grnNumber}</span>
    },
    {
      key: 'poNumber',
      header: 'PO Number',
      headerAr: 'رقم الأمر',
      render: (item) => <span className="font-mono">{item.poNumber}</span>
    },
    {
      key: 'supplier',
      header: 'Supplier',
      headerAr: 'المورد',
      render: (item) => item.supplierName
    },
    {
      key: 'receiptDate',
      header: 'Receipt Date',
      headerAr: 'تاريخ الاستلام',
    },
    {
      key: 'qualityStatus',
      header: 'Quality',
      headerAr: 'الجودة',
      render: (item) => item.qualityStatus ? <StatusBadge status={item.qualityStatus} /> : '-'
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status} />
    },
  ];

  const invoiceColumns: Column<SupplierInvoice>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      headerAr: 'رقم الفاتورة',
      render: (item) => <span className="font-mono font-medium">{item.invoiceNumber}</span>
    },
    {
      key: 'supplierInvoiceNumber',
      header: 'Supplier Invoice #',
      headerAr: 'رقم فاتورة المورد',
      render: (item) => <span className="font-mono">{item.supplierInvoiceNumber}</span>
    },
    {
      key: 'poNumber',
      header: 'PO Number',
      headerAr: 'رقم الأمر',
      render: (item) => <span className="font-mono">{item.poNumber}</span>
    },
    {
      key: 'supplier',
      header: 'Supplier',
      headerAr: 'المورد',
      render: (item) => item.supplierName
    },
    {
      key: 'invoiceDate',
      header: 'Invoice Date',
      headerAr: 'تاريخ الفاتورة',
    },
    {
      key: 'total',
      header: 'Total',
      headerAr: 'الإجمالي',
      render: (item) => formatCurrency(item.total, item.currency)
    },
    {
      key: 'matchingStatus',
      header: 'Matching',
      headerAr: 'المطابقة',
      render: (item) => <StatusBadge status={item.matchingStatus} />
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status} />
    },
  ];

  const supplierColumns: Column<SupplierMaster>[] = [
    {
      key: 'code',
      header: 'Code',
      headerAr: 'الكود',
      render: (item) => <span className="font-mono text-sm">{item.code}</span>
    },
    {
      key: 'name',
      header: 'Supplier Name',
      headerAr: 'اسم المورد',
      render: (item) => (
        <div>
          <p className="font-medium">{getSupplierName(item, i18n.language)}</p>
          <p className="text-sm text-muted-foreground">{item.country}</p>
        </div>
      )
    },
    {
      key: 'categories',
      header: 'Categories',
      headerAr: 'الفئات',
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.categories.map(cat => (
            <span key={cat} className="px-2 py-0.5 bg-muted rounded text-xs capitalize">{cat}</span>
          ))}
        </div>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      headerAr: 'التقييم',
      render: (item) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span>{item.rating.toFixed(1)}</span>
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

  return (
    <ModuleLayout>
      <PageHeader
        icon={ShoppingCart}
        title="Procurement Management"
        titleAr="إدارة المشتريات"
        subtitle="Complete procurement management system with all departments"
        subtitleAr="نظام إدارة المشتريات الكامل بجميع الأقسام"
        colorGradient="from-indigo-500 to-indigo-600"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Active Suppliers"
          titleAr="الموردين النشطين"
          value={suppliers.filter(s => s.status === 'active').length}
          icon={Truck}
          iconColor="text-indigo-500"
        />
        <StatCard
          title="Open POs"
          titleAr="أوامر الشراء المفتوحة"
          value={activePOs}
          icon={ShoppingCart}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Pending Invoices"
          titleAr="الفواتير المعلقة"
          value={pendingInvoices}
          icon={Receipt}
          iconColor="text-orange-500"
        />
        <StatCard
          title="Pending Requisitions"
          titleAr="الطلبات المعلقة"
          value={pendingRequisitions}
          icon={ClipboardList}
          iconColor="text-purple-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <NavigationMenu>
          <NavigationMenuList className="flex-wrap gap-2">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm">
                {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                  <Link to="#" onClick={() => { setIsAddRequisitionOpen(true); setSelectedRequisition(null); }} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{isRTL ? 'طلب شراء جديد' : 'New Requisition'}</div>
                        <div className="text-xs text-muted-foreground">{isRTL ? 'إنشاء طلب شراء' : 'Create purchase requisition'}</div>
                      </div>
                    </div>
                  </Link>
                  <Link to="#" onClick={() => { setIsAddRFQOpen(true); setSelectedRFQ(null); }} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="flex items-center gap-2">
                      <FileSearch className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{isRTL ? 'طلب عروض أسعار' : 'New RFQ'}</div>
                        <div className="text-xs text-muted-foreground">{isRTL ? 'إنشاء طلب عروض أسعار' : 'Create RFQ'}</div>
                      </div>
                    </div>
                  </Link>
                  <Link to="#" onClick={() => { setIsAddPOOpen(true); setSelectedPO(null); }} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{isRTL ? 'أمر شراء جديد' : 'New Purchase Order'}</div>
                        <div className="text-xs text-muted-foreground">{isRTL ? 'إنشاء أمر شراء' : 'Create purchase order'}</div>
                      </div>
                    </div>
                  </Link>
                  <Link to="#" onClick={() => { setIsAddGRNOpen(true); setSelectedGRN(null); }} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{isRTL ? 'استلام مواد جديد' : 'New Goods Receipt'}</div>
                        <div className="text-xs text-muted-foreground">{isRTL ? 'تسجيل استلام مواد' : 'Record goods receipt'}</div>
                      </div>
                    </div>
                  </Link>
                  <Link to="#" onClick={() => { setIsAddInvoiceOpen(true); setSelectedInvoice(null); }} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{isRTL ? 'فاتورة مورد جديدة' : 'New Supplier Invoice'}</div>
                        <div className="text-xs text-muted-foreground">{isRTL ? 'تسجيل فاتورة مورد' : 'Record supplier invoice'}</div>
                      </div>
                    </div>
                  </Link>
                  <Link to="#" onClick={() => { setIsAddSupplierOpen(true); setSelectedSupplier(null); }} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{isRTL ? 'مورد جديد' : 'New Supplier'}</div>
                        <div className="text-xs text-muted-foreground">{isRTL ? 'إضافة مورد جديد' : 'Add new supplier'}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
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

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {/* Requisitions Tab */}
        <TabsContent value="requisitions">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{isRTL ? 'طلبات الشراء' : 'Purchase Requisitions'}</h3>
              <Button onClick={() => { setIsAddRequisitionOpen(true); setSelectedRequisition(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'طلب جديد' : 'New Requisition'}
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <DataTable
                data={requisitions}
                columns={requisitionColumns}
                searchKey="requisitionNumber"
                searchPlaceholder="Search requisitions..."
                searchPlaceholderAr="بحث في الطلبات..."
              />
            </div>
          </div>
        </TabsContent>

        {/* RFQ Tab */}
        <TabsContent value="rfq">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{isRTL ? 'طلبات عروض الأسعار' : 'Request for Quotation'}</h3>
              <Button onClick={() => { setIsAddRFQOpen(true); setSelectedRFQ(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'طلب جديد' : 'New RFQ'}
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <DataTable
                data={rfqs}
                columns={rfqColumns}
                searchKey="rfqNumber"
                searchPlaceholder="Search RFQs..."
                searchPlaceholderAr="بحث في طلبات العروض..."
              />
            </div>
          </div>
        </TabsContent>

        {/* Purchase Orders Tab */}
        <TabsContent value="orders">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{isRTL ? 'أوامر الشراء' : 'Purchase Orders'}</h3>
              <Button onClick={() => { setIsAddPOOpen(true); setSelectedPO(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'أمر جديد' : 'New PO'}
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <DataTable
                data={purchaseOrders}
                columns={poColumns}
                searchKey="poNumber"
                searchPlaceholder="Search purchase orders..."
                searchPlaceholderAr="بحث في أوامر الشراء..."
              />
            </div>
          </div>
        </TabsContent>

        {/* Goods Receipt Tab */}
        <TabsContent value="receipts">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{isRTL ? 'استلام المواد' : 'Goods Receipt'}</h3>
              <Button onClick={() => { setIsAddGRNOpen(true); setSelectedGRN(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'استلام جديد' : 'New GRN'}
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <DataTable
                data={goodsReceipts}
                columns={grnColumns}
                searchKey="grnNumber"
                searchPlaceholder="Search goods receipts..."
                searchPlaceholderAr="بحث في استلام المواد..."
              />
            </div>
          </div>
        </TabsContent>

        {/* Supplier Invoices Tab */}
        <TabsContent value="invoices">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{isRTL ? 'فواتير الموردين' : 'Supplier Invoices'}</h3>
              <Button onClick={() => { setIsAddInvoiceOpen(true); setSelectedInvoice(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'فاتورة جديدة' : 'New Invoice'}
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <DataTable
                data={supplierInvoices}
                columns={invoiceColumns}
                searchKey="invoiceNumber"
                searchPlaceholder="Search invoices..."
                searchPlaceholderAr="بحث في الفواتير..."
              />
            </div>
          </div>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{isRTL ? 'الموردين' : 'Suppliers'}</h3>
              <Button onClick={() => { setIsAddSupplierOpen(true); setSelectedSupplier(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'مورد جديد' : 'New Supplier'}
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <DataTable
                data={suppliers}
                columns={supplierColumns}
                searchKey="name"
                searchPlaceholder="Search suppliers..."
                searchPlaceholderAr="بحث في الموردين..."
              />
            </div>
          </div>
        </TabsContent>

        {/* Evaluations Tab */}
        <TabsContent value="evaluations">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{isRTL ? 'تقييمات الموردين' : 'Supplier Evaluations'}</h3>
              <Button onClick={() => { setIsAddEvaluationOpen(true); setSelectedEvaluation(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'تقييم جديد' : 'New Evaluation'}
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-center py-8 text-muted-foreground">
                {isRTL ? 'قريباً: تقييمات الموردين' : 'Coming soon: Supplier Evaluations'}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{isRTL ? 'عقود الموردين' : 'Supplier Contracts'}</h3>
              <Button onClick={() => { setIsAddContractOpen(true); setSelectedContract(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'عقد جديد' : 'New Contract'}
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-center py-8 text-muted-foreground">
                {isRTL ? 'قريباً: عقود الموردين' : 'Coming soon: Supplier Contracts'}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Price Lists Tab */}
        <TabsContent value="pricelists">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{isRTL ? 'قوائم الأسعار' : 'Price Lists'}</h3>
              <Button onClick={() => { setIsAddPriceListOpen(true); setSelectedPriceList(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'قائمة جديدة' : 'New Price List'}
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-center py-8 text-muted-foreground">
                {isRTL ? 'قريباً: قوائم الأسعار' : 'Coming soon: Price Lists'}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Shipments Tab */}
        <TabsContent value="shipments">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{isRTL ? 'الشحنات' : 'Shipments'}</h3>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-center py-8 text-muted-foreground">
                {isRTL ? 'قريباً: تتبع الشحنات' : 'Coming soon: Shipment Tracking'}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{isRTL ? 'التقارير' : 'Reports'}</h3>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-center py-8 text-muted-foreground">
                {isRTL ? 'قريباً: تقارير المشتريات' : 'Coming soon: Procurement Reports'}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Forms */}
      <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isRTL ? 'إضافة مورد جديد' : 'Add New Supplier'}</DialogTitle>
          </DialogHeader>
          <SupplierForm
            initialData={selectedSupplier || undefined}
            onSave={handleSaveSupplier}
            onCancel={() => { setIsAddSupplierOpen(false); setSelectedSupplier(null); }}
            currencies={baseCurrencies}
            isRTL={isRTL}
          />
        </DialogContent>
      </Dialog>

      <RFQForm
        open={isAddRFQOpen}
        onOpenChange={(open) => {
          setIsAddRFQOpen(open);
          if (!open) setSelectedRFQ(null);
        }}
        rfq={selectedRFQ}
        suppliers={suppliers}
        onSave={handleSaveRFQ}
        isRTL={isRTL}
      />

      <POForm
        open={isAddPOOpen}
        onOpenChange={(open) => {
          setIsAddPOOpen(open);
          if (!open) setSelectedPO(null);
        }}
        po={selectedPO}
        suppliers={suppliers}
        rfqs={rfqs}
        incoterms={mockIncoterms}
        currencies={baseCurrencies}
        onSave={handleSavePO}
        isRTL={isRTL}
      />
    </ModuleLayout>
  );
}
