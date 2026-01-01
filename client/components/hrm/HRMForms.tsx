import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2 } from 'lucide-react';
import {
  Employee, ShiftSchedule, LeaveRequest, Payroll, PerformanceReview, Incentive,
  mockDepartments, mockPositions, mockShifts, generateId
} from '@/store/hrmData';

// ==================== EMPLOYEE FORM ====================

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
  onSave: (data: any) => void;
}

export function EmployeeForm({ open, onOpenChange, employee, onSave }: EmployeeFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', firstNameAr: '', lastNameAr: '',
    email: '', phone: '', dateOfBirth: '', gender: 'male' as 'male' | 'female',
    nationality: '', nationalId: '', address: '',
    employmentType: 'full_time' as any, departmentId: '', positionId: '',
    salary: 0, currency: 'AED',
    bankAccount: { bankName: '', accountNumber: '' },
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName, lastName: employee.lastName,
        firstNameAr: employee.firstNameAr, lastNameAr: employee.lastNameAr,
        email: employee.email, phone: employee.phone, dateOfBirth: employee.dateOfBirth,
        gender: employee.gender, nationality: employee.nationality,
        nationalId: employee.nationalId, address: employee.address,
        employmentType: employee.employmentType, departmentId: employee.departmentId,
        positionId: employee.positionId, salary: employee.salary, currency: employee.currency,
        bankAccount: employee.bankAccount,
      });
    }
  }, [employee, open]);

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{employee ? (isRTL ? 'تعديل موظف' : 'Edit Employee') : (isRTL ? 'موظف جديد' : 'New Employee')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'الاسم الأول (إنجليزي)' : 'First Name (English)'}</Label>
              <Input value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الاسم الأول (عربي)' : 'First Name (Arabic)'}</Label>
              <Input value={formData.firstNameAr} onChange={(e) => setFormData({...formData, firstNameAr: e.target.value})} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'القسم' : 'Department'}</Label>
              <Select value={formData.departmentId} onValueChange={(v) => setFormData({...formData, departmentId: v, positionId: ''})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر' : 'Select'} /></SelectTrigger>
                <SelectContent>
                  {mockDepartments.map(d => (
                    <SelectItem key={d.id} value={d.id}>{isRTL ? d.nameAr : d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المنصب' : 'Position'}</Label>
              <Select value={formData.positionId} onValueChange={(v) => setFormData({...formData, positionId: v})}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر' : 'Select'} /></SelectTrigger>
                <SelectContent>
                  {mockPositions.filter(p => p.departmentId === formData.departmentId).map(p => (
                    <SelectItem key={p.id} value={p.id}>{isRTL ? p.titleAr : p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الراتب' : 'Salary'}</Label>
              <Input type="number" value={formData.salary} onChange={(e) => setFormData({...formData, salary: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
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

// ==================== SHIFT SCHEDULE FORM ====================

interface ShiftScheduleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule?: ShiftSchedule | null;
  employeeId?: string;
  onSave: (data: any) => void;
}

export function ShiftScheduleForm({ open, onOpenChange, schedule, employeeId, onSave }: ShiftScheduleFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    employeeId: schedule?.employeeId || employeeId || '',
    shiftId: schedule?.shiftId || '',
    date: schedule?.date || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isRTL ? 'جدولة وردية' : 'Schedule Shift'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{isRTL ? 'الوردية' : 'Shift'}</Label>
            <Select value={formData.shiftId} onValueChange={(v) => setFormData({...formData, shiftId: v})}>
              <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر' : 'Select'} /></SelectTrigger>
              <SelectContent>
                {mockShifts.filter(s => s.isActive).map(s => (
                  <SelectItem key={s.id} value={s.id}>{isRTL ? s.nameAr : s.name} ({s.startTime} - {s.endTime})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'التاريخ' : 'Date'}</Label>
            <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
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

// ==================== LEAVE REQUEST FORM ====================

interface LeaveRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leave?: LeaveRequest | null;
  employeeId?: string;
  onSave: (data: any) => void;
}

export function LeaveRequestForm({ open, onOpenChange, leave, employeeId, onSave }: LeaveRequestFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    employeeId: leave?.employeeId || employeeId || '',
    leaveType: leave?.leaveType || 'annual',
    startDate: leave?.startDate || '',
    endDate: leave?.endDate || '',
    reason: leave?.reason || '',
    reasonAr: leave?.reasonAr || '',
  });

  const handleSubmit = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    onSave({...formData, totalDays: days});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isRTL ? 'طلب إجازة' : 'Leave Request'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع الإجازة' : 'Leave Type'}</Label>
              <Select value={formData.leaveType} onValueChange={(v) => setFormData({...formData, leaveType: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">{isRTL ? 'سنوية' : 'Annual'}</SelectItem>
                  <SelectItem value="sick">{isRTL ? 'مرضية' : 'Sick'}</SelectItem>
                  <SelectItem value="emergency">{isRTL ? 'طوارئ' : 'Emergency'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'من تاريخ' : 'Start Date'}</Label>
              <Input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'إلى تاريخ' : 'End Date'}</Label>
              <Input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'السبب (إنجليزي)' : 'Reason (English)'}</Label>
            <Textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'إرسال' : 'Submit'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

