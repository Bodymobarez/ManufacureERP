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
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, AlertTriangle, Clock, User, Package } from 'lucide-react';
import {
  ProductionOrder, WorkOrder, ProductionDefect, ReworkOrder, ProductionLine,
  ProductionStage, stageConfigs, mockProductionLines, mockProductionOrders,
  getStageName, getStageConfig
} from '@/store/productionData';

// ==================== PRODUCTION ORDER FORM ====================

interface ProductionOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: ProductionOrder | null;
  onSave: (data: any) => void;
}

export function ProductionOrderForm({ open, onOpenChange, order, onSave }: ProductionOrderFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    customerName: order?.customerName || '',
    customerNameAr: order?.customerNameAr || '',
    styleNumber: order?.styleNumber || '',
    styleName: order?.styleName || '',
    orderQuantity: order?.orderQuantity || 0,
    priority: order?.priority || 'medium',
    plannedStartDate: order?.plannedStartDate || '',
    plannedEndDate: order?.plannedEndDate || '',
    deliveryDate: order?.deliveryDate || '',
    salesOrderRef: order?.salesOrderRef || '',
    notes: order?.notes || '',
  });

  const [colorVariants, setColorVariants] = useState<Array<{
    id: string;
    colorName: string;
    colorNameAr: string;
    hexCode: string;
    quantity: number;
  }>>(order?.colorVariants?.map(c => ({
    id: c.colorId, colorName: c.colorName, colorNameAr: c.colorNameAr, hexCode: c.hexCode, quantity: c.quantity
  })) || []);

  useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customerName, customerNameAr: order.customerNameAr,
        styleNumber: order.styleNumber, styleName: order.styleName,
        orderQuantity: order.orderQuantity, priority: order.priority,
        plannedStartDate: order.plannedStartDate, plannedEndDate: order.plannedEndDate,
        deliveryDate: order.deliveryDate, salesOrderRef: order.salesOrderRef,
        notes: order.notes || '',
      });
      setColorVariants(order.colorVariants?.map(c => ({
        id: c.colorId, colorName: c.colorName, colorNameAr: c.colorNameAr, hexCode: c.hexCode, quantity: c.quantity
      })) || []);
    } else {
      setFormData({
        customerName: '', customerNameAr: '', styleNumber: '', styleName: '',
        orderQuantity: 0, priority: 'medium', plannedStartDate: '', plannedEndDate: '',
        deliveryDate: '', salesOrderRef: '', notes: '',
      });
      setColorVariants([]);
    }
  }, [order, open]);

  const addColorVariant = () => {
    setColorVariants([...colorVariants, { id: `c-${Date.now()}`, colorName: '', colorNameAr: '', hexCode: '#000000', quantity: 0 }]);
  };

  const removeColorVariant = (id: string) => setColorVariants(colorVariants.filter(c => c.id !== id));
  const updateColorVariant = (id: string, field: string, value: any) => setColorVariants(colorVariants.map(c => c.id === id ? { ...c, [field]: value } : c));

  const handleSubmit = () => {
    const totalQty = colorVariants.reduce((sum, c) => sum + c.quantity, 0);
    onSave({
      ...formData,
      orderQuantity: totalQty || formData.orderQuantity,
      colorVariants: colorVariants.map(c => ({
        colorId: c.id, colorName: c.colorName, colorNameAr: c.colorNameAr,
        hexCode: c.hexCode, quantity: c.quantity, completedQty: 0, sizes: []
      })),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{order ? (isRTL ? 'تعديل أمر الإنتاج' : 'Edit Production Order') : (isRTL ? 'أمر إنتاج جديد' : 'New Production Order')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'العميل (إنجليزي)' : 'Customer (English)'}</Label>
              <Input value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'العميل (عربي)' : 'Customer (Arabic)'}</Label>
              <Input value={formData.customerNameAr} onChange={(e) => setFormData({...formData, customerNameAr: e.target.value})} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم الموديل' : 'Style Number'}</Label>
              <Input value={formData.styleNumber} onChange={(e) => setFormData({...formData, styleNumber: e.target.value})} placeholder="STY-2024-XXX" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم الموديل' : 'Style Name'}</Label>
              <Input value={formData.styleName} onChange={(e) => setFormData({...formData, styleName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'مرجع أمر البيع' : 'Sales Order Ref'}</Label>
              <Input value={formData.salesOrderRef} onChange={(e) => setFormData({...formData, salesOrderRef: e.target.value})} placeholder="SO-2024-XXX" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الأولوية' : 'Priority'}</Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{isRTL ? 'منخفضة' : 'Low'}</SelectItem>
                  <SelectItem value="medium">{isRTL ? 'متوسطة' : 'Medium'}</SelectItem>
                  <SelectItem value="high">{isRTL ? 'عالية' : 'High'}</SelectItem>
                  <SelectItem value="urgent">{isRTL ? 'عاجل' : 'Urgent'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ البدء المخطط' : 'Planned Start'}</Label>
              <Input type="date" value={formData.plannedStartDate} onChange={(e) => setFormData({...formData, plannedStartDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الانتهاء المخطط' : 'Planned End'}</Label>
              <Input type="date" value={formData.plannedEndDate} onChange={(e) => setFormData({...formData, plannedEndDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ التسليم' : 'Delivery Date'}</Label>
              <Input type="date" value={formData.deliveryDate} onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})} />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{isRTL ? 'الألوان والكميات' : 'Colors & Quantities'}</h4>
              <Button type="button" variant="outline" size="sm" onClick={addColorVariant} className="gap-1">
                <Plus className="w-4 h-4" />{isRTL ? 'إضافة لون' : 'Add Color'}
              </Button>
            </div>
            
            <div className="space-y-2">
              {colorVariants.map((color) => (
                <div key={color.id} className="flex gap-2 items-center bg-muted/20 p-3 rounded-lg">
                  <input type="color" value={color.hexCode} onChange={(e) => updateColorVariant(color.id, 'hexCode', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                  <div className="flex-1">
                    <Input value={color.colorName} onChange={(e) => updateColorVariant(color.id, 'colorName', e.target.value)} placeholder={isRTL ? 'اسم اللون (إنجليزي)' : 'Color name (English)'} />
                  </div>
                  <div className="flex-1">
                    <Input value={color.colorNameAr} onChange={(e) => updateColorVariant(color.id, 'colorNameAr', e.target.value)} placeholder={isRTL ? 'اسم اللون (عربي)' : 'Color name (Arabic)'} dir="rtl" />
                  </div>
                  <div className="w-32">
                    <Input type="number" value={color.quantity} onChange={(e) => updateColorVariant(color.id, 'quantity', parseInt(e.target.value) || 0)} placeholder={isRTL ? 'الكمية' : 'Qty'} />
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeColorVariant(color.id)} className="h-9 w-9 p-0">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {colorVariants.length === 0 && <p className="text-center text-muted-foreground py-4">{isRTL ? 'أضف ألوان للأمر' : 'Add colors to the order'}</p>}
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{isRTL ? 'إجمالي الكمية' : 'Total Quantity'}</span>
                <span className="text-2xl font-bold text-primary">{colorVariants.reduce((sum, c) => sum + c.quantity, 0).toLocaleString()} {isRTL ? 'قطعة' : 'pcs'}</span>
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

// ==================== WORK ORDER FORM ====================

interface WorkOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrder?: WorkOrder | null;
  productionOrderId?: string;
  onSave: (data: any) => void;
}

export function WorkOrderForm({ open, onOpenChange, workOrder, productionOrderId, onSave }: WorkOrderFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    productionOrderId: workOrder?.productionOrderId || productionOrderId || '',
    stage: workOrder?.stage || 'cutting',
    lineId: workOrder?.lineId || '',
    targetQuantity: workOrder?.targetQuantity || 0,
    priority: workOrder?.priority || 'medium',
    plannedStartTime: workOrder?.plannedStartTime?.split('T')[0] || '',
    plannedEndTime: workOrder?.plannedEndTime?.split('T')[0] || '',
    estimatedDuration: workOrder?.estimatedDuration || 0,
    instructions: workOrder?.instructions || '',
    instructionsAr: workOrder?.instructionsAr || '',
  });

  const [assignedOperators, setAssignedOperators] = useState<string[]>(workOrder?.assignedOperators || []);

  const selectedPO = mockProductionOrders.find(p => p.id === formData.productionOrderId);
  const filteredLines = mockProductionLines.filter(l => {
    if (formData.stage === 'cutting') return l.type === 'cutting' || l.type === 'multi';
    if (formData.stage === 'sewing') return l.type === 'sewing' || l.type === 'multi';
    if (formData.stage === 'finishing' || formData.stage === 'pressing') return l.type === 'finishing' || l.type === 'multi';
    if (formData.stage === 'packing') return l.type === 'packing' || l.type === 'multi';
    return true;
  });

  useEffect(() => {
    if (workOrder) {
      setFormData({
        productionOrderId: workOrder.productionOrderId, stage: workOrder.stage,
        lineId: workOrder.lineId, targetQuantity: workOrder.targetQuantity,
        priority: workOrder.priority, plannedStartTime: workOrder.plannedStartTime?.split('T')[0] || '',
        plannedEndTime: workOrder.plannedEndTime?.split('T')[0] || '',
        estimatedDuration: workOrder.estimatedDuration, instructions: workOrder.instructions || '',
        instructionsAr: workOrder.instructionsAr || '',
      });
      setAssignedOperators(workOrder.assignedOperators);
    }
  }, [workOrder, open]);

  const handleSubmit = () => {
    const line = mockProductionLines.find(l => l.id === formData.lineId);
    onSave({
      ...formData,
      lineName: line?.name,
      productionOrderNumber: selectedPO?.orderNumber,
      styleNumber: selectedPO?.styleNumber,
      styleName: selectedPO?.styleName,
      stageOrder: getStageConfig(formData.stage as ProductionStage)?.order,
      assignedOperators,
      assignedOperatorNames: [], // Would come from employee data
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{workOrder ? (isRTL ? 'تعديل أمر العمل' : 'Edit Work Order') : (isRTL ? 'أمر عمل جديد' : 'New Work Order')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'أمر الإنتاج' : 'Production Order'}</Label>
              <Select value={formData.productionOrderId} onValueChange={(v) => setFormData({...formData, productionOrderId: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر' : 'Select'} /></SelectTrigger>
                <SelectContent>
                  {mockProductionOrders.map(po => (
                    <SelectItem key={po.id} value={po.id}>{po.orderNumber} - {po.styleName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المرحلة' : 'Stage'}</Label>
              <Select value={formData.stage} onValueChange={(v) => setFormData({...formData, stage: v as ProductionStage, lineId: ''})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {stageConfigs.filter(s => s.isActive).map(stage => (
                    <SelectItem key={stage.id} value={stage.stage}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }}></div>
                        {isRTL ? stage.nameAr : stage.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'خط الإنتاج' : 'Production Line'}</Label>
              <Select value={formData.lineId} onValueChange={(v) => setFormData({...formData, lineId: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر' : 'Select'} /></SelectTrigger>
                <SelectContent>
                  {filteredLines.map(line => (
                    <SelectItem key={line.id} value={line.id}>
                      {isRTL ? line.nameAr : line.name} ({line.currentLoad}/{line.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الكمية المستهدفة' : 'Target Quantity'}</Label>
              <Input type="number" value={formData.targetQuantity} onChange={(e) => setFormData({...formData, targetQuantity: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الأولوية' : 'Priority'}</Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{isRTL ? 'منخفضة' : 'Low'}</SelectItem>
                  <SelectItem value="medium">{isRTL ? 'متوسطة' : 'Medium'}</SelectItem>
                  <SelectItem value="high">{isRTL ? 'عالية' : 'High'}</SelectItem>
                  <SelectItem value="urgent">{isRTL ? 'عاجل' : 'Urgent'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الوقت المقدر (دقيقة)' : 'Estimated Time (mins)'}</Label>
              <Input type="number" value={formData.estimatedDuration} onChange={(e) => setFormData({...formData, estimatedDuration: parseInt(e.target.value) || 0})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ البدء المخطط' : 'Planned Start'}</Label>
              <Input type="date" value={formData.plannedStartTime} onChange={(e) => setFormData({...formData, plannedStartTime: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الانتهاء المخطط' : 'Planned End'}</Label>
              <Input type="date" value={formData.plannedEndTime} onChange={(e) => setFormData({...formData, plannedEndTime: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'التعليمات (إنجليزي)' : 'Instructions (English)'}</Label>
            <Textarea value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'التعليمات (عربي)' : 'Instructions (Arabic)'}</Label>
            <Textarea value={formData.instructionsAr} onChange={(e) => setFormData({...formData, instructionsAr: e.target.value})} rows={2} dir="rtl" />
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

// ==================== DEFECT REPORT FORM ====================

interface DefectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defect?: ProductionDefect | null;
  workOrderId?: string;
  onSave: (data: any) => void;
}

export function ProductionDefectForm({ open, onOpenChange, defect, workOrderId, onSave }: DefectFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const defectTypes = {
    cutting: ['Cut Error', 'Size Deviation', 'Fabric Damage', 'Pattern Mismatch'],
    sewing: ['Broken Stitch', 'Skip Stitch', 'Puckering', 'Wrong Thread Color', 'Uneven Seam'],
    finishing: ['Missing Button', 'Loose Thread', 'Label Error', 'Stain'],
    pressing: ['Burn Mark', 'Shine Mark', 'Wrinkle'],
    packing: ['Wrong Label', 'Damaged Package', 'Missing Tag'],
    quality_check: ['Measurement Error', 'Color Difference', 'Overall Defect'],
    washing: ['Color Bleeding', 'Shrinkage', 'Damage'],
  };

  const [formData, setFormData] = useState({
    workOrderId: defect?.workOrderId || workOrderId || '',
    stage: defect?.stage || 'sewing',
    defectType: defect?.defectType || '',
    defectCode: defect?.defectCode || '',
    severity: defect?.severity || 'minor',
    quantity: defect?.quantity || 1,
    description: defect?.description || '',
    descriptionAr: defect?.descriptionAr || '',
    rootCause: defect?.rootCause || '',
    reworkRequired: defect?.reworkRequired ?? true,
    reworkInstructions: defect?.reworkInstructions || '',
  });

  useEffect(() => {
    if (defect) {
      setFormData({
        workOrderId: defect.workOrderId, stage: defect.stage, defectType: defect.defectType,
        defectCode: defect.defectCode, severity: defect.severity, quantity: defect.quantity,
        description: defect.description, descriptionAr: defect.descriptionAr,
        rootCause: defect.rootCause || '', reworkRequired: defect.reworkRequired,
        reworkInstructions: defect.reworkInstructions || '',
      });
    }
  }, [defect, open]);

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const currentDefectTypes = defectTypes[formData.stage as keyof typeof defectTypes] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            {defect ? (isRTL ? 'تعديل سجل العيب' : 'Edit Defect') : (isRTL ? 'تسجيل عيب إنتاج' : 'Report Production Defect')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المرحلة' : 'Stage'}</Label>
              <Select value={formData.stage} onValueChange={(v) => setFormData({...formData, stage: v as ProductionStage, defectType: ''})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {stageConfigs.map(s => (
                    <SelectItem key={s.id} value={s.stage}>{isRTL ? s.nameAr : s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع العيب' : 'Defect Type'}</Label>
              <Select value={formData.defectType} onValueChange={(v) => setFormData({...formData, defectType: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر' : 'Select'} /></SelectTrigger>
                <SelectContent>
                  {currentDefectTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
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
              <Label>{isRTL ? 'الكمية المتضررة' : 'Affected Qty'}</Label>
              <Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
            <Textarea value={formData.descriptionAr} onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})} rows={2} dir="rtl" />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'السبب الجذري' : 'Root Cause'}</Label>
            <Input value={formData.rootCause} onChange={(e) => setFormData({...formData, rootCause: e.target.value})} />
          </div>

          <Separator />

          <div className="flex items-center gap-4">
            <Label>{isRTL ? 'يحتاج إعادة تشغيل؟' : 'Rework Required?'}</Label>
            <div className="flex gap-2">
              <Button type="button" variant={formData.reworkRequired ? 'default' : 'outline'} size="sm" onClick={() => setFormData({...formData, reworkRequired: true})}>
                {isRTL ? 'نعم' : 'Yes'}
              </Button>
              <Button type="button" variant={!formData.reworkRequired ? 'default' : 'outline'} size="sm" onClick={() => setFormData({...formData, reworkRequired: false})}>
                {isRTL ? 'لا' : 'No'}
              </Button>
            </div>
          </div>

          {formData.reworkRequired && (
            <div className="space-y-2">
              <Label>{isRTL ? 'تعليمات إعادة التشغيل' : 'Rework Instructions'}</Label>
              <Textarea value={formData.reworkInstructions} onChange={(e) => setFormData({...formData, reworkInstructions: e.target.value})} rows={2} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">{isRTL ? 'تسجيل العيب' : 'Report Defect'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== PROGRESS UPDATE FORM ====================

interface ProgressFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrderId?: string;
  onSave: (data: any) => void;
}

export function ProgressUpdateForm({ open, onOpenChange, workOrderId, onSave }: ProgressFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    workOrderId: workOrderId || '',
    quantity: 0,
    notes: '',
  });

  const handleSubmit = () => {
    onSave(formData);
    setFormData({ workOrderId: workOrderId || '', quantity: 0, notes: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isRTL ? 'تحديث التقدم' : 'Update Progress'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{isRTL ? 'الكمية المنجزة' : 'Completed Quantity'}</Label>
            <Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'تحديث' : 'Update'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== LINE CONFIGURATION FORM ====================

interface LineConfigFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  line?: ProductionLine | null;
  onSave: (data: any) => void;
}

export function LineConfigForm({ open, onOpenChange, line, onSave }: LineConfigFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    code: line?.code || '',
    name: line?.name || '',
    nameAr: line?.nameAr || '',
    type: line?.type || 'sewing',
    capacity: line?.capacity || 0,
    maxOperators: line?.maxOperators || 0,
    location: line?.location || '',
    supervisorName: line?.supervisorName || '',
  });

  useEffect(() => {
    if (line) {
      setFormData({
        code: line.code, name: line.name, nameAr: line.nameAr,
        type: line.type, capacity: line.capacity, maxOperators: line.maxOperators,
        location: line.location, supervisorName: line.supervisorName,
      });
    }
  }, [line, open]);

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{line ? (isRTL ? 'تعديل خط الإنتاج' : 'Edit Line') : (isRTL ? 'خط إنتاج جديد' : 'New Production Line')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'الكود' : 'Code'}</Label>
              <Input value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="SEW-01" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'النوع' : 'Type'}</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cutting">{isRTL ? 'قص' : 'Cutting'}</SelectItem>
                  <SelectItem value="sewing">{isRTL ? 'خياطة' : 'Sewing'}</SelectItem>
                  <SelectItem value="finishing">{isRTL ? 'تشطيب' : 'Finishing'}</SelectItem>
                  <SelectItem value="packing">{isRTL ? 'تعبئة' : 'Packing'}</SelectItem>
                  <SelectItem value="multi">{isRTL ? 'متعدد' : 'Multi'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}</Label>
              <Input value={formData.nameAr} onChange={(e) => setFormData({...formData, nameAr: e.target.value})} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'السعة اليومية' : 'Daily Capacity'}</Label>
              <Input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'أقصى عدد عمال' : 'Max Operators'}</Label>
              <Input type="number" value={formData.maxOperators} onChange={(e) => setFormData({...formData, maxOperators: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الموقع' : 'Location'}</Label>
              <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المشرف' : 'Supervisor'}</Label>
              <Input value={formData.supervisorName} onChange={(e) => setFormData({...formData, supervisorName: e.target.value})} />
            </div>
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



