// ==================== PROCUREMENT COMPREHENSIVE DATA ====================

import { mockSuppliers, mockRFQs, mockPurchaseOrders, mockIncoterms, mockShipments, mockContracts, mockPriceLists, generateId } from './scmData';

// ==================== PURCHASE REQUISITION ====================

export interface PurchaseRequisition {
  id: string;
  requisitionNumber: string;
  version: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'converted' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestedBy: string;
  requestedByName: string;
  departmentId: string;
  departmentName: string;
  departmentNameAr: string;
  requestedDate: string;
  requiredDate: string;
  purpose: string;
  purposeAr: string;
  items: RequisitionItem[];
  totalEstimatedCost: number;
  currency: string;
  budgetCode?: string;
  budgetName?: string;
  approvalWorkflow?: ApprovalWorkflow;
  notes?: string;
  notesAr?: string;
  convertedToRFQ?: string;
  convertedToRFQNumber?: string;
  convertedToPO?: string;
  convertedToPONumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RequisitionItem {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialNameAr: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice?: number;
  estimatedTotal?: number;
  specifications?: string;
  specificationsAr?: string;
  urgency: 'low' | 'medium' | 'high';
  requiredDate?: string;
}

export interface ApprovalWorkflow {
  id: string;
  entityType: 'requisition' | 'rfq' | 'po' | 'contract';
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
  commentsAr?: string;
  actionDate?: string;
}

// ==================== GOODS RECEIPT ====================

export interface GoodsReceipt {
  id: string;
  grnNumber: string;
  poId: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  receiptDate: string;
  receivedBy: string;
  receivedByName: string;
  warehouseId: string;
  warehouseName: string;
  status: 'draft' | 'partial' | 'completed' | 'rejected' | 'cancelled';
  type: 'full' | 'partial' | 'over_receipt';
  items: GoodsReceiptItem[];
  qualityInspectionId?: string;
  qualityInspectionNumber?: string;
  qualityStatus?: 'pending' | 'passed' | 'failed' | 'conditional';
  notes?: string;
  notesAr?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoodsReceiptItem {
  id: string;
  poItemId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialNameAr: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unit: string;
  unitPrice: number;
  currency: string;
  batchNumber?: string;
  lotNumber?: string;
  expiryDate?: string;
  condition: 'good' | 'damaged' | 'defective' | 'wrong_item';
  notes?: string;
}

// ==================== SUPPLIER INVOICE ====================

export interface SupplierInvoice {
  id: string;
  invoiceNumber: string;
  supplierInvoiceNumber: string;
  poId: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  paymentTerms: string;
  status: 'draft' | 'pending' | 'matched' | 'variance' | 'approved' | 'paid' | 'cancelled';
  matchingStatus: 'pending' | 'matched' | 'variance' | 'rejected';
  matchingVariances: InvoiceVariance[];
  grnId?: string;
  grnNumber?: string;
  matchedBy?: string;
  matchedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
  notesAr?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialNameAr: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
}

export interface InvoiceVariance {
  type: 'price' | 'quantity' | 'tax' | 'discount' | 'other';
  field: string;
  expected: number;
  actual: number;
  variance: number;
  variancePercent: number;
  tolerance: number;
  isWithinTolerance: boolean;
  reason?: string;
  reasonAr?: string;
  requiresApproval: boolean;
}

// ==================== SUPPLIER EVALUATION ====================

export interface SupplierEvaluation {
  id: string;
  evaluationNumber: string;
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  evaluationPeriod: {
    startDate: string;
    endDate: string;
  };
  evaluationDate: string;
  evaluatedBy: string;
  evaluatedByName: string;
  status: 'draft' | 'completed' | 'approved';
  
  // Performance Metrics
  metrics: {
    onTimeDelivery: {
      score: number; // 0-100
      target: number;
      actual: number;
      ordersOnTime: number;
      totalOrders: number;
    };
    quality: {
      score: number; // 0-100
      target: number;
      defects: number;
      totalItems: number;
      defectRate: number;
    };
    price: {
      score: number; // 0-100
      averagePrice: number;
      marketAverage: number;
      competitiveness: number; // percentage
    };
    communication: {
      score: number; // 0-100
      responseTime: number; // hours
      responsiveness: number; // percentage
    };
    compliance: {
      score: number; // 0-100
      documentationComplete: number; // percentage
      certificationsValid: boolean;
    };
  };
  
  overallScore: number; // 0-100
  overallRating: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'poor';
  recommendations: string;
  recommendationsAr: string;
  actionItems: EvaluationActionItem[];
  nextEvaluationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationActionItem {
  id: string;
  description: string;
  descriptionAr: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedDate?: string;
}

// ==================== PROCUREMENT ANALYTICS ====================

export interface ProcurementReport {
  id: string;
  reportNumber: string;
  reportType: 'spend_analysis' | 'supplier_performance' | 'cost_savings' | 'compliance' | 'custom';
  period: {
    startDate: string;
    endDate: string;
  };
  currency: string;
  data: ReportData;
  generatedBy: string;
  generatedDate: string;
  createdAt: string;
}

export interface ReportData {
  totalSpend: number;
  totalOrders: number;
  averageOrderValue: number;
  topSuppliers: TopSupplier[];
  categoryBreakdown: CategorySpend[];
  costSavings: CostSaving[];
  complianceRate: number;
}

export interface TopSupplier {
  supplierId: string;
  supplierName: string;
  totalSpend: number;
  orderCount: number;
  averageOrderValue: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
}

export interface CategorySpend {
  category: string;
  categoryAr: string;
  totalSpend: number;
  percentage: number;
  orderCount: number;
}

export interface CostSaving {
  id: string;
  description: string;
  descriptionAr: string;
  amount: number;
  currency: string;
  method: 'negotiation' | 'volume_discount' | 'alternative_supplier' | 'process_improvement';
  period: string;
}

// ==================== MOCK DATA ====================

export const mockPurchaseRequisitions: PurchaseRequisition[] = [
  {
    id: 'pr-1',
    requisitionNumber: 'PR-2024-001',
    version: 1,
    status: 'approved',
    priority: 'high',
    requestedBy: 'emp-1',
    requestedByName: 'Ahmed Hassan',
    departmentId: 'dept-1',
    departmentName: 'Production',
    departmentNameAr: 'الإنتاج',
    requestedDate: '2024-03-15',
    requiredDate: '2024-04-01',
    purpose: 'Raw materials for Q2 production',
    purposeAr: 'مواد خام لإنتاج الربع الثاني',
    items: [
      {
        id: 'pri-1',
        materialId: 'mat-1',
        materialCode: 'FAB-COT-001',
        materialName: '100% Cotton Fabric',
        materialNameAr: 'قماش قطن 100%',
        quantity: 10000,
        unit: 'meters',
        estimatedUnitPrice: 5.50,
        estimatedTotal: 55000,
        urgency: 'high',
        requiredDate: '2024-04-01',
      },
    ],
    totalEstimatedCost: 55000,
    currency: 'USD',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-18',
  },
];

export const mockGoodsReceipts: GoodsReceipt[] = [
  {
    id: 'gr-1',
    grnNumber: 'GRN-2024-001',
    poId: 'po-1',
    poNumber: 'PO-2024-001',
    supplierId: 'sup-1',
    supplierName: 'Premium Fabrics Co.',
    supplierCode: 'SUP-001',
    receiptDate: '2024-03-25',
    receivedBy: 'emp-2',
    receivedByName: 'Mohamed Ali',
    warehouseId: 'wh-1',
    warehouseName: 'Main Warehouse',
    status: 'completed',
    type: 'full',
    items: [
      {
        id: 'gri-1',
        poItemId: 'poi-1',
        materialId: 'mat-1',
        materialCode: 'FAB-COT-001',
        materialName: '100% Cotton Fabric',
        materialNameAr: 'قماش قطن 100%',
        orderedQuantity: 5000,
        receivedQuantity: 5000,
        acceptedQuantity: 4950,
        rejectedQuantity: 50,
        unit: 'meters',
        unitPrice: 5.50,
        currency: 'USD',
        batchNumber: 'BATCH-001',
        condition: 'good',
      },
    ],
    qualityStatus: 'passed',
    createdBy: 'emp-2',
    createdAt: '2024-03-25',
    updatedAt: '2024-03-25',
  },
];

export const mockSupplierInvoices: SupplierInvoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2024-001',
    supplierInvoiceNumber: 'SUP-INV-12345',
    poId: 'po-1',
    poNumber: 'PO-2024-001',
    supplierId: 'sup-1',
    supplierName: 'Premium Fabrics Co.',
    supplierCode: 'SUP-001',
    invoiceDate: '2024-03-20',
    dueDate: '2024-04-19',
    currency: 'USD',
    items: [
      {
        id: 'invi-1',
        materialId: 'mat-1',
        materialCode: 'FAB-COT-001',
        materialName: '100% Cotton Fabric',
        materialNameAr: 'قماش قطن 100%',
        quantity: 5000,
        unit: 'meters',
        unitPrice: 5.50,
        discount: 0,
        tax: 3850,
        total: 31350,
        currency: 'USD',
      },
    ],
    subtotal: 27500,
    discount: 0,
    tax: 3850,
    shipping: 1500,
    total: 32850,
    paymentTerms: 'Net 30',
    status: 'matched',
    matchingStatus: 'matched',
    matchingVariances: [],
    grnId: 'gr-1',
    grnNumber: 'GRN-2024-001',
    matchedBy: 'emp-3',
    matchedDate: '2024-03-21',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-21',
  },
];

export const mockSupplierEvaluations: SupplierEvaluation[] = [
  {
    id: 'eval-1',
    evaluationNumber: 'EVAL-2024-001',
    supplierId: 'sup-1',
    supplierName: 'Premium Fabrics Co.',
    supplierCode: 'SUP-001',
    evaluationPeriod: {
      startDate: '2024-01-01',
      endDate: '2024-03-31',
    },
    evaluationDate: '2024-04-01',
    evaluatedBy: 'emp-1',
    evaluatedByName: 'Ahmed Hassan',
    status: 'completed',
    metrics: {
      onTimeDelivery: {
        score: 92,
        target: 90,
        actual: 92,
        ordersOnTime: 23,
        totalOrders: 25,
      },
      quality: {
        score: 94,
        target: 95,
        defects: 15,
        totalItems: 5000,
        defectRate: 0.3,
      },
      price: {
        score: 88,
        averagePrice: 5.50,
        marketAverage: 5.75,
        competitiveness: 95.7,
      },
      communication: {
        score: 90,
        responseTime: 4,
        responsiveness: 96,
      },
      compliance: {
        score: 95,
        documentationComplete: 100,
        certificationsValid: true,
      },
    },
    overallScore: 91.8,
    overallRating: 'excellent',
    recommendations: 'Continue current relationship, consider volume discounts',
    recommendationsAr: 'متابعة العلاقة الحالية، النظر في خصومات الكمية',
    actionItems: [],
    nextEvaluationDate: '2024-07-01',
    createdAt: '2024-04-01',
    updatedAt: '2024-04-01',
  },
];

export const mockProcurementReports: ProcurementReport[] = [
  {
    id: 'rep-1',
    reportNumber: 'PR-REP-2024-001',
    reportType: 'spend_analysis',
    period: {
      startDate: '2024-01-01',
      endDate: '2024-03-31',
    },
    currency: 'USD',
    data: {
      totalSpend: 1250000,
      totalOrders: 150,
      averageOrderValue: 8333,
      topSuppliers: [
        {
          supplierId: 'sup-1',
          supplierName: 'Premium Fabrics Co.',
          totalSpend: 500000,
          orderCount: 25,
          averageOrderValue: 20000,
          onTimeDeliveryRate: 92,
          qualityScore: 94,
        },
      ],
      categoryBreakdown: [
        {
          category: 'Fabric',
          categoryAr: 'الأقمشة',
          totalSpend: 800000,
          percentage: 64,
          orderCount: 80,
        },
      ],
      costSavings: [
        {
          id: 'cs-1',
          description: 'Volume discount negotiation',
          descriptionAr: 'تفاوض خصم الكمية',
          amount: 50000,
          currency: 'USD',
          method: 'negotiation',
          period: '2024-Q1',
        },
      ],
      complianceRate: 98,
    },
    generatedBy: 'emp-1',
    generatedDate: '2024-04-01',
    createdAt: '2024-04-01',
  },
];

// Re-export mock data and utilities from scmData
export { mockSuppliers, mockRFQs, mockPurchaseOrders, mockIncoterms, mockShipments, mockContracts, mockPriceLists, generateId };

