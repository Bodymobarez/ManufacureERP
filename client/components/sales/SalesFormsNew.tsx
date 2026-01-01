// ==================== NEW SALES FORMS ====================

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Buyer, SalesOrder, Invoice } from '@/store/salesData';
import { baseCurrencies } from '@/store/currencyData';

// ==================== QUOTATION FORM ====================

interface QuotationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotation?: any;
  buyers: Buyer[];
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function QuotationForm({ open, onOpenChange, quotation, buyers, onSave, isRTL }: QuotationFormProps) {
  const [formData, setFormData] = useState({
    buyerId: quotation?.buyerId || '',
    quotationDate: quotation?.quotationDate || new Date().toISOString().split('T')[0],
    validUntil: quotation?.validUntil || '',
    currency: quotation?.currency || 'USD',
    paymentTerms: quotation?.paymentTerms || 'Net 60',
    deliveryTerms: quotation?.deliveryTerms || '',
    incoterms: quotation?.incoterms || '',
    notes: quotation?.notes || '',
  });

  useEffect(() => {
    if (quotation) {
      setFormData({
        buyerId: quotation.buyerId,
        quotationDate: quotation.quotationDate,
        validUntil: quotation.validUntil,
        currency: quotation.currency,
        paymentTerms: quotation.paymentTerms,
        deliveryTerms: quotation.deliveryTerms,
        incoterms: quotation.incoterms || '',
        notes: quotation.notes || '',
      });
    }
  }, [quotation, open]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      shippingCost: 0,
      total: 0,
      status: 'draft',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{quotation ? (isRTL ? 'تعديل عرض الأسعار' : 'Edit Quotation') : (isRTL ? 'عرض أسعار جديد' : 'New Quotation')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المشتر' : 'Buyer'}</Label>
              <Select value={formData.buyerId} onValueChange={(v) => setFormData({...formData, buyerId: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {buyers.filter(b => b.status === 'active').map(b => (
                    <SelectItem key={b.id} value={b.id}>{isRTL ? b.nameAr : b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'العملة' : 'Currency'}</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {baseCurrencies.map(curr => (
                    <SelectItem key={curr.code} value={curr.code}>{isRTL ? curr.nameAr : curr.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ العرض' : 'Quotation Date'}</Label>
              <Input type="date" value={formData.quotationDate} onChange={(e) => setFormData({...formData, quotationDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'صالح حتى' : 'Valid Until'}</Label>
              <Input type="date" value={formData.validUntil} onChange={(e) => setFormData({...formData, validUntil: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'شروط الدفع' : 'Payment Terms'}</Label>
              <Input value={formData.paymentTerms} onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'شروط التجارة الدولية' : 'Incoterms'}</Label>
              <Input value={formData.incoterms} onChange={(e) => setFormData({...formData, incoterms: e.target.value})} placeholder="FOB, CIF, etc." />
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

// ==================== INVOICE FORM ====================

interface InvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: any;
  salesOrders: SalesOrder[];
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function InvoiceForm({ open, onOpenChange, invoice, salesOrders, onSave, isRTL }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    salesOrderId: invoice?.salesOrderId || '',
    invoiceDate: invoice?.invoiceDate || new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate || '',
    paymentTerms: invoice?.paymentTerms || 'Net 60',
    notes: invoice?.notes || '',
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        salesOrderId: invoice.salesOrderId,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        paymentTerms: invoice.paymentTerms,
        notes: invoice.notes || '',
      });
    }
  }, [invoice, open]);

  const handleSubmit = () => {
    const selectedOrder = salesOrders.find(so => so.id === formData.salesOrderId);
    onSave({
      ...formData,
      status: 'draft',
      currency: selectedOrder?.currency || 'USD',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{invoice ? (isRTL ? 'تعديل الفاتورة' : 'Edit Invoice') : (isRTL ? 'فاتورة جديدة' : 'New Invoice')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'طلب المبيعات' : 'Sales Order'}</Label>
              <Select value={formData.salesOrderId} onValueChange={(v) => setFormData({...formData, salesOrderId: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {salesOrders.map(so => (
                    <SelectItem key={so.id} value={so.id}>{so.orderNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الفاتورة' : 'Invoice Date'}</Label>
              <Input type="date" value={formData.invoiceDate} onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}</Label>
              <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'شروط الدفع' : 'Payment Terms'}</Label>
              <Input value={formData.paymentTerms} onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})} />
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

// ==================== PAYMENT FORM ====================

interface PaymentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: any;
  invoices: Invoice[];
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function PaymentForm({ open, onOpenChange, payment, invoices, onSave, isRTL }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    invoiceId: payment?.invoiceId || '',
    paymentDate: payment?.paymentDate || new Date().toISOString().split('T')[0],
    amount: payment?.amount || 0,
    paymentMethod: payment?.paymentMethod || 'bank_transfer' as any,
    paymentReference: payment?.paymentReference || '',
    bankName: payment?.bankName || '',
    checkNumber: payment?.checkNumber || '',
    notes: payment?.notes || '',
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        invoiceId: payment.invoiceId,
        paymentDate: payment.paymentDate,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        paymentReference: payment.paymentReference || '',
        bankName: payment.bankName || '',
        checkNumber: payment.checkNumber || '',
        notes: payment.notes || '',
      });
    }
  }, [payment, open]);

  const handleSubmit = () => {
    const selectedInvoice = invoices.find(inv => inv.id === formData.invoiceId);
    onSave({
      ...formData,
      currency: selectedInvoice?.currency || 'USD',
      status: 'pending',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{payment ? (isRTL ? 'تعديل الدفعة' : 'Edit Payment') : (isRTL ? 'دفعة جديدة' : 'New Payment')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'الفاتورة' : 'Invoice'}</Label>
              <Select value={formData.invoiceId} onValueChange={(v) => setFormData({...formData, invoiceId: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {invoices.filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled').map(inv => (
                    <SelectItem key={inv.id} value={inv.id}>{inv.invoiceNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الدفعة' : 'Payment Date'}</Label>
              <Input type="date" value={formData.paymentDate} onChange={(e) => setFormData({...formData, paymentDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المبلغ' : 'Amount'}</Label>
              <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'طريقة الدفع' : 'Payment Method'}</Label>
              <Select value={formData.paymentMethod} onValueChange={(v: any) => setFormData({...formData, paymentMethod: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{isRTL ? 'نقد' : 'Cash'}</SelectItem>
                  <SelectItem value="bank_transfer">{isRTL ? 'تحويل بنكي' : 'Bank Transfer'}</SelectItem>
                  <SelectItem value="check">{isRTL ? 'شيك' : 'Check'}</SelectItem>
                  <SelectItem value="credit_card">{isRTL ? 'بطاقة ائتمان' : 'Credit Card'}</SelectItem>
                  <SelectItem value="letter_of_credit">{isRTL ? 'اعتماد مستندي' : 'Letter of Credit'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم المرجع' : 'Payment Reference'}</Label>
              <Input value={formData.paymentReference} onChange={(e) => setFormData({...formData, paymentReference: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم البنك' : 'Bank Name'}</Label>
              <Input value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
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

// ==================== PRICE LIST FORM ====================

interface PriceListFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priceList?: any;
  buyers: Buyer[];
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function PriceListForm({ open, onOpenChange, priceList, buyers, onSave, isRTL }: PriceListFormProps) {
  const [formData, setFormData] = useState({
    code: priceList?.code || '',
    name: priceList?.name || '',
    nameAr: priceList?.nameAr || '',
    description: priceList?.description || '',
    descriptionAr: priceList?.descriptionAr || '',
    type: priceList?.type || 'wholesale' as any,
    currency: priceList?.currency || 'USD',
    validFrom: priceList?.validFrom || new Date().toISOString().split('T')[0],
    validTo: priceList?.validTo || '',
  });

  useEffect(() => {
    if (priceList) {
      setFormData({
        code: priceList.code,
        name: priceList.name,
        nameAr: priceList.nameAr,
        description: priceList.description,
        descriptionAr: priceList.descriptionAr,
        type: priceList.type,
        currency: priceList.currency,
        validFrom: priceList.validFrom,
        validTo: priceList.validTo || '',
      });
    }
  }, [priceList, open]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      status: 'active',
      items: [],
      discountRules: [],
      applicableBuyers: [],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{priceList ? (isRTL ? 'تعديل قائمة الأسعار' : 'Edit Price List') : (isRTL ? 'قائمة أسعار جديدة' : 'New Price List')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'الكود' : 'Code'}</Label>
              <Input value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'النوع' : 'Type'}</Label>
              <Select value={formData.type} onValueChange={(v: any) => setFormData({...formData, type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="wholesale">{isRTL ? 'جملة' : 'Wholesale'}</SelectItem>
                  <SelectItem value="retail">{isRTL ? 'تجزئة' : 'Retail'}</SelectItem>
                  <SelectItem value="export">{isRTL ? 'تصدير' : 'Export'}</SelectItem>
                  <SelectItem value="promotional">{isRTL ? 'ترويجي' : 'Promotional'}</SelectItem>
                  <SelectItem value="custom">{isRTL ? 'مخصص' : 'Custom'}</SelectItem>
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
              <Label>{isRTL ? 'العملة' : 'Currency'}</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {baseCurrencies.map(curr => (
                    <SelectItem key={curr.code} value={curr.code}>{isRTL ? curr.nameAr : curr.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
            <Textarea value={formData.descriptionAr} onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})} rows={2} dir="rtl" />
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

// ==================== RETURN FORM ====================

interface ReturnFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnItem?: any;
  salesOrders: SalesOrder[];
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function ReturnForm({ open, onOpenChange, returnItem, salesOrders, onSave, isRTL }: ReturnFormProps) {
  const [formData, setFormData] = useState({
    salesOrderId: returnItem?.salesOrderId || '',
    returnDate: returnItem?.returnDate || new Date().toISOString().split('T')[0],
    returnType: returnItem?.returnType || 'defect' as any,
    reason: returnItem?.reason || '',
    reasonAr: returnItem?.reasonAr || '',
    refundMethod: returnItem?.refundMethod || 'credit_note' as any,
    notes: returnItem?.notes || '',
  });

  useEffect(() => {
    if (returnItem) {
      setFormData({
        salesOrderId: returnItem.salesOrderId,
        returnDate: returnItem.returnDate,
        returnType: returnItem.returnType,
        reason: returnItem.reason,
        reasonAr: returnItem.reasonAr,
        refundMethod: returnItem.refundMethod,
        notes: returnItem.notes || '',
      });
    }
  }, [returnItem, open]);

  const handleSubmit = () => {
    const selectedOrder = salesOrders.find(so => so.id === formData.salesOrderId);
    onSave({
      ...formData,
      buyerId: selectedOrder?.buyerId || '',
      buyerName: selectedOrder?.buyerName || '',
      status: 'pending',
      items: [],
      totalAmount: 0,
      refundAmount: 0,
      currency: selectedOrder?.currency || 'USD',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{returnItem ? (isRTL ? 'تعديل الإرجاع' : 'Edit Return') : (isRTL ? 'إرجاع جديد' : 'New Return')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'طلب المبيعات' : 'Sales Order'}</Label>
              <Select value={formData.salesOrderId} onValueChange={(v) => setFormData({...formData, salesOrderId: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {salesOrders.map(so => (
                    <SelectItem key={so.id} value={so.id}>{so.orderNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الإرجاع' : 'Return Date'}</Label>
              <Input type="date" value={formData.returnDate} onChange={(e) => setFormData({...formData, returnDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع الإرجاع' : 'Return Type'}</Label>
              <Select value={formData.returnType} onValueChange={(v: any) => setFormData({...formData, returnType: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="defect">{isRTL ? 'عيب' : 'Defect'}</SelectItem>
                  <SelectItem value="wrong_item">{isRTL ? 'عنصر خاطئ' : 'Wrong Item'}</SelectItem>
                  <SelectItem value="customer_request">{isRTL ? 'طلب العميل' : 'Customer Request'}</SelectItem>
                  <SelectItem value="damaged">{isRTL ? 'تالف' : 'Damaged'}</SelectItem>
                  <SelectItem value="other">{isRTL ? 'أخرى' : 'Other'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'طريقة الاسترداد' : 'Refund Method'}</Label>
              <Select value={formData.refundMethod} onValueChange={(v: any) => setFormData({...formData, refundMethod: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_note">{isRTL ? 'إشعار ائتمان' : 'Credit Note'}</SelectItem>
                  <SelectItem value="cash_refund">{isRTL ? 'استرداد نقدي' : 'Cash Refund'}</SelectItem>
                  <SelectItem value="replacement">{isRTL ? 'استبدال' : 'Replacement'}</SelectItem>
                </SelectContent>
              </Select>
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

