// ==================== HUMAN RESOURCE MANAGEMENT DATA TYPES ====================

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  firstNameAr: string;
  lastNameAr: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  nationality: string;
  nationalId: string;
  passportNumber?: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  employmentType: 'full_time' | 'part_time' | 'contract' | 'temporary';
  employmentStatus: 'active' | 'on_leave' | 'terminated' | 'suspended';
  hireDate: string;
  terminationDate?: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionTitle: string;
  positionTitleAr: string;
  managerId?: string;
  managerName?: string;
  salary: number;
  currency: string;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    iban?: string;
  };
  skills: string[];
  machineSkills: string[]; // Machine skill IDs
  certifications: EmployeeCertification[];
  profilePhoto?: string;
  documents: EmployeeDocument[];
  assignedMachineIds?: string[]; // Currently assigned machines
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeCertification {
  id: string;
  name: string;
  nameAr: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  certificateNumber: string;
  attachmentUrl?: string;
}

export interface EmployeeDocument {
  id: string;
  type: 'contract' | 'id_copy' | 'passport' | 'visa' | 'medical' | 'other';
  name: string;
  uploadDate: string;
  expiryDate?: string;
  attachmentUrl: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  managerId?: string;
  managerName?: string;
  budget?: number;
  location: string;
  isActive: boolean;
  employeeCount: number;
  createdAt: string;
}

export interface Position {
  id: string;
  code: string;
  title: string;
  titleAr: string;
  departmentId: string;
  departmentName: string;
  jobDescription: string;
  jobDescriptionAr: string;
  requirements: string[];
  requirementsAr: string[];
  minSalary: number;
  maxSalary: number;
  level: string;
  reportsTo?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Shift {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  duration: number; // hours
  breakDuration: number; // minutes
  isOvernight: boolean;
  departmentIds: string[];
  color: string;
  isActive: boolean;
  createdAt: string;
}

export interface ShiftSchedule {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  shiftId: string;
  shiftName: string;
  shiftCode: string;
  date: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'swap_requested';
  swappedWith?: string;
  swappedWithName?: string;
  notes?: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  date: string;
  shiftId: string;
  shiftName: string;
  checkIn: {
    time: string;
    method: 'biometric' | 'manual' | 'mobile';
    location?: string;
    photo?: string;
  };
  checkOut?: {
    time: string;
    method: 'biometric' | 'manual' | 'mobile';
    location?: string;
  };
  breakStart?: string;
  breakEnd?: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave' | 'holiday';
  notes?: string;
  approvedBy?: string;
  approvedByName?: string;
  createdAt: string;
}

export interface LeaveRequest {
  id: string;
  requestNumber: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  leaveType: 'annual' | 'sick' | 'emergency' | 'maternity' | 'paternity' | 'unpaid' | 'other';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  reasonAr: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requestedDate: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  rejectionReason?: string;
  attachments?: string[];
  createdAt: string;
}

export interface Payroll {
  id: string;
  payrollNumber: string;
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  period: {
    startDate: string;
    endDate: string;
    month: string;
    year: number;
  };
  baseSalary: number;
  allowances: PayrollAllowance[];
  deductions: PayrollDeduction[];
  overtime: number;
  overtimeAmount: number;
  incentives: number;
  bonuses: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  currency: string; // Base currency (USD), converted for display/payment
  exchangeRate?: number; // Exchange rate used for conversion
  convertedAmount?: number; // Amount in payment currency
  paymentCurrency?: string; // Currency used for payment (EGP, AED, etc.)
  status: 'draft' | 'calculated' | 'approved' | 'paid' | 'cancelled';
  paymentDate?: string;
  paymentMethod: 'bank_transfer' | 'cash' | 'check';
  transactionReference?: string;
  notes?: string;
  calculatedBy?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  createdAt: string;
}

export interface PayrollAllowance {
  id: string;
  type: 'transport' | 'housing' | 'food' | 'medical' | 'communication' | 'other';
  name: string;
  amount: number;
}

export interface PayrollDeduction {
  id: string;
  type: 'tax' | 'social_security' | 'insurance' | 'loan' | 'advance' | 'other';
  name: string;
  amount: number;
}

export interface Incentive {
  id: string;
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  type: 'production' | 'quality' | 'attendance' | 'performance' | 'bonus';
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  period: {
    startDate: string;
    endDate: string;
  };
  target: number;
  actual: number;
  achievementRate: number;
  baseAmount: number;
  calculatedAmount: number;
  status: 'pending' | 'approved' | 'paid';
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  paymentDate?: string;
  createdAt: string;
}

export interface PerformanceReview {
  id: string;
  reviewNumber: string;
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  reviewPeriod: {
    startDate: string;
    endDate: string;
  };
  reviewDate: string;
  reviewerId: string;
  reviewerName: string;
  reviewType: 'annual' | 'probation' | 'promotion' | 'mid_year';
  goals: PerformanceGoal[];
  competencies: CompetencyRating[];
  achievements: string[];
  achievementsAr: string[];
  areasForImprovement: string[];
  areasForImprovementAr: string[];
  overallRating: number; // 1-5
  recommendation: 'exceeded' | 'met' | 'partially_met' | 'below_expectations';
  salaryAdjustment?: number;
  promotionConsideration: boolean;
  nextReviewDate: string;
  employeeComments?: string;
  employeeCommentsAr?: string;
  status: 'draft' | 'in_review' | 'completed' | 'acknowledged';
  acknowledgedBy?: string;
  acknowledgedDate?: string;
  createdAt: string;
}

export interface PerformanceGoal {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  target: string;
  actual: string;
  weight: number;
  rating: number; // 1-5
  notes?: string;
}

export interface CompetencyRating {
  id: string;
  competency: string;
  competencyAr: string;
  category: 'technical' | 'behavioral' | 'leadership';
  rating: number; // 1-5
  comments?: string;
  commentsAr?: string;
}

// ==================== MOCK DATA ====================

export const mockDepartments: Department[] = [
  {
    id: 'dept-1',
    code: 'PROD',
    name: 'Production',
    nameAr: 'الإنتاج',
    description: 'Manufacturing and production operations',
    descriptionAr: 'عمليات التصنيع والإنتاج',
    managerId: 'emp-1',
    managerName: 'Ahmed Hassan',
    budget: 500000,
    location: 'Building A',
    isActive: true,
    employeeCount: 150,
    createdAt: '2023-01-01',
  },
  {
    id: 'dept-2',
    code: 'QC',
    name: 'Quality Control',
    nameAr: 'مراقبة الجودة',
    description: 'Quality assurance and inspection',
    descriptionAr: 'ضمان الجودة والفحص',
    managerId: 'emp-2',
    managerName: 'Fatima Ali',
    budget: 150000,
    location: 'Building B',
    isActive: true,
    employeeCount: 25,
    createdAt: '2023-01-01',
  },
  {
    id: 'dept-3',
    code: 'WARE',
    name: 'Warehouse',
    nameAr: 'المستودعات',
    description: 'Inventory and warehouse management',
    descriptionAr: 'إدارة المخزون والمستودعات',
    managerId: 'emp-3',
    managerName: 'Mohamed Ibrahim',
    budget: 200000,
    location: 'Building C',
    isActive: true,
    employeeCount: 40,
    createdAt: '2023-01-01',
  },
  {
    id: 'dept-4',
    code: 'ADMIN',
    name: 'Administration',
    nameAr: 'الإدارة',
    description: 'Administrative and support functions',
    descriptionAr: 'الوظائف الإدارية والدعم',
    managerId: 'emp-4',
    managerName: 'Sara Ahmed',
    budget: 300000,
    location: 'Main Office',
    isActive: true,
    employeeCount: 30,
    createdAt: '2023-01-01',
  },
];

export const mockPositions: Position[] = [
  {
    id: 'pos-1',
    code: 'OP-SEW',
    title: 'Sewing Machine Operator',
    titleAr: 'مشغل ماكينة خياطة',
    departmentId: 'dept-1',
    departmentName: 'Production',
    jobDescription: 'Operate sewing machines and assemble garments according to specifications',
    jobDescriptionAr: 'تشغيل ماكينات الخياطة وتجميع الملابس حسب المواصفات',
    requirements: ['High school diploma', '2+ years experience', 'Attention to detail'],
    requirementsAr: ['شهادة ثانوية', 'خبرة سنتين أو أكثر', 'انتباه للتفاصيل'],
    minSalary: 800,
    maxSalary: 1200,
    level: 'Entry',
    isActive: true,
    createdAt: '2023-01-01',
  },
  {
    id: 'pos-2',
    code: 'SUP-PROD',
    title: 'Production Supervisor',
    titleAr: 'مشرف إنتاج',
    departmentId: 'dept-1',
    departmentName: 'Production',
    jobDescription: 'Supervise production line operations and manage team performance',
    jobDescriptionAr: 'الإشراف على عمليات خط الإنتاج وإدارة أداء الفريق',
    requirements: ['Bachelor degree', '5+ years experience', 'Leadership skills'],
    requirementsAr: ['درجة البكالوريوس', 'خبرة 5 سنوات أو أكثر', 'مهارات القيادة'],
    minSalary: 2000,
    maxSalary: 3000,
    level: 'Supervisor',
    isActive: true,
    createdAt: '2023-01-01',
  },
  {
    id: 'pos-3',
    code: 'QC-INSP',
    title: 'Quality Inspector',
    titleAr: 'مفتش جودة',
    departmentId: 'dept-2',
    departmentName: 'Quality Control',
    jobDescription: 'Inspect products and materials for quality standards',
    jobDescriptionAr: 'فحص المنتجات والمواد لمعايير الجودة',
    requirements: ['High school diploma', 'Quality training', 'Eye for detail'],
    requirementsAr: ['شهادة ثانوية', 'تدريب على الجودة', 'عين للتفاصيل'],
    minSalary: 1000,
    maxSalary: 1500,
    level: 'Entry',
    isActive: true,
    createdAt: '2023-01-01',
  },
];

export const mockShifts: Shift[] = [
  {
    id: 'shift-1',
    code: 'MORN',
    name: 'Morning Shift',
    nameAr: 'وردية صباحية',
    startTime: '06:00',
    endTime: '14:00',
    duration: 8,
    breakDuration: 60,
    isOvernight: false,
    departmentIds: ['dept-1', 'dept-2'],
    color: '#3b82f6',
    isActive: true,
    createdAt: '2023-01-01',
  },
  {
    id: 'shift-2',
    code: 'EVEN',
    name: 'Evening Shift',
    nameAr: 'وردية مسائية',
    startTime: '14:00',
    endTime: '22:00',
    duration: 8,
    breakDuration: 60,
    isOvernight: false,
    departmentIds: ['dept-1'],
    color: '#f59e0b',
    isActive: true,
    createdAt: '2023-01-01',
  },
  {
    id: 'shift-3',
    code: 'NIGHT',
    name: 'Night Shift',
    nameAr: 'وردية ليلية',
    startTime: '22:00',
    endTime: '06:00',
    duration: 8,
    breakDuration: 60,
    isOvernight: true,
    departmentIds: ['dept-1'],
    color: '#6366f1',
    isActive: true,
    createdAt: '2023-01-01',
  },
  {
    id: 'shift-4',
    code: 'OFF',
    name: 'Day Off',
    nameAr: 'يوم راحة',
    startTime: '00:00',
    endTime: '00:00',
    duration: 0,
    breakDuration: 0,
    isOvernight: false,
    departmentIds: [],
    color: '#94a3b8',
    isActive: true,
    createdAt: '2023-01-01',
  },
];

export const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    employeeNumber: 'EMP-001',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    firstNameAr: 'أحمد',
    lastNameAr: 'حسن',
    email: 'ahmed.hassan@company.com',
    phone: '+971501234567',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    nationality: 'Egyptian',
    nationalId: '28505150123456',
    address: 'Dubai, UAE',
    emergencyContact: {
      name: 'Fatima Hassan',
      relationship: 'Wife',
      phone: '+971502345678',
    },
    employmentType: 'full_time',
    employmentStatus: 'active',
    hireDate: '2020-01-15',
    departmentId: 'dept-1',
    departmentName: 'Production',
    positionId: 'pos-2',
    positionTitle: 'Production Supervisor',
    positionTitleAr: 'مشرف إنتاج',
    salary: 2800, // USD base amount
    currency: 'USD', // Always USD in base system
    bankAccount: {
      bankName: 'Emirates NBD',
      accountNumber: '1234567890',
      iban: 'AE123456789012345678901',
    },
    skills: ['Production Management', 'Team Leadership', 'Quality Control'],
    machineSkills: [],
    certifications: [],
    documents: [],
    assignedMachineIds: [],
    createdAt: '2020-01-15',
    updatedAt: '2024-01-01',
  },
  {
    id: 'emp-10',
    employeeNumber: 'EMP-010',
    firstName: 'Ali',
    lastName: 'Mohamed',
    firstNameAr: 'علي',
    lastNameAr: 'محمد',
    email: 'ali.mohamed@company.com',
    phone: '+971503456789',
    dateOfBirth: '1990-08-20',
    gender: 'male',
    nationality: 'Pakistani',
    nationalId: '29008201234567',
    address: 'Sharjah, UAE',
    emergencyContact: {
      name: 'Sara Ali',
      relationship: 'Sister',
      phone: '+971504567890',
    },
    employmentType: 'full_time',
    employmentStatus: 'active',
    hireDate: '2022-03-01',
    departmentId: 'dept-1',
    departmentName: 'Production',
    positionId: 'pos-1',
    positionTitle: 'Sewing Machine Operator',
    positionTitleAr: 'مشغل ماكينة خياطة',
    managerId: 'emp-1',
    managerName: 'Ahmed Hassan',
    salary: 327, // USD base amount (1200 AED / 3.67)
    currency: 'USD',
    bankAccount: {
      bankName: 'ADCB',
      accountNumber: '9876543210',
    },
    skills: ['Sewing', 'Machine Operation'],
    machineSkills: ['msk-1'],
    certifications: [],
    documents: [],
    assignedMachineIds: ['mc-1'],
    createdAt: '2022-03-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'emp-20',
    employeeNumber: 'EMP-020',
    firstName: 'Fatima',
    lastName: 'Ali',
    firstNameAr: 'فاطمة',
    lastNameAr: 'علي',
    email: 'fatima.ali@company.com',
    phone: '+971505678901',
    dateOfBirth: '1988-12-10',
    gender: 'female',
    nationality: 'Egyptian',
    nationalId: '28812101234568',
    address: 'Dubai, UAE',
    emergencyContact: {
      name: 'Mohamed Ali',
      relationship: 'Husband',
      phone: '+971506789012',
    },
    employmentType: 'full_time',
    employmentStatus: 'active',
    hireDate: '2021-06-01',
    departmentId: 'dept-2',
    departmentName: 'Quality Control',
    positionId: 'pos-3',
    positionTitle: 'Quality Inspector',
    positionTitleAr: 'مفتش جودة',
    managerId: 'emp-2',
    managerName: 'Fatima Ali',
    salary: 354, // USD base amount (1300 AED / 3.67)
    currency: 'USD',
    bankAccount: {
      bankName: 'Emirates NBD',
      accountNumber: '1122334455',
    },
    skills: ['Quality Inspection', 'AQL Standards', 'Defect Analysis'],
    machineSkills: [],
    certifications: [],
    documents: [],
    assignedMachineIds: [],
    createdAt: '2021-06-01',
    updatedAt: '2024-01-01',
  },
];

export const mockShiftSchedules: ShiftSchedule[] = [
  {
    id: 'sched-1',
    employeeId: 'emp-10',
    employeeName: 'Ali Mohamed',
    employeeNumber: 'EMP-010',
    shiftId: 'shift-1',
    shiftName: 'Morning Shift',
    shiftCode: 'MORN',
    date: '2024-03-20',
    status: 'confirmed',
    createdAt: '2024-03-15',
  },
  {
    id: 'sched-2',
    employeeId: 'emp-10',
    employeeName: 'Ali Mohamed',
    employeeNumber: 'EMP-010',
    shiftId: 'shift-1',
    shiftName: 'Morning Shift',
    shiftCode: 'MORN',
    date: '2024-03-21',
    status: 'confirmed',
    createdAt: '2024-03-15',
  },
];

export const mockAttendances: Attendance[] = [
  {
    id: 'att-1',
    employeeId: 'emp-10',
    employeeNumber: 'EMP-010',
    employeeName: 'Ali Mohamed',
    date: '2024-03-18',
    shiftId: 'shift-1',
    shiftName: 'Morning Shift',
    checkIn: {
      time: '2024-03-18T06:05:00Z',
      method: 'biometric',
      location: 'Main Gate',
    },
    checkOut: {
      time: '2024-03-18T14:02:00Z',
      method: 'biometric',
      location: 'Main Gate',
    },
    breakStart: '2024-03-18T10:00:00Z',
    breakEnd: '2024-03-18T11:00:00Z',
    totalHours: 8,
    regularHours: 7.95,
    overtimeHours: 0.05,
    lateMinutes: 5,
    earlyLeaveMinutes: 0,
    status: 'present',
    createdAt: '2024-03-18',
  },
  {
    id: 'att-2',
    employeeId: 'emp-10',
    employeeNumber: 'EMP-010',
    employeeName: 'Ali Mohamed',
    date: '2024-03-19',
    shiftId: 'shift-1',
    shiftName: 'Morning Shift',
    checkIn: {
      time: '2024-03-19T06:00:00Z',
      method: 'biometric',
      location: 'Main Gate',
    },
    checkOut: {
      time: '2024-03-19T16:30:00Z',
      method: 'biometric',
      location: 'Main Gate',
    },
    totalHours: 10.5,
    regularHours: 8,
    overtimeHours: 2.5,
    lateMinutes: 0,
    earlyLeaveMinutes: 0,
    status: 'present',
    createdAt: '2024-03-19',
  },
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    requestNumber: 'LV-2024-001',
    employeeId: 'emp-10',
    employeeName: 'Ali Mohamed',
    employeeNumber: 'EMP-010',
    leaveType: 'annual',
    startDate: '2024-04-01',
    endDate: '2024-04-05',
    totalDays: 5,
    reason: 'Family vacation',
    reasonAr: 'إجازة عائلية',
    status: 'approved',
    requestedDate: '2024-03-15',
    approvedBy: 'emp-1',
    approvedByName: 'Ahmed Hassan',
    approvedDate: '2024-03-16',
    createdAt: '2024-03-15',
  },
];

export const mockPayrolls: Payroll[] = [
  {
    id: 'pay-1',
    payrollNumber: 'PAY-2024-03-001',
    employeeId: 'emp-10',
    employeeNumber: 'EMP-010',
    employeeName: 'Ali Mohamed',
    period: {
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      month: 'March',
      year: 2024,
    },
    baseSalary: 1200,
    allowances: [
      { id: 'a1', type: 'transport', name: 'Transport Allowance', amount: 200 },
      { id: 'a2', type: 'food', name: 'Food Allowance', amount: 300 },
    ],
    deductions: [
      { id: 'd1', type: 'tax', name: 'Income Tax', amount: 50 },
      { id: 'd2', type: 'social_security', name: 'Social Security', amount: 100 },
    ],
    overtime: 15,
    overtimeAmount: 337.5,
    incentives: 200,
    bonuses: 0,
    grossSalary: 2237.5,
    totalDeductions: 150,
    netSalary: 568.8, // USD base amount
    currency: 'USD',
    exchangeRate: 3.67,
    convertedAmount: 2087.5,
    paymentCurrency: 'AED',
    status: 'approved',
    paymentDate: '2024-04-05',
    paymentMethod: 'bank_transfer',
    transactionReference: 'TXN-2024-001',
    approvedBy: 'emp-4',
    approvedByName: 'Sara Ahmed',
    approvedDate: '2024-04-01',
    createdAt: '2024-03-31',
  },
];

export const mockIncentives: Incentive[] = [
  {
    id: 'inc-1',
    employeeId: 'emp-10',
    employeeNumber: 'EMP-010',
    employeeName: 'Ali Mohamed',
    type: 'production',
    name: 'Production Target Bonus',
    nameAr: 'مكافأة هدف الإنتاج',
    description: 'Achieved 105% of production target',
    descriptionAr: 'تحقيق 105% من هدف الإنتاج',
    period: {
      startDate: '2024-03-01',
      endDate: '2024-03-31',
    },
    target: 1000,
    actual: 1050,
    achievementRate: 105,
    baseAmount: 200,
    calculatedAmount: 210,
    status: 'approved',
    approvedBy: 'emp-1',
    approvedByName: 'Ahmed Hassan',
    approvedDate: '2024-04-01',
    createdAt: '2024-03-31',
  },
];

export const mockPerformanceReviews: PerformanceReview[] = [
  {
    id: 'perf-1',
    reviewNumber: 'PERF-2024-001',
    employeeId: 'emp-10',
    employeeNumber: 'EMP-010',
    employeeName: 'Ali Mohamed',
    reviewPeriod: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    reviewDate: '2024-03-15',
    reviewerId: 'emp-1',
    reviewerName: 'Ahmed Hassan',
    reviewType: 'annual',
    goals: [
      {
        id: 'g1',
        title: 'Increase Production Efficiency',
        titleAr: 'زيادة كفاءة الإنتاج',
        description: 'Maintain 95%+ efficiency rate',
        descriptionAr: 'الحفاظ على معدل كفاءة 95% أو أكثر',
        target: '95%',
        actual: '97%',
        weight: 40,
        rating: 4.5,
      },
      {
        id: 'g2',
        title: 'Reduce Defect Rate',
        titleAr: 'تقليل معدل العيوب',
        description: 'Keep defect rate below 2%',
        descriptionAr: 'الحفاظ على معدل العيوب أقل من 2%',
        target: '<2%',
        actual: '1.5%',
        weight: 30,
        rating: 5,
      },
    ],
    competencies: [
      {
        id: 'c1',
        competency: 'Technical Skills',
        competencyAr: 'المهارات التقنية',
        category: 'technical',
        rating: 4.5,
      },
      {
        id: 'c2',
        competency: 'Teamwork',
        competencyAr: 'العمل الجماعي',
        category: 'behavioral',
        rating: 4,
      },
    ],
    achievements: ['Exceeded production targets consistently', 'Mentored 2 new employees'],
    achievementsAr: ['تجاوز أهداف الإنتاج باستمرار', 'إرشاد موظفين جدد'],
    areasForImprovement: ['Communication skills', 'Advanced machine operation'],
    areasForImprovementAr: ['مهارات الاتصال', 'تشغيل الآلات المتقدمة'],
    overallRating: 4.3,
    recommendation: 'met',
    salaryAdjustment: 50,
    promotionConsideration: false,
    nextReviewDate: '2025-03-15',
    status: 'completed',
    createdAt: '2024-03-15',
  },
];

// Helper functions
export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
export const getEmployeeName = (emp: Employee, lang: string) => lang === 'ar' ? `${emp.firstNameAr} ${emp.lastNameAr}` : `${emp.firstName} ${emp.lastName}`;
export const calculateOvertimeHours = (totalHours: number, regularHours: number) => Math.max(0, totalHours - regularHours);
export const calculateOvertimeAmount = (overtimeHours: number, hourlyRate: number, overtimeMultiplier: number = 1.5) => overtimeHours * hourlyRate * overtimeMultiplier;
export const getHourlyRate = (salary: number, workingDaysPerMonth: number = 26, hoursPerDay: number = 8) => {
  return salary / (workingDaysPerMonth * hoursPerDay);
};

