// ==================== CORE TYPES ====================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== PLM TYPES ====================

export interface Product extends BaseEntity {
  code: string;
  name: string;
  nameAr: string;
  category: string;
  description: string;
  status: 'draft' | 'active' | 'discontinued';
  season: string;
  targetCost: number;
  actualCost?: number;
  imageUrl?: string;
  bomId?: string;
  techPackUrl?: string;
}

export interface BOMItem {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  wastagePercent: number;
}

export interface BillOfMaterials extends BaseEntity {
  productId: string;
  version: number;
  status: 'draft' | 'approved' | 'archived';
  items: BOMItem[];
  totalCost: number;
  approvedBy?: string;
  approvedAt?: string;
}

export interface SizeChart extends BaseEntity {
  productId: string;
  name: string;
  sizes: string[];
  measurements: Record<string, Record<string, number>>;
}

// ==================== INVENTORY TYPES ====================

export interface Warehouse extends BaseEntity {
  code: string;
  name: string;
  nameAr: string;
  location: string;
  capacity: number;
  usedCapacity: number;
  type: 'raw_materials' | 'finished_goods' | 'wip';
  isActive: boolean;
}

export interface Material extends BaseEntity {
  code: string;
  name: string;
  nameAr: string;
  category: 'fabric' | 'trim' | 'accessory' | 'packaging';
  unit: string;
  unitCost: number;
  supplierId?: string;
  minStock: number;
  maxStock: number;
  leadTimeDays: number;
}

export interface StockItem extends BaseEntity {
  materialId: string;
  warehouseId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  batchNumber?: string;
  expiryDate?: string;
  location: string;
}

export interface StockMovement extends BaseEntity {
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  materialId: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  quantity: number;
  reason: string;
  referenceType?: 'purchase_order' | 'work_order' | 'sales_order';
  referenceId?: string;
  performedBy: string;
}

// ==================== PRODUCTION TYPES ====================

export interface ProductionLine extends BaseEntity {
  code: string;
  name: string;
  nameAr: string;
  type: 'cutting' | 'sewing' | 'finishing' | 'packing';
  capacity: number;
  efficiency: number;
  status: 'active' | 'maintenance' | 'idle';
  supervisorId?: string;
}

export interface WorkOrder extends BaseEntity {
  orderNumber: string;
  productId: string;
  salesOrderId?: string;
  quantity: number;
  completedQuantity: number;
  defectQuantity: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  productionLineId?: string;
  assignedTo?: string[];
  notes?: string;
}

export interface ProductionStage extends BaseEntity {
  workOrderId: string;
  stage: 'cutting' | 'sewing' | 'finishing' | 'qc' | 'packing';
  status: 'pending' | 'in_progress' | 'completed';
  inputQuantity: number;
  outputQuantity: number;
  defectQuantity: number;
  startTime?: string;
  endTime?: string;
  operatorIds: string[];
}

// ==================== QUALITY TYPES ====================

export interface QualityInspection extends BaseEntity {
  type: 'incoming' | 'inline' | 'final';
  referenceType: 'purchase_order' | 'work_order' | 'production_stage';
  referenceId: string;
  inspectorId: string;
  sampleSize: number;
  defectsFound: number;
  status: 'pending' | 'passed' | 'failed' | 'conditional';
  aqlLevel: string;
  notes?: string;
}

export interface Defect extends BaseEntity {
  inspectionId: string;
  workOrderId?: string;
  type: string;
  severity: 'minor' | 'major' | 'critical';
  quantity: number;
  description: string;
  imageUrls?: string[];
  resolution?: 'rework' | 'reject' | 'accept';
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface QualityStandard extends BaseEntity {
  name: string;
  category: string;
  aqlLevel: string;
  sampleSizeCode: string;
  acceptCriteria: number;
  rejectCriteria: number;
  isActive: boolean;
}

// ==================== HRM TYPES ====================

export interface Employee extends BaseEntity {
  employeeId: string;
  firstName: string;
  lastName: string;
  firstNameAr: string;
  lastNameAr: string;
  email: string;
  phone: string;
  departmentId: string;
  position: string;
  positionAr: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  salary: number;
  hourlyRate: number;
  supervisorId?: string;
  skills: string[];
  imageUrl?: string;
}

export interface Department extends BaseEntity {
  code: string;
  name: string;
  nameAr: string;
  managerId?: string;
  parentId?: string;
  employeeCount: number;
}

export interface Attendance extends BaseEntity {
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
  overtimeHours: number;
  notes?: string;
}

export interface Shift extends BaseEntity {
  name: string;
  nameAr: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  workDays: number[];
}

export interface PayrollRecord extends BaseEntity {
  employeeId: string;
  period: string;
  baseSalary: number;
  overtimePay: number;
  bonus: number;
  deductions: number;
  netPay: number;
  status: 'draft' | 'approved' | 'paid';
  paidAt?: string;
}

// ==================== ACCOUNTING TYPES ====================

export interface CostCenter extends BaseEntity {
  code: string;
  name: string;
  nameAr: string;
  type: 'production' | 'overhead' | 'admin' | 'sales';
  budget: number;
  spent: number;
  parentId?: string;
}

export interface LedgerEntry extends BaseEntity {
  date: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  referenceType?: string;
  referenceId?: string;
  costCenterId?: string;
}

export interface Invoice extends BaseEntity {
  invoiceNumber: string;
  type: 'sales' | 'purchase';
  entityId: string;
  entityName: string;
  date: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  paidAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ==================== PROCUREMENT TYPES ====================

export interface Supplier extends BaseEntity {
  code: string;
  name: string;
  nameAr: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  rating: number;
  status: 'active' | 'inactive' | 'blacklisted';
  paymentTerms: string;
  leadTimeDays: number;
  categories: string[];
}

export interface PurchaseOrder extends BaseEntity {
  poNumber: string;
  supplierId: string;
  status: 'draft' | 'sent' | 'confirmed' | 'partially_received' | 'completed' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  subtotal: number;
  tax: number;
  total: number;
  items: PurchaseOrderItem[];
  notes?: string;
}

export interface PurchaseOrderItem {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  receivedQuantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface PurchaseRequisition extends BaseEntity {
  requisitionNumber: string;
  requestedBy: string;
  departmentId: string;
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  urgency: 'low' | 'medium' | 'high';
  items: { materialId: string; quantity: number; reason: string }[];
  approvedBy?: string;
  approvedAt?: string;
}

// ==================== SALES TYPES ====================

export interface Customer extends BaseEntity {
  code: string;
  name: string;
  nameAr: string;
  type: 'wholesale' | 'retail' | 'export';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  creditLimit: number;
  currentBalance: number;
  paymentTerms: string;
  status: 'active' | 'inactive';
}

export interface SalesOrder extends BaseEntity {
  orderNumber: string;
  customerId: string;
  status: 'draft' | 'confirmed' | 'in_production' | 'ready' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  requiredDate: string;
  shippedDate?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  items: SalesOrderItem[];
  shippingAddress: string;
  notes?: string;
}

export interface SalesOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  producedQuantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  size?: string;
  color?: string;
}

export interface PriceList extends BaseEntity {
  name: string;
  type: 'wholesale' | 'retail' | 'export';
  currency: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  items: { productId: string; price: number; minQuantity?: number }[];
}

// ==================== IOT TYPES ====================

export interface Machine extends BaseEntity {
  code: string;
  name: string;
  nameAr: string;
  type: 'sewing' | 'cutting' | 'pressing' | 'embroidery' | 'other';
  model: string;
  manufacturer: string;
  serialNumber: string;
  productionLineId?: string;
  status: 'running' | 'idle' | 'maintenance' | 'breakdown';
  purchaseDate: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  operatorId?: string;
}

export interface MachineMetrics extends BaseEntity {
  machineId: string;
  timestamp: string;
  status: 'running' | 'idle' | 'maintenance' | 'breakdown';
  speed: number;
  temperature?: number;
  powerConsumption: number;
  cycleCount: number;
  efficiency: number;
}

export interface MaintenanceRecord extends BaseEntity {
  machineId: string;
  type: 'preventive' | 'corrective' | 'breakdown';
  description: string;
  performedBy: string;
  startTime: string;
  endTime?: string;
  cost: number;
  partsReplaced?: string[];
  notes?: string;
}

export interface OEERecord extends BaseEntity {
  machineId: string;
  date: string;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  plannedProductionTime: number;
  actualRunTime: number;
  totalOutput: number;
  goodOutput: number;
}

// ==================== DASHBOARD TYPES ====================

export interface KPIMetric {
  id: string;
  name: string;
  nameAr: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease';
  unit: string;
  target?: number;
  status: 'good' | 'warning' | 'critical';
}

export interface DashboardData {
  kpis: KPIMetric[];
  productionSummary: {
    totalOrders: number;
    completedOrders: number;
    inProgressOrders: number;
    efficiency: number;
  };
  inventorySummary: {
    totalItems: number;
    lowStockItems: number;
    totalValue: number;
  };
  salesSummary: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
  };
  qualitySummary: {
    inspectionsToday: number;
    passRate: number;
    defectsFound: number;
  };
}



