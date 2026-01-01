import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { EmployeeMachineSkill, MachineSkill, mockMachineSkills } from '@/store/machineData';
import { Employee } from '@/store/hrmData';

interface MachineSkillFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  skill?: EmployeeMachineSkill | null;
  onSave: (data: any) => void;
}

export function MachineSkillForm({ open, onOpenChange, employee, skill, onSave }: MachineSkillFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    skillId: skill?.skillId || '',
    proficiencyLevel: skill?.proficiencyLevel || 'beginner',
    certificationDate: skill?.certificationDate || '',
    certificationExpiry: skill?.certificationExpiry || '',
    certificationNumber: skill?.certificationNumber || '',
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        skillId: skill.skillId,
        proficiencyLevel: skill.proficiencyLevel,
        certificationDate: skill.certificationDate || '',
        certificationExpiry: skill.certificationExpiry || '',
        certificationNumber: skill.certificationNumber || '',
      });
    }
  }, [skill, open]);

  const selectedSkill = mockMachineSkills.find(s => s.id === formData.skillId);

  const handleSubmit = () => {
    if (!employee) return;
    onSave({
      ...formData,
      employeeId: employee.id,
      employeeNumber: employee.employeeNumber,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      skillName: selectedSkill?.skillName,
      skillNameAr: selectedSkill?.skillNameAr,
      machineType: selectedSkill?.machineType,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{skill ? (isRTL ? 'تعديل مهارة الماكينة' : 'Edit Machine Skill') : (isRTL ? 'إضافة مهارة ماكينة' : 'Add Machine Skill')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'المهارة' : 'Skill'}</Label>
              <Select value={formData.skillId} onValueChange={(v) => setFormData({...formData, skillId: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر' : 'Select'} /></SelectTrigger>
                <SelectContent>
                  {mockMachineSkills.filter(s => s.isActive).map(s => (
                    <SelectItem key={s.id} value={s.id}>{isRTL ? s.skillNameAr : s.skillName} ({s.level})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'مستوى الكفاءة' : 'Proficiency Level'}</Label>
              <Select value={formData.proficiencyLevel} onValueChange={(v) => setFormData({...formData, proficiencyLevel: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">{isRTL ? 'مبتدئ' : 'Beginner'}</SelectItem>
                  <SelectItem value="intermediate">{isRTL ? 'متوسط' : 'Intermediate'}</SelectItem>
                  <SelectItem value="advanced">{isRTL ? 'متقدم' : 'Advanced'}</SelectItem>
                  <SelectItem value="expert">{isRTL ? 'خبير' : 'Expert'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedSkill?.certificationRequired && (
              <>
                <div className="space-y-2">
                  <Label>{isRTL ? 'تاريخ الشهادة' : 'Certification Date'}</Label>
                  <Input type="date" value={formData.certificationDate} onChange={(e) => setFormData({...formData, certificationDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'تاريخ انتهاء الشهادة' : 'Certification Expiry'}</Label>
                  <Input type="date" value={formData.certificationExpiry} onChange={(e) => setFormData({...formData, certificationExpiry: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>{isRTL ? 'رقم الشهادة' : 'Certification Number'}</Label>
                  <Input value={formData.certificationNumber} onChange={(e) => setFormData({...formData, certificationNumber: e.target.value})} />
                </div>
              </>
            )}
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



