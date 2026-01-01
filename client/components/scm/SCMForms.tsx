// ==================== SCM FORMS ====================

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Trash2 } from 'lucide-react';
import { SupplierMaster, RFQ, PurchaseOrder, Incoterm } from '@/store/scmData';
import { baseCurrencies } from '@/store/currencyData';

// ==================== SUPPLIER FORM ====================

const supplierSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  companyName: z.string().min(1, 'Company name is required'),
  companyNameAr: z.string().min(1, 'Arabic company name is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
  country: z.string().min(1, 'Country is required'),
  currency: z.string().min(1, 'Currency is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  classification: z.enum(['local', 'international']),
  type: z.enum(['raw_materials', 'services', 'both']),
  status: z.enum(['active', 'under_evaluation', 'suspended', 'blacklisted']),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  leadTimeDays: z.number().min(1, 'Lead time must be at least 1 day'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
});

interface SupplierFormProps {
  initialData?: SupplierMaster;
  onSave: (data: any) => void;
  onCancel: () => void;
  currencies: typeof baseCurrencies;
  isRTL: boolean;
}

const categoryOptions = ['fabric', 'trim', 'accessory', 'packaging', 'label', 'thread', 'button', 'zipper', 'elastic'];

export function SupplierForm({ initialData, onSave, onCancel, currencies, isRTL }: SupplierFormProps) {
  const [categories, setCategories] = useState<string[]>(initialData?.categories || []);

  const form = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: initialData || {
      code: '',
      name: '',
      nameAr: '',
      companyName: '',
      companyNameAr: '',
      registrationNumber: '',
      taxId: '',
      country: '',
      currency: 'USD',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      classification: 'local',
      type: 'raw_materials',
      status: 'active',
      paymentTerms: 'Net 30',
      leadTimeDays: 14,
      categories: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      setCategories(initialData.categories || []);
      form.reset({
        ...initialData,
        categories: initialData.categories || [],
      });
    } else {
      setCategories([]);
      form.reset({
        code: '',
        name: '',
        nameAr: '',
        companyName: '',
        companyNameAr: '',
        registrationNumber: '',
        taxId: '',
        country: '',
        currency: 'USD',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        classification: 'local',
        type: 'raw_materials',
        status: 'active',
        paymentTerms: 'Net 30',
        leadTimeDays: 14,
        categories: [],
      });
    }
  }, [initialData]);

  const addCategory = (category: string) => {
    if (category && !categories.includes(category)) {
      const newCategories = [...categories, category];
      setCategories(newCategories);
      form.setValue('categories', newCategories);
    }
  };

  const removeCategory = (category: string) => {
    const newCategories = categories.filter(c => c !== category);
    setCategories(newCategories);
    form.setValue('categories', newCategories);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRTL ? 'الكود' : 'Code'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRTL ? 'الحالة' : 'Status'}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">{isRTL ? 'نشط' : 'Active'}</SelectItem>
                    <SelectItem value="under_evaluation">{isRTL ? 'تحت التقييم' : 'Under Evaluation'}</SelectItem>
                    <SelectItem value="suspended">{isRTL ? 'موقوف' : 'Suspended'}</SelectItem>
                    <SelectItem value="blacklisted">{isRTL ? 'قائمة سوداء' : 'Blacklisted'}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nameAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}</FormLabel>
                <FormControl>
                  <Input {...field} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRTL ? 'اسم الشركة (إنجليزي)' : 'Company Name (English)'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyNameAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRTL ? 'اسم الشركة (عربي)' : 'Company Name (Arabic)'}</FormLabel>
                <FormControl>
                  <Input {...field} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRTL ? 'رقم السجل التجاري' : 'Registration Number'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taxId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRTL ? 'الرقم الضريبي' : 'Tax ID'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRTL ? 'الدولة' : 'Country'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRTL ? 'العملة' : 'Currency'}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map(curr => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {isRTL ? curr.nameAr : curr.name} ({curr.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="classification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRTL ? 'التصنيف' : 'Classification'}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="local">{isRTL ? 'محلي' : 'Local'}</SelectItem>
                    <SelectItem value="international">{isRTL ? 'دولي' : 'International'}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRTL ? 'الشخص المسؤول' : 'Contact Person'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRTL ? 'البريد الإلكتروني' : 'Email'}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRTL ? 'الهاتف' : 'Phone'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRTL ? 'العنوان' : 'Address'}</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? 'المدينة' : 'City'}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? 'شروط الدفع' : 'Payment Terms'}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{isRTL ? 'مثال: Net 30, Net 45' : 'e.g., Net 30, Net 45'}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leadTimeDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? 'مدة التسليم (أيام)' : 'Lead Time (Days)'}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isRTL ? 'النوع' : 'Type'}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="raw_materials">{isRTL ? 'مواد خام' : 'Raw Materials'}</SelectItem>
                  <SelectItem value="services">{isRTL ? 'خدمات' : 'Services'}</SelectItem>
                  <SelectItem value="both">{isRTL ? 'كلاهما' : 'Both'}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Categories */}
        <FormItem>
          <FormLabel>{isRTL ? 'الفئات' : 'Categories'}</FormLabel>
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <Badge key={cat} variant="secondary" className="gap-1">
                  {cat}
                  <button
                    type="button"
                    onClick={() => removeCategory(cat)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Select value="" onValueChange={addCategory}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? 'إضافة فئة...' : 'Add category...'} />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.filter(opt => !categories.includes(opt)).map(opt => (
                  <SelectItem key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <FormMessage />
        </FormItem>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button type="submit">
            {isRTL ? 'حفظ' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ==================== RFQ FORM ====================

interface RFQFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfq?: RFQ | null;
  suppliers: SupplierMaster[];
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function RFQForm({ open, onOpenChange, rfq, suppliers, onSave, isRTL }: RFQFormProps) {
  const [items, setItems] = useState<any[]>(rfq?.items || []);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>(rfq?.supplierIds || []);
  const [formData, setFormData] = useState({
    requestedDate: rfq?.requestedDate || new Date().toISOString().split('T')[0],
    requiredDate: rfq?.requiredDate || '',
    departmentId: rfq?.departmentId || '',
    departmentName: rfq?.departmentName || '',
    notes: rfq?.notes || '',
  });

  useEffect(() => {
    if (rfq) {
      setItems(rfq.items || []);
      setSelectedSuppliers(rfq.supplierIds || []);
      setFormData({
        requestedDate: rfq.requestedDate,
        requiredDate: rfq.requiredDate,
        departmentId: rfq.departmentId,
        departmentName: rfq.departmentName,
        notes: rfq.notes || '',
      });
    } else {
      setItems([]);
      setSelectedSuppliers([]);
      setFormData({
        requestedDate: new Date().toISOString().split('T')[0],
        requiredDate: '',
        departmentId: '',
        departmentName: '',
        notes: '',
      });
    }
  }, [rfq, open]);

  const addItem = () => {
    setItems([...items, {
      id: `item-${Date.now()}`,
      materialId: '',
      materialCode: '',
      materialName: '',
      materialNameAr: '',
      quantity: 0,
      unit: 'meters',
    }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      items,
      supplierIds: selectedSuppliers,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{rfq ? (isRTL ? 'تعديل طلب عرض السعر' : 'Edit RFQ') : (isRTL ? 'طلب عرض سعر جديد' : 'New RFQ')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الطلب' : 'Requested Date'}</Label>
              <Input type="date" value={formData.requestedDate} onChange={(e) => setFormData({...formData, requestedDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'التاريخ المطلوب' : 'Required Date'}</Label>
              <Input type="date" value={formData.requiredDate} onChange={(e) => setFormData({...formData, requiredDate: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'الموردون المدعوون' : 'Invited Suppliers'}</Label>
            <Select value="" onValueChange={(value) => {
              if (value && !selectedSuppliers.includes(value)) {
                setSelectedSuppliers([...selectedSuppliers, value]);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? 'اختر مورد...' : 'Select supplier...'} />
              </SelectTrigger>
              <SelectContent>
                {suppliers.filter(s => s.status === 'active').map(supplier => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {isRTL ? supplier.nameAr : supplier.name} ({supplier.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 flex-wrap mt-2">
              {selectedSuppliers.map(supId => {
                const supplier = suppliers.find(s => s.id === supId);
                return supplier ? (
                  <Badge key={supId} variant="secondary" className="gap-1">
                    {isRTL ? supplier.nameAr : supplier.name}
                    <button type="button" onClick={() => setSelectedSuppliers(selectedSuppliers.filter(id => id !== supId))} className="ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg">{isRTL ? 'الأصناف' : 'Items'}</Label>
              <Button type="button" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'إضافة صنف' : 'Add Item'}
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{isRTL ? `صنف ${index + 1}` : `Item ${index + 1}`}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>{isRTL ? 'كود المادة' : 'Material Code'}</Label>
                    <Input value={item.materialCode} onChange={(e) => updateItem(item.id, 'materialCode', e.target.value)} placeholder="FAB-COT-001" />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'اسم المادة' : 'Material Name'}</Label>
                    <Input value={item.materialName} onChange={(e) => updateItem(item.id, 'materialName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'الكمية' : 'Quantity'}</Label>
                    <Input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'الوحدة' : 'Unit'}</Label>
                    <Select value={item.unit} onValueChange={(value) => updateItem(item.id, 'unit', value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meters">{isRTL ? 'متر' : 'Meters'}</SelectItem>
                        <SelectItem value="pieces">{isRTL ? 'قطعة' : 'Pieces'}</SelectItem>
                        <SelectItem value="kg">{isRTL ? 'كيلو' : 'Kg'}</SelectItem>
                        <SelectItem value="rolls">{isRTL ? 'لفة' : 'Rolls'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {isRTL ? 'لا توجد أصناف. اضغط "إضافة صنف" لإضافة صنف جديد.' : 'No items. Click "Add Item" to add a new item.'}
              </div>
            )}
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

// ==================== PURCHASE ORDER FORM ====================

interface POFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  po?: PurchaseOrder | null;
  suppliers: SupplierMaster[];
  rfqs?: RFQ[];
  incoterms: Incoterm[];
  currencies: typeof baseCurrencies;
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function POForm({ open, onOpenChange, po, suppliers, rfqs = [], incoterms, currencies, onSave, isRTL }: POFormProps) {
  const [items, setItems] = useState<any[]>(po?.items || []);
  const [formData, setFormData] = useState({
    supplierId: po?.supplierId || '',
    rfqId: po?.rfqId || '',
    type: po?.type || 'local',
    orderDate: po?.orderDate || new Date().toISOString().split('T')[0],
    expectedDeliveryDate: po?.expectedDeliveryDate || '',
    currency: po?.currency || 'USD',
    incoterms: po?.incoterms || '',
    paymentTerms: po?.paymentTerms || '',
    subtotal: po?.subtotal || 0,
    freight: po?.freight || 0,
    insurance: po?.insurance || 0,
    customs: po?.customs || 0,
    tax: po?.tax || 0,
    notes: po?.notes || '',
  });

  useEffect(() => {
    if (po) {
      setItems(po.items || []);
      setFormData({
        supplierId: po.supplierId,
        rfqId: po.rfqId || '',
        type: po.type,
        orderDate: po.orderDate,
        expectedDeliveryDate: po.expectedDeliveryDate,
        currency: po.currency,
        incoterms: po.incoterms,
        paymentTerms: po.paymentTerms,
        subtotal: po.subtotal,
        freight: po.freight,
        insurance: po.insurance,
        customs: po.customs,
        tax: po.tax,
        notes: po.notes || '',
      });
    } else {
      setItems([]);
      setFormData({
        supplierId: '',
        rfqId: '',
        type: 'local',
        orderDate: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: '',
        currency: 'USD',
        incoterms: '',
        paymentTerms: '',
        subtotal: 0,
        freight: 0,
        insurance: 0,
        customs: 0,
        tax: 0,
        notes: '',
      });
    }
  }, [po, open]);

  const addItem = () => {
    setItems([...items, {
      id: `item-${Date.now()}`,
      materialId: '',
      materialCode: '',
      materialName: '',
      materialNameAr: '',
      quantity: 0,
      receivedQuantity: 0,
      unit: 'meters',
      unitPrice: 0,
      currency: formData.currency,
      total: 0,
    }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = (updated.quantity || 0) * (updated.unitPrice || 0);
        }
        return updated;
      }
      return item;
    });
    setItems(updatedItems);
    const newSubtotal = updatedItems.reduce((sum, item) => sum + (item.total || 0), 0);
    setFormData({ ...formData, subtotal: newSubtotal });
  };

  const total = formData.subtotal + formData.freight + formData.insurance + formData.customs + formData.tax;

  const handleSubmit = () => {
    onSave({
      ...formData,
      items,
      total,
    });
    onOpenChange(false);
  };

  const selectedSupplier = suppliers.find(s => s.id === formData.supplierId);
  const selectedRFQ = rfqs.find(r => r.id === formData.rfqId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{po ? (isRTL ? 'تعديل أمر الشراء' : 'Edit Purchase Order') : (isRTL ? 'أمر شراء جديد' : 'New Purchase Order')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المورد' : 'Supplier'}</Label>
              <Select value={formData.supplierId} onValueChange={(value) => {
                const supplier = suppliers.find(s => s.id === value);
                setFormData({
                  ...formData,
                  supplierId: value,
                  paymentTerms: supplier?.paymentTerms || '',
                  currency: supplier?.currency || 'USD',
                });
              }}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر مورد...' : 'Select supplier...'} />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.filter(s => s.status === 'active').map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {isRTL ? supplier.nameAr : supplier.name} ({supplier.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'النوع' : 'Type'}</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">{isRTL ? 'محلي' : 'Local'}</SelectItem>
                  <SelectItem value="import">{isRTL ? 'استيراد' : 'Import'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {rfqs.length > 0 && (
              <div className="space-y-2">
                <Label>{isRTL ? 'طلب عرض السعر (اختياري)' : 'RFQ (Optional)'}</Label>
                <Select value={formData.rfqId} onValueChange={(value) => {
                  const rfq = rfqs.find(r => r.id === value);
                  if (rfq) {
                    setItems(rfq.items.map(item => ({
                      id: `item-${Date.now()}-${item.id}`,
                      materialId: item.materialId,
                      materialCode: item.materialCode,
                      materialName: item.materialName,
                      materialNameAr: item.materialNameAr,
                      quantity: item.quantity,
                      receivedQuantity: 0,
                      unit: item.unit,
                      unitPrice: 0,
                      currency: formData.currency,
                      total: 0,
                    })));
                  }
                  setFormData({...formData, rfqId: value});
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'اختر RFQ...' : 'Select RFQ...'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{isRTL ? 'بدون RFQ' : 'No RFQ'}</SelectItem>
                    {rfqs.filter(r => r.status === 'approved' || r.status === 'converted').map(rfq => (
                      <SelectItem key={rfq.id} value={rfq.id}>
                        {rfq.rfqNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الطلب' : 'Order Date'}</Label>
              <Input type="date" value={formData.orderDate} onChange={(e) => setFormData({...formData, orderDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'التاريخ المتوقع للتسليم' : 'Expected Delivery Date'}</Label>
              <Input type="date" value={formData.expectedDeliveryDate} onChange={(e) => setFormData({...formData, expectedDeliveryDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'العملة' : 'Currency'}</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(curr => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {isRTL ? curr.nameAr : curr.name} ({curr.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.type === 'import' && (
              <div className="space-y-2">
                <Label>{isRTL ? 'شروط التجارة الدولية (Incoterms)' : 'Incoterms'}</Label>
                <Select value={formData.incoterms} onValueChange={(value) => setFormData({...formData, incoterms: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'اختر Incoterm...' : 'Select Incoterm...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {incoterms.filter(i => i.isActive).map(incoterm => (
                      <SelectItem key={incoterm.code} value={incoterm.code}>
                        {incoterm.code} - {isRTL ? incoterm.nameAr : incoterm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>{isRTL ? 'شروط الدفع' : 'Payment Terms'}</Label>
              <Input value={formData.paymentTerms} onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})} placeholder="Net 30" />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg">{isRTL ? 'الأصناف' : 'Items'}</Label>
              <Button type="button" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'إضافة صنف' : 'Add Item'}
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{isRTL ? `صنف ${index + 1}` : `Item ${index + 1}`}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <Label>{isRTL ? 'كود المادة' : 'Material Code'}</Label>
                    <Input value={item.materialCode} onChange={(e) => updateItem(item.id, 'materialCode', e.target.value)} placeholder="FAB-COT-001" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>{isRTL ? 'اسم المادة' : 'Material Name'}</Label>
                    <Input value={item.materialName} onChange={(e) => updateItem(item.id, 'materialName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'الوحدة' : 'Unit'}</Label>
                    <Select value={item.unit} onValueChange={(value) => updateItem(item.id, 'unit', value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meters">{isRTL ? 'متر' : 'Meters'}</SelectItem>
                        <SelectItem value="pieces">{isRTL ? 'قطعة' : 'Pieces'}</SelectItem>
                        <SelectItem value="kg">{isRTL ? 'كيلو' : 'Kg'}</SelectItem>
                        <SelectItem value="rolls">{isRTL ? 'لفة' : 'Rolls'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'الكمية' : 'Quantity'}</Label>
                    <Input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'سعر الوحدة' : 'Unit Price'}</Label>
                    <Input type="number" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'الإجمالي' : 'Total'}</Label>
                    <Input type="number" value={item.total} readOnly className="bg-muted" />
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {isRTL ? 'لا توجد أصناف. اضغط "إضافة صنف" لإضافة صنف جديد.' : 'No items. Click "Add Item" to add a new item.'}
              </div>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المجموع الفرعي' : 'Subtotal'}</Label>
              <Input type="number" step="0.01" value={formData.subtotal} onChange={(e) => setFormData({...formData, subtotal: parseFloat(e.target.value) || 0})} />
            </div>
            {formData.type === 'import' && (
              <>
                <div className="space-y-2">
                  <Label>{isRTL ? 'الشحن' : 'Freight'}</Label>
                  <Input type="number" step="0.01" value={formData.freight} onChange={(e) => setFormData({...formData, freight: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'التأمين' : 'Insurance'}</Label>
                  <Input type="number" step="0.01" value={formData.insurance} onChange={(e) => setFormData({...formData, insurance: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'الجمركة' : 'Customs'}</Label>
                  <Input type="number" step="0.01" value={formData.customs} onChange={(e) => setFormData({...formData, customs: parseFloat(e.target.value) || 0})} />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label>{isRTL ? 'الضريبة' : 'Tax'}</Label>
              <Input type="number" step="0.01" value={formData.tax} onChange={(e) => setFormData({...formData, tax: parseFloat(e.target.value) || 0})} />
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">{isRTL ? 'الإجمالي' : 'Total'}</span>
              <span className="text-2xl font-bold text-primary">{formData.currency} {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
