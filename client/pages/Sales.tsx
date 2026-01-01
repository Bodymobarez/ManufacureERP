import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ModuleLayout } from '@/components/shared/ModuleLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MegaMenuTabs } from '@/components/shared/MegaMenuTabs';
import { TrendingUp, ShoppingBag, Users, DollarSign, FileText, Ship, Globe, Eye, Edit, Plus, Receipt, CreditCard, RotateCcw, Target, BarChart, Percent, FileCheck, TrendingDown, Calendar, Award, PackageCheck, Download, ClipboardList, FileSearch, Building2, Tag, Wallet, ArrowLeftRight, TrendingUp as TrendingUpIcon, BarChart3, MessageSquare, Settings } from 'lucide-react';
import { mockCustomers, getCustomerName } from '@/store/data';
import { 
  mockBuyers, mockSalesContracts, mockShipments, mockSalesOrders, 
  mockQuotations, mockInvoices, mockPayments, mockPriceLists, mockSalesReturns,
  mockSalesCommissions, mockSalesTargets, mockSalesForecasts, mockSalesPipelines,
  mockCreditNotes, mockExportDocumentsFull, mockSalesReports,
  getBuyerName, Buyer, SalesContract, Shipment as SalesShipment, SalesOrder,
  Quotation, Invoice, Payment, PriceList, SalesReturn, SalesCommission, SalesTarget,
  SalesForecast, SalesPipeline, CreditNote, ExportDocumentFull, SalesReport,
  generateId 
} from '@/store/salesData';
import type { Customer } from '@shared/types';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';
import { baseCurrencies, formatCurrency, convertCurrency } from '@/store/currencyData';
import { useToast } from '@/hooks/use-toast';
import { BuyerForm, SalesOrderForm, SalesContractForm, ShipmentForm } from '@/components/sales/SalesForms';
import { QuotationForm, InvoiceForm, PaymentForm, PriceListForm, ReturnForm } from '@/components/sales/SalesFormsNew';

export default function Sales() {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';
  const [displayCurrency, setDisplayCurrency] = useState('USD');

  // State
  const [buyers, setBuyers] = useState<Buyer[]>(mockBuyers);
  const [salesContracts, setSalesContracts] = useState<SalesContract[]>(mockSalesContracts);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(mockSalesOrders);
  const [shipments, setShipments] = useState<SalesShipment[]>(mockShipments);
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [priceLists, setPriceLists] = useState<PriceList[]>(mockPriceLists);
  const [salesReturns, setSalesReturns] = useState<SalesReturn[]>(mockSalesReturns);
  const [salesCommissions] = useState<SalesCommission[]>(mockSalesCommissions);
  const [salesTargets] = useState<SalesTarget[]>(mockSalesTargets);
  const [salesForecasts] = useState<SalesForecast[]>(mockSalesForecasts);
  const [salesPipelines] = useState<SalesPipeline[]>(mockSalesPipelines);
  const [creditNotes] = useState<CreditNote[]>(mockCreditNotes);
  const [exportDocuments] = useState<ExportDocumentFull[]>(mockExportDocumentsFull);
  const [salesReports] = useState<SalesReport[]>(mockSalesReports);

  // Dialog states
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [selectedContract, setSelectedContract] = useState<SalesContract | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<SalesShipment | null>(null);

  const [isAddBuyerOpen, setIsAddBuyerOpen] = useState(false);
  const [isEditBuyerOpen, setIsEditBuyerOpen] = useState(false);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  const [isAddContractOpen, setIsAddContractOpen] = useState(false);
  const [isEditContractOpen, setIsEditContractOpen] = useState(false);
  const [isAddShipmentOpen, setIsAddShipmentOpen] = useState(false);
  const [isEditShipmentOpen, setIsEditShipmentOpen] = useState(false);
  
  // New form states
  const [isAddQuotationOpen, setIsAddQuotationOpen] = useState(false);
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddPriceListOpen, setIsAddPriceListOpen] = useState(false);
  const [isAddReturnOpen, setIsAddReturnOpen] = useState(false);
  
  // Selected items for editing
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedPriceList, setSelectedPriceList] = useState<PriceList | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<SalesReturn | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState<string>('orders');

  // Currency conversion helper
  const convertToDisplay = (amountUSD: number) => {
    if (displayCurrency === 'USD') return amountUSD;
    return convertCurrency(amountUSD, 'USD', displayCurrency);
  };

  const totalRevenue = salesOrders.reduce((sum, so) => sum + so.total, 0);
  const pendingOrders = salesOrders.filter(so => !['delivered', 'cancelled'].includes(so.status)).length;
  const avgOrderValue = totalRevenue / salesOrders.length;

  // Mega Menu Tabs Configuration
  const megaMenuTabs = useMemo(() => [
    {
      id: 'orders',
      label: 'Sales Orders',
      labelAr: 'طلبات المبيعات',
      subtitle: 'Order Management',
      subtitleAr: 'إدارة الطلبات',
      icon: <ShoppingBag className="w-4 h-4" />,
      onClick: () => setActiveTab('orders'),
    },
    {
      id: 'quotations',
      label: 'Quotations',
      labelAr: 'عروض الأسعار',
      subtitle: 'Price Quotes',
      subtitleAr: 'عروض الأسعار',
      icon: <FileSearch className="w-4 h-4" />,
      onClick: () => setActiveTab('quotations'),
    },
    {
      id: 'invoices',
      label: 'Invoices',
      labelAr: 'الفواتير',
      subtitle: 'Invoice Management',
      subtitleAr: 'إدارة الفواتير',
      icon: <Receipt className="w-4 h-4" />,
      onClick: () => setActiveTab('invoices'),
    },
    {
      id: 'buyers',
      label: 'Buyers',
      labelAr: 'المشترون',
      subtitle: 'Customer Management',
      subtitleAr: 'إدارة العملاء',
      icon: <Users className="w-4 h-4" />,
      onClick: () => setActiveTab('buyers'),
    },
    {
      id: 'contracts',
      label: 'Contracts',
      labelAr: 'العقود',
      subtitle: 'Sales Contracts',
      subtitleAr: 'عقود المبيعات',
      icon: <FileText className="w-4 h-4" />,
      onClick: () => setActiveTab('contracts'),
    },
    {
      id: 'shipments',
      label: 'Shipments',
      labelAr: 'الشحنات',
      subtitle: 'Logistics',
      subtitleAr: 'اللوجستيات',
      icon: <Ship className="w-4 h-4" />,
      onClick: () => setActiveTab('shipments'),
    },
    {
      id: 'pricing',
      label: 'Pricing',
      labelAr: 'التسعير',
      subtitle: 'Price Lists',
      subtitleAr: 'قوائم الأسعار',
      icon: <Tag className="w-4 h-4" />,
      onClick: () => setActiveTab('pricing'),
    },
    {
      id: 'payments',
      label: 'Payments',
      labelAr: 'المدفوعات',
      subtitle: 'Payment Tracking',
      subtitleAr: 'تتبع المدفوعات',
      icon: <CreditCard className="w-4 h-4" />,
      onClick: () => setActiveTab('payments'),
    },
    {
      id: 'returns',
      label: 'Returns',
      labelAr: 'المرتجعات',
      subtitle: 'Sales Returns',
      subtitleAr: 'مرتجعات المبيعات',
      icon: <RotateCcw className="w-4 h-4" />,
      onClick: () => setActiveTab('returns'),
    },
    {
      id: 'credit',
      label: 'Credit Notes',
      labelAr: 'سندات الائتمان',
      subtitle: 'Credit Management',
      subtitleAr: 'إدارة الائتمان',
      icon: <FileCheck className="w-4 h-4" />,
      onClick: () => setActiveTab('credit'),
    },
    {
      id: 'commissions',
      label: 'Commissions',
      labelAr: 'العمولات',
      subtitle: 'Sales Commissions',
      subtitleAr: 'عمولات المبيعات',
      icon: <Percent className="w-4 h-4" />,
      onClick: () => setActiveTab('commissions'),
    },
    {
      id: 'targets',
      label: 'Targets',
      labelAr: 'الأهداف',
      subtitle: 'Sales Targets',
      subtitleAr: 'أهداف المبيعات',
      icon: <Target className="w-4 h-4" />,
      onClick: () => setActiveTab('targets'),
    },
    {
      id: 'pipeline',
      label: 'Pipeline',
      labelAr: 'مسار المبيعات',
      subtitle: 'Sales Pipeline',
      subtitleAr: 'مسار المبيعات',
      icon: <TrendingUpIcon className="w-4 h-4" />,
      onClick: () => setActiveTab('pipeline'),
    },
    {
      id: 'forecast',
      label: 'Forecast',
      labelAr: 'التنبؤ',
      subtitle: 'Sales Forecasting',
      subtitleAr: 'التنبؤ بالمبيعات',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => setActiveTab('forecast'),
    },
    {
      id: 'export',
      label: 'Export Docs',
      labelAr: 'مستندات التصدير',
      subtitle: 'Export Documents',
      subtitleAr: 'مستندات التصدير',
      icon: <Globe className="w-4 h-4" />,
      onClick: () => setActiveTab('export'),
    },
    {
      id: 'reports',
      label: 'Reports',
      labelAr: 'التقارير',
      subtitle: 'Sales Reports',
      subtitleAr: 'تقارير المبيعات',
      icon: <BarChart className="w-4 h-4" />,
      onClick: () => setActiveTab('reports'),
    },
  ], []);

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load buyers
        const buyersRes = await fetch('/api/sales/buyers');
        if (buyersRes.ok) {
          const buyersData = await buyersRes.json();
          if (buyersData.length > 0) {
            setBuyers(buyersData);
          }
        }

        // Load sales orders
        const ordersRes = await fetch('/api/sales/orders');
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (ordersData.length > 0) {
            setSalesOrders(ordersData);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to mock data if API fails
      }
    };

    loadData();
  }, []);

  // Handler functions
  const handleSaveOrder = async (data: any) => {
    try {
      const url = selectedOrder 
        ? `/api/sales/orders/${selectedOrder.id}`
        : '/api/sales/orders';
      
      const method = selectedOrder ? 'PUT' : 'POST';
      
      const orderData = {
        ...data,
        orderDate: data.orderDate || new Date().toISOString(),
        requiredDate: data.requiredDate || new Date().toISOString(),
        buyerId: data.buyerId,
        buyerName: buyers.find(b => b.id === data.buyerId)?.name || '',
        buyerCode: buyers.find(b => b.id === data.buyerId)?.code || '',
        createdBy: 'Current User',
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to save order');
      }

      const savedOrder = await response.json();
      
      if (selectedOrder) {
        setSalesOrders(salesOrders.map(o => o.id === selectedOrder.id ? savedOrder : o));
        toast({ title: isRTL ? 'تم تحديث طلب المبيعات' : 'Sales order updated successfully' });
      } else {
        setSalesOrders([...salesOrders, savedOrder]);
        toast({ title: isRTL ? 'تم إنشاء طلب المبيعات' : 'Sales order created successfully' });
        
        // ربط مع MRP - إنشاء طلب في MRP إذا كان الطلب مؤكد
        if (data.status === 'confirmed') {
          toast({ 
            title: isRTL ? 'تم إنشاء طلب في MRP' : 'MRP requirement created',
            description: isRTL ? 'سيتم تخطيط المواد المطلوبة' : 'Material requirements will be planned'
          });
        }
      }
      
      setSelectedOrder(null);
      setIsAddOrderOpen(false);
      setIsEditOrderOpen(false);
    } catch (error) {
      console.error('Error saving order:', error);
      toast({ 
        title: isRTL ? 'خطأ في حفظ الطلب' : 'Error saving order',
        variant: 'destructive'
      });
    }
  };

  const handleSaveQuotation = (data: any) => {
    const newQuotation: Quotation = {
      ...data,
      id: selectedQuotation?.id || generateId(),
      quotationNumber: selectedQuotation?.quotationNumber || `QUOT-${new Date().getFullYear()}-${String(quotations.length + 1).padStart(3, '0')}`,
      buyerName: buyers.find(b => b.id === data.buyerId)?.name || '',
      buyerCode: buyers.find(b => b.id === data.buyerId)?.code || '',
      status: 'draft',
      createdBy: 'Current User',
      createdAt: selectedQuotation?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    if (selectedQuotation) {
      setQuotations(quotations.map(q => q.id === selectedQuotation.id ? newQuotation : q));
      toast({ title: isRTL ? 'تم تحديث عرض الأسعار' : 'Quotation updated successfully' });
    } else {
      setQuotations([...quotations, newQuotation]);
      toast({ title: isRTL ? 'تم إنشاء عرض الأسعار' : 'Quotation created successfully' });
    }
    setSelectedQuotation(null);
    setIsAddQuotationOpen(false);
  };

  const handleSaveInvoice = (data: any) => {
    const selectedOrder = salesOrders.find(so => so.id === data.salesOrderId);
    const newInvoice: Invoice = {
      ...data,
      id: selectedInvoice?.id || generateId(),
      invoiceNumber: selectedInvoice?.invoiceNumber || `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      salesOrderNumber: selectedOrder?.orderNumber || '',
      buyerId: selectedOrder?.buyerId || '',
      buyerName: selectedOrder?.buyerName || '',
      buyerCode: selectedOrder?.buyerCode || '',
      status: 'draft',
      items: selectedOrder?.items.map(item => ({
        id: item.id,
        styleNumber: item.styleNumber,
        styleName: item.styleName,
        styleNameAr: item.styleNameAr,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        total: item.total,
      })) || [],
      subtotal: selectedOrder?.subtotal || 0,
      discount: selectedOrder?.discount || 0,
      tax: selectedOrder?.tax || 0,
      shippingCost: selectedOrder?.shippingCost || 0,
      total: selectedOrder?.total || 0,
      paidAmount: 0,
      outstandingAmount: selectedOrder?.total || 0,
      createdBy: 'Current User',
      createdAt: selectedInvoice?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    if (selectedInvoice) {
      setInvoices(invoices.map(inv => inv.id === selectedInvoice.id ? newInvoice : inv));
      toast({ title: isRTL ? 'تم تحديث الفاتورة' : 'Invoice updated successfully' });
    } else {
      setInvoices([...invoices, newInvoice]);
      toast({ title: isRTL ? 'تم إنشاء الفاتورة' : 'Invoice created successfully' });
    }
    setSelectedInvoice(null);
    setIsAddInvoiceOpen(false);
  };

  const handleSavePayment = (data: any) => {
    const selectedInv = invoices.find(inv => inv.id === data.invoiceId);
    const newPayment: Payment = {
      ...data,
      id: selectedPayment?.id || generateId(),
      paymentNumber: selectedPayment?.paymentNumber || `PAY-${new Date().getFullYear()}-${String(payments.length + 1).padStart(3, '0')}`,
      invoiceNumber: selectedInv?.invoiceNumber || '',
      buyerId: selectedInv?.buyerId || '',
      buyerName: selectedInv?.buyerName || '',
      status: 'pending',
      createdBy: 'Current User',
      createdAt: selectedPayment?.createdAt || new Date().toISOString().split('T')[0],
    };
    
    if (selectedPayment) {
      setPayments(payments.map(p => p.id === selectedPayment.id ? newPayment : p));
      toast({ title: isRTL ? 'تم تحديث الدفعة' : 'Payment updated successfully' });
    } else {
      setPayments([...payments, newPayment]);
      toast({ title: isRTL ? 'تم إنشاء الدفعة' : 'Payment created successfully' });
    }
    setSelectedPayment(null);
    setIsAddPaymentOpen(false);
  };

  const handleSavePriceList = (data: any) => {
    const newPriceList: PriceList = {
      ...data,
      id: selectedPriceList?.id || generateId(),
      status: 'active',
      createdBy: 'Current User',
      createdAt: selectedPriceList?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    if (selectedPriceList) {
      setPriceLists(priceLists.map(pl => pl.id === selectedPriceList.id ? newPriceList : pl));
      toast({ title: isRTL ? 'تم تحديث قائمة الأسعار' : 'Price List updated successfully' });
    } else {
      setPriceLists([...priceLists, newPriceList]);
      toast({ title: isRTL ? 'تم إنشاء قائمة الأسعار' : 'Price List created successfully' });
    }
    setSelectedPriceList(null);
    setIsAddPriceListOpen(false);
  };

  const handleSaveReturn = (data: any) => {
    const newReturn: SalesReturn = {
      ...data,
      id: selectedReturn?.id || generateId(),
      returnNumber: selectedReturn?.returnNumber || `RET-${new Date().getFullYear()}-${String(salesReturns.length + 1).padStart(3, '0')}`,
      salesOrderNumber: salesOrders.find(so => so.id === data.salesOrderId)?.orderNumber || '',
      status: 'pending',
      createdAt: selectedReturn?.createdAt || new Date().toISOString().split('T')[0],
    };
    
    if (selectedReturn) {
      setSalesReturns(salesReturns.map(r => r.id === selectedReturn.id ? newReturn : r));
      toast({ title: isRTL ? 'تم تحديث الإرجاع' : 'Return updated successfully' });
    } else {
      setSalesReturns([...salesReturns, newReturn]);
      toast({ title: isRTL ? 'تم إنشاء الإرجاع' : 'Return created successfully' });
    }
    setSelectedReturn(null);
    setIsAddReturnOpen(false);
  };

  const orderColumns: Column<SalesOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order #',
      headerAr: 'رقم الطلب',
      render: (item) => <span className="font-mono font-medium">{item.orderNumber}</span>
    },
    {
      key: 'buyer',
      header: 'Buyer',
      headerAr: 'المشتر',
      render: (item) => item.buyerName || '-',
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      headerAr: 'تاريخ الطلب',
    },
    {
      key: 'requiredDate',
      header: 'Required Date',
      headerAr: 'التاريخ المطلوب',
    },
    {
      key: 'items',
      header: 'Items',
      headerAr: 'المنتجات',
      render: (item) => item.items.length
    },
    {
      key: 'total',
      header: 'Total',
      headerAr: 'الإجمالي',
      render: (item) => `$${item.total.toLocaleString()}`
    },
    {
      key: 'production',
      header: 'Production',
      headerAr: 'الإنتاج',
      render: (item) => {
        const totalQty = item.items.reduce((sum, i) => sum + i.quantity, 0);
        const producedQty = item.items.reduce((sum, i) => {
          const itemProduced = i.sizeBreakdown?.reduce((s, sb) => s + sb.producedQuantity, 0) || 0;
          return sum + itemProduced;
        }, 0);
        const pct = totalQty > 0 ? Math.round((producedQty / totalQty) * 100) : 0;
        return (
          <div className="w-20">
            <Progress value={pct} className="h-2" />
            <span className="text-xs text-muted-foreground">{pct}%</span>
          </div>
        );
      }
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status} />
    },
  ];

  const customerColumns: Column<Customer>[] = [
    {
      key: 'code',
      header: 'Code',
      headerAr: 'الكود',
      render: (item) => <span className="font-mono text-sm">{item.code}</span>
    },
    {
      key: 'name',
      header: 'Customer Name',
      headerAr: 'اسم العميل',
      render: (item) => (
        <div>
          <p className="font-medium">{getCustomerName(item, i18n.language)}</p>
          <p className="text-sm text-muted-foreground">{item.country}</p>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      headerAr: 'النوع',
      render: (item) => <StatusBadge status={item.type} />
    },
    {
      key: 'contactPerson',
      header: 'Contact',
      headerAr: 'جهة الاتصال',
    },
    {
      key: 'creditLimit',
      header: 'Credit Limit',
      headerAr: 'حد الائتمان',
      render: (item) => `$${item.creditLimit.toLocaleString()}`
    },
    {
      key: 'currentBalance',
      header: 'Balance',
      headerAr: 'الرصيد',
      render: (item) => (
        <span className={item.currentBalance > item.creditLimit * 0.8 ? 'text-red-500 font-medium' : ''}>
          ${item.currentBalance.toLocaleString()}
        </span>
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
        icon={TrendingUp}
        title="Sales & Export Management"
        titleAr="إدارة المبيعات والتصدير"
        subtitle="Buyers, Contracts, Orders, Shipping, Export Documentation"
        subtitleAr="المشترون، العقود، الطلبات، الشحن، وثائق التصدير"
        colorGradient="from-pink-500 to-pink-600"
        actionLabel="New Order"
        actionLabelAr="طلب جديد"
        onAction={() => setIsAddOrderOpen(true)}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Revenue (YTD)"
          titleAr="إجمالي الإيرادات (السنة)"
          value={`$${(totalRevenue / 1000).toFixed(0)}K`}
          change={15}
          changeType="increase"
          icon={DollarSign}
          iconColor="text-green-500"
        />
        <StatCard
          title="Active Customers"
          titleAr="العملاء النشطين"
          value={mockCustomers.filter(c => c.status === 'active').length}
          icon={Users}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Pending Orders"
          titleAr="الطلبات المعلقة"
          value={pendingOrders}
          icon={ShoppingBag}
          iconColor="text-orange-500"
        />
        <StatCard
          title="Avg. Order Value"
          titleAr="متوسط قيمة الطلب"
          value={`$${avgOrderValue.toLocaleString()}`}
          change={8}
          changeType="increase"
          icon={TrendingUp}
          iconColor="text-pink-500"
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h3 className="text-base font-bold mb-4" style={{ fontSize: '16px' }}>
          {isRTL ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
        </h3>
        <div className="flex items-end gap-2 h-48">
          {[65, 78, 82, 70, 95, 88, 92, 75, 85, 90, 98, 105].map((value, idx) => {
            const monthLabels = isRTL 
              ? ['د', 'ن', 'و', 'س', 'أ', 'ج', 'ج', 'م', 'أ', 'م', 'ف', 'ي']
              : ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
            const monthNames = isRTL
              ? ['ديسمبر', 'نوفمبر', 'أكتوبر', 'سبتمبر', 'أغسطس', 'يوليو', 'يونيو', 'مايو', 'أبريل', 'مارس', 'فبراير', 'يناير']
              : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            return (
              <div key={idx} className="flex-1 flex flex-col items-center group relative">
                <div
                  className="w-full bg-primary/80 rounded-t hover:bg-primary transition-colors cursor-pointer"
                  style={{ height: `${(value / 105) * 100}%` }}
                  title={`${monthNames[idx]}: ${formatCurrency(convertToDisplay(value * 1000), displayCurrency)}`}
                />
                <span 
                  className="text-base text-muted-foreground mt-2 font-medium" 
                  style={{ fontSize: '16px' }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {monthLabels[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions - Mega Menu */}
      <div className="mb-6">
        <NavigationMenu>
          <NavigationMenuList className="flex-wrap gap-2">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="gap-2">
                <Plus className="w-4 h-4" />
                {isRTL ? 'إضافة جديد' : 'Add New'}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[700px] grid-cols-3 gap-3 p-4">
                  <Link to="#" onClick={(e) => { e.preventDefault(); setIsAddOrderOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <ShoppingBag className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'طلب مبيعات' : 'Sales Order'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إنشاء طلب مبيعات جديد' : 'Create new sales order'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); setIsAddBuyerOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <Users className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'مشتر جديد' : 'New Buyer'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إضافة مشتر جديد' : 'Add new buyer'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); setIsAddContractOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <FileText className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'عقد مبيعات' : 'Sales Contract'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إنشاء عقد مبيعات' : 'Create sales contract'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); setIsAddQuotationOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <FileCheck className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'عرض أسعار' : 'Quotation'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إنشاء عرض أسعار' : 'Create quotation'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); setIsAddInvoiceOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <Receipt className="w-5 h-5 text-indigo-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'فاتورة' : 'Invoice'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إنشاء فاتورة' : 'Create invoice'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); setIsAddShipmentOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <Ship className="w-5 h-5 text-cyan-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'شحنة' : 'Shipment'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إنشاء شحنة جديدة' : 'Create shipment'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); setIsAddPriceListOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <Percent className="w-5 h-5 text-pink-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'قائمة أسعار' : 'Price List'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إدارة قوائم الأسعار' : 'Manage price lists'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); setIsAddPaymentOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <CreditCard className="w-5 h-5 text-teal-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'دفعة' : 'Payment'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'تسجيل دفعة' : 'Record payment'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); setIsAddReturnOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <RotateCcw className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'إرجاع' : 'Return'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'تسجيل إرجاع' : 'Record return'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <Target className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'هدف مبيعات' : 'Sales Target'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'تعيين هدف مبيعات' : 'Set sales target'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <Award className="w-5 h-5 text-violet-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'عمولة' : 'Commission'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'حساب العمولات' : 'Calculate commission'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'وثيقة تصدير' : 'Export Doc'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إنشاء وثيقة تصدير' : 'Create export document'}</div>
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">

        <TabsContent value="orders">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isRTL ? 'طلبات المبيعات' : 'Sales Orders'}</h3>
              <Button onClick={() => setIsAddOrderOpen(true)}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'طلب جديد' : 'New Order'}
              </Button>
            </div>
            <DataTable
              data={salesOrders}
              columns={orderColumns}
              searchKey="orderNumber"
              searchPlaceholder="Search orders..."
              searchPlaceholderAr="بحث في الطلبات..."
            />
          </div>
        </TabsContent>

        <TabsContent value="buyers">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isRTL ? 'المشترون' : 'Buyers'}</h3>
              <Button onClick={() => setIsAddBuyerOpen(true)}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'مشتر جديد' : 'New Buyer'}
              </Button>
            </div>
            <DataTable
              data={buyers}
              columns={[
                { key: 'code', header: 'Code', headerAr: 'الكود', render: (item) => <span className="font-mono text-sm font-medium">{item.code}</span> },
                { key: 'name', header: 'Buyer', headerAr: 'المشتر', render: (item) => <div><p className="font-medium">{getBuyerName(item, i18n.language)}</p><p className="text-xs text-muted-foreground">{item.companyName}</p></div> },
                { key: 'type', header: 'Type', headerAr: 'النوع', render: (item) => <Badge variant="outline">{item.type}</Badge> },
                { key: 'country', header: 'Country', headerAr: 'الدولة' },
                { key: 'creditLimit', header: 'Credit Limit', headerAr: 'حد الائتمان', render: (item) => formatCurrency(convertToDisplay(item.creditLimit), displayCurrency) },
                { key: 'currentBalance', header: 'Balance', headerAr: 'الرصيد', render: (item) => formatCurrency(convertToDisplay(item.currentBalance), displayCurrency) },
                { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status} /> },
              ]}
              searchKey="name"
              searchPlaceholder={isRTL ? 'البحث في المشترين...' : 'Search buyers...'}
              searchPlaceholderAr="البحث في المشترين..."
            />
          </div>
        </TabsContent>

        <TabsContent value="contracts">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isRTL ? 'عقود المبيعات' : 'Sales Contracts'}</h3>
              <Button onClick={() => setIsAddContractOpen(true)}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'عقد جديد' : 'New Contract'}
              </Button>
            </div>
            <DataTable
              data={salesContracts}
              columns={[
                { key: 'contractNumber', header: 'Contract #', headerAr: 'رقم العقد', render: (item) => <span className="font-mono font-medium">{item.contractNumber}</span> },
                { key: 'buyerName', header: 'Buyer', headerAr: 'المشتر' },
                { key: 'contractDate', header: 'Contract Date', headerAr: 'تاريخ العقد' },
                { key: 'validTo', header: 'Valid To', headerAr: 'صالح حتى' },
                { key: 'totalQuantity', header: 'Total Qty', headerAr: 'الكمية الإجمالية', render: (item) => item.totalQuantity.toLocaleString() },
                { key: 'unitPrice', header: 'Unit Price', headerAr: 'سعر الوحدة', render: (item) => formatCurrency(convertToDisplay(item.unitPrice), item.currency) },
                { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status} /> },
              ]}
              searchKey="contractNumber"
              searchPlaceholder={isRTL ? 'البحث في العقود...' : 'Search contracts...'}
              searchPlaceholderAr="البحث في العقود..."
            />
          </div>
        </TabsContent>

        <TabsContent value="shipments">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isRTL ? 'الشحنات' : 'Shipments'}</h3>
              <Button onClick={() => setIsAddShipmentOpen(true)}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'شحنة جديدة' : 'New Shipment'}
              </Button>
            </div>
            <DataTable
              data={shipments}
              columns={[
                { key: 'shipmentNumber', header: 'Shipment #', headerAr: 'رقم الشحنة', render: (item) => <span className="font-mono font-medium">{item.shipmentNumber}</span> },
                { key: 'buyerName', header: 'Buyer', headerAr: 'المشتر' },
                { key: 'type', header: 'Type', headerAr: 'النوع', render: (item) => <Badge variant="outline">{item.type}</Badge> },
                { key: 'origin', header: 'Origin', headerAr: 'المنشأ' },
                { key: 'destination', header: 'Destination', headerAr: 'الوجهة' },
                { key: 'eta', header: 'ETA', headerAr: 'الوصول المتوقع' },
                { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status} /> },
              ]}
              searchKey="shipmentNumber"
              searchPlaceholder={isRTL ? 'البحث في الشحنات...' : 'Search shipments...'}
              searchPlaceholderAr="البحث في الشحنات..."
            />
          </div>
        </TabsContent>

        {/* ==================== QUOTATIONS TAB ==================== */}
        <TabsContent value="quotations">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                {isRTL ? 'عروض الأسعار' : 'Quotations'}
              </h3>
              <Button onClick={() => setIsAddQuotationOpen(true)}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'عرض أسعار جديد' : 'New Quotation'}
              </Button>
            </div>
            <DataTable
              data={quotations}
              columns={[
                { key: 'quotationNumber', header: 'Quotation #', headerAr: 'رقم العرض', render: (item) => <span className="font-mono font-medium">{item.quotationNumber}</span> },
                { key: 'buyerName', header: 'Buyer', headerAr: 'المشتر' },
                { key: 'quotationDate', header: 'Date', headerAr: 'التاريخ' },
                { key: 'validUntil', header: 'Valid Until', headerAr: 'صالح حتى' },
                { key: 'total', header: 'Total', headerAr: 'الإجمالي', render: (item) => formatCurrency(convertToDisplay(item.total), item.currency) },
                { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status} /> },
              ]}
              searchKey="quotationNumber"
            />
          </div>
        </TabsContent>

        {/* ==================== INVOICES TAB ==================== */}
        <TabsContent value="invoices">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                {isRTL ? 'الفواتير' : 'Invoices'}
              </h3>
              <Button onClick={() => setIsAddInvoiceOpen(true)}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'فاتورة جديدة' : 'New Invoice'}
              </Button>
            </div>
            <DataTable
              data={invoices}
              columns={[
                { key: 'invoiceNumber', header: 'Invoice #', headerAr: 'رقم الفاتورة', render: (item) => <span className="font-mono font-medium">{item.invoiceNumber}</span> },
                { key: 'buyerName', header: 'Buyer', headerAr: 'المشتر' },
                { key: 'invoiceDate', header: 'Invoice Date', headerAr: 'تاريخ الفاتورة' },
                { key: 'dueDate', header: 'Due Date', headerAr: 'تاريخ الاستحقاق' },
                { key: 'total', header: 'Total', headerAr: 'الإجمالي', render: (item) => formatCurrency(convertToDisplay(item.total), item.currency) },
                { key: 'outstandingAmount', header: 'Outstanding', headerAr: 'المستحق', render: (item) => (
                  <span className={item.outstandingAmount > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                    {formatCurrency(convertToDisplay(item.outstandingAmount), item.currency)}
                  </span>
                )},
                { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status} /> },
              ]}
              searchKey="invoiceNumber"
            />
          </div>
        </TabsContent>

        {/* ==================== PAYMENTS TAB ==================== */}
        <TabsContent value="payments">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {isRTL ? 'المدفوعات' : 'Payments'}
              </h3>
              <Button onClick={() => setIsAddPaymentOpen(true)}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'دفعة جديدة' : 'New Payment'}
              </Button>
            </div>
            <DataTable
              data={payments}
              columns={[
                { key: 'paymentNumber', header: 'Payment #', headerAr: 'رقم الدفعة', render: (item) => <span className="font-mono font-medium">{item.paymentNumber}</span> },
                { key: 'invoiceNumber', header: 'Invoice', headerAr: 'الفاتورة' },
                { key: 'buyerName', header: 'Buyer', headerAr: 'المشتر' },
                { key: 'paymentDate', header: 'Payment Date', headerAr: 'تاريخ الدفعة' },
                { key: 'amount', header: 'Amount', headerAr: 'المبلغ', render: (item) => formatCurrency(convertToDisplay(item.amount), item.currency) },
                { key: 'paymentMethod', header: 'Method', headerAr: 'الطريقة', render: (item) => <Badge variant="outline">{item.paymentMethod}</Badge> },
                { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status} /> },
              ]}
              searchKey="paymentNumber"
            />
          </div>
        </TabsContent>

        {/* ==================== PRICING TAB ==================== */}
        <TabsContent value="pricing">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Percent className="w-5 h-5" />
                {isRTL ? 'قوائم الأسعار' : 'Price Lists'}
              </h3>
              <Button onClick={() => setIsAddPriceListOpen(true)}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'قائمة أسعار جديدة' : 'New Price List'}
              </Button>
            </div>
            <div className="space-y-4">
              {priceLists.map(list => (
                <div key={list.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-medium">{list.code}</span>
                        <Badge>{list.type}</Badge>
                        <StatusBadge status={list.status} />
                      </div>
                      <h4 className="text-lg font-medium">{isRTL ? list.nameAr : list.name}</h4>
                      <p className="text-sm text-muted-foreground">{isRTL ? list.descriptionAr : list.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{list.validFrom} {list.validTo && `- ${list.validTo}`}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'العملة' : 'Currency'}</p>
                      <p className="font-medium">{list.currency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'المنتجات' : 'Products'}</p>
                      <p className="font-medium">{list.items.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'قواعد الخصم' : 'Discount Rules'}</p>
                      <p className="font-medium">{list.discountRules.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'المشترين المطبقين' : 'Applicable Buyers'}</p>
                      <p className="font-medium">{list.applicableBuyers.length}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== RETURNS TAB ==================== */}
        <TabsContent value="returns">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                {isRTL ? 'المرتجعات والاسترداد' : 'Returns & Refunds'}
              </h3>
              <Button onClick={() => setIsAddReturnOpen(true)}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'إرجاع جديد' : 'New Return'}
              </Button>
            </div>
            <DataTable
              data={salesReturns}
              columns={[
                { key: 'returnNumber', header: 'Return #', headerAr: 'رقم الإرجاع', render: (item) => <span className="font-mono font-medium">{item.returnNumber}</span> },
                { key: 'salesOrderNumber', header: 'Sales Order', headerAr: 'طلب المبيعات' },
                { key: 'buyerName', header: 'Buyer', headerAr: 'المشتر' },
                { key: 'returnDate', header: 'Return Date', headerAr: 'تاريخ الإرجاع' },
                { key: 'returnType', header: 'Type', headerAr: 'النوع', render: (item) => <Badge variant="outline">{item.returnType}</Badge> },
                { key: 'refundAmount', header: 'Refund Amount', headerAr: 'مبلغ الاسترداد', render: (item) => formatCurrency(convertToDisplay(item.refundAmount), item.currency) },
                { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status} /> },
              ]}
              searchKey="returnNumber"
            />
          </div>
        </TabsContent>

        {/* ==================== CREDIT MANAGEMENT TAB ==================== */}
        <TabsContent value="credit">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {isRTL ? 'إدارة الائتمان' : 'Credit Management'}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">{isRTL ? 'إجمالي حد الائتمان' : 'Total Credit Limit'}</p>
                  <p className="text-2xl font-bold">{formatCurrency(convertToDisplay(buyers.reduce((sum, b) => sum + b.creditLimit, 0)), displayCurrency)}</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">{isRTL ? 'إجمالي الرصيد المستخدم' : 'Total Balance Used'}</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(convertToDisplay(buyers.reduce((sum, b) => sum + b.currentBalance, 0)), displayCurrency)}</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">{isRTL ? 'متوسط معدل الدفع في الوقت' : 'Avg On-Time Payment Rate'}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(buyers.reduce((sum, b) => sum + b.onTimePaymentRate, 0) / buyers.length).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">{isRTL ? 'إشعارات الائتمان' : 'Credit Notes'}</h4>
                <DataTable
                  data={creditNotes}
                  columns={[
                    { key: 'creditNoteNumber', header: 'Credit Note #', headerAr: 'رقم إشعار الائتمان', render: (item) => <span className="font-mono font-medium">{item.creditNoteNumber}</span> },
                    { key: 'invoiceNumber', header: 'Invoice', headerAr: 'الفاتورة' },
                    { key: 'buyerName', header: 'Buyer', headerAr: 'المشتر' },
                    { key: 'issueDate', header: 'Issue Date', headerAr: 'تاريخ الإصدار' },
                    { key: 'totalAmount', header: 'Amount', headerAr: 'المبلغ', render: (item) => formatCurrency(convertToDisplay(item.totalAmount), item.currency) },
                    { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status} /> },
                  ]}
                  searchKey="creditNoteNumber"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ==================== COMMISSIONS TAB ==================== */}
        <TabsContent value="commissions">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Award className="w-5 h-5" />
                {isRTL ? 'العمولات' : 'Commissions'}
              </h3>
              <Button>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'حساب عمولة' : 'Calculate Commission'}
              </Button>
            </div>
            <DataTable
              data={salesCommissions}
              columns={[
                { key: 'commissionNumber', header: 'Commission #', headerAr: 'رقم العمولة', render: (item) => <span className="font-mono font-medium">{item.commissionNumber}</span> },
                { key: 'salesPersonName', header: 'Sales Person', headerAr: 'مندوب المبيعات' },
                { key: 'period', header: 'Period', headerAr: 'الفترة', render: (item) => `${item.period.startDate} - ${item.period.endDate}` },
                { key: 'totalSales', header: 'Total Sales', headerAr: 'إجمالي المبيعات', render: (item) => formatCurrency(convertToDisplay(item.totalSales), item.currency) },
                { key: 'commissionRate', header: 'Rate', headerAr: 'المعدل', render: (item) => `${item.commissionRate}%` },
                { key: 'commissionAmount', header: 'Commission', headerAr: 'العمولة', render: (item) => formatCurrency(convertToDisplay(item.commissionAmount), item.currency) },
                { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status} /> },
              ]}
              searchKey="commissionNumber"
            />
          </div>
        </TabsContent>

        {/* ==================== TARGETS TAB ==================== */}
        <TabsContent value="targets">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5" />
                {isRTL ? 'أهداف المبيعات' : 'Sales Targets'}
              </h3>
              <Button>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'هدف جديد' : 'New Target'}
              </Button>
            </div>
            <div className="space-y-4">
              {salesTargets.map(target => (
                <div key={target.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-medium">{target.targetNumber}</span>
                        <Badge>{target.targetType}</Badge>
                        <StatusBadge status={target.status} />
                      </div>
                      <h4 className="text-lg font-medium">{target.salesPersonName || target.teamName}</h4>
                      <p className="text-sm text-muted-foreground">{target.period.startDate} - {target.period.endDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{isRTL ? 'معدل الإنجاز' : 'Achievement'}</p>
                      <p className={`text-2xl font-bold ${target.achievementRate >= 100 ? 'text-green-600' : target.achievementRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {target.achievementRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'الهدف' : 'Target'}</p>
                      <p className="text-lg font-medium">{formatCurrency(convertToDisplay(target.targetValue), target.currency || displayCurrency)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'القيمة الحالية' : 'Current Value'}</p>
                      <p className="text-lg font-medium">{formatCurrency(convertToDisplay(target.currentValue), target.currency || displayCurrency)}</p>
                    </div>
                  </div>
                  <Progress value={target.achievementRate} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== PIPELINE TAB ==================== */}
        <TabsContent value="pipeline">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {isRTL ? 'مسار المبيعات' : 'Sales Pipeline'}
              </h3>
              <Button>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'فرصة جديدة' : 'New Opportunity'}
              </Button>
            </div>
            <div className="space-y-4">
              {salesPipelines.map(opp => {
                const stageColors: Record<string, string> = {
                  lead: 'bg-gray-100 text-gray-800',
                  qualification: 'bg-blue-100 text-blue-800',
                  proposal: 'bg-yellow-100 text-yellow-800',
                  negotiation: 'bg-orange-100 text-orange-800',
                  closed_won: 'bg-green-100 text-green-800',
                  closed_lost: 'bg-red-100 text-red-800',
                };
                return (
                  <div key={opp.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-medium">{opp.opportunityNumber}</span>
                          <Badge className={stageColors[opp.stage]}>{opp.stage}</Badge>
                          <Badge variant="outline">{opp.probability}%</Badge>
                        </div>
                        <h4 className="text-lg font-medium">{isRTL ? opp.opportunityNameAr : opp.opportunityName}</h4>
                        <p className="text-sm text-muted-foreground">{opp.buyerName} • {opp.salesPersonName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{isRTL ? 'القيمة المقدرة' : 'Estimated Value'}</p>
                        <p className="text-xl font-bold">{formatCurrency(convertToDisplay(opp.estimatedValue), opp.currency)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">{isRTL ? 'الاحتمالية' : 'Probability'}</p>
                        <Progress value={opp.probability} className="h-2 mt-1" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{isRTL ? 'تاريخ الإغلاق المتوقع' : 'Est. Close Date'}</p>
                        <p className="font-medium">{opp.estimatedCloseDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{isRTL ? 'المصدر' : 'Source'}</p>
                        <Badge variant="outline">{opp.source}</Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ==================== FORECAST TAB ==================== */}
        <TabsContent value="forecast">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                {isRTL ? 'التنبؤ بالمبيعات' : 'Sales Forecasting'}
              </h3>
              <Button>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'تنبؤ جديد' : 'New Forecast'}
              </Button>
            </div>
            <div className="space-y-4">
              {salesForecasts.map(forecast => (
                <div key={forecast.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-medium">{forecast.forecastNumber}</span>
                        <Badge>{forecast.forecastType}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{forecast.period.startDate} - {forecast.period.endDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{isRTL ? 'مستوى الثقة' : 'Confidence'}</p>
                      <p className="text-xl font-bold">{forecast.confidenceLevel}%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'الإيرادات المتوقعة' : 'Forecasted Revenue'}</p>
                      <p className="text-2xl font-bold">{formatCurrency(convertToDisplay(forecast.forecastedRevenue), forecast.currency)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'الكمية المتوقعة' : 'Forecasted Quantity'}</p>
                      <p className="text-2xl font-bold">{forecast.forecastedQuantity.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">{isRTL ? 'العوامل المؤثرة' : 'Influencing Factors'}</p>
                    <div className="grid grid-cols-4 gap-4">
                      {Object.entries(forecast.factors).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-muted-foreground capitalize">{key}</p>
                          <Progress value={value} className="h-2 mt-1" />
                          <p className="text-xs mt-1">{value}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== EXPORT DOCS TAB ==================== */}
        <TabsContent value="export">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {isRTL ? 'وثائق التصدير' : 'Export Documentation'}
              </h3>
              <Button>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'وثيقة جديدة' : 'New Document'}
              </Button>
            </div>
            <DataTable
              data={exportDocuments}
              columns={[
                { key: 'documentNumber', header: 'Document #', headerAr: 'رقم الوثيقة', render: (item) => <span className="font-mono font-medium">{item.documentNumber}</span> },
                { key: 'documentType', header: 'Type', headerAr: 'النوع', render: (item) => <Badge variant="outline">{item.documentType}</Badge> },
                { key: 'salesOrderNumber', header: 'Sales Order', headerAr: 'طلب المبيعات' },
                { key: 'buyerName', header: 'Buyer', headerAr: 'المشتر' },
                { key: 'issueDate', header: 'Issue Date', headerAr: 'تاريخ الإصدار' },
                { key: 'expiryDate', header: 'Expiry Date', headerAr: 'تاريخ الانتهاء', render: (item) => item.expiryDate || '-' },
                { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status} /> },
              ]}
              searchKey="documentNumber"
            />
          </div>
        </TabsContent>

        {/* ==================== REPORTS TAB ==================== */}
        <TabsContent value="reports">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {isRTL ? 'تقارير المبيعات' : 'Sales Reports'}
              </h3>
              <Button variant="outline">
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'تقرير جديد' : 'New Report'}
              </Button>
            </div>
            <div className="space-y-4">
              {salesReports.map(report => (
                <div key={report.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-medium">{report.reportNumber}</span>
                        <Badge>{report.reportType}</Badge>
                        {report.status === 'published' && <Badge className="bg-green-100 text-green-800">{isRTL ? 'منشور' : 'Published'}</Badge>}
                      </div>
                      <h4 className="text-lg font-medium">{isRTL ? report.titleAr : report.title}</h4>
                      <p className="text-sm text-muted-foreground">{report.period.startDate} - {report.period.endDate}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-muted/30 rounded p-3">
                      <p className="text-xs text-muted-foreground">{isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}</p>
                      <p className="text-xl font-bold">{formatCurrency(convertToDisplay(report.summary.totalRevenue), report.currency)}</p>
                    </div>
                    <div className="bg-blue-50 rounded p-3">
                      <p className="text-xs text-blue-600">{isRTL ? 'إجمالي الطلبات' : 'Total Orders'}</p>
                      <p className="text-xl font-bold text-blue-700">{report.summary.totalOrders}</p>
                    </div>
                    <div className="bg-green-50 rounded p-3">
                      <p className="text-xs text-green-600">{isRTL ? 'إجمالي العملاء' : 'Total Customers'}</p>
                      <p className="text-xl font-bold text-green-700">{report.summary.totalCustomers}</p>
                    </div>
                    <div className="bg-purple-50 rounded p-3">
                      <p className="text-xs text-purple-600">{isRTL ? 'متوسط قيمة الطلب' : 'Avg Order Value'}</p>
                      <p className="text-xl font-bold text-purple-700">{formatCurrency(convertToDisplay(report.summary.averageOrderValue), report.currency)}</p>
                    </div>
                    <div className="bg-orange-50 rounded p-3">
                      <p className="text-xs text-orange-600">{isRTL ? 'معدل النمو' : 'Growth Rate'}</p>
                      <p className="text-xl font-bold text-orange-700">{report.summary.growthRate}%</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                    {isRTL ? 'تم إنشاؤه بواسطة' : 'Generated by'} {report.generatedByName} • {new Date(report.generatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Forms */}
      <BuyerForm
        open={isAddBuyerOpen || isEditBuyerOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddBuyerOpen(false);
            setIsEditBuyerOpen(false);
            setSelectedBuyer(null);
          }
        }}
        buyer={selectedBuyer}
        onSave={(data) => {
          toast({ title: isRTL ? (selectedBuyer ? 'تم تحديث المشتر' : 'تم إنشاء المشتر') : (selectedBuyer ? 'Buyer updated' : 'Buyer created') });
          setIsAddBuyerOpen(false);
          setIsEditBuyerOpen(false);
          setSelectedBuyer(null);
        }}
        isRTL={isRTL}
      />

      <SalesOrderForm
        open={isAddOrderOpen || isEditOrderOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOrderOpen(false);
            setIsEditOrderOpen(false);
            setSelectedOrder(null);
          }
        }}
        order={selectedOrder}
        buyers={buyers}
        onSave={handleSaveOrder}
        isRTL={isRTL}
      />

      <SalesContractForm
        open={isAddContractOpen || isEditContractOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddContractOpen(false);
            setIsEditContractOpen(false);
            setSelectedContract(null);
          }
        }}
        contract={selectedContract}
        buyers={buyers}
        onSave={(data) => {
          toast({ title: isRTL ? (selectedContract ? 'تم تحديث العقد' : 'تم إنشاء العقد') : (selectedContract ? 'Contract updated' : 'Contract created') });
          setIsAddContractOpen(false);
          setIsEditContractOpen(false);
          setSelectedContract(null);
        }}
        isRTL={isRTL}
      />

      <ShipmentForm
        open={isAddShipmentOpen || isEditShipmentOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddShipmentOpen(false);
            setIsEditShipmentOpen(false);
            setSelectedShipment(null);
          }
        }}
        shipment={selectedShipment}
        buyers={buyers}
        salesOrders={salesOrders}
        onSave={(data) => {
          toast({ title: isRTL ? (selectedShipment ? 'تم تحديث الشحنة' : 'تم إنشاء الشحنة') : (selectedShipment ? 'Shipment updated' : 'Shipment created') });
          setIsAddShipmentOpen(false);
          setIsEditShipmentOpen(false);
          setSelectedShipment(null);
        }}
        isRTL={isRTL}
      />

      <QuotationForm
        open={isAddQuotationOpen}
        onOpenChange={(open) => {
          setIsAddQuotationOpen(open);
          if (!open) setSelectedQuotation(null);
        }}
        quotation={selectedQuotation}
        buyers={buyers}
        onSave={handleSaveQuotation}
        isRTL={isRTL}
      />

      <InvoiceForm
        open={isAddInvoiceOpen}
        onOpenChange={(open) => {
          setIsAddInvoiceOpen(open);
          if (!open) setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        salesOrders={salesOrders}
        onSave={handleSaveInvoice}
        isRTL={isRTL}
      />

      <PaymentForm
        open={isAddPaymentOpen}
        onOpenChange={(open) => {
          setIsAddPaymentOpen(open);
          if (!open) setSelectedPayment(null);
        }}
        payment={selectedPayment}
        invoices={invoices}
        onSave={handleSavePayment}
        isRTL={isRTL}
      />

      <PriceListForm
        open={isAddPriceListOpen}
        onOpenChange={(open) => {
          setIsAddPriceListOpen(open);
          if (!open) setSelectedPriceList(null);
        }}
        priceList={selectedPriceList}
        buyers={buyers}
        onSave={handleSavePriceList}
        isRTL={isRTL}
      />

      <ReturnForm
        open={isAddReturnOpen}
        onOpenChange={(open) => {
          setIsAddReturnOpen(open);
          if (!open) setSelectedReturn(null);
        }}
        returnItem={selectedReturn}
        salesOrders={salesOrders}
        onSave={handleSaveReturn}
        isRTL={isRTL}
      />
    </ModuleLayout>
  );
}
