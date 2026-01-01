import type {
  Product, BillOfMaterials, Warehouse, Material, StockItem,
  ProductionLine, WorkOrder, QualityInspection, Defect,
  Employee, Department, Attendance, Supplier, PurchaseOrder,
  Customer, SalesOrder, Machine, MachineMetrics, CostCenter,
  LedgerEntry, Invoice, KPIMetric
} from '@shared/types';

// ==================== MOCK DATA ====================

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    code: 'TS-001',
    name: 'Premium Cotton T-Shirt',
    nameAr: 'تيشيرت قطن فاخر',
    category: 'T-Shirts',
    description: 'High-quality cotton t-shirt with reinforced stitching',
    status: 'active',
    season: 'SS2024',
    targetCost: 15.00,
    actualCost: 14.50,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20'
  },
  {
    id: 'prod-2',
    code: 'JN-001',
    name: 'Classic Denim Jeans',
    nameAr: 'جينز كلاسيكي',
    category: 'Pants',
    description: 'Classic fit denim jeans with stretch fabric',
    status: 'active',
    season: 'FW2024',
    targetCost: 28.00,
    actualCost: 27.20,
    createdAt: '2024-02-10',
    updatedAt: '2024-03-18'
  },
  {
    id: 'prod-3',
    code: 'PL-001',
    name: 'Polo Shirt',
    nameAr: 'قميص بولو',
    category: 'Shirts',
    description: 'Classic polo shirt with embroidered logo',
    status: 'active',
    season: 'SS2024',
    targetCost: 18.00,
    actualCost: 17.50,
    createdAt: '2024-01-20',
    updatedAt: '2024-03-15'
  },
  {
    id: 'prod-4',
    code: 'HD-001',
    name: 'Hoodie Sweatshirt',
    nameAr: 'هودي سويت شيرت',
    category: 'Outerwear',
    description: 'Warm fleece hoodie with kangaroo pocket',
    status: 'draft',
    season: 'FW2024',
    targetCost: 32.00,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-22'
  },
];

export const mockWarehouses: Warehouse[] = [
  {
    id: 'wh-1',
    code: 'WH-RM-01',
    name: 'Raw Materials Warehouse A',
    nameAr: 'مستودع المواد الخام أ',
    location: 'Building A, Zone 1',
    capacity: 10000,
    usedCapacity: 7500,
    type: 'raw_materials',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2024-03-20'
  },
  {
    id: 'wh-2',
    code: 'WH-FG-01',
    name: 'Finished Goods Warehouse',
    nameAr: 'مستودع المنتجات النهائية',
    location: 'Building B, Zone 2',
    capacity: 15000,
    usedCapacity: 9200,
    type: 'finished_goods',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2024-03-20'
  },
  {
    id: 'wh-3',
    code: 'WH-WIP-01',
    name: 'Work in Progress Storage',
    nameAr: 'مخزن العمل قيد التنفيذ',
    location: 'Production Floor',
    capacity: 5000,
    usedCapacity: 3200,
    type: 'wip',
    isActive: true,
    createdAt: '2023-06-01',
    updatedAt: '2024-03-20'
  },
];

export const mockMaterials: Material[] = [
  {
    id: 'mat-1',
    code: 'FAB-COT-001',
    name: '100% Cotton Fabric',
    nameAr: 'قماش قطن 100%',
    category: 'fabric',
    unit: 'meters',
    unitCost: 5.50,
    minStock: 500,
    maxStock: 5000,
    leadTimeDays: 14,
    createdAt: '2023-01-15',
    updatedAt: '2024-03-20'
  },
  {
    id: 'mat-2',
    code: 'FAB-DEN-001',
    name: 'Stretch Denim Fabric',
    nameAr: 'قماش دنيم مطاط',
    category: 'fabric',
    unit: 'meters',
    unitCost: 8.00,
    minStock: 300,
    maxStock: 3000,
    leadTimeDays: 21,
    createdAt: '2023-02-10',
    updatedAt: '2024-03-20'
  },
  {
    id: 'mat-3',
    code: 'TRM-BTN-001',
    name: 'Metal Buttons',
    nameAr: 'أزرار معدنية',
    category: 'trim',
    unit: 'pieces',
    unitCost: 0.15,
    minStock: 10000,
    maxStock: 50000,
    leadTimeDays: 7,
    createdAt: '2023-01-20',
    updatedAt: '2024-03-20'
  },
  {
    id: 'mat-4',
    code: 'TRM-ZIP-001',
    name: 'YKK Zipper 18cm',
    nameAr: 'سحاب YKK 18سم',
    category: 'trim',
    unit: 'pieces',
    unitCost: 0.80,
    minStock: 5000,
    maxStock: 25000,
    leadTimeDays: 10,
    createdAt: '2023-03-05',
    updatedAt: '2024-03-20'
  },
  {
    id: 'mat-5',
    code: 'ACC-LBL-001',
    name: 'Woven Labels',
    nameAr: 'ليبل منسوج',
    category: 'accessory',
    unit: 'pieces',
    unitCost: 0.10,
    minStock: 20000,
    maxStock: 100000,
    leadTimeDays: 14,
    createdAt: '2023-01-25',
    updatedAt: '2024-03-20'
  },
];

export const mockStockItems: StockItem[] = [
  { id: 'stk-1', materialId: 'mat-1', warehouseId: 'wh-1', quantity: 2500, reservedQuantity: 500, availableQuantity: 2000, location: 'A-01-01', createdAt: '2024-01-01', updatedAt: '2024-03-20' },
  { id: 'stk-2', materialId: 'mat-2', warehouseId: 'wh-1', quantity: 1800, reservedQuantity: 300, availableQuantity: 1500, location: 'A-01-02', createdAt: '2024-01-01', updatedAt: '2024-03-20' },
  { id: 'stk-3', materialId: 'mat-3', warehouseId: 'wh-1', quantity: 35000, reservedQuantity: 5000, availableQuantity: 30000, location: 'B-02-01', createdAt: '2024-01-01', updatedAt: '2024-03-20' },
  { id: 'stk-4', materialId: 'mat-4', warehouseId: 'wh-1', quantity: 12000, reservedQuantity: 2000, availableQuantity: 10000, location: 'B-02-02', createdAt: '2024-01-01', updatedAt: '2024-03-20' },
  { id: 'stk-5', materialId: 'mat-5', warehouseId: 'wh-1', quantity: 45000, reservedQuantity: 10000, availableQuantity: 35000, location: 'C-01-01', createdAt: '2024-01-01', updatedAt: '2024-03-20' },
];

export const mockProductionLines: ProductionLine[] = [
  { id: 'line-1', code: 'CUT-01', name: 'Cutting Line 1', nameAr: 'خط القطع 1', type: 'cutting', capacity: 5000, efficiency: 92, status: 'active', createdAt: '2023-01-01', updatedAt: '2024-03-20' },
  { id: 'line-2', code: 'SEW-01', name: 'Sewing Line 1', nameAr: 'خط الخياطة 1', type: 'sewing', capacity: 3000, efficiency: 88, status: 'active', createdAt: '2023-01-01', updatedAt: '2024-03-20' },
  { id: 'line-3', code: 'SEW-02', name: 'Sewing Line 2', nameAr: 'خط الخياطة 2', type: 'sewing', capacity: 3500, efficiency: 85, status: 'active', createdAt: '2023-03-01', updatedAt: '2024-03-20' },
  { id: 'line-4', code: 'FIN-01', name: 'Finishing Line 1', nameAr: 'خط الإنهاء 1', type: 'finishing', capacity: 4000, efficiency: 90, status: 'active', createdAt: '2023-01-01', updatedAt: '2024-03-20' },
  { id: 'line-5', code: 'PCK-01', name: 'Packing Line 1', nameAr: 'خط التعبئة 1', type: 'packing', capacity: 6000, efficiency: 95, status: 'active', createdAt: '2023-01-01', updatedAt: '2024-03-20' },
];

export const mockWorkOrders: WorkOrder[] = [
  {
    id: 'wo-1',
    orderNumber: 'WO-2024-001',
    productId: 'prod-1',
    salesOrderId: 'so-1',
    quantity: 5000,
    completedQuantity: 4500,
    defectQuantity: 45,
    status: 'in_progress',
    priority: 'high',
    plannedStartDate: '2024-03-01',
    plannedEndDate: '2024-03-15',
    actualStartDate: '2024-03-02',
    productionLineId: 'line-2',
    createdAt: '2024-02-25',
    updatedAt: '2024-03-20'
  },
  {
    id: 'wo-2',
    orderNumber: 'WO-2024-002',
    productId: 'prod-2',
    salesOrderId: 'so-2',
    quantity: 3000,
    completedQuantity: 3000,
    defectQuantity: 28,
    status: 'completed',
    priority: 'medium',
    plannedStartDate: '2024-03-05',
    plannedEndDate: '2024-03-18',
    actualStartDate: '2024-03-05',
    actualEndDate: '2024-03-17',
    productionLineId: 'line-3',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-17'
  },
  {
    id: 'wo-3',
    orderNumber: 'WO-2024-003',
    productId: 'prod-3',
    quantity: 2000,
    completedQuantity: 0,
    defectQuantity: 0,
    status: 'planned',
    priority: 'medium',
    plannedStartDate: '2024-03-25',
    plannedEndDate: '2024-04-05',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15'
  },
  {
    id: 'wo-4',
    orderNumber: 'WO-2024-004',
    productId: 'prod-1',
    quantity: 8000,
    completedQuantity: 2500,
    defectQuantity: 32,
    status: 'in_progress',
    priority: 'urgent',
    plannedStartDate: '2024-03-18',
    plannedEndDate: '2024-04-01',
    actualStartDate: '2024-03-18',
    productionLineId: 'line-2',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-22'
  },
];

export const mockDepartments: Department[] = [
  { id: 'dept-1', code: 'PROD', name: 'Production', nameAr: 'الإنتاج', employeeCount: 150, createdAt: '2023-01-01', updatedAt: '2024-01-01' },
  { id: 'dept-2', code: 'QC', name: 'Quality Control', nameAr: 'ضبط الجودة', employeeCount: 25, createdAt: '2023-01-01', updatedAt: '2024-01-01' },
  { id: 'dept-3', code: 'WH', name: 'Warehouse', nameAr: 'المستودعات', employeeCount: 30, createdAt: '2023-01-01', updatedAt: '2024-01-01' },
  { id: 'dept-4', code: 'HR', name: 'Human Resources', nameAr: 'الموارد البشرية', employeeCount: 8, createdAt: '2023-01-01', updatedAt: '2024-01-01' },
  { id: 'dept-5', code: 'FIN', name: 'Finance', nameAr: 'المالية', employeeCount: 12, createdAt: '2023-01-01', updatedAt: '2024-01-01' },
  { id: 'dept-6', code: 'SALES', name: 'Sales', nameAr: 'المبيعات', employeeCount: 15, createdAt: '2023-01-01', updatedAt: '2024-01-01' },
];

export const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    employeeId: 'EMP-001',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    firstNameAr: 'أحمد',
    lastNameAr: 'حسن',
    email: 'ahmed.hassan@company.com',
    phone: '+20 100 123 4567',
    departmentId: 'dept-1',
    position: 'Production Manager',
    positionAr: 'مدير الإنتاج',
    hireDate: '2020-03-15',
    status: 'active',
    salary: 15000,
    hourlyRate: 75,
    skills: ['Production Planning', 'Team Leadership', 'Quality Control'],
    createdAt: '2020-03-15',
    updatedAt: '2024-01-01'
  },
  {
    id: 'emp-2',
    employeeId: 'EMP-002',
    firstName: 'Fatima',
    lastName: 'Ali',
    firstNameAr: 'فاطمة',
    lastNameAr: 'علي',
    email: 'fatima.ali@company.com',
    phone: '+20 100 234 5678',
    departmentId: 'dept-2',
    position: 'QC Supervisor',
    positionAr: 'مشرف الجودة',
    hireDate: '2021-06-01',
    status: 'active',
    salary: 10000,
    hourlyRate: 50,
    skills: ['Quality Inspection', 'AQL Standards', 'Documentation'],
    createdAt: '2021-06-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'emp-3',
    employeeId: 'EMP-003',
    firstName: 'Mohamed',
    lastName: 'Ibrahim',
    firstNameAr: 'محمد',
    lastNameAr: 'إبراهيم',
    email: 'mohamed.ibrahim@company.com',
    phone: '+20 100 345 6789',
    departmentId: 'dept-1',
    position: 'Sewing Line Supervisor',
    positionAr: 'مشرف خط الخياطة',
    hireDate: '2019-08-10',
    status: 'active',
    salary: 8000,
    hourlyRate: 40,
    skills: ['Sewing Operations', 'Machine Maintenance', 'Team Management'],
    createdAt: '2019-08-10',
    updatedAt: '2024-01-01'
  },
  {
    id: 'emp-4',
    employeeId: 'EMP-004',
    firstName: 'Sara',
    lastName: 'Ahmed',
    firstNameAr: 'سارة',
    lastNameAr: 'أحمد',
    email: 'sara.ahmed@company.com',
    phone: '+20 100 456 7890',
    departmentId: 'dept-5',
    position: 'Accountant',
    positionAr: 'محاسب',
    hireDate: '2022-01-15',
    status: 'active',
    salary: 9000,
    hourlyRate: 45,
    skills: ['Financial Reporting', 'Cost Analysis', 'ERP Systems'],
    createdAt: '2022-01-15',
    updatedAt: '2024-01-01'
  },
];

export const mockSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    code: 'SUP-001',
    name: 'Premium Fabrics Co.',
    nameAr: 'شركة الأقمشة الفاخرة',
    contactPerson: 'John Smith',
    email: 'john@premiumfabrics.com',
    phone: '+1 555 123 4567',
    address: '123 Textile Street, Shanghai',
    country: 'China',
    rating: 4.5,
    status: 'active',
    paymentTerms: 'Net 30',
    leadTimeDays: 21,
    categories: ['fabric'],
    createdAt: '2022-01-01',
    updatedAt: '2024-03-20'
  },
  {
    id: 'sup-2',
    code: 'SUP-002',
    name: 'Global Trims Ltd.',
    nameAr: 'شركة الإكسسوارات العالمية',
    contactPerson: 'Maria Garcia',
    email: 'maria@globaltrims.com',
    phone: '+91 98 7654 3210',
    address: '456 Trim Avenue, Mumbai',
    country: 'India',
    rating: 4.2,
    status: 'active',
    paymentTerms: 'Net 45',
    leadTimeDays: 14,
    categories: ['trim', 'accessory'],
    createdAt: '2022-03-15',
    updatedAt: '2024-03-20'
  },
  {
    id: 'sup-3',
    code: 'SUP-003',
    name: 'Quality Zippers Inc.',
    nameAr: 'شركة السحابات الجودة',
    contactPerson: 'David Lee',
    email: 'david@qualityzippers.com',
    phone: '+81 3 1234 5678',
    address: '789 Zipper Road, Tokyo',
    country: 'Japan',
    rating: 4.8,
    status: 'active',
    paymentTerms: 'Net 30',
    leadTimeDays: 10,
    categories: ['trim'],
    createdAt: '2021-06-01',
    updatedAt: '2024-03-20'
  },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'PO-2024-001',
    supplierId: 'sup-1',
    status: 'confirmed',
    orderDate: '2024-03-01',
    expectedDeliveryDate: '2024-03-22',
    subtotal: 27500,
    tax: 3850,
    total: 31350,
    items: [
      { id: 'poi-1', materialId: 'mat-1', materialName: '100% Cotton Fabric', quantity: 5000, receivedQuantity: 0, unit: 'meters', unitPrice: 5.50, total: 27500 }
    ],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-05'
  },
  {
    id: 'po-2',
    poNumber: 'PO-2024-002',
    supplierId: 'sup-2',
    status: 'partially_received',
    orderDate: '2024-02-20',
    expectedDeliveryDate: '2024-03-06',
    subtotal: 8500,
    tax: 1190,
    total: 9690,
    items: [
      { id: 'poi-2', materialId: 'mat-3', materialName: 'Metal Buttons', quantity: 50000, receivedQuantity: 35000, unit: 'pieces', unitPrice: 0.15, total: 7500 },
      { id: 'poi-3', materialId: 'mat-5', materialName: 'Woven Labels', quantity: 10000, receivedQuantity: 10000, unit: 'pieces', unitPrice: 0.10, total: 1000 }
    ],
    createdAt: '2024-02-20',
    updatedAt: '2024-03-10'
  },
];

export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    code: 'CUST-001',
    name: 'Fashion Retail Chain',
    nameAr: 'سلسلة تجزئة الأزياء',
    type: 'wholesale',
    contactPerson: 'Emma Wilson',
    email: 'emma@fashionretail.com',
    phone: '+1 555 987 6543',
    address: '100 Fashion Ave, New York',
    country: 'USA',
    creditLimit: 500000,
    currentBalance: 125000,
    paymentTerms: 'Net 60',
    status: 'active',
    createdAt: '2021-01-01',
    updatedAt: '2024-03-20'
  },
  {
    id: 'cust-2',
    code: 'CUST-002',
    name: 'European Style GmbH',
    nameAr: 'شركة الستايل الأوروبي',
    type: 'export',
    contactPerson: 'Hans Mueller',
    email: 'hans@europeanstyle.de',
    phone: '+49 30 1234 5678',
    address: '200 Mode Strasse, Berlin',
    country: 'Germany',
    creditLimit: 750000,
    currentBalance: 280000,
    paymentTerms: 'Net 45',
    status: 'active',
    createdAt: '2020-06-15',
    updatedAt: '2024-03-20'
  },
  {
    id: 'cust-3',
    code: 'CUST-003',
    name: 'Local Boutique Store',
    nameAr: 'متجر البوتيك المحلي',
    type: 'retail',
    contactPerson: 'Nadia Hassan',
    email: 'nadia@localboutique.com',
    phone: '+20 100 567 8901',
    address: '50 Shopping Street, Cairo',
    country: 'Egypt',
    creditLimit: 50000,
    currentBalance: 12000,
    paymentTerms: 'Net 30',
    status: 'active',
    createdAt: '2023-03-01',
    updatedAt: '2024-03-20'
  },
];

export const mockSalesOrders: SalesOrder[] = [
  {
    id: 'so-1',
    orderNumber: 'SO-2024-001',
    customerId: 'cust-1',
    status: 'in_production',
    orderDate: '2024-02-15',
    requiredDate: '2024-04-01',
    subtotal: 75000,
    discount: 3750,
    tax: 9975,
    total: 81225,
    items: [
      { id: 'soi-1', productId: 'prod-1', productName: 'Premium Cotton T-Shirt', quantity: 5000, producedQuantity: 4500, unitPrice: 15.00, discount: 5, total: 71250, size: 'Mixed', color: 'White' }
    ],
    shippingAddress: '100 Fashion Ave, New York, USA',
    createdAt: '2024-02-15',
    updatedAt: '2024-03-20'
  },
  {
    id: 'so-2',
    orderNumber: 'SO-2024-002',
    customerId: 'cust-2',
    status: 'ready',
    orderDate: '2024-02-20',
    requiredDate: '2024-03-25',
    subtotal: 84000,
    discount: 4200,
    tax: 11172,
    total: 90972,
    items: [
      { id: 'soi-2', productId: 'prod-2', productName: 'Classic Denim Jeans', quantity: 3000, producedQuantity: 3000, unitPrice: 28.00, discount: 5, total: 79800, size: 'Mixed', color: 'Blue' }
    ],
    shippingAddress: '200 Mode Strasse, Berlin, Germany',
    createdAt: '2024-02-20',
    updatedAt: '2024-03-17'
  },
  {
    id: 'so-3',
    orderNumber: 'SO-2024-003',
    customerId: 'cust-3',
    status: 'confirmed',
    orderDate: '2024-03-10',
    requiredDate: '2024-04-15',
    subtotal: 9000,
    discount: 0,
    tax: 1260,
    total: 10260,
    items: [
      { id: 'soi-3', productId: 'prod-3', productName: 'Polo Shirt', quantity: 500, producedQuantity: 0, unitPrice: 18.00, discount: 0, total: 9000, size: 'Mixed', color: 'Navy' }
    ],
    shippingAddress: '50 Shopping Street, Cairo, Egypt',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10'
  },
];

export const mockMachines: Machine[] = [
  {
    id: 'mach-1',
    code: 'SEW-M-001',
    name: 'Industrial Sewing Machine 1',
    nameAr: 'ماكينة خياطة صناعية 1',
    type: 'sewing',
    model: 'DDL-9000C',
    manufacturer: 'Juki',
    serialNumber: 'JK-2023-001234',
    productionLineId: 'line-2',
    status: 'running',
    purchaseDate: '2023-01-15',
    lastMaintenanceDate: '2024-02-15',
    nextMaintenanceDate: '2024-05-15',
    createdAt: '2023-01-15',
    updatedAt: '2024-03-20'
  },
  {
    id: 'mach-2',
    code: 'CUT-M-001',
    name: 'Automatic Cutting Machine',
    nameAr: 'ماكينة قطع أوتوماتيكية',
    type: 'cutting',
    model: 'Vector Q-Series',
    manufacturer: 'Lectra',
    serialNumber: 'LC-2022-005678',
    productionLineId: 'line-1',
    status: 'running',
    purchaseDate: '2022-06-01',
    lastMaintenanceDate: '2024-01-20',
    nextMaintenanceDate: '2024-04-20',
    createdAt: '2022-06-01',
    updatedAt: '2024-03-20'
  },
  {
    id: 'mach-3',
    code: 'SEW-M-002',
    name: 'Overlock Machine',
    nameAr: 'ماكينة أوفرلوك',
    type: 'sewing',
    model: 'MO-6800D',
    manufacturer: 'Juki',
    serialNumber: 'JK-2023-002345',
    productionLineId: 'line-2',
    status: 'idle',
    purchaseDate: '2023-03-01',
    lastMaintenanceDate: '2024-02-28',
    nextMaintenanceDate: '2024-05-28',
    createdAt: '2023-03-01',
    updatedAt: '2024-03-20'
  },
  {
    id: 'mach-4',
    code: 'PRS-M-001',
    name: 'Steam Press Machine',
    nameAr: 'ماكينة كي بالبخار',
    type: 'pressing',
    model: 'Veit 8363',
    manufacturer: 'Veit',
    serialNumber: 'VT-2021-009876',
    productionLineId: 'line-4',
    status: 'maintenance',
    purchaseDate: '2021-09-15',
    lastMaintenanceDate: '2024-03-18',
    nextMaintenanceDate: '2024-06-18',
    createdAt: '2021-09-15',
    updatedAt: '2024-03-20'
  },
];

export const mockQualityInspections: QualityInspection[] = [
  {
    id: 'qc-1',
    type: 'final',
    referenceType: 'work_order',
    referenceId: 'wo-2',
    inspectorId: 'emp-2',
    sampleSize: 200,
    defectsFound: 8,
    status: 'passed',
    aqlLevel: '2.5',
    notes: 'Minor defects within acceptable range',
    createdAt: '2024-03-17',
    updatedAt: '2024-03-17'
  },
  {
    id: 'qc-2',
    type: 'inline',
    referenceType: 'work_order',
    referenceId: 'wo-1',
    inspectorId: 'emp-2',
    sampleSize: 150,
    defectsFound: 12,
    status: 'conditional',
    aqlLevel: '2.5',
    notes: 'Some stitching issues detected, rework required',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15'
  },
  {
    id: 'qc-3',
    type: 'incoming',
    referenceType: 'purchase_order',
    referenceId: 'po-2',
    inspectorId: 'emp-2',
    sampleSize: 500,
    defectsFound: 3,
    status: 'passed',
    aqlLevel: '1.0',
    notes: 'Material quality meets specifications',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10'
  },
];

export const mockCostCenters: CostCenter[] = [
  { id: 'cc-1', code: 'CC-PROD', name: 'Production', nameAr: 'الإنتاج', type: 'production', budget: 500000, spent: 425000, createdAt: '2024-01-01', updatedAt: '2024-03-20' },
  { id: 'cc-2', code: 'CC-QC', name: 'Quality Control', nameAr: 'ضبط الجودة', type: 'production', budget: 80000, spent: 65000, createdAt: '2024-01-01', updatedAt: '2024-03-20' },
  { id: 'cc-3', code: 'CC-WH', name: 'Warehouse', nameAr: 'المستودعات', type: 'overhead', budget: 120000, spent: 98000, createdAt: '2024-01-01', updatedAt: '2024-03-20' },
  { id: 'cc-4', code: 'CC-ADMIN', name: 'Administration', nameAr: 'الإدارة', type: 'admin', budget: 200000, spent: 175000, createdAt: '2024-01-01', updatedAt: '2024-03-20' },
  { id: 'cc-5', code: 'CC-SALES', name: 'Sales & Marketing', nameAr: 'المبيعات والتسويق', type: 'sales', budget: 150000, spent: 120000, createdAt: '2024-01-01', updatedAt: '2024-03-20' },
];

export const mockKPIs: KPIMetric[] = [
  { id: 'kpi-1', name: 'Production Efficiency', nameAr: 'كفاءة الإنتاج', value: 87.5, previousValue: 85.2, change: 2.7, changeType: 'increase', unit: '%', target: 90, status: 'warning' },
  { id: 'kpi-2', name: 'Order Fulfillment Rate', nameAr: 'معدل تنفيذ الطلبات', value: 94.2, previousValue: 92.8, change: 1.5, changeType: 'increase', unit: '%', target: 95, status: 'good' },
  { id: 'kpi-3', name: 'Quality Pass Rate', nameAr: 'معدل نجاح الجودة', value: 96.8, previousValue: 97.1, change: -0.3, changeType: 'decrease', unit: '%', target: 98, status: 'warning' },
  { id: 'kpi-4', name: 'On-Time Delivery', nameAr: 'التسليم في الوقت', value: 91.5, previousValue: 89.0, change: 2.8, changeType: 'increase', unit: '%', target: 95, status: 'warning' },
  { id: 'kpi-5', name: 'Inventory Turnover', nameAr: 'دوران المخزون', value: 6.2, previousValue: 5.8, change: 6.9, changeType: 'increase', unit: 'x', target: 8, status: 'warning' },
  { id: 'kpi-6', name: 'Machine OEE', nameAr: 'كفاءة المعدات', value: 78.5, previousValue: 76.2, change: 3.0, changeType: 'increase', unit: '%', target: 85, status: 'warning' },
];

// Helper function to get data with translations
export const getProductName = (product: Product, lang: string) => lang === 'ar' ? product.nameAr : product.name;
export const getWarehouseName = (warehouse: Warehouse, lang: string) => lang === 'ar' ? warehouse.nameAr : warehouse.name;
export const getMaterialName = (material: Material, lang: string) => lang === 'ar' ? material.nameAr : material.name;
export const getDepartmentName = (dept: Department, lang: string) => lang === 'ar' ? dept.nameAr : dept.name;
export const getEmployeeName = (emp: Employee, lang: string) => lang === 'ar' ? `${emp.firstNameAr} ${emp.lastNameAr}` : `${emp.firstName} ${emp.lastName}`;
export const getSupplierName = (sup: Supplier, lang: string) => lang === 'ar' ? sup.nameAr : sup.name;
export const getCustomerName = (cust: Customer, lang: string) => lang === 'ar' ? cust.nameAr : cust.name;
export const getMachineName = (machine: Machine, lang: string) => lang === 'ar' ? machine.nameAr : machine.name;
export const getLineName = (line: ProductionLine, lang: string) => lang === 'ar' ? line.nameAr : line.name;
export const getCostCenterName = (cc: CostCenter, lang: string) => lang === 'ar' ? cc.nameAr : cc.name;



