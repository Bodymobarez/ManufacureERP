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
import { Plus, Trash2, QrCode, Barcode, Package, ArrowRight, AlertTriangle } from 'lucide-react';
import { RawMaterial, Warehouse, Batch, TransferOrder, TransferItem, DefectRecord, StockMovement, mockWarehouses, mockRawMaterials } from '@/store/inventoryData';

// ==================== MATERIAL FORM ====================

interface MaterialFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material?: RawMaterial | null;
  onSave: (data: any) => void;
}

export function MaterialForm({ open, onOpenChange, material, onSave }: MaterialFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    code: material?.code || '',
    name: material?.name || '',
    nameAr: material?.nameAr || '',
    type: material?.type || 'fabric',
    category: material?.category || '',
    subcategory: material?.subcategory || '',
    unit: material?.unit || 'meters',
    unitCost: material?.unitCost || 0,
    minStock: material?.minStock || 0,
    maxStock: material?.maxStock || 0,
    reorderPoint: material?.reorderPoint || 0,
    leadTimeDays: material?.leadTimeDays || 7,
    supplierId: material?.supplierId || '',
    supplierName: material?.supplierName || '',
    warehouseId: material?.warehouseId || 'wh-1',
    location: material?.location || '',
    specifications: material?.specifications || '',
  });

  useEffect(() => {
    if (material) {
      setFormData({
        code: material.code,
        name: material.name,
        nameAr: material.nameAr,
        type: material.type,
        category: material.category,
        subcategory: material.subcategory,
        unit: material.unit,
        unitCost: material.unitCost,
        minStock: material.minStock,
        maxStock: material.maxStock,
        reorderPoint: material.reorderPoint,
        leadTimeDays: material.leadTimeDays,
        supplierId: material.supplierId,
        supplierName: material.supplierName,
        warehouseId: material.warehouseId,
        location: material.location,
        specifications: material.specifications || '',
      });
    } else {
      setFormData({
        code: '', name: '', nameAr: '', type: 'fabric', category: '', subcategory: '', unit: 'meters',
        unitCost: 0, minStock: 0, maxStock: 0, reorderPoint: 0, leadTimeDays: 7, supplierId: '', supplierName: '',
        warehouseId: 'wh-1', location: '', specifications: '',
      });
    }
  }, [material, open]);

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{material ? (isRTL ? 'تعديل المادة' : 'Edit Material') : (isRTL ? 'مادة جديدة' : 'New Material')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'كود المادة' : 'Material Code'}</Label>
              <Input value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="FAB-COT-001" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'النوع' : 'Type'}</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fabric">{isRTL ? 'قماش' : 'Fabric'}</SelectItem>
                  <SelectItem value="accessory">{isRTL ? 'إكسسوار' : 'Accessory'}</SelectItem>
                  <SelectItem value="component">{isRTL ? 'مكون' : 'Component'}</SelectItem>
                  <SelectItem value="packaging">{isRTL ? 'تغليف' : 'Packaging'}</SelectItem>
                  <SelectItem value="chemical">{isRTL ? 'كيماوي' : 'Chemical'}</SelectItem>
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
              <Label>{isRTL ? 'الفئة' : 'Category'}</Label>
              <Input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="Cotton, Denim..." />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الفئة الفرعية' : 'Subcategory'}</Label>
              <Input value={formData.subcategory} onChange={(e) => setFormData({...formData, subcategory: e.target.value})} placeholder="Plain Weave..." />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'وحدة القياس' : 'Unit'}</Label>
              <Select value={formData.unit} onValueChange={(v) => setFormData({...formData, unit: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="meters">{isRTL ? 'متر' : 'Meters'}</SelectItem>
                  <SelectItem value="pieces">{isRTL ? 'قطعة' : 'Pieces'}</SelectItem>
                  <SelectItem value="kg">{isRTL ? 'كيلو' : 'Kg'}</SelectItem>
                  <SelectItem value="cones">{isRTL ? 'بكرة' : 'Cones'}</SelectItem>
                  <SelectItem value="rolls">{isRTL ? 'لفة' : 'Rolls'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تكلفة الوحدة ($)' : 'Unit Cost ($)'}</Label>
              <Input type="number" step="0.01" value={formData.unitCost} onChange={(e) => setFormData({...formData, unitCost: parseFloat(e.target.value) || 0})} />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'الحد الأدنى' : 'Min Stock'}</Label>
              <Input type="number" value={formData.minStock} onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الحد الأقصى' : 'Max Stock'}</Label>
              <Input type="number" value={formData.maxStock} onChange={(e) => setFormData({...formData, maxStock: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نقطة إعادة الطلب' : 'Reorder Point'}</Label>
              <Input type="number" value={formData.reorderPoint} onChange={(e) => setFormData({...formData, reorderPoint: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'وقت التوريد (أيام)' : 'Lead Time (Days)'}</Label>
              <Input type="number" value={formData.leadTimeDays} onChange={(e) => setFormData({...formData, leadTimeDays: parseInt(e.target.value) || 0})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المستودع' : 'Warehouse'}</Label>
              <Select value={formData.warehouseId} onValueChange={(v) => setFormData({...formData, warehouseId: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockWarehouses.map(wh => (
                    <SelectItem key={wh.id} value={wh.id}>{isRTL ? wh.nameAr : wh.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الموقع' : 'Location'}</Label>
              <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="A-01-01" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المورد' : 'Supplier'}</Label>
              <Input value={formData.supplierName} onChange={(e) => setFormData({...formData, supplierName: e.target.value})} placeholder="Supplier name" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'المواصفات' : 'Specifications'}</Label>
            <Textarea value={formData.specifications} onChange={(e) => setFormData({...formData, specifications: e.target.value})} rows={3} placeholder="Weight, Width, GSM..." />
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

// ==================== BATCH FORM (Receipt) ====================

interface BatchFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch?: Batch | null;
  onSave: (data: any) => void;
}

export function BatchForm({ open, onOpenChange, batch, onSave }: BatchFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    materialId: batch?.materialId || '',
    quantity: batch?.quantity || 0,
    unitCost: batch?.unitCost || 0,
    supplierId: batch?.supplierId || '',
    supplierName: batch?.supplierName || '',
    supplierBatchNumber: batch?.supplierBatchNumber || '',
    poNumber: batch?.poNumber || '',
    productionDate: batch?.productionDate || '',
    expiryDate: batch?.expiryDate || '',
    warehouseId: batch?.warehouseId || 'wh-1',
    location: batch?.location || '',
    notes: batch?.notes || '',
  });

  const selectedMaterial = mockRawMaterials.find(m => m.id === formData.materialId);
  const totalCost = formData.quantity * formData.unitCost;

  useEffect(() => {
    if (batch) {
      setFormData({
        materialId: batch.materialId, quantity: batch.quantity, unitCost: batch.unitCost,
        supplierId: batch.supplierId, supplierName: batch.supplierName, supplierBatchNumber: batch.supplierBatchNumber || '',
        poNumber: batch.poNumber, productionDate: batch.productionDate || '', expiryDate: batch.expiryDate || '',
        warehouseId: batch.warehouseId, location: batch.location, notes: batch.notes || '',
      });
    } else {
      setFormData({
        materialId: '', quantity: 0, unitCost: 0, supplierId: '', supplierName: '', supplierBatchNumber: '',
        poNumber: '', productionDate: '', expiryDate: '', warehouseId: 'wh-1', location: '', notes: '',
      });
    }
  }, [batch, open]);

  useEffect(() => {
    if (selectedMaterial && !batch) {
      setFormData(prev => ({
        ...prev,
        unitCost: selectedMaterial.unitCost,
        supplierName: selectedMaterial.supplierName,
        warehouseId: selectedMaterial.warehouseId,
        location: selectedMaterial.location,
      }));
    }
  }, [selectedMaterial]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      materialCode: selectedMaterial?.code,
      materialName: selectedMaterial?.name,
      materialNameAr: selectedMaterial?.nameAr,
      unit: selectedMaterial?.unit,
      totalCost,
      warehouseName: mockWarehouses.find(w => w.id === formData.warehouseId)?.name,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{batch ? (isRTL ? 'تعديل الدفعة' : 'Edit Batch') : (isRTL ? 'استلام دفعة جديدة' : 'Receive New Batch')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المادة' : 'Material'}</Label>
              <Select value={formData.materialId} onValueChange={(v) => setFormData({...formData, materialId: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر المادة' : 'Select material'} /></SelectTrigger>
                <SelectContent>
                  {mockRawMaterials.map(mat => (
                    <SelectItem key={mat.id} value={mat.id}>{mat.code} - {isRTL ? mat.nameAr : mat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم أمر الشراء' : 'PO Number'}</Label>
              <Input value={formData.poNumber} onChange={(e) => setFormData({...formData, poNumber: e.target.value})} placeholder="PO-2024-XXX" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الكمية' : 'Quantity'} ({selectedMaterial?.unit || ''})</Label>
              <Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تكلفة الوحدة ($)' : 'Unit Cost ($)'}</Label>
              <Input type="number" step="0.01" value={formData.unitCost} onChange={(e) => setFormData({...formData, unitCost: parseFloat(e.target.value) || 0})} />
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{isRTL ? 'إجمالي التكلفة' : 'Total Cost'}</span>
              <span className="text-2xl font-bold text-primary">${totalCost.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المورد' : 'Supplier'}</Label>
              <Input value={formData.supplierName} onChange={(e) => setFormData({...formData, supplierName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم دفعة المورد' : 'Supplier Batch #'}</Label>
              <Input value={formData.supplierBatchNumber} onChange={(e) => setFormData({...formData, supplierBatchNumber: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الإنتاج' : 'Production Date'}</Label>
              <Input type="date" value={formData.productionDate} onChange={(e) => setFormData({...formData, productionDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الانتهاء' : 'Expiry Date'}</Label>
              <Input type="date" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المستودع' : 'Warehouse'}</Label>
              <Select value={formData.warehouseId} onValueChange={(v) => setFormData({...formData, warehouseId: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockWarehouses.map(wh => (
                    <SelectItem key={wh.id} value={wh.id}>{isRTL ? wh.nameAr : wh.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الموقع' : 'Location'}</Label>
              <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="A-01-01" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'استلام الدفعة' : 'Receive Batch'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== TRANSFER ORDER FORM ====================

interface TransferFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transfer?: TransferOrder | null;
  onSave: (data: any) => void;
}

export function TransferForm({ open, onOpenChange, transfer, onSave }: TransferFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    fromWarehouseId: transfer?.fromWarehouseId || '',
    toWarehouseId: transfer?.toWarehouseId || '',
    priority: transfer?.priority || 'medium',
    expectedDate: transfer?.expectedDate || '',
    notes: transfer?.notes || '',
  });

  const [items, setItems] = useState<Array<{
    id: string;
    materialId: string;
    requestedQty: number;
  }>>(transfer?.items?.map(i => ({ id: i.id, materialId: i.materialId, requestedQty: i.requestedQty })) || []);

  useEffect(() => {
    if (transfer) {
      setFormData({
        fromWarehouseId: transfer.fromWarehouseId, toWarehouseId: transfer.toWarehouseId,
        priority: transfer.priority, expectedDate: transfer.expectedDate, notes: transfer.notes || '',
      });
      setItems(transfer.items.map(i => ({ id: i.id, materialId: i.materialId, requestedQty: i.requestedQty })));
    } else {
      setFormData({ fromWarehouseId: '', toWarehouseId: '', priority: 'medium', expectedDate: '', notes: '' });
      setItems([]);
    }
  }, [transfer, open]);

  const addItem = () => {
    setItems([...items, { id: `ti-${Date.now()}`, materialId: '', requestedQty: 0 }]);
  };

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));
  const updateItem = (id: string, field: string, value: any) => setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));

  const handleSubmit = () => {
    const fromWh = mockWarehouses.find(w => w.id === formData.fromWarehouseId);
    const toWh = mockWarehouses.find(w => w.id === formData.toWarehouseId);
    onSave({
      ...formData,
      fromWarehouseName: fromWh?.name,
      toWarehouseName: toWh?.name,
      items: items.map(i => {
        const mat = mockRawMaterials.find(m => m.id === i.materialId);
        return {
          ...i,
          materialCode: mat?.code,
          materialName: mat?.name,
          unit: mat?.unit,
          transferredQty: 0,
          receivedQty: 0,
          status: 'pending',
        };
      }),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{transfer ? (isRTL ? 'تعديل أمر التحويل' : 'Edit Transfer') : (isRTL ? 'أمر تحويل جديد' : 'New Transfer Order')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>{isRTL ? 'من المستودع' : 'From Warehouse'}</Label>
              <Select value={formData.fromWarehouseId} onValueChange={(v) => setFormData({...formData, fromWarehouseId: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر' : 'Select'} /></SelectTrigger>
                <SelectContent>
                  {mockWarehouses.map(wh => (
                    <SelectItem key={wh.id} value={wh.id}>{isRTL ? wh.nameAr : wh.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'إلى المستودع' : 'To Warehouse'}</Label>
              <Select value={formData.toWarehouseId} onValueChange={(v) => setFormData({...formData, toWarehouseId: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر' : 'Select'} /></SelectTrigger>
                <SelectContent>
                  {mockWarehouses.filter(w => w.id !== formData.fromWarehouseId).map(wh => (
                    <SelectItem key={wh.id} value={wh.id}>{isRTL ? wh.nameAr : wh.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label>{isRTL ? 'التاريخ المتوقع' : 'Expected Date'}</Label>
              <Input type="date" value={formData.expectedDate} onChange={(e) => setFormData({...formData, expectedDate: e.target.value})} />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{isRTL ? 'المواد المطلوبة' : 'Items to Transfer'}</h4>
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1">
                <Plus className="w-4 h-4" />{isRTL ? 'إضافة مادة' : 'Add Item'}
              </Button>
            </div>
            
            <div className="space-y-2">
              {items.map((item) => {
                const mat = mockRawMaterials.find(m => m.id === item.materialId);
                return (
                  <div key={item.id} className="flex gap-2 items-center bg-muted/20 p-3 rounded-lg">
                    <div className="flex-1">
                      <Select value={item.materialId} onValueChange={(v) => updateItem(item.id, 'materialId', v)}>
                        <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر المادة' : 'Select material'} /></SelectTrigger>
                        <SelectContent>
                          {mockRawMaterials.filter(m => m.warehouseId === formData.fromWarehouseId).map(m => (
                            <SelectItem key={m.id} value={m.id}>{m.code} - {isRTL ? m.nameAr : m.name} ({m.availableStock} {m.unit})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-32">
                      <Input type="number" value={item.requestedQty} onChange={(e) => updateItem(item.id, 'requestedQty', parseFloat(e.target.value) || 0)} placeholder={isRTL ? 'الكمية' : 'Qty'} />
                    </div>
                    <span className="text-sm text-muted-foreground w-16">{mat?.unit || ''}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="h-9 w-9 p-0">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                );
              })}
              {items.length === 0 && <p className="text-center text-muted-foreground py-4">{isRTL ? 'أضف مواد للتحويل' : 'Add items to transfer'}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'إنشاء أمر التحويل' : 'Create Transfer'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== DEFECT FORM ====================

interface DefectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defect?: DefectRecord | null;
  onSave: (data: any) => void;
}

export function DefectForm({ open, onOpenChange, defect, onSave }: DefectFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    materialId: defect?.materialId || '',
    batchNumber: defect?.batchNumber || '',
    defectType: defect?.defectType || '',
    severity: defect?.severity || 'minor',
    quantity: defect?.quantity || 0,
    description: defect?.description || '',
    descriptionAr: defect?.descriptionAr || '',
    dispositionAction: defect?.dispositionAction || '',
  });

  const selectedMaterial = mockRawMaterials.find(m => m.id === formData.materialId);

  useEffect(() => {
    if (defect) {
      setFormData({
        materialId: defect.materialId, batchNumber: defect.batchNumber, defectType: defect.defectType,
        severity: defect.severity, quantity: defect.quantity, description: defect.description,
        descriptionAr: defect.descriptionAr, dispositionAction: defect.dispositionAction || '',
      });
    } else {
      setFormData({
        materialId: '', batchNumber: '', defectType: '', severity: 'minor', quantity: 0,
        description: '', descriptionAr: '', dispositionAction: '',
      });
    }
  }, [defect, open]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      materialCode: selectedMaterial?.code,
      materialName: selectedMaterial?.name,
      unit: selectedMaterial?.unit,
      warehouseId: selectedMaterial?.warehouseId,
      warehouseName: selectedMaterial?.warehouseName,
    });
    onOpenChange(false);
  };

  const defectTypes = ['Color Variation', 'Stain', 'Hole', 'Tear', 'Weaving Defect', 'Surface Scratch', 'Broken', 'Missing Parts', 'Other'];
  const severityColors = { minor: 'bg-yellow-100 text-yellow-800', major: 'bg-orange-100 text-orange-800', critical: 'bg-red-100 text-red-800' };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            {defect ? (isRTL ? 'تعديل سجل العيب' : 'Edit Defect Record') : (isRTL ? 'تسجيل عيب جديد' : 'Report New Defect')}
          </DialogTitle>
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
              <Label>{isRTL ? 'نوع العيب' : 'Defect Type'}</Label>
              <Select value={formData.defectType} onValueChange={(v) => setFormData({...formData, defectType: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر' : 'Select'} /></SelectTrigger>
                <SelectContent>
                  {defectTypes.map(type => (
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
              <Label>{isRTL ? 'الكمية المتضررة' : 'Affected Quantity'}</Label>
              <Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الإجراء' : 'Disposition Action'}</Label>
              <Select value={formData.dispositionAction} onValueChange={(v) => setFormData({...formData, dispositionAction: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر' : 'Select'} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="use_as_is">{isRTL ? 'استخدام كما هو' : 'Use As Is'}</SelectItem>
                  <SelectItem value="rework">{isRTL ? 'إعادة تشغيل' : 'Rework'}</SelectItem>
                  <SelectItem value="return_supplier">{isRTL ? 'إرجاع للمورد' : 'Return to Supplier'}</SelectItem>
                  <SelectItem value="scrap">{isRTL ? 'إتلاف' : 'Scrap'}</SelectItem>
                </SelectContent>
              </Select>
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">{isRTL ? 'تسجيل العيب' : 'Report Defect'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== BARCODE SCANNER DIALOG ====================

interface BarcodeScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (code: string, type: 'barcode' | 'qr') => void;
}

export function BarcodeScanner({ open, onOpenChange, onScan }: BarcodeScannerProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [manualCode, setManualCode] = useState('');
  const [scanType, setScanType] = useState<'barcode' | 'qr'>('barcode');

  const handleScan = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim(), scanType);
      setManualCode('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {scanType === 'barcode' ? <Barcode className="w-5 h-5" /> : <QrCode className="w-5 h-5" />}
            {isRTL ? 'مسح الباركود' : 'Scan Barcode/QR'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={scanType} onValueChange={(v) => setScanType(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="barcode" className="gap-2"><Barcode className="w-4 h-4" />{isRTL ? 'باركود' : 'Barcode'}</TabsTrigger>
            <TabsTrigger value="qr" className="gap-2"><QrCode className="w-4 h-4" />{isRTL ? 'QR كود' : 'QR Code'}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="barcode" className="space-y-4 pt-4">
            <div className="bg-muted/30 h-40 rounded-lg flex items-center justify-center border-2 border-dashed">
              <div className="text-center text-muted-foreground">
                <Barcode className="w-12 h-12 mx-auto mb-2" />
                <p>{isRTL ? 'وجه الماسح نحو الباركود' : 'Point scanner at barcode'}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="qr" className="space-y-4 pt-4">
            <div className="bg-muted/30 h-40 rounded-lg flex items-center justify-center border-2 border-dashed">
              <div className="text-center text-muted-foreground">
                <QrCode className="w-12 h-12 mx-auto mb-2" />
                <p>{isRTL ? 'وجه الكاميرا نحو QR كود' : 'Point camera at QR code'}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2 pt-4">
          <Label>{isRTL ? 'أو أدخل الكود يدوياً' : 'Or enter code manually'}</Label>
          <div className="flex gap-2">
            <Input 
              value={manualCode} 
              onChange={(e) => setManualCode(e.target.value)} 
              placeholder={scanType === 'barcode' ? 'Enter barcode...' : 'Enter QR code...'}
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            />
            <Button onClick={handleScan}>{isRTL ? 'بحث' : 'Search'}</Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إغلاق' : 'Close'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== STOCK ISSUE FORM ====================

interface StockIssueFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
}

export function StockIssueForm({ open, onOpenChange, onSave }: StockIssueFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    materialId: '',
    batchId: '',
    quantity: 0,
    referenceType: 'work_order',
    referenceNumber: '',
    reason: '',
  });

  const selectedMaterial = mockRawMaterials.find(m => m.id === formData.materialId);

  const handleSubmit = () => {
    onSave({
      ...formData,
      materialCode: selectedMaterial?.code,
      materialName: selectedMaterial?.name,
      unit: selectedMaterial?.unit,
      warehouseId: selectedMaterial?.warehouseId,
      warehouseName: selectedMaterial?.warehouseName,
    });
    setFormData({ materialId: '', batchId: '', quantity: 0, referenceType: 'work_order', referenceNumber: '', reason: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isRTL ? 'صرف مخزون' : 'Issue Stock'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المادة' : 'Material'}</Label>
              <Select value={formData.materialId} onValueChange={(v) => setFormData({...formData, materialId: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر' : 'Select'} /></SelectTrigger>
                <SelectContent>
                  {mockRawMaterials.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.code} - {isRTL ? m.nameAr : m.name} ({m.availableStock} {m.unit})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الكمية' : 'Quantity'} ({selectedMaterial?.unit || ''})</Label>
              <Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع المرجع' : 'Reference Type'}</Label>
              <Select value={formData.referenceType} onValueChange={(v) => setFormData({...formData, referenceType: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="work_order">{isRTL ? 'أمر عمل' : 'Work Order'}</SelectItem>
                  <SelectItem value="sample">{isRTL ? 'عينة' : 'Sample'}</SelectItem>
                  <SelectItem value="other">{isRTL ? 'أخرى' : 'Other'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم المرجع' : 'Reference Number'}</Label>
              <Input value={formData.referenceNumber} onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})} placeholder="WO-2024-XXX" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'السبب' : 'Reason'}</Label>
            <Textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} rows={2} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'صرف' : 'Issue'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



