// ==================== INVENTORY COMPREHENSIVE DATA ====================

export interface RawMaterial {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  type: 'fabric' | 'accessory' | 'component' | 'packaging' | 'chemical';
  category: string;
  subcategory: string;
  unit: string;
  unitCost: number;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  leadTimeDays: number;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  warehouseName: string;
  location: string; // Shelf/Bin location
  expiryDate?: string;
  status: 'active' | 'low_stock' | 'out_of_stock' | 'discontinued';
  lastReceived?: string;
  lastIssued?: string;
  specifications?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  type: 'raw_materials' | 'finished_goods' | 'wip' | 'quarantine' | 'returns';
  location: string;
  address: string;
  capacity: number;
  usedCapacity: number;
  managerId: string;
  managerName: string;
  contactPhone: string;
  isActive: boolean;
  zones: WarehouseZone[];
  createdAt: string;
}

export interface WarehouseZone {
  id: string;
  code: string;
  name: string;
  type: 'storage' | 'receiving' | 'shipping' | 'quality' | 'staging';
  capacity: number;
  usedCapacity: number;
  temperature?: string;
  humidity?: string;
}

export interface Batch {
  id: string;
  batchNumber: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialNameAr: string;
  quantity: number;
  remainingQuantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplierId: string;
  supplierName: string;
  supplierBatchNumber?: string;
  poNumber: string;
  receivedDate: string;
  productionDate?: string;
  expiryDate?: string;
  warehouseId: string;
  warehouseName: string;
  location: string;
  qualityStatus: 'pending' | 'approved' | 'rejected' | 'quarantine';
  inspectionId?: string;
  certificateUrl?: string;
  notes?: string;
  traceability: TraceabilityRecord[];
  createdAt: string;
}

export interface TraceabilityRecord {
  id: string;
  timestamp: string;
  action: 'received' | 'inspected' | 'approved' | 'rejected' | 'issued' | 'returned' | 'transferred' | 'adjusted';
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  performedBy: string;
  referenceType?: 'work_order' | 'transfer' | 'adjustment' | 'return';
  referenceId?: string;
  notes?: string;
}

export interface StockMovement {
  id: string;
  type: 'receipt' | 'issue' | 'transfer' | 'adjustment' | 'return';
  materialId: string;
  materialCode: string;
  materialName: string;
  batchId?: string;
  batchNumber?: string;
  quantity: number;
  unit: string;
  fromWarehouseId?: string;
  fromWarehouseName?: string;
  fromLocation?: string;
  toWarehouseId?: string;
  toWarehouseName?: string;
  toLocation?: string;
  referenceType: 'po' | 'work_order' | 'transfer_order' | 'adjustment' | 'return';
  referenceId: string;
  referenceNumber: string;
  reason?: string;
  performedBy: string;
  performedByName: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface TransferOrder {
  id: string;
  transferNumber: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  status: 'draft' | 'pending' | 'in_transit' | 'received' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestedBy: string;
  requestedByName: string;
  requestedDate: string;
  expectedDate: string;
  completedDate?: string;
  items: TransferItem[];
  notes?: string;
  createdAt: string;
}

export interface TransferItem {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  batchId?: string;
  batchNumber?: string;
  requestedQty: number;
  transferredQty: number;
  receivedQty: number;
  unit: string;
  status: 'pending' | 'picked' | 'in_transit' | 'received' | 'partial';
}

export interface InventoryAdjustment {
  id: string;
  adjustmentNumber: string;
  type: 'physical_count' | 'damage' | 'expiry' | 'correction' | 'write_off';
  warehouseId: string;
  warehouseName: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  adjustmentDate: string;
  performedBy: string;
  performedByName: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  items: AdjustmentItem[];
  totalVariance: number;
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface AdjustmentItem {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  batchId?: string;
  batchNumber?: string;
  location: string;
  systemQty: number;
  countedQty: number;
  variance: number;
  unit: string;
  unitCost: number;
  varianceCost: number;
  reason?: string;
}

export interface DefectRecord {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  batchId: string;
  batchNumber: string;
  defectType: string;
  severity: 'minor' | 'major' | 'critical';
  quantity: number;
  unit: string;
  description: string;
  descriptionAr: string;
  detectedBy: string;
  detectedByName: string;
  detectedDate: string;
  warehouseId: string;
  warehouseName: string;
  status: 'reported' | 'under_review' | 'confirmed' | 'resolved';
  resolution?: string;
  dispositionAction?: 'use_as_is' | 'rework' | 'return_supplier' | 'scrap';
  images?: string[];
  createdAt: string;
}

export interface BarcodeItem {
  id: string;
  barcode: string;
  qrCode?: string;
  type: 'material' | 'batch' | 'location' | 'pallet';
  referenceId: string;
  referenceName: string;
  printedDate: string;
  printedBy: string;
  isActive: boolean;
}

export interface InventoryValuation {
  id: string;
  valuationDate: string;
  warehouseId: string;
  warehouseName: string;
  method: 'fifo' | 'lifo' | 'weighted_avg' | 'specific';
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  status: 'draft' | 'finalized';
  performedBy: string;
  items: ValuationItem[];
  createdAt: string;
}

export interface ValuationItem {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalValue: number;
  batches: { batchId: string; batchNumber: string; qty: number; cost: number }[];
}

// ==================== MOCK DATA ====================

export const mockWarehouses: Warehouse[] = [
  {
    id: 'wh-1',
    code: 'WH-RM-01',
    name: 'Raw Materials Warehouse',
    nameAr: 'مستودع المواد الخام',
    type: 'raw_materials',
    location: 'Building A, Zone 1',
    address: 'Industrial Area, Block 5',
    capacity: 10000,
    usedCapacity: 7500,
    managerId: 'emp-1',
    managerName: 'Ahmed Hassan',
    contactPhone: '+971501234567',
    isActive: true,
    zones: [
      { id: 'z1', code: 'A', name: 'Fabric Storage', type: 'storage', capacity: 5000, usedCapacity: 4000 },
      { id: 'z2', code: 'B', name: 'Trim Storage', type: 'storage', capacity: 3000, usedCapacity: 2500 },
      { id: 'z3', code: 'R', name: 'Receiving Area', type: 'receiving', capacity: 1000, usedCapacity: 500 },
      { id: 'z4', code: 'Q', name: 'Quality Check', type: 'quality', capacity: 1000, usedCapacity: 500 },
    ],
    createdAt: '2023-01-01',
  },
  {
    id: 'wh-2',
    code: 'WH-FG-01',
    name: 'Finished Goods Warehouse',
    nameAr: 'مستودع المنتجات النهائية',
    type: 'finished_goods',
    location: 'Building B, Zone 2',
    address: 'Industrial Area, Block 6',
    capacity: 15000,
    usedCapacity: 9200,
    managerId: 'emp-2',
    managerName: 'Fatima Ali',
    contactPhone: '+971502345678',
    isActive: true,
    zones: [
      { id: 'z5', code: 'F1', name: 'Finished Goods A', type: 'storage', capacity: 7000, usedCapacity: 5000 },
      { id: 'z6', code: 'F2', name: 'Finished Goods B', type: 'storage', capacity: 5000, usedCapacity: 3200 },
      { id: 'z7', code: 'S', name: 'Shipping Area', type: 'shipping', capacity: 3000, usedCapacity: 1000 },
    ],
    createdAt: '2023-01-01',
  },
  {
    id: 'wh-3',
    code: 'WH-QR-01',
    name: 'Quarantine Warehouse',
    nameAr: 'مستودع الحجر',
    type: 'quarantine',
    location: 'Building C',
    address: 'Industrial Area, Block 7',
    capacity: 2000,
    usedCapacity: 450,
    managerId: 'emp-3',
    managerName: 'Mohamed Ibrahim',
    contactPhone: '+971503456789',
    isActive: true,
    zones: [
      { id: 'z8', code: 'Q1', name: 'Inspection Hold', type: 'quality', capacity: 1000, usedCapacity: 300 },
      { id: 'z9', code: 'Q2', name: 'Defect Hold', type: 'quality', capacity: 1000, usedCapacity: 150 },
    ],
    createdAt: '2023-06-01',
  },
];

export const mockRawMaterials: RawMaterial[] = [
  {
    id: 'mat-1',
    code: 'FAB-COT-001',
    name: '100% Cotton Fabric - White',
    nameAr: 'قماش قطن 100% - أبيض',
    type: 'fabric',
    category: 'Cotton',
    subcategory: 'Plain Weave',
    unit: 'meters',
    unitCost: 5.50,
    currentStock: 2500,
    reservedStock: 500,
    availableStock: 2000,
    minStock: 500,
    maxStock: 5000,
    reorderPoint: 800,
    leadTimeDays: 14,
    supplierId: 'sup-1',
    supplierName: 'Fabric World Inc.',
    warehouseId: 'wh-1',
    warehouseName: 'Raw Materials Warehouse',
    location: 'A-01-01',
    status: 'active',
    lastReceived: '2024-03-15',
    lastIssued: '2024-03-18',
    specifications: 'Weight: 140gsm, Width: 150cm, Shrinkage: <3%',
    createdAt: '2023-01-15',
    updatedAt: '2024-03-18',
  },
  {
    id: 'mat-2',
    code: 'FAB-COT-002',
    name: '100% Cotton Fabric - Navy',
    nameAr: 'قماش قطن 100% - كحلي',
    type: 'fabric',
    category: 'Cotton',
    subcategory: 'Plain Weave',
    unit: 'meters',
    unitCost: 5.75,
    currentStock: 1800,
    reservedStock: 300,
    availableStock: 1500,
    minStock: 400,
    maxStock: 4000,
    reorderPoint: 600,
    leadTimeDays: 14,
    supplierId: 'sup-1',
    supplierName: 'Fabric World Inc.',
    warehouseId: 'wh-1',
    warehouseName: 'Raw Materials Warehouse',
    location: 'A-01-02',
    status: 'active',
    lastReceived: '2024-03-10',
    lastIssued: '2024-03-17',
    specifications: 'Weight: 140gsm, Width: 150cm, Shrinkage: <3%',
    createdAt: '2023-01-15',
    updatedAt: '2024-03-17',
  },
  {
    id: 'mat-3',
    code: 'FAB-DEN-001',
    name: 'Stretch Denim Fabric - Indigo',
    nameAr: 'قماش دنيم مطاط - نيلي',
    type: 'fabric',
    category: 'Denim',
    subcategory: 'Stretch',
    unit: 'meters',
    unitCost: 8.00,
    currentStock: 1200,
    reservedStock: 400,
    availableStock: 800,
    minStock: 300,
    maxStock: 3000,
    reorderPoint: 500,
    leadTimeDays: 21,
    supplierId: 'sup-2',
    supplierName: 'Denim Masters Ltd.',
    warehouseId: 'wh-1',
    warehouseName: 'Raw Materials Warehouse',
    location: 'A-02-01',
    status: 'active',
    lastReceived: '2024-03-05',
    lastIssued: '2024-03-16',
    specifications: 'Weight: 280gsm, Width: 145cm, Stretch: 2%',
    createdAt: '2023-02-10',
    updatedAt: '2024-03-16',
  },
  {
    id: 'mat-4',
    code: 'TRM-BTN-001',
    name: 'Metal Buttons 18L',
    nameAr: 'أزرار معدنية 18L',
    type: 'accessory',
    category: 'Buttons',
    subcategory: 'Metal',
    unit: 'pieces',
    unitCost: 0.15,
    currentStock: 25000,
    reservedStock: 5000,
    availableStock: 20000,
    minStock: 10000,
    maxStock: 50000,
    reorderPoint: 15000,
    leadTimeDays: 7,
    supplierId: 'sup-3',
    supplierName: 'Button Factory Co.',
    warehouseId: 'wh-1',
    warehouseName: 'Raw Materials Warehouse',
    location: 'B-01-01',
    status: 'active',
    lastReceived: '2024-03-12',
    lastIssued: '2024-03-18',
    specifications: '4-hole, nickel finish',
    createdAt: '2023-01-20',
    updatedAt: '2024-03-18',
  },
  {
    id: 'mat-5',
    code: 'TRM-ZIP-001',
    name: 'YKK Zipper 18cm',
    nameAr: 'سحاب YKK 18سم',
    type: 'accessory',
    category: 'Zippers',
    subcategory: 'Metal',
    unit: 'pieces',
    unitCost: 0.45,
    currentStock: 8000,
    reservedStock: 1500,
    availableStock: 6500,
    minStock: 3000,
    maxStock: 20000,
    reorderPoint: 5000,
    leadTimeDays: 10,
    supplierId: 'sup-4',
    supplierName: 'YKK Distributors',
    warehouseId: 'wh-1',
    warehouseName: 'Raw Materials Warehouse',
    location: 'B-02-01',
    status: 'active',
    lastReceived: '2024-03-08',
    lastIssued: '2024-03-17',
    specifications: 'Brass teeth, auto-lock slider',
    createdAt: '2023-01-25',
    updatedAt: '2024-03-17',
  },
  {
    id: 'mat-6',
    code: 'TRM-THD-001',
    name: 'Poly-core Thread - White',
    nameAr: 'خيط بولي كور - أبيض',
    type: 'accessory',
    category: 'Thread',
    subcategory: 'Poly-core',
    unit: 'cones',
    unitCost: 2.50,
    currentStock: 350,
    reservedStock: 50,
    availableStock: 300,
    minStock: 100,
    maxStock: 1000,
    reorderPoint: 150,
    leadTimeDays: 5,
    supplierId: 'sup-5',
    supplierName: 'Thread Solutions',
    warehouseId: 'wh-1',
    warehouseName: 'Raw Materials Warehouse',
    location: 'B-03-01',
    status: 'low_stock',
    lastReceived: '2024-02-28',
    lastIssued: '2024-03-18',
    specifications: 'Tex 40, 5000m per cone',
    createdAt: '2023-02-01',
    updatedAt: '2024-03-18',
  },
  {
    id: 'mat-7',
    code: 'PKG-BOX-001',
    name: 'Shirt Packaging Box',
    nameAr: 'صندوق تغليف قميص',
    type: 'packaging',
    category: 'Boxes',
    subcategory: 'Shirt',
    unit: 'pieces',
    unitCost: 0.35,
    currentStock: 5000,
    reservedStock: 1000,
    availableStock: 4000,
    minStock: 2000,
    maxStock: 15000,
    reorderPoint: 3000,
    leadTimeDays: 7,
    supplierId: 'sup-6',
    supplierName: 'Packaging Pro',
    warehouseId: 'wh-2',
    warehouseName: 'Finished Goods Warehouse',
    location: 'F1-01-01',
    status: 'active',
    lastReceived: '2024-03-01',
    lastIssued: '2024-03-15',
    specifications: '30x22x3cm, white cardboard',
    createdAt: '2023-03-01',
    updatedAt: '2024-03-15',
  },
  {
    id: 'mat-8',
    code: 'FAB-LIN-001',
    name: 'Fusible Interlining',
    nameAr: 'بطانة لاصقة',
    type: 'component',
    category: 'Interlining',
    subcategory: 'Fusible',
    unit: 'meters',
    unitCost: 1.20,
    currentStock: 180,
    reservedStock: 50,
    availableStock: 130,
    minStock: 200,
    maxStock: 2000,
    reorderPoint: 300,
    leadTimeDays: 10,
    supplierId: 'sup-7',
    supplierName: 'Interlining Corp.',
    warehouseId: 'wh-1',
    warehouseName: 'Raw Materials Warehouse',
    location: 'A-03-01',
    status: 'low_stock',
    lastReceived: '2024-02-20',
    lastIssued: '2024-03-18',
    specifications: 'Weight: 40gsm, Width: 90cm',
    createdAt: '2023-02-15',
    updatedAt: '2024-03-18',
  },
];

export const mockBatches: Batch[] = [
  {
    id: 'batch-1',
    batchNumber: 'BT-2024-001',
    materialId: 'mat-1',
    materialCode: 'FAB-COT-001',
    materialName: '100% Cotton Fabric - White',
    materialNameAr: 'قماش قطن 100% - أبيض',
    quantity: 1000,
    remainingQuantity: 750,
    unit: 'meters',
    unitCost: 5.50,
    totalCost: 5500,
    supplierId: 'sup-1',
    supplierName: 'Fabric World Inc.',
    supplierBatchNumber: 'FW-2024-0156',
    poNumber: 'PO-2024-0045',
    receivedDate: '2024-03-15',
    productionDate: '2024-03-01',
    expiryDate: '2026-03-01',
    warehouseId: 'wh-1',
    warehouseName: 'Raw Materials Warehouse',
    location: 'A-01-01',
    qualityStatus: 'approved',
    inspectionId: 'insp-001',
    notes: 'High quality batch, passed all tests',
    traceability: [
      { id: 't1', timestamp: '2024-03-15T09:00:00Z', action: 'received', quantity: 1000, toLocation: 'R-01', performedBy: 'Ahmed Hassan', referenceType: 'work_order', referenceId: 'PO-2024-0045' },
      { id: 't2', timestamp: '2024-03-15T14:00:00Z', action: 'inspected', quantity: 1000, fromLocation: 'R-01', toLocation: 'Q-01', performedBy: 'QC Team' },
      { id: 't3', timestamp: '2024-03-16T10:00:00Z', action: 'approved', quantity: 1000, fromLocation: 'Q-01', toLocation: 'A-01-01', performedBy: 'QC Manager' },
      { id: 't4', timestamp: '2024-03-18T08:00:00Z', action: 'issued', quantity: 250, fromLocation: 'A-01-01', performedBy: 'Warehouse Staff', referenceType: 'work_order', referenceId: 'WO-2024-0089' },
    ],
    createdAt: '2024-03-15',
  },
  {
    id: 'batch-2',
    batchNumber: 'BT-2024-002',
    materialId: 'mat-1',
    materialCode: 'FAB-COT-001',
    materialName: '100% Cotton Fabric - White',
    materialNameAr: 'قماش قطن 100% - أبيض',
    quantity: 1500,
    remainingQuantity: 1500,
    unit: 'meters',
    unitCost: 5.45,
    totalCost: 8175,
    supplierId: 'sup-1',
    supplierName: 'Fabric World Inc.',
    supplierBatchNumber: 'FW-2024-0189',
    poNumber: 'PO-2024-0052',
    receivedDate: '2024-03-20',
    productionDate: '2024-03-10',
    warehouseId: 'wh-1',
    warehouseName: 'Raw Materials Warehouse',
    location: 'A-01-02',
    qualityStatus: 'pending',
    notes: 'Awaiting quality inspection',
    traceability: [
      { id: 't5', timestamp: '2024-03-20T10:00:00Z', action: 'received', quantity: 1500, toLocation: 'R-01', performedBy: 'Ahmed Hassan', referenceType: 'work_order', referenceId: 'PO-2024-0052' },
    ],
    createdAt: '2024-03-20',
  },
  {
    id: 'batch-3',
    batchNumber: 'BT-2024-003',
    materialId: 'mat-4',
    materialCode: 'TRM-BTN-001',
    materialName: 'Metal Buttons 18L',
    materialNameAr: 'أزرار معدنية 18L',
    quantity: 10000,
    remainingQuantity: 8500,
    unit: 'pieces',
    unitCost: 0.15,
    totalCost: 1500,
    supplierId: 'sup-3',
    supplierName: 'Button Factory Co.',
    supplierBatchNumber: 'BF-BTN-2024-078',
    poNumber: 'PO-2024-0048',
    receivedDate: '2024-03-12',
    warehouseId: 'wh-1',
    warehouseName: 'Raw Materials Warehouse',
    location: 'B-01-01',
    qualityStatus: 'approved',
    inspectionId: 'insp-002',
    traceability: [
      { id: 't6', timestamp: '2024-03-12T09:00:00Z', action: 'received', quantity: 10000, toLocation: 'R-01', performedBy: 'Ahmed Hassan' },
      { id: 't7', timestamp: '2024-03-12T15:00:00Z', action: 'approved', quantity: 10000, fromLocation: 'R-01', toLocation: 'B-01-01', performedBy: 'QC Team' },
      { id: 't8', timestamp: '2024-03-18T11:00:00Z', action: 'issued', quantity: 1500, fromLocation: 'B-01-01', performedBy: 'Warehouse Staff', referenceType: 'work_order', referenceId: 'WO-2024-0089' },
    ],
    createdAt: '2024-03-12',
  },
  {
    id: 'batch-4',
    batchNumber: 'BT-2024-004',
    materialId: 'mat-6',
    materialCode: 'TRM-THD-001',
    materialName: 'Poly-core Thread - White',
    materialNameAr: 'خيط بولي كور - أبيض',
    quantity: 200,
    remainingQuantity: 150,
    unit: 'cones',
    unitCost: 2.50,
    totalCost: 500,
    supplierId: 'sup-5',
    supplierName: 'Thread Solutions',
    poNumber: 'PO-2024-0041',
    receivedDate: '2024-02-28',
    expiryDate: '2025-02-28',
    warehouseId: 'wh-1',
    warehouseName: 'Raw Materials Warehouse',
    location: 'B-03-01',
    qualityStatus: 'approved',
    traceability: [
      { id: 't9', timestamp: '2024-02-28T10:00:00Z', action: 'received', quantity: 200, toLocation: 'B-03-01', performedBy: 'Ahmed Hassan' },
      { id: 't10', timestamp: '2024-03-18T09:00:00Z', action: 'issued', quantity: 50, fromLocation: 'B-03-01', performedBy: 'Warehouse Staff', referenceType: 'work_order', referenceId: 'WO-2024-0089' },
    ],
    createdAt: '2024-02-28',
  },
];

export const mockStockMovements: StockMovement[] = [
  {
    id: 'mov-1',
    type: 'receipt',
    materialId: 'mat-1',
    materialCode: 'FAB-COT-001',
    materialName: '100% Cotton Fabric - White',
    batchId: 'batch-1',
    batchNumber: 'BT-2024-001',
    quantity: 1000,
    unit: 'meters',
    toWarehouseId: 'wh-1',
    toWarehouseName: 'Raw Materials Warehouse',
    toLocation: 'A-01-01',
    referenceType: 'po',
    referenceId: 'PO-2024-0045',
    referenceNumber: 'PO-2024-0045',
    performedBy: 'emp-1',
    performedByName: 'Ahmed Hassan',
    timestamp: '2024-03-15T09:00:00Z',
    status: 'completed',
  },
  {
    id: 'mov-2',
    type: 'issue',
    materialId: 'mat-1',
    materialCode: 'FAB-COT-001',
    materialName: '100% Cotton Fabric - White',
    batchId: 'batch-1',
    batchNumber: 'BT-2024-001',
    quantity: 250,
    unit: 'meters',
    fromWarehouseId: 'wh-1',
    fromWarehouseName: 'Raw Materials Warehouse',
    fromLocation: 'A-01-01',
    referenceType: 'work_order',
    referenceId: 'WO-2024-0089',
    referenceNumber: 'WO-2024-0089',
    performedBy: 'emp-1',
    performedByName: 'Ahmed Hassan',
    timestamp: '2024-03-18T08:00:00Z',
    status: 'completed',
  },
  {
    id: 'mov-3',
    type: 'transfer',
    materialId: 'mat-7',
    materialCode: 'PKG-BOX-001',
    materialName: 'Shirt Packaging Box',
    quantity: 500,
    unit: 'pieces',
    fromWarehouseId: 'wh-1',
    fromWarehouseName: 'Raw Materials Warehouse',
    fromLocation: 'B-04-01',
    toWarehouseId: 'wh-2',
    toWarehouseName: 'Finished Goods Warehouse',
    toLocation: 'F1-01-01',
    referenceType: 'transfer_order',
    referenceId: 'TO-2024-0012',
    referenceNumber: 'TO-2024-0012',
    performedBy: 'emp-2',
    performedByName: 'Fatima Ali',
    timestamp: '2024-03-17T14:00:00Z',
    status: 'completed',
  },
];

export const mockTransferOrders: TransferOrder[] = [
  {
    id: 'to-1',
    transferNumber: 'TO-2024-0015',
    fromWarehouseId: 'wh-1',
    fromWarehouseName: 'Raw Materials Warehouse',
    toWarehouseId: 'wh-2',
    toWarehouseName: 'Finished Goods Warehouse',
    status: 'pending',
    priority: 'medium',
    requestedBy: 'emp-2',
    requestedByName: 'Fatima Ali',
    requestedDate: '2024-03-20',
    expectedDate: '2024-03-22',
    items: [
      { id: 'ti-1', materialId: 'mat-7', materialCode: 'PKG-BOX-001', materialName: 'Shirt Packaging Box', requestedQty: 1000, transferredQty: 0, receivedQty: 0, unit: 'pieces', status: 'pending' },
    ],
    notes: 'Urgent - needed for shipment',
    createdAt: '2024-03-20',
  },
  {
    id: 'to-2',
    transferNumber: 'TO-2024-0014',
    fromWarehouseId: 'wh-1',
    fromWarehouseName: 'Raw Materials Warehouse',
    toWarehouseId: 'wh-3',
    toWarehouseName: 'Quarantine Warehouse',
    status: 'in_transit',
    priority: 'high',
    requestedBy: 'emp-3',
    requestedByName: 'Mohamed Ibrahim',
    requestedDate: '2024-03-19',
    expectedDate: '2024-03-19',
    items: [
      { id: 'ti-2', materialId: 'mat-3', materialCode: 'FAB-DEN-001', materialName: 'Stretch Denim Fabric', batchId: 'batch-x', batchNumber: 'BT-2024-X', requestedQty: 50, transferredQty: 50, receivedQty: 0, unit: 'meters', status: 'in_transit' },
    ],
    notes: 'Quality issue detected - move to quarantine',
    createdAt: '2024-03-19',
  },
];

export const mockDefects: DefectRecord[] = [
  {
    id: 'def-1',
    materialId: 'mat-3',
    materialCode: 'FAB-DEN-001',
    materialName: 'Stretch Denim Fabric',
    batchId: 'batch-x',
    batchNumber: 'BT-2024-X',
    defectType: 'Color Variation',
    severity: 'major',
    quantity: 50,
    unit: 'meters',
    description: 'Color shade differs from approved sample',
    descriptionAr: 'درجة اللون تختلف عن العينة المعتمدة',
    detectedBy: 'emp-3',
    detectedByName: 'Mohamed Ibrahim',
    detectedDate: '2024-03-19',
    warehouseId: 'wh-1',
    warehouseName: 'Raw Materials Warehouse',
    status: 'under_review',
    createdAt: '2024-03-19',
  },
  {
    id: 'def-2',
    materialId: 'mat-4',
    materialCode: 'TRM-BTN-001',
    materialName: 'Metal Buttons 18L',
    batchId: 'batch-y',
    batchNumber: 'BT-2024-Y',
    defectType: 'Surface Scratch',
    severity: 'minor',
    quantity: 200,
    unit: 'pieces',
    description: 'Minor scratches on surface',
    descriptionAr: 'خدوش طفيفة على السطح',
    detectedBy: 'emp-3',
    detectedByName: 'Mohamed Ibrahim',
    detectedDate: '2024-03-18',
    warehouseId: 'wh-1',
    warehouseName: 'Raw Materials Warehouse',
    status: 'confirmed',
    resolution: 'Use for internal samples only',
    dispositionAction: 'use_as_is',
    createdAt: '2024-03-18',
  },
];

export const mockInventoryValuations: InventoryValuation[] = [
  {
    id: 'val-1',
    valuationDate: '2024-03-31',
    warehouseId: 'wh-1',
    warehouseName: 'Raw Materials Warehouse',
    method: 'fifo',
    totalItems: 8,
    totalQuantity: 38730,
    totalValue: 52847.50,
    status: 'finalized',
    performedBy: 'Finance Team',
    items: [
      { id: 'vi-1', materialId: 'mat-1', materialCode: 'FAB-COT-001', materialName: '100% Cotton Fabric - White', quantity: 2500, unit: 'meters', unitCost: 5.48, totalValue: 13700, batches: [{ batchId: 'batch-1', batchNumber: 'BT-2024-001', qty: 750, cost: 5.50 }, { batchId: 'batch-2', batchNumber: 'BT-2024-002', qty: 1500, cost: 5.45 }] },
      { id: 'vi-2', materialId: 'mat-4', materialCode: 'TRM-BTN-001', materialName: 'Metal Buttons 18L', quantity: 25000, unit: 'pieces', unitCost: 0.15, totalValue: 3750, batches: [{ batchId: 'batch-3', batchNumber: 'BT-2024-003', qty: 8500, cost: 0.15 }] },
    ],
    createdAt: '2024-03-31',
  },
];

// Helper functions
export const getMaterialName = (material: RawMaterial, lang: string) => lang === 'ar' ? material.nameAr : material.name;
export const getWarehouseName = (warehouse: Warehouse, lang: string) => lang === 'ar' ? warehouse.nameAr : warehouse.name;
export const getMaterialsByType = (type: RawMaterial['type']) => mockRawMaterials.filter(m => m.type === type);
export const getMaterialsByWarehouse = (warehouseId: string) => mockRawMaterials.filter(m => m.warehouseId === warehouseId);
export const getBatchesByMaterial = (materialId: string) => mockBatches.filter(b => b.materialId === materialId);
export const getLowStockMaterials = () => mockRawMaterials.filter(m => m.status === 'low_stock' || m.currentStock <= m.reorderPoint);
export const getExpiringBatches = (days: number) => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  return mockBatches.filter(b => b.expiryDate && new Date(b.expiryDate) <= futureDate);
};



