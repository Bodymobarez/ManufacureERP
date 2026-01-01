import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ModuleLayout } from '@/components/shared/ModuleLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MegaMenuTabs } from '@/components/shared/MegaMenuTabs';
import {
  CheckCircle, FileCheck, AlertTriangle, BarChart, ClipboardCheck, TrendingUp,
  Users, Star, FileText, Eye, Edit, Plus, Download, Calculator, Award, XCircle,
  Ruler, Palette, FlaskConical, Package, MessageSquare, RotateCcw, Target, GraduationCap, Shield,
  PackageCheck, TestTube, FileSearch, BookOpen, Settings, Activity
} from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { useToast } from '@/hooks/use-toast';
import {
  mockIncomingInspections, mockInLineInspections, mockFinalInspections, mockDefectTypes,
  mockSupplierRatings, mockNonConformances, mockQCReports, aqlStandards,
  mockMeasurementInspections, mockColorMatchings, mockFabricTests, mockPreProductionSamples,
  mockCustomerComplaints, mockReturnRejections, mockQualityKPIs, mockQualityTrainings,
  mockCustomerBrandStandards,
  IncomingInspection, InLineInspection, FinalInspection, DefectType, SupplierQualityRating,
  NonConformance, QCReport, MeasurementInspection, ColorMatching, FabricTest,
  PreProductionSample, CustomerComplaint, ReturnRejection, QualityKPI, QualityTraining,
  CustomerBrandStandard,
  getDefectTypeName, generateId, calculateAQLResult
} from '@/store/qualityData';
import {
  IncomingInspectionForm, InLineInspectionForm, FinalInspectionForm, NonConformanceForm,
  MeasurementInspectionForm, ColorMatchingForm, FabricTestForm, PreProductionSampleForm,
  CustomerComplaintForm, ReturnRejectionForm, CustomerBrandStandardForm, QualityTrainingForm
} from '@/components/quality/QualityForms';

export default function Quality() {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';

  // State
  const [incomingInspections, setIncomingInspections] = useState<IncomingInspection[]>(mockIncomingInspections);
  const [inlineInspections, setInlineInspections] = useState<InLineInspection[]>(mockInLineInspections);
  const [finalInspections, setFinalInspections] = useState<FinalInspection[]>(mockFinalInspections);
  const [defectTypes] = useState<DefectType[]>(mockDefectTypes);
  const [supplierRatings] = useState<SupplierQualityRating[]>(mockSupplierRatings);
  const [nonConformances, setNonConformances] = useState<NonConformance[]>(mockNonConformances);
  const [qcReports] = useState<QCReport[]>(mockQCReports);
  const [measurementInspections] = useState<MeasurementInspection[]>(mockMeasurementInspections);
  const [colorMatchings] = useState<ColorMatching[]>(mockColorMatchings);
  const [fabricTests] = useState<FabricTest[]>(mockFabricTests);
  const [preProductionSamples] = useState<PreProductionSample[]>(mockPreProductionSamples);
  const [customerComplaints] = useState<CustomerComplaint[]>(mockCustomerComplaints);
  const [returnRejections] = useState<ReturnRejection[]>(mockReturnRejections);
  const [qualityKPIs] = useState<QualityKPI[]>(mockQualityKPIs);
  const [qualityTrainings] = useState<QualityTraining[]>(mockQualityTrainings);
  const [customerBrandStandards] = useState<CustomerBrandStandard[]>(mockCustomerBrandStandards);

  // Dialog states
  const [selectedIncoming, setSelectedIncoming] = useState<IncomingInspection | null>(null);
  const [selectedInline, setSelectedInline] = useState<InLineInspection | null>(null);
  const [selectedFinal, setSelectedFinal] = useState<FinalInspection | null>(null);
  const [selectedNC, setSelectedNC] = useState<NonConformance | null>(null);
  const [selectedMeasurement, setSelectedMeasurement] = useState<MeasurementInspection | null>(null);
  const [selectedColorMatching, setSelectedColorMatching] = useState<ColorMatching | null>(null);
  const [selectedFabricTest, setSelectedFabricTest] = useState<FabricTest | null>(null);
  const [selectedSample, setSelectedSample] = useState<PreProductionSample | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<CustomerComplaint | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRejection | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<CustomerBrandStandard | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<QualityTraining | null>(null);

  const [isAddIncomingOpen, setIsAddIncomingOpen] = useState(false);
  const [isAddInlineOpen, setIsAddInlineOpen] = useState(false);
  const [isAddFinalOpen, setIsAddFinalOpen] = useState(false);
  const [isAddNCOpen, setIsAddNCOpen] = useState(false);
  const [isAddMeasurementOpen, setIsAddMeasurementOpen] = useState(false);
  const [isAddColorMatchingOpen, setIsAddColorMatchingOpen] = useState(false);
  const [isAddFabricTestOpen, setIsAddFabricTestOpen] = useState(false);
  const [isAddSampleOpen, setIsAddSampleOpen] = useState(false);
  const [isAddComplaintOpen, setIsAddComplaintOpen] = useState(false);
  const [isAddReturnOpen, setIsAddReturnOpen] = useState(false);
  const [isAddStandardOpen, setIsAddStandardOpen] = useState(false);
  const [isAddTrainingOpen, setIsAddTrainingOpen] = useState(false);

  // Filter states
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Active tab
  const [activeTab, setActiveTab] = useState<string>('incoming');

  // Stats
  const totalInspections = incomingInspections.length + inlineInspections.length + finalInspections.length;
  const passedInspections = [...incomingInspections, ...finalInspections].filter(i => i.status === 'passed').length;
  const passRate = totalInspections > 0 ? Math.round((passedInspections / totalInspections) * 100) : 0;
  const totalDefects = [...incomingInspections, ...inlineInspections, ...finalInspections].reduce((sum, i) => {
    return sum + i.defects.reduce((dSum, d) => dSum + d.quantity, 0);
  }, 0);
  const activeNonConformances = nonConformances.filter(nc => nc.status !== 'closed').length;
  const avgSupplierRating = supplierRatings.length > 0 ? (supplierRatings.reduce((sum, s) => sum + s.rating, 0) / supplierRatings.length).toFixed(1) : '0.0';

  // Mega Menu Tabs Configuration
  const megaMenuTabs = useMemo(() => [
    {
      id: 'incoming',
      label: 'Incoming',
      labelAr: 'الفحص الوارد',
      subtitle: 'Material Inspection',
      subtitleAr: 'فحص المواد',
      icon: <PackageCheck className="w-4 h-4" />,
      onClick: () => setActiveTab('incoming'),
    },
    {
      id: 'inline',
      label: 'In-Line',
      labelAr: 'فحص الخط',
      subtitle: 'Production QC',
      subtitleAr: 'جودة الإنتاج',
      icon: <ClipboardCheck className="w-4 h-4" />,
      onClick: () => setActiveTab('inline'),
    },
    {
      id: 'final',
      label: 'Final',
      labelAr: 'الفحص النهائي',
      subtitle: 'AQL Inspection',
      subtitleAr: 'فحص AQL',
      icon: <FileCheck className="w-4 h-4" />,
      onClick: () => setActiveTab('final'),
    },
    {
      id: 'measurements',
      label: 'Measurements',
      labelAr: 'القياسات',
      subtitle: 'Size & Fit',
      subtitleAr: 'المقاس والملاءمة',
      icon: <Ruler className="w-4 h-4" />,
      onClick: () => setActiveTab('measurements'),
    },
    {
      id: 'colors',
      label: 'Colors',
      labelAr: 'الألوان',
      subtitle: 'Color Matching',
      subtitleAr: 'مطابقة الألوان',
      icon: <Palette className="w-4 h-4" />,
      onClick: () => setActiveTab('colors'),
    },
    {
      id: 'fabric',
      label: 'Fabric Tests',
      labelAr: 'اختبارات القماش',
      subtitle: 'Fabric Quality',
      subtitleAr: 'جودة القماش',
      icon: <TestTube className="w-4 h-4" />,
      onClick: () => setActiveTab('fabric'),
    },
    {
      id: 'samples',
      label: 'Samples',
      labelAr: 'العينات',
      subtitle: 'Pre-Production',
      subtitleAr: 'قبل الإنتاج',
      icon: <Package className="w-4 h-4" />,
      onClick: () => setActiveTab('samples'),
    },
    {
      id: 'defects',
      label: 'Defects',
      labelAr: 'العيوب',
      subtitle: 'Defect Management',
      subtitleAr: 'إدارة العيوب',
      icon: <AlertTriangle className="w-4 h-4" />,
      onClick: () => setActiveTab('defects'),
    },
    {
      id: 'nonconformance',
      label: 'Non-Conformance',
      labelAr: 'عدم المطابقة',
      subtitle: 'NC Management',
      subtitleAr: 'إدارة عدم المطابقة',
      icon: <XCircle className="w-4 h-4" />,
      onClick: () => setActiveTab('nonconformance'),
    },
    {
      id: 'suppliers',
      label: 'Suppliers',
      labelAr: 'الموردين',
      subtitle: 'Supplier Rating',
      subtitleAr: 'تقييم الموردين',
      icon: <Star className="w-4 h-4" />,
      onClick: () => setActiveTab('suppliers'),
    },
    {
      id: 'standards',
      label: 'Standards',
      labelAr: 'المعايير',
      subtitle: 'Brand Standards',
      subtitleAr: 'معايير العلامة',
      icon: <Shield className="w-4 h-4" />,
      onClick: () => setActiveTab('standards'),
    },
    {
      id: 'complaints',
      label: 'Complaints',
      labelAr: 'الشكاوى',
      subtitle: 'Customer Issues',
      subtitleAr: 'مشاكل العملاء',
      icon: <MessageSquare className="w-4 h-4" />,
      onClick: () => setActiveTab('complaints'),
    },
    {
      id: 'returns',
      label: 'Returns',
      labelAr: 'المرتجعات',
      subtitle: 'Return Analysis',
      subtitleAr: 'تحليل المرتجعات',
      icon: <RotateCcw className="w-4 h-4" />,
      onClick: () => setActiveTab('returns'),
    },
    {
      id: 'training',
      label: 'Training',
      labelAr: 'التدريب',
      subtitle: 'Quality Training',
      subtitleAr: 'تدريب الجودة',
      icon: <GraduationCap className="w-4 h-4" />,
      onClick: () => setActiveTab('training'),
    },
    {
      id: 'kpis',
      label: 'KPIs',
      labelAr: 'المؤشرات',
      subtitle: 'Quality Metrics',
      subtitleAr: 'مؤشرات الجودة',
      icon: <Target className="w-4 h-4" />,
      onClick: () => setActiveTab('kpis'),
    },
    {
      id: 'reports',
      label: 'Reports',
      labelAr: 'التقارير',
      subtitle: 'QC Reports',
      subtitleAr: 'تقارير الجودة',
      icon: <BarChart className="w-4 h-4" />,
      onClick: () => setActiveTab('reports'),
    },
  ], []);

  // Handlers
  const handleSaveIncoming = (data: any) => {
    const newInspection: IncomingInspection = {
      ...data,
      id: selectedIncoming?.id || generateId(),
      inspectionNumber: selectedIncoming?.inspectionNumber || `INSP-IN-${new Date().getFullYear()}-${String(incomingInspections.length + 1).padStart(3, '0')}`,
      inspectorId: 'emp-current',
      inspectorName: 'Current User',
      certificates: [],
      testResults: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    if (selectedIncoming) {
      setIncomingInspections(incomingInspections.map(i => i.id === selectedIncoming.id ? newInspection : i));
      toast({ title: isRTL ? 'تم تحديث الفحص' : 'Inspection updated' });
    } else {
      setIncomingInspections([...incomingInspections, newInspection]);
      toast({ title: isRTL ? 'تم إنشاء الفحص' : 'Inspection created' });
    }
    setSelectedIncoming(null);
  };

  const handleSaveInline = (data: any) => {
    const newInspection: InLineInspection = {
      ...data,
      id: selectedInline?.id || generateId(),
      inspectionNumber: selectedInline?.inspectionNumber || `INSP-IL-${new Date().getFullYear()}-${String(inlineInspections.length + 1).padStart(3, '0')}`,
      inspectorId: 'emp-current',
      inspectorName: 'Current User',
      photos: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    if (selectedInline) {
      setInlineInspections(inlineInspections.map(i => i.id === selectedInline.id ? newInspection : i));
    } else {
      setInlineInspections([...inlineInspections, newInspection]);
    }
    setSelectedInline(null);
    toast({ title: isRTL ? 'تم حفظ الفحص' : 'Inspection saved' });
  };

  const handleSaveFinal = (data: any) => {
    const newInspection: FinalInspection = {
      ...data,
      id: selectedFinal?.id || generateId(),
      inspectionNumber: selectedFinal?.inspectionNumber || `INSP-FIN-${new Date().getFullYear()}-${String(finalInspections.length + 1).padStart(3, '0')}`,
      inspectorId: 'emp-current',
      inspectorName: 'Current User',
      certificateNumber: data.certificateIssued ? `QC-CERT-${new Date().getFullYear()}-${String(finalInspections.length + 1).padStart(3, '0')}` : undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };
    if (selectedFinal) {
      setFinalInspections(finalInspections.map(i => i.id === selectedFinal.id ? newInspection : i));
    } else {
      setFinalInspections([...finalInspections, newInspection]);
    }
    setSelectedFinal(null);
    toast({ title: isRTL ? 'تم حفظ الفحص النهائي' : 'Final inspection saved' });
  };

  const handleSaveNC = (data: any) => {
    const newNC: NonConformance = {
      ...data,
      id: selectedNC?.id || generateId(),
      ncNumber: selectedNC?.ncNumber || `NC-${new Date().getFullYear()}-${String(nonConformances.length + 1).padStart(3, '0')}`,
      detectedBy: 'emp-current',
      detectedByName: 'Current User',
      detectedDate: new Date().toISOString().split('T')[0],
      responsibleParty: 'emp-1',
      createdAt: new Date().toISOString().split('T')[0],
    };
    if (selectedNC) {
      setNonConformances(nonConformances.map(nc => nc.id === selectedNC.id ? newNC : nc));
    } else {
      setNonConformances([...nonConformances, newNC]);
    }
    setSelectedNC(null);
    toast({ title: isRTL ? 'تم حفظ عدم المطابقة' : 'Non-conformance saved' });
  };

  const handleSaveMeasurement = (data: any) => {
    toast({ title: isRTL ? 'تم حفظ فحص القياسات' : 'Measurement inspection saved' });
    setSelectedMeasurement(null);
  };

  const handleSaveColorMatching = (data: any) => {
    toast({ title: isRTL ? 'تم حفظ مطابقة اللون' : 'Color matching saved' });
    setSelectedColorMatching(null);
  };

  const handleSaveFabricTest = (data: any) => {
    toast({ title: isRTL ? 'تم حفظ اختبار القماش' : 'Fabric test saved' });
    setSelectedFabricTest(null);
  };

  const handleSaveSample = (data: any) => {
    toast({ title: isRTL ? 'تم حفظ العينة' : 'Sample saved' });
    setSelectedSample(null);
  };

  const handleSaveComplaint = (data: any) => {
    toast({ title: isRTL ? 'تم حفظ الشكوى' : 'Complaint saved' });
    setSelectedComplaint(null);
  };

  const handleSaveReturn = (data: any) => {
    toast({ title: isRTL ? 'تم حفظ الإرجاع' : 'Return saved' });
    setSelectedReturn(null);
  };

  const handleSaveStandard = (data: any) => {
    toast({ title: isRTL ? 'تم حفظ المعيار' : 'Standard saved' });
    setSelectedStandard(null);
  };

  const handleSaveTraining = (data: any) => {
    toast({ title: isRTL ? 'تم حفظ التدريب' : 'Training saved' });
    setSelectedTraining(null);
  };

  // Columns
  const incomingColumns: Column<IncomingInspection>[] = [
    {
      key: 'inspectionNumber',
      header: 'Inspection #',
      headerAr: 'رقم الفحص',
      render: (item) => <span className="font-mono font-medium">{item.inspectionNumber}</span>
    },
    {
      key: 'material',
      header: 'Material',
      headerAr: 'المادة',
      render: (item) => (
        <div>
          <p className="font-medium">{isRTL ? item.materialNameAr : item.materialName}</p>
          <p className="text-xs text-muted-foreground font-mono">{item.materialCode} • {item.batchNumber}</p>
        </div>
      )
    },
    {
      key: 'supplier',
      header: 'Supplier',
      headerAr: 'المورد',
      render: (item) => <span>{item.supplierName}</span>
    },
    {
      key: 'quantity',
      header: 'Qty',
      headerAr: 'الكمية',
      render: (item) => (
        <div className="text-sm">
          <p>{item.acceptedQuantity.toLocaleString()} / {item.receivedQuantity.toLocaleString()} {item.unit}</p>
          <p className="text-xs text-red-600">-{item.rejectedQuantity}</p>
        </div>
      )
    },
    {
      key: 'aql',
      header: 'AQL',
      headerAr: 'AQL',
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{item.aqlLevel}</span>
          {item.aqlResult === 'accepted' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'actions',
      header: 'Actions',
      headerAr: 'الإجراءات',
      render: (item) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setSelectedIncoming(item)}>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  ];

  const inlineColumns: Column<InLineInspection>[] = [
    {
      key: 'inspectionNumber',
      header: 'Inspection #',
      headerAr: 'رقم الفحص',
      render: (item) => <span className="font-mono font-medium">{item.inspectionNumber}</span>
    },
    {
      key: 'workOrder',
      header: 'Work Order',
      headerAr: 'أمر العمل',
      render: (item) => <span className="font-mono">{item.workOrderNumber}</span>
    },
    {
      key: 'stage',
      header: 'Stage',
      headerAr: 'المرحلة',
      render: (item) => <span className="capitalize">{item.stage}</span>
    },
    {
      key: 'line',
      header: 'Line',
      headerAr: 'الخط',
      render: (item) => <span>{item.lineName}</span>
    },
    {
      key: 'type',
      header: 'Type',
      headerAr: 'النوع',
      render: (item) => <Badge variant="outline">{item.inspectionType.replace('_', ' ')}</Badge>
    },
    {
      key: 'quality',
      header: 'Quality',
      headerAr: 'الجودة',
      render: (item) => (
        <div className="text-sm">
          <p className="text-green-600">✓ {item.passedQuantity}</p>
          {item.defectQuantity > 0 && <p className="text-red-600">✗ {item.defectQuantity}</p>}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status} />
    },
  ];

  const finalColumns: Column<FinalInspection>[] = [
    {
      key: 'inspectionNumber',
      header: 'Inspection #',
      headerAr: 'رقم الفحص',
      render: (item) => <span className="font-mono font-medium">{item.inspectionNumber}</span>
    },
    {
      key: 'productionOrder',
      header: 'Production Order',
      headerAr: 'أمر الإنتاج',
      render: (item) => (
        <div>
          <p className="font-medium font-mono">{item.productionOrderNumber}</p>
          <p className="text-xs text-muted-foreground">{item.styleNumber}</p>
        </div>
      )
    },
    {
      key: 'quantity',
      header: 'Lot / Sample',
      headerAr: 'اللوت / العينة',
      render: (item) => (
        <div className="text-sm">
          <p>{item.lotQuantity.toLocaleString()} / {item.sampleSize}</p>
          <p className="text-xs text-green-600">✓ {item.acceptedQuantity}</p>
        </div>
      )
    },
    {
      key: 'defectRate',
      header: 'Defect Rate',
      headerAr: 'معدل العيوب',
      render: (item) => (
        <div>
          <span className={item.defectRate < 2 ? 'text-green-600' : item.defectRate < 4 ? 'text-yellow-600' : 'text-red-600'}>
            {item.defectRate.toFixed(1)}%
          </span>
        </div>
      )
    },
    {
      key: 'aql',
      header: 'AQL Result',
      headerAr: 'نتيجة AQL',
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{item.aqlLevel}</span>
          {item.aqlResult === 'accepted' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
        </div>
      )
    },
    {
      key: 'certificate',
      header: 'Certificate',
      headerAr: 'الشهادة',
      render: (item) => item.certificateIssued ? (
        <Badge className="bg-green-100 text-green-800">{item.certificateNumber}</Badge>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status} />
    },
  ];

  return (
    <ModuleLayout>
      <PageHeader
        icon={CheckCircle}
        title="Quality Control"
        titleAr="ضبط الجودة"
        subtitle="Incoming, in-line, final inspections, AQL standards, QC reports, supplier ratings"
        subtitleAr="الفحص الوارد والفحص أثناء الخط والفحص النهائي ومعايير AQL وتقارير الجودة وتقييم الموردين"
        colorGradient="from-green-500 to-green-600"
        actionLabel="New Inspection"
        actionLabelAr="فحص جديد"
        onAction={() => setIsAddIncomingOpen(true)}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <StatCard title="Total Inspections" titleAr="إجمالي الفحوصات" value={totalInspections} icon={FileCheck} iconColor="text-blue-500" />
        <StatCard title="Pass Rate" titleAr="معدل النجاح" value={`${passRate}%`} icon={TrendingUp} iconColor="text-green-500" />
        <StatCard title="Defects Found" titleAr="العيوب المكتشفة" value={totalDefects} icon={AlertTriangle} iconColor="text-yellow-500" />
        <StatCard title="Non-Conformances" titleAr="عدم المطابقة" value={activeNonConformances} icon={XCircle} iconColor="text-red-500" />
        <StatCard title="Supplier Rating" titleAr="تقييم الموردين" value={`${avgSupplierRating}/5.0`} icon={Star} iconColor="text-purple-500" />
        <StatCard title="Customer Complaints" titleAr="شكاوى العملاء" value={customerComplaints.length} icon={MessageSquare} iconColor="text-orange-500" />
        <StatCard title="Fabric Tests" titleAr="اختبارات القماش" value={fabricTests.length} icon={FlaskConical} iconColor="text-indigo-500" />
        <StatCard title="Defect Types" titleAr="أنواع العيوب" value={defectTypes.length} icon={ClipboardCheck} iconColor="text-cyan-500" />
      </div>

      {/* Quick Actions - Mega Menu */}
      <div className="mb-6">
        <NavigationMenu>
          <NavigationMenuList className="flex-wrap gap-2">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="gap-2">
          <Plus className="w-4 h-4" />
                {isRTL ? 'إضافة جديد' : 'Add New'}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 gap-3 p-4">
                  <Link
                    to="#"
                    onClick={(e) => { e.preventDefault(); setIsAddIncomingOpen(true); }}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <FileCheck className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'فحص وارد' : 'Incoming Inspection'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'فحص المواد الواردة' : 'Inspect incoming materials'}</div>
                    </div>
                  </Link>
                  <Link
                    to="#"
                    onClick={(e) => { e.preventDefault(); setIsAddInlineOpen(true); }}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'فحص أثناء الإنتاج' : 'In-Line Inspection'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'فحص أثناء الإنتاج' : 'Inspect during production'}</div>
                    </div>
                  </Link>
                  <Link
                    to="#"
                    onClick={(e) => { e.preventDefault(); setIsAddFinalOpen(true); }}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <Award className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'فحص نهائي' : 'Final Inspection'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'فحص المنتج النهائي' : 'Final product inspection'}</div>
                    </div>
                  </Link>
                  <Link
                    to="#"
                    onClick={(e) => { e.preventDefault(); setIsAddMeasurementOpen(true); }}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <Ruler className="w-5 h-5 text-indigo-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'فحص القياسات' : 'Measurement Inspection'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'فحص قياسات الملابس' : 'Measure garment dimensions'}</div>
                    </div>
                  </Link>
                  <Link
                    to="#"
                    onClick={(e) => { e.preventDefault(); setIsAddColorMatchingOpen(true); }}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <Palette className="w-5 h-5 text-pink-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'مطابقة الألوان' : 'Color Matching'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'مطابقة درجات الألوان' : 'Match color shades'}</div>
                    </div>
                  </Link>
                  <Link
                    to="#"
                    onClick={(e) => { e.preventDefault(); setIsAddFabricTestOpen(true); }}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <FlaskConical className="w-5 h-5 text-cyan-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'اختبار القماش' : 'Fabric Test'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'اختبارات القماش' : 'Test fabric properties'}</div>
                    </div>
                  </Link>
                  <Link
                    to="#"
                    onClick={(e) => { e.preventDefault(); setIsAddSampleOpen(true); }}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <Package className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'عينة قبل الإنتاج' : 'Pre-Production Sample'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إدارة العينات' : 'Manage samples'}</div>
                    </div>
                  </Link>
                  <Link
                    to="#"
                    onClick={(e) => { e.preventDefault(); setIsAddComplaintOpen(true); }}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'شكوى عميل' : 'Customer Complaint'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'تسجيل شكوى' : 'Record complaint'}</div>
                    </div>
                  </Link>
                  <Link
                    to="#"
                    onClick={(e) => { e.preventDefault(); setIsAddReturnOpen(true); }}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <RotateCcw className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'إرجاع/رفض' : 'Return/Rejection'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'تسجيل إرجاع' : 'Record return'}</div>
                    </div>
                  </Link>
                  <Link
                    to="#"
                    onClick={(e) => { e.preventDefault(); setIsAddStandardOpen(true); }}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <Shield className="w-5 h-5 text-teal-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'معيار عميل' : 'Customer Standard'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إدارة المعايير' : 'Manage standards'}</div>
                    </div>
                  </Link>
                  <Link
                    to="#"
                    onClick={(e) => { e.preventDefault(); setIsAddTrainingOpen(true); }}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <GraduationCap className="w-5 h-5 text-violet-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'تدريب الجودة' : 'Quality Training'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إدارة التدريب' : 'Manage training'}</div>
                    </div>
                  </Link>
                  <Link
                    to="#"
                    onClick={(e) => { e.preventDefault(); setIsAddNCOpen(true); }}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'عدم مطابقة' : 'Non-Conformance'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'تسجيل عدم مطابقة' : 'Record NC'}</div>
                    </div>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mega Menu Tabs */}
      <MegaMenuTabs
        tabs={megaMenuTabs.map(tab => ({
          ...tab,
          isActive: activeTab === tab.id,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isRTL={isRTL}
        className="mb-6"
      />

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">

        {/* ==================== INCOMING INSPECTIONS TAB ==================== */}
        <TabsContent value="incoming">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'فحوصات المواد الواردة' : 'Incoming Material Inspections'}</h3>
              <Button className="gap-2" onClick={() => setIsAddIncomingOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'فحص وارد جديد' : 'New Incoming Inspection'}
              </Button>
            </div>
            <DataTable data={incomingInspections} columns={incomingColumns} searchKey="inspectionNumber" />
          </div>
        </TabsContent>

        {/* ==================== IN-LINE INSPECTIONS TAB ==================== */}
        <TabsContent value="inline">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'فحوصات أثناء الإنتاج' : 'In-Line Inspections'}</h3>
              <Button className="gap-2" onClick={() => setIsAddInlineOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'فحص جديد' : 'New In-Line Inspection'}
              </Button>
            </div>
            <DataTable data={inlineInspections} columns={inlineColumns} searchKey="inspectionNumber" />
          </div>
        </TabsContent>

        {/* ==================== FINAL INSPECTIONS TAB ==================== */}
        <TabsContent value="final">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'الفحوصات النهائية' : 'Final Product Inspections'}</h3>
              <Button className="gap-2" onClick={() => setIsAddFinalOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'فحص نهائي جديد' : 'New Final Inspection'}
              </Button>
            </div>
            <DataTable data={finalInspections} columns={finalColumns} searchKey="inspectionNumber" />
          </div>
        </TabsContent>

        {/* ==================== DEFECT TYPES TAB ==================== */}
        <TabsContent value="defects">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'تصنيف أنواع العيوب' : 'Defect Type Classification'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {defectTypes.map(dt => {
                const severityColors: Record<string, string> = {
                  minor: 'bg-blue-100 text-blue-800',
                  major: 'bg-yellow-100 text-yellow-800',
                  critical: 'bg-red-100 text-red-800',
                };
                return (
                  <div key={dt.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium">{dt.code}</span>
                          <Badge className={severityColors[dt.severity]}>{dt.severity}</Badge>
                        </div>
                        <h4 className="font-medium mt-1">{getDefectTypeName(dt, i18n.language)}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{isRTL ? dt.descriptionAr : dt.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{isRTL ? 'الفئة' : 'Category'}: <span className="capitalize">{dt.category}</span></span>
                      <span className="text-muted-foreground">{isRTL ? 'نقاط' : 'Points'}: {dt.standardPoints}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ==================== NON-CONFORMANCE TAB ==================== */}
        <TabsContent value="nonconformance">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'عدم المطابقة' : 'Non-Conformance Management'}</h3>
              <Button className="gap-2" onClick={() => setIsAddNCOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'تسجيل عدم مطابقة' : 'New Non-Conformance'}
              </Button>
            </div>
            <DataTable
              data={nonConformances}
              columns={[
                {
                  key: 'ncNumber',
                  header: 'NC #',
                  headerAr: 'رقم عدم المطابقة',
                  render: (item) => <span className="font-mono font-medium">{item.ncNumber}</span>
                },
                {
                  key: 'type',
                  header: 'Type',
                  headerAr: 'النوع',
                  render: (item) => <Badge>{item.type}</Badge>
                },
                {
                  key: 'severity',
                  header: 'Severity',
                  headerAr: 'الشدة',
                  render: (item) => <StatusBadge status={item.severity} />
                },
                {
                  key: 'status',
                  header: 'Status',
                  headerAr: 'الحالة',
                  render: (item) => <StatusBadge status={item.status} />
                },
                {
                  key: 'identifiedDate',
                  header: 'Identified',
                  headerAr: 'تاريخ التعريف',
                },
              ]}
              searchKey="ncNumber"
              searchPlaceholder="Search non-conformances..."
              searchPlaceholderAr="بحث في عدم المطابقة..."
            />
          </div>
        </TabsContent>

        {/* ==================== SUPPLIER RATINGS TAB ==================== */}
        <TabsContent value="suppliers">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'تقييم جودة الموردين' : 'Supplier Quality Ratings'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supplierRatings.map(rating => {
                const gradeColors: Record<string, string> = {
                  A: 'bg-green-100 text-green-800',
                  B: 'bg-blue-100 text-blue-800',
                  C: 'bg-yellow-100 text-yellow-800',
                  D: 'bg-orange-100 text-orange-800',
                  F: 'bg-red-100 text-red-800',
                };
                return (
                  <div key={rating.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold">{isRTL ? rating.supplierNameAr : rating.supplierName}</h4>
                        <p className="text-sm text-muted-foreground">{rating.period.startDate} - {rating.period.endDate}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < Math.round(rating.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <Badge className={gradeColors[rating.grade]}>{rating.grade}</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">{isRTL ? 'معدل القبول' : 'Acceptance Rate'}</p>
                        <p className="text-xl font-bold">{rating.acceptanceRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{isRTL ? 'معدل العيوب' : 'Defect Rate'}</p>
                        <p className="text-xl font-bold">{rating.defectRate.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{isRTL ? 'التسليم في الوقت' : 'On-Time Delivery'}</p>
                        <p className="text-xl font-bold">{rating.onTimeDeliveryRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{isRTL ? 'فحوصات' : 'Inspections'}</p>
                        <p className="text-xl font-bold">{rating.totalIncomingInspections}</p>
                      </div>
                    </div>

                    <div className="border-t pt-3 space-y-2">
                      <div>
                        <p className="text-sm font-medium mb-1 text-green-700">{isRTL ? 'نقاط القوة' : 'Strengths'}</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {rating.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1 text-orange-700">{isRTL ? 'مجالات التحسين' : 'Improvements'}</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {rating.improvements.map((i, idx) => <li key={idx}>• {i}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ==================== MEASUREMENT INSPECTION TAB ==================== */}
        <TabsContent value="measurements">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Ruler className="w-5 h-5" />
                {isRTL ? 'فحوصات القياسات' : 'Measurement Inspections'}
              </h3>
              <Button className="gap-2" onClick={() => setIsAddMeasurementOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'فحص قياسات جديد' : 'New Measurement Inspection'}
              </Button>
            </div>
            <div className="space-y-4">
              {measurementInspections.map(msr => (
                <div key={msr.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-medium">{msr.inspectionNumber}</span>
                        <Badge>{msr.styleNumber}</Badge>
                        <Badge variant="outline">Size: {msr.size}</Badge>
                        <StatusBadge status={msr.status} />
                      </div>
                      <h4 className="text-lg font-medium">{msr.styleName}</h4>
                      <p className="text-sm text-muted-foreground">{msr.inspectionDate} • {msr.inspectorName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(msr.measurements).map(([key, value]) => (
                      value !== undefined && (
                        <div key={key} className="bg-muted/30 rounded p-3">
                          <p className="text-xs text-muted-foreground capitalize">{key}</p>
                          <p className="text-lg font-bold">{value} cm</p>
                          {msr.tolerance[key as keyof typeof msr.tolerance] && (
                            <p className="text-xs text-muted-foreground">
                              Tolerance: {msr.tolerance[key as keyof typeof msr.tolerance]?.min} - {msr.tolerance[key as keyof typeof msr.tolerance]?.max} cm
                            </p>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'مفحوص' : 'Inspected'}</p>
                      <p className="text-xl font-bold">{msr.inspectedQuantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600">{isRTL ? 'مقبول' : 'Passed'}</p>
                      <p className="text-xl font-bold text-green-700">{msr.passedQuantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-red-600">{isRTL ? 'مرفوض' : 'Failed'}</p>
                      <p className="text-xl font-bold text-red-700">{msr.failedQuantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== COLOR MATCHING TAB ==================== */}
        <TabsContent value="colors">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Palette className="w-5 h-5" />
                {isRTL ? 'مطابقة الألوان' : 'Color Matching & Shade Approval'}
              </h3>
              <Button className="gap-2" onClick={() => setIsAddColorMatchingOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'مطابقة لون جديدة' : 'New Color Matching'}
              </Button>
            </div>
            <div className="space-y-4">
              {colorMatchings.map(cm => (
                <div key={cm.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-medium">{cm.matchingNumber}</span>
                        <Badge>{cm.materialCode}</Badge>
                        <StatusBadge status={cm.status} />
                      </div>
                      <h4 className="text-lg font-medium">{isRTL ? cm.materialNameAr : cm.materialName}</h4>
                      <p className="text-sm text-muted-foreground">{cm.supplierName} • {cm.batchNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{isRTL ? 'Delta E' : 'Delta E'}</p>
                      <p className={`text-2xl font-bold ${cm.deltaE <= cm.tolerance ? 'text-green-600' : 'text-red-600'}`}>
                        {cm.deltaE.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">Tolerance: {cm.tolerance}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">{isRTL ? 'اللون القياسي' : 'Standard Color'}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-16 rounded border" style={{ backgroundColor: cm.standardColor.hex }}></div>
                        <div className="text-xs">
                          <p>LAB: L{cm.standardColor.lab.L.toFixed(1)} a{cm.standardColor.lab.a.toFixed(1)} b{cm.standardColor.lab.b.toFixed(1)}</p>
                          <p>RGB: ({cm.standardColor.rgb.r}, {cm.standardColor.rgb.g}, {cm.standardColor.rgb.b})</p>
                          {cm.standardColor.pantone && <p>Pantone: {cm.standardColor.pantone}</p>}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">{isRTL ? 'لون العينة' : 'Sample Color'}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-16 rounded border" style={{ backgroundColor: cm.sampleColor.hex }}></div>
                        <div className="text-xs">
                          <p>LAB: L{cm.sampleColor.lab.L.toFixed(1)} a{cm.sampleColor.lab.a.toFixed(1)} b{cm.sampleColor.lab.b.toFixed(1)}</p>
                          <p>RGB: ({cm.sampleColor.rgb.r}, {cm.sampleColor.rgb.g}, {cm.sampleColor.rgb.b})</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== FABRIC TESTING TAB ==================== */}
        <TabsContent value="fabric">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FlaskConical className="w-5 h-5" />
                {isRTL ? 'اختبارات القماش' : 'Fabric Testing'}
              </h3>
              <Button className="gap-2" onClick={() => setIsAddFabricTestOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'اختبار جديد' : 'New Fabric Test'}
              </Button>
            </div>
            <div className="space-y-4">
              {fabricTests.map(ft => (
                <div key={ft.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-medium">{ft.testNumber}</span>
                        <Badge>{ft.testType}</Badge>
                        <StatusBadge status={ft.status} />
                      </div>
                      <h4 className="text-lg font-medium">{isRTL ? ft.testNameAr : ft.testName}</h4>
                      <p className="text-sm text-muted-foreground">{ft.materialCode} • {ft.batchNumber}</p>
                      <p className="text-xs text-muted-foreground">{ft.standard} • {ft.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{isRTL ? 'النتيجة' : 'Result'}</p>
                      <p className={`text-2xl font-bold ${ft.status === 'passed' ? 'text-green-600' : ft.status === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {ft.resultValue} {ft.unit}
                      </p>
                    </div>
                  </div>
                  {ft.certificateNumber && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm">
                        <span className="font-medium">{isRTL ? 'رقم الشهادة' : 'Certificate'}:</span> {ft.certificateNumber}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== PRE-PRODUCTION SAMPLES TAB ==================== */}
        <TabsContent value="samples">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Package className="w-5 h-5" />
                {isRTL ? 'عينات ما قبل الإنتاج' : 'Pre-Production Samples'}
              </h3>
              <Button className="gap-2" onClick={() => setIsAddSampleOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'عينة جديدة' : 'New Sample'}
              </Button>
            </div>
            <div className="space-y-4">
              {preProductionSamples.map(sample => (
                <div key={sample.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-medium">{sample.sampleNumber}</span>
                        <Badge>{sample.sampleType.toUpperCase()}</Badge>
                        <Badge variant="outline">Size: {sample.size}</Badge>
                        <StatusBadge status={sample.status} />
                      </div>
                      <h4 className="text-lg font-medium">{isRTL ? sample.styleNameAr : sample.styleName}</h4>
                      <p className="text-sm text-muted-foreground">{sample.styleNumber} • {sample.submittedDate}</p>
                    </div>
                  </div>
                  {sample.status === 'approved' && sample.approvedDate && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-green-600">
                        ✓ {isRTL ? 'تمت الموافقة' : 'Approved'} {sample.approvedDate} {isRTL ? 'بواسطة' : 'by'} {sample.approvedByName}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== CUSTOMER COMPLAINTS TAB ==================== */}
        <TabsContent value="complaints">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {isRTL ? 'شكاوى العملاء' : 'Customer Complaints'}
              </h3>
              <Button className="gap-2" onClick={() => setIsAddComplaintOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'شكوى جديدة' : 'New Complaint'}
              </Button>
            </div>
            <div className="space-y-4">
              {customerComplaints.map(complaint => {
                const severityColors: Record<string, string> = {
                  minor: 'bg-yellow-100 text-yellow-800',
                  major: 'bg-orange-100 text-orange-800',
                  critical: 'bg-red-100 text-red-800',
                };
                return (
                  <div key={complaint.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-medium">{complaint.complaintNumber}</span>
                          <Badge className={severityColors[complaint.severity]}>{complaint.severity}</Badge>
                          <Badge variant="outline">{complaint.complaintType}</Badge>
                          <StatusBadge status={complaint.status} />
                        </div>
                        <h4 className="text-lg font-medium">{complaint.customerName}</h4>
                        <p className="text-sm text-muted-foreground">{complaint.styleNumber} • {complaint.complaintDate}</p>
                        <p className="text-sm mt-2">{isRTL ? complaint.descriptionAr : complaint.description}</p>
                        <p className="text-sm text-muted-foreground mt-1">{isRTL ? 'الكمية' : 'Quantity'}: {complaint.quantity}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ==================== RETURNS/REJECTIONS TAB ==================== */}
        <TabsContent value="returns">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                {isRTL ? 'المرتجعات والرفض' : 'Returns & Rejections'}
              </h3>
              <Button className="gap-2" onClick={() => setIsAddReturnOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'إرجاع جديد' : 'New Return'}
              </Button>
            </div>
            <div className="space-y-4">
              {returnRejections.map(ret => (
                <div key={ret.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-medium">{ret.returnNumber}</span>
                        <Badge>{ret.returnType}</Badge>
                        <StatusBadge status={ret.status} />
                      </div>
                      <h4 className="text-lg font-medium">{ret.styleName}</h4>
                      <p className="text-sm text-muted-foreground">{ret.styleNumber} • {ret.returnDate}</p>
                      <p className="text-sm mt-2">{isRTL ? ret.reasonAr : ret.reason}</p>
                      <p className="text-sm text-muted-foreground mt-1">{isRTL ? 'الكمية' : 'Quantity'}: {ret.quantity}</p>
                      {ret.analysis && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm">
                            <span className="font-medium">{isRTL ? 'السبب الجذري' : 'Root Cause'}:</span> {ret.analysis.rootCause}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">{isRTL ? 'التكلفة' : 'Cost'}:</span> ${ret.analysis.cost}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== CUSTOMER/BRAND STANDARDS TAB ==================== */}
        <TabsContent value="standards">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {isRTL ? 'معايير العملاء والعلامات التجارية' : 'Customer/Brand Quality Standards'}
              </h3>
              <Button className="gap-2" onClick={() => setIsAddStandardOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'معيار جديد' : 'New Standard'}
              </Button>
            </div>
            <div className="space-y-4">
              {customerBrandStandards.map(std => (
                <div key={std.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge>{std.standardType}</Badge>
                        {std.isActive && <Badge className="bg-green-100 text-green-800">{isRTL ? 'نشط' : 'Active'}</Badge>}
                      </div>
                      <h4 className="text-lg font-medium">{isRTL ? std.standardNameAr : std.standardName}</h4>
                      <p className="text-sm text-muted-foreground">{std.customerName} {std.brandName && `• ${std.brandName}`}</p>
                      <p className="text-sm mt-2">{isRTL ? std.descriptionAr : std.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">{isRTL ? 'المتطلبات' : 'Requirements'}</p>
                    <div className="space-y-1">
                      {std.requirements.map((req, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-medium">{req.key}:</span> {req.value} {req.tolerance && `(±${req.tolerance})`}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== QUALITY TRAINING TAB ==================== */}
        <TabsContent value="training">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                {isRTL ? 'التدريب على الجودة' : 'Quality Training'}
              </h3>
              <Button className="gap-2" onClick={() => setIsAddTrainingOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'تدريب جديد' : 'New Training'}
              </Button>
            </div>
            <div className="space-y-4">
              {qualityTrainings.map(training => (
                <div key={training.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-medium">{training.trainingNumber}</span>
                        <Badge>{training.trainingType}</Badge>
                        <StatusBadge status={training.status} />
                      </div>
                      <h4 className="text-lg font-medium">{isRTL ? training.titleAr : training.title}</h4>
                      <p className="text-sm text-muted-foreground">{training.scheduledDate} • {training.duration} {isRTL ? 'ساعة' : 'hours'}</p>
                      <p className="text-sm mt-2">{isRTL ? training.descriptionAr : training.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">{isRTL ? 'المشاركون' : 'Participants'} ({training.participants.length})</p>
                    <div className="grid grid-cols-2 gap-2">
                      {training.participants.map((p, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-medium">{p.employeeName}</span>
                          {p.score && <span className="text-muted-foreground"> • {p.score}%</span>}
                          {p.certificationIssued && <Badge className="ml-2 bg-green-100 text-green-800 text-xs">{isRTL ? 'شهادة' : 'Certified'}</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== QUALITY KPIs TAB ==================== */}
        <TabsContent value="kpis">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Target className="w-5 h-5" />
                {isRTL ? 'مؤشرات الأداء الرئيسية للجودة' : 'Quality Key Performance Indicators'}
              </h3>
            </div>
            <div className="space-y-4">
              {qualityKPIs.map(kpi => (
                <div key={kpi.id} className="border border-border rounded-lg p-4">
                  <div className="mb-4">
                    <h4 className="text-lg font-medium mb-2">
                      {kpi.period.startDate} - {kpi.period.endDate}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <StatCard title="First Time Pass Rate" titleAr="معدل النجاح من المرة الأولى" value={`${kpi.firstTimePassRate}%`} icon={CheckCircle} iconColor="text-green-500" />
                    <StatCard title="Overall Pass Rate" titleAr="معدل النجاح الإجمالي" value={`${kpi.overallPassRate}%`} icon={TrendingUp} iconColor="text-blue-500" />
                    <StatCard title="Defect Rate" titleAr="معدل العيوب" value={`${kpi.defectRate}%`} icon={AlertTriangle} iconColor="text-yellow-500" />
                    <StatCard title="Customer Satisfaction" titleAr="رضا العملاء" value={`${kpi.customerSatisfactionScore}/5`} icon={Star} iconColor="text-purple-500" />
                    <StatCard title="Return Rate" titleAr="معدل المرتجعات" value={`${kpi.returnRate}%`} icon={RotateCcw} iconColor="text-red-500" />
                    <StatCard title="Supplier Quality" titleAr="جودة الموردين" value={`${kpi.supplierQualityScore}/100`} icon={Award} iconColor="text-indigo-500" />
                    <StatCard title="Internal Audit Score" titleAr="نتيجة التدقيق الداخلي" value={`${kpi.internalAuditScore}/100`} icon={FileCheck} iconColor="text-cyan-500" />
                    <StatCard title="On-Time Delivery" titleAr="التسليم في الوقت" value={`${kpi.onTimeDeliveryRate}%`} icon={CheckCircle} iconColor="text-green-500" />
                    <StatCard title="Cost of Quality" titleAr="تكلفة الجودة" value={`$${kpi.costOfQuality.toLocaleString()}`} icon={Calculator} iconColor="text-orange-500" />
                    <StatCard title="Rework Rate" titleAr="معدل إعادة العمل" value={`${kpi.reworkRate}%`} icon={XCircle} iconColor="text-red-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== REPORTS TAB ==================== */}
        <TabsContent value="reports">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'تقارير الجودة' : 'Quality Control Reports'}</h3>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />{isRTL ? 'تصدير' : 'Export'}
              </Button>
            </div>
            
            <div className="space-y-4">
              {qcReports.map(report => (
                <div key={report.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="font-mono font-medium">{report.reportNumber}</span>
                        <Badge>{report.reportType}</Badge>
                        {report.status === 'published' && <Badge className="bg-green-100 text-green-800">{isRTL ? 'منشور' : 'Published'}</Badge>}
                      </div>
                      <h4 className="text-lg font-medium">{isRTL ? report.titleAr : report.title}</h4>
                      <p className="text-sm text-muted-foreground">{report.period.startDate} - {report.period.endDate}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-muted/30 rounded p-3">
                      <p className="text-xs text-muted-foreground">{isRTL ? 'مفحوص' : 'Inspected'}</p>
                      <p className="text-xl font-bold">{report.summary.totalInspected.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 rounded p-3">
                      <p className="text-xs text-green-600">{isRTL ? 'مقبول' : 'Accepted'}</p>
                      <p className="text-xl font-bold text-green-700">{report.summary.totalAccepted.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-50 rounded p-3">
                      <p className="text-xs text-red-600">{isRTL ? 'مرفوض' : 'Rejected'}</p>
                      <p className="text-xl font-bold text-red-700">{report.summary.totalRejected.toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-50 rounded p-3">
                      <p className="text-xs text-orange-600">{isRTL ? 'معدل العيوب' : 'Defect Rate'}</p>
                      <p className="text-xl font-bold text-orange-700">{report.summary.defectRate.toFixed(2)}%</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">{isRTL ? 'أعلى العيوب' : 'Top Defects'}</p>
                    <div className="space-y-2">
                      {report.summary.defectsByType.slice(0, 5).map((d, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span>{d.defectType}</span>
                          <div className="flex items-center gap-3">
                            <Progress value={d.percentage} className="w-24 h-2" />
                            <span className="w-16 text-end font-medium">{d.quantity} ({d.percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                    {isRTL ? 'تم إنشاؤه بواسطة' : 'Generated by'} {report.generatedByName} • {new Date(report.generatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Non-Conformances Section (can be in a separate tab if needed) */}
      <div className="mt-8 bg-card border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{isRTL ? 'إدارة عدم المطابقة' : 'Non-Conformance Management'}</h3>
          <Button className="gap-2 bg-orange-600 hover:bg-orange-700" onClick={() => setIsAddNCOpen(true)}>
            <Plus className="w-4 h-4" />{isRTL ? 'عدم مطابقة جديد' : 'New NC'}
          </Button>
        </div>
        <div className="space-y-4">
          {nonConformances.map(nc => {
            const severityColors: Record<string, string> = {
              minor: 'bg-yellow-100 text-yellow-800',
              major: 'bg-orange-100 text-orange-800',
              critical: 'bg-red-100 text-red-800',
            };
            return (
              <div key={nc.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-medium">{nc.ncNumber}</span>
                      <Badge className={severityColors[nc.severity]}>{nc.severity}</Badge>
                      <Badge variant="outline">{nc.type}</Badge>
                      <StatusBadge status={nc.status} />
                    </div>
                    <h4 className="text-lg font-medium">{isRTL ? nc.titleAr : nc.title}</h4>
                    <p className="text-sm text-muted-foreground">{nc.department} • {nc.detectedDate}</p>
                  </div>
                </div>
                <p className="text-sm mb-3">{isRTL ? nc.descriptionAr : nc.description}</p>
                {nc.rootCause && (
                  <div className="border-t pt-3 space-y-2">
                    <div>
                      <p className="text-sm font-medium mb-1">{isRTL ? 'السبب الجذري' : 'Root Cause'}</p>
                      <p className="text-sm text-muted-foreground">{nc.rootCause}</p>
                    </div>
                    {nc.correctiveAction && (
                      <div>
                        <p className="text-sm font-medium mb-1">{isRTL ? 'الإجراء التصحيحي' : 'Corrective Action'}</p>
                        <p className="text-sm text-muted-foreground">{nc.correctiveAction}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-3 pt-3 border-t">
                      <span>{isRTL ? 'مسؤول' : 'Responsible'}: {nc.responsiblePartyName}</span>
                      <span>{isRTL ? 'تاريخ الهدف' : 'Target Date'}: {nc.targetDate}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Forms and Dialogs */}
      <IncomingInspectionForm open={isAddIncomingOpen} onOpenChange={setIsAddIncomingOpen} inspection={selectedIncoming} onSave={handleSaveIncoming} />
      <InLineInspectionForm open={isAddInlineOpen} onOpenChange={setIsAddInlineOpen} inspection={selectedInline} onSave={handleSaveInline} />
      <FinalInspectionForm open={isAddFinalOpen} onOpenChange={setIsAddFinalOpen} inspection={selectedFinal} onSave={handleSaveFinal} />
      <NonConformanceForm open={isAddNCOpen} onOpenChange={setIsAddNCOpen} nc={selectedNC} onSave={handleSaveNC} />
      <MeasurementInspectionForm open={isAddMeasurementOpen} onOpenChange={setIsAddMeasurementOpen} inspection={selectedMeasurement} onSave={handleSaveMeasurement} />
      <ColorMatchingForm open={isAddColorMatchingOpen} onOpenChange={setIsAddColorMatchingOpen} matching={selectedColorMatching} onSave={handleSaveColorMatching} />
      <FabricTestForm open={isAddFabricTestOpen} onOpenChange={setIsAddFabricTestOpen} test={selectedFabricTest} onSave={handleSaveFabricTest} />
      <PreProductionSampleForm open={isAddSampleOpen} onOpenChange={setIsAddSampleOpen} sample={selectedSample} onSave={handleSaveSample} />
      <CustomerComplaintForm open={isAddComplaintOpen} onOpenChange={setIsAddComplaintOpen} complaint={selectedComplaint} onSave={handleSaveComplaint} />
      <ReturnRejectionForm open={isAddReturnOpen} onOpenChange={setIsAddReturnOpen} returnItem={selectedReturn} onSave={handleSaveReturn} />
      <CustomerBrandStandardForm open={isAddStandardOpen} onOpenChange={setIsAddStandardOpen} standard={selectedStandard} onSave={handleSaveStandard} />
      <QualityTrainingForm open={isAddTrainingOpen} onOpenChange={setIsAddTrainingOpen} training={selectedTraining} onSave={handleSaveTraining} />
    </ModuleLayout>
  );
}
