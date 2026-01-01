// ==================== IOT FORMS ====================

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
import type { IoTDevice, ThresholdConfig, Alert } from '@/store/iotData';
import { mockMachines } from '@/store/machineData';
import { mockProductionLines } from '@/store/productionData';

// ==================== DEVICE FORM ====================

interface DeviceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device?: IoTDevice | null;
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function DeviceForm({ open, onOpenChange, device, onSave, isRTL }: DeviceFormProps) {
  const [formData, setFormData] = useState({
    deviceId: device?.deviceId || '',
    name: device?.name || '',
    nameAr: device?.nameAr || '',
    type: device?.type || 'sensor' as 'sensor' | 'actuator' | 'controller' | 'gateway' | 'display',
    category: device?.category || 'temperature' as 'temperature' | 'pressure' | 'motion' | 'power' | 'production' | 'quality' | 'other',
    manufacturer: device?.manufacturer || '',
    model: device?.model || '',
    serialNumber: device?.serialNumber || '',
    firmwareVersion: device?.firmwareVersion || '',
    location: device?.location || '',
    locationAr: device?.locationAr || '',
    machineId: device?.machineId || '',
    productionLineId: device?.productionLineId || '',
    status: device?.status || 'online' as 'online' | 'offline' | 'maintenance' | 'error',
    isActive: device?.isActive !== undefined ? device.isActive : true,
    unit: device?.config?.unit || '',
    samplingRate: device?.config?.samplingRate || 1,
    minValue: device?.config?.minValue || undefined,
    maxValue: device?.config?.maxValue || undefined,
  });

  const [thresholds, setThresholds] = useState<ThresholdConfig[]>(device?.config?.thresholds || []);
  const [tags, setTags] = useState<string[]>(device?.tags || []);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (device) {
      setFormData({
        deviceId: device.deviceId,
        name: device.name,
        nameAr: device.nameAr,
        type: device.type,
        category: device.category,
        manufacturer: device.manufacturer,
        model: device.model,
        serialNumber: device.serialNumber,
        firmwareVersion: device.firmwareVersion,
        location: device.location,
        locationAr: device.locationAr,
        machineId: device.machineId || '',
        productionLineId: device.productionLineId || '',
        status: device.status,
        isActive: device.isActive,
        unit: device.config.unit,
        samplingRate: device.config.samplingRate || 1,
        minValue: device.config.minValue,
        maxValue: device.config.maxValue,
      });
      setThresholds(device.config.thresholds || []);
      setTags(device.tags || []);
    }
  }, [device, open]);

  const addThreshold = () => {
    setThresholds([...thresholds, {
      name: '',
      nameAr: '',
      value: 0,
      operator: 'gt',
      severity: 'warning',
    }]);
  };

  const removeThreshold = (index: number) => {
    setThresholds(thresholds.filter((_, i) => i !== index));
  };

  const updateThreshold = (index: number, field: string, value: any) => {
    const updated = [...thresholds];
    updated[index] = { ...updated[index], [field]: value };
    setThresholds(updated);
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      config: {
        unit: formData.unit,
        samplingRate: formData.samplingRate,
        minValue: formData.minValue,
        maxValue: formData.maxValue,
        thresholds,
        calibration: device?.config?.calibration,
      },
      tags,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{device ? (isRTL ? 'تعديل الجهاز' : 'Edit Device') : (isRTL ? 'جهاز جديد' : 'New Device')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'معرف الجهاز' : 'Device ID'}</Label>
              <Input value={formData.deviceId} onChange={(e) => setFormData({...formData, deviceId: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'النوع' : 'Type'}</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sensor">{isRTL ? 'مستشعر' : 'Sensor'}</SelectItem>
                  <SelectItem value="actuator">{isRTL ? 'مشغل' : 'Actuator'}</SelectItem>
                  <SelectItem value="controller">{isRTL ? 'وحدة تحكم' : 'Controller'}</SelectItem>
                  <SelectItem value="gateway">{isRTL ? 'بوابة' : 'Gateway'}</SelectItem>
                  <SelectItem value="display">{isRTL ? 'شاشة' : 'Display'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الفئة' : 'Category'}</Label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData({...formData, category: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature">{isRTL ? 'درجة الحرارة' : 'Temperature'}</SelectItem>
                  <SelectItem value="pressure">{isRTL ? 'الضغط' : 'Pressure'}</SelectItem>
                  <SelectItem value="motion">{isRTL ? 'الحركة' : 'Motion'}</SelectItem>
                  <SelectItem value="power">{isRTL ? 'الطاقة' : 'Power'}</SelectItem>
                  <SelectItem value="production">{isRTL ? 'الإنتاج' : 'Production'}</SelectItem>
                  <SelectItem value="quality">{isRTL ? 'الجودة' : 'Quality'}</SelectItem>
                  <SelectItem value="other">{isRTL ? 'أخرى' : 'Other'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الحالة' : 'Status'}</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">{isRTL ? 'متصل' : 'Online'}</SelectItem>
                  <SelectItem value="offline">{isRTL ? 'غير متصل' : 'Offline'}</SelectItem>
                  <SelectItem value="maintenance">{isRTL ? 'صيانة' : 'Maintenance'}</SelectItem>
                  <SelectItem value="error">{isRTL ? 'خطأ' : 'Error'}</SelectItem>
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
              <Label>{isRTL ? 'الشركة المصنعة' : 'Manufacturer'}</Label>
              <Input value={formData.manufacturer} onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الموديل' : 'Model'}</Label>
              <Input value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الرقم التسلسلي' : 'Serial Number'}</Label>
              <Input value={formData.serialNumber} onChange={(e) => setFormData({...formData, serialNumber: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'إصدار البرنامج الثابت' : 'Firmware Version'}</Label>
              <Input value={formData.firmwareVersion} onChange={(e) => setFormData({...formData, firmwareVersion: e.target.value})} />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'الموقع (إنجليزي)' : 'Location (English)'}</Label>
              <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الموقع (عربي)' : 'Location (Arabic)'}</Label>
              <Input value={formData.locationAr} onChange={(e) => setFormData({...formData, locationAr: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الماكينة (اختياري)' : 'Machine (Optional)'}</Label>
              <Select value={formData.machineId || "none"} onValueChange={(value) => setFormData({...formData, machineId: value === "none" ? "" : value})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر ماكينة...' : 'Select machine...'} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{isRTL ? 'بدون' : 'None'}</SelectItem>
                  {mockMachines.map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.code} - {isRTL ? m.nameAr : m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'خط الإنتاج (اختياري)' : 'Production Line (Optional)'}</Label>
              <Select value={formData.productionLineId || "none"} onValueChange={(value) => setFormData({...formData, productionLineId: value === "none" ? "" : value})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر خط إنتاج...' : 'Select production line...'} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{isRTL ? 'بدون' : 'None'}</SelectItem>
                  {mockProductionLines.map(l => (
                    <SelectItem key={l.id} value={l.id}>
                      {isRTL ? l.nameAr : l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'الوحدة' : 'Unit'}</Label>
              <Input value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} placeholder="°C, kW, etc." />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'معدل أخذ العينات (Hz)' : 'Sampling Rate (Hz)'}</Label>
              <Input type="number" value={formData.samplingRate} onChange={(e) => setFormData({...formData, samplingRate: parseInt(e.target.value) || 1})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'العلامات (Tags)' : 'Tags'}</Label>
            <div className="flex gap-2">
              <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder={isRTL ? 'أضف علامة...' : 'Add tag...'} />
              <Button type="button" size="sm" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg">{isRTL ? 'عتبات الإنذار' : 'Alert Thresholds'}</Label>
              <Button type="button" size="sm" onClick={addThreshold}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'إضافة عتبة' : 'Add Threshold'}
              </Button>
            </div>

            {thresholds.map((threshold, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{isRTL ? `عتبة ${index + 1}` : `Threshold ${index + 1}`}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeThreshold(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>{isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}</Label>
                    <Input value={threshold.name} onChange={(e) => updateThreshold(index, 'name', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}</Label>
                    <Input value={threshold.nameAr} onChange={(e) => updateThreshold(index, 'nameAr', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'القيمة' : 'Value'}</Label>
                    <Input type="number" value={threshold.value} onChange={(e) => updateThreshold(index, 'value', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'المشغل' : 'Operator'}</Label>
                    <Select value={threshold.operator} onValueChange={(value: any) => updateThreshold(index, 'operator', value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gt">{isRTL ? 'أكبر من' : 'Greater than (>)'}</SelectItem>
                        <SelectItem value="lt">{isRTL ? 'أصغر من' : 'Less than (<)'}</SelectItem>
                        <SelectItem value="gte">{isRTL ? 'أكبر أو يساوي' : 'Greater or equal (>=)'}</SelectItem>
                        <SelectItem value="lte">{isRTL ? 'أصغر أو يساوي' : 'Less or equal (<=)'}</SelectItem>
                        <SelectItem value="eq">{isRTL ? 'يساوي' : 'Equal (=)'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'الأهمية' : 'Severity'}</Label>
                    <Select value={threshold.severity} onValueChange={(value: any) => updateThreshold(index, 'severity', value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">{isRTL ? 'معلومات' : 'Info'}</SelectItem>
                        <SelectItem value="warning">{isRTL ? 'تحذير' : 'Warning'}</SelectItem>
                        <SelectItem value="critical">{isRTL ? 'حرج' : 'Critical'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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

