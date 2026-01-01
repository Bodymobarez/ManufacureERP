// ==================== FINANCE FORMS ====================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, X } from 'lucide-react';
import { PreCosting, CostingMaterialDetail, CostingLaborDetail, JournalEntry, JournalEntryLine, ChartOfAccount, TaxConfiguration, ActualCosting, InventoryValuation, generateId, mockPreCostings } from '@/store/financeData';
import { mockStyles } from '@/store/plmData';
import { mockRawMaterials, mockWarehouses } from '@/store/inventoryData';
import { mockChartOfAccounts } from '@/store/financeData';
import { mockCostCenters } from '@/store/data';
import type { CostCenter } from '@shared/types';
import { mockProductionOrders } from '@/store/productionData';

// ==================== PRE-COSTING FORM ====================

interface PreCostingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preCosting?: PreCosting | null;
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function PreCostingForm({ open, onOpenChange, preCosting, onSave, isRTL }: PreCostingFormProps) {
  const [formData, setFormData] = useState({
    productId: preCosting?.productId || '',
    costingDate: preCosting?.costingDate || new Date().toISOString().split('T')[0],
    status: preCosting?.status || 'draft' as 'draft' | 'approved' | 'superseded',
    currency: preCosting?.currency || 'USD',
    overheadPercent: preCosting?.overheadPercent || 30,
    targetMarginPercent: preCosting?.targetMarginPercent || 30,
    trimsAndAccessories: preCosting?.trimsAndAccessories || 0,
    packaging: preCosting?.packaging || 0,
    freight: preCosting?.freight || 0,
    customDuty: preCosting?.customDuty || 0,
    otherCosts: preCosting?.otherCosts || 0,
  });

  const [materialDetails, setMaterialDetails] = useState<CostingMaterialDetail[]>(preCosting?.materialDetails || []);
  const [laborDetails, setLaborDetails] = useState<CostingLaborDetail[]>(preCosting?.laborDetails || []);

  useEffect(() => {
    if (preCosting) {
      setFormData({
        productId: preCosting.productId,
        costingDate: preCosting.costingDate,
        status: preCosting.status,
        currency: preCosting.currency,
        overheadPercent: preCosting.overheadPercent,
        targetMarginPercent: preCosting.targetMarginPercent,
        trimsAndAccessories: preCosting.trimsAndAccessories,
        packaging: preCosting.packaging,
        freight: preCosting.freight,
        customDuty: preCosting.customDuty,
        otherCosts: preCosting.otherCosts,
      });
      setMaterialDetails(preCosting.materialDetails || []);
      setLaborDetails(preCosting.laborDetails || []);
    } else {
      setFormData({
        productId: '',
        costingDate: new Date().toISOString().split('T')[0],
        status: 'draft',
        currency: 'USD',
        overheadPercent: 30,
        targetMarginPercent: 30,
        trimsAndAccessories: 0,
        packaging: 0,
        freight: 0,
        customDuty: 0,
        otherCosts: 0,
      });
      setMaterialDetails([]);
      setLaborDetails([]);
    }
  }, [preCosting, open]);

  const addMaterialDetail = () => {
    setMaterialDetails([...materialDetails, {
      materialId: '',
      materialCode: '',
      materialName: '',
      materialNameAr: '',
      quantity: 0,
      unit: 'meter',
      unitCost: 0,
      wastagePercent: 5,
      totalQuantity: 0,
      totalCost: 0,
    }]);
  };

  const removeMaterialDetail = (index: number) => {
    setMaterialDetails(materialDetails.filter((_, i) => i !== index));
  };

  const updateMaterialDetail = (index: number, field: keyof CostingMaterialDetail, value: any) => {
    const updated = [...materialDetails];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitCost' || field === 'wastagePercent') {
      const qty = field === 'quantity' ? value : updated[index].quantity;
      const cost = field === 'unitCost' ? value : updated[index].unitCost;
      const wastage = field === 'wastagePercent' ? value : updated[index].wastagePercent;
      updated[index].totalQuantity = qty * (1 + wastage / 100);
      updated[index].totalCost = updated[index].totalQuantity * cost;
    }
    setMaterialDetails(updated);
  };

  const addLaborDetail = () => {
    setLaborDetails([...laborDetails, {
      operationId: generateId(),
      operationName: '',
      operationNameAr: '',
      smv: 0,
      operatorRate: 12,
      costPerPiece: 0,
      quantity: 1,
      totalCost: 0,
    }]);
  };

  const removeLaborDetail = (index: number) => {
    setLaborDetails(laborDetails.filter((_, i) => i !== index));
  };

  const updateLaborDetail = (index: number, field: keyof CostingLaborDetail, value: any) => {
    const updated = [...laborDetails];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'smv' || field === 'operatorRate') {
      const smv = field === 'smv' ? value : updated[index].smv;
      const rate = field === 'operatorRate' ? value : updated[index].operatorRate;
      updated[index].costPerPiece = (smv / 60) * rate;
      updated[index].totalCost = updated[index].costPerPiece * updated[index].quantity;
    }
    if (field === 'quantity') {
      updated[index].totalCost = updated[index].costPerPiece * value;
    }
    setLaborDetails(updated);
  };

  const handleSubmit = () => {
    const selectedStyle = mockStyles.find(s => s.id === formData.productId);
    if (!selectedStyle) {
      alert(isRTL ? 'يرجى اختيار المنتج' : 'Please select a product');
      return;
    }

    const materialCost = materialDetails.reduce((sum, m) => sum + m.totalCost, 0);
    const laborCost = laborDetails.reduce((sum, l) => sum + l.totalCost, 0);
    const overheadCost = laborCost * (formData.overheadPercent / 100);
    const otherCosts = formData.trimsAndAccessories + formData.packaging + formData.freight + (formData.customDuty || 0) + formData.otherCosts;
    const totalCost = materialCost + laborCost + overheadCost + otherCosts;
    const targetSellingPrice = totalCost * (1 + formData.targetMarginPercent / 100);

    onSave({
      ...formData,
      materialCost,
      materialDetails,
      laborCost,
      laborDetails,
      overheadCost,
      totalCost,
      targetSellingPrice,
      productCode: selectedStyle.styleNumber,
      productName: selectedStyle.name,
      productNameAr: selectedStyle.nameAr,
      version: preCosting?.version || 1,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{preCosting ? (isRTL ? 'تعديل التكلفة المسبقة' : 'Edit Pre-Costing') : (isRTL ? 'تكلفة مسبقة جديدة' : 'New Pre-Costing')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المنتج / الموديل' : 'Product / Style'}</Label>
              <Select value={formData.productId} onValueChange={(v) => setFormData({...formData, productId: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر المنتج...' : 'Select product...'} /></SelectTrigger>
                <SelectContent>
                  {mockStyles.map(style => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.styleNumber} - {isRTL ? style.nameAr : style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ التكلفة' : 'Costing Date'}</Label>
              <Input type="date" value={formData.costingDate} onChange={(e) => setFormData({...formData, costingDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الحالة' : 'Status'}</Label>
              <Select value={formData.status} onValueChange={(v: any) => setFormData({...formData, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{isRTL ? 'مسودة' : 'Draft'}</SelectItem>
                  <SelectItem value="approved">{isRTL ? 'معتمد' : 'Approved'}</SelectItem>
                  <SelectItem value="superseded">{isRTL ? 'مستبدل' : 'Superseded'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'العملة' : 'Currency'}</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EGP">EGP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Material Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg">{isRTL ? 'تفاصيل المواد' : 'Material Details'}</Label>
              <Button type="button" size="sm" onClick={addMaterialDetail}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'إضافة مادة' : 'Add Material'}
              </Button>
            </div>
            {materialDetails.map((detail, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{isRTL ? `مادة ${index + 1}` : `Material ${index + 1}`}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeMaterialDetail(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>{isRTL ? 'المادة' : 'Material'}</Label>
                    <Select 
                      value={detail.materialId} 
                      onValueChange={(v) => {
                        const material = mockRawMaterials.find(m => m.id === v);
                        if (material) {
                          updateMaterialDetail(index, 'materialId', v);
                          updateMaterialDetail(index, 'materialCode', material.code);
                          updateMaterialDetail(index, 'materialName', material.name);
                          updateMaterialDetail(index, 'materialNameAr', material.nameAr);
                          updateMaterialDetail(index, 'unitCost', material.unitCost);
                        }
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر المادة...' : 'Select material...'} /></SelectTrigger>
                      <SelectContent>
                        {mockRawMaterials.map(mat => (
                          <SelectItem key={mat.id} value={mat.id}>
                            {mat.code} - {isRTL ? mat.nameAr : mat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'الكمية' : 'Quantity'}</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={detail.quantity} 
                      onChange={(e) => updateMaterialDetail(index, 'quantity', parseFloat(e.target.value) || 0)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'الوحدة' : 'Unit'}</Label>
                    <Input value={detail.unit} onChange={(e) => updateMaterialDetail(index, 'unit', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'سعر الوحدة' : 'Unit Cost'}</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={detail.unitCost} 
                      onChange={(e) => updateMaterialDetail(index, 'unitCost', parseFloat(e.target.value) || 0)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'نسبة الهالك (%)' : 'Wastage %'}</Label>
                    <Input 
                      type="number" 
                      step="0.1"
                      value={detail.wastagePercent} 
                      onChange={(e) => updateMaterialDetail(index, 'wastagePercent', parseFloat(e.target.value) || 0)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'إجمالي التكلفة' : 'Total Cost'}</Label>
                    <Input value={detail.totalCost.toFixed(2)} disabled />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Labor Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg">{isRTL ? 'تفاصيل العمالة' : 'Labor Details'}</Label>
              <Button type="button" size="sm" onClick={addLaborDetail}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'إضافة عملية' : 'Add Operation'}
              </Button>
            </div>
            {laborDetails.map((detail, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{isRTL ? `عملية ${index + 1}` : `Operation ${index + 1}`}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeLaborDetail(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>{isRTL ? 'اسم العملية (إنجليزي)' : 'Operation Name (English)'}</Label>
                    <Input value={detail.operationName} onChange={(e) => updateLaborDetail(index, 'operationName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'اسم العملية (عربي)' : 'Operation Name (Arabic)'}</Label>
                    <Input value={detail.operationNameAr} onChange={(e) => updateLaborDetail(index, 'operationNameAr', e.target.value)} dir="rtl" />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'SMV (دقيقة)' : 'SMV (Minutes)'}</Label>
                    <Input 
                      type="number" 
                      step="0.1"
                      value={detail.smv} 
                      onChange={(e) => updateLaborDetail(index, 'smv', parseFloat(e.target.value) || 0)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'سعر المشغل/ساعة' : 'Operator Rate/Hour'}</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={detail.operatorRate} 
                      onChange={(e) => updateLaborDetail(index, 'operatorRate', parseFloat(e.target.value) || 0)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'التكلفة/قطعة' : 'Cost/Piece'}</Label>
                    <Input value={detail.costPerPiece.toFixed(2)} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'إجمالي التكلفة' : 'Total Cost'}</Label>
                    <Input value={detail.totalCost.toFixed(2)} disabled />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Overhead and Other Costs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'نسبة النفقات العامة (%)' : 'Overhead %'}</Label>
              <Input 
                type="number" 
                step="0.1"
                value={formData.overheadPercent} 
                onChange={(e) => setFormData({...formData, overheadPercent: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نسبة هامش الربح المستهدف (%)' : 'Target Margin %'}</Label>
              <Input 
                type="number" 
                step="0.1"
                value={formData.targetMarginPercent} 
                onChange={(e) => setFormData({...formData, targetMarginPercent: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الإكسسوارات والزخارف' : 'Trims & Accessories'}</Label>
              <Input 
                type="number" 
                step="0.01"
                value={formData.trimsAndAccessories} 
                onChange={(e) => setFormData({...formData, trimsAndAccessories: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'التغليف' : 'Packaging'}</Label>
              <Input 
                type="number" 
                step="0.01"
                value={formData.packaging} 
                onChange={(e) => setFormData({...formData, packaging: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الشحن' : 'Freight'}</Label>
              <Input 
                type="number" 
                step="0.01"
                value={formData.freight} 
                onChange={(e) => setFormData({...formData, freight: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الرسوم الجمركية' : 'Custom Duty'}</Label>
              <Input 
                type="number" 
                step="0.01"
                value={formData.customDuty || 0} 
                onChange={(e) => setFormData({...formData, customDuty: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تكاليف أخرى' : 'Other Costs'}</Label>
              <Input 
                type="number" 
                step="0.01"
                value={formData.otherCosts} 
                onChange={(e) => setFormData({...formData, otherCosts: parseFloat(e.target.value) || 0})} 
              />
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

// ==================== JOURNAL ENTRY FORM ====================

interface JournalEntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: JournalEntry | null;
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function JournalEntryForm({ open, onOpenChange, entry, onSave, isRTL }: JournalEntryFormProps) {
  const [formData, setFormData] = useState({
    date: entry?.date || new Date().toISOString().split('T')[0],
    description: entry?.description || '',
    descriptionAr: entry?.descriptionAr || '',
    referenceType: entry?.referenceType || 'manual' as 'purchase_order' | 'sales_order' | 'production_order' | 'payment' | 'receipt' | 'adjustment' | 'manual',
    referenceNumber: entry?.referenceNumber || '',
    currency: entry?.currency || 'USD',
  });

  const [lines, setLines] = useState<JournalEntryLine[]>(entry?.lines || [
    { id: generateId(), accountCode: '', accountName: '', accountNameAr: '', debit: 0, credit: 0 },
    { id: generateId(), accountCode: '', accountName: '', accountNameAr: '', debit: 0, credit: 0 },
  ]);

  useEffect(() => {
    if (entry) {
      setFormData({
        date: entry.date,
        description: entry.description,
        descriptionAr: entry.descriptionAr,
        referenceType: entry.referenceType || 'manual',
        referenceNumber: entry.referenceNumber || '',
        currency: entry.currency,
      });
      setLines(entry.lines || []);
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        descriptionAr: '',
        referenceType: 'manual',
        referenceNumber: '',
        currency: 'USD',
      });
      setLines([
        { id: generateId(), accountCode: '', accountName: '', accountNameAr: '', debit: 0, credit: 0 },
        { id: generateId(), accountCode: '', accountName: '', accountNameAr: '', debit: 0, credit: 0 },
      ]);
    }
  }, [entry, open]);

  const addLine = () => {
    setLines([...lines, { id: generateId(), accountCode: '', accountName: '', accountNameAr: '', debit: 0, credit: 0 }]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 2) {
      setLines(lines.filter(l => l.id !== id));
    }
  };

  const updateLine = (id: string, field: keyof JournalEntryLine, value: any) => {
    setLines(lines.map(l => {
      if (l.id === id) {
        if (field === 'accountCode') {
          const account = mockChartOfAccounts.find(a => a.code === value);
          return {
            ...l,
            accountCode: value,
            accountName: account?.name || '',
            accountNameAr: account?.nameAr || '',
          };
        }
        return { ...l, [field]: value };
      }
      return l;
    }));
  };

  const handleSubmit = () => {
    const totalDebit = lines.reduce((sum, l) => sum + (l.debit || 0), 0);
    const totalCredit = lines.reduce((sum, l) => sum + (l.credit || 0), 0);
    
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      alert(isRTL ? 'المدين والدائن غير متوازنين' : 'Debit and Credit are not balanced');
      return;
    }

    onSave({
      ...formData,
      lines,
      totalDebit,
      totalCredit,
      status: entry?.status || 'draft',
    });
    onOpenChange(false);
  };

  const totalDebit = lines.reduce((sum, l) => sum + (l.debit || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (l.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{entry ? (isRTL ? 'تعديل القيد' : 'Edit Journal Entry') : (isRTL ? 'قيد جديد' : 'New Journal Entry')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'التاريخ' : 'Date'}</Label>
              <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع المرجع' : 'Reference Type'}</Label>
              <Select value={formData.referenceType} onValueChange={(v: any) => setFormData({...formData, referenceType: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">{isRTL ? 'يدوي' : 'Manual'}</SelectItem>
                  <SelectItem value="purchase_order">{isRTL ? 'أمر شراء' : 'Purchase Order'}</SelectItem>
                  <SelectItem value="sales_order">{isRTL ? 'أمر بيع' : 'Sales Order'}</SelectItem>
                  <SelectItem value="production_order">{isRTL ? 'أمر إنتاج' : 'Production Order'}</SelectItem>
                  <SelectItem value="payment">{isRTL ? 'دفعة' : 'Payment'}</SelectItem>
                  <SelectItem value="receipt">{isRTL ? 'إيصال' : 'Receipt'}</SelectItem>
                  <SelectItem value="adjustment">{isRTL ? 'تسوية' : 'Adjustment'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
              <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
              <Input value={formData.descriptionAr} onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم المرجع' : 'Reference Number'}</Label>
              <Input value={formData.referenceNumber} onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})} />
            </div>
          </div>

          <Separator />

          {/* Entry Lines */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg">{isRTL ? 'بنود القيد' : 'Entry Lines'}</Label>
              <Button type="button" size="sm" onClick={addLine}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'إضافة بند' : 'Add Line'}
              </Button>
            </div>
            {lines.map((line, index) => (
              <div key={line.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{isRTL ? `بند ${index + 1}` : `Line ${index + 1}`}</span>
                  {lines.length > 2 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeLine(line.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <Label>{isRTL ? 'الحساب' : 'Account'}</Label>
                    <Select value={line.accountCode} onValueChange={(v) => updateLine(line.id, 'accountCode', v)}>
                      <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر الحساب...' : 'Select account...'} /></SelectTrigger>
                      <SelectContent>
                        {mockChartOfAccounts.map(acc => (
                          <SelectItem key={acc.id} value={acc.code}>
                            {acc.code} - {isRTL ? acc.nameAr : acc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'مركز التكلفة (اختياري)' : 'Cost Center (Optional)'}</Label>
                    <Select value={line.costCenterId || ''} onValueChange={(v) => {
                      const cc = mockCostCenters.find(c => c.id === v);
                      updateLine(line.id, 'costCenterId', v);
                      updateLine(line.id, 'costCenterCode', cc?.code || '');
                      updateLine(line.id, 'costCenterName', cc?.name || '');
                    }}>
                      <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر مركز التكلفة...' : 'Select cost center...'} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{isRTL ? 'بدون' : 'None'}</SelectItem>
                        {mockCostCenters.map(cc => (
                          <SelectItem key={cc.id} value={cc.id}>
                            {cc.code} - {isRTL ? cc.nameAr : cc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'مدين' : 'Debit'}</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={line.debit} 
                      onChange={(e) => {
                        updateLine(line.id, 'debit', parseFloat(e.target.value) || 0);
                        updateLine(line.id, 'credit', 0);
                      }} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'دائن' : 'Credit'}</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={line.credit} 
                      onChange={(e) => {
                        updateLine(line.id, 'credit', parseFloat(e.target.value) || 0);
                        updateLine(line.id, 'debit', 0);
                      }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <Label className="text-lg font-medium">{isRTL ? 'إجمالي المدين' : 'Total Debit'}</Label>
              <p className="text-2xl font-bold">{totalDebit.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-lg font-medium">{isRTL ? 'إجمالي الدائن' : 'Total Credit'}</Label>
              <p className="text-2xl font-bold">{totalCredit.toFixed(2)}</p>
            </div>
            <div className="col-span-2">
              {!isBalanced && (
                <p className="text-red-500 text-sm">{isRTL ? 'المدين والدائن غير متوازنين!' : 'Debit and Credit are not balanced!'}</p>
              )}
              {isBalanced && (
                <p className="text-green-500 text-sm">{isRTL ? 'المدين والدائن متوازنان ✓' : 'Debit and Credit are balanced ✓'}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit} disabled={!isBalanced}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== CHART OF ACCOUNT FORM ====================

interface ChartOfAccountFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: ChartOfAccount | null;
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function ChartOfAccountForm({ open, onOpenChange, account, onSave, isRTL }: ChartOfAccountFormProps) {
  const [formData, setFormData] = useState({
    code: account?.code || '',
    name: account?.name || '',
    nameAr: account?.nameAr || '',
    type: account?.type || 'asset' as 'asset' | 'liability' | 'equity' | 'revenue' | 'expense',
    category: account?.category || '',
    parentId: account?.parentId || '',
    isActive: account?.isActive !== undefined ? account.isActive : true,
    currency: account?.currency || 'USD',
    balance: account?.balance || 0,
  });

  useEffect(() => {
    if (account) {
      setFormData({
        code: account.code,
        name: account.name,
        nameAr: account.nameAr,
        type: account.type,
        category: account.category,
        parentId: account.parentId || '',
        isActive: account.isActive,
        currency: account.currency,
        balance: account.balance,
      });
    } else {
      setFormData({
        code: '',
        name: '',
        nameAr: '',
        type: 'asset',
        category: '',
        parentId: '',
        isActive: true,
        currency: 'USD',
        balance: 0,
      });
    }
  }, [account, open]);

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{account ? (isRTL ? 'تعديل الحساب' : 'Edit Account') : (isRTL ? 'حساب جديد' : 'New Account')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'كود الحساب' : 'Account Code'}</Label>
              <Input value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="1000" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع الحساب' : 'Account Type'}</Label>
              <Select value={formData.type} onValueChange={(v: any) => setFormData({...formData, type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="asset">{isRTL ? 'أصل' : 'Asset'}</SelectItem>
                  <SelectItem value="liability">{isRTL ? 'التزام' : 'Liability'}</SelectItem>
                  <SelectItem value="equity">{isRTL ? 'حقوق ملكية' : 'Equity'}</SelectItem>
                  <SelectItem value="revenue">{isRTL ? 'إيرادات' : 'Revenue'}</SelectItem>
                  <SelectItem value="expense">{isRTL ? 'مصروفات' : 'Expense'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم الحساب (إنجليزي)' : 'Account Name (English)'}</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم الحساب (عربي)' : 'Account Name (Arabic)'}</Label>
              <Input value={formData.nameAr} onChange={(e) => setFormData({...formData, nameAr: e.target.value})} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الفئة' : 'Category'}</Label>
              <Input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الحساب الرئيسي (اختياري)' : 'Parent Account (Optional)'}</Label>
              <Select value={formData.parentId} onValueChange={(v) => setFormData({...formData, parentId: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر الحساب الرئيسي...' : 'Select parent account...'} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{isRTL ? 'بدون' : 'None'}</SelectItem>
                  {mockChartOfAccounts.filter(a => a.type === formData.type).map(acc => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.code} - {isRTL ? acc.nameAr : acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'العملة' : 'Currency'}</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EGP">EGP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الرصيد الافتتاحي' : 'Opening Balance'}</Label>
              <Input 
                type="number" 
                step="0.01"
                value={formData.balance} 
                onChange={(e) => setFormData({...formData, balance: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نشط' : 'Active'}</Label>
              <Select value={formData.isActive ? 'true' : 'false'} onValueChange={(v) => setFormData({...formData, isActive: v === 'true'})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">{isRTL ? 'نعم' : 'Yes'}</SelectItem>
                  <SelectItem value="false">{isRTL ? 'لا' : 'No'}</SelectItem>
                </SelectContent>
              </Select>
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

// ==================== TAX CONFIGURATION FORM ====================

interface TaxConfigurationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxConfig?: TaxConfiguration | null;
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function TaxConfigurationForm({ open, onOpenChange, taxConfig, onSave, isRTL }: TaxConfigurationFormProps) {
  const [formData, setFormData] = useState({
    code: taxConfig?.code || '',
    name: taxConfig?.name || '',
    nameAr: taxConfig?.nameAr || '',
    type: taxConfig?.type || 'VAT' as 'VAT' | 'Sales Tax' | 'Income Tax' | 'Custom Duty' | 'Withholding Tax',
    rate: taxConfig?.rate || 0,
    effectiveFrom: taxConfig?.effectiveFrom || new Date().toISOString().split('T')[0],
    effectiveTo: taxConfig?.effectiveTo || '',
    isActive: taxConfig?.isActive !== undefined ? taxConfig.isActive : true,
    appliesTo: taxConfig?.appliesTo || 'both' as 'sales' | 'purchases' | 'both',
    accountCode: taxConfig?.accountCode || '',
  });

  useEffect(() => {
    if (taxConfig) {
      setFormData({
        code: taxConfig.code,
        name: taxConfig.name,
        nameAr: taxConfig.nameAr,
        type: taxConfig.type,
        rate: taxConfig.rate,
        effectiveFrom: taxConfig.effectiveFrom,
        effectiveTo: taxConfig.effectiveTo || '',
        isActive: taxConfig.isActive,
        appliesTo: taxConfig.appliesTo,
        accountCode: taxConfig.accountCode,
      });
    } else {
      setFormData({
        code: '',
        name: '',
        nameAr: '',
        type: 'VAT',
        rate: 0,
        effectiveFrom: new Date().toISOString().split('T')[0],
        effectiveTo: '',
        isActive: true,
        appliesTo: 'both',
        accountCode: '',
      });
    }
  }, [taxConfig, open]);

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{taxConfig ? (isRTL ? 'تعديل الضريبة' : 'Edit Tax Configuration') : (isRTL ? 'ضريبة جديدة' : 'New Tax Configuration')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'كود الضريبة' : 'Tax Code'}</Label>
              <Input value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="VAT-14" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع الضريبة' : 'Tax Type'}</Label>
              <Select value={formData.type} onValueChange={(v: any) => setFormData({...formData, type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="VAT">{isRTL ? 'ضريبة القيمة المضافة' : 'VAT'}</SelectItem>
                  <SelectItem value="Sales Tax">{isRTL ? 'ضريبة المبيعات' : 'Sales Tax'}</SelectItem>
                  <SelectItem value="Income Tax">{isRTL ? 'ضريبة الدخل' : 'Income Tax'}</SelectItem>
                  <SelectItem value="Custom Duty">{isRTL ? 'رسوم جمركية' : 'Custom Duty'}</SelectItem>
                  <SelectItem value="Withholding Tax">{isRTL ? 'ضريبة الاستقطاع' : 'Withholding Tax'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم الضريبة (إنجليزي)' : 'Tax Name (English)'}</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم الضريبة (عربي)' : 'Tax Name (Arabic)'}</Label>
              <Input value={formData.nameAr} onChange={(e) => setFormData({...formData, nameAr: e.target.value})} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المعدل (%)' : 'Rate (%)'}</Label>
              <Input 
                type="number" 
                step="0.01"
                value={formData.rate} 
                onChange={(e) => setFormData({...formData, rate: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'ينطبق على' : 'Applies To'}</Label>
              <Select value={formData.appliesTo} onValueChange={(v: any) => setFormData({...formData, appliesTo: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">{isRTL ? 'المبيعات' : 'Sales'}</SelectItem>
                  <SelectItem value="purchases">{isRTL ? 'المشتريات' : 'Purchases'}</SelectItem>
                  <SelectItem value="both">{isRTL ? 'كلاهما' : 'Both'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ السريان من' : 'Effective From'}</Label>
              <Input type="date" value={formData.effectiveFrom} onChange={(e) => setFormData({...formData, effectiveFrom: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ السريان إلى (اختياري)' : 'Effective To (Optional)'}</Label>
              <Input type="date" value={formData.effectiveTo} onChange={(e) => setFormData({...formData, effectiveTo: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'حساب الضريبة (GL)' : 'Tax Account (GL)'}</Label>
              <Select value={formData.accountCode} onValueChange={(v) => setFormData({...formData, accountCode: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر الحساب...' : 'Select account...'} /></SelectTrigger>
                <SelectContent>
                  {mockChartOfAccounts.filter(a => a.type === 'liability').map(acc => (
                    <SelectItem key={acc.id} value={acc.code}>
                      {acc.code} - {isRTL ? acc.nameAr : acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نشط' : 'Active'}</Label>
              <Select value={formData.isActive ? 'true' : 'false'} onValueChange={(v) => setFormData({...formData, isActive: v === 'true'})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">{isRTL ? 'نعم' : 'Yes'}</SelectItem>
                  <SelectItem value="false">{isRTL ? 'لا' : 'No'}</SelectItem>
                </SelectContent>
              </Select>
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

// ==================== COST CENTER FORM ====================

interface CostCenterFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  costCenter?: CostCenter | null;
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function CostCenterForm({ open, onOpenChange, costCenter, onSave, isRTL }: CostCenterFormProps) {
  const [formData, setFormData] = useState({
    code: costCenter?.code || '',
    name: costCenter?.name || '',
    nameAr: costCenter?.nameAr || '',
    type: costCenter?.type || 'production' as 'production' | 'admin' | 'sales' | 'overhead',
    budget: costCenter?.budget || 0,
  });

  useEffect(() => {
    if (costCenter) {
      setFormData({
        code: costCenter.code,
        name: costCenter.name,
        nameAr: costCenter.nameAr,
        type: costCenter.type,
        budget: costCenter.budget,
      });
    } else {
      setFormData({
        code: '',
        name: '',
        nameAr: '',
        type: 'production',
        budget: 0,
      });
    }
  }, [costCenter, open]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      spent: costCenter?.spent || 0,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{costCenter ? (isRTL ? 'تعديل مركز التكلفة' : 'Edit Cost Center') : (isRTL ? 'مركز تكلفة جديد' : 'New Cost Center')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'كود مركز التكلفة' : 'Cost Center Code'}</Label>
              <Input value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="CC-PROD" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع مركز التكلفة' : 'Type'}</Label>
              <Select value={formData.type} onValueChange={(v: any) => setFormData({...formData, type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">{isRTL ? 'إنتاج' : 'Production'}</SelectItem>
                  <SelectItem value="admin">{isRTL ? 'إدارة' : 'Administration'}</SelectItem>
                  <SelectItem value="sales">{isRTL ? 'مبيعات' : 'Sales'}</SelectItem>
                  <SelectItem value="overhead">{isRTL ? 'نفقات عامة' : 'Overhead'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم مركز التكلفة (إنجليزي)' : 'Cost Center Name (English)'}</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم مركز التكلفة (عربي)' : 'Cost Center Name (Arabic)'}</Label>
              <Input value={formData.nameAr} onChange={(e) => setFormData({...formData, nameAr: e.target.value})} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الميزانية' : 'Budget'}</Label>
              <Input 
                type="number" 
                step="0.01"
                value={formData.budget} 
                onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value) || 0})} 
              />
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

// ==================== INVENTORY VALUATION FORM ====================

interface InventoryValuationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  valuation?: InventoryValuation | null;
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function InventoryValuationForm({ open, onOpenChange, valuation, onSave, isRTL }: InventoryValuationFormProps) {
  const [formData, setFormData] = useState({
    materialId: valuation?.materialId || '',
    warehouseId: valuation?.warehouseId || '',
    valuationMethod: valuation?.valuationMethod || 'FIFO' as 'FIFO' | 'LIFO' | 'Weighted Average' | 'Standard Cost',
    quantity: valuation?.quantity || 0,
    unitCost: valuation?.unitCost || 0,
    currency: valuation?.currency || 'USD',
    valuationDate: valuation?.valuationDate || new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (valuation) {
      setFormData({
        materialId: valuation.materialId,
        warehouseId: valuation.warehouseId,
        valuationMethod: valuation.valuationMethod,
        quantity: valuation.quantity,
        unitCost: valuation.unitCost,
        currency: valuation.currency,
        valuationDate: valuation.valuationDate,
      });
    } else {
      setFormData({
        materialId: '',
        warehouseId: '',
        valuationMethod: 'FIFO',
        quantity: 0,
        unitCost: 0,
        currency: 'USD',
        valuationDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [valuation, open]);

  const handleSubmit = () => {
    const material = mockRawMaterials.find(m => m.id === formData.materialId);
    const warehouse = mockWarehouses.find(w => w.id === formData.warehouseId);
    
    if (!material) {
      alert(isRTL ? 'يرجى اختيار المادة' : 'Please select a material');
      return;
    }
    if (!warehouse) {
      alert(isRTL ? 'يرجى اختيار المستودع' : 'Please select a warehouse');
      return;
    }

    const totalValue = formData.quantity * formData.unitCost;

    onSave({
      ...formData,
      materialCode: material.code,
      materialName: material.name,
      materialNameAr: material.nameAr,
      warehouseName: warehouse.name,
      totalValue,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{valuation ? (isRTL ? 'تعديل تقييم المخزون' : 'Edit Inventory Valuation') : (isRTL ? 'تقييم مخزون جديد' : 'New Inventory Valuation')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المادة' : 'Material'}</Label>
              <Select value={formData.materialId} onValueChange={(v) => {
                const material = mockRawMaterials.find(m => m.id === v);
                if (material) {
                  setFormData({...formData, materialId: v, unitCost: material.unitCost});
                }
              }}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر المادة...' : 'Select material...'} /></SelectTrigger>
                <SelectContent>
                  {mockRawMaterials.map(mat => (
                    <SelectItem key={mat.id} value={mat.id}>
                      {mat.code} - {isRTL ? mat.nameAr : mat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المستودع' : 'Warehouse'}</Label>
              <Select value={formData.warehouseId} onValueChange={(v) => setFormData({...formData, warehouseId: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر المستودع...' : 'Select warehouse...'} /></SelectTrigger>
                <SelectContent>
                  {mockWarehouses.map(wh => (
                    <SelectItem key={wh.id} value={wh.id}>
                      {wh.code} - {isRTL ? wh.nameAr : wh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'طريقة التقييم' : 'Valuation Method'}</Label>
              <Select value={formData.valuationMethod} onValueChange={(v: any) => setFormData({...formData, valuationMethod: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIFO">FIFO</SelectItem>
                  <SelectItem value="LIFO">LIFO</SelectItem>
                  <SelectItem value="Weighted Average">{isRTL ? 'المتوسط المرجح' : 'Weighted Average'}</SelectItem>
                  <SelectItem value="Standard Cost">{isRTL ? 'التكلفة المعيارية' : 'Standard Cost'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ التقييم' : 'Valuation Date'}</Label>
              <Input type="date" value={formData.valuationDate} onChange={(e) => setFormData({...formData, valuationDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الكمية' : 'Quantity'}</Label>
              <Input 
                type="number" 
                step="0.01"
                value={formData.quantity} 
                onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تكلفة الوحدة' : 'Unit Cost'}</Label>
              <Input 
                type="number" 
                step="0.01"
                value={formData.unitCost} 
                onChange={(e) => setFormData({...formData, unitCost: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'العملة' : 'Currency'}</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EGP">EGP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'القيمة الإجمالية' : 'Total Value'}</Label>
              <Input 
                value={(formData.quantity * formData.unitCost).toFixed(2)} 
                disabled 
              />
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

// ==================== ACTUAL COSTING FORM ====================

interface ActualCostingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actualCosting?: ActualCosting | null;
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function ActualCostingForm({ open, onOpenChange, actualCosting, onSave, isRTL }: ActualCostingFormProps) {
  const [formData, setFormData] = useState({
    productionOrderId: actualCosting?.productionOrderId || '',
    preCostingId: actualCosting?.preCostingId || '',
    productionDate: actualCosting?.productionDate || new Date().toISOString().split('T')[0],
    quantityProduced: actualCosting?.quantityProduced || 0,
    currency: actualCosting?.currency || 'USD',
    actualMaterialCost: actualCosting?.actualMaterialCost || 0,
    actualLaborCost: actualCosting?.actualLaborCost || 0,
    actualOverheadCost: actualCosting?.actualOverheadCost || 0,
    actualOtherCosts: actualCosting?.actualOtherCosts || 0,
  });

  useEffect(() => {
    if (actualCosting) {
      setFormData({
        productionOrderId: actualCosting.productionOrderId,
        preCostingId: actualCosting.preCostingId,
        productionDate: actualCosting.productionDate,
        quantityProduced: actualCosting.quantityProduced,
        currency: actualCosting.currency,
        actualMaterialCost: actualCosting.actualMaterialCost,
        actualLaborCost: actualCosting.actualLaborCost,
        actualOverheadCost: actualCosting.actualOverheadCost,
        actualOtherCosts: actualCosting.actualOtherCosts,
      });
    } else {
      setFormData({
        productionOrderId: '',
        preCostingId: '',
        productionDate: new Date().toISOString().split('T')[0],
        quantityProduced: 0,
        currency: 'USD',
        actualMaterialCost: 0,
        actualLaborCost: 0,
        actualOverheadCost: 0,
        actualOtherCosts: 0,
      });
    }
  }, [actualCosting, open]);

  const handleSubmit = () => {
    const po = mockProductionOrders.find(p => p.id === formData.productionOrderId);
    const preCosting = mockPreCostings.find(pc => pc.id === formData.preCostingId);
    
    if (!po) {
      alert(isRTL ? 'يرجى اختيار أمر الإنتاج' : 'Please select a production order');
      return;
    }
    if (!preCosting) {
      alert(isRTL ? 'يرجى اختيار التكلفة المسبقة' : 'Please select a pre-costing');
      return;
    }

    const totalActualCost = formData.actualMaterialCost + formData.actualLaborCost + formData.actualOverheadCost + formData.actualOtherCosts;
    const costPerUnit = formData.quantityProduced > 0 ? totalActualCost / formData.quantityProduced : 0;

    onSave({
      ...formData,
      productionOrderCode: po.orderNumber,
      productId: po.styleId,
      productCode: po.styleNumber,
      productName: po.styleName,
      productNameAr: po.styleName, // ProductionOrder doesn't have styleNameAr, using styleName
      preCostingCode: preCosting.code,
      totalActualCost,
      costPerUnit,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{actualCosting ? (isRTL ? 'تعديل التكلفة الفعلية' : 'Edit Actual Costing') : (isRTL ? 'تكلفة فعلية جديدة' : 'New Actual Costing')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'أمر الإنتاج' : 'Production Order'}</Label>
              <Select value={formData.productionOrderId} onValueChange={(v) => setFormData({...formData, productionOrderId: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر أمر الإنتاج...' : 'Select production order...'} /></SelectTrigger>
                <SelectContent>
                  {mockProductionOrders.map(po => (
                    <SelectItem key={po.id} value={po.id}>
                      {po.orderNumber} - {po.styleName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'التكلفة المسبقة' : 'Pre-Costing'}</Label>
              <Select value={formData.preCostingId} onValueChange={(v) => setFormData({...formData, preCostingId: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر التكلفة المسبقة...' : 'Select pre-costing...'} /></SelectTrigger>
                <SelectContent>
                  {mockPreCostings.map(pc => (
                    <SelectItem key={pc.id} value={pc.id}>
                      {pc.code} - {isRTL ? pc.productNameAr : pc.productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الإنتاج' : 'Production Date'}</Label>
              <Input type="date" value={formData.productionDate} onChange={(e) => setFormData({...formData, productionDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الكمية المنتجة' : 'Quantity Produced'}</Label>
              <Input 
                type="number" 
                step="1"
                value={formData.quantityProduced} 
                onChange={(e) => setFormData({...formData, quantityProduced: parseInt(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تكلفة المواد الفعلية' : 'Actual Material Cost'}</Label>
              <Input 
                type="number" 
                step="0.01"
                value={formData.actualMaterialCost} 
                onChange={(e) => setFormData({...formData, actualMaterialCost: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تكلفة العمالة الفعلية' : 'Actual Labor Cost'}</Label>
              <Input 
                type="number" 
                step="0.01"
                value={formData.actualLaborCost} 
                onChange={(e) => setFormData({...formData, actualLaborCost: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تكلفة النفقات العامة الفعلية' : 'Actual Overhead Cost'}</Label>
              <Input 
                type="number" 
                step="0.01"
                value={formData.actualOverheadCost} 
                onChange={(e) => setFormData({...formData, actualOverheadCost: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'التكاليف الأخرى الفعلية' : 'Actual Other Costs'}</Label>
              <Input 
                type="number" 
                step="0.01"
                value={formData.actualOtherCosts} 
                onChange={(e) => setFormData({...formData, actualOtherCosts: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'العملة' : 'Currency'}</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EGP">EGP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'إجمالي التكلفة الفعلية' : 'Total Actual Cost'}</Label>
              <Input 
                value={(formData.actualMaterialCost + formData.actualLaborCost + formData.actualOverheadCost + formData.actualOtherCosts).toFixed(2)} 
                disabled 
              />
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
