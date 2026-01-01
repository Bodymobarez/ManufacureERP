// ==================== SALES & EXPORT COMPREHENSIVE DATA ====================

import type { BaseEntity } from '@shared/types';

export interface Buyer extends BaseEntity {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  // Company Details
  companyName: string;
  companyNameAr: string;
  registrationNumber?: string;
  taxId?: string;
  country: string;
  currency: string; // Primary currency
  // Contact
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  website?: string;
  // Classification
  type: 'wholesale' | 'retail' | 'export';
  status: 'active' | 'inactive' | 'suspended';
  // Financial
  creditLimit: number;
  currentBalance: number;
  paymentTerms: string; // Net 30, Net 45, etc.
  // Performance
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  onTimePaymentRate: number; // percentage
  // Dates
  createdAt: string;
  updatedAt: string;
  lastOrderDate?: string;
}

export interface SalesContract extends BaseEntity {
  id: string;
  contractNumber: string;
  buyerId: string;
  buyerName: string;
  buyerCode: string;
  contractDate: string;
  validFrom: string;
  validTo: string;
  status: 'active' | 'expired' | 'terminated';
  // Terms
  totalQuantity: number;
  unitPrice: number;
  currency: string;
  priceAdjustmentClause?: string;
  deliverySchedule: DeliveryScheduleItem[];
  incoterms: string;
  paymentTerms: string;
  // Penalties & Clauses
  lateDeliveryPenalty?: number; // percentage
  qualityPenalty?: number; // percentage
  otherClauses?: string;
  otherClausesAr?: string;
  // Documents
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryScheduleItem {
  period: string; // e.g., "Q1 2024"
  quantity: number;
  deliveryDate: string;
  status: 'pending' | 'in_production' | 'ready' | 'shipped' | 'delivered';
}

export interface SalesOrder extends BaseEntity {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerCode: string;
  contractId?: string;
  contractNumber?: string;
  status: 'draft' | 'confirmed' | 'in_production' | 'ready' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  requiredDate: string;
  shippedDate?: string;
  deliveredDate?: string;
  // Order Breakdown
  items: SalesOrderItem[];
  // Pricing
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  total: number;
  currency: string;
  // Shipping
  shippingAddress: string;
  shippingMethod?: string;
  trackingNumber?: string;
  // Export Documents
  packingList?: ExportDocument;
  commercialInvoice?: ExportDocument;
  certificateOfOrigin?: ExportDocument;
  exportLicense?: ExportDocument;
  // Production Allocation
  productionOrderIds: string[];
  // Notes
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrderItem {
  id: string;
  styleId: string;
  styleNumber: string;
  styleName: string;
  styleNameAr: string;
  colorId: string;
  colorCode: string;
  colorName: string;
  colorNameAr: string;
  sizeBreakdown: SizeBreakdown[];
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  productionOrderId?: string;
  productionStatus?: 'not_started' | 'in_production' | 'completed';
}

export interface SizeBreakdown {
  size: string;
  quantity: number;
  producedQuantity: number;
}

export interface ExportDocument extends BaseEntity {
  id: string;
  documentType: 'packing_list' | 'commercial_invoice' | 'certificate_of_origin' | 'export_license' | 'other';
  documentNumber: string;
  issueDate: string;
  expiryDate?: string;
  documentUrl?: string;
  status: 'draft' | 'issued' | 'expired';
  issuedBy?: string;
  notes?: string;
}

export interface Shipment extends BaseEntity {
  id: string;
  shipmentNumber: string;
  salesOrderIds: string[];
  buyerId: string;
  buyerName: string;
  type: 'sea' | 'air' | 'road' | 'rail';
  status: 'planned' | 'packed' | 'in_transit' | 'delivered' | 'returned';
  origin: string;
  destination: string;
  shippingLine?: string;
  vesselName?: string;
  flightNumber?: string;
  bookingNumber?: string;
  containerNumbers: string[];
  etd: string; // Estimated Time of Departure
  eta: string; // Estimated Time of Arrival
  actualDeparture?: string;
  actualArrival?: string;
  freightCost: number;
  freightCurrency: string;
  insuranceCost: number;
  insuranceCurrency: string;
  customsStatus?: 'pending' | 'cleared' | 'held';
  trackingNumber?: string;
  documents: ExportDocument[];
  createdAt: string;
  updatedAt: string;
}

// BaseEntity is imported from shared/types

// ==================== MOCK DATA ====================

export const mockBuyers: Buyer[] = [
  {
    id: 'buyer-1',
    code: 'BUY-001',
    name: 'Fashion Retail Chain',
    nameAr: 'سلسلة تجزئة الأزياء',
    companyName: 'Fashion Retail Chain Inc.',
    companyNameAr: 'شركة سلسلة تجزئة الأزياء',
    country: 'USA',
    currency: 'USD',
    contactPerson: 'Emma Wilson',
    email: 'emma@fashionretail.com',
    phone: '+1 555 987 6543',
    address: '100 Fashion Ave',
    city: 'New York',
    type: 'wholesale',
    status: 'active',
    creditLimit: 500000,
    currentBalance: 125000,
    paymentTerms: 'Net 60',
    totalOrders: 45,
    totalRevenue: 2500000,
    avgOrderValue: 55555,
    onTimePaymentRate: 95,
    createdAt: '2021-01-01',
    updatedAt: '2024-03-20',
    lastOrderDate: '2024-03-15',
  },
  {
    id: 'buyer-2',
    code: 'BUY-002',
    name: 'European Style GmbH',
    nameAr: 'شركة الستايل الأوروبي',
    companyName: 'European Style GmbH',
    companyNameAr: 'شركة الستايل الأوروبي',
    country: 'Germany',
    currency: 'EUR',
    contactPerson: 'Hans Mueller',
    email: 'hans@europeanstyle.de',
    phone: '+49 30 1234 5678',
    address: '200 Mode Strasse',
    city: 'Berlin',
    type: 'export',
    status: 'active',
    creditLimit: 750000,
    currentBalance: 280000,
    paymentTerms: 'Net 45',
    totalOrders: 32,
    totalRevenue: 3200000,
    avgOrderValue: 100000,
    onTimePaymentRate: 98,
    createdAt: '2020-06-15',
    updatedAt: '2024-03-20',
    lastOrderDate: '2024-03-10',
  },
];

export const mockSalesContracts: SalesContract[] = [
  {
    id: 'contract-1',
    contractNumber: 'SC-2024-001',
    buyerId: 'buyer-1',
    buyerName: 'Fashion Retail Chain',
    buyerCode: 'BUY-001',
    contractDate: '2024-01-15',
    validFrom: '2024-01-15',
    validTo: '2024-12-31',
    status: 'active',
    totalQuantity: 50000,
    unitPrice: 15.00,
    currency: 'USD',
    deliverySchedule: [
      { period: 'Q1 2024', quantity: 15000, deliveryDate: '2024-03-31', status: 'in_production' },
      { period: 'Q2 2024', quantity: 15000, deliveryDate: '2024-06-30', status: 'pending' },
      { period: 'Q3 2024', quantity: 10000, deliveryDate: '2024-09-30', status: 'pending' },
      { period: 'Q4 2024', quantity: 10000, deliveryDate: '2024-12-31', status: 'pending' },
    ],
    incoterms: 'FOB',
    paymentTerms: 'Net 60',
    lateDeliveryPenalty: 2,
    qualityPenalty: 5,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
];

export const mockSalesOrders: SalesOrder[] = [
  {
    id: 'so-1',
    orderNumber: 'SO-2024-001',
    buyerId: 'buyer-1',
    buyerName: 'Fashion Retail Chain',
    buyerCode: 'BUY-001',
    contractId: 'contract-1',
    contractNumber: 'SC-2024-001',
    status: 'in_production',
    orderDate: '2024-02-15',
    requiredDate: '2024-04-01',
    items: [
      {
        id: 'soi-1',
        styleId: 'style-1',
        styleNumber: 'STY-2024-001',
        styleName: 'Classic T-Shirt',
        styleNameAr: 'تيشيرت كلاسيكي',
        colorId: 'c1',
        colorCode: 'WH',
        colorName: 'White',
        colorNameAr: 'أبيض',
        sizeBreakdown: [
          { size: 'S', quantity: 1000, producedQuantity: 800 },
          { size: 'M', quantity: 2000, producedQuantity: 1800 },
          { size: 'L', quantity: 1500, producedQuantity: 1200 },
          { size: 'XL', quantity: 500, producedQuantity: 400 },
        ],
        quantity: 5000,
        unitPrice: 15.00,
        discount: 5,
        total: 71250,
        productionOrderId: 'po-1',
        productionStatus: 'in_production',
      },
    ],
    subtotal: 75000,
    discount: 3750,
    tax: 9975,
    shippingCost: 500,
    total: 81725,
    currency: 'USD',
    shippingAddress: '100 Fashion Ave, New York, USA',
    productionOrderIds: ['po-1'],
    createdBy: 'emp-6',
    createdAt: '2024-02-15',
    updatedAt: '2024-03-20',
  },
];

export const mockShipments: Shipment[] = [
  {
    id: 'ship-1',
    shipmentNumber: 'SHIP-2024-001',
    salesOrderIds: ['so-2'],
    buyerId: 'buyer-2',
    buyerName: 'European Style GmbH',
    type: 'sea',
    status: 'in_transit',
    origin: 'Alexandria, Egypt',
    destination: 'Hamburg, Germany',
    shippingLine: 'Maersk Line',
    vesselName: 'MV Maersk Hamburg',
    bookingNumber: 'MAE-789012',
    containerNumbers: ['CONT-003', 'CONT-004'],
    etd: '2024-03-20',
    eta: '2024-04-15',
    actualDeparture: '2024-03-21',
    freightCost: 8000,
    freightCurrency: 'USD',
    insuranceCost: 500,
    insuranceCurrency: 'USD',
    customsStatus: 'cleared',
    trackingNumber: 'TRK-123456789',
    documents: [],
    createdAt: '2024-03-15',
    updatedAt: '2024-03-21',
  },
];

// ==================== NEW MOCK DATA ====================

export const mockQuotations: Quotation[] = [
  {
    id: 'quot-1',
    quotationNumber: 'QUOT-2024-001',
    buyerId: 'buyer-1',
    buyerName: 'Fashion Retail Chain',
    buyerCode: 'BUY-001',
    quotationDate: '2024-03-01',
    validUntil: '2024-03-31',
    status: 'sent',
    items: [
      {
        id: 'qi-1',
        styleId: 'style-1',
        styleNumber: 'STY-2024-001',
        styleName: 'Classic T-Shirt',
        styleNameAr: 'تيشيرت كلاسيكي',
        quantity: 10000,
        unitPrice: 15.00,
        discount: 5,
        total: 142500,
      },
    ],
    subtotal: 150000,
    discount: 7500,
    tax: 19950,
    shippingCost: 1000,
    total: 163450,
    currency: 'USD',
    paymentTerms: 'Net 60',
    deliveryTerms: 'FOB Port',
    incoterms: 'FOB',
    createdBy: 'emp-6',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2024-001',
    salesOrderId: 'so-1',
    salesOrderNumber: 'SO-2024-001',
    buyerId: 'buyer-1',
    buyerName: 'Fashion Retail Chain',
    buyerCode: 'BUY-001',
    invoiceDate: '2024-03-15',
    dueDate: '2024-05-14',
    status: 'issued',
    items: [
      {
        id: 'ii-1',
        styleNumber: 'STY-2024-001',
        styleName: 'Classic T-Shirt',
        styleNameAr: 'تيشيرت كلاسيكي',
        quantity: 5000,
        unitPrice: 15.00,
        discount: 5,
        total: 71250,
      },
    ],
    subtotal: 75000,
    discount: 3750,
    tax: 9975,
    shippingCost: 500,
    total: 81725,
    paidAmount: 0,
    outstandingAmount: 81725,
    currency: 'USD',
    paymentTerms: 'Net 60',
    createdBy: 'emp-6',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'pay-1',
    paymentNumber: 'PAY-2024-001',
    invoiceId: 'inv-1',
    invoiceNumber: 'INV-2024-001',
    buyerId: 'buyer-1',
    buyerName: 'Fashion Retail Chain',
    paymentDate: '2024-04-01',
    amount: 40000,
    currency: 'USD',
    paymentMethod: 'bank_transfer',
    paymentReference: 'TXN-123456',
    bankName: 'Chase Bank',
    status: 'cleared',
    clearedDate: '2024-04-02',
    createdBy: 'emp-6',
    createdAt: '2024-04-01',
  },
];

export const mockPriceLists: PriceList[] = [
  {
    id: 'pl-1',
    code: 'PL-WH-001',
    name: 'Wholesale Price List 2024',
    nameAr: 'قائمة أسعار الجملة 2024',
    description: 'Standard wholesale pricing for all products',
    descriptionAr: 'تسعير الجملة القياسي لجميع المنتجات',
    type: 'wholesale',
    currency: 'USD',
    validFrom: '2024-01-01',
    status: 'active',
    items: [
      {
        id: 'pli-1',
        styleId: 'style-1',
        styleNumber: 'STY-2024-001',
        styleName: 'Classic T-Shirt',
        styleNameAr: 'تيشيرت كلاسيكي',
        basePrice: 18.00,
        discount: 15,
        finalPrice: 15.30,
        minQuantity: 100,
      },
    ],
    discountRules: [
      {
        id: 'dr-1',
        name: 'Volume Discount',
        nameAr: 'خصم الكمية',
        type: 'quantity_based',
        value: 5,
        minQuantity: 1000,
        validFrom: '2024-01-01',
      },
    ],
    applicableBuyers: ['buyer-1'],
    createdBy: 'emp-6',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

export const mockSalesReturns: SalesReturn[] = [
  {
    id: 'ret-1',
    returnNumber: 'RET-2024-001',
    salesOrderId: 'so-1',
    salesOrderNumber: 'SO-2024-001',
    buyerId: 'buyer-1',
    buyerName: 'Fashion Retail Chain',
    returnDate: '2024-03-25',
    returnType: 'defect',
    reason: 'Quality defects found in shipment',
    reasonAr: 'تم العثور على عيوب جودة في الشحنة',
    items: [
      {
        id: 'ri-1',
        salesOrderItemId: 'soi-1',
        styleNumber: 'STY-2024-001',
        styleName: 'Classic T-Shirt',
        styleNameAr: 'تيشيرت كلاسيكي',
        quantity: 50,
        unitPrice: 15.00,
        reason: 'Broken stitches',
        condition: 'defective',
      },
    ],
    totalAmount: 750,
    refundAmount: 750,
    currency: 'USD',
    status: 'approved',
    refundMethod: 'credit_note',
    creditNoteNumber: 'CN-2024-001',
    approvedBy: 'emp-6',
    approvedDate: '2024-03-26',
    createdAt: '2024-03-25',
  },
];

export const mockSalesCommissions: SalesCommission[] = [
  {
    id: 'comm-1',
    commissionNumber: 'COMM-2024-001',
    salesPersonId: 'emp-6',
    salesPersonName: 'Sales Manager',
    period: {
      startDate: '2024-03-01',
      endDate: '2024-03-31',
    },
    salesOrders: ['so-1'],
    totalSales: 81725,
    commissionRate: 5,
    commissionAmount: 4086.25,
    currency: 'USD',
    status: 'calculated',
    createdAt: '2024-03-31',
  },
];

export const mockSalesTargets: SalesTarget[] = [
  {
    id: 'target-1',
    targetNumber: 'TGT-2024-Q1',
    salesPersonId: 'emp-6',
    salesPersonName: 'Sales Manager',
    period: {
      startDate: '2024-01-01',
      endDate: '2024-03-31',
    },
    targetType: 'revenue',
    targetValue: 1000000,
    currentValue: 850000,
    achievementRate: 85,
    currency: 'USD',
    status: 'active',
    createdAt: '2024-01-01',
  },
];

export const mockSalesForecasts: SalesForecast[] = [
  {
    id: 'fc-1',
    forecastNumber: 'FC-2024-Q2',
    period: {
      startDate: '2024-04-01',
      endDate: '2024-06-30',
    },
    forecastType: 'quarterly',
    forecastedRevenue: 1200000,
    forecastedQuantity: 80000,
    confidenceLevel: 85,
    factors: {
      historicalData: 80,
      marketTrends: 75,
      seasonality: 90,
      promotions: 70,
    },
    currency: 'USD',
    createdBy: 'emp-6',
    createdAt: '2024-03-31',
  },
];

export const mockSalesPipelines: SalesPipeline[] = [
  {
    id: 'pipe-1',
    opportunityNumber: 'OPP-2024-001',
    buyerId: 'buyer-1',
    buyerName: 'Fashion Retail Chain',
    opportunityName: 'Q2 2024 Expansion Order',
    opportunityNameAr: 'طلب توسع الربع الثاني 2024',
    stage: 'negotiation',
    probability: 75,
    estimatedValue: 200000,
    estimatedCloseDate: '2024-04-15',
    currency: 'USD',
    salesPersonId: 'emp-6',
    salesPersonName: 'Sales Manager',
    source: 'referral',
    activities: [
      {
        id: 'act-1',
        type: 'meeting',
        date: '2024-03-20',
        description: 'Initial meeting with buyer',
        descriptionAr: 'اجتماع أولي مع المشتر',
        performedBy: 'emp-6',
        performedByName: 'Sales Manager',
      },
    ],
    createdAt: '2024-03-15',
    updatedAt: '2024-03-20',
  },
];

export const mockCreditNotes: CreditNote[] = [
  {
    id: 'cn-1',
    creditNoteNumber: 'CN-2024-001',
    invoiceId: 'inv-1',
    invoiceNumber: 'INV-2024-001',
    buyerId: 'buyer-1',
    buyerName: 'Fashion Retail Chain',
    issueDate: '2024-03-26',
    reason: 'Returned defective goods',
    reasonAr: 'إرجاع بضائع معيبة',
    items: [
      {
        id: 'cni-1',
        invoiceItemId: 'ii-1',
        styleNumber: 'STY-2024-001',
        quantity: 50,
        unitPrice: 15.00,
        total: 750,
      },
    ],
    totalAmount: 750,
    currency: 'USD',
    status: 'applied',
    appliedToInvoiceId: 'inv-1',
    createdBy: 'emp-6',
    createdAt: '2024-03-26',
  },
];

export const mockExportDocumentsFull: ExportDocumentFull[] = [
  {
    id: 'ed-1',
    documentNumber: 'PL-2024-001',
    documentType: 'packing_list',
    salesOrderId: 'so-1',
    salesOrderNumber: 'SO-2024-001',
    buyerId: 'buyer-1',
    buyerName: 'Fashion Retail Chain',
    issueDate: '2024-03-18',
    status: 'issued',
    issuedBy: 'emp-6',
    issuedByName: 'Sales Manager',
    createdAt: '2024-03-18',
  },
  {
    id: 'ed-2',
    documentNumber: 'CI-2024-001',
    documentType: 'commercial_invoice',
    salesOrderId: 'so-1',
    salesOrderNumber: 'SO-2024-001',
    buyerId: 'buyer-1',
    buyerName: 'Fashion Retail Chain',
    issueDate: '2024-03-15',
    status: 'issued',
    issuedBy: 'emp-6',
    issuedByName: 'Sales Manager',
    createdAt: '2024-03-15',
  },
];

export const mockSalesReports: SalesReport[] = [
  {
    id: 'sr-1',
    reportNumber: 'SR-2024-001',
    reportType: 'revenue',
    period: {
      startDate: '2024-03-01',
      endDate: '2024-03-31',
    },
    title: 'Monthly Sales Revenue Report - March 2024',
    titleAr: 'تقرير إيرادات المبيعات الشهري - مارس 2024',
    summary: {
      totalRevenue: 850000,
      totalOrders: 25,
      totalCustomers: 12,
      averageOrderValue: 34000,
      growthRate: 15.5,
    },
    details: {},
    currency: 'USD',
    generatedBy: 'emp-6',
    generatedByName: 'Sales Manager',
    generatedAt: '2024-03-31',
    status: 'published',
  },
];

// ==================== NEW SALES MODULE INTERFACES ====================

export interface Quotation extends BaseEntity {
  id: string;
  quotationNumber: string;
  buyerId: string;
  buyerName: string;
  buyerCode: string;
  quotationDate: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  total: number;
  currency: string;
  paymentTerms: string;
  deliveryTerms: string;
  incoterms?: string;
  notes?: string;
  convertedToOrderId?: string;
  convertedToOrderNumber?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  id: string;
  styleId: string;
  styleNumber: string;
  styleName: string;
  styleNameAr: string;
  colorId?: string;
  colorCode?: string;
  colorName?: string;
  colorNameAr?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  notes?: string;
}

export interface Invoice extends BaseEntity {
  id: string;
  invoiceNumber: string;
  salesOrderId: string;
  salesOrderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerCode: string;
  invoiceDate: string;
  dueDate: string;
  status: 'draft' | 'issued' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'partially_paid';
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  total: number;
  paidAmount: number;
  outstandingAmount: number;
  currency: string;
  paymentTerms: string;
  paymentMethod?: string;
  paymentReference?: string;
  paidDate?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  styleNumber: string;
  styleName: string;
  styleNameAr: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Payment extends BaseEntity {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  buyerId: string;
  buyerName: string;
  paymentDate: string;
  amount: number;
  currency: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'check' | 'credit_card' | 'letter_of_credit' | 'other';
  paymentReference?: string;
  bankName?: string;
  checkNumber?: string;
  status: 'pending' | 'cleared' | 'bounced' | 'cancelled';
  clearedDate?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface PriceList extends BaseEntity {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  type: 'wholesale' | 'retail' | 'export' | 'promotional' | 'custom';
  currency: string;
  validFrom: string;
  validTo?: string;
  status: 'active' | 'inactive' | 'expired';
  items: PriceListItem[];
  discountRules: DiscountRule[];
  applicableBuyers: string[]; // Buyer IDs
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceListItem {
  id: string;
  styleId: string;
  styleNumber: string;
  styleName: string;
  styleNameAr: string;
  basePrice: number;
  discount: number;
  finalPrice: number;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface DiscountRule {
  id: string;
  name: string;
  nameAr: string;
  type: 'percentage' | 'fixed_amount' | 'quantity_based';
  value: number;
  minQuantity?: number;
  maxQuantity?: number;
  applicableStyles?: string[];
  validFrom: string;
  validTo?: string;
}

export interface SalesReturn extends BaseEntity {
  id: string;
  returnNumber: string;
  salesOrderId: string;
  salesOrderNumber: string;
  invoiceId?: string;
  invoiceNumber?: string;
  buyerId: string;
  buyerName: string;
  returnDate: string;
  returnType: 'defect' | 'wrong_item' | 'customer_request' | 'damaged' | 'other';
  reason: string;
  reasonAr: string;
  items: ReturnItem[];
  totalAmount: number;
  refundAmount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'refunded' | 'replaced';
  refundMethod?: 'credit_note' | 'cash_refund' | 'replacement';
  creditNoteNumber?: string;
  replacementOrderId?: string;
  approvedBy?: string;
  approvedDate?: string;
  refundedDate?: string;
  notes?: string;
  createdAt: string;
}

export interface ReturnItem {
  id: string;
  salesOrderItemId: string;
  styleNumber: string;
  styleName: string;
  styleNameAr: string;
  quantity: number;
  unitPrice: number;
  reason: string;
  condition: 'new' | 'used' | 'damaged' | 'defective';
}

export interface SalesCommission extends BaseEntity {
  id: string;
  commissionNumber: string;
  salesPersonId: string;
  salesPersonName: string;
  period: {
    startDate: string;
    endDate: string;
  };
  salesOrders: string[]; // Order IDs
  totalSales: number;
  commissionRate: number; // percentage
  commissionAmount: number;
  currency: string;
  status: 'pending' | 'calculated' | 'approved' | 'paid';
  paidDate?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
}

export interface SalesTarget extends BaseEntity {
  id: string;
  targetNumber: string;
  salesPersonId?: string;
  salesPersonName?: string;
  teamId?: string;
  teamName?: string;
  period: {
    startDate: string;
    endDate: string;
  };
  targetType: 'revenue' | 'quantity' | 'orders' | 'new_customers';
  targetValue: number;
  currentValue: number;
  achievementRate: number; // percentage
  currency?: string;
  status: 'active' | 'achieved' | 'not_achieved' | 'cancelled';
  createdAt: string;
}

export interface SalesForecast extends BaseEntity {
  id: string;
  forecastNumber: string;
  period: {
    startDate: string;
    endDate: string;
  };
  forecastType: 'monthly' | 'quarterly' | 'yearly';
  forecastedRevenue: number;
  forecastedQuantity: number;
  confidenceLevel: number; // percentage
  factors: {
    historicalData: number;
    marketTrends: number;
    seasonality: number;
    promotions: number;
  };
  currency: string;
  createdBy: string;
  createdAt: string;
}

export interface SalesPipeline extends BaseEntity {
  id: string;
  opportunityNumber: string;
  buyerId: string;
  buyerName: string;
  opportunityName: string;
  opportunityNameAr: string;
  stage: 'lead' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number; // percentage
  estimatedValue: number;
  estimatedCloseDate: string;
  currency: string;
  salesPersonId: string;
  salesPersonName: string;
  source: 'referral' | 'website' | 'trade_show' | 'cold_call' | 'email' | 'other';
  notes?: string;
  activities: PipelineActivity[];
  createdAt: string;
  updatedAt: string;
}

export interface PipelineActivity {
  id: string;
  type: 'call' | 'meeting' | 'email' | 'proposal' | 'quote' | 'other';
  date: string;
  description: string;
  descriptionAr: string;
  performedBy: string;
  performedByName: string;
}

export interface CreditNote extends BaseEntity {
  id: string;
  creditNoteNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  buyerId: string;
  buyerName: string;
  issueDate: string;
  reason: string;
  reasonAr: string;
  items: CreditNoteItem[];
  totalAmount: number;
  currency: string;
  status: 'draft' | 'issued' | 'applied' | 'cancelled';
  appliedToInvoiceId?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface CreditNoteItem {
  id: string;
  invoiceItemId: string;
  styleNumber: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ExportDocumentFull extends BaseEntity {
  id: string;
  documentNumber: string;
  documentType: 'packing_list' | 'commercial_invoice' | 'certificate_of_origin' | 'export_license' | 'bill_of_lading' | 'insurance_certificate' | 'phytosanitary' | 'other';
  salesOrderId: string;
  salesOrderNumber: string;
  shipmentId?: string;
  shipmentNumber?: string;
  buyerId: string;
  buyerName: string;
  issueDate: string;
  expiryDate?: string;
  status: 'draft' | 'issued' | 'submitted' | 'approved' | 'rejected' | 'expired';
  issuedBy?: string;
  issuedByName?: string;
  submittedTo?: string;
  approvalDate?: string;
  documentUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface SalesReport extends BaseEntity {
  id: string;
  reportNumber: string;
  reportType: 'revenue' | 'orders' | 'customers' | 'products' | 'sales_person' | 'forecast' | 'custom';
  period: {
    startDate: string;
    endDate: string;
  };
  title: string;
  titleAr: string;
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
    growthRate: number;
  };
  details: any;
  currency: string;
  generatedBy: string;
  generatedByName: string;
  generatedAt: string;
  status: 'draft' | 'published';
}

// ==================== HELPER FUNCTIONS ====================

export function getBuyerName(buyer: Buyer, lang: string): string {
  return lang === 'ar' ? buyer.nameAr : buyer.name;
}

export function generateId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

