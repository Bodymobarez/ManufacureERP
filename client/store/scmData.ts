// ==================== SCM COMPREHENSIVE DATA ====================

export interface SupplierMaster {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  // Company Details
  companyName: string;
  companyNameAr: string;
  registrationNumber: string; // Trade Registration
  taxId: string;
  vatNumber?: string;
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
  classification: 'local' | 'international';
  type: 'raw_materials' | 'services' | 'both';
  status: 'active' | 'under_evaluation' | 'suspended' | 'blacklisted';
  // Performance
  rating: number; // 0-5
  onTimeDeliveryRate: number; // percentage
  qualityRating: number; // 0-5
  priceRating: number; // 0-5
  complianceRating: number; // 0-5
  // Terms
  paymentTerms: string; // Net 30, Net 45, etc.
  leadTimeDays: number;
  minOrderQuantity?: number;
  // Categories
  categories: string[]; // fabric, trim, accessory, etc.
  // Dates
  createdAt: string;
  updatedAt: string;
  lastEvaluationDate?: string;
  blacklistDate?: string;
  blacklistReason?: string;
}

export interface SupplierContract {
  id: string;
  contractNumber: string;
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  startDate: string;
  endDate: string;
  currency: string;
  paymentTerms: string;
  incoterms: string;
  priceListId?: string;
  terms: string;
  termsAr: string;
  attachments?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierPriceList {
  id: string;
  priceListNumber: string;
  supplierId: string;
  supplierName: string;
  contractId?: string;
  currency: string;
  effectiveDate: string;
  expiryDate?: string;
  status: 'draft' | 'active' | 'expired';
  items: PriceListItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceListItem {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialNameAr: string;
  unit: string;
  unitPrice: number;
  currency: string;
  minOrderQuantity?: number;
  leadTimeDays: number;
  moq?: number; // Minimum Order Quantity
}

export interface RFQ {
  id: string;
  rfqNumber: string;
  version: number;
  status: 'draft' | 'sent' | 'quoted' | 'under_review' | 'approved' | 'rejected' | 'converted';
  requestedBy: string;
  requestedByName: string;
  departmentId: string;
  departmentName: string;
  requestedDate: string;
  requiredDate: string;
  items: RFQItem[];
  supplierIds: string[];
  suppliers: RFQSupplier[];
  comparisonSheet?: ComparisonSheet;
  approvalWorkflow?: ApprovalWorkflow;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RFQItem {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialNameAr: string;
  quantity: number;
  unit: string;
  specifications?: string;
  specificationsAr?: string;
}

export interface RFQSupplier {
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  status: 'pending' | 'quoted' | 'rejected';
  quoteReceivedDate?: string;
  quoteNumber?: string;
  totalPrice?: number;
  currency?: string;
  leadTimeDays?: number;
  validUntil?: string;
}

export interface ComparisonSheet {
  rfqId: string;
  items: ComparisonItem[];
  summary: ComparisonSummary;
  recommendation: string; // supplierId
  recommendedBy?: string;
  recommendedDate?: string;
  createdAt: string;
}

export interface ComparisonItem {
  materialId: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
  supplierQuotes: SupplierQuote[];
}

export interface SupplierQuote {
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  currency: string;
  totalPrice: number;
  leadTimeDays: number;
  moq?: number;
  notes?: string;
}

export interface ComparisonSummary {
  supplierId: string;
  supplierName: string;
  totalPrice: number;
  currency: string;
  totalLeadTimeDays: number;
  weightedScore: number; // Price + Lead Time + Quality + MOQ
  rank: number;
}

export interface ApprovalWorkflow {
  id: string;
  entityType: 'rfq' | 'po' | 'contract';
  entityId: string;
  currentStage: string;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected';
  stages: ApprovalStage[];
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalStage {
  stageName: string;
  stageNameAr: string;
  approverId: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  actionDate?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  version: number;
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  rfqId?: string;
  rfqNumber?: string;
  type: 'local' | 'import';
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'confirmed' | 'partially_received' | 'completed' | 'cancelled' | 'amended';
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  currency: string;
  incoterms: string;
  paymentTerms: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  freight: number;
  insurance: number;
  customs: number;
  tax: number;
  total: number;
  approvalWorkflow?: ApprovalWorkflow;
  amendments: POAmendment[];
  invoiceMatching?: InvoiceMatching;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialNameAr: string;
  quantity: number;
  receivedQuantity: number;
  unit: string;
  unitPrice: number;
  currency: string;
  total: number;
  expectedDeliveryDate?: string;
}

export interface POAmendment {
  id: string;
  amendmentNumber: string;
  poId: string;
  type: 'quantity' | 'price' | 'delivery_date' | 'other';
  reason: string;
  reasonAr?: string;
  changes: AmendmentChange[];
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  createdAt: string;
}

export interface AmendmentChange {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface InvoiceMatching {
  poId: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  invoiceAmount?: number;
  invoiceCurrency?: string;
  grnNumber?: string; // Good Received Note
  grnDate?: string;
  status: 'pending' | 'matched' | 'variance';
  variances: InvoiceVariance[];
  matchedBy?: string;
  matchedDate?: string;
}

export interface InvoiceVariance {
  type: 'price' | 'quantity' | 'tax' | 'other';
  expected: number;
  actual: number;
  variance: number;
  variancePercent: number;
  reason?: string;
}

export interface Shipment {
  id: string;
  shipmentNumber: string;
  poId: string;
  poNumber: string;
  type: 'sea' | 'air' | 'road' | 'rail';
  status: 'planned' | 'in_transit' | 'at_port' | 'customs_clearance' | 'delivered' | 'delayed';
  origin: string;
  destination: string;
  shippingLine?: string;
  vesselName?: string;
  bookingNumber?: string;
  containerNumbers: string[];
  etd: string; // Estimated Time of Departure
  eta: string; // Estimated Time of Arrival
  actualDeparture?: string;
  actualArrival?: string;
  freightCost: number;
  freightCurrency: string;
  customsStatus: 'pending' | 'submitted' | 'under_review' | 'cleared' | 'rejected';
  customsDeclarationNumber?: string;
  customsClearedDate?: string;
  trackingUrl?: string;
  documents: ShipmentDocument[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentDocument {
  id: string;
  type: 'bl' | 'commercial_invoice' | 'packing_list' | 'certificate_of_origin' | 'insurance' | 'customs_declaration' | 'other';
  name: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedDate: string;
}

export interface Container {
  id: string;
  containerNumber: string;
  shipmentId: string;
  shipmentNumber: string;
  type: '20ft' | '40ft' | '40ft_hc';
  status: 'empty' | 'loaded' | 'in_transit' | 'delivered' | 'returned';
  sealNumber?: string;
  loadedDate?: string;
  deliveredDate?: string;
  items: ContainerItem[];
  createdAt: string;
}

export interface ContainerItem {
  materialId: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
  packages: number;
  weight: number; // kg
  volume: number; // m³
}

export interface Incoterm {
  id: string;
  code: string; // EXW, FOB, CIF, DDP, etc.
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  costResponsibility: CostResponsibility;
  riskTransferPoint: string;
  riskTransferPointAr: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CostResponsibility {
  freight: 'buyer' | 'seller';
  insurance: 'buyer' | 'seller';
  customsExport: 'buyer' | 'seller';
  customsImport: 'buyer' | 'seller';
  loading: 'buyer' | 'seller';
  unloading: 'buyer' | 'seller';
  delivery: 'buyer' | 'seller';
}

// ==================== HELPER FUNCTIONS ====================

export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const getSupplierName = (supplier: SupplierMaster, language: string): string => {
  return language === 'ar' ? supplier.nameAr : supplier.name;
};

// ==================== MOCK DATA ====================

export const mockSuppliers: SupplierMaster[] = [
  {
    id: 'sup-1',
    code: 'SUP-001',
    name: 'Premium Fabrics Co.',
    nameAr: 'شركة الأقمشة الفاخرة',
    companyName: 'Premium Fabrics Co. Ltd.',
    companyNameAr: 'شركة الأقمشة الفاخرة المحدودة',
    registrationNumber: 'CR-123456',
    taxId: 'TAX-789012',
    vatNumber: 'VAT-345678',
    country: 'China',
    currency: 'USD',
    contactPerson: 'John Smith',
    email: 'john@premiumfabrics.com',
    phone: '+1 555 123 4567',
    address: '123 Textile Street',
    city: 'Shanghai',
    postalCode: '200000',
    website: 'www.premiumfabrics.com',
    classification: 'international',
    type: 'raw_materials',
    status: 'active',
    rating: 4.5,
    onTimeDeliveryRate: 92,
    qualityRating: 4.6,
    priceRating: 4.3,
    complianceRating: 4.7,
    paymentTerms: 'Net 30',
    leadTimeDays: 21,
    minOrderQuantity: 1000,
    categories: ['fabric'],
    createdAt: '2022-01-01',
    updatedAt: '2024-03-20',
    lastEvaluationDate: '2024-03-01',
  },
  {
    id: 'sup-2',
    code: 'SUP-002',
    name: 'Global Trims Ltd.',
    nameAr: 'شركة الإكسسوارات العالمية',
    companyName: 'Global Trims Limited',
    companyNameAr: 'شركة الإكسسوارات العالمية المحدودة',
    registrationNumber: 'CR-234567',
    taxId: 'TAX-890123',
    country: 'India',
    currency: 'USD',
    contactPerson: 'Maria Garcia',
    email: 'maria@globaltrims.com',
    phone: '+91 98 7654 3210',
    address: '456 Trim Avenue',
    city: 'Mumbai',
    postalCode: '400001',
    classification: 'international',
    type: 'raw_materials',
    status: 'active',
    rating: 4.2,
    onTimeDeliveryRate: 88,
    qualityRating: 4.4,
    priceRating: 4.1,
    complianceRating: 4.3,
    paymentTerms: 'Net 45',
    leadTimeDays: 14,
    categories: ['trim', 'accessory'],
    createdAt: '2022-03-15',
    updatedAt: '2024-03-20',
  },
  {
    id: 'sup-3',
    code: 'SUP-003',
    name: 'Local Textiles Egypt',
    nameAr: 'المنسوجات المحلية مصر',
    companyName: 'Local Textiles Egypt S.A.E.',
    companyNameAr: 'المنسوجات المحلية مصر',
    registrationNumber: 'CR-345678',
    taxId: 'TAX-901234',
    vatNumber: 'VAT-567890',
    country: 'Egypt',
    currency: 'EGP',
    contactPerson: 'Ahmed Mohamed',
    email: 'ahmed@localtextiles.eg',
    phone: '+20 2 2345 6789',
    address: '789 Industrial Zone',
    city: 'Cairo',
    postalCode: '11511',
    classification: 'local',
    type: 'raw_materials',
    status: 'active',
    rating: 4.0,
    onTimeDeliveryRate: 85,
    qualityRating: 3.9,
    priceRating: 4.2,
    complianceRating: 4.1,
    paymentTerms: 'Net 30',
    leadTimeDays: 7,
    categories: ['fabric'],
    createdAt: '2021-06-01',
    updatedAt: '2024-03-18',
  },
];

export const mockIncoterms: Incoterm[] = [
  {
    id: 'inc-1',
    code: 'EXW',
    name: 'Ex Works',
    nameAr: 'من المصنع',
    description: 'Buyer bears all costs and risks',
    descriptionAr: 'المشتري يتحمل جميع التكاليف والمخاطر',
    costResponsibility: {
      freight: 'buyer',
      insurance: 'buyer',
      customsExport: 'buyer',
      customsImport: 'buyer',
      loading: 'buyer',
      unloading: 'buyer',
      delivery: 'buyer',
    },
    riskTransferPoint: 'Seller\'s premises',
    riskTransferPointAr: 'مقر البائع',
    isActive: true,
    createdAt: '2022-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'inc-2',
    code: 'FOB',
    name: 'Free On Board',
    nameAr: 'مجاناً على متن السفينة',
    description: 'Seller delivers when goods pass ship\'s rail',
    descriptionAr: 'البائع يسلم عندما تمر البضائع عبر سكة السفينة',
    costResponsibility: {
      freight: 'buyer',
      insurance: 'buyer',
      customsExport: 'seller',
      customsImport: 'buyer',
      loading: 'seller',
      unloading: 'buyer',
      delivery: 'buyer',
    },
    riskTransferPoint: 'On board vessel at port of shipment',
    riskTransferPointAr: 'على متن السفينة في ميناء الشحن',
    isActive: true,
    createdAt: '2022-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'inc-3',
    code: 'CIF',
    name: 'Cost, Insurance and Freight',
    nameAr: 'التكلفة والتأمين والشحن',
    description: 'Seller pays cost, insurance and freight to destination port',
    descriptionAr: 'البائع يدفع التكلفة والتأمين والشحن إلى ميناء الوجهة',
    costResponsibility: {
      freight: 'seller',
      insurance: 'seller',
      customsExport: 'seller',
      customsImport: 'buyer',
      loading: 'seller',
      unloading: 'buyer',
      delivery: 'buyer',
    },
    riskTransferPoint: 'On board vessel at port of shipment',
    riskTransferPointAr: 'على متن السفينة في ميناء الشحن',
    isActive: true,
    createdAt: '2022-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'inc-4',
    code: 'DDP',
    name: 'Delivered Duty Paid',
    nameAr: 'تسليم مع دفع الرسوم',
    description: 'Seller bears all costs including import duties',
    descriptionAr: 'البائع يتحمل جميع التكاليف بما في ذلك الرسوم الجمركية',
    costResponsibility: {
      freight: 'seller',
      insurance: 'seller',
      customsExport: 'seller',
      customsImport: 'seller',
      loading: 'seller',
      unloading: 'seller',
      delivery: 'seller',
    },
    riskTransferPoint: 'Buyer\'s premises',
    riskTransferPointAr: 'مقر المشتري',
    isActive: true,
    createdAt: '2022-01-01',
    updatedAt: '2024-01-01',
  },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'PO-2024-001',
    version: 1,
    supplierId: 'sup-1',
    supplierName: 'Premium Fabrics Co.',
    supplierCode: 'SUP-001',
    type: 'import',
    status: 'confirmed',
    orderDate: '2024-03-01',
    expectedDeliveryDate: '2024-03-22',
    currency: 'USD',
    incoterms: 'FOB',
    paymentTerms: 'Net 30',
    items: [
      {
        id: 'poi-1',
        materialId: 'mat-1',
        materialCode: 'FAB-COT-001',
        materialName: '100% Cotton Fabric',
        materialNameAr: 'قماش قطن 100%',
        quantity: 5000,
        receivedQuantity: 0,
        unit: 'meters',
        unitPrice: 5.50,
        currency: 'USD',
        total: 27500,
      },
    ],
    subtotal: 27500,
    freight: 1500,
    insurance: 200,
    customs: 0,
    tax: 3850,
    total: 33050,
    amendments: [],
    createdBy: 'emp-1',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-05',
  },
];

export const mockRFQs: RFQ[] = [
  {
    id: 'rfq-1',
    rfqNumber: 'RFQ-2024-001',
    version: 1,
    status: 'quoted',
    requestedBy: 'emp-1',
    requestedByName: 'Ahmed Hassan',
    departmentId: 'dept-1',
    departmentName: 'Procurement',
    requestedDate: '2024-03-01',
    requiredDate: '2024-03-25',
    items: [
      {
        id: 'rfqi-1',
        materialId: 'mat-1',
        materialCode: 'FAB-COT-001',
        materialName: '100% Cotton Fabric',
        materialNameAr: 'قماش قطن 100%',
        quantity: 5000,
        unit: 'meters',
      },
    ],
    supplierIds: ['sup-1', 'sup-2'],
    suppliers: [
      {
        supplierId: 'sup-1',
        supplierName: 'Premium Fabrics Co.',
        supplierCode: 'SUP-001',
        status: 'quoted',
        quoteReceivedDate: '2024-03-05',
        totalPrice: 27500,
        currency: 'USD',
        leadTimeDays: 21,
      },
    ],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-05',
  },
];

export const mockShipments: Shipment[] = [
  {
    id: 'ship-1',
    shipmentNumber: 'SHIP-2024-001',
    poId: 'po-1',
    poNumber: 'PO-2024-001',
    type: 'sea',
    status: 'in_transit',
    origin: 'Shanghai, China',
    destination: 'Alexandria, Egypt',
    shippingLine: 'Maersk Line',
    vesselName: 'MV Maersk Alexandria',
    bookingNumber: 'MAE-123456',
    containerNumbers: ['CONT-001', 'CONT-002'],
    etd: '2024-03-15',
    eta: '2024-04-10',
    actualDeparture: '2024-03-16',
    freightCost: 5000,
    freightCurrency: 'USD',
    customsStatus: 'pending',
    documents: [],
    createdBy: 'emp-1',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-16',
  },
];

export const mockContainers: Container[] = [];
export const mockContracts: SupplierContract[] = [];
export const mockPriceLists: SupplierPriceList[] = [];

