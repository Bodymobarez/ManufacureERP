// ==================== QUALITY CONTROL DATA TYPES ====================

export interface IncomingInspection {
  id: string;
  inspectionNumber: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialNameAr: string;
  batchNumber: string;
  supplierId: string;
  supplierName: string;
  poNumber: string;
  receivedQuantity: number;
  inspectedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unit: string;
  inspectionDate: string;
  inspectorId: string;
  inspectorName: string;
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'conditional';
  defects: InspectionDefect[];
  certificates: string[];
  testResults: QualityTestResult[];
  aqlLevel: string;
  aqlResult: 'accepted' | 'rejected';
  notes?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  createdAt: string;
}

export interface InLineInspection {
  id: string;
  inspectionNumber: string;
  workOrderId: string;
  workOrderNumber: string;
  productionOrderId: string;
  productionOrderNumber: string;
  stage: string;
  lineId: string;
  lineName: string;
  inspectionType: 'random' | 'first_piece' | 'periodic' | '100_percent';
  inspectedQuantity: number;
  defectQuantity: number;
  passedQuantity: number;
  inspectionTime: string;
  inspectorId: string;
  inspectorName: string;
  defects: InspectionDefect[];
  photos?: string[];
  status: 'passed' | 'failed' | 'requires_action';
  actionRequired?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface FinalInspection {
  id: string;
  inspectionNumber: string;
  productionOrderId: string;
  productionOrderNumber: string;
  styleNumber: string;
  styleName: string;
  lotQuantity: number;
  sampleSize: number;
  inspectedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  defectQuantity: number;
  inspectionDate: string;
  inspectorId: string;
  inspectorName: string;
  aqlLevel: string;
  aqlResult: 'accepted' | 'rejected' | 'critical_failure';
  defects: InspectionDefect[];
  defectRate: number;
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'conditional';
  certificateIssued: boolean;
  certificateNumber?: string;
  notes?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  createdAt: string;
}

export interface InspectionDefect {
  id: string;
  defectTypeId: string;
  defectTypeCode: string;
  defectTypeName: string;
  defectTypeNameAr: string;
  severity: 'minor' | 'major' | 'critical';
  quantity: number;
  location?: string;
  description: string;
  descriptionAr: string;
  photo?: string;
  operatorId?: string;
  operatorName?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
}

export interface DefectType {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  category: 'fabric' | 'cutting' | 'sewing' | 'finishing' | 'packing' | 'measurement' | 'color' | 'other';
  severity: 'minor' | 'major' | 'critical';
  standardPoints: number; // Defect points per unit
  description: string;
  descriptionAr: string;
  isActive: boolean;
  createdAt: string;
}

export interface AQLStandard {
  id: string;
  level: string; // e.g., "AQL 2.5", "AQL 1.5"
  inspectionLevel: 'I' | 'II' | 'III'; // Normal inspection levels
  sampleSizeCode: string; // Letter code for sample size
  lotSizeRanges: {
    min: number;
    max: number;
    sampleSize: number;
    acceptPoints: { minor: number; major: number; critical: number };
    rejectPoints: { minor: number; major: number; critical: number };
  }[];
  description: string;
  descriptionAr: string;
}

export interface QCReport {
  id: string;
  reportNumber: string;
  reportType: 'incoming' | 'inline' | 'final' | 'summary';
  title: string;
  titleAr: string;
  inspectionId?: string;
  productionOrderId?: string;
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalInspected: number;
    totalAccepted: number;
    totalRejected: number;
    defectRate: number;
    defectsByType: { defectType: string; quantity: number; percentage: number }[];
    defectsBySeverity: { severity: string; quantity: number; percentage: number }[];
  };
  charts?: {
    defectTrend?: string;
    defectByType?: string;
    defectByStage?: string;
  };
  generatedBy: string;
  generatedByName: string;
  generatedAt: string;
  status: 'draft' | 'published';
}

export interface SupplierQualityRating {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierNameAr: string;
  period: {
    startDate: string;
    endDate: string;
  };
  totalIncomingInspections: number;
  totalReceivedQuantity: number;
  totalAcceptedQuantity: number;
  totalRejectedQuantity: number;
  acceptanceRate: number;
  onTimeDeliveryRate: number;
  defectRate: number;
  averageDefectsPerLot: number;
  criticalDefectsCount: number;
  rating: number; // 1-5 stars
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  improvements: string[];
  strengths: string[];
  notes?: string;
  updatedAt: string;
}

export interface NonConformance {
  id: string;
  ncNumber: string;
  type: 'material' | 'production' | 'process' | 'system';
  severity: 'minor' | 'major' | 'critical';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  detectedBy: string;
  detectedByName: string;
  detectedDate: string;
  department: string;
  relatedTo: {
    type: 'inspection' | 'work_order' | 'production_order' | 'material';
    id: string;
    reference: string;
  };
  rootCause?: string;
  immediateAction?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  responsibleParty: string;
  responsiblePartyName: string;
  targetDate: string;
  status: 'open' | 'investigating' | 'corrective_action' | 'verification' | 'closed';
  verificationDate?: string;
  verifiedBy?: string;
  verifiedByName?: string;
  effectiveness?: string;
  closedDate?: string;
  createdAt: string;
}

export interface QualityTestResult {
  id: string;
  testType: string;
  testName: string;
  testNameAr: string;
  standard: string;
  method: string;
  result: string;
  resultValue?: number;
  unit?: string;
  status: 'passed' | 'failed' | 'marginal';
  specification: {
    min?: number;
    max?: number;
    target?: number;
  };
  notes?: string;
}

// ==================== NEW QUALITY MODULE INTERFACES ====================

export interface MeasurementInspection {
  id: string;
  inspectionNumber: string;
  productionOrderId: string;
  productionOrderNumber: string;
  styleNumber: string;
  styleName: string;
  size: string;
  measurements: {
    chest?: number;
    waist?: number;
    hip?: number;
    length?: number;
    sleeveLength?: number;
    shoulderWidth?: number;
    neckOpening?: number;
    armhole?: number;
    cuff?: number;
    [key: string]: number | undefined;
  };
  tolerance: {
    chest?: { min: number; max: number };
    waist?: { min: number; max: number };
    hip?: { min: number; max: number };
    length?: { min: number; max: number };
    sleeveLength?: { min: number; max: number };
    shoulderWidth?: { min: number; max: number };
    neckOpening?: { min: number; max: number };
    armhole?: { min: number; max: number };
    cuff?: { min: number; max: number };
    [key: string]: { min: number; max: number } | undefined;
  };
  sampleSize: number;
  inspectedQuantity: number;
  passedQuantity: number;
  failedQuantity: number;
  inspectionDate: string;
  inspectorId: string;
  inspectorName: string;
  status: 'passed' | 'failed' | 'conditional';
  notes?: string;
  createdAt: string;
}

export interface ColorMatching {
  id: string;
  matchingNumber: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialNameAr: string;
  batchNumber: string;
  supplierId: string;
  supplierName: string;
  standardColor: {
    lab: { L: number; a: number; b: number };
    rgb: { r: number; g: number; b: number };
    hex: string;
    pantone?: string;
  };
  sampleColor: {
    lab: { L: number; a: number; b: number };
    rgb: { r: number; g: number; b: number };
    hex: string;
    pantone?: string;
  };
  deltaE: number;
  tolerance: number;
  status: 'approved' | 'rejected' | 'conditional';
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  inspectionDate: string;
  inspectorId: string;
  inspectorName: string;
  notes?: string;
  photos?: string[];
  createdAt: string;
}

export interface FabricTest {
  id: string;
  testNumber: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialNameAr: string;
  batchNumber: string;
  supplierId: string;
  supplierName: string;
  testType: 'colorfastness' | 'shrinkage' | 'pilling' | 'tensile' | 'tear' | 'abrasion' | 'ph' | 'formaldehyde' | 'other';
  testName: string;
  testNameAr: string;
  standard: string;
  method: string;
  result: string;
  resultValue?: number;
  unit?: string;
  status: 'passed' | 'failed' | 'marginal';
  specification: {
    min?: number;
    max?: number;
    target?: number;
  };
  testDate: string;
  testedBy: string;
  testedByName: string;
  labName?: string;
  certificateNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface PreProductionSample {
  id: string;
  sampleNumber: string;
  styleId: string;
  styleNumber: string;
  styleName: string;
  styleNameAr: string;
  sampleType: 'proto' | 'fit' | 'pp' | 'salesman' | 'photo' | 'other';
  size: string;
  quantity: number;
  submittedDate: string;
  submittedBy: string;
  submittedByName: string;
  inspectionDate?: string;
  inspectorId?: string;
  inspectorName?: string;
  measurements?: MeasurementInspection['measurements'];
  colorMatching?: ColorMatching[];
  fabricTests?: FabricTest[];
  defects: InspectionDefect[];
  status: 'pending' | 'approved' | 'rejected' | 'conditional' | 'revised';
  approvalComments?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  rejectionReason?: string;
  photos?: string[];
  notes?: string;
  createdAt: string;
}

export interface CustomerComplaint {
  id: string;
  complaintNumber: string;
  customerId: string;
  customerName: string;
  customerNameAr: string;
  orderNumber: string;
  styleNumber: string;
  styleName: string;
  complaintDate: string;
  receivedDate: string;
  complaintType: 'quality' | 'size' | 'color' | 'defect' | 'packaging' | 'delivery' | 'other';
  severity: 'minor' | 'major' | 'critical';
  description: string;
  descriptionAr: string;
  quantity: number;
  photos?: string[];
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  responsibleParty: string;
  responsiblePartyName: string;
  resolutionDate?: string;
  customerSatisfaction?: number; // 1-5
  notes?: string;
  createdAt: string;
}

export interface ReturnRejection {
  id: string;
  returnNumber: string;
  customerId?: string;
  customerName?: string;
  orderNumber: string;
  styleNumber: string;
  styleName: string;
  returnDate: string;
  returnType: 'customer_return' | 'internal_rejection' | 'warehouse_rejection';
  quantity: number;
  reason: string;
  reasonAr: string;
  defects: InspectionDefect[];
  status: 'pending' | 'analyzed' | 'disposed' | 'reworked';
  analysis?: {
    rootCause: string;
    category: string;
    cost: number;
  };
  disposedBy?: string;
  disposedByName?: string;
  disposedDate?: string;
  notes?: string;
  createdAt: string;
}

export interface QualityKPI {
  id: string;
  period: {
    startDate: string;
    endDate: string;
  };
  firstTimePassRate: number; // %
  overallPassRate: number; // %
  defectRate: number; // %
  customerComplaintRate: number; // per 1000 units
  returnRate: number; // %
  reworkRate: number; // %
  costOfQuality: number; // currency
  supplierQualityScore: number; // 0-100
  internalAuditScore: number; // 0-100
  customerSatisfactionScore: number; // 1-5
  onTimeDeliveryRate: number; // %
  createdAt: string;
}

export interface QualityTraining {
  id: string;
  trainingNumber: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  trainingType: 'defect_recognition' | 'measurement' | 'aql' | 'color_matching' | 'fabric_testing' | 'process' | 'other';
  trainerId: string;
  trainerName: string;
  scheduledDate: string;
  duration: number; // hours
  participants: {
    employeeId: string;
    employeeName: string;
    attendanceStatus: 'attended' | 'absent' | 'partial';
    score?: number; // 0-100
    certificationIssued: boolean;
    certificationNumber?: string;
  }[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  materials?: string[];
  notes?: string;
  createdAt: string;
}

export interface CustomerBrandStandard {
  id: string;
  customerId: string;
  customerName: string;
  customerNameAr: string;
  brandName?: string;
  brandNameAr?: string;
  standardType: 'quality' | 'measurement' | 'packaging' | 'labeling' | 'testing';
  standardName: string;
  standardNameAr: string;
  description: string;
  descriptionAr: string;
  requirements: {
    key: string;
    value: string;
    tolerance?: string;
  }[];
  documents?: string[];
  effectiveDate: string;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
}

// ==================== MOCK DATA ====================

export const aqlStandards: AQLStandard[] = [
  {
    id: 'aql-1',
    level: 'AQL 1.5',
    inspectionLevel: 'II',
    sampleSizeCode: 'Normal',
    lotSizeRanges: [
      { min: 1, max: 8, sampleSize: 2, acceptPoints: { minor: 0, major: 0, critical: 0 }, rejectPoints: { minor: 1, major: 1, critical: 1 } },
      { min: 9, max: 15, sampleSize: 3, acceptPoints: { minor: 0, major: 0, critical: 0 }, rejectPoints: { minor: 1, major: 1, critical: 1 } },
      { min: 16, max: 25, sampleSize: 5, acceptPoints: { minor: 0, major: 0, critical: 0 }, rejectPoints: { minor: 1, major: 1, critical: 1 } },
      { min: 26, max: 50, sampleSize: 8, acceptPoints: { minor: 0, major: 0, critical: 0 }, rejectPoints: { minor: 2, major: 1, critical: 1 } },
      { min: 51, max: 90, sampleSize: 13, acceptPoints: { minor: 1, major: 0, critical: 0 }, rejectPoints: { minor: 2, major: 1, critical: 1 } },
      { min: 91, max: 150, sampleSize: 20, acceptPoints: { minor: 1, major: 1, critical: 0 }, rejectPoints: { minor: 2, major: 2, critical: 1 } },
      { min: 151, max: 280, sampleSize: 32, acceptPoints: { minor: 2, major: 1, critical: 0 }, rejectPoints: { minor: 3, major: 2, critical: 1 } },
      { min: 281, max: 500, sampleSize: 50, acceptPoints: { minor: 3, major: 2, critical: 0 }, rejectPoints: { minor: 4, major: 3, critical: 1 } },
      { min: 501, max: 1200, sampleSize: 80, acceptPoints: { minor: 5, major: 3, critical: 0 }, rejectPoints: { minor: 6, major: 4, critical: 1 } },
      { min: 1201, max: 3200, sampleSize: 125, acceptPoints: { minor: 7, major: 5, critical: 0 }, rejectPoints: { minor: 8, major: 6, critical: 1 } },
    ],
    description: 'Very strict quality level - for high-end products',
    descriptionAr: 'مستوى جودة صارم جداً - للمنتجات الفاخرة',
  },
  {
    id: 'aql-2',
    level: 'AQL 2.5',
    inspectionLevel: 'II',
    sampleSizeCode: 'Normal',
    lotSizeRanges: [
      { min: 1, max: 8, sampleSize: 2, acceptPoints: { minor: 0, major: 0, critical: 0 }, rejectPoints: { minor: 1, major: 1, critical: 1 } },
      { min: 9, max: 15, sampleSize: 3, acceptPoints: { minor: 0, major: 0, critical: 0 }, rejectPoints: { minor: 1, major: 1, critical: 1 } },
      { min: 16, max: 25, sampleSize: 5, acceptPoints: { minor: 0, major: 0, critical: 0 }, rejectPoints: { minor: 1, major: 1, critical: 1 } },
      { min: 26, max: 50, sampleSize: 8, acceptPoints: { minor: 0, major: 0, critical: 0 }, rejectPoints: { minor: 1, major: 1, critical: 1 } },
      { min: 51, max: 90, sampleSize: 13, acceptPoints: { minor: 1, major: 0, critical: 0 }, rejectPoints: { minor: 2, major: 1, critical: 1 } },
      { min: 91, max: 150, sampleSize: 20, acceptPoints: { minor: 1, major: 1, critical: 0 }, rejectPoints: { minor: 2, major: 2, critical: 1 } },
      { min: 151, max: 280, sampleSize: 32, acceptPoints: { minor: 2, major: 1, critical: 0 }, rejectPoints: { minor: 3, major: 2, critical: 1 } },
      { min: 281, max: 500, sampleSize: 50, acceptPoints: { minor: 3, major: 2, critical: 0 }, rejectPoints: { minor: 4, major: 3, critical: 1 } },
      { min: 501, max: 1200, sampleSize: 80, acceptPoints: { minor: 5, major: 4, critical: 0 }, rejectPoints: { minor: 6, major: 5, critical: 1 } },
      { min: 1201, max: 3200, sampleSize: 125, acceptPoints: { minor: 7, major: 6, critical: 0 }, rejectPoints: { minor: 8, major: 7, critical: 1 } },
    ],
    description: 'Standard quality level - most common in garment industry',
    descriptionAr: 'مستوى الجودة القياسي - الأكثر شيوعاً في صناعة الملابس',
  },
  {
    id: 'aql-3',
    level: 'AQL 4.0',
    inspectionLevel: 'II',
    sampleSizeCode: 'Normal',
    lotSizeRanges: [
      { min: 1, max: 8, sampleSize: 2, acceptPoints: { minor: 0, major: 0, critical: 0 }, rejectPoints: { minor: 1, major: 1, critical: 1 } },
      { min: 9, max: 15, sampleSize: 3, acceptPoints: { minor: 0, major: 0, critical: 0 }, rejectPoints: { minor: 1, major: 1, critical: 1 } },
      { min: 16, max: 25, sampleSize: 5, acceptPoints: { minor: 1, major: 0, critical: 0 }, rejectPoints: { minor: 2, major: 1, critical: 1 } },
      { min: 26, max: 50, sampleSize: 8, acceptPoints: { minor: 1, major: 0, critical: 0 }, rejectPoints: { minor: 2, major: 1, critical: 1 } },
      { min: 51, max: 90, sampleSize: 13, acceptPoints: { minor: 1, major: 1, critical: 0 }, rejectPoints: { minor: 2, major: 2, critical: 1 } },
      { min: 91, max: 150, sampleSize: 20, acceptPoints: { minor: 2, major: 1, critical: 0 }, rejectPoints: { minor: 3, major: 2, critical: 1 } },
      { min: 151, max: 280, sampleSize: 32, acceptPoints: { minor: 3, major: 2, critical: 0 }, rejectPoints: { minor: 4, major: 3, critical: 1 } },
      { min: 281, max: 500, sampleSize: 50, acceptPoints: { minor: 5, major: 3, critical: 0 }, rejectPoints: { minor: 6, major: 4, critical: 1 } },
      { min: 501, max: 1200, sampleSize: 80, acceptPoints: { minor: 7, major: 5, critical: 0 }, rejectPoints: { minor: 8, major: 6, critical: 1 } },
      { min: 1201, max: 3200, sampleSize: 125, acceptPoints: { minor: 10, major: 7, critical: 0 }, rejectPoints: { minor: 11, major: 8, critical: 1 } },
    ],
    description: 'Relaxed quality level - for low-cost products',
    descriptionAr: 'مستوى جودة مرن - للمنتجات منخفضة التكلفة',
  },
];

export const mockDefectTypes: DefectType[] = [
  // Fabric Defects
  { id: 'dt-1', code: 'FAB-001', name: 'Color Shade Variation', nameAr: 'اختلاف درجة اللون', category: 'fabric', severity: 'major', standardPoints: 2, description: 'Fabric color differs from approved sample', descriptionAr: 'لون القماش يختلف عن العينة المعتمدة', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-2', code: 'FAB-002', name: 'Stain', nameAr: 'بقع', category: 'fabric', severity: 'major', standardPoints: 2, description: 'Visible stains on fabric', descriptionAr: 'بقع واضحة على القماش', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-3', code: 'FAB-003', name: 'Hole', nameAr: 'ثقب', category: 'fabric', severity: 'critical', standardPoints: 4, description: 'Hole or tear in fabric', descriptionAr: 'ثقب أو تمزق في القماش', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-13', code: 'FAB-004', name: 'Fabric Shrinkage', nameAr: 'انكماش القماش', category: 'fabric', severity: 'major', standardPoints: 2, description: 'Fabric shrinks beyond acceptable limits', descriptionAr: 'انكماش القماش يتجاوز الحدود المقبولة', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-14', code: 'FAB-005', name: 'Fabric Pilling', nameAr: 'تكوّن الكرات على القماش', category: 'fabric', severity: 'minor', standardPoints: 1, description: 'Fabric pilling or surface fuzzing', descriptionAr: 'تكوّن كرات أو زغب على سطح القماش', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-15', code: 'FAB-006', name: 'Fabric Defect', nameAr: 'عيب في القماش', category: 'fabric', severity: 'major', standardPoints: 2, description: 'General fabric defect (slub, barre, etc.)', descriptionAr: 'عيب عام في القماش (عقدة، خطوط، إلخ)', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-16', code: 'FAB-007', name: 'Color Bleeding', nameAr: 'نزول اللون', category: 'fabric', severity: 'critical', standardPoints: 4, description: 'Color bleeds or runs when wet', descriptionAr: 'اللون ينزل أو ينتشر عند البلل', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-17', code: 'FAB-008', name: 'Fabric Weight Deviation', nameAr: 'انحراف وزن القماش', category: 'fabric', severity: 'major', standardPoints: 2, description: 'Fabric weight differs from specification', descriptionAr: 'وزن القماش يختلف عن المواصفات', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-18', code: 'FAB-009', name: 'Fabric Width Deviation', nameAr: 'انحراف عرض القماش', category: 'fabric', severity: 'major', standardPoints: 2, description: 'Fabric width differs from specification', descriptionAr: 'عرض القماش يختلف عن المواصفات', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-19', code: 'FAB-010', name: 'Fabric Hand Feel Issue', nameAr: 'مشكلة في ملمس القماش', category: 'fabric', severity: 'minor', standardPoints: 1, description: 'Fabric hand feel does not match standard', descriptionAr: 'ملمس القماش لا يطابق المعيار', isActive: true, createdAt: '2023-01-01' },
  
  // Cutting Defects
  { id: 'dt-4', code: 'CUT-001', name: 'Size Deviation', nameAr: 'انحراف المقاس', category: 'cutting', severity: 'major', standardPoints: 2, description: 'Cut piece size differs from specification', descriptionAr: 'مقاس القطعة المقطوعة يختلف عن المواصفات', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-5', code: 'CUT-002', name: 'Pattern Mismatch', nameAr: 'عدم تطابق الباترون', category: 'cutting', severity: 'critical', standardPoints: 4, description: 'Pattern pieces do not align correctly', descriptionAr: 'قطع الباترون لا تتطابق بشكل صحيح', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-20', code: 'CUT-003', name: 'Notch Missing', nameAr: 'علامة القطع مفقودة', category: 'cutting', severity: 'major', standardPoints: 2, description: 'Notch mark is missing or incorrect', descriptionAr: 'علامة القطع مفقودة أو غير صحيحة', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-21', code: 'CUT-004', name: 'Grain Line Deviation', nameAr: 'انحراف خط الحبة', category: 'cutting', severity: 'major', standardPoints: 2, description: 'Grain line not aligned correctly', descriptionAr: 'خط الحبة غير محاذي بشكل صحيح', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-22', code: 'CUT-005', name: 'Rough Cut Edge', nameAr: 'حافة قطع خشنة', category: 'cutting', severity: 'minor', standardPoints: 1, description: 'Cut edge is rough or frayed', descriptionAr: 'حافة القطع خشنة أو مهترئة', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-23', code: 'CUT-006', name: 'Wrong Fabric Direction', nameAr: 'اتجاه القماش خاطئ', category: 'cutting', severity: 'critical', standardPoints: 4, description: 'Fabric cut in wrong direction', descriptionAr: 'القماش مقطوع في اتجاه خاطئ', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-24', code: 'CUT-007', name: 'Marker Error', nameAr: 'خطأ في الماركر', category: 'cutting', severity: 'critical', standardPoints: 4, description: 'Marker layout error or wrong pattern placement', descriptionAr: 'خطأ في تخطيط الماركر أو وضع الباترون', isActive: true, createdAt: '2023-01-01' },
  
  // Sewing Defects
  { id: 'dt-6', code: 'SEW-001', name: 'Broken Stitch', nameAr: 'غرزة مقطوعة', category: 'sewing', severity: 'major', standardPoints: 2, description: 'Broken or skipped stitches in seam', descriptionAr: 'غرز مقطوعة أو متخطاة في الحياكة', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-7', code: 'SEW-002', name: 'Uneven Seam', nameAr: 'حياكة غير مستوية', category: 'sewing', severity: 'minor', standardPoints: 1, description: 'Seam is not straight or even', descriptionAr: 'الحياكة غير مستقيمة أو مستوية', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-8', code: 'SEW-003', name: 'Wrong Thread Color', nameAr: 'لون خيط خاطئ', category: 'sewing', severity: 'major', standardPoints: 2, description: 'Thread color does not match specification', descriptionAr: 'لون الخيط لا يطابق المواصفات', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-25', code: 'SEW-004', name: 'Seam Puckering', nameAr: 'تجعد الحياكة', category: 'sewing', severity: 'major', standardPoints: 2, description: 'Seam is puckered or gathered', descriptionAr: 'الحياكة مجعدة أو مكشكشة', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-26', code: 'SEW-005', name: 'Seam Open', nameAr: 'الحياكة مفتوحة', category: 'sewing', severity: 'critical', standardPoints: 4, description: 'Seam is open or not properly closed', descriptionAr: 'الحياكة مفتوحة أو غير مغلقة بشكل صحيح', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-27', code: 'SEW-006', name: 'Wrong Stitch Type', nameAr: 'نوع غرزة خاطئ', category: 'sewing', severity: 'major', standardPoints: 2, description: 'Wrong stitch type used', descriptionAr: 'استخدام نوع غرزة خاطئ', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-28', code: 'SEW-007', name: 'Seam Allowance Wrong', nameAr: 'مقدار الحياكة خاطئ', category: 'sewing', severity: 'major', standardPoints: 2, description: 'Seam allowance is incorrect', descriptionAr: 'مقدار الحياكة غير صحيح', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-29', code: 'SEW-008', name: 'Raw Edge Exposed', nameAr: 'حافة خام مكشوفة', category: 'sewing', severity: 'major', standardPoints: 2, description: 'Raw fabric edge is exposed', descriptionAr: 'حافة القماش الخام مكشوفة', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-30', code: 'SEW-009', name: 'Pleat/Tuck Wrong', nameAr: 'طية/كشكشة خاطئة', category: 'sewing', severity: 'major', standardPoints: 2, description: 'Pleat or tuck is incorrect', descriptionAr: 'الطية أو الكشكشة غير صحيحة', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-31', code: 'SEW-010', name: 'Gathering Uneven', nameAr: 'كشكشة غير متساوية', category: 'sewing', severity: 'minor', standardPoints: 1, description: 'Gathering is uneven or inconsistent', descriptionAr: 'الكشكشة غير متساوية أو غير متناسقة', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-32', code: 'SEW-011', name: 'Zipper Defect', nameAr: 'عيب في السحاب', category: 'sewing', severity: 'major', standardPoints: 2, description: 'Zipper not properly installed or defective', descriptionAr: 'السحاب غير مثبت بشكل صحيح أو معيب', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-33', code: 'SEW-012', name: 'Buttonhole Defect', nameAr: 'عيب في فتحة الزر', category: 'sewing', severity: 'major', standardPoints: 2, description: 'Buttonhole is incorrect size or poorly finished', descriptionAr: 'فتحة الزر بحجم خاطئ أو إنهاء رديء', isActive: true, createdAt: '2023-01-01' },
  
  // Finishing Defects
  { id: 'dt-9', code: 'FIN-001', name: 'Missing Button', nameAr: 'زر مفقود', category: 'finishing', severity: 'major', standardPoints: 2, description: 'Button is missing or not properly attached', descriptionAr: 'الزر مفقود أو غير مثبت بشكل صحيح', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-10', code: 'FIN-002', name: 'Loose Thread', nameAr: 'خيط فضفاض', category: 'finishing', severity: 'minor', standardPoints: 1, description: 'Loose threads not trimmed', descriptionAr: 'خيوط فضفاضة غير مقطوعة', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-11', code: 'FIN-003', name: 'Wrong Label', nameAr: 'ليبل خاطئ', category: 'finishing', severity: 'major', standardPoints: 2, description: 'Label information is incorrect', descriptionAr: 'معلومات الليبل غير صحيحة', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-34', code: 'FIN-004', name: 'Label Position Wrong', nameAr: 'موضع الليبل خاطئ', category: 'finishing', severity: 'minor', standardPoints: 1, description: 'Label is in wrong position', descriptionAr: 'الليبل في موضع خاطئ', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-35', code: 'FIN-005', name: 'Button Loose', nameAr: 'زر فضفاض', category: 'finishing', severity: 'major', standardPoints: 2, description: 'Button is loose or not secure', descriptionAr: 'الزر فضفاض أو غير مثبت', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-36', code: 'FIN-006', name: 'Buttonhole Not Cut', nameAr: 'فتحة الزر غير مقطوعة', category: 'finishing', severity: 'critical', standardPoints: 4, description: 'Buttonhole is not cut or opened', descriptionAr: 'فتحة الزر غير مقطوعة أو مفتوحة', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-37', code: 'FIN-007', name: 'Thread Trimming Issue', nameAr: 'مشكلة في قص الخيوط', category: 'finishing', severity: 'minor', standardPoints: 1, description: 'Threads not properly trimmed', descriptionAr: 'الخيوط غير مقطوعة بشكل صحيح', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-38', code: 'FIN-008', name: 'Pressing Defect', nameAr: 'عيب في الكي', category: 'finishing', severity: 'minor', standardPoints: 1, description: 'Garment not properly pressed or has press marks', descriptionAr: 'الملابس غير مكوية بشكل صحيح أو بها علامات كي', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-39', code: 'FIN-009', name: 'Missing Accessory', nameAr: 'إكسسوار مفقود', category: 'finishing', severity: 'major', standardPoints: 2, description: 'Required accessory is missing', descriptionAr: 'إكسسوار مطلوب مفقود', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-40', code: 'FIN-010', name: 'Wrong Accessory', nameAr: 'إكسسوار خاطئ', category: 'finishing', severity: 'major', standardPoints: 2, description: 'Wrong accessory used', descriptionAr: 'استخدام إكسسوار خاطئ', isActive: true, createdAt: '2023-01-01' },
  
  // Packing Defects
  { id: 'dt-41', code: 'PKG-001', name: 'Wrong Size in Package', nameAr: 'مقاس خاطئ في العبوة', category: 'packing', severity: 'critical', standardPoints: 4, description: 'Wrong size garment in package', descriptionAr: 'ملابس بمقاس خاطئ في العبوة', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-42', code: 'PKG-002', name: 'Wrong Style in Package', nameAr: 'موديل خاطئ في العبوة', category: 'packing', severity: 'critical', standardPoints: 4, description: 'Wrong style garment in package', descriptionAr: 'ملابس بموديل خاطئ في العبوة', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-43', code: 'PKG-003', name: 'Missing Polybag', nameAr: 'كيس بلاستيك مفقود', category: 'packing', severity: 'major', standardPoints: 2, description: 'Polybag is missing', descriptionAr: 'الكيس البلاستيكي مفقود', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-44', code: 'PKG-004', name: 'Wrong Hanger', nameAr: 'علاقة خاطئة', category: 'packing', severity: 'minor', standardPoints: 1, description: 'Wrong hanger type used', descriptionAr: 'استخدام نوع علاقة خاطئ', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-45', code: 'PKG-005', name: 'Carton Label Wrong', nameAr: 'ليبل الكرتون خاطئ', category: 'packing', severity: 'major', standardPoints: 2, description: 'Carton label information is incorrect', descriptionAr: 'معلومات ليبل الكرتون غير صحيحة', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-46', code: 'PKG-006', name: 'Incorrect Folding', nameAr: 'طي غير صحيح', category: 'packing', severity: 'minor', standardPoints: 1, description: 'Garment not folded according to standard', descriptionAr: 'الملابس غير مطوية حسب المعيار', isActive: true, createdAt: '2023-01-01' },
  
  // Measurement Defects
  { id: 'dt-12', code: 'MSR-001', name: 'Size Out of Tolerance', nameAr: 'المقاس خارج التسامح', category: 'measurement', severity: 'major', standardPoints: 2, description: 'Garment measurements exceed tolerance limits', descriptionAr: 'قياسات الملابس تتجاوز حدود التسامح', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-47', code: 'MSR-002', name: 'Chest Measurement Wrong', nameAr: 'قياس الصدر خاطئ', category: 'measurement', severity: 'major', standardPoints: 2, description: 'Chest measurement out of tolerance', descriptionAr: 'قياس الصدر خارج التسامح', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-48', code: 'MSR-003', name: 'Waist Measurement Wrong', nameAr: 'قياس الخصر خاطئ', category: 'measurement', severity: 'major', standardPoints: 2, description: 'Waist measurement out of tolerance', descriptionAr: 'قياس الخصر خارج التسامح', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-49', code: 'MSR-004', name: 'Length Measurement Wrong', nameAr: 'قياس الطول خاطئ', category: 'measurement', severity: 'major', standardPoints: 2, description: 'Length measurement out of tolerance', descriptionAr: 'قياس الطول خارج التسامح', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-50', code: 'MSR-005', name: 'Sleeve Length Wrong', nameAr: 'طول الكم خاطئ', category: 'measurement', severity: 'major', standardPoints: 2, description: 'Sleeve length out of tolerance', descriptionAr: 'طول الكم خارج التسامح', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-51', code: 'MSR-006', name: 'Shoulder Width Wrong', nameAr: 'عرض الكتف خاطئ', category: 'measurement', severity: 'major', standardPoints: 2, description: 'Shoulder width out of tolerance', descriptionAr: 'عرض الكتف خارج التسامح', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-52', code: 'MSR-007', name: 'Neck Opening Wrong', nameAr: 'فتحة الرقبة خاطئة', category: 'measurement', severity: 'major', standardPoints: 2, description: 'Neck opening out of tolerance', descriptionAr: 'فتحة الرقبة خارج التسامح', isActive: true, createdAt: '2023-01-01' },
  
  // Color Defects
  { id: 'dt-53', code: 'COL-001', name: 'Color Mismatch', nameAr: 'عدم تطابق اللون', category: 'color', severity: 'critical', standardPoints: 4, description: 'Color does not match approved standard', descriptionAr: 'اللون لا يطابق المعيار المعتمد', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-54', code: 'COL-002', name: 'Color Fading', nameAr: 'بهتان اللون', category: 'color', severity: 'major', standardPoints: 2, description: 'Color has faded or changed', descriptionAr: 'اللون بهت أو تغير', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-55', code: 'COL-003', name: 'Color Streak', nameAr: 'خطوط لونية', category: 'color', severity: 'major', standardPoints: 2, description: 'Color streaks or uneven dyeing', descriptionAr: 'خطوط لونية أو صباغة غير متساوية', isActive: true, createdAt: '2023-01-01' },
  { id: 'dt-56', code: 'COL-004', name: 'Metamerism', nameAr: 'تغير اللون تحت إضاءة مختلفة', category: 'color', severity: 'major', standardPoints: 2, description: 'Color appears different under different lighting', descriptionAr: 'اللون يظهر مختلفاً تحت إضاءة مختلفة', isActive: true, createdAt: '2023-01-01' },
];

export const mockIncomingInspections: IncomingInspection[] = [
  {
    id: 'inc-1',
    inspectionNumber: 'INSP-IN-2024-001',
    materialId: 'mat-1',
    materialCode: 'FAB-COT-001',
    materialName: '100% Cotton Fabric - White',
    materialNameAr: 'قماش قطن 100% - أبيض',
    batchNumber: 'BT-2024-001',
    supplierId: 'sup-1',
    supplierName: 'Fabric World Inc.',
    poNumber: 'PO-2024-0045',
    receivedQuantity: 1000,
    inspectedQuantity: 1000,
    acceptedQuantity: 980,
    rejectedQuantity: 20,
    unit: 'meters',
    inspectionDate: '2024-03-15',
    inspectorId: 'emp-40',
    inspectorName: 'QC Inspector 1',
    status: 'passed',
    defects: [
      { id: 'd1', defectTypeId: 'dt-1', defectTypeCode: 'FAB-001', defectTypeName: 'Color Shade Variation', defectTypeNameAr: 'اختلاف درجة اللون', severity: 'major', quantity: 15, description: 'Slight color variation in batch', descriptionAr: 'اختلاف طفيف في اللون في الدفعة' },
      { id: 'd2', defectTypeId: 'dt-2', defectTypeCode: 'FAB-002', defectTypeName: 'Stain', defectTypeNameAr: 'بقع', severity: 'major', quantity: 5, description: 'Minor stains on some pieces', descriptionAr: 'بقع طفيفة على بعض القطع' },
    ],
    certificates: ['test-cert-001.pdf'],
    testResults: [
      { id: 'tr-1', testType: 'colorfastness', testName: 'Colorfastness to Washing', testNameAr: 'مقاومة اللون للغسيل', standard: 'ISO 105-C06', method: 'AATCC 61-2A', result: 'passed', resultValue: 4, unit: 'grade', status: 'passed', specification: { min: 3, target: 4 } },
      { id: 'tr-2', testType: 'shrinkage', testName: 'Dimensional Stability', testNameAr: 'استقرار الأبعاد', standard: 'ISO 5077', method: 'AATCC 135', result: 'passed', resultValue: 2.1, unit: '%', status: 'passed', specification: { max: 3 } },
    ],
    aqlLevel: 'AQL 2.5',
    aqlResult: 'accepted',
    notes: 'Good quality batch, minor issues acceptable',
    approvedBy: 'emp-41',
    approvedByName: 'QC Manager',
    approvedDate: '2024-03-15',
    createdAt: '2024-03-15',
  },
  {
    id: 'inc-2',
    inspectionNumber: 'INSP-IN-2024-002',
    materialId: 'mat-4',
    materialCode: 'TRM-BTN-001',
    materialName: 'Metal Buttons 18L',
    materialNameAr: 'أزرار معدنية 18L',
    batchNumber: 'BT-2024-003',
    supplierId: 'sup-3',
    supplierName: 'Button Factory Co.',
    poNumber: 'PO-2024-0048',
    receivedQuantity: 10000,
    inspectedQuantity: 315,
    acceptedQuantity: 310,
    rejectedQuantity: 5,
    unit: 'pieces',
    inspectionDate: '2024-03-12',
    inspectorId: 'emp-40',
    inspectorName: 'QC Inspector 1',
    status: 'passed',
    defects: [
      { id: 'd3', defectTypeId: 'dt-9', defectTypeCode: 'FIN-001', defectTypeName: 'Missing Button', defectTypeNameAr: 'زر مفقود', severity: 'major', quantity: 3, description: 'Some buttons have manufacturing defects', descriptionAr: 'بعض الأزرار بها عيوب تصنيع' },
      { id: 'd4', defectTypeId: 'dt-10', defectTypeCode: 'FIN-002', defectTypeName: 'Loose Thread', defectTypeNameAr: 'خيط فضفاض', severity: 'minor', quantity: 2, description: 'Minor surface scratches', descriptionAr: 'خدوش سطحية طفيفة' },
    ],
    certificates: [],
    testResults: [],
    aqlLevel: 'AQL 2.5',
    aqlResult: 'accepted',
    approvedBy: 'emp-40',
    approvedByName: 'QC Inspector 1',
    approvedDate: '2024-03-12',
    createdAt: '2024-03-12',
  },
];

export const mockInLineInspections: InLineInspection[] = [
  {
    id: 'inline-1',
    inspectionNumber: 'INSP-IL-2024-001',
    workOrderId: 'wo-2',
    workOrderNumber: 'WO-2024-0002',
    productionOrderId: 'po-1',
    productionOrderNumber: 'PO-2024-0001',
    stage: 'sewing',
    lineId: 'line-2',
    lineName: 'Sewing Line 1',
    inspectionType: 'first_piece',
    inspectedQuantity: 10,
    defectQuantity: 1,
    passedQuantity: 9,
    inspectionTime: '2024-03-04T07:30:00Z',
    inspectorId: 'emp-41',
    inspectorName: 'QC Inspector 2',
    defects: [
      { id: 'd5', defectTypeId: 'dt-6', defectTypeCode: 'SEW-001', defectTypeName: 'Broken Stitch', defectTypeNameAr: 'غرزة مقطوعة', severity: 'major', quantity: 1, description: 'Broken stitch in side seam', descriptionAr: 'غرزة مقطوعة في الحياكة الجانبية', operatorId: 'emp-21', operatorName: 'Mona' },
    ],
    status: 'passed',
    actionRequired: 'Operator training on seam quality',
    resolvedAt: '2024-03-04T08:00:00Z',
    createdAt: '2024-03-04',
  },
  {
    id: 'inline-2',
    inspectionNumber: 'INSP-IL-2024-002',
    workOrderId: 'wo-2',
    workOrderNumber: 'WO-2024-0002',
    productionOrderId: 'po-1',
    productionOrderNumber: 'PO-2024-0001',
    stage: 'sewing',
    lineId: 'line-2',
    lineName: 'Sewing Line 1',
    inspectionType: 'periodic',
    inspectedQuantity: 50,
    defectQuantity: 5,
    passedQuantity: 45,
    inspectionTime: '2024-03-17T14:00:00Z',
    inspectorId: 'emp-40',
    inspectorName: 'QC Inspector 1',
    defects: [
      { id: 'd6', defectTypeId: 'dt-6', defectTypeCode: 'SEW-001', defectTypeName: 'Broken Stitch', defectTypeNameAr: 'غرزة مقطوعة', severity: 'major', quantity: 3, description: 'Broken stitches found', descriptionAr: 'تم العثور على غرز مقطوعة', operatorId: 'emp-21', operatorName: 'Mona' },
      { id: 'd7', defectTypeId: 'dt-7', defectTypeCode: 'SEW-002', defectTypeName: 'Uneven Seam', defectTypeNameAr: 'حياكة غير مستوية', severity: 'minor', quantity: 2, description: 'Uneven seams', descriptionAr: 'حياكات غير مستوية', operatorId: 'emp-22', operatorName: 'Noor' },
    ],
    status: 'requires_action',
    actionRequired: 'Line supervisor to review and adjust machine settings',
    createdAt: '2024-03-17',
  },
];

export const mockFinalInspections: FinalInspection[] = [
  {
    id: 'fin-1',
    inspectionNumber: 'INSP-FIN-2024-001',
    productionOrderId: 'po-1',
    productionOrderNumber: 'PO-2024-0001',
    styleNumber: 'STY-2024-001',
    styleName: 'Classic T-Shirt',
    lotQuantity: 5000,
    sampleSize: 125,
    inspectedQuantity: 125,
    acceptedQuantity: 120,
    rejectedQuantity: 5,
    defectQuantity: 8,
    inspectionDate: '2024-03-18',
    inspectorId: 'emp-41',
    inspectorName: 'QC Inspector 2',
    aqlLevel: 'AQL 2.5',
    aqlResult: 'accepted',
    defects: [
      { id: 'd8', defectTypeId: 'dt-9', defectTypeCode: 'FIN-001', defectTypeName: 'Missing Button', defectTypeNameAr: 'زر مفقود', severity: 'major', quantity: 3, description: 'Buttons not properly attached', descriptionAr: 'الأزرار غير مثبتة بشكل صحيح' },
      { id: 'd9', defectTypeId: 'dt-10', defectTypeCode: 'FIN-002', defectTypeName: 'Loose Thread', defectTypeNameAr: 'خيط فضفاض', severity: 'minor', quantity: 5, description: 'Loose threads not trimmed', descriptionAr: 'خيوط فضفاضة غير مقطوعة' },
    ],
    defectRate: 6.4,
    status: 'passed',
    certificateIssued: true,
    certificateNumber: 'QC-CERT-2024-001',
    notes: 'Lot accepted with minor issues. Supplier notified for improvement.',
    approvedBy: 'emp-42',
    approvedByName: 'QC Manager',
    approvedDate: '2024-03-18',
    createdAt: '2024-03-18',
  },
];

export const mockSupplierRatings: SupplierQualityRating[] = [
  {
    id: 'sr-1',
    supplierId: 'sup-1',
    supplierName: 'Fabric World Inc.',
    supplierNameAr: 'فابريك وورلد',
    period: { startDate: '2024-01-01', endDate: '2024-03-31' },
    totalIncomingInspections: 15,
    totalReceivedQuantity: 25000,
    totalAcceptedQuantity: 24300,
    totalRejectedQuantity: 700,
    acceptanceRate: 97.2,
    onTimeDeliveryRate: 95.5,
    defectRate: 2.8,
    averageDefectsPerLot: 2.1,
    criticalDefectsCount: 3,
    rating: 4.5,
    grade: 'A',
    improvements: ['Reduce color shade variations', 'Improve packaging quality'],
    strengths: ['Consistent quality', 'Good communication', 'Reliable delivery'],
    updatedAt: '2024-03-31',
  },
  {
    id: 'sr-2',
    supplierId: 'sup-3',
    supplierName: 'Button Factory Co.',
    supplierNameAr: 'مصنع الأزرار',
    period: { startDate: '2024-01-01', endDate: '2024-03-31' },
    totalIncomingInspections: 8,
    totalReceivedQuantity: 80000,
    totalAcceptedQuantity: 78600,
    totalRejectedQuantity: 1400,
    acceptanceRate: 98.25,
    onTimeDeliveryRate: 98.0,
    defectRate: 1.75,
    averageDefectsPerLot: 1.5,
    criticalDefectsCount: 0,
    rating: 4.8,
    grade: 'A',
    improvements: ['Minor surface quality improvements'],
    strengths: ['Excellent quality', 'Very reliable', 'Competitive pricing'],
    updatedAt: '2024-03-31',
  },
];

export const mockNonConformances: NonConformance[] = [
  {
    id: 'nc-1',
    ncNumber: 'NC-2024-001',
    type: 'production',
    severity: 'major',
    title: 'High Defect Rate in Sewing Line 1',
    titleAr: 'معدل عيوب عالي في خط الخياطة 1',
    description: 'Defect rate in sewing line 1 has exceeded acceptable limits for the past week. Multiple broken stitches and uneven seams detected.',
    descriptionAr: 'معدل العيوب في خط الخياطة 1 تجاوز الحدود المقبولة خلال الأسبوع الماضي. تم اكتشاف عدة غرز مقطوعة وحياكات غير مستوية.',
    detectedBy: 'emp-40',
    detectedByName: 'QC Inspector 1',
    detectedDate: '2024-03-17',
    department: 'Production',
    relatedTo: { type: 'inspection', id: 'inline-2', reference: 'INSP-IL-2024-002' },
    rootCause: 'Machine calibration issues and insufficient operator training',
    immediateAction: 'Temporarily halt production on affected line, calibrate machines, and provide training to operators',
    correctiveAction: 'Schedule regular machine maintenance, implement daily quality checks, and provide additional training',
    preventiveAction: 'Establish preventive maintenance schedule, create operator certification program, and implement real-time quality monitoring',
    responsibleParty: 'emp-2',
    responsiblePartyName: 'Fatima Ali (Line Supervisor)',
    targetDate: '2024-03-25',
    status: 'corrective_action',
    createdAt: '2024-03-17',
  },
];

export const mockQCReports: QCReport[] = [
  {
    id: 'qr-1',
    reportNumber: 'QC-RPT-2024-001',
    reportType: 'summary',
    title: 'Monthly Quality Summary Report - March 2024',
    titleAr: 'تقرير ملخص الجودة الشهري - مارس 2024',
    period: { startDate: '2024-03-01', endDate: '2024-03-31' },
    summary: {
      totalInspected: 8500,
      totalAccepted: 8150,
      totalRejected: 350,
      defectRate: 4.12,
      defectsByType: [
        { defectType: 'Broken Stitch', quantity: 120, percentage: 34.3 },
        { defectType: 'Missing Button', quantity: 80, percentage: 22.9 },
        { defectType: 'Loose Thread', quantity: 60, percentage: 17.1 },
        { defectType: 'Size Deviation', quantity: 50, percentage: 14.3 },
        { defectType: 'Color Shade Variation', quantity: 40, percentage: 11.4 },
      ],
      defectsBySeverity: [
        { severity: 'major', quantity: 250, percentage: 71.4 },
        { severity: 'minor', quantity: 100, percentage: 28.6 },
        { severity: 'critical', quantity: 0, percentage: 0 },
      ],
    },
    generatedBy: 'emp-42',
    generatedByName: 'QC Manager',
    generatedAt: '2024-03-31',
    status: 'published',
  },
];

// Helper functions
export const calculateAQLResult = (lotSize: number, aqlLevel: string, defects: { minor: number; major: number; critical: number }) => {
  const standard = aqlStandards.find(s => s.level === aqlLevel);
  if (!standard) return { result: 'rejected', sampleSize: 0 };

  const range = standard.lotSizeRanges.find(r => lotSize >= r.min && lotSize <= r.max);
  if (!range) return { result: 'rejected', sampleSize: 0 };

  if (defects.critical > 0) return { result: 'rejected', sampleSize: range.sampleSize };
  if (defects.major > range.rejectPoints.major) return { result: 'rejected', sampleSize: range.sampleSize };
  if (defects.minor > range.rejectPoints.minor) return { result: 'rejected', sampleSize: range.sampleSize };

  return { result: 'accepted', sampleSize: range.sampleSize };
};

export const getDefectTypeName = (defectType: DefectType, lang: string) => lang === 'ar' ? defectType.nameAr : defectType.name;
export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ==================== NEW MOCK DATA ====================

export const mockMeasurementInspections: MeasurementInspection[] = [
  {
    id: 'msr-1',
    inspectionNumber: 'MSR-2024-001',
    productionOrderId: 'po-1',
    productionOrderNumber: 'PO-2024-0001',
    styleNumber: 'STY-2024-001',
    styleName: 'Classic T-Shirt',
    size: 'M',
    measurements: {
      chest: 102,
      waist: 96,
      length: 72,
      sleeveLength: 24,
      shoulderWidth: 46,
      neckOpening: 38,
    },
    tolerance: {
      chest: { min: 100, max: 104 },
      waist: { min: 94, max: 98 },
      length: { min: 70, max: 74 },
      sleeveLength: { min: 23, max: 25 },
      shoulderWidth: { min: 45, max: 47 },
      neckOpening: { min: 37, max: 39 },
    },
    sampleSize: 10,
    inspectedQuantity: 10,
    passedQuantity: 9,
    failedQuantity: 1,
    inspectionDate: '2024-03-20',
    inspectorId: 'emp-41',
    inspectorName: 'QC Inspector 2',
    status: 'passed',
    notes: 'One sample failed chest measurement',
    createdAt: '2024-03-20',
  },
];

export const mockColorMatchings: ColorMatching[] = [
  {
    id: 'cm-1',
    matchingNumber: 'COL-2024-001',
    materialId: 'mat-1',
    materialCode: 'FAB-COT-001',
    materialName: '100% Cotton Fabric - Navy Blue',
    materialNameAr: 'قماش قطن 100% - أزرق داكن',
    batchNumber: 'BT-2024-005',
    supplierId: 'sup-1',
    supplierName: 'Fabric World Inc.',
    standardColor: {
      lab: { L: 25.5, a: 2.3, b: -8.5 },
      rgb: { r: 25, g: 25, b: 112 },
      hex: '#191970',
      pantone: '19-4029 TPX',
    },
    sampleColor: {
      lab: { L: 25.8, a: 2.5, b: -8.3 },
      rgb: { r: 27, g: 27, b: 115 },
      hex: '#1B1B73',
    },
    deltaE: 0.8,
    tolerance: 1.5,
    status: 'approved',
    approvedBy: 'emp-42',
    approvedByName: 'QC Manager',
    approvedDate: '2024-03-15',
    inspectionDate: '2024-03-15',
    inspectorId: 'emp-40',
    inspectorName: 'QC Inspector 1',
    notes: 'Color within acceptable tolerance',
    createdAt: '2024-03-15',
  },
];

export const mockFabricTests: FabricTest[] = [
  {
    id: 'ft-1',
    testNumber: 'FT-2024-001',
    materialId: 'mat-1',
    materialCode: 'FAB-COT-001',
    materialName: '100% Cotton Fabric - White',
    materialNameAr: 'قماش قطن 100% - أبيض',
    batchNumber: 'BT-2024-001',
    supplierId: 'sup-1',
    supplierName: 'Fabric World Inc.',
    testType: 'colorfastness',
    testName: 'Colorfastness to Washing',
    testNameAr: 'مقاومة اللون للغسيل',
    standard: 'ISO 105-C06',
    method: 'AATCC 61-2A',
    result: 'passed',
    resultValue: 4,
    unit: 'grade',
    status: 'passed',
    specification: { min: 3, target: 4 },
    testDate: '2024-03-15',
    testedBy: 'emp-43',
    testedByName: 'Lab Technician 1',
    labName: 'Quality Lab',
    certificateNumber: 'CERT-2024-001',
    createdAt: '2024-03-15',
  },
  {
    id: 'ft-2',
    testNumber: 'FT-2024-002',
    materialId: 'mat-1',
    materialCode: 'FAB-COT-001',
    materialName: '100% Cotton Fabric - White',
    materialNameAr: 'قماش قطن 100% - أبيض',
    batchNumber: 'BT-2024-001',
    supplierId: 'sup-1',
    supplierName: 'Fabric World Inc.',
    testType: 'shrinkage',
    testName: 'Dimensional Stability',
    testNameAr: 'استقرار الأبعاد',
    standard: 'ISO 5077',
    method: 'AATCC 135',
    result: 'passed',
    resultValue: 2.1,
    unit: '%',
    status: 'passed',
    specification: { max: 3 },
    testDate: '2024-03-15',
    testedBy: 'emp-43',
    testedByName: 'Lab Technician 1',
    labName: 'Quality Lab',
    createdAt: '2024-03-15',
  },
  {
    id: 'ft-3',
    testNumber: 'FT-2024-003',
    materialId: 'mat-1',
    materialCode: 'FAB-COT-001',
    materialName: '100% Cotton Fabric - White',
    materialNameAr: 'قماش قطن 100% - أبيض',
    batchNumber: 'BT-2024-001',
    supplierId: 'sup-1',
    supplierName: 'Fabric World Inc.',
    testType: 'pilling',
    testName: 'Pilling Resistance',
    testNameAr: 'مقاومة تكوّن الكرات',
    standard: 'ISO 12945-2',
    method: 'Martindale',
    result: 'passed',
    resultValue: 4,
    unit: 'grade',
    status: 'passed',
    specification: { min: 3 },
    testDate: '2024-03-15',
    testedBy: 'emp-43',
    testedByName: 'Lab Technician 1',
    labName: 'Quality Lab',
    createdAt: '2024-03-15',
  },
];

export const mockPreProductionSamples: PreProductionSample[] = [
  {
    id: 'pps-1',
    sampleNumber: 'PPS-2024-001',
    styleId: 'sty-1',
    styleNumber: 'STY-2024-001',
    styleName: 'Classic T-Shirt',
    styleNameAr: 'قميص كلاسيكي',
    sampleType: 'pp',
    size: 'M',
    quantity: 2,
    submittedDate: '2024-03-10',
    submittedBy: 'emp-1',
    submittedByName: 'Production Manager',
    inspectionDate: '2024-03-12',
    inspectorId: 'emp-42',
    inspectorName: 'QC Manager',
    measurements: {
      chest: 102,
      waist: 96,
      length: 72,
      sleeveLength: 24,
    },
    defects: [],
    status: 'approved',
    approvalComments: 'Sample approved for production',
    approvedBy: 'emp-42',
    approvedByName: 'QC Manager',
    approvedDate: '2024-03-12',
    createdAt: '2024-03-10',
  },
];

export const mockCustomerComplaints: CustomerComplaint[] = [
  {
    id: 'cc-1',
    complaintNumber: 'COMP-2024-001',
    customerId: 'cust-1',
    customerName: 'Fashion Retail Co.',
    customerNameAr: 'شركة الأزياء للتجزئة',
    orderNumber: 'ORD-2024-0123',
    styleNumber: 'STY-2024-001',
    styleName: 'Classic T-Shirt',
    complaintDate: '2024-03-25',
    receivedDate: '2024-03-25',
    complaintType: 'quality',
    severity: 'major',
    description: 'Multiple garments with broken stitches and loose threads',
    descriptionAr: 'عدة ملابس بها غرز مقطوعة وخيوط فضفاضة',
    quantity: 15,
    status: 'investigating',
    responsibleParty: 'emp-2',
    responsiblePartyName: 'Production Supervisor',
    notes: 'Customer very concerned about quality',
    createdAt: '2024-03-25',
  },
];

export const mockReturnRejections: ReturnRejection[] = [
  {
    id: 'rr-1',
    returnNumber: 'RET-2024-001',
    customerId: 'cust-1',
    customerName: 'Fashion Retail Co.',
    orderNumber: 'ORD-2024-0123',
    styleNumber: 'STY-2024-001',
    styleName: 'Classic T-Shirt',
    returnDate: '2024-03-25',
    returnType: 'customer_return',
    quantity: 15,
    reason: 'Quality defects - broken stitches',
    reasonAr: 'عيوب جودة - غرز مقطوعة',
    defects: [
      { id: 'd1', defectTypeId: 'dt-6', defectTypeCode: 'SEW-001', defectTypeName: 'Broken Stitch', defectTypeNameAr: 'غرزة مقطوعة', severity: 'major', quantity: 15, description: 'Multiple broken stitches', descriptionAr: 'عدة غرز مقطوعة' },
    ],
    status: 'analyzed',
    analysis: {
      rootCause: 'Machine calibration issue',
      category: 'sewing',
      cost: 450,
    },
    notes: 'Returned from customer',
    createdAt: '2024-03-25',
  },
];

export const mockQualityKPIs: QualityKPI[] = [
  {
    id: 'kpi-1',
    period: { startDate: '2024-03-01', endDate: '2024-03-31' },
    firstTimePassRate: 92.5,
    overallPassRate: 96.2,
    defectRate: 3.8,
    customerComplaintRate: 1.2,
    returnRate: 0.8,
    reworkRate: 2.5,
    costOfQuality: 12500,
    supplierQualityScore: 87.5,
    internalAuditScore: 91.0,
    customerSatisfactionScore: 4.2,
    onTimeDeliveryRate: 95.8,
    createdAt: '2024-03-31',
  },
];

export const mockQualityTrainings: QualityTraining[] = [
  {
    id: 'qt-1',
    trainingNumber: 'TRAIN-2024-001',
    title: 'AQL Standards and Sampling Methods',
    titleAr: 'معايير AQL وطرق أخذ العينات',
    description: 'Training on AQL standards, sampling methods, and defect classification',
    descriptionAr: 'تدريب على معايير AQL وطرق أخذ العينات وتصنيف العيوب',
    trainingType: 'aql',
    trainerId: 'emp-42',
    trainerName: 'QC Manager',
    scheduledDate: '2024-04-15',
    duration: 4,
    participants: [
      { employeeId: 'emp-40', employeeName: 'QC Inspector 1', attendanceStatus: 'attended', score: 85, certificationIssued: true, certificationNumber: 'CERT-AQL-001' },
      { employeeId: 'emp-41', employeeName: 'QC Inspector 2', attendanceStatus: 'attended', score: 90, certificationIssued: true, certificationNumber: 'CERT-AQL-002' },
    ],
    status: 'completed',
    createdAt: '2024-04-01',
  },
];

export const mockCustomerBrandStandards: CustomerBrandStandard[] = [
  {
    id: 'cbs-1',
    customerId: 'cust-1',
    customerName: 'Fashion Retail Co.',
    customerNameAr: 'شركة الأزياء للتجزئة',
    brandName: 'Premium Line',
    brandNameAr: 'خط بريميوم',
    standardType: 'quality',
    standardName: 'Premium Quality Standard',
    standardNameAr: 'معيار الجودة المميز',
    description: 'Quality standards for premium product line',
    descriptionAr: 'معايير الجودة لخط المنتجات المميز',
    requirements: [
      { key: 'AQL Level', value: 'AQL 1.5', tolerance: '±0.1' },
      { key: 'Defect Rate', value: 'Max 2%', tolerance: '' },
      { key: 'Measurement Tolerance', value: '±1cm', tolerance: '' },
    ],
    effectiveDate: '2024-01-01',
    isActive: true,
    createdAt: '2024-01-01',
  },
];



