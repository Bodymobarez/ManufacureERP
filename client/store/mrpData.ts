// ==================== MRP II (Material Requirement Planning) DATA ====================

export interface DemandForecast {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  productNameAr: string;
  season: string;
  period: string; // '2024-Q1', '2024-03', etc.
  forecastQuantity: number;
  actualQuantity?: number;
  confidenceLevel: number; // percentage
  forecastMethod: 'historical' | 'trend' | 'seasonal' | 'market_analysis' | 'manual';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MasterProductionSchedule {
  id: string;
  code: string;
  productId: string;
  productCode: string;
  productName: string;
  productNameAr: string;
  productionLineId?: string;
  productionLineName?: string;
  plannedStartDate: string;
  plannedEndDate: string;
  plannedQuantity: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  actualStartDate?: string;
  actualEndDate?: string;
  actualQuantity?: number;
  capacityRequired: number; // hours
  capacityAvailable: number; // hours
  capacityUtilization: number; // percentage
  materialsReady: boolean;
  laborReady: boolean;
  equipmentReady: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialRequirement {
  id: string;
  mpsId: string;
  mpsCode: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialNameAr: string;
  requiredQuantity: number;
  unit: string;
  requiredDate: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  shortage: number;
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
  status: 'pending' | 'ordered' | 'received' | 'shortage';
  leadTimeDays: number;
  createdAt: string;
}

export interface CapacityPlan {
  id: string;
  productionLineId: string;
  productionLineName: string;
  productionLineNameAr: string;
  date: string;
  plannedCapacity: number; // hours
  allocatedCapacity: number; // hours
  availableCapacity: number; // hours
  utilizationPercent: number;
  bottleneck: boolean;
  shifts: number;
  operatorsPerShift: number;
  efficiency: number; // percentage
  createdAt: string;
}

export interface LineBalance {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  productionLineId: string;
  productionLineName: string;
  operations: LineBalanceOperation[];
  totalSMV: number; // Standard Minute Value
  targetQuantity: number;
  plannedProductionHours: number;
  balanceEfficiency: number; // percentage
  bottleneckOperation?: string;
  balanceDate: string;
  createdAt: string;
}

export interface LineBalanceOperation {
  id: string;
  operationName: string;
  operationNameAr: string;
  sequence: number;
  smv: number;
  machineType?: string;
  operatorSkillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  assignedOperators: number;
  targetOutput: number; // pieces per hour
  actualOutput?: number;
  efficiency: number; // percentage
}

// Mock data
export const mockDemandForecasts: DemandForecast[] = [
  {
    id: 'df-1',
    productId: 'prod-1',
    productCode: 'STY-001',
    productName: 'Classic White Shirt',
    productNameAr: 'قميص أبيض كلاسيكي',
    season: 'Spring 2024',
    period: '2024-Q2',
    forecastQuantity: 5000,
    confidenceLevel: 85,
    forecastMethod: 'seasonal',
    createdBy: 'user-1',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'df-2',
    productId: 'prod-2',
    productCode: 'STY-002',
    productName: 'Blue Denim Jeans',
    productNameAr: 'جينز أزرق',
    season: 'Spring 2024',
    period: '2024-Q2',
    forecastQuantity: 8000,
    confidenceLevel: 90,
    forecastMethod: 'historical',
    createdBy: 'user-1',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
];

export const mockMasterProductionSchedules: MasterProductionSchedule[] = [
  {
    id: 'mps-1',
    code: 'MPS-2024-001',
    productId: 'prod-1',
    productCode: 'STY-001',
    productName: 'Classic White Shirt',
    productNameAr: 'قميص أبيض كلاسيكي',
    productionLineId: 'line-2',
    productionLineName: 'Sewing Line 1',
    plannedStartDate: '2024-04-01',
    plannedEndDate: '2024-04-15',
    plannedQuantity: 5000,
    priority: 'high',
    status: 'approved',
    capacityRequired: 800,
    capacityAvailable: 960,
    capacityUtilization: 83.3,
    materialsReady: true,
    laborReady: true,
    equipmentReady: true,
    approvedBy: 'user-1',
    approvedAt: '2024-03-20',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-20',
  },
];

export const mockMaterialRequirements: MaterialRequirement[] = [
  {
    id: 'mr-1',
    mpsId: 'mps-1',
    mpsCode: 'MPS-2024-001',
    materialId: 'mat-1',
    materialCode: 'FAB-001',
    materialName: 'Cotton Fabric 100%',
    materialNameAr: 'قماش قطني 100%',
    requiredQuantity: 12500, // meters (with wastage)
    unit: 'meter',
    requiredDate: '2024-03-28',
    currentStock: 8000,
    reservedStock: 2000,
    availableStock: 6000,
    shortage: 6500,
    leadTimeDays: 15,
    status: 'shortage',
    createdAt: '2024-03-15',
  },
];

export const mockCapacityPlans: CapacityPlan[] = [
  {
    id: 'cp-1',
    productionLineId: 'line-2',
    productionLineName: 'Sewing Line 1',
    productionLineNameAr: 'خط الخياطة 1',
    date: '2024-04-01',
    plannedCapacity: 480, // 2 shifts * 8 hours * 30 days
    allocatedCapacity: 400,
    availableCapacity: 80,
    utilizationPercent: 83.3,
    bottleneck: false,
    shifts: 2,
    operatorsPerShift: 30,
    efficiency: 85,
    createdAt: '2024-03-15',
  },
];

export const mockLineBalances: LineBalance[] = [
  {
    id: 'lb-1',
    productId: 'prod-1',
    productCode: 'STY-001',
    productName: 'Classic White Shirt',
    productionLineId: 'line-2',
    productionLineName: 'Sewing Line 1',
    totalSMV: 45.5,
    targetQuantity: 5000,
    plannedProductionHours: 800,
    balanceEfficiency: 87,
    operations: [
      {
        id: 'op-1',
        operationName: 'Collars',
        operationNameAr: 'الياقات',
        sequence: 1,
        smv: 5.2,
        machineType: 'sewing',
        operatorSkillLevel: 'advanced',
        assignedOperators: 3,
        targetOutput: 35,
        efficiency: 90,
      },
      {
        id: 'op-2',
        operationName: 'Sleeves',
        operationNameAr: 'الأكمام',
        sequence: 2,
        smv: 8.5,
        machineType: 'sewing',
        operatorSkillLevel: 'intermediate',
        assignedOperators: 5,
        targetOutput: 28,
        efficiency: 85,
      },
    ],
    balanceDate: '2024-03-20',
    createdAt: '2024-03-20',
  },
];

// Helper functions
export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
export const calculateCapacityUtilization = (required: number, available: number) => {
  if (available === 0) return 0;
  return Math.round((required / available) * 100);
};



