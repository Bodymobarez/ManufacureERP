// ==================== SALES FORMS ====================

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
import { Plus, X, Trash2 } from 'lucide-react';
import type { Buyer, SalesContract, SalesOrder, Shipment as SalesShipment, Invoice, SalesOrderItem, SizeBreakdown } from '@/store/salesData';
import { baseCurrencies } from '@/store/currencyData';
import { mockStyles, mockColorVariants, Style, ColorVariant } from '@/store/plmData';

// ==================== BUYER FORM ====================

interface BuyerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buyer?: Buyer | null;
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function BuyerForm({ open, onOpenChange, buyer, onSave, isRTL }: BuyerFormProps) {
  const [formData, setFormData] = useState({
    code: buyer?.code || '',
    name: buyer?.name || '',
    nameAr: buyer?.nameAr || '',
    companyName: buyer?.companyName || '',
    companyNameAr: buyer?.companyNameAr || '',
    registrationNumber: buyer?.registrationNumber || '',
    taxId: buyer?.taxId || '',
    country: buyer?.country || '',
    currency: buyer?.currency || 'USD',
    contactPerson: buyer?.contactPerson || '',
    email: buyer?.email || '',
    phone: buyer?.phone || '',
    address: buyer?.address || '',
    city: buyer?.city || '',
    postalCode: buyer?.postalCode || '',
    website: buyer?.website || '',
    type: buyer?.type || 'wholesale' as 'wholesale' | 'retail' | 'export',
    status: buyer?.status || 'active' as 'active' | 'inactive' | 'suspended',
    creditLimit: buyer?.creditLimit || 0,
    paymentTerms: buyer?.paymentTerms || 'Net 30',
  });

  useEffect(() => {
    if (buyer) {
      setFormData({
        code: buyer.code,
        name: buyer.name,
        nameAr: buyer.nameAr,
        companyName: buyer.companyName,
        companyNameAr: buyer.companyNameAr,
        registrationNumber: buyer.registrationNumber || '',
        taxId: buyer.taxId || '',
        country: buyer.country,
        currency: buyer.currency,
        contactPerson: buyer.contactPerson,
        email: buyer.email,
        phone: buyer.phone,
        address: buyer.address,
        city: buyer.city,
        postalCode: buyer.postalCode || '',
        website: buyer.website || '',
        type: buyer.type,
        status: buyer.status,
        creditLimit: buyer.creditLimit,
        paymentTerms: buyer.paymentTerms,
      });
    }
  }, [buyer, open]);

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{buyer ? (isRTL ? 'تعديل المشتر' : 'Edit Buyer') : (isRTL ? 'مشتر جديد' : 'New Buyer')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'الكود' : 'Code'}</Label>
              <Input value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'النوع' : 'Type'}</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="wholesale">{isRTL ? 'جملة' : 'Wholesale'}</SelectItem>
                  <SelectItem value="retail">{isRTL ? 'تجزئة' : 'Retail'}</SelectItem>
                  <SelectItem value="export">{isRTL ? 'تصدير' : 'Export'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}</Label>
              <Input value={formData.nameAr} onChange={(e) => setFormData({...formData, nameAr: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم الشركة (إنجليزي)' : 'Company Name (English)'}</Label>
              <Input value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم الشركة (عربي)' : 'Company Name (Arabic)'}</Label>
              <Input value={formData.companyNameAr} onChange={(e) => setFormData({...formData, companyNameAr: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'البلد' : 'Country'}</Label>
              <Input value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'العملة' : 'Currency'}</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {baseCurrencies.map(curr => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {isRTL ? curr.nameAr : curr.name} ({curr.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم جهة الاتصال' : 'Contact Person'}</Label>
              <Input value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الهاتف' : 'Phone'}</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المدينة' : 'City'}</Label>
              <Input value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'العنوان' : 'Address'}</Label>
            <Textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} rows={2} />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'حد الائتمان' : 'Credit Limit'}</Label>
              <Input type="number" value={formData.creditLimit} onChange={(e) => setFormData({...formData, creditLimit: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'شروط الدفع' : 'Payment Terms'}</Label>
              <Input value={formData.paymentTerms} onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})} placeholder="Net 30" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الحالة' : 'Status'}</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{isRTL ? 'نشط' : 'Active'}</SelectItem>
                  <SelectItem value="inactive">{isRTL ? 'غير نشط' : 'Inactive'}</SelectItem>
                  <SelectItem value="suspended">{isRTL ? 'موقوف' : 'Suspended'}</SelectItem>
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

// ==================== SALES ORDER FORM (Simplified) ====================

interface SalesOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: SalesOrder | null;
  buyers: Buyer[];
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function SalesOrderForm({ open, onOpenChange, order, buyers, onSave, isRTL }: SalesOrderFormProps) {
  const [formData, setFormData] = useState({
    buyerId: order?.buyerId || '',
    orderDate: order?.orderDate || new Date().toISOString().split('T')[0],
    requiredDate: order?.requiredDate || '',
    shippingAddress: order?.shippingAddress || '',
    currency: order?.currency || 'USD',
    notes: order?.notes || '',
    items: order?.items || [] as SalesOrderItem[],
    subtotal: order?.subtotal || 0,
    discount: order?.discount || 0,
    tax: order?.tax || 0,
    shippingCost: order?.shippingCost || 0,
    total: order?.total || 0,
    status: order?.status || 'draft',
  });

  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const availableStyles = mockStyles.filter(s => s.status === 'approved' || s.status === 'production');
  const availableColors = selectedStyle ? mockColorVariants.filter(c => c.styleId === selectedStyle) : [];

  useEffect(() => {
    if (order) {
      setFormData({
        buyerId: order.buyerId,
        orderDate: order.orderDate,
        requiredDate: order.requiredDate,
        shippingAddress: order.shippingAddress,
        currency: order.currency,
        notes: order.notes || '',
        items: order.items || [],
        subtotal: order.subtotal,
        discount: order.discount,
        tax: order.tax,
        shippingCost: order.shippingCost,
        total: order.total,
        status: order.status,
      });
    } else {
      setFormData(prev => ({
        ...prev,
        items: [],
        subtotal: 0,
        discount: 0,
        tax: 0,
        shippingCost: 0,
        total: 0,
      }));
    }
    setSelectedStyle('');
    setSelectedColor('');
  }, [order, open]);

  const calculateTotals = (items: SalesOrderItem[], discount: number, tax: number, shippingCost: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * tax) / 100;
    const total = afterDiscount + taxAmount + shippingCost;
    return { subtotal, discountAmount, taxAmount, total };
  };

  const addItem = () => {
    if (!selectedStyle || !selectedColor) return;
    
    const style = availableStyles.find(s => s.id === selectedStyle);
    const color = availableColors.find(c => c.id === selectedColor);
    if (!style || !color) return;

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const sizeBreakdown: SizeBreakdown[] = sizes.map(size => ({ size, quantity: 0 }));
    
    const newItem: SalesOrderItem = {
      id: `item-${Date.now()}`,
      styleId: style.id,
      styleNumber: style.styleNumber,
      styleName: style.name,
      styleNameAr: style.nameAr,
      colorId: color.id,
      colorCode: color.code,
      colorName: color.name,
      colorNameAr: color.nameAr,
      sizeBreakdown,
      quantity: 0,
      unitPrice: style.targetPrice || 0,
      discount: 0,
      total: 0,
      productionStatus: 'not_started',
    };

    const updatedItems = [...formData.items, newItem];
    const totals = calculateTotals(updatedItems, formData.discount, formData.tax, formData.shippingCost);
    
    setFormData({
      ...formData,
      items: updatedItems,
      subtotal: totals.subtotal,
      total: totals.total,
    });
    
    setSelectedStyle('');
    setSelectedColor('');
  };

  const removeItem = (itemId: string) => {
    const updatedItems = formData.items.filter(item => item.id !== itemId);
    const totals = calculateTotals(updatedItems, formData.discount, formData.tax, formData.shippingCost);
    
    setFormData({
      ...formData,
      items: updatedItems,
      subtotal: totals.subtotal,
      total: totals.total,
    });
  };

  const updateItem = (itemId: string, field: string, value: any) => {
    const updatedItems = formData.items.map(item => {
      if (item.id === itemId) {
        if (field === 'sizeBreakdown') {
          const newSizeBreakdown = value as SizeBreakdown[];
          const quantity = newSizeBreakdown.reduce((sum, sb) => sum + sb.quantity, 0);
          const total = (quantity * item.unitPrice) * (1 - item.discount / 100);
          return { ...item, sizeBreakdown: newSizeBreakdown, quantity, total };
        } else if (field === 'unitPrice' || field === 'discount') {
          const newValue = parseFloat(value) || 0;
          const updatedItem = { ...item, [field]: newValue };
          const total = (updatedItem.quantity * updatedItem.unitPrice) * (1 - updatedItem.discount / 100);
          return { ...item, [field]: newValue, total };
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    
    const totals = calculateTotals(updatedItems, formData.discount, formData.tax, formData.shippingCost);
    
    setFormData({
      ...formData,
      items: updatedItems,
      subtotal: totals.subtotal,
      total: totals.total,
    });
  };

  const handleDiscountChange = (value: string) => {
    const discount = parseFloat(value) || 0;
    const totals = calculateTotals(formData.items, discount, formData.tax, formData.shippingCost);
    setFormData({ ...formData, discount, subtotal: totals.subtotal, total: totals.total });
  };

  const handleTaxChange = (value: string) => {
    const tax = parseFloat(value) || 0;
    const totals = calculateTotals(formData.items, formData.discount, tax, formData.shippingCost);
    setFormData({ ...formData, tax, total: totals.total });
  };

  const handleShippingChange = (value: string) => {
    const shippingCost = parseFloat(value) || 0;
    const totals = calculateTotals(formData.items, formData.discount, formData.tax, shippingCost);
    setFormData({ ...formData, shippingCost, total: totals.total });
  };

  const handleSubmit = () => {
    if (!formData.buyerId) {
      alert(isRTL ? 'يرجى اختيار المشتر' : 'Please select a buyer');
      return;
    }
    if (formData.items.length === 0) {
      alert(isRTL ? 'يرجى إضافة عناصر للطلب' : 'Please add items to the order');
      return;
    }
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{order ? (isRTL ? 'تعديل طلب المبيعات' : 'Edit Sales Order') : (isRTL ? 'طلب مبيعات جديد' : 'New Sales Order')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المشتر' : 'Buyer'}</Label>
              <Select value={formData.buyerId} onValueChange={(value) => setFormData({...formData, buyerId: value})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر مشتر...' : 'Select buyer...'} /></SelectTrigger>
                <SelectContent>
                  {buyers.filter(b => b.status === 'active').map(buyer => (
                    <SelectItem key={buyer.id} value={buyer.id}>
                      {isRTL ? buyer.nameAr : buyer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'العملة' : 'Currency'}</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {baseCurrencies.map(curr => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {isRTL ? curr.nameAr : curr.name} ({curr.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الطلب' : 'Order Date'}</Label>
              <Input type="date" value={formData.orderDate} onChange={(e) => setFormData({...formData, orderDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'التاريخ المطلوب' : 'Required Date'}</Label>
              <Input type="date" value={formData.requiredDate} onChange={(e) => setFormData({...formData, requiredDate: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'عنوان الشحن' : 'Shipping Address'}</Label>
            <Textarea value={formData.shippingAddress} onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})} rows={3} />
          </div>

          <Separator />

          {/* Add Item Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">{isRTL ? 'عناصر الطلب' : 'Order Items'}</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4 border border-border rounded-lg bg-muted/30">
              <div className="space-y-2">
                <Label>{isRTL ? 'الستايل' : 'Style'}</Label>
                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر ستايل...' : 'Select style...'} /></SelectTrigger>
                  <SelectContent>
                    {availableStyles.map(style => (
                      <SelectItem key={style.id} value={style.id}>
                        {isRTL ? style.nameAr : style.name} ({style.styleNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{isRTL ? 'اللون' : 'Color'}</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor} disabled={!selectedStyle}>
                  <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر لون...' : 'Select color...'} /></SelectTrigger>
                  <SelectContent>
                    {availableColors.map(color => (
                      <SelectItem key={color.id} value={color.id}>
                        {isRTL ? color.nameAr : color.name} ({color.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Button type="button" onClick={addItem} disabled={!selectedStyle || !selectedColor} className="w-full">
                  <Plus className="w-4 h-4 me-2" />
                  {isRTL ? 'إضافة عنصر' : 'Add Item'}
                </Button>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {formData.items.map((item, idx) => (
                <div key={item.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{item.styleNumber}</Badge>
                        <span className="font-medium">{isRTL ? item.styleNameAr : item.styleName}</span>
                        <Badge variant="secondary">{isRTL ? item.colorNameAr : item.colorName}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">{isRTL ? 'سعر الوحدة' : 'Unit Price'}</Label>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{isRTL ? 'الخصم %' : 'Discount %'}</Label>
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) => updateItem(item.id, 'discount', e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{isRTL ? 'الإجمالي' : 'Total'}</Label>
                          <Input
                            type="number"
                            value={item.total.toFixed(2)}
                            disabled
                            className="h-8"
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <Label className="text-xs mb-1 block">{isRTL ? 'توزيع المقاسات' : 'Size Breakdown'}</Label>
                        <div className="grid grid-cols-5 gap-2">
                          {item.sizeBreakdown.map((sb, sbIdx) => (
                            <div key={sbIdx} className="space-y-1">
                              <Label className="text-xs">{sb.size}</Label>
                              <Input
                                type="number"
                                value={sb.quantity}
                                onChange={(e) => {
                                  const newSizeBreakdown = [...item.sizeBreakdown];
                                  newSizeBreakdown[sbIdx] = { ...sb, quantity: parseInt(e.target.value) || 0 };
                                  updateItem(item.id, 'sizeBreakdown', newSizeBreakdown);
                                }}
                                className="h-8"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {isRTL ? 'الكمية الإجمالية' : 'Total Qty'}: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Pricing Summary */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold">{isRTL ? 'ملخص الأسعار' : 'Pricing Summary'}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{isRTL ? 'الخصم %' : 'Discount %'}</Label>
                <Input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{isRTL ? 'الضريبة %' : 'Tax %'}</Label>
                <Input
                  type="number"
                  value={formData.tax}
                  onChange={(e) => handleTaxChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{isRTL ? 'تكلفة الشحن' : 'Shipping Cost'}</Label>
                <Input
                  type="number"
                  value={formData.shippingCost}
                  onChange={(e) => handleShippingChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{isRTL ? 'الحالة' : 'Status'}</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{isRTL ? 'مسودة' : 'Draft'}</SelectItem>
                    <SelectItem value="confirmed">{isRTL ? 'مؤكد' : 'Confirmed'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="pt-2 border-t space-y-1">
              <div className="flex justify-between text-sm">
                <span>{isRTL ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span className="font-medium">{formData.currency} {formData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{isRTL ? 'الخصم' : 'Discount'}</span>
                <span className="font-medium">-{formData.currency} {((formData.subtotal * formData.discount) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{isRTL ? 'الضريبة' : 'Tax'}</span>
                <span className="font-medium">{formData.currency} {(((formData.subtotal * (1 - formData.discount / 100)) * formData.tax) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{isRTL ? 'الشحن' : 'Shipping'}</span>
                <span className="font-medium">{formData.currency} {formData.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>{isRTL ? 'الإجمالي' : 'Total'}</span>
                <span>{formData.currency} {formData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={3} />
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

// ==================== CONTRACT FORM (Simplified) ====================

interface SalesContractFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract?: SalesContract | null;
  buyers: Buyer[];
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function SalesContractForm({ open, onOpenChange, contract, buyers, onSave, isRTL }: SalesContractFormProps) {
  const [formData, setFormData] = useState({
    buyerId: contract?.buyerId || '',
    contractDate: contract?.contractDate || new Date().toISOString().split('T')[0],
    validFrom: contract?.validFrom || new Date().toISOString().split('T')[0],
    validTo: contract?.validTo || '',
    totalQuantity: contract?.totalQuantity || 0,
    unitPrice: contract?.unitPrice || 0,
    currency: contract?.currency || 'USD',
    incoterms: contract?.incoterms || '',
    paymentTerms: contract?.paymentTerms || 'Net 60',
  });

  useEffect(() => {
    if (contract) {
      setFormData({
        buyerId: contract.buyerId,
        contractDate: contract.contractDate,
        validFrom: contract.validFrom,
        validTo: contract.validTo,
        totalQuantity: contract.totalQuantity,
        unitPrice: contract.unitPrice,
        currency: contract.currency,
        incoterms: contract.incoterms,
        paymentTerms: contract.paymentTerms,
      });
    }
  }, [contract, open]);

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{contract ? (isRTL ? 'تعديل العقد' : 'Edit Contract') : (isRTL ? 'عقد جديد' : 'New Contract')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المشتر' : 'Buyer'}</Label>
              <Select value={formData.buyerId} onValueChange={(value) => setFormData({...formData, buyerId: value})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر مشتر...' : 'Select buyer...'} /></SelectTrigger>
                <SelectContent>
                  {buyers.filter(b => b.status === 'active').map(buyer => (
                    <SelectItem key={buyer.id} value={buyer.id}>
                      {isRTL ? buyer.nameAr : buyer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ العقد' : 'Contract Date'}</Label>
              <Input type="date" value={formData.contractDate} onChange={(e) => setFormData({...formData, contractDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'صالح من' : 'Valid From'}</Label>
              <Input type="date" value={formData.validFrom} onChange={(e) => setFormData({...formData, validFrom: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'صالح حتى' : 'Valid To'}</Label>
              <Input type="date" value={formData.validTo} onChange={(e) => setFormData({...formData, validTo: e.target.value})} />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'الكمية الإجمالية' : 'Total Quantity'}</Label>
              <Input type="number" value={formData.totalQuantity} onChange={(e) => setFormData({...formData, totalQuantity: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'سعر الوحدة' : 'Unit Price'}</Label>
              <Input type="number" step="0.01" value={formData.unitPrice} onChange={(e) => setFormData({...formData, unitPrice: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'العملة' : 'Currency'}</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {baseCurrencies.map(curr => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {isRTL ? curr.nameAr : curr.name} ({curr.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'شروط التجارة الدولية' : 'Incoterms'}</Label>
              <Input value={formData.incoterms} onChange={(e) => setFormData({...formData, incoterms: e.target.value})} placeholder="FOB, CIF, etc." />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'شروط الدفع' : 'Payment Terms'}</Label>
              <Input value={formData.paymentTerms} onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})} placeholder="Net 60" />
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

// ==================== SHIPMENT FORM (Simplified) ====================

interface ShipmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment?: SalesShipment | null;
  buyers: Buyer[];
  salesOrders: SalesOrder[];
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function ShipmentForm({ open, onOpenChange, shipment, buyers, salesOrders, onSave, isRTL }: ShipmentFormProps) {
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>(shipment?.salesOrderIds || []);
  const [formData, setFormData] = useState({
    buyerId: shipment?.buyerId || '',
    type: shipment?.type || 'sea' as 'sea' | 'air' | 'road' | 'rail',
    origin: shipment?.origin || '',
    destination: shipment?.destination || '',
    etd: shipment?.etd || '',
    eta: shipment?.eta || '',
    trackingNumber: shipment?.trackingNumber || '',
  });

  useEffect(() => {
    if (shipment) {
      setSelectedOrderIds(shipment.salesOrderIds);
      setFormData({
        buyerId: shipment.buyerId,
        type: shipment.type,
        origin: shipment.origin,
        destination: shipment.destination,
        etd: shipment.etd,
        eta: shipment.eta,
        trackingNumber: shipment.trackingNumber || '',
      });
    }
  }, [shipment, open]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      salesOrderIds: selectedOrderIds,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{shipment ? (isRTL ? 'تعديل الشحنة' : 'Edit Shipment') : (isRTL ? 'شحنة جديدة' : 'New Shipment')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المشتر' : 'Buyer'}</Label>
              <Select value={formData.buyerId} onValueChange={(value) => setFormData({...formData, buyerId: value})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر مشتر...' : 'Select buyer...'} /></SelectTrigger>
                <SelectContent>
                  {buyers.filter(b => b.status === 'active').map(buyer => (
                    <SelectItem key={buyer.id} value={buyer.id}>
                      {isRTL ? buyer.nameAr : buyer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'النوع' : 'Type'}</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sea">{isRTL ? 'بحري' : 'Sea'}</SelectItem>
                  <SelectItem value="air">{isRTL ? 'جوي' : 'Air'}</SelectItem>
                  <SelectItem value="road">{isRTL ? 'برّي' : 'Road'}</SelectItem>
                  <SelectItem value="rail">{isRTL ? 'سكك حديدية' : 'Rail'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المنشأ' : 'Origin'}</Label>
              <Input value={formData.origin} onChange={(e) => setFormData({...formData, origin: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الوجهة' : 'Destination'}</Label>
              <Input value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الشحن المتوقع' : 'ETD (Estimated Time of Departure)'}</Label>
              <Input type="date" value={formData.etd} onChange={(e) => setFormData({...formData, etd: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الوصول المتوقع' : 'ETA (Estimated Time of Arrival)'}</Label>
              <Input type="date" value={formData.eta} onChange={(e) => setFormData({...formData, eta: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم التتبع' : 'Tracking Number'}</Label>
              <Input value={formData.trackingNumber} onChange={(e) => setFormData({...formData, trackingNumber: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'طلبات المبيعات' : 'Sales Orders'}</Label>
            <Select value="" onValueChange={(value) => {
              if (value && !selectedOrderIds.includes(value)) {
                setSelectedOrderIds([...selectedOrderIds, value]);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? 'اختر طلب...' : 'Select order...'} />
              </SelectTrigger>
              <SelectContent>
                {salesOrders.filter(so => !selectedOrderIds.includes(so.id)).map(order => (
                  <SelectItem key={order.id} value={order.id}>
                    {order.orderNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 flex-wrap mt-2">
              {selectedOrderIds.map(orderId => {
                const order = salesOrders.find(o => o.id === orderId);
                return order ? (
                  <Badge key={orderId} variant="secondary" className="gap-1">
                    {order.orderNumber}
                    <button type="button" onClick={() => setSelectedOrderIds(selectedOrderIds.filter(id => id !== orderId))} className="ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
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



