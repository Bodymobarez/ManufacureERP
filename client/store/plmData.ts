// ==================== PLM COMPREHENSIVE DATA ====================

export interface Style {
  id: string;
  styleNumber: string;
  name: string;
  nameAr: string;
  category: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'accessories';
  subcategory: string;
  season: string;
  collection: string;
  designerId: string;
  designerName: string;
  targetCustomer: 'men' | 'women' | 'kids' | 'unisex';
  description: string;
  descriptionAr: string;
  inspirationNotes: string;
  status: 'concept' | 'development' | 'sampling' | 'approved' | 'production' | 'discontinued';
  targetCost: number;
  targetPrice: number;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
  techPackId?: string;
  currentVersion: number;
}

export interface TechPack {
  id: string;
  styleId: string;
  techPackNumber: string;
  version: number;
  status: 'draft' | 'review' | 'approved' | 'revision';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  specifications: TechPackSpec[];
  constructionDetails: string;
  constructionDetailsAr: string;
  fitNotes: string;
  packagingInstructions: string;
  labelingRequirements: string;
  qualityStandards: string;
}

export interface TechPackSpec {
  id: string;
  category: string;
  specification: string;
  specificationAr: string;
  value: string;
  unit?: string;
  notes?: string;
}

export interface BOMItem {
  id: string;
  bomId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialNameAr: string;
  category: 'fabric' | 'trim' | 'accessory' | 'packaging' | 'label';
  colorId?: string;
  colorName?: string;
  placement: string;
  placementAr: string;
  consumption: number;
  consumptionUnit: string;
  wastagePercent: number;
  unitCost: number;
  totalCost: number;
  supplierId?: string;
  supplierName?: string;
  leadTimeDays: number;
  notes?: string;
}

export interface BOM {
  id: string;
  styleId: string;
  bomNumber: string;
  version: number;
  status: 'draft' | 'review' | 'approved' | 'archived';
  items: BOMItem[];
  totalMaterialCost: number;
  totalLaborCost: number;
  totalOverheadCost: number;
  totalCost: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface SizeChart {
  id: string;
  styleId: string;
  name: string;
  nameAr: string;
  sizeRange: string[];
  baseSize: string;
  measurements: SizeMeasurement[];
  gradingRules: GradingRule[];
  status: 'draft' | 'approved';
  createdAt: string;
  updatedAt: string;
}

export interface SizeMeasurement {
  id: string;
  pointOfMeasure: string;
  pointOfMeasureAr: string;
  code: string;
  tolerance: number;
  values: Record<string, number>; // size -> value
}

export interface GradingRule {
  id: string;
  measurementId: string;
  measurementName: string;
  gradeIncrement: number;
  direction: 'up' | 'down' | 'both';
}

export interface ColorVariant {
  id: string;
  styleId: string;
  colorCode: string;
  colorName: string;
  colorNameAr: string;
  hexCode: string;
  pantoneCode?: string;
  status: 'active' | 'pending' | 'discontinued';
  primaryMaterialColorway?: string;
  trimColorway?: string;
  imageUrl?: string;
  sortOrder: number;
  launchSeason?: string;
}

export interface Document {
  id: string;
  styleId: string;
  name: string;
  type: 'cad' | 'dxf' | 'pdf' | 'image' | 'other';
  category: 'sketch' | 'techpack' | 'pattern' | 'artwork' | 'specification' | 'sample_photo';
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
  description?: string;
  tags: string[];
}

export interface VersionHistory {
  id: string;
  entityType: 'style' | 'techpack' | 'bom' | 'sizechart';
  entityId: string;
  version: number;
  changeType: 'create' | 'update' | 'approve' | 'reject' | 'revision';
  changedBy: string;
  changedByName: string;
  changedAt: string;
  changeDescription: string;
  changeDescriptionAr: string;
  previousData?: string;
  newData?: string;
}

export interface ApprovalWorkflow {
  id: string;
  entityType: 'style' | 'techpack' | 'bom' | 'sample';
  entityId: string;
  entityName: string;
  currentStage: number;
  stages: ApprovalStage[];
  status: 'pending' | 'in_progress' | 'approved' | 'rejected';
  initiatedBy: string;
  initiatedAt: string;
  completedAt?: string;
}

export interface ApprovalStage {
  id: string;
  stageName: string;
  stageNameAr: string;
  stageOrder: number;
  approverRole: string;
  approverId?: string;
  approverName?: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  comments?: string;
  actionDate?: string;
}

// ==================== MOCK DATA ====================

export const mockStyles: Style[] = [
  {
    id: 'style-1',
    styleNumber: 'STY-2024-001',
    name: 'Classic Oxford Button-Down',
    nameAr: 'قميص أوكسفورد كلاسيكي',
    category: 'tops',
    subcategory: 'Shirts',
    season: 'SS2024',
    collection: 'Essential Classics',
    designerId: 'emp-1',
    designerName: 'Ahmed Hassan',
    targetCustomer: 'men',
    description: 'A timeless oxford button-down shirt with reinforced collar and mother-of-pearl buttons.',
    descriptionAr: 'قميص أوكسفورد كلاسيكي بياقة معززة وأزرار من الصدف.',
    inspirationNotes: 'Inspired by 1960s Ivy League style',
    status: 'production',
    targetCost: 18.00,
    targetPrice: 45.00,
    createdAt: '2024-01-10',
    updatedAt: '2024-03-15',
    currentVersion: 3
  },
  {
    id: 'style-2',
    styleNumber: 'STY-2024-002',
    name: 'Relaxed Fit Chino',
    nameAr: 'بنطلون تشينو مريح',
    category: 'bottoms',
    subcategory: 'Pants',
    season: 'SS2024',
    collection: 'Essential Classics',
    designerId: 'emp-1',
    designerName: 'Ahmed Hassan',
    targetCustomer: 'men',
    description: 'Comfortable relaxed fit chino with stretch fabric and reinforced seams.',
    descriptionAr: 'بنطلون تشينو مريح بقماش مطاط وخياطة معززة.',
    inspirationNotes: 'Modern workwear with casual appeal',
    status: 'sampling',
    targetCost: 22.00,
    targetPrice: 55.00,
    createdAt: '2024-01-20',
    updatedAt: '2024-03-18',
    currentVersion: 2
  },
  {
    id: 'style-3',
    styleNumber: 'STY-2024-003',
    name: 'Floral Summer Dress',
    nameAr: 'فستان صيفي بالزهور',
    category: 'dresses',
    subcategory: 'Casual Dresses',
    season: 'SS2024',
    collection: 'Summer Bloom',
    designerId: 'emp-2',
    designerName: 'Fatima Ali',
    targetCustomer: 'women',
    description: 'Light and breezy floral print dress perfect for summer occasions.',
    descriptionAr: 'فستان خفيف بطباعة زهور مثالي للمناسبات الصيفية.',
    inspirationNotes: 'Mediterranean garden party aesthetic',
    status: 'development',
    targetCost: 25.00,
    targetPrice: 65.00,
    createdAt: '2024-02-05',
    updatedAt: '2024-03-20',
    currentVersion: 1
  },
  {
    id: 'style-4',
    styleNumber: 'STY-2024-004',
    name: 'Kids Graphic Tee',
    nameAr: 'تيشيرت أطفال مطبوع',
    category: 'tops',
    subcategory: 'T-Shirts',
    season: 'SS2024',
    collection: 'Kids Fun',
    designerId: 'emp-2',
    designerName: 'Fatima Ali',
    targetCustomer: 'kids',
    description: 'Fun graphic tee with playful dinosaur print on soft organic cotton.',
    descriptionAr: 'تيشيرت مرح بطباعة ديناصور على قطن عضوي ناعم.',
    inspirationNotes: 'Playful and colorful for active kids',
    status: 'concept',
    targetCost: 8.00,
    targetPrice: 22.00,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-19',
    currentVersion: 1
  },
  {
    id: 'style-5',
    styleNumber: 'STY-2024-005',
    name: 'Quilted Bomber Jacket',
    nameAr: 'جاكيت بومبر مبطن',
    category: 'outerwear',
    subcategory: 'Jackets',
    season: 'FW2024',
    collection: 'Urban Edge',
    designerId: 'emp-1',
    designerName: 'Ahmed Hassan',
    targetCustomer: 'unisex',
    description: 'Modern quilted bomber with water-resistant outer and warm lining.',
    descriptionAr: 'جاكيت بومبر مبطن عصري مقاوم للماء مع بطانة دافئة.',
    inspirationNotes: 'Street style meets functionality',
    status: 'approved',
    targetCost: 45.00,
    targetPrice: 120.00,
    createdAt: '2024-02-15',
    updatedAt: '2024-03-22',
    currentVersion: 2
  }
];

export const mockTechPacks: TechPack[] = [
  {
    id: 'tp-1',
    styleId: 'style-1',
    techPackNumber: 'TP-2024-001-V3',
    version: 3,
    status: 'approved',
    createdBy: 'Ahmed Hassan',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10',
    approvedBy: 'Production Manager',
    approvedAt: '2024-03-12',
    specifications: [
      { id: 'spec-1', category: 'Fabric', specification: 'Main Body Fabric', specificationAr: 'قماش الجسم الرئيسي', value: '100% Cotton Oxford, 140gsm', notes: 'Pre-shrunk' },
      { id: 'spec-2', category: 'Fabric', specification: 'Interlining', specificationAr: 'البطانة الداخلية', value: 'Fusible collar interlining', notes: 'For collar and cuffs' },
      { id: 'spec-3', category: 'Thread', specification: 'Main Stitching', specificationAr: 'الخيط الرئيسي', value: 'Poly-core cotton, Tex 40', notes: 'Color matched' },
      { id: 'spec-4', category: 'Buttons', specification: 'Front Buttons', specificationAr: 'الأزرار الأمامية', value: '18L Mother of Pearl, 4-hole', notes: '7 pcs per garment' },
      { id: 'spec-5', category: 'Buttons', specification: 'Collar Buttons', specificationAr: 'أزرار الياقة', value: '16L Mother of Pearl, 4-hole', notes: '2 pcs per garment' },
      { id: 'spec-6', category: 'Label', specification: 'Main Label', specificationAr: 'الليبل الرئيسي', value: 'Woven damask, 40mm x 60mm', notes: 'Center back neck' },
      { id: 'spec-7', category: 'Label', specification: 'Care Label', specificationAr: 'ليبل العناية', value: 'Printed satin, 25mm wide', notes: 'Left side seam' },
      { id: 'spec-8', category: 'Packaging', specification: 'Folding', specificationAr: 'الطي', value: 'Shirt fold with collar insert', notes: 'Include tissue paper' },
    ],
    constructionDetails: '1. Attach collar to neckband\n2. Set sleeves flat\n3. Side seam construction\n4. Hem finishing with blind stitch\n5. Buttonhole placement 7cm apart',
    constructionDetailsAr: '1. تثبيت الياقة على شريط الرقبة\n2. تركيب الأكمام بشكل مسطح\n3. خياطة الجوانب\n4. إنهاء الحاشية بغرزة مخفية\n5. وضع العراوي بمسافة 7سم',
    fitNotes: 'Regular fit, 2cm ease at chest. Sleeve length to wrist bone.',
    packagingInstructions: 'Individual polybag with size sticker. Pack 10 pcs per carton.',
    labelingRequirements: 'Country of origin, fiber content, care instructions in EN/AR',
    qualityStandards: 'AQL 2.5 for major defects, AQL 4.0 for minor defects'
  },
  {
    id: 'tp-2',
    styleId: 'style-2',
    techPackNumber: 'TP-2024-002-V2',
    version: 2,
    status: 'review',
    createdBy: 'Ahmed Hassan',
    createdAt: '2024-01-25',
    updatedAt: '2024-03-18',
    specifications: [
      { id: 'spec-10', category: 'Fabric', specification: 'Main Body', specificationAr: 'القماش الرئيسي', value: '98% Cotton 2% Elastane Twill, 260gsm', notes: 'Stretch chino' },
      { id: 'spec-11', category: 'Thread', specification: 'Main Stitching', specificationAr: 'الخيط الرئيسي', value: 'Poly-core, Tex 60', notes: 'Topstitch contrast' },
      { id: 'spec-12', category: 'Hardware', specification: 'Button', specificationAr: 'الزر', value: '20L Horn-look, 4-hole', notes: 'Waistband' },
      { id: 'spec-13', category: 'Hardware', specification: 'Zipper', specificationAr: 'السحاب', value: 'YKK #4.5, 18cm', notes: 'Brass teeth' },
    ],
    constructionDetails: 'Standard trouser construction with French bearer',
    constructionDetailsAr: 'تفصيل بنطلون قياسي مع حامل فرنسي',
    fitNotes: 'Relaxed fit through hip and thigh, slight taper to hem',
    packagingInstructions: 'Hanger pack with clip, size strip on waistband',
    labelingRequirements: 'Woven main label, printed care label',
    qualityStandards: 'AQL 2.5'
  }
];

export const mockBOMs: BOM[] = [
  {
    id: 'bom-1',
    styleId: 'style-1',
    bomNumber: 'BOM-2024-001-V3',
    version: 3,
    status: 'approved',
    items: [
      { id: 'bi-1', bomId: 'bom-1', materialId: 'mat-ox1', materialCode: 'FAB-OX-001', materialName: 'Cotton Oxford Fabric', materialNameAr: 'قماش أوكسفورد قطن', category: 'fabric', placement: 'Main Body', placementAr: 'الجسم الرئيسي', consumption: 1.8, consumptionUnit: 'm', wastagePercent: 5, unitCost: 6.50, totalCost: 12.29, leadTimeDays: 14 },
      { id: 'bi-2', bomId: 'bom-1', materialId: 'mat-int1', materialCode: 'INT-FUS-001', materialName: 'Fusible Interlining', materialNameAr: 'بطانة لاصقة', category: 'fabric', placement: 'Collar & Cuffs', placementAr: 'الياقة والأساور', consumption: 0.2, consumptionUnit: 'm', wastagePercent: 10, unitCost: 2.00, totalCost: 0.44, leadTimeDays: 7 },
      { id: 'bi-3', bomId: 'bom-1', materialId: 'mat-btn1', materialCode: 'BTN-MOP-001', materialName: 'Mother of Pearl Buttons 18L', materialNameAr: 'أزرار صدف 18L', category: 'trim', placement: 'Front Placket', placementAr: 'الفتحة الأمامية', consumption: 7, consumptionUnit: 'pcs', wastagePercent: 3, unitCost: 0.25, totalCost: 1.80, leadTimeDays: 10 },
      { id: 'bi-4', bomId: 'bom-1', materialId: 'mat-btn2', materialCode: 'BTN-MOP-002', materialName: 'Mother of Pearl Buttons 16L', materialNameAr: 'أزرار صدف 16L', category: 'trim', placement: 'Collar', placementAr: 'الياقة', consumption: 2, consumptionUnit: 'pcs', wastagePercent: 3, unitCost: 0.20, totalCost: 0.41, leadTimeDays: 10 },
      { id: 'bi-5', bomId: 'bom-1', materialId: 'mat-thd1', materialCode: 'THD-PCT-040', materialName: 'Poly-core Thread Tex 40', materialNameAr: 'خيط بولي كور 40', category: 'trim', placement: 'All Seams', placementAr: 'جميع الخياطات', consumption: 150, consumptionUnit: 'm', wastagePercent: 5, unitCost: 0.005, totalCost: 0.79, leadTimeDays: 5 },
      { id: 'bi-6', bomId: 'bom-1', materialId: 'mat-lbl1', materialCode: 'LBL-WVN-001', materialName: 'Woven Main Label', materialNameAr: 'ليبل منسوج رئيسي', category: 'label', placement: 'Center Back Neck', placementAr: 'منتصف الرقبة الخلفي', consumption: 1, consumptionUnit: 'pcs', wastagePercent: 2, unitCost: 0.15, totalCost: 0.15, leadTimeDays: 14 },
      { id: 'bi-7', bomId: 'bom-1', materialId: 'mat-lbl2', materialCode: 'LBL-CRE-001', materialName: 'Care Label', materialNameAr: 'ليبل العناية', category: 'label', placement: 'Left Side Seam', placementAr: 'الجانب الأيسر', consumption: 1, consumptionUnit: 'pcs', wastagePercent: 2, unitCost: 0.08, totalCost: 0.08, leadTimeDays: 7 },
      { id: 'bi-8', bomId: 'bom-1', materialId: 'mat-pkg1', materialCode: 'PKG-BAG-001', materialName: 'Polybag with Warning', materialNameAr: 'كيس بلاستيك مع تحذير', category: 'packaging', placement: 'Individual Pack', placementAr: 'تغليف فردي', consumption: 1, consumptionUnit: 'pcs', wastagePercent: 2, unitCost: 0.05, totalCost: 0.05, leadTimeDays: 3 },
    ],
    totalMaterialCost: 16.01,
    totalLaborCost: 1.50,
    totalOverheadCost: 0.49,
    totalCost: 18.00,
    createdBy: 'Ahmed Hassan',
    createdAt: '2024-01-18',
    updatedAt: '2024-03-10',
    approvedBy: 'Production Manager',
    approvedAt: '2024-03-12'
  }
];

export const mockSizeCharts: SizeChart[] = [
  {
    id: 'sc-1',
    styleId: 'style-1',
    name: 'Men\'s Shirt Size Chart',
    nameAr: 'جدول مقاسات قميص رجالي',
    sizeRange: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    baseSize: 'M',
    measurements: [
      { id: 'sm-1', pointOfMeasure: 'Chest Width', pointOfMeasureAr: 'عرض الصدر', code: 'A', tolerance: 0.5, values: { 'XS': 48, 'S': 51, 'M': 54, 'L': 57, 'XL': 60, 'XXL': 63 } },
      { id: 'sm-2', pointOfMeasure: 'Body Length', pointOfMeasureAr: 'طول الجسم', code: 'B', tolerance: 1.0, values: { 'XS': 70, 'S': 72, 'M': 74, 'L': 76, 'XL': 78, 'XXL': 80 } },
      { id: 'sm-3', pointOfMeasure: 'Shoulder Width', pointOfMeasureAr: 'عرض الكتف', code: 'C', tolerance: 0.5, values: { 'XS': 42, 'S': 44, 'M': 46, 'L': 48, 'XL': 50, 'XXL': 52 } },
      { id: 'sm-4', pointOfMeasure: 'Sleeve Length', pointOfMeasureAr: 'طول الكم', code: 'D', tolerance: 0.5, values: { 'XS': 60, 'S': 62, 'M': 64, 'L': 66, 'XL': 68, 'XXL': 70 } },
      { id: 'sm-5', pointOfMeasure: 'Neck Opening', pointOfMeasureAr: 'فتحة الرقبة', code: 'E', tolerance: 0.3, values: { 'XS': 38, 'S': 39, 'M': 40, 'L': 41, 'XL': 42, 'XXL': 43 } },
      { id: 'sm-6', pointOfMeasure: 'Cuff Width', pointOfMeasureAr: 'عرض الأسورة', code: 'F', tolerance: 0.3, values: { 'XS': 22, 'S': 23, 'M': 24, 'L': 25, 'XL': 26, 'XXL': 27 } },
      { id: 'sm-7', pointOfMeasure: 'Bottom Width', pointOfMeasureAr: 'عرض الأسفل', code: 'G', tolerance: 0.5, values: { 'XS': 50, 'S': 53, 'M': 56, 'L': 59, 'XL': 62, 'XXL': 65 } },
    ],
    gradingRules: [
      { id: 'gr-1', measurementId: 'sm-1', measurementName: 'Chest Width', gradeIncrement: 3, direction: 'both' },
      { id: 'gr-2', measurementId: 'sm-2', measurementName: 'Body Length', gradeIncrement: 2, direction: 'both' },
      { id: 'gr-3', measurementId: 'sm-3', measurementName: 'Shoulder Width', gradeIncrement: 2, direction: 'both' },
      { id: 'gr-4', measurementId: 'sm-4', measurementName: 'Sleeve Length', gradeIncrement: 2, direction: 'both' },
    ],
    status: 'approved',
    createdAt: '2024-01-20',
    updatedAt: '2024-03-10'
  }
];

export const mockColorVariants: ColorVariant[] = [
  { id: 'cv-1', styleId: 'style-1', colorCode: 'WHT', colorName: 'Classic White', colorNameAr: 'أبيض كلاسيكي', hexCode: '#FFFFFF', pantoneCode: '11-0601 TCX', status: 'active', sortOrder: 1, launchSeason: 'SS2024' },
  { id: 'cv-2', styleId: 'style-1', colorCode: 'LBL', colorName: 'Light Blue', colorNameAr: 'أزرق فاتح', hexCode: '#ADD8E6', pantoneCode: '14-4318 TCX', status: 'active', sortOrder: 2, launchSeason: 'SS2024' },
  { id: 'cv-3', styleId: 'style-1', colorCode: 'PNK', colorName: 'Pale Pink', colorNameAr: 'وردي فاتح', hexCode: '#FFD1DC', pantoneCode: '13-2010 TCX', status: 'active', sortOrder: 3, launchSeason: 'SS2024' },
  { id: 'cv-4', styleId: 'style-1', colorCode: 'NVY', colorName: 'Navy', colorNameAr: 'كحلي', hexCode: '#000080', pantoneCode: '19-3921 TCX', status: 'active', sortOrder: 4, launchSeason: 'SS2024' },
  { id: 'cv-5', styleId: 'style-1', colorCode: 'GRY', colorName: 'Heather Grey', colorNameAr: 'رمادي مخلط', hexCode: '#9E9E9E', pantoneCode: '16-4402 TCX', status: 'pending', sortOrder: 5, launchSeason: 'FW2024' },
  { id: 'cv-6', styleId: 'style-2', colorCode: 'KHK', colorName: 'Khaki', colorNameAr: 'كاكي', hexCode: '#C3B091', pantoneCode: '16-1108 TCX', status: 'active', sortOrder: 1, launchSeason: 'SS2024' },
  { id: 'cv-7', styleId: 'style-2', colorCode: 'NVY', colorName: 'Navy', colorNameAr: 'كحلي', hexCode: '#000080', pantoneCode: '19-3921 TCX', status: 'active', sortOrder: 2, launchSeason: 'SS2024' },
  { id: 'cv-8', styleId: 'style-2', colorCode: 'OLV', colorName: 'Olive', colorNameAr: 'زيتي', hexCode: '#808000', pantoneCode: '18-0527 TCX', status: 'active', sortOrder: 3, launchSeason: 'SS2024' },
  { id: 'cv-9', styleId: 'style-3', colorCode: 'FLR', colorName: 'Floral Blue', colorNameAr: 'زهور أزرق', hexCode: '#6495ED', status: 'active', sortOrder: 1, launchSeason: 'SS2024' },
  { id: 'cv-10', styleId: 'style-3', colorCode: 'FLP', colorName: 'Floral Pink', colorNameAr: 'زهور وردي', hexCode: '#FFB6C1', status: 'pending', sortOrder: 2, launchSeason: 'SS2024' },
];

export const mockDocuments: Document[] = [
  { id: 'doc-1', styleId: 'style-1', name: 'Oxford Shirt Technical Sketch', type: 'pdf', category: 'sketch', fileUrl: '/docs/sketch-001.pdf', fileSize: 245000, uploadedBy: 'Ahmed Hassan', uploadedAt: '2024-01-12', version: 1, tags: ['front', 'back', 'details'] },
  { id: 'doc-2', styleId: 'style-1', name: 'Oxford Shirt Pattern', type: 'dxf', category: 'pattern', fileUrl: '/docs/pattern-001.dxf', fileSize: 1250000, uploadedBy: 'Pattern Maker', uploadedAt: '2024-01-18', version: 3, tags: ['graded', 'all-sizes'] },
  { id: 'doc-3', styleId: 'style-1', name: 'Collar Construction Detail', type: 'cad', category: 'specification', fileUrl: '/docs/collar-detail.dwg', fileSize: 450000, uploadedBy: 'Ahmed Hassan', uploadedAt: '2024-01-20', version: 2, tags: ['construction', 'collar'] },
  { id: 'doc-4', styleId: 'style-1', name: 'Sample Photo - White', type: 'image', category: 'sample_photo', fileUrl: '/docs/sample-white.jpg', fileSize: 850000, uploadedBy: 'QC Team', uploadedAt: '2024-02-15', version: 1, tags: ['approved', 'white'] },
  { id: 'doc-5', styleId: 'style-1', name: 'Tech Pack V3', type: 'pdf', category: 'techpack', fileUrl: '/docs/techpack-001-v3.pdf', fileSize: 2100000, uploadedBy: 'Ahmed Hassan', uploadedAt: '2024-03-10', version: 3, tags: ['final', 'approved'] },
  { id: 'doc-6', styleId: 'style-2', name: 'Chino Technical Sketch', type: 'pdf', category: 'sketch', fileUrl: '/docs/sketch-002.pdf', fileSize: 320000, uploadedBy: 'Ahmed Hassan', uploadedAt: '2024-01-22', version: 1, tags: ['front', 'back'] },
  { id: 'doc-7', styleId: 'style-3', name: 'Floral Print Artwork', type: 'pdf', category: 'artwork', fileUrl: '/docs/artwork-003.pdf', fileSize: 5500000, uploadedBy: 'Fatima Ali', uploadedAt: '2024-02-08', version: 2, tags: ['print', 'repeat'] },
];

export const mockVersionHistory: VersionHistory[] = [
  { id: 'vh-1', entityType: 'style', entityId: 'style-1', version: 1, changeType: 'create', changedBy: 'emp-1', changedByName: 'Ahmed Hassan', changedAt: '2024-01-10', changeDescription: 'Initial style creation', changeDescriptionAr: 'إنشاء الستايل الأولي' },
  { id: 'vh-2', entityType: 'style', entityId: 'style-1', version: 2, changeType: 'update', changedBy: 'emp-1', changedByName: 'Ahmed Hassan', changedAt: '2024-02-05', changeDescription: 'Updated target cost and specifications', changeDescriptionAr: 'تحديث التكلفة المستهدفة والمواصفات' },
  { id: 'vh-3', entityType: 'techpack', entityId: 'tp-1', version: 1, changeType: 'create', changedBy: 'emp-1', changedByName: 'Ahmed Hassan', changedAt: '2024-01-15', changeDescription: 'Initial tech pack creation', changeDescriptionAr: 'إنشاء الملف الفني الأولي' },
  { id: 'vh-4', entityType: 'techpack', entityId: 'tp-1', version: 2, changeType: 'revision', changedBy: 'emp-1', changedByName: 'Ahmed Hassan', changedAt: '2024-02-20', changeDescription: 'Revised button specifications', changeDescriptionAr: 'مراجعة مواصفات الأزرار' },
  { id: 'vh-5', entityType: 'techpack', entityId: 'tp-1', version: 3, changeType: 'approve', changedBy: 'emp-3', changedByName: 'Mohamed Ibrahim', changedAt: '2024-03-12', changeDescription: 'Tech pack approved for production', changeDescriptionAr: 'الموافقة على الملف الفني للإنتاج' },
  { id: 'vh-6', entityType: 'bom', entityId: 'bom-1', version: 1, changeType: 'create', changedBy: 'emp-1', changedByName: 'Ahmed Hassan', changedAt: '2024-01-18', changeDescription: 'Initial BOM creation', changeDescriptionAr: 'إنشاء قائمة المواد الأولية' },
  { id: 'vh-7', entityType: 'bom', entityId: 'bom-1', version: 2, changeType: 'update', changedBy: 'emp-1', changedByName: 'Ahmed Hassan', changedAt: '2024-02-25', changeDescription: 'Updated material consumption rates', changeDescriptionAr: 'تحديث معدلات استهلاك المواد' },
  { id: 'vh-8', entityType: 'bom', entityId: 'bom-1', version: 3, changeType: 'approve', changedBy: 'emp-3', changedByName: 'Mohamed Ibrahim', changedAt: '2024-03-12', changeDescription: 'BOM approved', changeDescriptionAr: 'الموافقة على قائمة المواد' },
  { id: 'vh-9', entityType: 'style', entityId: 'style-1', version: 3, changeType: 'approve', changedBy: 'emp-3', changedByName: 'Mohamed Ibrahim', changedAt: '2024-03-15', changeDescription: 'Style approved for production', changeDescriptionAr: 'الموافقة على الستايل للإنتاج' },
];

export const mockApprovalWorkflows: ApprovalWorkflow[] = [
  {
    id: 'aw-1',
    entityType: 'style',
    entityId: 'style-2',
    entityName: 'Relaxed Fit Chino',
    currentStage: 2,
    stages: [
      { id: 'as-1', stageName: 'Design Review', stageNameAr: 'مراجعة التصميم', stageOrder: 1, approverRole: 'Design Lead', approverId: 'emp-2', approverName: 'Fatima Ali', status: 'approved', comments: 'Design approved with minor notes', actionDate: '2024-03-15' },
      { id: 'as-2', stageName: 'Technical Review', stageNameAr: 'المراجعة الفنية', stageOrder: 2, approverRole: 'Technical Manager', status: 'pending', approverId: 'emp-1', approverName: 'Ahmed Hassan' },
      { id: 'as-3', stageName: 'Cost Approval', stageNameAr: 'الموافقة على التكلفة', stageOrder: 3, approverRole: 'Finance Manager', status: 'pending' },
      { id: 'as-4', stageName: 'Final Sign-off', stageNameAr: 'التوقيع النهائي', stageOrder: 4, approverRole: 'Production Director', status: 'pending' },
    ],
    status: 'in_progress',
    initiatedBy: 'Ahmed Hassan',
    initiatedAt: '2024-03-14'
  },
  {
    id: 'aw-2',
    entityType: 'sample',
    entityId: 'sample-1',
    entityName: 'Oxford Shirt - Pre-production Sample',
    currentStage: 3,
    stages: [
      { id: 'as-5', stageName: 'QC Inspection', stageNameAr: 'فحص الجودة', stageOrder: 1, approverRole: 'QC Inspector', approverId: 'emp-2', approverName: 'Fatima Ali', status: 'approved', actionDate: '2024-03-10' },
      { id: 'as-6', stageName: 'Fit Approval', stageNameAr: 'موافقة المقاس', stageOrder: 2, approverRole: 'Fit Technician', approverId: 'emp-1', approverName: 'Ahmed Hassan', status: 'approved', comments: 'Fit approved, ready for bulk', actionDate: '2024-03-11' },
      { id: 'as-7', stageName: 'Customer Approval', stageNameAr: 'موافقة العميل', stageOrder: 3, approverRole: 'Customer', status: 'pending' },
    ],
    status: 'in_progress',
    initiatedBy: 'QC Team',
    initiatedAt: '2024-03-08'
  },
  {
    id: 'aw-3',
    entityType: 'bom',
    entityId: 'bom-1',
    entityName: 'BOM-2024-001 - Oxford Shirt',
    currentStage: 4,
    stages: [
      { id: 'as-8', stageName: 'Material Verification', stageNameAr: 'التحقق من المواد', stageOrder: 1, approverRole: 'Warehouse', status: 'approved', actionDate: '2024-03-05' },
      { id: 'as-9', stageName: 'Cost Review', stageNameAr: 'مراجعة التكلفة', stageOrder: 2, approverRole: 'Costing Team', status: 'approved', actionDate: '2024-03-08' },
      { id: 'as-10', stageName: 'Procurement Check', stageNameAr: 'فحص المشتريات', stageOrder: 3, approverRole: 'Procurement', status: 'approved', actionDate: '2024-03-10' },
      { id: 'as-11', stageName: 'Final Approval', stageNameAr: 'الموافقة النهائية', stageOrder: 4, approverRole: 'Production Manager', status: 'approved', actionDate: '2024-03-12' },
    ],
    status: 'approved',
    initiatedBy: 'Ahmed Hassan',
    initiatedAt: '2024-03-01',
    completedAt: '2024-03-12'
  }
];

// Helper functions
export const getStyleName = (style: Style, lang: string) => lang === 'ar' ? style.nameAr : style.name;
export const getColorName = (color: ColorVariant, lang: string) => lang === 'ar' ? color.colorNameAr : color.colorName;
export const getStylesByStatus = (status: Style['status']) => mockStyles.filter(s => s.status === status);
export const getColorsByStyle = (styleId: string) => mockColorVariants.filter(c => c.styleId === styleId);
export const getDocumentsByStyle = (styleId: string) => mockDocuments.filter(d => d.styleId === styleId);
export const getBOMByStyle = (styleId: string) => mockBOMs.find(b => b.styleId === styleId);
export const getTechPackByStyle = (styleId: string) => mockTechPacks.find(t => t.styleId === styleId);
export const getSizeChartByStyle = (styleId: string) => mockSizeCharts.find(s => s.styleId === styleId);
export const getVersionHistory = (entityType: string, entityId: string) => 
  mockVersionHistory.filter(v => v.entityType === entityType && v.entityId === entityId);
export const getApprovalWorkflow = (entityType: string, entityId: string) =>
  mockApprovalWorkflows.find(a => a.entityType === entityType && a.entityId === entityId);



