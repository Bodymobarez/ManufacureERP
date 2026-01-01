import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ModuleLayout } from '@/components/shared/ModuleLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MegaMenuTabs } from '@/components/shared/MegaMenuTabs';
import { 
  Layers, Palette, FileText, Box, Ruler, Upload, History, 
  CheckCircle, Eye, Plus, Edit, Trash2, ChevronRight, Package,
  FileCheck, BarChart3, Settings
} from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  mockStyles, mockTechPacks, mockBOMs, mockSizeCharts, mockColorVariants,
  mockDocuments, mockVersionHistory, mockApprovalWorkflows,
  getStyleName, getColorsByStyle, getDocumentsByStyle, getBOMByStyle,
  getTechPackByStyle, getSizeChartByStyle, getVersionHistory, getApprovalWorkflow,
  Style, TechPack, BOM, ColorVariant, Document as PLMDocument, ApprovalWorkflow
} from '@/store/plmData';
import { StyleForm, ColorVariantForm, DocumentForm, TechPackForm, BOMForm, SizeChartForm, ApprovalDialog } from '@/components/plm/PLMForms';
import { ViewDialog } from '@/components/plm/ViewDialog';

export default function PLM() {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';
  
  // State Management
  const [styles, setStyles] = useState<Style[]>(mockStyles);
  const [techPacks, setTechPacks] = useState<TechPack[]>(mockTechPacks);
  const [boms, setBoms] = useState<BOM[]>(mockBOMs);
  const [sizeCharts, setSizeCharts] = useState(mockSizeCharts);
  const [colorVariants, setColorVariants] = useState(mockColorVariants);
  const [documents, setDocuments] = useState(mockDocuments);
  
  // Dialog states
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [selectedTechPack, setSelectedTechPack] = useState<TechPack | null>(null);
  const [selectedBOM, setSelectedBOM] = useState<BOM | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<PLMDocument | null>(null);
  
  const [isAddStyleOpen, setIsAddStyleOpen] = useState(false);
  const [isEditStyleOpen, setIsEditStyleOpen] = useState(false);
  const [isViewStyleOpen, setIsViewStyleOpen] = useState(false);
  const [isAddColorOpen, setIsAddColorOpen] = useState(false);
  const [isEditColorOpen, setIsEditColorOpen] = useState(false);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isEditDocumentOpen, setIsEditDocumentOpen] = useState(false);
  const [isAddTechPackOpen, setIsAddTechPackOpen] = useState(false);
  const [isEditTechPackOpen, setIsEditTechPackOpen] = useState(false);
  const [isAddBOMOpen, setIsAddBOMOpen] = useState(false);
  const [isEditBOMOpen, setIsEditBOMOpen] = useState(false);
  const [isAddSizeChartOpen, setIsAddSizeChartOpen] = useState(false);
  const [isEditSizeChartOpen, setIsEditSizeChartOpen] = useState(false);
  const [selectedSizeChart, setSelectedSizeChart] = useState<typeof sizeCharts[0] | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null);
  
  // Approval workflow state
  const [approvalWorkflows, setApprovalWorkflows] = useState(mockApprovalWorkflows);
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    action: 'approve' | 'reject' | 'comment';
    workflowId: string;
    entityName: string;
    stageName: string;
  } | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState<string>('styles');

  // Stats
  const totalStyles = styles.length;
  const inProduction = styles.filter(s => s.status === 'production').length;
  const inDevelopment = styles.filter(s => ['concept', 'development', 'sampling'].includes(s.status)).length;
  const pendingApprovals = approvalWorkflows.filter(a => a.status === 'in_progress').length;

  // Mega Menu Tabs Configuration
  const megaMenuTabs = useMemo(() => [
    {
      id: 'styles',
      label: 'Styles',
      labelAr: 'الستايلات',
      subtitle: 'Style Management',
      subtitleAr: 'إدارة الستايلات',
      icon: <Layers className="w-4 h-4" />,
      onClick: () => setActiveTab('styles'),
    },
    {
      id: 'techpacks',
      label: 'Tech Packs',
      labelAr: 'الملفات الفنية',
      subtitle: 'Technical Packs',
      subtitleAr: 'الملفات الفنية',
      icon: <FileText className="w-4 h-4" />,
      onClick: () => setActiveTab('techpacks'),
    },
    {
      id: 'boms',
      label: 'BOMs',
      labelAr: 'قوائم المواد',
      subtitle: 'Bill of Materials',
      subtitleAr: 'قوائم المواد',
      icon: <Box className="w-4 h-4" />,
      onClick: () => setActiveTab('boms'),
    },
    {
      id: 'sizecharts',
      label: 'Size Charts',
      labelAr: 'جداول المقاسات',
      subtitle: 'Size & Grading',
      subtitleAr: 'المقاسات والتدريج',
      icon: <Ruler className="w-4 h-4" />,
      onClick: () => setActiveTab('sizecharts'),
    },
    {
      id: 'colors',
      label: 'Colors',
      labelAr: 'الألوان',
      subtitle: 'Color Variants',
      subtitleAr: 'متغيرات الألوان',
      icon: <Palette className="w-4 h-4" />,
      onClick: () => setActiveTab('colors'),
    },
    {
      id: 'documents',
      label: 'Documents',
      labelAr: 'المستندات',
      subtitle: 'Document Library',
      subtitleAr: 'مكتبة المستندات',
      icon: <FileCheck className="w-4 h-4" />,
      onClick: () => setActiveTab('documents'),
    },
    {
      id: 'approvals',
      label: 'Approvals',
      labelAr: 'الموافقات',
      subtitle: 'Approval Workflow',
      subtitleAr: 'سير عمل الموافقة',
      icon: <CheckCircle className="w-4 h-4" />,
      onClick: () => setActiveTab('approvals'),
    },
    {
      id: 'versions',
      label: 'Versions',
      labelAr: 'الإصدارات',
      subtitle: 'Version Control',
      subtitleAr: 'التحكم بالإصدارات',
      icon: <History className="w-4 h-4" />,
      onClick: () => setActiveTab('versions'),
    },
    {
      id: 'reports',
      label: 'Reports',
      labelAr: 'التقارير',
      subtitle: 'PLM Reports',
      subtitleAr: 'تقارير PLM',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => setActiveTab('reports'),
    },
  ], []);

  // Handler Functions
  const handleSaveStyle = (data: any) => {
    const newStyle: Style = {
      ...data,
      id: selectedStyle?.id || `style-${Date.now()}`,
      designerId: 'emp-1',
      designerName: 'Current User',
      createdAt: selectedStyle?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      currentVersion: selectedStyle?.currentVersion || 1,
    };
    
    if (selectedStyle) {
      setStyles(styles.map(s => s.id === selectedStyle.id ? newStyle : s));
      toast({ title: isRTL ? 'تم تحديث الستايل' : 'Style updated successfully' });
    } else {
      setStyles([...styles, newStyle]);
      toast({ title: isRTL ? 'تم إنشاء الستايل' : 'Style created successfully' });
    }
    setSelectedStyle(null);
    setIsAddStyleOpen(false);
    setIsEditStyleOpen(false);
  };

  const handleEditStyle = (style: Style) => {
    setSelectedStyle(style);
    setIsEditStyleOpen(true);
  };

  const handleViewStyle = (style: Style) => {
    setSelectedStyle(style);
    setIsViewStyleOpen(true);
  };

  const handleDeleteStyle = (style: Style) => {
    setStyles(styles.filter(s => s.id !== style.id));
    toast({ title: isRTL ? 'تم حذف الستايل' : 'Style deleted successfully' });
    setDeleteConfirm(null);
  };

  const handleSaveColor = (data: any) => {
    const newColor: ColorVariant = {
      ...data,
      id: selectedColor?.id || `cv-${Date.now()}`,
      sortOrder: selectedColor?.sortOrder || colorVariants.filter(c => c.styleId === data.styleId).length + 1,
    };
    
    if (selectedColor) {
      setColorVariants(colorVariants.map(c => c.id === selectedColor.id ? newColor : c));
      toast({ title: isRTL ? 'تم تحديث اللون' : 'Color variant updated successfully' });
    } else {
      setColorVariants([...colorVariants, newColor]);
      toast({ title: isRTL ? 'تم إضافة اللون' : 'Color variant added successfully' });
    }
    setSelectedColor(null);
    setIsAddColorOpen(false);
    setIsEditColorOpen(false);
  };

  const handleEditColor = (color: ColorVariant) => {
    setSelectedColor(color);
    setIsEditColorOpen(true);
  };

  const handleDeleteColor = (color: ColorVariant) => {
    setColorVariants(colorVariants.filter(c => c.id !== color.id));
    toast({ title: isRTL ? 'تم حذف اللون' : 'Color variant deleted successfully' });
    setDeleteConfirm(null);
  };

  const handleSaveDocument = (data: any) => {
    const newDoc: PLMDocument = {
      ...data,
      id: selectedDocument?.id || `doc-${Date.now()}`,
      fileUrl: selectedDocument?.fileUrl || '/docs/uploaded.pdf',
      fileSize: data.file?.size || selectedDocument?.fileSize || 0,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString().split('T')[0],
      version: selectedDocument?.version || 1,
    };
    
    if (selectedDocument) {
      setDocuments(documents.map(d => d.id === selectedDocument.id ? newDoc : d));
      toast({ title: isRTL ? 'تم تحديث المستند' : 'Document updated successfully' });
    } else {
      setDocuments([...documents, newDoc]);
      toast({ title: isRTL ? 'تم رفع المستند' : 'Document uploaded successfully' });
    }
    setSelectedDocument(null);
    setIsAddDocumentOpen(false);
    setIsEditDocumentOpen(false);
  };

  const handleEditDocument = (doc: PLMDocument) => {
    setSelectedDocument(doc);
    setIsEditDocumentOpen(true);
  };

  const handleDeleteDocument = (doc: PLMDocument) => {
    setDocuments(documents.filter(d => d.id !== doc.id));
    toast({ title: isRTL ? 'تم حذف المستند' : 'Document deleted successfully' });
    setDeleteConfirm(null);
  };

  // Tech Pack handlers
  const handleSaveTechPack = (data: any) => {
    const newTechPack: TechPack = {
      ...data,
      id: selectedTechPack?.id || `tp-${Date.now()}`,
      techPackNumber: selectedTechPack?.techPackNumber || `TP-${new Date().getFullYear()}-${String(techPacks.length + 1).padStart(3, '0')}`,
      version: selectedTechPack?.version || 1,
      status: 'draft',
      createdBy: 'Current User',
      createdAt: selectedTechPack?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    if (selectedTechPack) {
      setTechPacks(techPacks.map(tp => tp.id === selectedTechPack.id ? newTechPack : tp));
      toast({ title: isRTL ? 'تم تحديث الملف الفني' : 'Tech Pack updated successfully' });
    } else {
      setTechPacks([...techPacks, newTechPack]);
      toast({ title: isRTL ? 'تم إنشاء الملف الفني' : 'Tech Pack created successfully' });
    }
    setSelectedTechPack(null);
    setIsAddTechPackOpen(false);
    setIsEditTechPackOpen(false);
  };

  // BOM handlers
  const handleSaveBOM = (data: any) => {
    const newBOM: BOM = {
      ...data,
      id: selectedBOM?.id || `bom-${Date.now()}`,
      bomNumber: selectedBOM?.bomNumber || `BOM-${new Date().getFullYear()}-${String(boms.length + 1).padStart(3, '0')}`,
      version: selectedBOM?.version || 1,
      status: 'draft',
      createdBy: 'Current User',
      createdAt: selectedBOM?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    if (selectedBOM) {
      setBoms(boms.map(b => b.id === selectedBOM.id ? newBOM : b));
      toast({ title: isRTL ? 'تم تحديث قائمة المواد' : 'BOM updated successfully' });
    } else {
      setBoms([...boms, newBOM]);
      toast({ title: isRTL ? 'تم إنشاء قائمة المواد' : 'BOM created successfully' });
    }
    setSelectedBOM(null);
    setIsAddBOMOpen(false);
    setIsEditBOMOpen(false);
  };

  // Size Chart handlers
  const handleSaveSizeChart = (data: any) => {
    const newSizeChart = {
      ...data,
      id: selectedSizeChart?.id || `sc-${Date.now()}`,
      status: 'draft' as const,
      createdAt: selectedSizeChart?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    if (selectedSizeChart) {
      setSizeCharts(sizeCharts.map(sc => sc.id === selectedSizeChart.id ? newSizeChart : sc));
      toast({ title: isRTL ? 'تم تحديث جدول المقاسات' : 'Size Chart updated successfully' });
    } else {
      setSizeCharts([...sizeCharts, newSizeChart]);
      toast({ title: isRTL ? 'تم إنشاء جدول المقاسات' : 'Size Chart created successfully' });
    }
    setSelectedSizeChart(null);
    setIsAddSizeChartOpen(false);
    setIsEditSizeChartOpen(false);
  };

  // Approval handlers
  const handleApprovalAction = (comment: string) => {
    if (!approvalDialog) return;
    
    const workflow = approvalWorkflows.find(w => w.id === approvalDialog.workflowId);
    if (!workflow) return;

    const updatedWorkflows = approvalWorkflows.map(w => {
      if (w.id !== approvalDialog.workflowId) return w;
      
      const updatedStages = w.stages.map(stage => {
        if (stage.stageOrder !== w.currentStage) return stage;
        
        if (approvalDialog.action === 'approve') {
          return { ...stage, status: 'approved' as const, comments: comment, actionDate: new Date().toISOString().split('T')[0], approverName: 'Current User' };
        } else if (approvalDialog.action === 'reject') {
          return { ...stage, status: 'rejected' as const, comments: comment, actionDate: new Date().toISOString().split('T')[0], approverName: 'Current User' };
        } else {
          return { ...stage, comments: (stage.comments ? stage.comments + '\n' : '') + comment };
        }
      });

      const allApproved = updatedStages.every(s => s.status === 'approved');
      const hasRejection = updatedStages.some(s => s.status === 'rejected');
      const nextStage = approvalDialog.action === 'approve' ? w.currentStage + 1 : w.currentStage;

      return {
        ...w,
        stages: updatedStages,
        currentStage: nextStage,
        status: hasRejection ? 'rejected' as const : allApproved ? 'approved' as const : 'in_progress' as const,
        completedAt: allApproved ? new Date().toISOString().split('T')[0] : undefined,
      };
    });

    setApprovalWorkflows(updatedWorkflows);
    
    const actionLabels = {
      approve: isRTL ? 'تمت الموافقة' : 'Approved successfully',
      reject: isRTL ? 'تم الرفض' : 'Rejected',
      comment: isRTL ? 'تم إضافة التعليق' : 'Comment added',
    };
    toast({ title: actionLabels[approvalDialog.action] });
    setApprovalDialog(null);
  };

  const openApprovalDialog = (workflowId: string, action: 'approve' | 'reject' | 'comment') => {
    const workflow = approvalWorkflows.find(w => w.id === workflowId);
    if (!workflow) return;
    
    const currentStage = workflow.stages.find(s => s.stageOrder === workflow.currentStage);
    setApprovalDialog({
      open: true,
      action,
      workflowId,
      entityName: workflow.entityName,
      stageName: currentStage ? (isRTL ? currentStage.stageNameAr : currentStage.stageName) : '',
    });
  };

  // Style columns
  const styleColumns: Column<Style>[] = [
    {
      key: 'styleNumber',
      header: 'Style #',
      headerAr: 'رقم الستايل',
      render: (item) => <span className="font-mono font-medium">{item.styleNumber}</span>
    },
    {
      key: 'name',
      header: 'Style Name',
      headerAr: 'اسم الستايل',
      render: (item) => (
        <div>
          <p className="font-medium">{getStyleName(item, i18n.language)}</p>
          <p className="text-sm text-muted-foreground">{item.category} / {item.subcategory}</p>
        </div>
      )
    },
    {
      key: 'season',
      header: 'Season',
      headerAr: 'الموسم',
      render: (item) => (
        <div>
          <p>{item.season}</p>
          <p className="text-xs text-muted-foreground">{item.collection}</p>
        </div>
      )
    },
    {
      key: 'targetCustomer',
      header: 'Target',
      headerAr: 'الفئة المستهدفة',
      render: (item) => <span className="capitalize">{item.targetCustomer}</span>
    },
    {
      key: 'cost',
      header: 'Cost/Price',
      headerAr: 'التكلفة/السعر',
      render: (item) => (
        <div className="text-sm">
          <p>${item.targetCost.toFixed(2)} / ${item.targetPrice.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">
            {isRTL ? 'هامش' : 'Margin'}: {Math.round((1 - item.targetCost / item.targetPrice) * 100)}%
          </p>
        </div>
      )
    },
    {
      key: 'version',
      header: 'Version',
      headerAr: 'الإصدار',
      render: (item) => <span className="text-sm">v{item.currentVersion}</span>
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
          <Button variant="ghost" size="sm" onClick={() => handleViewStyle(item)} title={isRTL ? 'عرض' : 'View'}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEditStyle(item)} title={isRTL ? 'تعديل' : 'Edit'}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm({ type: 'style', id: item.id, name: getStyleName(item, i18n.language) })} title={isRTL ? 'حذف' : 'Delete'}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      )
    },
  ];

  return (
    <ModuleLayout>
      <PageHeader
        icon={Layers}
        title="Product Lifecycle Management"
        titleAr="إدارة دورة حياة المنتج"
        subtitle="Styles, Tech Packs, BOMs, Size Charts, Colors, Documents & Approvals"
        subtitleAr="الستايلات والملفات الفنية وقوائم المواد والمقاسات والألوان والمستندات والموافقات"
        colorGradient="from-blue-500 to-blue-600"
        actionLabel="New Style"
        actionLabelAr="ستايل جديد"
        onAction={() => setIsAddStyleOpen(true)}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Styles"
          titleAr="إجمالي الستايلات"
          value={totalStyles}
          icon={Layers}
          iconColor="text-blue-500"
        />
        <StatCard
          title="In Production"
          titleAr="قيد الإنتاج"
          value={inProduction}
          change={15}
          changeType="increase"
          icon={Box}
          iconColor="text-green-500"
        />
        <StatCard
          title="In Development"
          titleAr="قيد التطوير"
          value={inDevelopment}
          icon={Palette}
          iconColor="text-purple-500"
        />
        <StatCard
          title="Pending Approvals"
          titleAr="بانتظار الموافقة"
          value={pendingApprovals}
          icon={CheckCircle}
          iconColor="text-orange-500"
        />
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

        {/* ==================== STYLES TAB ==================== */}
        <TabsContent value="styles">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'إدارة الستايلات والتصاميم' : 'Style & Design Management'}</h3>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
                    <SelectItem value="concept">{isRTL ? 'مفهوم' : 'Concept'}</SelectItem>
                    <SelectItem value="development">{isRTL ? 'تطوير' : 'Development'}</SelectItem>
                    <SelectItem value="sampling">{isRTL ? 'عينات' : 'Sampling'}</SelectItem>
                    <SelectItem value="approved">{isRTL ? 'معتمد' : 'Approved'}</SelectItem>
                    <SelectItem value="production">{isRTL ? 'إنتاج' : 'Production'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DataTable
              data={styles}
              columns={styleColumns}
              searchKey="name"
              searchPlaceholder="Search styles..."
              searchPlaceholderAr="بحث في الستايلات..."
            />
          </div>
        </TabsContent>

        {/* ==================== TECH PACKS TAB ==================== */}
        <TabsContent value="techpacks">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'إدارة الملفات الفنية' : 'Tech Pack Management'}</h3>
              <Button className="gap-2" onClick={() => { setSelectedStyle(styles[0] || null); setIsAddTechPackOpen(true); }}>
                <Plus className="w-4 h-4" />
                {isRTL ? 'ملف فني جديد' : 'New Tech Pack'}
              </Button>
            </div>
            <div className="space-y-4">
              {techPacks.map(tp => {
                const style = styles.find(s => s.id === tp.styleId);
                return (
                  <div key={tp.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-medium">{tp.techPackNumber}</span>
                          <StatusBadge status={tp.status} />
                        </div>
                        <p className="text-muted-foreground">
                          {style ? getStyleName(style, i18n.language) : tp.styleId}
                        </p>
                      </div>
                      <div className="text-end text-sm">
                        <p className="text-muted-foreground">{isRTL ? 'تم الإنشاء' : 'Created'}: {tp.createdAt}</p>
                        {tp.approvedAt && (
                          <p className="text-green-600">{isRTL ? 'تمت الموافقة' : 'Approved'}: {tp.approvedAt}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Specifications Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {['Fabric', 'Thread', 'Buttons', 'Label'].map(cat => {
                        const specs = tp.specifications.filter(s => s.category === cat);
                        return (
                          <div key={cat} className="bg-muted/30 rounded p-3">
                            <p className="text-xs text-muted-foreground mb-1">{cat}</p>
                            <p className="text-sm font-medium">{specs.length} {isRTL ? 'مواصفة' : 'specs'}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Construction Notes */}
                    <div className="bg-muted/20 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium mb-1">{isRTL ? 'ملاحظات البناء' : 'Construction Notes'}</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {isRTL ? tp.constructionDetailsAr : tp.constructionDetails}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => { setSelectedTechPack(tp); setIsViewStyleOpen(true); }}>
                        <Eye className="w-4 h-4" />
                        {isRTL ? 'عرض الكل' : 'View All'}
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => { if (style) setSelectedStyle(style); setSelectedTechPack(tp); setIsEditTechPackOpen(true); }}>
                        <Edit className="w-4 h-4" />
                        {isRTL ? 'تعديل' : 'Edit'}
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => toast({ title: isRTL ? 'جاري تصدير PDF...' : 'Exporting PDF...' })}>
                        <Upload className="w-4 h-4" />
                        {isRTL ? 'تصدير PDF' : 'Export PDF'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ==================== BOM TAB ==================== */}
        <TabsContent value="boms">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'قوائم المواد (BOM)' : 'Bill of Materials (BOM)'}</h3>
              <Button className="gap-2" onClick={() => { setSelectedStyle(styles[0] || null); setIsAddBOMOpen(true); }}>
                <Plus className="w-4 h-4" />
                {isRTL ? 'قائمة جديدة' : 'New BOM'}
              </Button>
            </div>
            {boms.map(bom => {
              const style = styles.find(s => s.id === bom.styleId);
              return (
                <div key={bom.id} className="border border-border rounded-lg overflow-hidden mb-4">
                  <div className="bg-muted/30 p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{bom.bomNumber}</span>
                        <StatusBadge status={bom.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {style ? getStyleName(style, i18n.language) : bom.styleId}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="text-2xl font-bold text-primary">${bom.totalCost.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'إجمالي التكلفة' : 'Total Cost'}</p>
                    </div>
                  </div>
                  
                  {/* BOM Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/20">
                        <tr>
                          <th className="text-start p-3">{isRTL ? 'المادة' : 'Material'}</th>
                          <th className="text-start p-3">{isRTL ? 'الفئة' : 'Category'}</th>
                          <th className="text-start p-3">{isRTL ? 'الموضع' : 'Placement'}</th>
                          <th className="text-center p-3">{isRTL ? 'الاستهلاك' : 'Consumption'}</th>
                          <th className="text-center p-3">{isRTL ? 'الهدر %' : 'Waste %'}</th>
                          <th className="text-end p-3">{isRTL ? 'تكلفة الوحدة' : 'Unit Cost'}</th>
                          <th className="text-end p-3">{isRTL ? 'الإجمالي' : 'Total'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bom.items.map(item => (
                          <tr key={item.id} className="border-t">
                            <td className="p-3">
                              <p className="font-medium">{isRTL ? item.materialNameAr : item.materialName}</p>
                              <p className="text-xs text-muted-foreground font-mono">{item.materialCode}</p>
                            </td>
                            <td className="p-3 capitalize">{item.category}</td>
                            <td className="p-3">{isRTL ? item.placementAr : item.placement}</td>
                            <td className="text-center p-3">{item.consumption} {item.consumptionUnit}</td>
                            <td className="text-center p-3">{item.wastagePercent}%</td>
                            <td className="text-end p-3">${item.unitCost.toFixed(2)}</td>
                            <td className="text-end p-3 font-medium">${item.totalCost.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-muted/20 font-medium">
                        <tr className="border-t">
                          <td colSpan={6} className="p-3 text-end">{isRTL ? 'تكلفة المواد' : 'Material Cost'}</td>
                          <td className="text-end p-3">${bom.totalMaterialCost.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan={6} className="p-3 text-end">{isRTL ? 'تكلفة العمالة' : 'Labor Cost'}</td>
                          <td className="text-end p-3">${bom.totalLaborCost.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan={6} className="p-3 text-end">{isRTL ? 'تكلفة غير مباشرة' : 'Overhead'}</td>
                          <td className="text-end p-3">${bom.totalOverheadCost.toFixed(2)}</td>
                        </tr>
                        <tr className="text-lg">
                          <td colSpan={6} className="p-3 text-end">{isRTL ? 'الإجمالي' : 'Total'}</td>
                          <td className="text-end p-3 text-primary">${bom.totalCost.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ==================== SIZE CHARTS TAB ==================== */}
        <TabsContent value="sizecharts">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'جداول المقاسات والتدريج' : 'Size Charts & Grading Rules'}</h3>
              <Button className="gap-2" onClick={() => { setSelectedStyle(styles[0] || null); setIsAddSizeChartOpen(true); }}>
                <Plus className="w-4 h-4" />
                {isRTL ? 'جدول جديد' : 'New Size Chart'}
              </Button>
            </div>
            {sizeCharts.map(sc => {
              const style = styles.find(s => s.id === sc.styleId);
              return (
                <div key={sc.id} className="border border-border rounded-lg overflow-hidden mb-4">
                  <div className="bg-muted/30 p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{isRTL ? sc.nameAr : sc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {style ? getStyleName(style, i18n.language) : ''} • {isRTL ? 'المقاس الأساسي' : 'Base Size'}: {sc.baseSize}
                      </p>
                    </div>
                    <StatusBadge status={sc.status} />
                  </div>
                  
                  {/* Measurements Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/20">
                        <tr>
                          <th className="text-start p-3">{isRTL ? 'نقطة القياس' : 'Point of Measure'}</th>
                          <th className="text-center p-3">{isRTL ? 'الكود' : 'Code'}</th>
                          <th className="text-center p-3">{isRTL ? 'التسامح' : 'Tol.'}</th>
                          {sc.sizeRange.map(size => (
                            <th key={size} className={`text-center p-3 ${size === sc.baseSize ? 'bg-primary/10' : ''}`}>
                              {size}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sc.measurements.map(m => (
                          <tr key={m.id} className="border-t">
                            <td className="p-3 font-medium">{isRTL ? m.pointOfMeasureAr : m.pointOfMeasure}</td>
                            <td className="text-center p-3 font-mono">{m.code}</td>
                            <td className="text-center p-3">±{m.tolerance}</td>
                            {sc.sizeRange.map(size => (
                              <td key={size} className={`text-center p-3 ${size === sc.baseSize ? 'bg-primary/10 font-medium' : ''}`}>
                                {m.values[size]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Grading Rules */}
                  <div className="p-4 border-t">
                    <p className="font-medium mb-2">{isRTL ? 'قواعد التدريج' : 'Grading Rules'}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {sc.gradingRules.map(rule => (
                        <div key={rule.id} className="bg-muted/30 rounded p-2 text-sm">
                          <p className="font-medium">{rule.measurementName}</p>
                          <p className="text-muted-foreground">
                            {rule.direction === 'both' ? '±' : rule.direction === 'up' ? '+' : '-'}
                            {rule.gradeIncrement}cm / {isRTL ? 'مقاس' : 'size'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ==================== COLORS TAB ==================== */}
        <TabsContent value="colors">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'إدارة الألوان' : 'Color Variant Management'}</h3>
              <Button className="gap-2" onClick={() => { setSelectedStyle(styles[0] || null); setIsAddColorOpen(true); }}>
                <Plus className="w-4 h-4" />
                {isRTL ? 'لون جديد' : 'New Color'}
              </Button>
            </div>
            
            {/* Group colors by style */}
            {styles.slice(0, 5).map(style => {
              const colors = colorVariants.filter(c => c.styleId === style.id);
              if (colors.length === 0) return null;
              return (
                <div key={style.id} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-medium">{getStyleName(style, i18n.language)}</h4>
                    <span className="text-sm text-muted-foreground">({style.styleNumber})</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {colors.map(color => (
                      <div key={color.id} className="border border-border rounded-lg overflow-hidden group">
                        <div 
                          className="h-20 relative"
                          style={{ backgroundColor: color.hexCode }}
                        >
                          {color.status === 'pending' && (
                            <div className="absolute top-2 end-2">
                              <StatusBadge status="pending" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/90" onClick={() => handleEditColor(color)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/90" onClick={() => setDeleteConfirm({ type: 'color', id: color.id, name: isRTL ? color.colorNameAr : color.colorName })}>
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="font-medium">{isRTL ? color.colorNameAr : color.colorName}</p>
                          <p className="text-xs font-mono text-muted-foreground">{color.colorCode}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{color.hexCode}</span>
                            {color.pantoneCode && <span>• {color.pantoneCode}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Add Color Card */}
                    <div 
                      className="border border-dashed border-border rounded-lg flex items-center justify-center h-[140px] cursor-pointer hover:bg-muted/20 transition-colors"
                      onClick={() => { setSelectedStyle(style); setIsAddColorOpen(true); }}
                    >
                      <div className="text-center text-muted-foreground">
                        <Plus className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-sm">{isRTL ? 'إضافة لون' : 'Add Color'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ==================== DOCUMENTS TAB ==================== */}
        <TabsContent value="documents">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'إدارة المستندات' : 'Document Management'}</h3>
              <Button className="gap-2" onClick={() => { setSelectedStyle(styles[0] || null); setIsAddDocumentOpen(true); }}>
                <Upload className="w-4 h-4" />
                {isRTL ? 'رفع ملف' : 'Upload File'}
              </Button>
            </div>
            
            {/* Document Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
              {[
                { key: 'all', label: 'All', labelAr: 'الكل', count: documents.length },
                { key: 'sketch', label: 'Sketches', labelAr: 'الرسومات', count: documents.filter(d => d.category === 'sketch').length },
                { key: 'pattern', label: 'Patterns', labelAr: 'الباترون', count: documents.filter(d => d.category === 'pattern').length },
                { key: 'techpack', label: 'Tech Packs', labelAr: 'ملفات فنية', count: documents.filter(d => d.category === 'techpack').length },
                { key: 'artwork', label: 'Artwork', labelAr: 'الأعمال الفنية', count: documents.filter(d => d.category === 'artwork').length },
                { key: 'sample_photo', label: 'Photos', labelAr: 'الصور', count: documents.filter(d => d.category === 'sample_photo').length },
              ].map(cat => (
                <button
                  key={cat.key}
                  className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-center"
                >
                  <p className="text-lg font-bold">{cat.count}</p>
                  <p className="text-xs text-muted-foreground">{isRTL ? cat.labelAr : cat.label}</p>
                </button>
              ))}
            </div>

            {/* Documents List */}
            <div className="space-y-2">
              {documents.map(doc => {
                const style = styles.find(s => s.id === doc.styleId);
                const typeIcons: Record<string, string> = {
                  pdf: '📄',
                  dxf: '📐',
                  cad: '🖥️',
                  image: '🖼️',
                  other: '📎',
                };
                return (
                  <div key={doc.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="text-2xl">{typeIcons[doc.type] || '📎'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {style ? getStyleName(style, i18n.language) : ''} • v{doc.version} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-muted rounded text-xs">{tag}</span>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground text-end">
                      <p>{doc.uploadedBy}</p>
                      <p>{doc.uploadedAt}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => window.open(doc.fileUrl, '_blank')}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditDocument(doc)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm({ type: 'document', id: doc.id, name: doc.name })}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ==================== VERSION HISTORY TAB ==================== */}
        <TabsContent value="versions">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'سجل الإصدارات والتغييرات' : 'Version Control & Revision History'}</h3>
            </div>
            
            <div className="relative">
              {/* Timeline */}
              <div className="absolute start-6 top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-4">
                {mockVersionHistory.map((vh, idx) => {
                  const typeColors: Record<string, string> = {
                    create: 'bg-green-500',
                    update: 'bg-blue-500',
                    approve: 'bg-purple-500',
                    reject: 'bg-red-500',
                    revision: 'bg-yellow-500',
                  };
                  return (
                    <div key={vh.id} className="flex gap-4 relative">
                      <div className={`w-3 h-3 rounded-full ${typeColors[vh.changeType]} mt-1.5 z-10`} />
                      <div className="flex-1 bg-muted/30 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium capitalize">{vh.entityType}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">v{vh.version}</span>
                              <StatusBadge status={vh.changeType} />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {isRTL ? vh.changeDescriptionAr : vh.changeDescription}
                            </p>
                          </div>
                          <div className="text-end text-sm text-muted-foreground">
                            <p>{vh.changedByName}</p>
                            <p>{vh.changedAt}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ==================== APPROVALS TAB ==================== */}
        <TabsContent value="approvals">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'سير عمل الموافقات' : 'Approval Workflow & Sign-off'}</h3>
            </div>
            
            <div className="space-y-4">
              {approvalWorkflows.map(aw => (
                <div key={aw.id} className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/30 p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{aw.entityName}</span>
                        <StatusBadge status={aw.status} />
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">
                        {aw.entityType} • {isRTL ? 'بدأ بواسطة' : 'Initiated by'} {aw.initiatedBy}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {aw.completedAt ? (
                        <span className="text-green-600">{isRTL ? 'اكتمل' : 'Completed'}: {aw.completedAt}</span>
                      ) : (
                        <span>{isRTL ? 'بدأ' : 'Started'}: {aw.initiatedAt}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Approval Stages */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {aw.stages.map((stage, idx) => {
                        const isActive = stage.stageOrder === aw.currentStage;
                        const isPast = stage.stageOrder < aw.currentStage || stage.status === 'approved';
                        return (
                          <div key={stage.id} className="flex items-center">
                            <div className={`flex-shrink-0 p-3 rounded-lg border ${
                              stage.status === 'approved' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
                              stage.status === 'rejected' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                              isActive ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' :
                              'bg-muted/30 border-border'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                {stage.status === 'approved' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                <p className="text-sm font-medium">{isRTL ? stage.stageNameAr : stage.stageName}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">{stage.approverRole}</p>
                              {stage.approverName && (
                                <p className="text-xs mt-1">{stage.approverName}</p>
                              )}
                              {stage.actionDate && (
                                <p className="text-xs text-muted-foreground">{stage.actionDate}</p>
                              )}
                              {stage.comments && (
                                <p className="text-xs text-muted-foreground mt-1 italic">"{stage.comments}"</p>
                              )}
                            </div>
                            {idx < aw.stages.length - 1 && (
                              <ChevronRight className={`w-5 h-5 mx-1 ${isPast ? 'text-green-500' : 'text-muted-foreground'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{isRTL ? 'التقدم' : 'Progress'}</span>
                        <span>{Math.round((aw.stages.filter(s => s.status === 'approved').length / aw.stages.length) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(aw.stages.filter(s => s.status === 'approved').length / aw.stages.length) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    {aw.status === 'in_progress' && (
                      <div className="flex gap-2 mt-4">
                        <Button className="gap-1 bg-green-600 hover:bg-green-700" onClick={() => openApprovalDialog(aw.id, 'approve')}>
                          <CheckCircle className="w-4 h-4" />
                          {isRTL ? 'موافقة' : 'Approve'}
                        </Button>
                        <Button variant="outline" className="gap-1 text-red-600 hover:text-red-700" onClick={() => openApprovalDialog(aw.id, 'reject')}>
                          {isRTL ? 'رفض' : 'Reject'}
                        </Button>
                        <Button variant="ghost" onClick={() => openApprovalDialog(aw.id, 'comment')}>
                          {isRTL ? 'إضافة تعليق' : 'Add Comment'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== REPORTS TAB ==================== */}
        <TabsContent value="reports">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'تقارير PLM' : 'PLM Reports'}</h3>
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'قريباً: تقارير PLM' : 'Coming soon: PLM Reports'}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Forms and Dialogs */}
      <StyleForm 
        open={isAddStyleOpen || isEditStyleOpen} 
        onOpenChange={(open) => { setIsAddStyleOpen(open && !selectedStyle); setIsEditStyleOpen(open && !!selectedStyle); if (!open) setSelectedStyle(null); }}
        style={selectedStyle}
        onSave={handleSaveStyle}
      />

      <ViewDialog
        open={isViewStyleOpen}
        onOpenChange={setIsViewStyleOpen}
        title="View Style Details"
        titleAr="عرض تفاصيل الستايل"
      >
        {selectedStyle && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">{isRTL ? 'رقم الستايل' : 'Style Number'}</Label>
                <p className="font-medium font-mono">{selectedStyle.styleNumber}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{isRTL ? 'الحالة' : 'Status'}</Label>
                <StatusBadge status={selectedStyle.status} />
              </div>
              <div>
                <Label className="text-muted-foreground">{isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}</Label>
                <p className="font-medium">{selectedStyle.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}</Label>
                <p className="font-medium" dir="rtl">{selectedStyle.nameAr}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{isRTL ? 'الفئة' : 'Category'}</Label>
                <p className="capitalize">{selectedStyle.category} / {selectedStyle.subcategory}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{isRTL ? 'الموسم' : 'Season'}</Label>
                <p>{selectedStyle.season} - {selectedStyle.collection}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{isRTL ? 'التكلفة / السعر' : 'Cost / Price'}</Label>
                <p>${selectedStyle.targetCost.toFixed(2)} / ${selectedStyle.targetPrice.toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{isRTL ? 'الإصدار' : 'Version'}</Label>
                <p>v{selectedStyle.currentVersion}</p>
              </div>
            </div>
            {selectedStyle.description && (
              <div>
                <Label className="text-muted-foreground">{isRTL ? 'الوصف' : 'Description'}</Label>
                <p>{selectedStyle.description}</p>
              </div>
            )}
          </div>
        )}
      </ViewDialog>

      <ColorVariantForm
        open={isAddColorOpen || isEditColorOpen}
        onOpenChange={(open) => { setIsAddColorOpen(open && !selectedColor); setIsEditColorOpen(open && !!selectedColor); if (!open) setSelectedColor(null); }}
        styleId={selectedStyle?.id || styles[0]?.id || ''}
        color={selectedColor}
        onSave={handleSaveColor}
      />

      <DocumentForm
        open={isAddDocumentOpen || isEditDocumentOpen}
        onOpenChange={(open) => { setIsAddDocumentOpen(open && !selectedDocument); setIsEditDocumentOpen(open && !!selectedDocument); if (!open) setSelectedDocument(null); }}
        styleId={selectedStyle?.id || styles[0]?.id || ''}
        document={selectedDocument}
        onSave={handleSaveDocument}
      />

      <TechPackForm
        open={isAddTechPackOpen || isEditTechPackOpen}
        onOpenChange={(open) => { setIsAddTechPackOpen(open && !selectedTechPack); setIsEditTechPackOpen(open && !!selectedTechPack); if (!open) setSelectedTechPack(null); }}
        styleId={selectedStyle?.id || styles[0]?.id || ''}
        styleName={selectedStyle ? getStyleName(selectedStyle, i18n.language) : (styles[0] ? getStyleName(styles[0], i18n.language) : '')}
        techPack={selectedTechPack}
        onSave={handleSaveTechPack}
      />

      <BOMForm
        open={isAddBOMOpen || isEditBOMOpen}
        onOpenChange={(open) => { setIsAddBOMOpen(open && !selectedBOM); setIsEditBOMOpen(open && !!selectedBOM); if (!open) setSelectedBOM(null); }}
        styleId={selectedStyle?.id || styles[0]?.id || ''}
        styleName={selectedStyle ? getStyleName(selectedStyle, i18n.language) : (styles[0] ? getStyleName(styles[0], i18n.language) : '')}
        bom={selectedBOM}
        onSave={handleSaveBOM}
      />

      <SizeChartForm
        open={isAddSizeChartOpen || isEditSizeChartOpen}
        onOpenChange={(open) => { setIsAddSizeChartOpen(open && !selectedSizeChart); setIsEditSizeChartOpen(open && !!selectedSizeChart); if (!open) setSelectedSizeChart(null); }}
        styleId={selectedStyle?.id || styles[0]?.id || ''}
        styleName={selectedStyle ? getStyleName(selectedStyle, i18n.language) : (styles[0] ? getStyleName(styles[0], i18n.language) : '')}
        sizeChart={selectedSizeChart}
        onSave={handleSaveSizeChart}
      />

      {approvalDialog && (
        <ApprovalDialog
          open={approvalDialog.open}
          onOpenChange={(open) => !open && setApprovalDialog(null)}
          action={approvalDialog.action}
          entityName={approvalDialog.entityName}
          stageName={approvalDialog.stageName}
          onSubmit={handleApprovalAction}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isRTL ? 'تأكيد الحذف' : 'Confirm Delete'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL 
                ? `هل أنت متأكد من حذف "${deleteConfirm?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isRTL ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteConfirm?.type === 'style') {
                  const style = styles.find(s => s.id === deleteConfirm.id);
                  if (style) handleDeleteStyle(style);
                } else if (deleteConfirm?.type === 'color') {
                  const color = colorVariants.find(c => c.id === deleteConfirm.id);
                  if (color) handleDeleteColor(color);
                } else if (deleteConfirm?.type === 'document') {
                  const doc = documents.find(d => d.id === deleteConfirm.id);
                  if (doc) handleDeleteDocument(doc);
                }
              }}
            >
              {isRTL ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ModuleLayout>
  );
}
