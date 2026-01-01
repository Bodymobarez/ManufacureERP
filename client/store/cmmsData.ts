// ==================== CMMS (Computerized Maintenance Management System) DATA ====================

export interface MaintenanceSchedule {
  id: string;
  code: string;
  machineId: string;
  machineCode: string;
  machineName: string;
  machineNameAr: string;
  type: 'preventive' | 'corrective' | 'predictive' | 'breakdown';
  scheduleType: 'time_based' | 'usage_based' | 'condition_based';
  frequency: number; // days or hours
  frequencyUnit: 'days' | 'hours' | 'cycles';
  lastMaintenanceDate?: string;
  nextMaintenanceDate: string;
  estimatedDuration: number; // hours
  estimatedCost: number;
  costCurrency: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  checklist: MaintenanceChecklistItem[];
  partsRequired: MaintenancePart[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceChecklistItem {
  id: string;
  description: string;
  descriptionAr: string;
  checked: boolean;
  checkedBy?: string;
  checkedAt?: string;
  notes?: string;
}

export interface MaintenancePart {
  id: string;
  partCode: string;
  partName: string;
  partNameAr: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  available: boolean;
  stockLocation?: string;
}

export interface MaintenanceWorkOrder {
  id: string;
  code: string;
  maintenanceScheduleId?: string;
  machineId: string;
  machineCode: string;
  machineName: string;
  machineNameAr: string;
  type: 'preventive' | 'corrective' | 'predictive' | 'breakdown';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  requestedDate: string;
  scheduledDate?: string;
  startDate?: string;
  completionDate?: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  description: string;
  descriptionAr: string;
  workPerformed?: string;
  workPerformedAr?: string;
  actualDuration?: number; // hours
  actualCost?: number;
  costCurrency: string;
  downtimeHours?: number;
  partsUsed: MaintenancePartUsed[];
  laborCost: number;
  partsCost: number;
  totalCost: number;
  downtimeCost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenancePartUsed {
  id: string;
  partCode: string;
  partName: string;
  partNameAr: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface BreakdownRecord {
  id: string;
  code: string;
  machineId: string;
  machineCode: string;
  machineName: string;
  machineNameAr: string;
  failureDate: string;
  failureTime: string;
  failureType: 'mechanical' | 'electrical' | 'pneumatic' | 'software' | 'other';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  descriptionAr: string;
  reportedBy: string;
  reportedByName: string;
  workOrderId?: string;
  workOrderCode?: string;
  resolvedDate?: string;
  downtimeHours: number;
  impact: {
    productionLineId?: string;
    productionLineName?: string;
    affectedOrders: string[];
    estimatedLoss: number;
  };
  rootCause?: string;
  rootCauseAr?: string;
  preventiveAction?: string;
  preventiveActionAr?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SparePart {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  machineType: string;
  manufacturer?: string;
  partNumber?: string;
  unit: string;
  unitCost: number;
  costCurrency: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  leadTimeDays: number;
  supplierId?: string;
  supplierName?: string;
  location: string;
  shelfLife?: number; // days
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceMetric {
  machineId: string;
  machineCode: string;
  machineName: string;
  period: string; // '2024-03'
  mtbf: number; // Mean Time Between Failures (hours)
  mttr: number; // Mean Time To Repair (hours)
  availability: number; // percentage
  maintenanceCost: number;
  downtimeCost: number;
  totalCost: number;
  preventiveMaintenanceCount: number;
  correctiveMaintenanceCount: number;
  breakdownCount: number;
  totalDowntimeHours: number;
}

// Mock data
export const mockMaintenanceSchedules: MaintenanceSchedule[] = [
  {
    id: 'ms-1',
    code: 'MS-2024-001',
    machineId: 'mc-1',
    machineCode: 'MC-CUT-001',
    machineName: 'Automatic Cutting Machine',
    machineNameAr: 'ماكينة قص تلقائية',
    type: 'preventive',
    scheduleType: 'time_based',
    frequency: 30,
    frequencyUnit: 'days',
    lastMaintenanceDate: '2024-03-01',
    nextMaintenanceDate: '2024-04-01',
    estimatedDuration: 2,
    estimatedCost: 500,
    costCurrency: 'USD',
    status: 'scheduled',
    priority: 'medium',
    checklist: [
      {
        id: 'chk-1',
        description: 'Clean and lubricate cutting blades',
        descriptionAr: 'تنظيف وتشحيم شفرات القص',
        checked: false,
      },
      {
        id: 'chk-2',
        description: 'Check air pressure and pneumatic system',
        descriptionAr: 'فحص ضغط الهواء والنظام الهوائي',
        checked: false,
      },
    ],
    partsRequired: [],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
];

export const mockMaintenanceWorkOrders: MaintenanceWorkOrder[] = [
  {
    id: 'mwo-1',
    code: 'MWO-2024-001',
    maintenanceScheduleId: 'ms-1',
    machineId: 'mc-1',
    machineCode: 'MC-CUT-001',
    machineName: 'Automatic Cutting Machine',
    machineNameAr: 'ماكينة قص تلقائية',
    type: 'preventive',
    priority: 'medium',
    status: 'completed',
    requestedDate: '2024-03-01',
    scheduledDate: '2024-03-01',
    startDate: '2024-03-01T08:00:00',
    completionDate: '2024-03-01T10:00:00',
    assignedTechnicianId: 'emp-1',
    assignedTechnicianName: 'Ahmed Hassan',
    description: 'Monthly preventive maintenance',
    descriptionAr: 'صيانة وقائية شهرية',
    workPerformed: 'Cleaned and lubricated all moving parts, checked air pressure',
    workPerformedAr: 'تم تنظيف وتشحيم جميع الأجزاء المتحركة وفحص ضغط الهواء',
    actualDuration: 2,
    actualCost: 500,
    costCurrency: 'USD',
    downtimeHours: 2,
    partsUsed: [],
    laborCost: 500,
    partsCost: 0,
    totalCost: 500,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
];

export const mockBreakdownRecords: BreakdownRecord[] = [
  {
    id: 'br-1',
    code: 'BR-2024-001',
    machineId: 'mc-4',
    machineCode: 'PRS-M-001',
    machineName: 'Steam Press Machine',
    machineNameAr: 'ماكينة كي بالبخار',
    failureDate: '2024-03-18',
    failureTime: '14:30',
    failureType: 'electrical',
    severity: 'moderate',
    description: 'Motor failure - overheating',
    descriptionAr: 'عطل في المحرك - ارتفاع درجة الحرارة',
    reportedBy: 'emp-20',
    reportedByName: 'Fatima Ali',
    workOrderId: 'mwo-2',
    workOrderCode: 'MWO-2024-002',
    resolvedDate: '2024-03-19',
    downtimeHours: 18,
    impact: {
      productionLineId: 'line-4',
      productionLineName: 'Finishing Line 1',
      affectedOrders: ['wo-1', 'wo-2'],
      estimatedLoss: 5000,
    },
    rootCause: 'Worn out motor bearings',
    rootCauseAr: 'بلي المحملات',
    preventiveAction: 'Replace motor bearings every 2000 hours',
    preventiveActionAr: 'استبدال محملات المحرك كل 2000 ساعة',
    createdAt: '2024-03-18',
    updatedAt: '2024-03-19',
  },
];

export const mockSpareParts: SparePart[] = [
  {
    id: 'sp-1',
    code: 'SP-001',
    name: 'Cutting Blade Set',
    nameAr: 'مجموعة شفرات القص',
    category: 'Cutting Equipment Parts',
    categoryAr: 'أجزاء معدات القص',
    machineType: 'cutting',
    manufacturer: 'Gerber Technology',
    partNumber: 'GT-BLADE-001',
    unit: 'set',
    unitCost: 150,
    costCurrency: 'USD',
    currentStock: 5,
    minStock: 3,
    maxStock: 10,
    reorderPoint: 3,
    leadTimeDays: 14,
    location: 'Store A, Shelf 12',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-03-01',
  },
];

export const mockMaintenanceMetrics: MaintenanceMetric[] = [
  {
    machineId: 'mc-1',
    machineCode: 'MC-CUT-001',
    machineName: 'Automatic Cutting Machine',
    period: '2024-03',
    mtbf: 720, // hours
    mttr: 4, // hours
    availability: 99.4,
    maintenanceCost: 500,
    downtimeCost: 200,
    totalCost: 700,
    preventiveMaintenanceCount: 1,
    correctiveMaintenanceCount: 0,
    breakdownCount: 0,
    totalDowntimeHours: 2,
  },
];

// Helper functions
export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
export const calculateMTBF = (totalOperatingHours: number, breakdownCount: number) => {
  if (breakdownCount === 0) return totalOperatingHours;
  return totalOperatingHours / breakdownCount;
};

export const calculateMTTR = (totalDowntimeHours: number, breakdownCount: number) => {
  if (breakdownCount === 0) return 0;
  return totalDowntimeHours / breakdownCount;
};

export const calculateAvailability = (totalHours: number, downtimeHours: number) => {
  if (totalHours === 0) return 0;
  return ((totalHours - downtimeHours) / totalHours) * 100;
};



