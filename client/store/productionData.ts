// ==================== PRODUCTION MES DATA TYPES ====================

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerNameAr: string;
  styleId: string;
  styleName: string;
  styleNumber: string;
  orderQuantity: number;
  completedQuantity: number;
  unit: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'confirmed' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  deliveryDate: string;
  salesOrderRef: string;
  notes?: string;
  colorVariants: ProductionColorVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductionColorVariant {
  colorId: string;
  colorName: string;
  colorNameAr: string;
  hexCode: string;
  quantity: number;
  completedQty: number;
  sizes: ProductionSizeBreakdown[];
}

export interface ProductionSizeBreakdown {
  size: string;
  quantity: number;
  completedQty: number;
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  productionOrderId: string;
  productionOrderNumber: string;
  stage: ProductionStage;
  stageOrder: number;
  lineId: string;
  lineName: string;
  styleNumber: string;
  styleName: string;
  targetQuantity: number;
  completedQuantity: number;
  goodQuantity: number;
  defectQuantity: number;
  reworkQuantity: number;
  unit: string;
  status: 'pending' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedOperators: string[];
  assignedOperatorNames: string[];
  plannedStartTime: string;
  plannedEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  estimatedDuration: number; // minutes
  actualDuration?: number;
  materials: WorkOrderMaterial[];
  instructions?: string;
  instructionsAr?: string;
  notes?: string;
  createdAt: string;
}

export interface WorkOrderMaterial {
  materialId: string;
  materialCode: string;
  materialName: string;
  requiredQty: number;
  issuedQty: number;
  consumedQty: number;
  unit: string;
  batchNumber?: string;
}

export type ProductionStage = 'cutting' | 'sewing' | 'washing' | 'finishing' | 'pressing' | 'packing' | 'quality_check';

export interface ProductionLine {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  type: 'cutting' | 'sewing' | 'finishing' | 'packing' | 'multi';
  capacity: number;
  currentLoad: number;
  efficiency: number;
  operatorCount: number;
  maxOperators: number;
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  supervisorId: string;
  supervisorName: string;
  machines: LineMachine[];
  currentWorkOrderId?: string;
  location: string;
  createdAt: string;
}

export interface LineMachine {
  id: string;
  machineId: string;
  machineName: string;
  machineType: string;
  position: number;
  status: 'running' | 'idle' | 'maintenance' | 'error';
  operatorId?: string;
  operatorName?: string;
}

export interface WIPRecord {
  id: string;
  workOrderId: string;
  workOrderNumber: string;
  productionOrderId: string;
  productionOrderNumber: string;
  stage: ProductionStage;
  previousStage?: ProductionStage;
  quantity: number;
  location: string;
  lineId?: string;
  lineName?: string;
  status: 'in_queue' | 'in_process' | 'completed' | 'blocked';
  enteredAt: string;
  exitedAt?: string;
  dwellTime?: number; // minutes
  operatorId?: string;
  operatorName?: string;
  batchNumber: string;
  serialStart?: string;
  serialEnd?: string;
  notes?: string;
}

export interface ProductionDefect {
  id: string;
  workOrderId: string;
  workOrderNumber: string;
  productionOrderId: string;
  stage: ProductionStage;
  defectType: string;
  defectCode: string;
  severity: 'minor' | 'major' | 'critical';
  quantity: number;
  description: string;
  descriptionAr: string;
  rootCause?: string;
  detectedBy: string;
  detectedByName: string;
  detectedAt: string;
  lineId: string;
  lineName: string;
  operatorId?: string;
  operatorName?: string;
  status: 'reported' | 'confirmed' | 'in_rework' | 'resolved' | 'scrapped';
  reworkRequired: boolean;
  reworkInstructions?: string;
  images?: string[];
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
}

export interface ReworkOrder {
  id: string;
  reworkNumber: string;
  defectId: string;
  workOrderId: string;
  productionOrderId: string;
  stage: ProductionStage;
  quantity: number;
  reworkedQty: number;
  scrapQty: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  assignedToName: string;
  instructions: string;
  instructionsAr: string;
  estimatedTime: number; // minutes
  actualTime?: number;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface ProductionProgress {
  id: string;
  workOrderId: string;
  stage: ProductionStage;
  timestamp: string;
  quantity: number;
  operatorId: string;
  operatorName: string;
  lineId: string;
  lineName: string;
  hourlyTarget: number;
  hourlyActual: number;
  efficiency: number;
  notes?: string;
}

export interface StageConfig {
  id: string;
  stage: ProductionStage;
  name: string;
  nameAr: string;
  order: number;
  color: string;
  icon: string;
  standardTime: number; // minutes per unit
  isActive: boolean;
  requiredSkills: string[];
  qualityCheckpoints: string[];
}

export interface BatchTracker {
  id: string;
  batchNumber: string;
  productionOrderId: string;
  workOrderId: string;
  quantity: number;
  currentStage: ProductionStage;
  currentLocation: string;
  serialStart: string;
  serialEnd: string;
  status: 'active' | 'completed' | 'on_hold';
  history: BatchHistory[];
  createdAt: string;
}

export interface BatchHistory {
  timestamp: string;
  stage: ProductionStage;
  action: string;
  quantity: number;
  operatorId: string;
  operatorName: string;
  location: string;
  notes?: string;
}

// ==================== MOCK DATA ====================

export const stageConfigs: StageConfig[] = [
  { id: 's1', stage: 'cutting', name: 'Cutting', nameAr: 'القص', order: 1, color: '#ef4444', icon: 'Scissors', standardTime: 2, isActive: true, requiredSkills: ['Cutting Machine', 'Pattern Reading'], qualityCheckpoints: ['Fabric alignment', 'Size accuracy'] },
  { id: 's2', stage: 'sewing', name: 'Sewing', nameAr: 'الخياطة', order: 2, color: '#3b82f6', icon: 'Needle', standardTime: 15, isActive: true, requiredSkills: ['Sewing Machine', 'Assembly'], qualityCheckpoints: ['Seam quality', 'Stitch count'] },
  { id: 's3', stage: 'washing', name: 'Washing', nameAr: 'الغسيل', order: 3, color: '#06b6d4', icon: 'Droplets', standardTime: 30, isActive: true, requiredSkills: ['Washing Machine', 'Chemical handling'], qualityCheckpoints: ['Color fastness', 'Shrinkage'] },
  { id: 's4', stage: 'finishing', name: 'Finishing', nameAr: 'التشطيب', order: 4, color: '#8b5cf6', icon: 'Sparkles', standardTime: 5, isActive: true, requiredSkills: ['Thread trimming', 'Button attach'], qualityCheckpoints: ['Loose threads', 'Button security'] },
  { id: 's5', stage: 'pressing', name: 'Pressing', nameAr: 'الكي', order: 5, color: '#f59e0b', icon: 'Flame', standardTime: 3, isActive: true, requiredSkills: ['Steam press', 'Iron'], qualityCheckpoints: ['Wrinkle-free', 'Shape'] },
  { id: 's6', stage: 'quality_check', name: 'Quality Check', nameAr: 'فحص الجودة', order: 6, color: '#10b981', icon: 'CheckCircle', standardTime: 2, isActive: true, requiredSkills: ['QC inspection', 'AQL'], qualityCheckpoints: ['Final inspection', 'Measurements'] },
  { id: 's7', stage: 'packing', name: 'Packing', nameAr: 'التعبئة', order: 7, color: '#6366f1', icon: 'Package', standardTime: 2, isActive: true, requiredSkills: ['Folding', 'Labeling'], qualityCheckpoints: ['Label accuracy', 'Package quality'] },
];

export const mockProductionLines: ProductionLine[] = [
  {
    id: 'line-1',
    code: 'CUT-01',
    name: 'Cutting Line 1',
    nameAr: 'خط القص 1',
    type: 'cutting',
    capacity: 500,
    currentLoad: 350,
    efficiency: 92,
    operatorCount: 4,
    maxOperators: 6,
    status: 'active',
    supervisorId: 'emp-1',
    supervisorName: 'Ahmed Hassan',
    machines: [
      { id: 'm1', machineId: 'mc-1', machineName: 'Auto Cutter 1', machineType: 'Auto Cutter', position: 1, status: 'running', operatorId: 'emp-10', operatorName: 'Ali' },
      { id: 'm2', machineId: 'mc-2', machineName: 'Spreading Table 1', machineType: 'Spreading', position: 2, status: 'running', operatorId: 'emp-11', operatorName: 'Omar' },
    ],
    currentWorkOrderId: 'wo-1',
    location: 'Building A, Floor 1',
    createdAt: '2023-01-01',
  },
  {
    id: 'line-2',
    code: 'SEW-01',
    name: 'Sewing Line 1',
    nameAr: 'خط الخياطة 1',
    type: 'sewing',
    capacity: 300,
    currentLoad: 280,
    efficiency: 88,
    operatorCount: 25,
    maxOperators: 30,
    status: 'active',
    supervisorId: 'emp-2',
    supervisorName: 'Fatima Ali',
    machines: [
      { id: 'm3', machineId: 'mc-3', machineName: 'Single Needle 1', machineType: 'Single Needle', position: 1, status: 'running' },
      { id: 'm4', machineId: 'mc-4', machineName: 'Overlock 1', machineType: 'Overlock', position: 2, status: 'running' },
      { id: 'm5', machineId: 'mc-5', machineName: 'Flatlock 1', machineType: 'Flatlock', position: 3, status: 'idle' },
    ],
    currentWorkOrderId: 'wo-2',
    location: 'Building A, Floor 2',
    createdAt: '2023-01-01',
  },
  {
    id: 'line-3',
    code: 'SEW-02',
    name: 'Sewing Line 2',
    nameAr: 'خط الخياطة 2',
    type: 'sewing',
    capacity: 350,
    currentLoad: 200,
    efficiency: 75,
    operatorCount: 20,
    maxOperators: 30,
    status: 'active',
    supervisorId: 'emp-3',
    supervisorName: 'Mohamed Ibrahim',
    machines: [],
    location: 'Building A, Floor 2',
    createdAt: '2023-01-01',
  },
  {
    id: 'line-4',
    code: 'FIN-01',
    name: 'Finishing Line 1',
    nameAr: 'خط التشطيب 1',
    type: 'finishing',
    capacity: 400,
    currentLoad: 320,
    efficiency: 90,
    operatorCount: 10,
    maxOperators: 15,
    status: 'active',
    supervisorId: 'emp-4',
    supervisorName: 'Sara Ahmed',
    machines: [],
    location: 'Building B, Floor 1',
    createdAt: '2023-01-01',
  },
  {
    id: 'line-5',
    code: 'PACK-01',
    name: 'Packing Line 1',
    nameAr: 'خط التعبئة 1',
    type: 'packing',
    capacity: 600,
    currentLoad: 450,
    efficiency: 95,
    operatorCount: 8,
    maxOperators: 10,
    status: 'active',
    supervisorId: 'emp-5',
    supervisorName: 'Layla Hassan',
    machines: [],
    location: 'Building B, Floor 1',
    createdAt: '2023-01-01',
  },
];

export const mockProductionOrders: ProductionOrder[] = [
  {
    id: 'po-1',
    orderNumber: 'PO-2024-0001',
    customerName: 'Fashion Retail Co.',
    customerNameAr: 'شركة فاشون للبيع بالتجزئة',
    styleId: 'style-1',
    styleName: 'Classic T-Shirt',
    styleNumber: 'STY-2024-001',
    orderQuantity: 5000,
    completedQuantity: 3200,
    unit: 'pieces',
    priority: 'high',
    status: 'in_progress',
    plannedStartDate: '2024-03-01',
    plannedEndDate: '2024-03-15',
    actualStartDate: '2024-03-02',
    deliveryDate: '2024-03-20',
    salesOrderRef: 'SO-2024-0089',
    colorVariants: [
      {
        colorId: 'c1', colorName: 'White', colorNameAr: 'أبيض', hexCode: '#FFFFFF', quantity: 2500, completedQty: 1800,
        sizes: [{ size: 'S', quantity: 500, completedQty: 400 }, { size: 'M', quantity: 1000, completedQty: 700 }, { size: 'L', quantity: 700, completedQty: 500 }, { size: 'XL', quantity: 300, completedQty: 200 }]
      },
      {
        colorId: 'c2', colorName: 'Navy', colorNameAr: 'كحلي', hexCode: '#1e3a5f', quantity: 2500, completedQty: 1400,
        sizes: [{ size: 'S', quantity: 500, completedQty: 300 }, { size: 'M', quantity: 1000, completedQty: 600 }, { size: 'L', quantity: 700, completedQty: 350 }, { size: 'XL', quantity: 300, completedQty: 150 }]
      },
    ],
    createdAt: '2024-02-25',
    updatedAt: '2024-03-18',
  },
  {
    id: 'po-2',
    orderNumber: 'PO-2024-0002',
    customerName: 'Urban Style Ltd.',
    customerNameAr: 'أوربان ستايل المحدودة',
    styleId: 'style-2',
    styleName: 'Slim Fit Jeans',
    styleNumber: 'STY-2024-005',
    orderQuantity: 3000,
    completedQuantity: 800,
    unit: 'pieces',
    priority: 'medium',
    status: 'in_progress',
    plannedStartDate: '2024-03-10',
    plannedEndDate: '2024-03-25',
    actualStartDate: '2024-03-11',
    deliveryDate: '2024-03-30',
    salesOrderRef: 'SO-2024-0095',
    colorVariants: [
      {
        colorId: 'c3', colorName: 'Indigo', colorNameAr: 'نيلي', hexCode: '#3f51b5', quantity: 2000, completedQty: 500,
        sizes: [{ size: '30', quantity: 400, completedQty: 100 }, { size: '32', quantity: 800, completedQty: 200 }, { size: '34', quantity: 600, completedQty: 150 }, { size: '36', quantity: 200, completedQty: 50 }]
      },
      {
        colorId: 'c4', colorName: 'Black', colorNameAr: 'أسود', hexCode: '#000000', quantity: 1000, completedQty: 300,
        sizes: [{ size: '30', quantity: 200, completedQty: 60 }, { size: '32', quantity: 400, completedQty: 120 }, { size: '34', quantity: 300, completedQty: 90 }, { size: '36', quantity: 100, completedQty: 30 }]
      },
    ],
    createdAt: '2024-03-05',
    updatedAt: '2024-03-18',
  },
  {
    id: 'po-3',
    orderNumber: 'PO-2024-0003',
    customerName: 'Elegance Boutique',
    customerNameAr: 'بوتيك إليجانس',
    styleId: 'style-3',
    styleName: 'Summer Dress',
    styleNumber: 'STY-2024-012',
    orderQuantity: 1500,
    completedQuantity: 0,
    unit: 'pieces',
    priority: 'low',
    status: 'confirmed',
    plannedStartDate: '2024-03-25',
    plannedEndDate: '2024-04-05',
    deliveryDate: '2024-04-10',
    salesOrderRef: 'SO-2024-0102',
    colorVariants: [
      {
        colorId: 'c5', colorName: 'Floral Pink', colorNameAr: 'وردي زهري', hexCode: '#f8bbd9', quantity: 1500, completedQty: 0,
        sizes: [{ size: 'S', quantity: 300, completedQty: 0 }, { size: 'M', quantity: 600, completedQty: 0 }, { size: 'L', quantity: 450, completedQty: 0 }, { size: 'XL', quantity: 150, completedQty: 0 }]
      },
    ],
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
  },
];

export const mockWorkOrders: WorkOrder[] = [
  {
    id: 'wo-1',
    workOrderNumber: 'WO-2024-0001',
    productionOrderId: 'po-1',
    productionOrderNumber: 'PO-2024-0001',
    stage: 'cutting',
    stageOrder: 1,
    lineId: 'line-1',
    lineName: 'Cutting Line 1',
    styleNumber: 'STY-2024-001',
    styleName: 'Classic T-Shirt',
    targetQuantity: 5000,
    completedQuantity: 4500,
    goodQuantity: 4450,
    defectQuantity: 50,
    reworkQuantity: 30,
    unit: 'pieces',
    status: 'in_progress',
    priority: 'high',
    assignedOperators: ['emp-10', 'emp-11', 'emp-12'],
    assignedOperatorNames: ['Ali', 'Omar', 'Hassan'],
    plannedStartTime: '2024-03-02T06:00:00Z',
    plannedEndTime: '2024-03-04T18:00:00Z',
    actualStartTime: '2024-03-02T06:30:00Z',
    estimatedDuration: 2160,
    materials: [
      { materialId: 'mat-1', materialCode: 'FAB-COT-001', materialName: '100% Cotton Fabric - White', requiredQty: 2750, issuedQty: 2800, consumedQty: 2650, unit: 'meters' },
      { materialId: 'mat-2', materialCode: 'FAB-COT-002', materialName: '100% Cotton Fabric - Navy', requiredQty: 2750, issuedQty: 2800, consumedQty: 2500, unit: 'meters' },
    ],
    instructions: 'Cut according to marker plan v2.1. Ensure grain line alignment.',
    instructionsAr: 'قص حسب خطة الماركر v2.1. تأكد من محاذاة خط الخيوط.',
    createdAt: '2024-03-01',
  },
  {
    id: 'wo-2',
    workOrderNumber: 'WO-2024-0002',
    productionOrderId: 'po-1',
    productionOrderNumber: 'PO-2024-0001',
    stage: 'sewing',
    stageOrder: 2,
    lineId: 'line-2',
    lineName: 'Sewing Line 1',
    styleNumber: 'STY-2024-001',
    styleName: 'Classic T-Shirt',
    targetQuantity: 4500,
    completedQuantity: 3500,
    goodQuantity: 3420,
    defectQuantity: 80,
    reworkQuantity: 60,
    unit: 'pieces',
    status: 'in_progress',
    priority: 'high',
    assignedOperators: ['emp-20', 'emp-21', 'emp-22'],
    assignedOperatorNames: ['Fatima', 'Mona', 'Noor'],
    plannedStartTime: '2024-03-04T06:00:00Z',
    plannedEndTime: '2024-03-12T18:00:00Z',
    actualStartTime: '2024-03-04T07:00:00Z',
    estimatedDuration: 4800,
    materials: [
      { materialId: 'mat-4', materialCode: 'TRM-BTN-001', materialName: 'Metal Buttons 18L', requiredQty: 5000, issuedQty: 5200, consumedQty: 3600, unit: 'pieces' },
      { materialId: 'mat-6', materialCode: 'TRM-THD-001', materialName: 'Poly-core Thread - White', requiredQty: 25, issuedQty: 30, consumedQty: 20, unit: 'cones' },
    ],
    instructions: 'Follow operation sequence as per tech pack. SAM: 12 mins.',
    instructionsAr: 'اتبع تسلسل العمليات حسب الملف الفني. SAM: 12 دقيقة.',
    createdAt: '2024-03-01',
  },
  {
    id: 'wo-3',
    workOrderNumber: 'WO-2024-0003',
    productionOrderId: 'po-1',
    productionOrderNumber: 'PO-2024-0001',
    stage: 'finishing',
    stageOrder: 4,
    lineId: 'line-4',
    lineName: 'Finishing Line 1',
    styleNumber: 'STY-2024-001',
    styleName: 'Classic T-Shirt',
    targetQuantity: 3500,
    completedQuantity: 3200,
    goodQuantity: 3180,
    defectQuantity: 20,
    reworkQuantity: 15,
    unit: 'pieces',
    status: 'in_progress',
    priority: 'high',
    assignedOperators: ['emp-30', 'emp-31'],
    assignedOperatorNames: ['Sara', 'Huda'],
    plannedStartTime: '2024-03-10T06:00:00Z',
    plannedEndTime: '2024-03-14T18:00:00Z',
    actualStartTime: '2024-03-10T06:00:00Z',
    estimatedDuration: 1440,
    materials: [],
    instructions: 'Trim all threads. Attach buttons and labels.',
    instructionsAr: 'قص جميع الخيوط. ثبت الأزرار والليبلات.',
    createdAt: '2024-03-01',
  },
  {
    id: 'wo-4',
    workOrderNumber: 'WO-2024-0004',
    productionOrderId: 'po-2',
    productionOrderNumber: 'PO-2024-0002',
    stage: 'cutting',
    stageOrder: 1,
    lineId: 'line-1',
    lineName: 'Cutting Line 1',
    styleNumber: 'STY-2024-005',
    styleName: 'Slim Fit Jeans',
    targetQuantity: 3000,
    completedQuantity: 1200,
    goodQuantity: 1180,
    defectQuantity: 20,
    reworkQuantity: 10,
    unit: 'pieces',
    status: 'in_progress',
    priority: 'medium',
    assignedOperators: ['emp-10', 'emp-13'],
    assignedOperatorNames: ['Ali', 'Khalid'],
    plannedStartTime: '2024-03-11T06:00:00Z',
    plannedEndTime: '2024-03-15T18:00:00Z',
    actualStartTime: '2024-03-11T07:30:00Z',
    estimatedDuration: 1800,
    materials: [
      { materialId: 'mat-3', materialCode: 'FAB-DEN-001', materialName: 'Stretch Denim Fabric - Indigo', requiredQty: 3600, issuedQty: 3700, consumedQty: 1500, unit: 'meters' },
    ],
    instructions: 'Use denim marker plan. Handle stretch fabric carefully.',
    instructionsAr: 'استخدم خطة ماركر الدنيم. تعامل مع القماش المطاط بحذر.',
    createdAt: '2024-03-10',
  },
];

export const mockWIPRecords: WIPRecord[] = [
  { id: 'wip-1', workOrderId: 'wo-1', workOrderNumber: 'WO-2024-0001', productionOrderId: 'po-1', productionOrderNumber: 'PO-2024-0001', stage: 'cutting', quantity: 500, location: 'Cutting Line 1', lineId: 'line-1', lineName: 'Cutting Line 1', status: 'in_process', enteredAt: '2024-03-18T06:00:00Z', batchNumber: 'BT-PO1-001', serialStart: 'SN-001', serialEnd: 'SN-500' },
  { id: 'wip-2', workOrderId: 'wo-2', workOrderNumber: 'WO-2024-0002', productionOrderId: 'po-1', productionOrderNumber: 'PO-2024-0001', stage: 'sewing', previousStage: 'cutting', quantity: 800, location: 'Sewing Line 1', lineId: 'line-2', lineName: 'Sewing Line 1', status: 'in_process', enteredAt: '2024-03-17T14:00:00Z', batchNumber: 'BT-PO1-002', serialStart: 'SN-501', serialEnd: 'SN-1300' },
  { id: 'wip-3', workOrderId: 'wo-2', workOrderNumber: 'WO-2024-0002', productionOrderId: 'po-1', productionOrderNumber: 'PO-2024-0001', stage: 'sewing', previousStage: 'cutting', quantity: 400, location: 'WIP Storage', status: 'in_queue', enteredAt: '2024-03-18T08:00:00Z', batchNumber: 'BT-PO1-003', serialStart: 'SN-1301', serialEnd: 'SN-1700' },
  { id: 'wip-4', workOrderId: 'wo-3', workOrderNumber: 'WO-2024-0003', productionOrderId: 'po-1', productionOrderNumber: 'PO-2024-0001', stage: 'finishing', previousStage: 'sewing', quantity: 600, location: 'Finishing Line 1', lineId: 'line-4', lineName: 'Finishing Line 1', status: 'in_process', enteredAt: '2024-03-18T10:00:00Z', batchNumber: 'BT-PO1-004', serialStart: 'SN-1701', serialEnd: 'SN-2300' },
  { id: 'wip-5', workOrderId: 'wo-4', workOrderNumber: 'WO-2024-0004', productionOrderId: 'po-2', productionOrderNumber: 'PO-2024-0002', stage: 'cutting', quantity: 350, location: 'Cutting Line 1', lineId: 'line-1', lineName: 'Cutting Line 1', status: 'in_process', enteredAt: '2024-03-18T07:00:00Z', batchNumber: 'BT-PO2-001', serialStart: 'SN-J001', serialEnd: 'SN-J350' },
];

export const mockProductionDefects: ProductionDefect[] = [
  {
    id: 'def-p1', workOrderId: 'wo-2', workOrderNumber: 'WO-2024-0002', productionOrderId: 'po-1', stage: 'sewing',
    defectType: 'Broken Stitch', defectCode: 'SEW-001', severity: 'major', quantity: 25,
    description: 'Broken stitches found in side seam', descriptionAr: 'غرز مقطوعة في الحياكة الجانبية',
    rootCause: 'Thread tension issue', detectedBy: 'emp-40', detectedByName: 'QC Inspector 1',
    detectedAt: '2024-03-17T14:30:00Z', lineId: 'line-2', lineName: 'Sewing Line 1',
    operatorId: 'emp-21', operatorName: 'Mona', status: 'in_rework', reworkRequired: true,
    reworkInstructions: 'Re-stitch side seam with correct tension', createdAt: '2024-03-17',
  },
  {
    id: 'def-p2', workOrderId: 'wo-1', workOrderNumber: 'WO-2024-0001', productionOrderId: 'po-1', stage: 'cutting',
    defectType: 'Cut Error', defectCode: 'CUT-003', severity: 'minor', quantity: 15,
    description: 'Minor size deviation in sleeve pieces', descriptionAr: 'انحراف طفيف في المقاس لقطع الأكمام',
    detectedBy: 'emp-40', detectedByName: 'QC Inspector 1',
    detectedAt: '2024-03-16T10:00:00Z', lineId: 'line-1', lineName: 'Cutting Line 1',
    status: 'resolved', reworkRequired: false, resolution: 'Pieces used for smaller sizes',
    resolvedAt: '2024-03-16T12:00:00Z', createdAt: '2024-03-16',
  },
  {
    id: 'def-p3', workOrderId: 'wo-3', workOrderNumber: 'WO-2024-0003', productionOrderId: 'po-1', stage: 'finishing',
    defectType: 'Missing Button', defectCode: 'FIN-002', severity: 'major', quantity: 10,
    description: 'Button not properly attached', descriptionAr: 'الزر غير مثبت بشكل صحيح',
    detectedBy: 'emp-41', detectedByName: 'QC Inspector 2',
    detectedAt: '2024-03-18T09:00:00Z', lineId: 'line-4', lineName: 'Finishing Line 1',
    status: 'reported', reworkRequired: true, createdAt: '2024-03-18',
  },
];

export const mockReworkOrders: ReworkOrder[] = [
  {
    id: 'rw-1', reworkNumber: 'RW-2024-0001', defectId: 'def-p1', workOrderId: 'wo-2', productionOrderId: 'po-1',
    stage: 'sewing', quantity: 25, reworkedQty: 15, scrapQty: 2, status: 'in_progress', priority: 'high',
    assignedTo: 'emp-22', assignedToName: 'Noor',
    instructions: 'Re-stitch side seam. Check thread tension before starting.',
    instructionsAr: 'أعد خياطة الحياكة الجانبية. تحقق من شد الخيط قبل البدء.',
    estimatedTime: 60, actualTime: 45, startedAt: '2024-03-17T15:00:00Z', createdAt: '2024-03-17',
  },
];

export const mockProductionProgress: ProductionProgress[] = [
  { id: 'pp-1', workOrderId: 'wo-2', stage: 'sewing', timestamp: '2024-03-18T07:00:00Z', quantity: 45, operatorId: 'emp-20', operatorName: 'Fatima', lineId: 'line-2', lineName: 'Sewing Line 1', hourlyTarget: 50, hourlyActual: 45, efficiency: 90 },
  { id: 'pp-2', workOrderId: 'wo-2', stage: 'sewing', timestamp: '2024-03-18T08:00:00Z', quantity: 52, operatorId: 'emp-20', operatorName: 'Fatima', lineId: 'line-2', lineName: 'Sewing Line 1', hourlyTarget: 50, hourlyActual: 52, efficiency: 104 },
  { id: 'pp-3', workOrderId: 'wo-2', stage: 'sewing', timestamp: '2024-03-18T09:00:00Z', quantity: 48, operatorId: 'emp-20', operatorName: 'Fatima', lineId: 'line-2', lineName: 'Sewing Line 1', hourlyTarget: 50, hourlyActual: 48, efficiency: 96 },
  { id: 'pp-4', workOrderId: 'wo-1', stage: 'cutting', timestamp: '2024-03-18T07:00:00Z', quantity: 120, operatorId: 'emp-10', operatorName: 'Ali', lineId: 'line-1', lineName: 'Cutting Line 1', hourlyTarget: 100, hourlyActual: 120, efficiency: 120 },
  { id: 'pp-5', workOrderId: 'wo-1', stage: 'cutting', timestamp: '2024-03-18T08:00:00Z', quantity: 115, operatorId: 'emp-10', operatorName: 'Ali', lineId: 'line-1', lineName: 'Cutting Line 1', hourlyTarget: 100, hourlyActual: 115, efficiency: 115 },
];

export const mockBatchTrackers: BatchTracker[] = [
  {
    id: 'bt-1', batchNumber: 'BT-PO1-001', productionOrderId: 'po-1', workOrderId: 'wo-1',
    quantity: 500, currentStage: 'sewing', currentLocation: 'Sewing Line 1',
    serialStart: 'SN-001', serialEnd: 'SN-500', status: 'active',
    history: [
      { timestamp: '2024-03-02T06:00:00Z', stage: 'cutting', action: 'Started', quantity: 500, operatorId: 'emp-10', operatorName: 'Ali', location: 'Cutting Line 1' },
      { timestamp: '2024-03-03T14:00:00Z', stage: 'cutting', action: 'Completed', quantity: 498, operatorId: 'emp-10', operatorName: 'Ali', location: 'Cutting Line 1', notes: '2 pieces defect' },
      { timestamp: '2024-03-04T06:00:00Z', stage: 'sewing', action: 'Started', quantity: 498, operatorId: 'emp-20', operatorName: 'Fatima', location: 'Sewing Line 1' },
    ],
    createdAt: '2024-03-02',
  },
  {
    id: 'bt-2', batchNumber: 'BT-PO1-002', productionOrderId: 'po-1', workOrderId: 'wo-1',
    quantity: 800, currentStage: 'finishing', currentLocation: 'Finishing Line 1',
    serialStart: 'SN-501', serialEnd: 'SN-1300', status: 'active',
    history: [
      { timestamp: '2024-03-04T06:00:00Z', stage: 'cutting', action: 'Started', quantity: 800, operatorId: 'emp-11', operatorName: 'Omar', location: 'Cutting Line 1' },
      { timestamp: '2024-03-05T18:00:00Z', stage: 'cutting', action: 'Completed', quantity: 795, operatorId: 'emp-11', operatorName: 'Omar', location: 'Cutting Line 1' },
      { timestamp: '2024-03-06T06:00:00Z', stage: 'sewing', action: 'Started', quantity: 795, operatorId: 'emp-21', operatorName: 'Mona', location: 'Sewing Line 1' },
      { timestamp: '2024-03-10T18:00:00Z', stage: 'sewing', action: 'Completed', quantity: 780, operatorId: 'emp-21', operatorName: 'Mona', location: 'Sewing Line 1' },
      { timestamp: '2024-03-11T06:00:00Z', stage: 'finishing', action: 'Started', quantity: 780, operatorId: 'emp-30', operatorName: 'Sara', location: 'Finishing Line 1' },
    ],
    createdAt: '2024-03-04',
  },
];

// Helper functions
export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
export const getStageConfig = (stage: ProductionStage) => stageConfigs.find(s => s.stage === stage);
export const getLineName = (line: ProductionLine, lang: string) => lang === 'ar' ? line.nameAr : line.name;
export const getStageName = (stage: ProductionStage, lang: string) => {
  const config = getStageConfig(stage);
  return lang === 'ar' ? config?.nameAr : config?.name;
};
export const getOrderProgress = (order: ProductionOrder) => Math.round((order.completedQuantity / order.orderQuantity) * 100);
export const getWorkOrderProgress = (wo: WorkOrder) => Math.round((wo.completedQuantity / wo.targetQuantity) * 100);
export const getLineUtilization = (line: ProductionLine) => Math.round((line.currentLoad / line.capacity) * 100);
export const getWIPByStage = (stage: ProductionStage) => mockWIPRecords.filter(w => w.stage === stage);
export const getDefectsByWorkOrder = (workOrderId: string) => mockProductionDefects.filter(d => d.workOrderId === workOrderId);



