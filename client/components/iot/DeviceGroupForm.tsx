// ==================== DEVICE GROUP FORM ====================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { DeviceGroup, IoTDevice } from '@/store/iotData';

interface DeviceGroupFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: DeviceGroup | null;
  devices: IoTDevice[];
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function DeviceGroupForm({ open, onOpenChange, group, devices, onSave, isRTL }: DeviceGroupFormProps) {
  const [formData, setFormData] = useState({
    name: group?.name || '',
    nameAr: group?.nameAr || '',
    description: group?.description || '',
    descriptionAr: group?.descriptionAr || '',
    location: group?.location || '',
    isActive: group?.isActive !== undefined ? group.isActive : true,
  });

  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>(group?.deviceIds || []);
  const [tags, setTags] = useState<string[]>(group?.tags || []);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        nameAr: group.nameAr,
        description: group.description || '',
        descriptionAr: group.descriptionAr || '',
        location: group.location || '',
        isActive: group.isActive,
      });
      setSelectedDeviceIds(group.deviceIds || []);
      setTags(group.tags || []);
    }
  }, [group, open]);

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
      deviceIds: selectedDeviceIds,
      tags,
    });
    onOpenChange(false);
  };

  const availableDevices = devices.filter(d => !selectedDeviceIds.includes(d.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{group ? (isRTL ? 'تعديل المجموعة' : 'Edit Group') : (isRTL ? 'مجموعة جديدة' : 'New Group')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}</Label>
              <Input value={formData.nameAr} onChange={(e) => setFormData({...formData, nameAr: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={2} />
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
            <Textarea value={formData.descriptionAr} onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})} rows={2} />
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'الموقع' : 'Location'}</Label>
            <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'الأجهزة' : 'Devices'}</Label>
            <Select value="" onValueChange={(value) => {
              if (value && !selectedDeviceIds.includes(value)) {
                setSelectedDeviceIds([...selectedDeviceIds, value]);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? 'اختر جهاز...' : 'Select device...'} />
              </SelectTrigger>
              <SelectContent>
                {availableDevices.map(device => (
                  <SelectItem key={device.id} value={device.id}>
                    {device.deviceId} - {isRTL ? device.nameAr : device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 flex-wrap mt-2">
              {selectedDeviceIds.map(deviceId => {
                const device = devices.find(d => d.id === deviceId);
                return device ? (
                  <Badge key={deviceId} variant="secondary" className="gap-1">
                    {device.deviceId}
                    <button type="button" onClick={() => setSelectedDeviceIds(selectedDeviceIds.filter(id => id !== deviceId))} className="ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? 'العلامات (Tags)' : 'Tags'}</Label>
            <div className="flex gap-2">
              <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder={isRTL ? 'أضف علامة...' : 'Add tag...'} />
              <Button type="button" size="sm" onClick={addTag}>
                {isRTL ? 'إضافة' : 'Add'}
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

          <div className="space-y-2">
            <Label>{isRTL ? 'الحالة' : 'Status'}</Label>
            <Select value={formData.isActive ? 'active' : 'inactive'} onValueChange={(value) => setFormData({...formData, isActive: value === 'active'})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{isRTL ? 'نشط' : 'Active'}</SelectItem>
                <SelectItem value="inactive">{isRTL ? 'غير نشط' : 'Inactive'}</SelectItem>
              </SelectContent>
            </Select>
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

