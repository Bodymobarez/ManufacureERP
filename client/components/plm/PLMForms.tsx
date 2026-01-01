import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { X, Plus, Trash2 } from 'lucide-react';
import {
  Style,
  TechPack,
  TechPackSpec,
  BOM,
  BOMItem,
  SizeChart,
  SizeMeasurement,
  GradingRule,
  ColorVariant,
  Document as PLMDoc,
} from '@/store/plmData';
import { mockMaterials } from '@/store/data';

// ==================== SCHEMAS ====================

const styleSchema = z.object({
  styleNumber: z.string().min(1, 'Style number is required'),
  name: z.string().min(1, 'Name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  category: z.enum(['tops', 'bottoms', 'dresses', 'outerwear', 'accessories']),
  subcategory: z.string().min(1, 'Subcategory is required'),
  season: z.string().min(1, 'Season is required'),
  collection: z.string().min(1, 'Collection is required'),
  targetCustomer: z.enum(['men', 'women', 'kids', 'unisex']),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  inspirationNotes: z.string().optional(),
  targetCost: z.number().min(0),
  targetPrice: z.number().min(0),
  status: z.enum(['concept', 'development', 'sampling', 'approved', 'production', 'discontinued']),
});

const techPackSpecSchema = z.object({
  category: z.string().min(1),
  specification: z.string().min(1),
  specificationAr: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().optional(),
  notes: z.string().optional(),
});

const techPackSchema = z.object({
  styleId: z.string().min(1),
  specifications: z.array(techPackSpecSchema).min(1),
  constructionDetails: z.string().optional(),
  constructionDetailsAr: z.string().optional(),
  fitNotes: z.string().optional(),
  packagingInstructions: z.string().optional(),
  labelingRequirements: z.string().optional(),
  qualityStandards: z.string().optional(),
});

const bomItemSchema = z.object({
  materialId: z.string().min(1),
  placement: z.string().min(1),
  placementAr: z.string().min(1),
  consumption: z.number().min(0),
  consumptionUnit: z.string().min(1),
  wastagePercent: z.number().min(0).max(100),
  unitCost: z.number().min(0),
});

const bomSchema = z.object({
  styleId: z.string().min(1),
  items: z.array(bomItemSchema).min(1),
  totalLaborCost: z.number().min(0),
  totalOverheadCost: z.number().min(0),
  notes: z.string().optional(),
});

const sizeMeasurementSchema = z.object({
  pointOfMeasure: z.string().min(1),
  pointOfMeasureAr: z.string().min(1),
  code: z.string().min(1),
  tolerance: z.number().min(0),
  values: z.record(z.string(), z.number()),
});

const gradingRuleSchema = z.object({
  measurementId: z.string().min(1),
  measurementName: z.string().min(1),
  gradeIncrement: z.number().min(0),
  direction: z.enum(['up', 'down', 'both']),
});

const sizeChartSchema = z.object({
  styleId: z.string().min(1),
  name: z.string().min(1),
  nameAr: z.string().min(1),
  sizeRange: z.array(z.string()).min(1),
  baseSize: z.string().min(1),
  measurements: z.array(sizeMeasurementSchema).min(1),
  gradingRules: z.array(gradingRuleSchema).optional(),
});

const colorVariantSchema = z.object({
  styleId: z.string().min(1),
  colorCode: z.string().min(1),
  colorName: z.string().min(1),
  colorNameAr: z.string().min(1),
  hexCode: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
  pantoneCode: z.string().optional(),
  status: z.enum(['active', 'pending', 'discontinued']),
  launchSeason: z.string().optional(),
});

const documentSchema = z.object({
  styleId: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['cad', 'dxf', 'pdf', 'image', 'other']),
  category: z.enum(['sketch', 'techpack', 'pattern', 'artwork', 'specification', 'sample_photo']),
  description: z.string().optional(),
  tags: z.array(z.string()),
});

// ==================== STYLE FORM ====================

interface StyleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  style?: Style | null;
  onSave: (data: z.infer<typeof styleSchema>) => void;
}

export function StyleForm({ open, onOpenChange, style, onSave }: StyleFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const form = useForm<z.infer<typeof styleSchema>>({
    resolver: zodResolver(styleSchema),
    defaultValues: style ? {
      styleNumber: style.styleNumber,
      name: style.name,
      nameAr: style.nameAr,
      category: style.category,
      subcategory: style.subcategory,
      season: style.season,
      collection: style.collection,
      targetCustomer: style.targetCustomer,
      description: style.description,
      descriptionAr: style.descriptionAr,
      inspirationNotes: style.inspirationNotes,
      targetCost: style.targetCost,
      targetPrice: style.targetPrice,
      status: style.status,
    } : {
      styleNumber: '',
      name: '',
      nameAr: '',
      category: 'tops',
      subcategory: '',
      season: '',
      collection: '',
      targetCustomer: 'men',
      description: '',
      descriptionAr: '',
      inspirationNotes: '',
      targetCost: 0,
      targetPrice: 0,
      status: 'concept',
    },
  });

  useEffect(() => {
    if (style) {
      form.reset({
        styleNumber: style.styleNumber,
        name: style.name,
        nameAr: style.nameAr,
        category: style.category,
        subcategory: style.subcategory,
        season: style.season,
        collection: style.collection,
        targetCustomer: style.targetCustomer,
        description: style.description,
        descriptionAr: style.descriptionAr,
        inspirationNotes: style.inspirationNotes,
        targetCost: style.targetCost,
        targetPrice: style.targetPrice,
        status: style.status,
      });
    } else {
      form.reset();
    }
  }, [style, open]);

  const onSubmit = (data: z.infer<typeof styleSchema>) => {
    onSave(data);
    onOpenChange(false);
  };

  const targetCost = form.watch('targetCost');
  const targetPrice = form.watch('targetPrice');
  const margin = targetPrice > 0 ? ((1 - targetCost / targetPrice) * 100).toFixed(1) : '0';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {style ? (isRTL ? 'تعديل الستايل' : 'Edit Style') : (isRTL ? 'ستايل جديد' : 'New Style')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="styleNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? 'رقم الستايل' : 'Style Number'}</FormLabel>
                    <FormControl>
                      <Input placeholder="STY-2024-XXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? 'الموسم' : 'Season'}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isRTL ? 'اختر الموسم' : 'Select season'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SS2024">SS2024</SelectItem>
                        <SelectItem value="FW2024">FW2024</SelectItem>
                        <SelectItem value="SS2025">SS2025</SelectItem>
                        <SelectItem value="FW2025">FW2025</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? 'الفئة' : 'Category'}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tops">{isRTL ? 'قمصان' : 'Tops'}</SelectItem>
                        <SelectItem value="bottoms">{isRTL ? 'بناطيل' : 'Bottoms'}</SelectItem>
                        <SelectItem value="dresses">{isRTL ? 'فساتين' : 'Dresses'}</SelectItem>
                        <SelectItem value="outerwear">{isRTL ? 'ملابس خارجية' : 'Outerwear'}</SelectItem>
                        <SelectItem value="accessories">{isRTL ? 'إكسسوارات' : 'Accessories'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? 'الفئة الفرعية' : 'Subcategory'}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? 'المجموعة' : 'Collection'}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetCustomer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? 'الفئة المستهدفة' : 'Target Customer'}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="men">{isRTL ? 'رجال' : 'Men'}</SelectItem>
                        <SelectItem value="women">{isRTL ? 'نساء' : 'Women'}</SelectItem>
                        <SelectItem value="kids">{isRTL ? 'أطفال' : 'Kids'}</SelectItem>
                        <SelectItem value="unisex">{isRTL ? 'للجنسين' : 'Unisex'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? 'التكلفة المستهدفة' : 'Target Cost ($)'}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? 'السعر المستهدف ($)' : 'Target Price ($)'}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      {isRTL ? 'الهامش' : 'Margin'}: {margin}%
                    </FormDescription>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="concept">{isRTL ? 'مفهوم' : 'Concept'}</SelectItem>
                        <SelectItem value="development">{isRTL ? 'تطوير' : 'Development'}</SelectItem>
                        <SelectItem value="sampling">{isRTL ? 'عينات' : 'Sampling'}</SelectItem>
                        <SelectItem value="approved">{isRTL ? 'معتمد' : 'Approved'}</SelectItem>
                        <SelectItem value="production">{isRTL ? 'إنتاج' : 'Production'}</SelectItem>
                        <SelectItem value="discontinued">{isRTL ? 'متوقف' : 'Discontinued'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descriptionAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} dir="rtl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inspirationNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? 'ملاحظات الإلهام' : 'Inspiration Notes'}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit">{isRTL ? 'حفظ' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ==================== COLOR VARIANT FORM ====================

interface ColorVariantFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  styleId: string;
  color?: ColorVariant | null;
  onSave: (data: z.infer<typeof colorVariantSchema>) => void;
}

export function ColorVariantForm({ open, onOpenChange, styleId, color, onSave }: ColorVariantFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const form = useForm<z.infer<typeof colorVariantSchema>>({
    resolver: zodResolver(colorVariantSchema),
    defaultValues: color ? {
      styleId: color.styleId,
      colorCode: color.colorCode,
      colorName: color.colorName,
      colorNameAr: color.colorNameAr,
      hexCode: color.hexCode,
      pantoneCode: color.pantoneCode,
      status: color.status,
      launchSeason: color.launchSeason,
    } : {
      styleId,
      colorCode: '',
      colorName: '',
      colorNameAr: '',
      hexCode: '#000000',
      pantoneCode: '',
      status: 'pending',
      launchSeason: '',
    },
  });

  useEffect(() => {
    if (color) {
      form.reset({
        styleId: color.styleId,
        colorCode: color.colorCode,
        colorName: color.colorName,
        colorNameAr: color.colorNameAr,
        hexCode: color.hexCode,
        pantoneCode: color.pantoneCode,
        status: color.status,
        launchSeason: color.launchSeason,
      });
    } else {
      form.reset({ styleId, hexCode: '#000000', status: 'pending' });
    }
  }, [color, open, styleId]);

  const onSubmit = (data: z.infer<typeof colorVariantSchema>) => {
    onSave(data);
    onOpenChange(false);
  };

  const hexCode = form.watch('hexCode');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {color ? (isRTL ? 'تعديل اللون' : 'Edit Color Variant') : (isRTL ? 'لون جديد' : 'New Color Variant')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="colorCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? 'كود اللون' : 'Color Code'}</FormLabel>
                  <FormControl>
                    <Input placeholder="WHT, BLK, NVY..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="colorName"
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
                name="colorNameAr"
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
            <FormField
              control={form.control}
              name="hexCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? 'كود اللون (Hex)' : 'Hex Color Code'}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} className="font-mono" />
                    </FormControl>
                    <div
                      className="w-16 h-10 rounded border border-border"
                      style={{ backgroundColor: hexCode }}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pantoneCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? 'كود Pantone' : 'Pantone Code (Optional)'}</FormLabel>
                  <FormControl>
                    <Input placeholder="11-0601 TCX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? 'الحالة' : 'Status'}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">{isRTL ? 'نشط' : 'Active'}</SelectItem>
                        <SelectItem value="pending">{isRTL ? 'قيد الانتظار' : 'Pending'}</SelectItem>
                        <SelectItem value="discontinued">{isRTL ? 'متوقف' : 'Discontinued'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="launchSeason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? 'موسم الإطلاق' : 'Launch Season'}</FormLabel>
                    <FormControl>
                      <Input placeholder="SS2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit">{isRTL ? 'حفظ' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ==================== DOCUMENT UPLOAD FORM ====================

interface DocumentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  styleId: string;
  document?: PLMDoc | null;
  onSave: (data: z.infer<typeof documentSchema> & { file?: File }) => void;
}

export function DocumentForm({ open, onOpenChange, styleId, document, onSave }: DocumentFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>(document?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const form = useForm<z.infer<typeof documentSchema>>({
    resolver: zodResolver(documentSchema),
    defaultValues: document ? {
      styleId: document.styleId,
      name: document.name,
      type: document.type,
      category: document.category,
      description: document.description,
      tags: document.tags,
    } : {
      styleId,
      name: '',
      type: 'pdf',
      category: 'sketch',
      description: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (document) {
      form.reset({
        styleId: document.styleId,
        name: document.name,
        type: document.type,
        category: document.category,
        description: document.description,
        tags: document.tags,
      });
      setTags(document.tags);
    } else {
      form.reset({ styleId, type: 'pdf', category: 'sketch', tags: [] });
      setTags([]);
      setFile(null);
    }
  }, [document, open, styleId]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    form.setValue('tags', newTags);
  };

  const onSubmit = (data: z.infer<typeof documentSchema>) => {
    onSave({ ...data, file: file || undefined });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {document ? (isRTL ? 'تعديل المستند' : 'Edit Document') : (isRTL ? 'رفع مستند جديد' : 'Upload New Document')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? 'اسم المستند' : 'Document Name'}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? 'نوع الملف' : 'File Type'}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="dxf">DXF</SelectItem>
                        <SelectItem value="cad">CAD</SelectItem>
                        <SelectItem value="image">{isRTL ? 'صورة' : 'Image'}</SelectItem>
                        <SelectItem value="other">{isRTL ? 'أخرى' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? 'الفئة' : 'Category'}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sketch">{isRTL ? 'رسم' : 'Sketch'}</SelectItem>
                        <SelectItem value="pattern">{isRTL ? 'باترون' : 'Pattern'}</SelectItem>
                        <SelectItem value="techpack">{isRTL ? 'ملف فني' : 'Tech Pack'}</SelectItem>
                        <SelectItem value="artwork">{isRTL ? 'أعمال فنية' : 'Artwork'}</SelectItem>
                        <SelectItem value="specification">{isRTL ? 'مواصفات' : 'Specification'}</SelectItem>
                        <SelectItem value="sample_photo">{isRTL ? 'صورة عينة' : 'Sample Photo'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {!document && (
              <div className="space-y-2">
                <Label>{isRTL ? 'اختر الملف' : 'Select File'}</Label>
                <Input
                  type="file"
                  accept=".pdf,.dxf,.dwg,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? 'الوصف' : 'Description'}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label>{isRTL ? 'العلامات' : 'Tags'}</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder={isRTL ? 'أضف علامة واضغط Enter' : 'Add tag and press Enter'}
                />
                <Button type="button" onClick={addTag}>{isRTL ? 'إضافة' : 'Add'}</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit">{isRTL ? 'حفظ' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ==================== TECH PACK FORM ====================

interface TechPackFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  styleId: string;
  styleName: string;
  techPack?: TechPack | null;
  onSave: (data: any) => void;
}

export function TechPackForm({ open, onOpenChange, styleId, styleName, techPack, onSave }: TechPackFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [specs, setSpecs] = useState<Array<{
    id: string;
    category: string;
    specification: string;
    specificationAr: string;
    value: string;
    notes: string;
  }>>(techPack?.specifications?.map(s => ({
    id: s.id,
    category: s.category,
    specification: s.specification,
    specificationAr: s.specificationAr,
    value: s.value,
    notes: s.notes || '',
  })) || []);

  const [constructionDetails, setConstructionDetails] = useState(techPack?.constructionDetails || '');
  const [constructionDetailsAr, setConstructionDetailsAr] = useState(techPack?.constructionDetailsAr || '');
  const [fitNotes, setFitNotes] = useState(techPack?.fitNotes || '');
  const [packagingInstructions, setPackagingInstructions] = useState(techPack?.packagingInstructions || '');
  const [labelingRequirements, setLabelingRequirements] = useState(techPack?.labelingRequirements || '');
  const [qualityStandards, setQualityStandards] = useState(techPack?.qualityStandards || '');

  useEffect(() => {
    if (techPack) {
      setSpecs(techPack.specifications?.map(s => ({
        id: s.id,
        category: s.category,
        specification: s.specification,
        specificationAr: s.specificationAr,
        value: s.value,
        notes: s.notes || '',
      })) || []);
      setConstructionDetails(techPack.constructionDetails);
      setConstructionDetailsAr(techPack.constructionDetailsAr);
      setFitNotes(techPack.fitNotes);
      setPackagingInstructions(techPack.packagingInstructions);
      setLabelingRequirements(techPack.labelingRequirements);
      setQualityStandards(techPack.qualityStandards);
    } else {
      setSpecs([]);
      setConstructionDetails('');
      setConstructionDetailsAr('');
      setFitNotes('');
      setPackagingInstructions('');
      setLabelingRequirements('');
      setQualityStandards('');
    }
  }, [techPack, open]);

  const addSpec = () => {
    setSpecs([...specs, {
      id: `spec-${Date.now()}`,
      category: 'Fabric',
      specification: '',
      specificationAr: '',
      value: '',
      notes: '',
    }]);
  };

  const removeSpec = (id: string) => {
    setSpecs(specs.filter(s => s.id !== id));
  };

  const updateSpec = (id: string, field: string, value: string) => {
    setSpecs(specs.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSubmit = () => {
    onSave({
      styleId,
      specifications: specs,
      constructionDetails,
      constructionDetailsAr,
      fitNotes,
      packagingInstructions,
      labelingRequirements,
      qualityStandards,
    });
    onOpenChange(false);
  };

  const specCategories = ['Fabric', 'Thread', 'Buttons', 'Label', 'Hardware', 'Packaging', 'Other'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {techPack ? (isRTL ? 'تعديل الملف الفني' : 'Edit Tech Pack') : (isRTL ? 'ملف فني جديد' : 'New Tech Pack')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">{isRTL ? 'الستايل' : 'Style'}</p>
            <p className="font-medium">{styleName}</p>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{isRTL ? 'المواصفات' : 'Specifications'}</h4>
              <Button type="button" variant="outline" size="sm" onClick={addSpec} className="gap-1">
                <Plus className="w-4 h-4" />
                {isRTL ? 'إضافة مواصفة' : 'Add Spec'}
              </Button>
            </div>
            
            <div className="space-y-3">
              {specs.map((spec) => (
                <div key={spec.id} className="grid grid-cols-12 gap-2 items-start bg-muted/20 p-3 rounded-lg">
                  <div className="col-span-2">
                    <Label className="text-xs">{isRTL ? 'الفئة' : 'Category'}</Label>
                    <Select value={spec.category} onValueChange={(v) => updateSpec(spec.id, 'category', v)}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {specCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Label className="text-xs">{isRTL ? 'المواصفة (إنجليزي)' : 'Specification (EN)'}</Label>
                    <Input
                      value={spec.specification}
                      onChange={(e) => updateSpec(spec.id, 'specification', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label className="text-xs">{isRTL ? 'المواصفة (عربي)' : 'Specification (AR)'}</Label>
                    <Input
                      value={spec.specificationAr}
                      onChange={(e) => updateSpec(spec.id, 'specificationAr', e.target.value)}
                      className="h-9"
                      dir="rtl"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label className="text-xs">{isRTL ? 'القيمة' : 'Value'}</Label>
                    <Input
                      value={spec.value}
                      onChange={(e) => updateSpec(spec.id, 'value', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeSpec(spec.id)} className="h-9 w-9 p-0">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {specs.length === 0 && (
                <p className="text-center text-muted-foreground py-4">{isRTL ? 'لا توجد مواصفات. اضغط إضافة مواصفة للبدء.' : 'No specifications. Click Add Spec to start.'}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Construction Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'تفاصيل البناء (إنجليزي)' : 'Construction Details (EN)'}</Label>
              <Textarea
                value={constructionDetails}
                onChange={(e) => setConstructionDetails(e.target.value)}
                rows={4}
                placeholder="1. Attach collar to neckband&#10;2. Set sleeves flat..."
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تفاصيل البناء (عربي)' : 'Construction Details (AR)'}</Label>
              <Textarea
                value={constructionDetailsAr}
                onChange={(e) => setConstructionDetailsAr(e.target.value)}
                rows={4}
                dir="rtl"
                placeholder="1. تثبيت الياقة&#10;2. تركيب الأكمام..."
              />
            </div>
          </div>

          {/* Other Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'ملاحظات القياس' : 'Fit Notes'}</Label>
              <Textarea value={fitNotes} onChange={(e) => setFitNotes(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تعليمات التغليف' : 'Packaging Instructions'}</Label>
              <Textarea value={packagingInstructions} onChange={(e) => setPackagingInstructions(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'متطلبات الليبل' : 'Labeling Requirements'}</Label>
              <Textarea value={labelingRequirements} onChange={(e) => setLabelingRequirements(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'معايير الجودة' : 'Quality Standards'}</Label>
              <Textarea value={qualityStandards} onChange={(e) => setQualityStandards(e.target.value)} rows={2} placeholder="AQL 2.5 for major defects..." />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ الملف الفني' : 'Save Tech Pack'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== BOM FORM ====================

interface BOMFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  styleId: string;
  styleName: string;
  bom?: BOM | null;
  onSave: (data: any) => void;
}

export function BOMForm({ open, onOpenChange, styleId, styleName, bom, onSave }: BOMFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [items, setItems] = useState<Array<{
    id: string;
    materialCode: string;
    materialName: string;
    materialNameAr: string;
    category: string;
    placement: string;
    placementAr: string;
    consumption: number;
    consumptionUnit: string;
    wastagePercent: number;
    unitCost: number;
  }>>(bom?.items?.map(i => ({
    id: i.id,
    materialCode: i.materialCode,
    materialName: i.materialName,
    materialNameAr: i.materialNameAr,
    category: i.category,
    placement: i.placement,
    placementAr: i.placementAr,
    consumption: i.consumption,
    consumptionUnit: i.consumptionUnit,
    wastagePercent: i.wastagePercent,
    unitCost: i.unitCost,
  })) || []);

  const [laborCost, setLaborCost] = useState(bom?.totalLaborCost || 0);
  const [overheadCost, setOverheadCost] = useState(bom?.totalOverheadCost || 0);
  const [notes, setNotes] = useState(bom?.notes || '');

  useEffect(() => {
    if (bom) {
      setItems(bom.items?.map(i => ({
        id: i.id, materialCode: i.materialCode, materialName: i.materialName, materialNameAr: i.materialNameAr,
        category: i.category, placement: i.placement, placementAr: i.placementAr, consumption: i.consumption,
        consumptionUnit: i.consumptionUnit, wastagePercent: i.wastagePercent, unitCost: i.unitCost,
      })) || []);
      setLaborCost(bom.totalLaborCost);
      setOverheadCost(bom.totalOverheadCost);
      setNotes(bom.notes || '');
    } else {
      setItems([]);
      setLaborCost(0);
      setOverheadCost(0);
      setNotes('');
    }
  }, [bom, open]);

  const addItem = () => {
    setItems([...items, {
      id: `bi-${Date.now()}`, materialCode: '', materialName: '', materialNameAr: '', category: 'fabric',
      placement: '', placementAr: '', consumption: 0, consumptionUnit: 'm', wastagePercent: 5, unitCost: 0,
    }]);
  };

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));
  const updateItem = (id: string, field: string, value: any) => setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  const calculateItemTotal = (item: typeof items[0]) => item.consumption * item.unitCost * (1 + item.wastagePercent / 100);
  const totalMaterialCost = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const totalCost = totalMaterialCost + laborCost + overheadCost;

  const handleSubmit = () => {
    onSave({ styleId, items: items.map(i => ({ ...i, totalCost: calculateItemTotal(i) })), totalMaterialCost, totalLaborCost: laborCost, totalOverheadCost: overheadCost, totalCost, notes });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{bom ? (isRTL ? 'تعديل قائمة المواد' : 'Edit BOM') : (isRTL ? 'قائمة مواد جديدة' : 'New Bill of Materials')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">{isRTL ? 'الستايل' : 'Style'}</p>
              <p className="font-medium">{styleName}</p>
            </div>
            <div className="text-end">
              <p className="text-sm text-muted-foreground">{isRTL ? 'إجمالي التكلفة' : 'Total Cost'}</p>
              <p className="text-2xl font-bold text-primary">${totalCost.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{isRTL ? 'المواد' : 'Materials'}</h4>
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1">
                <Plus className="w-4 h-4" />{isRTL ? 'إضافة مادة' : 'Add Material'}
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="p-2 text-start">{isRTL ? 'الكود' : 'Code'}</th>
                    <th className="p-2 text-start">{isRTL ? 'المادة' : 'Material'}</th>
                    <th className="p-2 text-start">{isRTL ? 'الفئة' : 'Category'}</th>
                    <th className="p-2 text-start">{isRTL ? 'الموضع' : 'Placement'}</th>
                    <th className="p-2 text-center">{isRTL ? 'الاستهلاك' : 'Consumption'}</th>
                    <th className="p-2 text-center">{isRTL ? 'الهدر%' : 'Waste%'}</th>
                    <th className="p-2 text-end">{isRTL ? 'سعر الوحدة' : 'Unit Cost'}</th>
                    <th className="p-2 text-end">{isRTL ? 'الإجمالي' : 'Total'}</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-2"><Input value={item.materialCode} onChange={(e) => updateItem(item.id, 'materialCode', e.target.value)} className="h-8 w-24 font-mono text-xs" placeholder="FAB-001" /></td>
                      <td className="p-2">
                        <div className="space-y-1">
                          <Input value={item.materialName} onChange={(e) => updateItem(item.id, 'materialName', e.target.value)} className="h-8 text-xs" placeholder="Material name" />
                          <Input value={item.materialNameAr} onChange={(e) => updateItem(item.id, 'materialNameAr', e.target.value)} className="h-8 text-xs" placeholder="اسم المادة" dir="rtl" />
                        </div>
                      </td>
                      <td className="p-2">
                        <Select value={item.category} onValueChange={(v) => updateItem(item.id, 'category', v)}>
                          <SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fabric">{isRTL ? 'قماش' : 'Fabric'}</SelectItem>
                            <SelectItem value="trim">{isRTL ? 'إكسسوار' : 'Trim'}</SelectItem>
                            <SelectItem value="accessory">{isRTL ? 'ملحق' : 'Accessory'}</SelectItem>
                            <SelectItem value="label">{isRTL ? 'ليبل' : 'Label'}</SelectItem>
                            <SelectItem value="packaging">{isRTL ? 'تغليف' : 'Packaging'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <div className="space-y-1">
                          <Input value={item.placement} onChange={(e) => updateItem(item.id, 'placement', e.target.value)} className="h-8 text-xs" placeholder="Main Body" />
                          <Input value={item.placementAr} onChange={(e) => updateItem(item.id, 'placementAr', e.target.value)} className="h-8 text-xs" placeholder="الجسم الرئيسي" dir="rtl" />
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1 items-center">
                          <Input type="number" value={item.consumption} onChange={(e) => updateItem(item.id, 'consumption', parseFloat(e.target.value) || 0)} className="h-8 w-16 text-xs text-center" />
                          <Select value={item.consumptionUnit} onValueChange={(v) => updateItem(item.id, 'consumptionUnit', v)}>
                            <SelectTrigger className="h-8 w-14 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="pcs">pcs</SelectItem><SelectItem value="kg">kg</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </td>
                      <td className="p-2"><Input type="number" value={item.wastagePercent} onChange={(e) => updateItem(item.id, 'wastagePercent', parseFloat(e.target.value) || 0)} className="h-8 w-16 text-xs text-center" /></td>
                      <td className="p-2"><Input type="number" step="0.01" value={item.unitCost} onChange={(e) => updateItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)} className="h-8 w-20 text-xs text-end" /></td>
                      <td className="p-2 text-end font-medium">${calculateItemTotal(item).toFixed(2)}</td>
                      <td className="p-2"><Button type="button" variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="h-8 w-8 p-0"><Trash2 className="w-4 h-4 text-destructive" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {items.length === 0 && <p className="text-center text-muted-foreground py-8">{isRTL ? 'لا توجد مواد. اضغط إضافة مادة للبدء.' : 'No materials. Click Add Material to start.'}</p>}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'تكلفة العمالة' : 'Labor Cost ($)'}</Label>
              <Input type="number" step="0.01" value={laborCost} onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'التكاليف غير المباشرة' : 'Overhead Cost ($)'}</Label>
              <Input type="number" step="0.01" value={overheadCost} onChange={(e) => setOverheadCost(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">{isRTL ? 'تكلفة المواد:' : 'Material Cost:'}</span><span className="text-end">${totalMaterialCost.toFixed(2)}</span>
                <span className="text-muted-foreground">{isRTL ? 'تكلفة العمالة:' : 'Labor Cost:'}</span><span className="text-end">${laborCost.toFixed(2)}</span>
                <span className="text-muted-foreground">{isRTL ? 'تكاليف غير مباشرة:' : 'Overhead:'}</span><span className="text-end">${overheadCost.toFixed(2)}</span>
                <Separator className="col-span-2 my-1" />
                <span className="font-medium">{isRTL ? 'الإجمالي:' : 'Total:'}</span><span className="text-end font-bold text-primary">${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2"><Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} /></div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ قائمة المواد' : 'Save BOM'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== SIZE CHART FORM ====================

interface SizeChartFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  styleId: string;
  styleName: string;
  sizeChart?: SizeChart | null;
  onSave: (data: any) => void;
}

export function SizeChartForm({ open, onOpenChange, styleId, styleName, sizeChart, onSave }: SizeChartFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  const [name, setName] = useState(sizeChart?.name || '');
  const [nameAr, setNameAr] = useState(sizeChart?.nameAr || '');
  const [sizeRange, setSizeRange] = useState<string[]>(sizeChart?.sizeRange || defaultSizes);
  const [baseSize, setBaseSize] = useState(sizeChart?.baseSize || 'M');
  const [measurements, setMeasurements] = useState<Array<{ id: string; pointOfMeasure: string; pointOfMeasureAr: string; code: string; tolerance: number; values: Record<string, number>; }>>(
    sizeChart?.measurements?.map(m => ({ id: m.id, pointOfMeasure: m.pointOfMeasure, pointOfMeasureAr: m.pointOfMeasureAr, code: m.code, tolerance: m.tolerance, values: { ...m.values } })) || []
  );

  useEffect(() => {
    if (sizeChart) {
      setName(sizeChart.name);
      setNameAr(sizeChart.nameAr);
      setSizeRange(sizeChart.sizeRange);
      setBaseSize(sizeChart.baseSize);
      setMeasurements(sizeChart.measurements?.map(m => ({ id: m.id, pointOfMeasure: m.pointOfMeasure, pointOfMeasureAr: m.pointOfMeasureAr, code: m.code, tolerance: m.tolerance, values: { ...m.values } })) || []);
    } else {
      setName(''); setNameAr(''); setSizeRange(defaultSizes); setBaseSize('M'); setMeasurements([]);
    }
  }, [sizeChart, open]);

  const addMeasurement = () => {
    const values: Record<string, number> = {};
    sizeRange.forEach(size => { values[size] = 0; });
    setMeasurements([...measurements, { id: `sm-${Date.now()}`, pointOfMeasure: '', pointOfMeasureAr: '', code: String.fromCharCode(65 + measurements.length), tolerance: 0.5, values }]);
  };

  const removeMeasurement = (id: string) => setMeasurements(measurements.filter(m => m.id !== id));
  const updateMeasurement = (id: string, field: string, value: any) => setMeasurements(measurements.map(m => m.id === id ? { ...m, [field]: value } : m));
  const updateMeasurementValue = (id: string, size: string, value: number) => setMeasurements(measurements.map(m => m.id === id ? { ...m, values: { ...m.values, [size]: value } } : m));

  const handleSubmit = () => {
    onSave({ styleId, name, nameAr, sizeRange, baseSize, measurements, gradingRules: [] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sizeChart ? (isRTL ? 'تعديل جدول المقاسات' : 'Edit Size Chart') : (isRTL ? 'جدول مقاسات جديد' : 'New Size Chart')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">{isRTL ? 'الستايل' : 'Style'}</p>
            <p className="font-medium">{styleName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>{isRTL ? 'اسم الجدول (إنجليزي)' : 'Chart Name (EN)'}</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Men's Shirt Size Chart" /></div>
            <div className="space-y-2"><Label>{isRTL ? 'اسم الجدول (عربي)' : 'Chart Name (AR)'}</Label><Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} placeholder="جدول مقاسات قميص رجالي" dir="rtl" /></div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'المقاس الأساسي' : 'Base Size'}</Label>
            <Select value={baseSize} onValueChange={setBaseSize}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>{sizeRange.map(size => (<SelectItem key={size} value={size}>{size}</SelectItem>))}</SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{isRTL ? 'القياسات' : 'Measurements'}</h4>
              <Button type="button" variant="outline" size="sm" onClick={addMeasurement} className="gap-1"><Plus className="w-4 h-4" />{isRTL ? 'إضافة قياس' : 'Add Measurement'}</Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="p-2 text-start">{isRTL ? 'نقطة القياس' : 'Point of Measure'}</th>
                    <th className="p-2 text-center">{isRTL ? 'الكود' : 'Code'}</th>
                    <th className="p-2 text-center">{isRTL ? 'التسامح' : 'Tol.'}</th>
                    {sizeRange.map(size => (<th key={size} className={`p-2 text-center ${size === baseSize ? 'bg-primary/10' : ''}`}>{size}</th>))}
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.map((m) => (
                    <tr key={m.id} className="border-t">
                      <td className="p-2">
                        <div className="space-y-1">
                          <Input value={m.pointOfMeasure} onChange={(e) => updateMeasurement(m.id, 'pointOfMeasure', e.target.value)} className="h-8 text-xs" placeholder="Chest Width" />
                          <Input value={m.pointOfMeasureAr} onChange={(e) => updateMeasurement(m.id, 'pointOfMeasureAr', e.target.value)} className="h-8 text-xs" placeholder="عرض الصدر" dir="rtl" />
                        </div>
                      </td>
                      <td className="p-2 text-center"><Input value={m.code} onChange={(e) => updateMeasurement(m.id, 'code', e.target.value)} className="h-8 w-12 text-xs text-center font-mono" /></td>
                      <td className="p-2 text-center"><Input type="number" step="0.1" value={m.tolerance} onChange={(e) => updateMeasurement(m.id, 'tolerance', parseFloat(e.target.value) || 0)} className="h-8 w-14 text-xs text-center" /></td>
                      {sizeRange.map(size => (
                        <td key={size} className={`p-2 ${size === baseSize ? 'bg-primary/10' : ''}`}>
                          <Input type="number" step="0.5" value={m.values[size] || 0} onChange={(e) => updateMeasurementValue(m.id, size, parseFloat(e.target.value) || 0)} className="h-8 w-14 text-xs text-center" />
                        </td>
                      ))}
                      <td className="p-2"><Button type="button" variant="ghost" size="sm" onClick={() => removeMeasurement(m.id)} className="h-8 w-8 p-0"><Trash2 className="w-4 h-4 text-destructive" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {measurements.length === 0 && <p className="text-center text-muted-foreground py-8">{isRTL ? 'لا توجد قياسات. اضغط إضافة قياس للبدء.' : 'No measurements. Click Add Measurement to start.'}</p>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ جدول المقاسات' : 'Save Size Chart'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== APPROVAL DIALOG ====================

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'approve' | 'reject' | 'comment';
  entityName: string;
  stageName: string;
  onSubmit: (comment: string) => void;
}

export function ApprovalDialog({ open, onOpenChange, action, entityName, stageName, onSubmit }: ApprovalDialogProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(comment);
    setComment('');
    onOpenChange(false);
  };

  const titles = { approve: { en: 'Approve', ar: 'موافقة' }, reject: { en: 'Reject', ar: 'رفض' }, comment: { en: 'Add Comment', ar: 'إضافة تعليق' } };
  const buttonColors = { approve: 'bg-green-600 hover:bg-green-700', reject: 'bg-red-600 hover:bg-red-700', comment: 'bg-blue-600 hover:bg-blue-700' };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{isRTL ? titles[action].ar : titles[action].en}: {entityName}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">{isRTL ? 'المرحلة الحالية' : 'Current Stage'}</p>
            <p className="font-medium">{stageName}</p>
          </div>
          <div className="space-y-2">
            <Label>{action === 'comment' ? (isRTL ? 'التعليق' : 'Comment') : (isRTL ? 'التعليق (اختياري)' : 'Comment (Optional)')}</Label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} placeholder={isRTL ? 'أدخل تعليقك هنا...' : 'Enter your comment here...'} required={action === 'comment'} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit} className={buttonColors[action]} disabled={action === 'comment' && !comment.trim()}>{isRTL ? titles[action].ar : titles[action].en}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

