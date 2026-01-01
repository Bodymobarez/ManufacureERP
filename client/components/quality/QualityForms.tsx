import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, AlertTriangle, CheckCircle, XCircle, FileText, Calculator } from 'lucide-react';
import {
  IncomingInspection, InLineInspection, FinalInspection, DefectType, NonConformance,
  InspectionDefect, aqlStandards, mockDefectTypes, calculateAQLResult
} from '@/store/qualityData';
import { mockRawMaterials } from '@/store/inventoryData';
import { mockWorkOrders } from '@/store/productionData';

// ==================== INCOMING INSPECTION FORM ====================

interface IncomingInspectionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection?: IncomingInspection | null;
  onSave: (data: any) => void;
}

export function IncomingInspectionForm({ open, onOpenChange, inspection, onSave }: IncomingInspectionFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    materialId: inspection?.materialId || '',
    batchNumber: inspection?.batchNumber || '',
    supplierName: inspection?.supplierName || '',
    poNumber: inspection?.poNumber || '',
    receivedQuantity: inspection?.receivedQuantity || 0,
    aqlLevel: inspection?.aqlLevel || 'AQL 2.5',
    inspectionDate: inspection?.inspectionDate || new Date().toISOString().split('T')[0],
    notes: inspection?.notes || '',
  });

  const [defects, setDefects] = useState<Array<{
    id: string;
    defectTypeId: string;
    quantity: number;
    severity: 'minor' | 'major' | 'critical';
    description: string;
  }>>(inspection?.defects?.map(d => ({
    id: d.id, defectTypeId: d.defectTypeId, quantity: d.quantity, severity: d.severity, description: d.description
  })) || []);

  const selectedMaterial = mockRawMaterials.find(m => m.id === formData.materialId);
  const selectedAQL = aqlStandards.find(s => s.level === formData.aqlLevel);
  const aqlResult = calculateAQLResult(formData.receivedQuantity, formData.aqlLevel, {
    minor: defects.filter(d => d.severity === 'minor').reduce((sum, d) => sum + d.quantity, 0),
    major: defects.filter(d => d.severity === 'major').reduce((sum, d) => sum + d.quantity, 0),
    critical: defects.filter(d => d.severity === 'critical').reduce((sum, d) => sum + d.quantity, 0),
  });

  useEffect(() => {
    if (inspection) {
      setFormData({
        materialId: inspection.materialId, batchNumber: inspection.batchNumber,
        supplierName: inspection.supplierName, poNumber: inspection.poNumber,
        receivedQuantity: inspection.receivedQuantity, aqlLevel: inspection.aqlLevel,
        inspectionDate: inspection.inspectionDate, notes: inspection.notes || '',
      });
      setDefects(inspection.defects.map(d => ({
        id: d.id, defectTypeId: d.defectTypeId, quantity: d.quantity, severity: d.severity, description: d.description
      })));
    }
  }, [inspection, open]);

  const addDefect = () => {
    setDefects([...defects, { id: `d-${Date.now()}`, defectTypeId: '', quantity: 1, severity: 'minor', description: '' }]);
  };

  const removeDefect = (id: string) => setDefects(defects.filter(d => d.id !== id));
  const updateDefect = (id: string, field: string, value: any) => setDefects(defects.map(d => d.id === id ? { ...d, [field]: value } : d));

  const handleSubmit = () => {
    const defectDetails = defects.map(d => {
      const dt = mockDefectTypes.find(t => t.id === d.defectTypeId);
      return {
        id: d.id, defectTypeId: d.defectTypeId, defectTypeCode: dt?.code || '', defectTypeName: dt?.name || '',
        defectTypeNameAr: dt?.nameAr || '', severity: d.severity, quantity: d.quantity, description: d.description,
        descriptionAr: d.description,
      };
    });
    onSave({
      ...formData,
      materialCode: selectedMaterial?.code,
      materialName: selectedMaterial?.name,
      materialNameAr: selectedMaterial?.nameAr,
      unit: selectedMaterial?.unit,
      inspectedQuantity: formData.receivedQuantity,
      acceptedQuantity: formData.receivedQuantity - defects.reduce((sum, d) => sum + d.quantity, 0),
      rejectedQuantity: defects.reduce((sum, d) => sum + d.quantity, 0),
      aqlResult: aqlResult.result,
      defects: defectDetails,
      status: aqlResult.result === 'accepted' ? 'passed' : 'failed',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{inspection ? (isRTL ? 'تعديل فحص وارد' : 'Edit Incoming Inspection') : (isRTL ? 'فحص وارد جديد' : 'New Incoming Inspection')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المادة' : 'Material'}</Label>
              <Select value={formData.materialId} onValueChange={(v) => setFormData({...formData, materialId: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر' : 'Select'} /></SelectTrigger>
                <SelectContent>
                  {mockRawMaterials.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.code} - {isRTL ? m.nameAr : m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم الدفعة' : 'Batch Number'}</Label>
              <Input value={formData.batchNumber} onChange={(e) => setFormData({...formData, batchNumber: e.target.value})} placeholder="BT-2024-XXX" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المورد' : 'Supplier'}</Label>
              <Input value={formData.supplierName} onChange={(e) => setFormData({...formData, supplierName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم أمر الشراء' : 'PO Number'}</Label>
              <Input value={formData.poNumber} onChange={(e) => setFormData({...formData, poNumber: e.target.value})} placeholder="PO-2024-XXX" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الكمية المستلمة' : 'Received Quantity'} ({selectedMaterial?.unit || ''})</Label>
              <Input type="number" value={formData.receivedQuantity} onChange={(e) => setFormData({...formData, receivedQuantity: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'معيار AQL' : 'AQL Standard'}</Label>
              <Select value={formData.aqlLevel} onValueChange={(v) => setFormData({...formData, aqlLevel: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {aqlStandards.map(aql => (
                    <SelectItem key={aql.id} value={aql.level}>{aql.level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الفحص' : 'Inspection Date'}</Label>
              <Input type="date" value={formData.inspectionDate} onChange={(e) => setFormData({...formData, inspectionDate: e.target.value})} />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{isRTL ? 'العيوب المكتشفة' : 'Defects Found'}</h4>
              <Button type="button" variant="outline" size="sm" onClick={addDefect} className="gap-1">
                <Plus className="w-4 h-4" />{isRTL ? 'إضافة عيب' : 'Add Defect'}
              </Button>
            </div>
            
            <div className="space-y-2">
              {defects.map((defect) => {
                const dt = mockDefectTypes.find(t => t.id === defect.defectTypeId);
                return (
                  <div key={defect.id} className="flex gap-2 items-center bg-muted/20 p-3 rounded-lg">
                    <div className="flex-1">
                      <Select value={defect.defectTypeId} onValueChange={(v) => updateDefect(defect.id, 'defectTypeId', v)}>
                        <SelectTrigger><SelectValue placeholder={isRTL ? 'نوع العيب' : 'Defect Type'} /></SelectTrigger>
                        <SelectContent>
                          {mockDefectTypes.map(dt => (
                            <SelectItem key={dt.id} value={dt.id}>{dt.code} - {isRTL ? dt.nameAr : dt.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-32">
                      <Select value={defect.severity} onValueChange={(v) => updateDefect(defect.id, 'severity', v as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minor">{isRTL ? 'طفيف' : 'Minor'}</SelectItem>
                          <SelectItem value="major">{isRTL ? 'كبير' : 'Major'}</SelectItem>
                          <SelectItem value="critical">{isRTL ? 'حرج' : 'Critical'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input type="number" value={defect.quantity} onChange={(e) => updateDefect(defect.id, 'quantity', parseInt(e.target.value) || 1)} className="w-20" placeholder={isRTL ? 'الكمية' : 'Qty'} />
                    <Input value={defect.description} onChange={(e) => updateDefect(defect.id, 'description', e.target.value)} className="flex-1" placeholder={isRTL ? 'الوصف' : 'Description'} />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeDefect(defect.id)} className="h-9 w-9 p-0">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className={`p-4 rounded-lg ${aqlResult.result === 'accepted' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {aqlResult.result === 'accepted' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                  <span className="font-medium">{isRTL ? 'نتيجة AQL' : 'AQL Result'}: {aqlResult.result === 'accepted' ? (isRTL ? 'مقبول' : 'Accepted') : (isRTL ? 'مرفوض' : 'Rejected')}</span>
                </div>
                <span className="text-sm text-muted-foreground">{isRTL ? 'حجم العينة' : 'Sample Size'}: {aqlResult.sampleSize}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== IN-LINE INSPECTION FORM ====================

interface InLineInspectionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection?: InLineInspection | null;
  onSave: (data: any) => void;
}

export function InLineInspectionForm({ open, onOpenChange, inspection, onSave }: InLineInspectionFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    workOrderId: inspection?.workOrderId || '',
    inspectionType: inspection?.inspectionType || 'periodic',
    inspectedQuantity: inspection?.inspectedQuantity || 0,
    inspectionTime: inspection?.inspectionTime?.split('T')[0] || new Date().toISOString().split('T')[0],
    actionRequired: inspection?.actionRequired || '',
  });

  const [defects, setDefects] = useState<Array<{
    id: string;
    defectTypeId: string;
    quantity: number;
    severity: 'minor' | 'major' | 'critical';
    description: string;
    operatorId?: string;
  }>>(inspection?.defects?.map(d => ({
    id: d.id, defectTypeId: d.defectTypeId, quantity: d.quantity, severity: d.severity, description: d.description, operatorId: d.operatorId
  })) || []);

  const selectedWO = mockWorkOrders.find(w => w.id === formData.workOrderId);

  useEffect(() => {
    if (inspection) {
      setFormData({
        workOrderId: inspection.workOrderId, inspectionType: inspection.inspectionType,
        inspectedQuantity: inspection.inspectedQuantity, inspectionTime: inspection.inspectionTime?.split('T')[0] || '',
        actionRequired: inspection.actionRequired || '',
      });
      setDefects(inspection.defects.map(d => ({
        id: d.id, defectTypeId: d.defectTypeId, quantity: d.quantity, severity: d.severity,
        description: d.description, operatorId: d.operatorId
      })));
    }
  }, [inspection, open]);

  const addDefect = () => setDefects([...defects, { id: `d-${Date.now()}`, defectTypeId: '', quantity: 1, severity: 'minor', description: '' }]);
  const removeDefect = (id: string) => setDefects(defects.filter(d => d.id !== id));
  const updateDefect = (id: string, field: string, value: any) => setDefects(defects.map(d => d.id === id ? { ...d, [field]: value } : d));

  const handleSubmit = () => {
    const defectDetails = defects.map(d => {
      const dt = mockDefectTypes.find(t => t.id === d.defectTypeId);
      return {
        id: d.id, defectTypeId: d.defectTypeId, defectTypeCode: dt?.code || '', defectTypeName: dt?.name || '',
        defectTypeNameAr: dt?.nameAr || '', severity: d.severity, quantity: d.quantity, description: d.description,
        descriptionAr: d.description, operatorId: d.operatorId,
      };
    });
    onSave({
      ...formData,
      workOrderNumber: selectedWO?.workOrderNumber,
      productionOrderId: selectedWO?.productionOrderId,
      productionOrderNumber: selectedWO?.productionOrderNumber,
      stage: selectedWO?.stage,
      lineId: selectedWO?.lineId,
      lineName: selectedWO?.lineName,
      defectQuantity: defects.reduce((sum, d) => sum + d.quantity, 0),
      passedQuantity: formData.inspectedQuantity - defects.reduce((sum, d) => sum + d.quantity, 0),
      defects: defectDetails,
      status: defects.length === 0 ? 'passed' : 'requires_action',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{inspection ? (isRTL ? 'تعديل فحص أثناء الإنتاج' : 'Edit In-Line Inspection') : (isRTL ? 'فحص أثناء الإنتاج جديد' : 'New In-Line Inspection')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'أمر العمل' : 'Work Order'}</Label>
              <Select value={formData.workOrderId} onValueChange={(v) => setFormData({...formData, workOrderId: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر' : 'Select'} /></SelectTrigger>
                <SelectContent>
                  {mockWorkOrders.map(wo => (
                    <SelectItem key={wo.id} value={wo.id}>{wo.workOrderNumber} - {wo.stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع الفحص' : 'Inspection Type'}</Label>
              <Select value={formData.inspectionType} onValueChange={(v) => setFormData({...formData, inspectionType: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="first_piece">{isRTL ? 'القطعة الأولى' : 'First Piece'}</SelectItem>
                  <SelectItem value="periodic">{isRTL ? 'دوري' : 'Periodic'}</SelectItem>
                  <SelectItem value="random">{isRTL ? 'عشوائي' : 'Random'}</SelectItem>
                  <SelectItem value="100_percent">{isRTL ? '100%' : '100% Inspection'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الكمية المفحوصة' : 'Inspected Quantity'}</Label>
              <Input type="number" value={formData.inspectedQuantity} onChange={(e) => setFormData({...formData, inspectedQuantity: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'وقت الفحص' : 'Inspection Time'}</Label>
              <Input type="datetime-local" value={formData.inspectionTime} onChange={(e) => setFormData({...formData, inspectionTime: e.target.value})} />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{isRTL ? 'العيوب المكتشفة' : 'Defects Found'}</h4>
              <Button type="button" variant="outline" size="sm" onClick={addDefect} className="gap-1">
                <Plus className="w-4 h-4" />{isRTL ? 'إضافة عيب' : 'Add Defect'}
              </Button>
            </div>
            
            <div className="space-y-2">
              {defects.map((defect) => (
                <div key={defect.id} className="flex gap-2 items-center bg-muted/20 p-3 rounded-lg">
                  <div className="flex-1">
                    <Select value={defect.defectTypeId} onValueChange={(v) => updateDefect(defect.id, 'defectTypeId', v)}>
                      <SelectTrigger><SelectValue placeholder={isRTL ? 'نوع العيب' : 'Defect Type'} /></SelectTrigger>
                      <SelectContent>
                        {mockDefectTypes.map(dt => (
                          <SelectItem key={dt.id} value={dt.id}>{dt.code} - {isRTL ? dt.nameAr : dt.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <Select value={defect.severity} onValueChange={(v) => updateDefect(defect.id, 'severity', v as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minor">{isRTL ? 'طفيف' : 'Minor'}</SelectItem>
                        <SelectItem value="major">{isRTL ? 'كبير' : 'Major'}</SelectItem>
                        <SelectItem value="critical">{isRTL ? 'حرج' : 'Critical'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input type="number" value={defect.quantity} onChange={(e) => updateDefect(defect.id, 'quantity', parseInt(e.target.value) || 1)} className="w-20" />
                  <Input value={defect.description} onChange={(e) => updateDefect(defect.id, 'description', e.target.value)} className="flex-1" />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeDefect(defect.id)} className="h-9 w-9 p-0">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'الإجراء المطلوب' : 'Action Required'}</Label>
            <Textarea value={formData.actionRequired} onChange={(e) => setFormData({...formData, actionRequired: e.target.value})} rows={2} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== FINAL INSPECTION FORM ====================

interface FinalInspectionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection?: FinalInspection | null;
  productionOrderId?: string;
  onSave: (data: any) => void;
}

export function FinalInspectionForm({ open, onOpenChange, inspection, productionOrderId, onSave }: FinalInspectionFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    productionOrderId: inspection?.productionOrderId || productionOrderId || '',
    lotQuantity: inspection?.lotQuantity || 0,
    aqlLevel: inspection?.aqlLevel || 'AQL 2.5',
    inspectionDate: inspection?.inspectionDate || new Date().toISOString().split('T')[0],
    notes: inspection?.notes || '',
  });

  const [defects, setDefects] = useState<Array<{
    id: string;
    defectTypeId: string;
    quantity: number;
    severity: 'minor' | 'major' | 'critical';
    description: string;
  }>>(inspection?.defects?.map(d => ({
    id: d.id, defectTypeId: d.defectTypeId, quantity: d.quantity, severity: d.severity, description: d.description
  })) || []);

  const aqlResult = calculateAQLResult(formData.lotQuantity, formData.aqlLevel, {
    minor: defects.filter(d => d.severity === 'minor').reduce((sum, d) => sum + d.quantity, 0),
    major: defects.filter(d => d.severity === 'major').reduce((sum, d) => sum + d.quantity, 0),
    critical: defects.filter(d => d.severity === 'critical').reduce((sum, d) => sum + d.quantity, 0),
  });

  useEffect(() => {
    if (inspection) {
      setFormData({
        productionOrderId: inspection.productionOrderId, lotQuantity: inspection.lotQuantity,
        aqlLevel: inspection.aqlLevel, inspectionDate: inspection.inspectionDate, notes: inspection.notes || '',
      });
      setDefects(inspection.defects.map(d => ({
        id: d.id, defectTypeId: d.defectTypeId, quantity: d.quantity, severity: d.severity, description: d.description
      })));
    }
  }, [inspection, open]);

  const addDefect = () => setDefects([...defects, { id: `d-${Date.now()}`, defectTypeId: '', quantity: 1, severity: 'minor', description: '' }]);
  const removeDefect = (id: string) => setDefects(defects.filter(d => d.id !== id));
  const updateDefect = (id: string, field: string, value: any) => setDefects(defects.map(d => d.id === id ? { ...d, [field]: value } : d));

  const handleSubmit = () => {
    const defectDetails = defects.map(d => {
      const dt = mockDefectTypes.find(t => t.id === d.defectTypeId);
      return {
        id: d.id, defectTypeId: d.defectTypeId, defectTypeCode: dt?.code || '', defectTypeName: dt?.name || '',
        defectTypeNameAr: dt?.nameAr || '', severity: d.severity, quantity: d.quantity, description: d.description,
        descriptionAr: d.description,
      };
    });
    onSave({
      ...formData,
      productionOrderNumber: 'PO-2024-XXX', // Would come from production order
      styleNumber: 'STY-XXX', // Would come from production order
      styleName: 'Style Name', // Would come from production order
      sampleSize: aqlResult.sampleSize,
      inspectedQuantity: aqlResult.sampleSize,
      acceptedQuantity: formData.lotQuantity - defects.reduce((sum, d) => sum + d.quantity, 0),
      rejectedQuantity: defects.reduce((sum, d) => sum + d.quantity, 0),
      defectQuantity: defects.reduce((sum, d) => sum + d.quantity, 0),
      defectRate: (defects.reduce((sum, d) => sum + d.quantity, 0) / formData.lotQuantity) * 100,
      aqlResult: aqlResult.result === 'accepted' ? 'accepted' : 'rejected',
      defects: defectDetails,
      status: aqlResult.result === 'accepted' ? 'passed' : 'failed',
      certificateIssued: aqlResult.result === 'accepted',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{inspection ? (isRTL ? 'تعديل الفحص النهائي' : 'Edit Final Inspection') : (isRTL ? 'فحص نهائي جديد' : 'New Final Inspection')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'أمر الإنتاج' : 'Production Order'}</Label>
              <Input value={formData.productionOrderId} onChange={(e) => setFormData({...formData, productionOrderId: e.target.value})} placeholder="PO-2024-XXX" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'كمية اللوت' : 'Lot Quantity'}</Label>
              <Input type="number" value={formData.lotQuantity} onChange={(e) => setFormData({...formData, lotQuantity: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'معيار AQL' : 'AQL Standard'}</Label>
              <Select value={formData.aqlLevel} onValueChange={(v) => setFormData({...formData, aqlLevel: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {aqlStandards.map(aql => (
                    <SelectItem key={aql.id} value={aql.level}>{aql.level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الفحص' : 'Inspection Date'}</Label>
              <Input type="date" value={formData.inspectionDate} onChange={(e) => setFormData({...formData, inspectionDate: e.target.value})} />
            </div>
          </div>

          <div className={`p-4 rounded-lg bg-blue-50 border border-blue-200`}>
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <span className="font-medium">{isRTL ? 'حجم العينة حسب AQL' : 'AQL Sample Size'}: {aqlResult.sampleSize}</span>
            </div>
            <p className="text-sm text-muted-foreground">{isRTL ? 'تم حساب حجم العينة تلقائياً بناءً على كمية اللوت ومعيار AQL المحدد' : 'Sample size calculated automatically based on lot quantity and selected AQL standard'}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{isRTL ? 'العيوب المكتشفة' : 'Defects Found'}</h4>
              <Button type="button" variant="outline" size="sm" onClick={addDefect} className="gap-1">
                <Plus className="w-4 h-4" />{isRTL ? 'إضافة عيب' : 'Add Defect'}
              </Button>
            </div>
            
            <div className="space-y-2">
              {defects.map((defect) => (
                <div key={defect.id} className="flex gap-2 items-center bg-muted/20 p-3 rounded-lg">
                  <div className="flex-1">
                    <Select value={defect.defectTypeId} onValueChange={(v) => updateDefect(defect.id, 'defectTypeId', v)}>
                      <SelectTrigger><SelectValue placeholder={isRTL ? 'نوع العيب' : 'Defect Type'} /></SelectTrigger>
                      <SelectContent>
                        {mockDefectTypes.map(dt => (
                          <SelectItem key={dt.id} value={dt.id}>{dt.code} - {isRTL ? dt.nameAr : dt.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <Select value={defect.severity} onValueChange={(v) => updateDefect(defect.id, 'severity', v as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minor">{isRTL ? 'طفيف' : 'Minor'}</SelectItem>
                        <SelectItem value="major">{isRTL ? 'كبير' : 'Major'}</SelectItem>
                        <SelectItem value="critical">{isRTL ? 'حرج' : 'Critical'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input type="number" value={defect.quantity} onChange={(e) => updateDefect(defect.id, 'quantity', parseInt(e.target.value) || 1)} className="w-20" />
                  <Input value={defect.description} onChange={(e) => updateDefect(defect.id, 'description', e.target.value)} className="flex-1" />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeDefect(defect.id)} className="h-9 w-9 p-0">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <div className={`p-4 rounded-lg ${aqlResult.result === 'accepted' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {aqlResult.result === 'accepted' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                  <span className="font-medium">{isRTL ? 'نتيجة AQL' : 'AQL Result'}: {aqlResult.result === 'accepted' ? (isRTL ? 'مقبول' : 'Accepted') : (isRTL ? 'مرفوض' : 'Rejected')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== NON-CONFORMANCE FORM ====================

interface NonConformanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nc?: NonConformance | null;
  onSave: (data: any) => void;
}

export function NonConformanceForm({ open, onOpenChange, nc, onSave }: NonConformanceFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    type: nc?.type || 'production',
    severity: nc?.severity || 'major',
    title: nc?.title || '',
    titleAr: nc?.titleAr || '',
    description: nc?.description || '',
    descriptionAr: nc?.descriptionAr || '',
    department: nc?.department || 'Production',
    rootCause: nc?.rootCause || '',
    immediateAction: nc?.immediateAction || '',
    correctiveAction: nc?.correctiveAction || '',
    preventiveAction: nc?.preventiveAction || '',
    responsiblePartyName: nc?.responsiblePartyName || '',
    targetDate: nc?.targetDate || '',
  });

  useEffect(() => {
    if (nc) {
      setFormData({
        type: nc.type, severity: nc.severity, title: nc.title, titleAr: nc.titleAr,
        description: nc.description, descriptionAr: nc.descriptionAr, department: nc.department,
        rootCause: nc.rootCause || '', immediateAction: nc.immediateAction || '',
        correctiveAction: nc.correctiveAction || '', preventiveAction: nc.preventiveAction || '',
        responsiblePartyName: nc.responsiblePartyName, targetDate: nc.targetDate,
      });
    }
  }, [nc, open]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      status: 'open',
      relatedTo: { type: 'inspection', id: '', reference: '' },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            {nc ? (isRTL ? 'تعديل عدم المطابقة' : 'Edit Non-Conformance') : (isRTL ? 'عدم مطابقة جديد' : 'New Non-Conformance')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'النوع' : 'Type'}</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="material">{isRTL ? 'مادة' : 'Material'}</SelectItem>
                  <SelectItem value="production">{isRTL ? 'إنتاج' : 'Production'}</SelectItem>
                  <SelectItem value="process">{isRTL ? 'عملية' : 'Process'}</SelectItem>
                  <SelectItem value="system">{isRTL ? 'نظام' : 'System'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الخطورة' : 'Severity'}</Label>
              <Select value={formData.severity} onValueChange={(v) => setFormData({...formData, severity: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">{isRTL ? 'طفيف' : 'Minor'}</SelectItem>
                  <SelectItem value="major">{isRTL ? 'كبير' : 'Major'}</SelectItem>
                  <SelectItem value="critical">{isRTL ? 'حرج' : 'Critical'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'العنوان (إنجليزي)' : 'Title (English)'}</Label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'العنوان (عربي)' : 'Title (Arabic)'}</Label>
              <Input value={formData.titleAr} onChange={(e) => setFormData({...formData, titleAr: e.target.value})} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'القسم' : 'Department'}</Label>
              <Input value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المسؤول' : 'Responsible Party'}</Label>
              <Input value={formData.responsiblePartyName} onChange={(e) => setFormData({...formData, responsiblePartyName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الهدف' : 'Target Date'}</Label>
              <Input type="date" value={formData.targetDate} onChange={(e) => setFormData({...formData, targetDate: e.target.value})} />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
            <Textarea value={formData.descriptionAr} onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})} rows={3} dir="rtl" />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">{isRTL ? 'الإجراءات' : 'Actions'}</h4>
            <div className="space-y-2">
              <Label>{isRTL ? 'السبب الجذري' : 'Root Cause'}</Label>
              <Textarea value={formData.rootCause} onChange={(e) => setFormData({...formData, rootCause: e.target.value})} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الإجراء الفوري' : 'Immediate Action'}</Label>
              <Textarea value={formData.immediateAction} onChange={(e) => setFormData({...formData, immediateAction: e.target.value})} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الإجراء التصحيحي' : 'Corrective Action'}</Label>
              <Textarea value={formData.correctiveAction} onChange={(e) => setFormData({...formData, correctiveAction: e.target.value})} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الإجراء الوقائي' : 'Preventive Action'}</Label>
              <Textarea value={formData.preventiveAction} onChange={(e) => setFormData({...formData, preventiveAction: e.target.value})} rows={2} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== MEASUREMENT INSPECTION FORM ====================

interface MeasurementInspectionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection?: any;
  onSave: (data: any) => void;
}

export function MeasurementInspectionForm({ open, onOpenChange, inspection, onSave }: MeasurementInspectionFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    productionOrderId: inspection?.productionOrderId || '',
    styleNumber: inspection?.styleNumber || '',
    size: inspection?.size || 'M',
    sampleSize: inspection?.sampleSize || 10,
    inspectionDate: inspection?.inspectionDate || new Date().toISOString().split('T')[0],
    measurements: {
      chest: inspection?.measurements?.chest || 0,
      waist: inspection?.measurements?.waist || 0,
      hip: inspection?.measurements?.hip || 0,
      length: inspection?.measurements?.length || 0,
      sleeveLength: inspection?.measurements?.sleeveLength || 0,
      shoulderWidth: inspection?.measurements?.shoulderWidth || 0,
      neckOpening: inspection?.measurements?.neckOpening || 0,
    },
    tolerance: {
      chest: { min: inspection?.tolerance?.chest?.min || 0, max: inspection?.tolerance?.chest?.max || 0 },
      waist: { min: inspection?.tolerance?.waist?.min || 0, max: inspection?.tolerance?.waist?.max || 0 },
      length: { min: inspection?.tolerance?.length?.min || 0, max: inspection?.tolerance?.length?.max || 0 },
    },
    notes: inspection?.notes || '',
  });

  useEffect(() => {
    if (inspection) {
      setFormData({
        productionOrderId: inspection.productionOrderId,
        styleNumber: inspection.styleNumber,
        size: inspection.size,
        sampleSize: inspection.sampleSize,
        inspectionDate: inspection.inspectionDate,
        measurements: inspection.measurements || {},
        tolerance: inspection.tolerance || {},
        notes: inspection.notes || '',
      });
    }
  }, [inspection, open]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      productionOrderNumber: 'PO-2024-XXX',
      styleName: 'Style Name',
      inspectedQuantity: formData.sampleSize,
      passedQuantity: formData.sampleSize,
      failedQuantity: 0,
      status: 'passed',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{inspection ? (isRTL ? 'تعديل فحص القياسات' : 'Edit Measurement Inspection') : (isRTL ? 'فحص قياسات جديد' : 'New Measurement Inspection')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'أمر الإنتاج' : 'Production Order'}</Label>
              <Input value={formData.productionOrderId} onChange={(e) => setFormData({...formData, productionOrderId: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم الموديل' : 'Style Number'}</Label>
              <Input value={formData.styleNumber} onChange={(e) => setFormData({...formData, styleNumber: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المقاس' : 'Size'}</Label>
              <Select value={formData.size} onValueChange={(v) => setFormData({...formData, size: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'حجم العينة' : 'Sample Size'}</Label>
              <Input type="number" value={formData.sampleSize} onChange={(e) => setFormData({...formData, sampleSize: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الفحص' : 'Inspection Date'}</Label>
              <Input type="date" value={formData.inspectionDate} onChange={(e) => setFormData({...formData, inspectionDate: e.target.value})} />
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <h4 className="font-medium">{isRTL ? 'القياسات (سم)' : 'Measurements (cm)'}</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(formData.measurements).map(key => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">{key}</Label>
                  <Input type="number" value={formData.measurements[key as keyof typeof formData.measurements] || 0} 
                    onChange={(e) => setFormData({
                      ...formData,
                      measurements: {...formData.measurements, [key]: parseFloat(e.target.value) || 0}
                    })} />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== COLOR MATCHING FORM ====================

interface ColorMatchingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matching?: any;
  onSave: (data: any) => void;
}

export function ColorMatchingForm({ open, onOpenChange, matching, onSave }: ColorMatchingFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    materialId: matching?.materialId || '',
    batchNumber: matching?.batchNumber || '',
    supplierName: matching?.supplierName || '',
    standardColor: {
      lab: { L: matching?.standardColor?.lab?.L || 0, a: matching?.standardColor?.lab?.a || 0, b: matching?.standardColor?.lab?.b || 0 },
      rgb: { r: matching?.standardColor?.rgb?.r || 0, g: matching?.standardColor?.rgb?.g || 0, b: matching?.standardColor?.rgb?.b || 0 },
      hex: matching?.standardColor?.hex || '#000000',
    },
    sampleColor: {
      lab: { L: matching?.sampleColor?.lab?.L || 0, a: matching?.sampleColor?.lab?.a || 0, b: matching?.sampleColor?.lab?.b || 0 },
      rgb: { r: matching?.sampleColor?.rgb?.r || 0, g: matching?.sampleColor?.rgb?.g || 0, b: matching?.sampleColor?.rgb?.b || 0 },
      hex: matching?.sampleColor?.hex || '#000000',
    },
    tolerance: matching?.tolerance || 1.5,
    inspectionDate: matching?.inspectionDate || new Date().toISOString().split('T')[0],
    notes: matching?.notes || '',
  });

  useEffect(() => {
    if (matching) {
      setFormData({
        materialId: matching.materialId,
        batchNumber: matching.batchNumber,
        supplierName: matching.supplierName,
        standardColor: matching.standardColor || {},
        sampleColor: matching.sampleColor || {},
        tolerance: matching.tolerance || 1.5,
        inspectionDate: matching.inspectionDate,
        notes: matching.notes || '',
      });
    }
  }, [matching, open]);

  const calculateDeltaE = () => {
    const deltaL = formData.standardColor.lab.L - formData.sampleColor.lab.L;
    const deltaA = formData.standardColor.lab.a - formData.sampleColor.lab.a;
    const deltaB = formData.standardColor.lab.b - formData.sampleColor.lab.b;
    return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
  };

  const deltaE = calculateDeltaE();

  const handleSubmit = () => {
    onSave({
      ...formData,
      materialCode: 'FAB-XXX',
      materialName: 'Fabric Name',
      materialNameAr: 'اسم القماش',
      supplierId: 'sup-1',
      status: deltaE <= formData.tolerance ? 'approved' : 'rejected',
      deltaE: deltaE,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{matching ? (isRTL ? 'تعديل مطابقة اللون' : 'Edit Color Matching') : (isRTL ? 'مطابقة لون جديدة' : 'New Color Matching')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المادة' : 'Material'}</Label>
              <Input value={formData.materialId} onChange={(e) => setFormData({...formData, materialId: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم الدفعة' : 'Batch Number'}</Label>
              <Input value={formData.batchNumber} onChange={(e) => setFormData({...formData, batchNumber: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المورد' : 'Supplier'}</Label>
              <Input value={formData.supplierName} onChange={(e) => setFormData({...formData, supplierName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'التسامح' : 'Tolerance'}</Label>
              <Input type="number" step="0.1" value={formData.tolerance} onChange={(e) => setFormData({...formData, tolerance: parseFloat(e.target.value) || 0})} />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">{isRTL ? 'اللون القياسي' : 'Standard Color'}</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 rounded border" style={{ backgroundColor: formData.standardColor.hex }}></div>
                  <Input type="color" value={formData.standardColor.hex} onChange={(e) => setFormData({
                    ...formData,
                    standardColor: {...formData.standardColor, hex: e.target.value}
                  })} className="w-20" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input type="number" placeholder="L" value={formData.standardColor.lab.L} onChange={(e) => setFormData({
                    ...formData,
                    standardColor: {...formData.standardColor, lab: {...formData.standardColor.lab, L: parseFloat(e.target.value) || 0}}
                  })} />
                  <Input type="number" placeholder="a" value={formData.standardColor.lab.a} onChange={(e) => setFormData({
                    ...formData,
                    standardColor: {...formData.standardColor, lab: {...formData.standardColor.lab, a: parseFloat(e.target.value) || 0}}
                  })} />
                  <Input type="number" placeholder="b" value={formData.standardColor.lab.b} onChange={(e) => setFormData({
                    ...formData,
                    standardColor: {...formData.standardColor, lab: {...formData.standardColor.lab, b: parseFloat(e.target.value) || 0}}
                  })} />
                </div>
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{isRTL ? 'لون العينة' : 'Sample Color'}</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 rounded border" style={{ backgroundColor: formData.sampleColor.hex }}></div>
                  <Input type="color" value={formData.sampleColor.hex} onChange={(e) => setFormData({
                    ...formData,
                    sampleColor: {...formData.sampleColor, hex: e.target.value}
                  })} className="w-20" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input type="number" placeholder="L" value={formData.sampleColor.lab.L} onChange={(e) => setFormData({
                    ...formData,
                    sampleColor: {...formData.sampleColor, lab: {...formData.sampleColor.lab, L: parseFloat(e.target.value) || 0}}
                  })} />
                  <Input type="number" placeholder="a" value={formData.sampleColor.lab.a} onChange={(e) => setFormData({
                    ...formData,
                    sampleColor: {...formData.sampleColor, lab: {...formData.sampleColor.lab, a: parseFloat(e.target.value) || 0}}
                  })} />
                  <Input type="number" placeholder="b" value={formData.sampleColor.lab.b} onChange={(e) => setFormData({
                    ...formData,
                    sampleColor: {...formData.sampleColor, lab: {...formData.sampleColor.lab, b: parseFloat(e.target.value) || 0}}
                  })} />
                </div>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-lg ${deltaE <= formData.tolerance ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">{isRTL ? 'Delta E' : 'Delta E'}: {deltaE.toFixed(2)}</span>
              <span>{deltaE <= formData.tolerance ? (isRTL ? 'مقبول' : 'Accepted') : (isRTL ? 'مرفوض' : 'Rejected')}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== FABRIC TEST FORM ====================

interface FabricTestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  test?: any;
  onSave: (data: any) => void;
}

export function FabricTestForm({ open, onOpenChange, test, onSave }: FabricTestFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    materialId: test?.materialId || '',
    batchNumber: test?.batchNumber || '',
    supplierName: test?.supplierName || '',
    testType: test?.testType || 'colorfastness',
    testName: test?.testName || '',
    testNameAr: test?.testNameAr || '',
    standard: test?.standard || '',
    method: test?.method || '',
    resultValue: test?.resultValue || 0,
    unit: test?.unit || '',
    specification: {
      min: test?.specification?.min || 0,
      max: test?.specification?.max || 0,
      target: test?.specification?.target || 0,
    },
    testDate: test?.testDate || new Date().toISOString().split('T')[0],
    labName: test?.labName || '',
    certificateNumber: test?.certificateNumber || '',
    notes: test?.notes || '',
  });

  useEffect(() => {
    if (test) {
      setFormData({
        materialId: test.materialId,
        batchNumber: test.batchNumber,
        supplierName: test.supplierName,
        testType: test.testType,
        testName: test.testName,
        testNameAr: test.testNameAr,
        standard: test.standard,
        method: test.method,
        resultValue: test.resultValue || 0,
        unit: test.unit,
        specification: test.specification || {},
        testDate: test.testDate,
        labName: test.labName || '',
        certificateNumber: test.certificateNumber || '',
        notes: test.notes || '',
      });
    }
  }, [test, open]);

  const handleSubmit = () => {
    let status: 'passed' | 'failed' | 'marginal' = 'passed';
    if (formData.specification.min && formData.resultValue < formData.specification.min) status = 'failed';
    if (formData.specification.max && formData.resultValue > formData.specification.max) status = 'failed';
    
    onSave({
      ...formData,
      materialCode: 'FAB-XXX',
      materialName: 'Fabric Name',
      materialNameAr: 'اسم القماش',
      supplierId: 'sup-1',
      result: status === 'passed' ? 'passed' : 'failed',
      status: status,
      testedBy: 'emp-current',
      testedByName: 'Current User',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{test ? (isRTL ? 'تعديل اختبار القماش' : 'Edit Fabric Test') : (isRTL ? 'اختبار قماش جديد' : 'New Fabric Test')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المادة' : 'Material'}</Label>
              <Input value={formData.materialId} onChange={(e) => setFormData({...formData, materialId: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم الدفعة' : 'Batch Number'}</Label>
              <Input value={formData.batchNumber} onChange={(e) => setFormData({...formData, batchNumber: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع الاختبار' : 'Test Type'}</Label>
              <Select value={formData.testType} onValueChange={(v) => setFormData({...formData, testType: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="colorfastness">{isRTL ? 'مقاومة اللون' : 'Colorfastness'}</SelectItem>
                  <SelectItem value="shrinkage">{isRTL ? 'الانكماش' : 'Shrinkage'}</SelectItem>
                  <SelectItem value="pilling">{isRTL ? 'تكوّن الكرات' : 'Pilling'}</SelectItem>
                  <SelectItem value="tensile">{isRTL ? 'الشد' : 'Tensile'}</SelectItem>
                  <SelectItem value="tear">{isRTL ? 'التمزق' : 'Tear'}</SelectItem>
                  <SelectItem value="abrasion">{isRTL ? 'الاحتكاك' : 'Abrasion'}</SelectItem>
                  <SelectItem value="ph">{isRTL ? 'الأس الهيدروجيني' : 'pH'}</SelectItem>
                  <SelectItem value="formaldehyde">{isRTL ? 'الفورمالديهايد' : 'Formaldehyde'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم الاختبار' : 'Test Name'}</Label>
              <Input value={formData.testName} onChange={(e) => setFormData({...formData, testName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المعيار' : 'Standard'}</Label>
              <Input value={formData.standard} onChange={(e) => setFormData({...formData, standard: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الطريقة' : 'Method'}</Label>
              <Input value={formData.method} onChange={(e) => setFormData({...formData, method: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'قيمة النتيجة' : 'Result Value'}</Label>
              <Input type="number" step="0.1" value={formData.resultValue} onChange={(e) => setFormData({...formData, resultValue: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الوحدة' : 'Unit'}</Label>
              <Input value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الحد الأدنى' : 'Min'}</Label>
              <Input type="number" step="0.1" value={formData.specification.min} onChange={(e) => setFormData({
                ...formData,
                specification: {...formData.specification, min: parseFloat(e.target.value) || 0}
              })} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الحد الأقصى' : 'Max'}</Label>
              <Input type="number" step="0.1" value={formData.specification.max} onChange={(e) => setFormData({
                ...formData,
                specification: {...formData.specification, max: parseFloat(e.target.value) || 0}
              })} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الاختبار' : 'Test Date'}</Label>
              <Input type="date" value={formData.testDate} onChange={(e) => setFormData({...formData, testDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم المختبر' : 'Lab Name'}</Label>
              <Input value={formData.labName} onChange={(e) => setFormData({...formData, labName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم الشهادة' : 'Certificate Number'}</Label>
              <Input value={formData.certificateNumber} onChange={(e) => setFormData({...formData, certificateNumber: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== PRE-PRODUCTION SAMPLE FORM ====================

interface PreProductionSampleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sample?: any;
  onSave: (data: any) => void;
}

export function PreProductionSampleForm({ open, onOpenChange, sample, onSave }: PreProductionSampleFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    styleId: sample?.styleId || '',
    styleNumber: sample?.styleNumber || '',
    sampleType: sample?.sampleType || 'pp',
    size: sample?.size || 'M',
    quantity: sample?.quantity || 1,
    submittedDate: sample?.submittedDate || new Date().toISOString().split('T')[0],
    notes: sample?.notes || '',
  });

  useEffect(() => {
    if (sample) {
      setFormData({
        styleId: sample.styleId,
        styleNumber: sample.styleNumber,
        sampleType: sample.sampleType,
        size: sample.size,
        quantity: sample.quantity,
        submittedDate: sample.submittedDate,
        notes: sample.notes || '',
      });
    }
  }, [sample, open]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      styleName: 'Style Name',
      styleNameAr: 'اسم الموديل',
      status: 'pending',
      defects: [],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sample ? (isRTL ? 'تعديل العينة' : 'Edit Sample') : (isRTL ? 'عينة جديدة' : 'New Sample')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم الموديل' : 'Style Number'}</Label>
              <Input value={formData.styleNumber} onChange={(e) => setFormData({...formData, styleNumber: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع العينة' : 'Sample Type'}</Label>
              <Select value={formData.sampleType} onValueChange={(v) => setFormData({...formData, sampleType: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="proto">{isRTL ? 'نموذج أولي' : 'Proto'}</SelectItem>
                  <SelectItem value="fit">{isRTL ? 'قياس' : 'Fit'}</SelectItem>
                  <SelectItem value="pp">{isRTL ? 'قبل الإنتاج' : 'Pre-Production'}</SelectItem>
                  <SelectItem value="salesman">{isRTL ? 'بائع' : 'Salesman'}</SelectItem>
                  <SelectItem value="photo">{isRTL ? 'تصوير' : 'Photo'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المقاس' : 'Size'}</Label>
              <Select value={formData.size} onValueChange={(v) => setFormData({...formData, size: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الكمية' : 'Quantity'}</Label>
              <Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ التقديم' : 'Submitted Date'}</Label>
              <Input type="date" value={formData.submittedDate} onChange={(e) => setFormData({...formData, submittedDate: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== CUSTOMER COMPLAINT FORM ====================

interface CustomerComplaintFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint?: any;
  onSave: (data: any) => void;
}

export function CustomerComplaintForm({ open, onOpenChange, complaint, onSave }: CustomerComplaintFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    customerName: complaint?.customerName || '',
    orderNumber: complaint?.orderNumber || '',
    styleNumber: complaint?.styleNumber || '',
    complaintDate: complaint?.complaintDate || new Date().toISOString().split('T')[0],
    complaintType: complaint?.complaintType || 'quality',
    severity: complaint?.severity || 'major',
    description: complaint?.description || '',
    descriptionAr: complaint?.descriptionAr || '',
    quantity: complaint?.quantity || 1,
    responsiblePartyName: complaint?.responsiblePartyName || '',
    notes: complaint?.notes || '',
  });

  useEffect(() => {
    if (complaint) {
      setFormData({
        customerName: complaint.customerName,
        orderNumber: complaint.orderNumber,
        styleNumber: complaint.styleNumber,
        complaintDate: complaint.complaintDate,
        complaintType: complaint.complaintType,
        severity: complaint.severity,
        description: complaint.description,
        descriptionAr: complaint.descriptionAr,
        quantity: complaint.quantity,
        responsiblePartyName: complaint.responsiblePartyName,
        notes: complaint.notes || '',
      });
    }
  }, [complaint, open]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      customerId: 'cust-1',
      styleName: 'Style Name',
      receivedDate: formData.complaintDate,
      status: 'open',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{complaint ? (isRTL ? 'تعديل الشكوى' : 'Edit Complaint') : (isRTL ? 'شكوى جديدة' : 'New Complaint')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم العميل' : 'Customer Name'}</Label>
              <Input value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم الطلب' : 'Order Number'}</Label>
              <Input value={formData.orderNumber} onChange={(e) => setFormData({...formData, orderNumber: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم الموديل' : 'Style Number'}</Label>
              <Input value={formData.styleNumber} onChange={(e) => setFormData({...formData, styleNumber: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الشكوى' : 'Complaint Date'}</Label>
              <Input type="date" value={formData.complaintDate} onChange={(e) => setFormData({...formData, complaintDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع الشكوى' : 'Complaint Type'}</Label>
              <Select value={formData.complaintType} onValueChange={(v) => setFormData({...formData, complaintType: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="quality">{isRTL ? 'جودة' : 'Quality'}</SelectItem>
                  <SelectItem value="size">{isRTL ? 'مقاس' : 'Size'}</SelectItem>
                  <SelectItem value="color">{isRTL ? 'لون' : 'Color'}</SelectItem>
                  <SelectItem value="defect">{isRTL ? 'عيب' : 'Defect'}</SelectItem>
                  <SelectItem value="packaging">{isRTL ? 'تعبئة' : 'Packaging'}</SelectItem>
                  <SelectItem value="delivery">{isRTL ? 'تسليم' : 'Delivery'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الخطورة' : 'Severity'}</Label>
              <Select value={formData.severity} onValueChange={(v) => setFormData({...formData, severity: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">{isRTL ? 'طفيف' : 'Minor'}</SelectItem>
                  <SelectItem value="major">{isRTL ? 'كبير' : 'Major'}</SelectItem>
                  <SelectItem value="critical">{isRTL ? 'حرج' : 'Critical'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الكمية' : 'Quantity'}</Label>
              <Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المسؤول' : 'Responsible Party'}</Label>
              <Input value={formData.responsiblePartyName} onChange={(e) => setFormData({...formData, responsiblePartyName: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
            <Textarea value={formData.descriptionAr} onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})} rows={3} dir="rtl" />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== RETURN/REJECTION FORM ====================

interface ReturnRejectionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnItem?: any;
  onSave: (data: any) => void;
}

export function ReturnRejectionForm({ open, onOpenChange, returnItem, onSave }: ReturnRejectionFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    customerName: returnItem?.customerName || '',
    orderNumber: returnItem?.orderNumber || '',
    styleNumber: returnItem?.styleNumber || '',
    returnDate: returnItem?.returnDate || new Date().toISOString().split('T')[0],
    returnType: returnItem?.returnType || 'customer_return',
    quantity: returnItem?.quantity || 1,
    reason: returnItem?.reason || '',
    reasonAr: returnItem?.reasonAr || '',
    notes: returnItem?.notes || '',
  });

  useEffect(() => {
    if (returnItem) {
      setFormData({
        customerName: returnItem.customerName,
        orderNumber: returnItem.orderNumber,
        styleNumber: returnItem.styleNumber,
        returnDate: returnItem.returnDate,
        returnType: returnItem.returnType,
        quantity: returnItem.quantity,
        reason: returnItem.reason,
        reasonAr: returnItem.reasonAr,
        notes: returnItem.notes || '',
      });
    }
  }, [returnItem, open]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      customerId: 'cust-1',
      styleName: 'Style Name',
      status: 'pending',
      defects: [],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{returnItem ? (isRTL ? 'تعديل الإرجاع' : 'Edit Return') : (isRTL ? 'إرجاع جديد' : 'New Return')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم العميل' : 'Customer Name'}</Label>
              <Input value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم الطلب' : 'Order Number'}</Label>
              <Input value={formData.orderNumber} onChange={(e) => setFormData({...formData, orderNumber: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم الموديل' : 'Style Number'}</Label>
              <Input value={formData.styleNumber} onChange={(e) => setFormData({...formData, styleNumber: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الإرجاع' : 'Return Date'}</Label>
              <Input type="date" value={formData.returnDate} onChange={(e) => setFormData({...formData, returnDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع الإرجاع' : 'Return Type'}</Label>
              <Select value={formData.returnType} onValueChange={(v) => setFormData({...formData, returnType: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer_return">{isRTL ? 'إرجاع عميل' : 'Customer Return'}</SelectItem>
                  <SelectItem value="internal_rejection">{isRTL ? 'رفض داخلي' : 'Internal Rejection'}</SelectItem>
                  <SelectItem value="warehouse_rejection">{isRTL ? 'رفض مستودع' : 'Warehouse Rejection'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الكمية' : 'Quantity'}</Label>
              <Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'السبب (إنجليزي)' : 'Reason (English)'}</Label>
            <Textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'السبب (عربي)' : 'Reason (Arabic)'}</Label>
            <Textarea value={formData.reasonAr} onChange={(e) => setFormData({...formData, reasonAr: e.target.value})} rows={3} dir="rtl" />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== CUSTOMER BRAND STANDARD FORM ====================

interface CustomerBrandStandardFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  standard?: any;
  onSave: (data: any) => void;
}

export function CustomerBrandStandardForm({ open, onOpenChange, standard, onSave }: CustomerBrandStandardFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    customerName: standard?.customerName || '',
    brandName: standard?.brandName || '',
    standardType: standard?.standardType || 'quality',
    standardName: standard?.standardName || '',
    standardNameAr: standard?.standardNameAr || '',
    description: standard?.description || '',
    descriptionAr: standard?.descriptionAr || '',
    effectiveDate: standard?.effectiveDate || new Date().toISOString().split('T')[0],
    expiryDate: standard?.expiryDate || '',
    requirements: standard?.requirements || [{ key: '', value: '', tolerance: '' }],
  });

  useEffect(() => {
    if (standard) {
      setFormData({
        customerName: standard.customerName,
        brandName: standard.brandName || '',
        standardType: standard.standardType,
        standardName: standard.standardName,
        standardNameAr: standard.standardNameAr,
        description: standard.description,
        descriptionAr: standard.descriptionAr,
        effectiveDate: standard.effectiveDate,
        expiryDate: standard.expiryDate || '',
        requirements: standard.requirements || [],
      });
    }
  }, [standard, open]);

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, { key: '', value: '', tolerance: '' }]
    });
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    });
  };

  const updateRequirement = (index: number, field: string, value: string) => {
    const updated = [...formData.requirements];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, requirements: updated });
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      customerId: 'cust-1',
      isActive: true,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{standard ? (isRTL ? 'تعديل المعيار' : 'Edit Standard') : (isRTL ? 'معيار جديد' : 'New Standard')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم العميل' : 'Customer Name'}</Label>
              <Input value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم العلامة التجارية' : 'Brand Name'}</Label>
              <Input value={formData.brandName} onChange={(e) => setFormData({...formData, brandName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع المعيار' : 'Standard Type'}</Label>
              <Select value={formData.standardType} onValueChange={(v) => setFormData({...formData, standardType: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="quality">{isRTL ? 'جودة' : 'Quality'}</SelectItem>
                  <SelectItem value="measurement">{isRTL ? 'قياسات' : 'Measurement'}</SelectItem>
                  <SelectItem value="packaging">{isRTL ? 'تعبئة' : 'Packaging'}</SelectItem>
                  <SelectItem value="labeling">{isRTL ? 'ليبل' : 'Labeling'}</SelectItem>
                  <SelectItem value="testing">{isRTL ? 'اختبارات' : 'Testing'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم المعيار (إنجليزي)' : 'Standard Name (English)'}</Label>
              <Input value={formData.standardName} onChange={(e) => setFormData({...formData, standardName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم المعيار (عربي)' : 'Standard Name (Arabic)'}</Label>
              <Input value={formData.standardNameAr} onChange={(e) => setFormData({...formData, standardNameAr: e.target.value})} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ السريان' : 'Effective Date'}</Label>
              <Input type="date" value={formData.effectiveDate} onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الانتهاء' : 'Expiry Date'}</Label>
              <Input type="date" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
            <Textarea value={formData.descriptionAr} onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})} rows={3} dir="rtl" />
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{isRTL ? 'المتطلبات' : 'Requirements'}</h4>
              <Button type="button" variant="outline" size="sm" onClick={addRequirement} className="gap-1">
                <Plus className="w-4 h-4" />{isRTL ? 'إضافة متطلب' : 'Add Requirement'}
              </Button>
            </div>
            {formData.requirements.map((req, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input value={req.key} onChange={(e) => updateRequirement(idx, 'key', e.target.value)} placeholder={isRTL ? 'المفتاح' : 'Key'} />
                <Input value={req.value} onChange={(e) => updateRequirement(idx, 'value', e.target.value)} placeholder={isRTL ? 'القيمة' : 'Value'} />
                <Input value={req.tolerance} onChange={(e) => updateRequirement(idx, 'tolerance', e.target.value)} placeholder={isRTL ? 'التسامح' : 'Tolerance'} className="w-32" />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeRequirement(idx)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== QUALITY TRAINING FORM ====================

interface QualityTrainingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  training?: any;
  onSave: (data: any) => void;
}

export function QualityTrainingForm({ open, onOpenChange, training, onSave }: QualityTrainingFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    title: training?.title || '',
    titleAr: training?.titleAr || '',
    description: training?.description || '',
    descriptionAr: training?.descriptionAr || '',
    trainingType: training?.trainingType || 'aql',
    trainerName: training?.trainerName || '',
    scheduledDate: training?.scheduledDate || new Date().toISOString().split('T')[0],
    duration: training?.duration || 4,
    notes: training?.notes || '',
  });

  useEffect(() => {
    if (training) {
      setFormData({
        title: training.title,
        titleAr: training.titleAr,
        description: training.description,
        descriptionAr: training.descriptionAr,
        trainingType: training.trainingType,
        trainerName: training.trainerName,
        scheduledDate: training.scheduledDate,
        duration: training.duration,
        notes: training.notes || '',
      });
    }
  }, [training, open]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      trainerId: 'emp-current',
      status: 'scheduled',
      participants: [],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{training ? (isRTL ? 'تعديل التدريب' : 'Edit Training') : (isRTL ? 'تدريب جديد' : 'New Training')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'العنوان (إنجليزي)' : 'Title (English)'}</Label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'العنوان (عربي)' : 'Title (Arabic)'}</Label>
              <Input value={formData.titleAr} onChange={(e) => setFormData({...formData, titleAr: e.target.value})} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع التدريب' : 'Training Type'}</Label>
              <Select value={formData.trainingType} onValueChange={(v) => setFormData({...formData, trainingType: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="defect_recognition">{isRTL ? 'التعرف على العيوب' : 'Defect Recognition'}</SelectItem>
                  <SelectItem value="measurement">{isRTL ? 'القياسات' : 'Measurement'}</SelectItem>
                  <SelectItem value="aql">{isRTL ? 'AQL' : 'AQL Standards'}</SelectItem>
                  <SelectItem value="color_matching">{isRTL ? 'مطابقة الألوان' : 'Color Matching'}</SelectItem>
                  <SelectItem value="fabric_testing">{isRTL ? 'اختبارات القماش' : 'Fabric Testing'}</SelectItem>
                  <SelectItem value="process">{isRTL ? 'العملية' : 'Process'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المدرب' : 'Trainer'}</Label>
              <Input value={formData.trainerName} onChange={(e) => setFormData({...formData, trainerName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ التدريب' : 'Scheduled Date'}</Label>
              <Input type="date" value={formData.scheduledDate} onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المدة (ساعات)' : 'Duration (hours)'}</Label>
              <Input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 4})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
            <Textarea value={formData.descriptionAr} onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})} rows={3} dir="rtl" />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

