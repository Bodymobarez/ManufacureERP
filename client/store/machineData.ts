// ==================== MACHINE & EQUIPMENT DATA ====================

export interface Machine {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  type: 'sewing' | 'cutting' | 'pressing' | 'embroidery' | 'spreading' | 'overlock' | 'buttonhole' | 'other';
  category: string;
  model: string;
  manufacturer: string;
  manufacturerAr: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  purchaseCurrency: string;
  currentValue: number;
  productionLineId?: string;
  productionLineName?: string;
  location: string;
  status: 'running' | 'idle' | 'maintenance' | 'breakdown' | 'offline';
  operatorId?: string;
  operatorName?: string;
  operatorNumber?: string;
  specifications: MachineSpecification;
  maintenance: MachineMaintenanceInfo;
  performance: MachinePerformance;
  createdAt: string;
  updatedAt: string;
}

export interface MachineSpecification {
  powerConsumption: number; // kW
  voltage: string;
  speed: string; // RPM or stitches per minute
  maxSpeed?: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'm';
  };
  weight?: number;
  year: number;
  warrantyExpiry?: string;
}

export interface MachineMaintenanceInfo {
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  maintenanceInterval: number; // days
  maintenanceHours: number;
  totalMaintenanceCost: number;
  maintenanceCostCurrency: string;
  breakdownCount: number;
  totalDowntime: number; // hours
}

export interface MachinePerformance {
  totalOperatingHours: number;
  currentEfficiency: number; // percentage
  averageEfficiency: number;
  availability: number; // percentage
  performanceRate: number; // percentage
  qualityRate: number; // percentage
  oee: number; // Overall Equipment Effectiveness
  lastOeeUpdate: string;
}

export interface MachineOperatorAssignment {
  id: string;
  machineId: string;
  machineCode: string;
  machineName: string;
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  assignedDate: string;
  unassignedDate?: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  certificationDate?: string;
  isActive: boolean;
  notes?: string;
}

export interface MachineSkill {
  id: string;
  machineType: string;
  skillName: string;
  skillNameAr: string;
  description: string;
  descriptionAr: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  requiredTrainingHours: number;
  certificationRequired: boolean;
  isActive: boolean;
}

export interface EmployeeMachineSkill {
  id: string;
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  skillId: string;
  skillName: string;
  skillNameAr: string;
  machineType: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  certificationDate?: string;
  certificationExpiry?: string;
  certificationNumber?: string;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedDate?: string;
  isActive: boolean;
  createdAt: string;
}

// Mock data
export const mockMachines: Machine[] = [
  {
    id: 'mc-1',
    code: 'MC-CUT-001',
    name: 'Automatic Cutting Machine',
    nameAr: 'ماكينة قص تلقائية',
    type: 'cutting',
    category: 'Cutting Equipment',
    model: 'CM-3000',
    manufacturer: 'Gerber Technology',
    manufacturerAr: 'جيربر تكنولوجي',
    serialNumber: 'GT-CM3000-2020-001',
    purchaseDate: '2020-03-15',
    purchasePrice: 150000,
    purchaseCurrency: 'USD',
    currentValue: 120000,
    productionLineId: 'line-1',
    productionLineName: 'Cutting Line 1',
    location: 'Building A, Floor 1, Zone 1',
    status: 'running',
    operatorId: 'emp-10',
    operatorName: 'Ali Mohamed',
    operatorNumber: 'EMP-010',
    specifications: {
      powerConsumption: 15,
      voltage: '380V',
      speed: '3000 RPM',
      maxSpeed: '3500 RPM',
      dimensions: { length: 400, width: 250, height: 180, unit: 'cm' },
      weight: 2500,
      year: 2020,
      warrantyExpiry: '2025-03-15',
    },
    maintenance: {
      lastMaintenanceDate: '2024-03-01',
      nextMaintenanceDate: '2024-04-01',
      maintenanceInterval: 30,
      maintenanceHours: 2,
      totalMaintenanceCost: 5000,
      maintenanceCostCurrency: 'USD',
      breakdownCount: 2,
      totalDowntime: 48,
    },
    performance: {
      totalOperatingHours: 8760,
      currentEfficiency: 92,
      averageEfficiency: 90,
      availability: 95,
      performanceRate: 97,
      qualityRate: 99,
      oee: 91,
      lastOeeUpdate: '2024-03-18',
    },
    createdAt: '2020-03-15',
    updatedAt: '2024-03-18',
  },
  {
    id: 'mc-3',
    code: 'MC-SEW-001',
    name: 'Single Needle Lockstitch Machine',
    nameAr: 'ماكينة خياطة إبرة واحدة',
    type: 'sewing',
    category: 'Sewing Equipment',
    model: 'DDL-8700',
    manufacturer: 'Brother',
    manufacturerAr: 'براذر',
    serialNumber: 'BR-DDL8700-2021-045',
    purchaseDate: '2021-06-10',
    purchasePrice: 2500,
    purchaseCurrency: 'USD',
    currentValue: 2000,
    productionLineId: 'line-2',
    productionLineName: 'Sewing Line 1',
    location: 'Building A, Floor 2, Position 1',
    status: 'running',
    operatorId: 'emp-20',
    operatorName: 'Fatima Ali',
    operatorNumber: 'EMP-020',
    specifications: {
      powerConsumption: 0.5,
      voltage: '220V',
      speed: '5500 SPM',
      maxSpeed: '6000 SPM',
      dimensions: { length: 120, width: 60, height: 140, unit: 'cm' },
      weight: 45,
      year: 2021,
    },
    maintenance: {
      lastMaintenanceDate: '2024-03-10',
      nextMaintenanceDate: '2024-04-10',
      maintenanceInterval: 30,
      maintenanceHours: 1,
      totalMaintenanceCost: 1200,
      maintenanceCostCurrency: 'USD',
      breakdownCount: 0,
      totalDowntime: 0,
    },
    performance: {
      totalOperatingHours: 12000,
      currentEfficiency: 88,
      averageEfficiency: 85,
      availability: 98,
      performanceRate: 90,
      qualityRate: 95,
      oee: 84,
      lastOeeUpdate: '2024-03-18',
    },
    createdAt: '2021-06-10',
    updatedAt: '2024-03-18',
  },
];

export const mockMachineSkills: MachineSkill[] = [
  {
    id: 'msk-1',
    machineType: 'cutting',
    skillName: 'Automatic Cutting Machine Operation',
    skillNameAr: 'تشغيل ماكينة القص التلقائية',
    description: 'Operate and maintain automatic cutting machines',
    descriptionAr: 'تشغيل وصيانة ماكينات القص التلقائية',
    level: 'advanced',
    requiredTrainingHours: 40,
    certificationRequired: true,
    isActive: true,
  },
  {
    id: 'msk-2',
    machineType: 'sewing',
    skillName: 'Single Needle Machine Operation',
    skillNameAr: 'تشغيل ماكينة الإبرة الواحدة',
    description: 'Operate single needle lockstitch machines',
    descriptionAr: 'تشغيل ماكينات الخياطة بإبرة واحدة',
    level: 'intermediate',
    requiredTrainingHours: 20,
    certificationRequired: false,
    isActive: true,
  },
  {
    id: 'msk-3',
    machineType: 'sewing',
    skillName: 'Overlock Machine Operation',
    skillNameAr: 'تشغيل ماكينة الأوفرلوك',
    description: 'Operate overlock/serger machines',
    descriptionAr: 'تشغيل ماكينات الأوفرلوك',
    level: 'intermediate',
    requiredTrainingHours: 25,
    certificationRequired: false,
    isActive: true,
  },
];

export const mockEmployeeMachineSkills: EmployeeMachineSkill[] = [
  {
    id: 'ems-1',
    employeeId: 'emp-10',
    employeeNumber: 'EMP-010',
    employeeName: 'Ali Mohamed',
    skillId: 'msk-1',
    skillName: 'Automatic Cutting Machine Operation',
    skillNameAr: 'تشغيل ماكينة القص التلقائية',
    machineType: 'cutting',
    proficiencyLevel: 'advanced',
    certificationDate: '2022-05-15',
    certificationExpiry: '2025-05-15',
    certificationNumber: 'CERT-CUT-001',
    verifiedBy: 'emp-1',
    verifiedByName: 'Ahmed Hassan',
    verifiedDate: '2022-05-15',
    isActive: true,
    createdAt: '2022-05-15',
  },
  {
    id: 'ems-2',
    employeeId: 'emp-20',
    employeeNumber: 'EMP-020',
    employeeName: 'Fatima Ali',
    skillId: 'msk-2',
    skillName: 'Single Needle Machine Operation',
    skillNameAr: 'تشغيل ماكينة الإبرة الواحدة',
    machineType: 'sewing',
    proficiencyLevel: 'expert',
    certificationDate: '2021-08-20',
    isActive: true,
    createdAt: '2021-08-20',
  },
];

export const mockMachineOperatorAssignments: MachineOperatorAssignment[] = [
  {
    id: 'moa-1',
    machineId: 'mc-1',
    machineCode: 'MC-CUT-001',
    machineName: 'Automatic Cutting Machine',
    employeeId: 'emp-10',
    employeeNumber: 'EMP-010',
    employeeName: 'Ali Mohamed',
    assignedDate: '2022-06-01',
    skillLevel: 'advanced',
    isActive: true,
  },
  {
    id: 'moa-2',
    machineId: 'mc-3',
    machineCode: 'MC-SEW-001',
    machineName: 'Single Needle Lockstitch Machine',
    employeeId: 'emp-20',
    employeeNumber: 'EMP-020',
    employeeName: 'Fatima Ali',
    assignedDate: '2021-08-01',
    skillLevel: 'expert',
    isActive: true,
  },
];

// Helper functions
export const getMachinesByEmployee = (employeeId: string) => {
  return mockMachines.filter(m => m.operatorId === employeeId);
};

export const getEmployeesByMachine = (machineId: string) => {
  const machine = mockMachines.find(m => m.id === machineId);
  if (!machine || !machine.operatorId) return [];
  return [{ id: machine.operatorId, name: machine.operatorName, number: machine.operatorNumber }];
};

export const getEmployeeMachineSkillsByEmployee = (employeeId: string) => {
  return mockEmployeeMachineSkills.filter(s => s.employeeId === employeeId && s.isActive);
};

export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;



