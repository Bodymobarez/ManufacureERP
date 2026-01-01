// ==================== FINANCE & COSTING DATA ====================

export interface PreCosting {
  id: string;
  code: string;
  productId: string;
  productCode: string;
  productName: string;
  productNameAr: string;
  version: number;
  costingDate: string;
  status: 'draft' | 'approved' | 'superseded';
  currency: string; // Base currency (USD)
  
  // Material Costs
  materialCost: number;
  materialDetails: CostingMaterialDetail[];
  
  // Labor Costs
  laborCost: number;
  laborDetails: CostingLaborDetail[];
  
  // Overhead Costs
  overheadCost: number;
  overheadPercent: number;
  
  // Other Costs
  trimsAndAccessories: number;
  packaging: number;
  freight: number;
  customDuty?: number;
  otherCosts: number;
  
  // Totals
  totalCost: number;
  targetMarginPercent: number;
  targetSellingPrice: number;
  
  // Approval
  approvedBy?: string;
  approvedAt?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface CostingMaterialDetail {
  materialId: string;
  materialCode: string;
  materialName: string;
  materialNameAr: string;
  quantity: number;
  unit: string;
  unitCost: number;
  wastagePercent: number;
  totalQuantity: number; // including wastage
  totalCost: number;
}

export interface CostingLaborDetail {
  operationId: string;
  operationName: string;
  operationNameAr: string;
  smv: number; // Standard Minute Value
  operatorRate: number; // per hour
  costPerPiece: number;
  quantity: number; // pieces
  totalCost: number;
}

export interface ActualCosting {
  id: string;
  code: string;
  productionOrderId: string;
  productionOrderCode: string;
  productId: string;
  productCode: string;
  productName: string;
  productNameAr: string;
  preCostingId: string;
  preCostingCode: string;
  productionDate: string;
  quantityProduced: number;
  currency: string; // Base currency (USD)
  
  // Actual Material Costs
  actualMaterialCost: number;
  actualMaterialDetails: CostingMaterialDetail[];
  
  // Actual Labor Costs
  actualLaborCost: number;
  actualLaborDetails: CostingLaborDetail[];
  
  // Actual Overhead
  actualOverheadCost: number;
  
  // Actual Other Costs
  actualOtherCosts: number;
  
  // Totals
  totalActualCost: number;
  costPerUnit: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface CostVariance {
  id: string;
  code: string;
  productionOrderId: string;
  productionOrderCode: string;
  preCostingId: string;
  preCostingCode: string;
  actualCostingId: string;
  actualCostingCode: string;
  productId: string;
  productCode: string;
  productName: string;
  productNameAr: string;
  quantity: number;
  currency: string;
  
  // Variances
  materialVariance: number;
  materialVariancePercent: number;
  laborVariance: number;
  laborVariancePercent: number;
  overheadVariance: number;
  overheadVariancePercent: number;
  otherVariance: number;
  otherVariancePercent: number;
  totalVariance: number;
  totalVariancePercent: number;
  
  // Analysis
  varianceType: 'favorable' | 'unfavorable';
  rootCause?: string;
  rootCauseAr?: string;
  correctiveAction?: string;
  correctiveActionAr?: string;
  
  createdAt: string;
}

export interface CostPerMinute {
  id: string;
  productionLineId: string;
  productionLineName: string;
  productionLineNameAr: string;
  date: string;
  totalMinutes: number;
  totalCost: number;
  costPerMinute: number;
  currency: string;
  breakdown: {
    labor: number;
    overhead: number;
    utilities: number;
    depreciation: number;
  };
  createdAt: string;
}

export interface CostPerStyle {
  id: string;
  styleId: string;
  styleCode: string;
  styleName: string;
  styleNameAr: string;
  period: string; // '2024-03'
  quantityProduced: number;
  totalCost: number;
  costPerUnit: number;
  revenue: number;
  grossProfit: number;
  grossMargin: number;
  netProfit: number;
  netMargin: number;
  currency: string;
  profitability: 'profitable' | 'break_even' | 'loss';
  createdAt: string;
}

export interface ProfitabilityReport {
  id: string;
  period: string; // '2024-Q1', '2024-03'
  startDate: string;
  endDate: string;
  currency: string;
  
  // Revenue
  totalRevenue: number;
  
  // Costs
  totalMaterialCost: number;
  totalLaborCost: number;
  totalOverheadCost: number;
  totalOtherCosts: number;
  totalCost: number;
  
  // Profit
  grossProfit: number;
  grossMargin: number;
  operatingExpenses: number;
  netProfit: number;
  netMargin: number;
  
  // By Style
  styleBreakdown: CostPerStyle[];
  
  createdAt: string;
}

// Mock data
export const mockPreCostings: PreCosting[] = [
  {
    id: 'pc-1',
    code: 'PC-2024-001',
    productId: 'prod-1',
    productCode: 'STY-001',
    productName: 'Classic White Shirt',
    productNameAr: 'قميص أبيض كلاسيكي',
    version: 1,
    costingDate: '2024-01-15',
    status: 'approved',
    currency: 'USD',
    materialCost: 8.50,
    materialDetails: [
      {
        materialId: 'mat-1',
        materialCode: 'FAB-001',
        materialName: 'Cotton Fabric 100%',
        materialNameAr: 'قماش قطني 100%',
        quantity: 2.5,
        unit: 'meter',
        unitCost: 3.00,
        wastagePercent: 5,
        totalQuantity: 2.625,
        totalCost: 7.875,
      },
    ],
    laborCost: 3.20,
    laborDetails: [
      {
        operationId: 'op-1',
        operationName: 'Cutting',
        operationNameAr: 'القطع',
        smv: 5.0,
        operatorRate: 12,
        costPerPiece: 1.00,
        quantity: 1,
        totalCost: 1.00,
      },
      {
        operationId: 'op-2',
        operationName: 'Sewing',
        operationNameAr: 'الخياطة',
        smv: 20.0,
        operatorRate: 12,
        costPerPiece: 4.00,
        quantity: 1,
        totalCost: 4.00,
      },
    ],
    overheadCost: 2.40,
    overheadPercent: 30,
    trimsAndAccessories: 1.50,
    packaging: 0.80,
    freight: 0.50,
    otherCosts: 0.30,
    totalCost: 17.20,
    targetMarginPercent: 30,
    targetSellingPrice: 24.57,
    approvedBy: 'user-1',
    approvedAt: '2024-01-20',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
  },
];

export const mockActualCostings: ActualCosting[] = [
  {
    id: 'ac-1',
    code: 'AC-2024-001',
    productionOrderId: 'po-1',
    productionOrderCode: 'PO-2024-001',
    productId: 'prod-1',
    productCode: 'STY-001',
    productName: 'Classic White Shirt',
    productNameAr: 'قميص أبيض كلاسيكي',
    preCostingId: 'pc-1',
    preCostingCode: 'PC-2024-001',
    productionDate: '2024-03-15',
    quantityProduced: 1000,
    currency: 'USD',
    actualMaterialCost: 8.75,
    actualMaterialDetails: [],
    actualLaborCost: 3.50,
    actualLaborDetails: [],
    actualOverheadCost: 2.50,
    actualOtherCosts: 1.20,
    totalActualCost: 15.95,
    costPerUnit: 15.95,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
  },
];

export const mockCostVariances: CostVariance[] = [
  {
    id: 'cv-1',
    code: 'CV-2024-001',
    productionOrderId: 'po-1',
    productionOrderCode: 'PO-2024-001',
    preCostingId: 'pc-1',
    preCostingCode: 'PC-2024-001',
    actualCostingId: 'ac-1',
    actualCostingCode: 'AC-2024-001',
    productId: 'prod-1',
    productCode: 'STY-001',
    productName: 'Classic White Shirt',
    productNameAr: 'قميص أبيض كلاسيكي',
    quantity: 1000,
    currency: 'USD',
    materialVariance: 0.25,
    materialVariancePercent: 2.9,
    laborVariance: 0.30,
    laborVariancePercent: 9.4,
    overheadVariance: 0.10,
    overheadVariancePercent: 4.2,
    otherVariance: 0.40,
    otherVariancePercent: 33.3,
    totalVariance: 1.25,
    totalVariancePercent: 7.3,
    varianceType: 'unfavorable',
    rootCause: 'Material price increase and higher labor hours',
    rootCauseAr: 'زيادة سعر المواد وساعات العمل',
    createdAt: '2024-03-15',
  },
];

export const mockCostPerMinutes: CostPerMinute[] = [
  {
    id: 'cpm-1',
    productionLineId: 'line-2',
    productionLineName: 'Sewing Line 1',
    productionLineNameAr: 'خط الخياطة 1',
    date: '2024-03-15',
    totalMinutes: 48000,
    totalCost: 9600,
    costPerMinute: 0.20,
    currency: 'USD',
    breakdown: {
      labor: 7200,
      overhead: 1800,
      utilities: 400,
      depreciation: 200,
    },
    createdAt: '2024-03-15',
  },
];

export const mockCostPerStyles: CostPerStyle[] = [
  {
    id: 'cps-1',
    styleId: 'prod-1',
    styleCode: 'STY-001',
    styleName: 'Classic White Shirt',
    styleNameAr: 'قميص أبيض كلاسيكي',
    period: '2024-03',
    quantityProduced: 1000,
    totalCost: 15950,
    costPerUnit: 15.95,
    revenue: 24570,
    grossProfit: 8620,
    grossMargin: 35.1,
    netProfit: 6820,
    netMargin: 27.8,
    currency: 'USD',
    profitability: 'profitable',
    createdAt: '2024-03-31',
  },
  {
    id: 'cps-2',
    styleId: 'prod-2',
    styleCode: 'STY-002',
    styleName: 'Premium Denim Jeans',
    styleNameAr: 'بنطلون جينز ممتاز',
    period: '2024-03',
    quantityProduced: 800,
    totalCost: 21760,
    costPerUnit: 27.20,
    revenue: 44800,
    grossProfit: 23040,
    grossMargin: 51.4,
    netProfit: 19040,
    netMargin: 42.5,
    currency: 'USD',
    profitability: 'profitable',
    createdAt: '2024-03-31',
  },
];

// ==================== GENERAL LEDGER MOCK DATA ====================

export const mockChartOfAccounts: ChartOfAccount[] = [
  { id: 'acc-1', code: '1000', name: 'Cash', nameAr: 'النقدية', type: 'asset', category: 'Current Assets', isActive: true, balance: 125000, currency: 'USD', createdAt: '2024-01-01', updatedAt: '2024-03-20' },
  { id: 'acc-2', code: '1100', name: 'Accounts Receivable', nameAr: 'الذمم المدينة', type: 'asset', category: 'Current Assets', isActive: true, balance: 85000, currency: 'USD', createdAt: '2024-01-01', updatedAt: '2024-03-20' },
  { id: 'acc-3', code: '1200', name: 'Inventory', nameAr: 'المخزون', type: 'asset', category: 'Current Assets', isActive: true, balance: 150000, currency: 'USD', createdAt: '2024-01-01', updatedAt: '2024-03-20' },
  { id: 'acc-4', code: '2000', name: 'Accounts Payable', nameAr: 'الذمم الدائنة', type: 'liability', category: 'Current Liabilities', isActive: true, balance: 75000, currency: 'USD', createdAt: '2024-01-01', updatedAt: '2024-03-20' },
  { id: 'acc-5', code: '4000', name: 'Sales Revenue', nameAr: 'إيرادات المبيعات', type: 'revenue', category: 'Revenue', isActive: true, balance: 850000, currency: 'USD', createdAt: '2024-01-01', updatedAt: '2024-03-20' },
  { id: 'acc-6', code: '5000', name: 'Cost of Goods Sold', nameAr: 'تكلفة البضاعة المباعة', type: 'expense', category: 'COGS', isActive: true, balance: 510000, currency: 'USD', createdAt: '2024-01-01', updatedAt: '2024-03-20' },
];

export const mockJournalEntries: JournalEntry[] = [
  {
    id: 'je-1',
    entryNumber: 'JE-2024-001',
    date: '2024-03-20',
    description: 'Sales Invoice SO-2024-001',
    descriptionAr: 'فاتورة مبيعات SO-2024-001',
    referenceType: 'sales_order',
    referenceId: 'so-1',
    referenceNumber: 'SO-2024-001',
    status: 'posted',
    totalDebit: 81225,
    totalCredit: 81225,
    currency: 'USD',
    postedBy: 'user-1',
    postedAt: '2024-03-20',
    createdBy: 'user-1',
    createdAt: '2024-03-20',
    lines: [
      { id: 'jel-1', accountCode: '1100', accountName: 'Accounts Receivable', accountNameAr: 'الذمم المدينة', debit: 81225, credit: 0, description: 'Invoice SO-2024-001' },
      { id: 'jel-2', accountCode: '4000', accountName: 'Sales Revenue', accountNameAr: 'إيرادات المبيعات', debit: 0, credit: 81225, description: 'Sales Revenue' },
    ],
  },
  {
    id: 'je-2',
    entryNumber: 'JE-2024-002',
    date: '2024-03-19',
    description: 'Production Cost WO-2024-001',
    descriptionAr: 'تكلفة الإنتاج WO-2024-001',
    referenceType: 'production_order',
    referenceId: 'po-1',
    referenceNumber: 'PO-2024-001',
    status: 'posted',
    totalDebit: 45000,
    totalCredit: 45000,
    currency: 'USD',
    postedBy: 'user-1',
    postedAt: '2024-03-19',
    createdBy: 'user-1',
    createdAt: '2024-03-19',
    lines: [
      { id: 'jel-3', accountCode: '5000', accountName: 'Cost of Goods Sold', accountNameAr: 'تكلفة البضاعة المباعة', debit: 45000, credit: 0, description: 'Production Cost' },
      { id: 'jel-4', accountCode: '1200', accountName: 'Inventory', accountNameAr: 'المخزون', debit: 0, credit: 45000, description: 'Inventory Reduction' },
    ],
  },
];

export const mockAccountBalances: AccountBalance[] = [
  { id: 'ab-1', accountCode: '1000', accountName: 'Cash', accountNameAr: 'النقدية', accountType: 'asset', period: '2024-03', openingBalance: 100000, totalDebit: 50000, totalCredit: 25000, closingBalance: 125000, currency: 'USD' },
  { id: 'ab-2', accountCode: '4000', accountName: 'Sales Revenue', accountNameAr: 'إيرادات المبيعات', accountType: 'revenue', period: '2024-03', openingBalance: 750000, totalDebit: 0, totalCredit: 100000, closingBalance: 850000, currency: 'USD' },
];

// ==================== INVENTORY VALUATION MOCK DATA ====================

export const mockInventoryValuations: InventoryValuation[] = [
  { id: 'iv-1', materialId: 'mat-1', materialCode: 'FAB-001', materialName: 'Cotton Fabric 100%', materialNameAr: 'قماش قطني 100%', warehouseId: 'wh-1', warehouseName: 'Main Warehouse', valuationMethod: 'FIFO', quantity: 5000, unitCost: 3.00, totalValue: 15000, currency: 'USD', valuationDate: '2024-03-20', lastUpdated: '2024-03-20' },
  { id: 'iv-2', materialId: 'mat-2', materialCode: 'ZIP-001', materialName: 'Zipper 20cm', materialNameAr: 'سحاب 20 سم', warehouseId: 'wh-1', warehouseName: 'Main Warehouse', valuationMethod: 'Weighted Average', quantity: 10000, unitCost: 0.50, totalValue: 5000, currency: 'USD', valuationDate: '2024-03-20', lastUpdated: '2024-03-20' },
];

// ==================== TAX MANAGEMENT MOCK DATA ====================

export const mockTaxConfigurations: TaxConfiguration[] = [
  { id: 'tax-1', code: 'VAT-14', name: 'Value Added Tax 14%', nameAr: 'ضريبة القيمة المضافة 14%', type: 'VAT', rate: 14, effectiveFrom: '2024-01-01', isActive: true, appliesTo: 'both', accountCode: '2300', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'tax-2', code: 'CUSTOM-20', name: 'Custom Duty 20%', nameAr: 'رسوم جمركية 20%', type: 'Custom Duty', rate: 20, effectiveFrom: '2024-01-01', isActive: true, appliesTo: 'purchases', accountCode: '2400', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

export const mockTaxTransactions: TaxTransaction[] = [
  { id: 'tx-1', transactionNumber: 'TX-2024-001', taxConfigId: 'tax-1', taxCode: 'VAT-14', taxName: 'Value Added Tax 14%', taxNameAr: 'ضريبة القيمة المضافة 14%', transactionType: 'sales', referenceType: 'invoice', referenceId: 'inv-1', referenceNumber: 'INV-2024-001', date: '2024-03-20', subtotal: 70000, taxAmount: 9800, total: 79800, currency: 'USD', status: 'paid', paidDate: '2024-03-20', createdAt: '2024-03-20' },
];

// ==================== FINANCIAL REPORTS MOCK DATA ====================

export const mockProfitLossStatement: ProfitLossStatement = {
  id: 'pl-1',
  period: '2024-Q1',
  startDate: '2024-01-01',
  endDate: '2024-03-31',
  currency: 'USD',
  salesRevenue: 850000,
  otherIncome: 5000,
  totalRevenue: 855000,
  materialCost: 306000,
  laborCost: 153000,
  manufacturingOverhead: 51000,
  totalCOGS: 510000,
  grossProfit: 345000,
  grossMarginPercent: 40.4,
  salariesAndWages: 84000,
  rentAndUtilities: 24000,
  depreciation: 18000,
  marketing: 15000,
  administration: 21000,
  otherExpenses: 18000,
  totalOperatingExpenses: 180000,
  operatingIncome: 165000,
  operatingMarginPercent: 19.3,
  interestIncome: 2000,
  interestExpense: 5000,
  otherIncomeExpense: -1000,
  netIncomeBeforeTax: 161000,
  incomeTax: 32200,
  netIncome: 128800,
  netMarginPercent: 15.1,
  createdAt: '2024-04-01',
};

export const mockBalanceSheet: BalanceSheet = {
  id: 'bs-1',
  period: '2024-Q1',
  date: '2024-03-31',
  currency: 'USD',
  currentAssets: {
    cash: 125000,
    accountsReceivable: 85000,
    inventory: 150000,
    prepaidExpenses: 5000,
    otherCurrentAssets: 5000,
    total: 370000,
  },
  nonCurrentAssets: {
    propertyPlantEquipment: 500000,
    accumulatedDepreciation: 120000,
    netPPE: 380000,
    intangibleAssets: 30000,
    otherAssets: 10000,
    total: 420000,
  },
  totalAssets: 790000,
  currentLiabilities: {
    accountsPayable: 75000,
    shortTermDebt: 50000,
    accruedExpenses: 15000,
    taxesPayable: 32200,
    otherCurrentLiabilities: 8000,
    total: 173200,
  },
  nonCurrentLiabilities: {
    longTermDebt: 150000,
    otherLiabilities: 20000,
    total: 170000,
  },
  totalLiabilities: 343200,
  equity: {
    shareCapital: 300000,
    retainedEarnings: 161200,
    currentPeriodProfit: 128800,
    otherEquity: -43200,
    total: 446800,
  },
  totalLiabilitiesAndEquity: 790000,
  createdAt: '2024-04-01',
};

export const mockCashFlowStatement: CashFlowStatement = {
  id: 'cf-1',
  period: '2024-Q1',
  startDate: '2024-01-01',
  endDate: '2024-03-31',
  currency: 'USD',
  operatingActivities: {
    netIncome: 128800,
    depreciation: 18000,
    accountsReceivableChange: -25000,
    inventoryChange: -30000,
    accountsPayableChange: 20000,
    otherAdjustments: -5000,
    total: 106800,
  },
  investingActivities: {
    capitalExpenditure: -50000,
    assetSales: 0,
    investments: 0,
    other: 0,
    total: -50000,
  },
  financingActivities: {
    loanProceeds: 100000,
    loanRepayments: -25000,
    equityContributions: 0,
    dividends: -20000,
    other: -5000,
    total: 50000,
  },
  netCashFlow: 106800,
  openingCash: 100000,
  closingCash: 125000,
  createdAt: '2024-04-01',
};

export const mockCostPerLines: CostPerLine[] = [
  {
    id: 'cpl-1',
    lineId: 'line-1',
    lineCode: 'LINE-001',
    lineName: 'Cutting Line 1',
    lineNameAr: 'خط القص 1',
    period: '2024-03',
    totalMinutes: 48000,
    totalUnitsProduced: 4000,
    totalCost: 9600,
    costPerUnit: 2.40,
    costPerMinute: 0.20,
    breakdown: {
      labor: 7200,
      overhead: 1800,
      utilities: 400,
      depreciation: 200,
      maintenance: 0,
    },
    currency: 'USD',
    createdAt: '2024-03-31',
  },
  {
    id: 'cpl-2',
    lineId: 'line-2',
    lineCode: 'LINE-002',
    lineName: 'Sewing Line 1',
    lineNameAr: 'خط الخياطة 1',
    period: '2024-03',
    totalMinutes: 48000,
    totalUnitsProduced: 3000,
    totalCost: 12000,
    costPerUnit: 4.00,
    costPerMinute: 0.25,
    breakdown: {
      labor: 9000,
      overhead: 2250,
      utilities: 500,
      depreciation: 250,
      maintenance: 0,
    },
    currency: 'USD',
    createdAt: '2024-03-31',
  },
];

// ==================== GENERAL LEDGER TYPES ====================

export interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  category: string;
  parentId?: string;
  isActive: boolean;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  descriptionAr: string;
  referenceType?: 'purchase_order' | 'sales_order' | 'production_order' | 'payment' | 'receipt' | 'adjustment' | 'manual';
  referenceId?: string;
  referenceNumber?: string;
  status: 'draft' | 'posted' | 'reversed';
  lines: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
  currency: string;
  postedBy?: string;
  postedAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface JournalEntryLine {
  id: string;
  accountCode: string;
  accountName: string;
  accountNameAr: string;
  debit: number;
  credit: number;
  description?: string;
  descriptionAr?: string;
  costCenterId?: string;
  costCenterCode?: string;
  costCenterName?: string;
}

export interface AccountBalance {
  id: string;
  accountCode: string;
  accountName: string;
  accountNameAr: string;
  accountType: string;
  period: string; // '2024-03'
  openingBalance: number;
  totalDebit: number;
  totalCredit: number;
  closingBalance: number;
  currency: string;
}

// ==================== INVENTORY VALUATION TYPES ====================

export interface InventoryValuation {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialNameAr: string;
  warehouseId: string;
  warehouseName: string;
  valuationMethod: 'FIFO' | 'LIFO' | 'Weighted Average' | 'Standard Cost';
  quantity: number;
  unitCost: number;
  totalValue: number;
  currency: string;
  valuationDate: string;
  lastUpdated: string;
}

// ==================== TAX MANAGEMENT TYPES ====================

export interface TaxConfiguration {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  type: 'VAT' | 'Sales Tax' | 'Income Tax' | 'Custom Duty' | 'Withholding Tax';
  rate: number; // percentage
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  appliesTo: 'sales' | 'purchases' | 'both';
  accountCode: string; // GL account for tax
  createdAt: string;
  updatedAt: string;
}

export interface TaxTransaction {
  id: string;
  transactionNumber: string;
  taxConfigId: string;
  taxCode: string;
  taxName: string;
  taxNameAr: string;
  transactionType: 'sales' | 'purchase' | 'adjustment';
  referenceType: 'invoice' | 'purchase_order' | 'manual';
  referenceId: string;
  referenceNumber: string;
  date: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  currency: string;
  status: 'pending' | 'paid' | 'refunded' | 'cancelled';
  paidDate?: string;
  createdAt: string;
}

// ==================== FINANCIAL REPORTS TYPES ====================

export interface ProfitLossStatement {
  id: string;
  period: string; // '2024-Q1', '2024-03'
  startDate: string;
  endDate: string;
  currency: string;
  
  // Revenue
  salesRevenue: number;
  otherIncome: number;
  totalRevenue: number;
  
  // Cost of Goods Sold
  materialCost: number;
  laborCost: number;
  manufacturingOverhead: number;
  totalCOGS: number;
  
  // Gross Profit
  grossProfit: number;
  grossMarginPercent: number;
  
  // Operating Expenses
  salariesAndWages: number;
  rentAndUtilities: number;
  depreciation: number;
  marketing: number;
  administration: number;
  otherExpenses: number;
  totalOperatingExpenses: number;
  
  // Operating Income
  operatingIncome: number;
  operatingMarginPercent: number;
  
  // Other Income/Expenses
  interestIncome: number;
  interestExpense: number;
  otherIncomeExpense: number;
  
  // Net Income
  netIncomeBeforeTax: number;
  incomeTax: number;
  netIncome: number;
  netMarginPercent: number;
  
  createdAt: string;
}

export interface BalanceSheet {
  id: string;
  period: string;
  date: string;
  currency: string;
  
  // Assets
  currentAssets: {
    cash: number;
    accountsReceivable: number;
    inventory: number;
    prepaidExpenses: number;
    otherCurrentAssets: number;
    total: number;
  };
  
  nonCurrentAssets: {
    propertyPlantEquipment: number;
    accumulatedDepreciation: number;
    netPPE: number;
    intangibleAssets: number;
    otherAssets: number;
    total: number;
  };
  
  totalAssets: number;
  
  // Liabilities
  currentLiabilities: {
    accountsPayable: number;
    shortTermDebt: number;
    accruedExpenses: number;
    taxesPayable: number;
    otherCurrentLiabilities: number;
    total: number;
  };
  
  nonCurrentLiabilities: {
    longTermDebt: number;
    otherLiabilities: number;
    total: number;
  };
  
  totalLiabilities: number;
  
  // Equity
  equity: {
    shareCapital: number;
    retainedEarnings: number;
    currentPeriodProfit: number;
    otherEquity: number;
    total: number;
  };
  
  totalLiabilitiesAndEquity: number;
  
  createdAt: string;
}

export interface CashFlowStatement {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  currency: string;
  
  // Operating Activities
  operatingActivities: {
    netIncome: number;
    depreciation: number;
    accountsReceivableChange: number;
    inventoryChange: number;
    accountsPayableChange: number;
    otherAdjustments: number;
    total: number;
  };
  
  // Investing Activities
  investingActivities: {
    capitalExpenditure: number;
    assetSales: number;
    investments: number;
    other: number;
    total: number;
  };
  
  // Financing Activities
  financingActivities: {
    loanProceeds: number;
    loanRepayments: number;
    equityContributions: number;
    dividends: number;
    other: number;
    total: number;
  };
  
  netCashFlow: number;
  openingCash: number;
  closingCash: number;
  
  createdAt: string;
}

export interface CostPerLine {
  id: string;
  lineId: string;
  lineCode: string;
  lineName: string;
  lineNameAr: string;
  period: string; // '2024-03'
  totalMinutes: number;
  totalUnitsProduced: number;
  totalCost: number;
  costPerUnit: number;
  costPerMinute: number;
  breakdown: {
    labor: number;
    overhead: number;
    utilities: number;
    depreciation: number;
    maintenance: number;
  };
  currency: string;
  createdAt: string;
}

// ==================== ACCOUNTS RECEIVABLE ====================

export interface AccountsReceivable {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerCode: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  currency: string;
  status: 'open' | 'partial' | 'paid' | 'overdue' | 'written_off';
  agingDays: number;
  paymentTerms: string;
  lastPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ARPayment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  paymentDate: string;
  amount: number;
  currency: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'check' | 'credit_card' | 'other';
  referenceNumber?: string;
  bankName?: string;
  checkNumber?: string;
  status: 'pending' | 'cleared' | 'bounced' | 'cancelled';
  clearedDate?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

// ==================== ACCOUNTS PAYABLE ====================

export interface AccountsPayable {
  id: string;
  billId: string;
  billNumber: string;
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  billDate: string;
  dueDate: string;
  billAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  currency: string;
  status: 'open' | 'partial' | 'paid' | 'overdue';
  agingDays: number;
  paymentTerms: string;
  lastPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface APPayment {
  id: string;
  paymentNumber: string;
  billId: string;
  billNumber: string;
  supplierId: string;
  supplierName: string;
  paymentDate: string;
  amount: number;
  currency: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'check' | 'credit_card' | 'other';
  referenceNumber?: string;
  bankName?: string;
  checkNumber?: string;
  status: 'pending' | 'cleared' | 'bounced' | 'cancelled';
  clearedDate?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

// ==================== BANK MANAGEMENT ====================

export interface BankAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  bankNameAr: string;
  accountName: string;
  accountNameAr: string;
  accountType: 'checking' | 'savings' | 'current' | 'deposit';
  currency: string;
  openingBalance: number;
  currentBalance: number;
  glAccountCode: string;
  glAccountName: string;
  isActive: boolean;
  bankAddress?: string;
  bankSwiftCode?: string;
  bankIBAN?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankTransaction {
  id: string;
  transactionNumber: string;
  bankAccountId: string;
  bankAccountNumber: string;
  transactionDate: string;
  valueDate: string;
  transactionType: 'deposit' | 'withdrawal' | 'transfer' | 'fee' | 'interest' | 'other';
  amount: number;
  currency: string;
  balance: number;
  description: string;
  descriptionAr: string;
  referenceNumber?: string;
  checkNumber?: string;
  status: 'pending' | 'cleared' | 'reconciled' | 'cancelled';
  reconciledDate?: string;
  reconciledBy?: string;
  createdAt: string;
}

export interface BankReconciliation {
  id: string;
  reconciliationNumber: string;
  bankAccountId: string;
  bankAccountNumber: string;
  statementDate: string;
  statementBalance: number;
  bookBalance: number;
  outstandingDeposits: number;
  outstandingWithdrawals: number;
  adjustedBalance: number;
  difference: number;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  transactions: BankReconciliationTransaction[];
  notes?: string;
  reconciledBy?: string;
  reconciledAt?: string;
  createdAt: string;
}

export interface BankReconciliationTransaction {
  id: string;
  bankTransactionId: string;
  transactionNumber: string;
  transactionDate: string;
  amount: number;
  transactionType: 'deposit' | 'withdrawal';
  isMatched: boolean;
  matchedJournalEntryId?: string;
  matchedJournalEntryNumber?: string;
}

// ==================== BUDGET MANAGEMENT ====================

export interface Budget {
  id: string;
  budgetNumber: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  budgetType: 'annual' | 'quarterly' | 'monthly' | 'project' | 'department';
  period: {
    startDate: string;
    endDate: string;
  };
  status: 'draft' | 'approved' | 'active' | 'closed' | 'cancelled';
  totalBudget: number;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  currency: string;
  costCenterId?: string;
  costCenterCode?: string;
  costCenterName?: string;
  projectId?: string;
  projectCode?: string;
  projectName?: string;
  items: BudgetItem[];
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetItem {
  id: string;
  accountCode: string;
  accountName: string;
  accountNameAr: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  notes?: string;
}

// ==================== FISCAL PERIODS ====================

export interface FiscalPeriod {
  id: string;
  periodCode: string;
  periodName: string;
  periodNameAr: string;
  startDate: string;
  endDate: string;
  status: 'open' | 'closed' | 'locked';
  isCurrentPeriod: boolean;
  closingDate?: string;
  closedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface PeriodClosing {
  id: string;
  closingNumber: string;
  periodId: string;
  periodCode: string;
  closingDate: string;
  status: 'draft' | 'in_progress' | 'completed' | 'reversed';
  closingType: 'monthly' | 'quarterly' | 'yearly';
  retainedEarnings: number;
  netIncome: number;
  closingEntries: JournalEntry[];
  closedBy?: string;
  closedAt?: string;
  reversedBy?: string;
  reversedAt?: string;
  notes?: string;
  createdAt: string;
}

// ==================== AGING REPORTS ====================

export interface AgingReport {
  id: string;
  reportNumber: string;
  reportType: 'receivable' | 'payable';
  asOfDate: string;
  currency: string;
  items: AgingReportItem[];
  totals: {
    current: number;
    days30: number;
    days60: number;
    days90: number;
    over90: number;
    total: number;
  };
  createdAt: string;
}

export interface AgingReportItem {
  id: string;
  customerId?: string;
  customerName?: string;
  customerCode?: string;
  supplierId?: string;
  supplierName?: string;
  supplierCode?: string;
  invoiceNumber?: string;
  billNumber?: string;
  invoiceDate?: string;
  billDate?: string;
  dueDate: string;
  originalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  current: number;
  days30: number;
  days60: number;
  days90: number;
  over90: number;
  agingDays: number;
}

// ==================== TRIAL BALANCE ====================

export interface TrialBalance {
  id: string;
  reportNumber: string;
  asOfDate: string;
  period: string;
  currency: string;
  items: TrialBalanceItem[];
  totals: {
    totalDebit: number;
    totalCredit: number;
    difference: number;
  };
  createdAt: string;
}

export interface TrialBalanceItem {
  id: string;
  accountCode: string;
  accountName: string;
  accountNameAr: string;
  accountType: string;
  openingBalance: number;
  debit: number;
  credit: number;
  closingBalance: number;
}

// ==================== MOCK DATA ====================

export const mockAccountsReceivable: AccountsReceivable[] = [
  {
    id: 'ar-1',
    invoiceId: 'inv-1',
    invoiceNumber: 'INV-2024-001',
    customerId: 'buyer-1',
    customerName: 'Fashion Retail Chain',
    customerCode: 'BUY-001',
    invoiceDate: '2024-03-15',
    dueDate: '2024-05-14',
    invoiceAmount: 81725,
    paidAmount: 40000,
    outstandingAmount: 41725,
    currency: 'USD',
    status: 'partial',
    agingDays: 15,
    paymentTerms: 'Net 60',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-20',
  },
];

export const mockARPayments: ARPayment[] = [
  {
    id: 'arp-1',
    paymentNumber: 'AR-PAY-2024-001',
    invoiceId: 'inv-1',
    invoiceNumber: 'INV-2024-001',
    customerId: 'buyer-1',
    customerName: 'Fashion Retail Chain',
    paymentDate: '2024-04-01',
    amount: 40000,
    currency: 'USD',
    paymentMethod: 'bank_transfer',
    referenceNumber: 'TXN-123456',
    bankName: 'Chase Bank',
    status: 'cleared',
    clearedDate: '2024-04-02',
    createdBy: 'user-1',
    createdAt: '2024-04-01',
  },
];

export const mockAccountsPayable: AccountsPayable[] = [
  {
    id: 'ap-1',
    billId: 'bill-1',
    billNumber: 'BILL-2024-001',
    supplierId: 'sup-1',
    supplierName: 'Fabric Supplier Inc.',
    supplierCode: 'SUP-001',
    billDate: '2024-03-10',
    dueDate: '2024-04-09',
    billAmount: 50000,
    paidAmount: 0,
    outstandingAmount: 50000,
    currency: 'USD',
    status: 'open',
    agingDays: 25,
    paymentTerms: 'Net 30',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10',
  },
];

export const mockAPPayments: APPayment[] = [];

export const mockBankAccounts: BankAccount[] = [
  {
    id: 'bank-1',
    accountNumber: 'ACC-001',
    bankName: 'Chase Bank',
    bankNameAr: 'بنك تشيس',
    accountName: 'Main Operating Account',
    accountNameAr: 'الحساب التشغيلي الرئيسي',
    accountType: 'checking',
    currency: 'USD',
    openingBalance: 100000,
    currentBalance: 125000,
    glAccountCode: '1000',
    glAccountName: 'Cash',
    isActive: true,
    bankSwiftCode: 'CHASUS33',
    createdAt: '2024-01-01',
    updatedAt: '2024-03-20',
  },
];

export const mockBankTransactions: BankTransaction[] = [
  {
    id: 'bt-1',
    transactionNumber: 'BT-2024-001',
    bankAccountId: 'bank-1',
    bankAccountNumber: 'ACC-001',
    transactionDate: '2024-03-20',
    valueDate: '2024-03-20',
    transactionType: 'deposit',
    amount: 40000,
    currency: 'USD',
    balance: 125000,
    description: 'Customer Payment - INV-2024-001',
    descriptionAr: 'دفعة عميل - INV-2024-001',
    referenceNumber: 'TXN-123456',
    status: 'cleared',
    createdAt: '2024-03-20',
  },
];

export const mockBudgets: Budget[] = [
  {
    id: 'budget-1',
    budgetNumber: 'BUD-2024-001',
    name: '2024 Annual Budget',
    nameAr: 'ميزانية 2024 السنوية',
    description: 'Annual operating budget for 2024',
    descriptionAr: 'الميزانية التشغيلية السنوية لعام 2024',
    budgetType: 'annual',
    period: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    status: 'active',
    totalBudget: 1000000,
    allocatedAmount: 850000,
    spentAmount: 680000,
    remainingAmount: 170000,
    currency: 'USD',
    items: [
      {
        id: 'bi-1',
        accountCode: '5000',
        accountName: 'Cost of Goods Sold',
        accountNameAr: 'تكلفة البضاعة المباعة',
        budgetAmount: 600000,
        spentAmount: 510000,
        remainingAmount: 90000,
      },
    ],
    createdBy: 'user-1',
    createdAt: '2024-01-01',
    updatedAt: '2024-03-20',
  },
];

export const mockFiscalPeriods: FiscalPeriod[] = [
  {
    id: 'fp-1',
    periodCode: '2024-Q1',
    periodName: 'Q1 2024',
    periodNameAr: 'الربع الأول 2024',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    status: 'closed',
    isCurrentPeriod: false,
    closingDate: '2024-04-01',
    closedBy: 'user-1',
    createdAt: '2024-01-01',
  },
  {
    id: 'fp-2',
    periodCode: '2024-Q2',
    periodName: 'Q2 2024',
    periodNameAr: 'الربع الثاني 2024',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    status: 'open',
    isCurrentPeriod: true,
    createdAt: '2024-04-01',
  },
];

// Helper functions
export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
export const calculateVariance = (actual: number, standard: number) => actual - standard;
export const calculateVariancePercent = (actual: number, standard: number) => {
  if (standard === 0) return 0;
  return ((actual - standard) / standard) * 100;
};
export const calculateMargin = (revenue: number, cost: number) => revenue - cost;
export const calculateMarginPercent = (revenue: number, cost: number) => {
  if (revenue === 0) return 0;
  return ((revenue - cost) / revenue) * 100;
};

