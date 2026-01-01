import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ModuleLayout } from '@/components/shared/ModuleLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MegaMenuTabs } from '@/components/shared/MegaMenuTabs';
import {
  Users, UserCheck, Clock, DollarSign, Calendar, Award, TrendingUp, FileText,
  Eye, Edit, Plus, Fingerprint, Calculator, CheckCircle, XCircle, AlertCircle,
  Building2, Briefcase, BarChart3, Settings
} from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  mockEmployees, mockDepartments, mockPositions, mockShifts, mockShiftSchedules,
  mockAttendances, mockLeaveRequests, mockPayrolls, mockIncentives, mockPerformanceReviews,
  Employee, Department, Shift, ShiftSchedule, Attendance, LeaveRequest, Payroll,
  Incentive, PerformanceReview, getEmployeeName, generateId, calculateOvertimeHours
} from '@/store/hrmData';
import {
  mockMachines, mockEmployeeMachineSkills, mockMachineOperatorAssignments,
  Machine, EmployeeMachineSkill, MachineOperatorAssignment, getMachinesByEmployee,
  getEmployeeMachineSkillsByEmployee
} from '@/store/machineData';
import {
  baseCurrencies, mockExchangeRates, convertCurrency, formatCurrency, getExchangeRate
} from '@/store/currencyData';
import {
  EmployeeForm, ShiftScheduleForm, LeaveRequestForm
} from '@/components/hrm/HRMForms';
import { MachineSkillForm } from '@/components/hrm/MachineSkillsForm';

export default function HRM() {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';

  // State
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [departments] = useState<Department[]>(mockDepartments);
  const [shifts] = useState<Shift[]>(mockShifts);
  const [shiftSchedules, setShiftSchedules] = useState<ShiftSchedule[]>(mockShiftSchedules);
  const [attendances] = useState<Attendance[]>(mockAttendances);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [payrolls] = useState<Payroll[]>(mockPayrolls);
  const [incentives] = useState<Incentive[]>(mockIncentives);
  const [performanceReviews] = useState<PerformanceReview[]>(mockPerformanceReviews);

  // Dialog states
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<ShiftSchedule | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [selectedMachineSkill, setSelectedMachineSkill] = useState<EmployeeMachineSkill | null>(null);

  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [isAddMachineSkillOpen, setIsAddMachineSkillOpen] = useState(false);

  // Filter states
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Active tab
  const [activeTab, setActiveTab] = useState<string>('employees');

  // Currency state
  const [displayCurrency] = useState<string>('USD');

  // Currency conversion helper
  const convertToDisplay = (amountUSD: number) => {
    if (displayCurrency === 'USD') return amountUSD;
    return convertCurrency(amountUSD, 'USD', displayCurrency);
  };

  // Stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.employmentStatus === 'active').length;
  const todayPresent = attendances.filter(a => a.status === 'present').length;
  const totalSalaryUSD = employees.reduce((sum, e) => sum + e.salary, 0);
  const avgSalaryUSD = totalEmployees > 0 ? totalSalaryUSD / totalEmployees : 0;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;
  const totalPayrollAmountUSD = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
  const employeesWithMachines = employees.filter(e => e.assignedMachineIds && e.assignedMachineIds.length > 0).length;

  // Mega Menu Tabs Configuration
  const megaMenuTabs = useMemo(() => [
    {
      id: 'employees',
      label: 'Employees',
      labelAr: 'الموظفون',
      subtitle: 'Employee Management',
      subtitleAr: 'إدارة الموظفين',
      icon: <Users className="w-4 h-4" />,
      onClick: () => setActiveTab('employees'),
    },
    {
      id: 'departments',
      label: 'Departments',
      labelAr: 'الأقسام',
      subtitle: 'Department Structure',
      subtitleAr: 'هيكل الأقسام',
      icon: <Building2 className="w-4 h-4" />,
      onClick: () => setActiveTab('departments'),
    },
    {
      id: 'attendance',
      label: 'Attendance',
      labelAr: 'الحضور',
      subtitle: 'Time Tracking',
      subtitleAr: 'تتبع الوقت',
      icon: <Clock className="w-4 h-4" />,
      onClick: () => setActiveTab('attendance'),
    },
    {
      id: 'shifts',
      label: 'Shifts',
      labelAr: 'الورديات',
      subtitle: 'Shift Management',
      subtitleAr: 'إدارة الورديات',
      icon: <Calendar className="w-4 h-4" />,
      onClick: () => setActiveTab('shifts'),
    },
    {
      id: 'leaves',
      label: 'Leaves',
      labelAr: 'الإجازات',
      subtitle: 'Leave Management',
      subtitleAr: 'إدارة الإجازات',
      icon: <FileText className="w-4 h-4" />,
      onClick: () => setActiveTab('leaves'),
    },
    {
      id: 'payroll',
      label: 'Payroll',
      labelAr: 'الرواتب',
      subtitle: 'Payroll Processing',
      subtitleAr: 'معالجة الرواتب',
      icon: <DollarSign className="w-4 h-4" />,
      onClick: () => setActiveTab('payroll'),
    },
    {
      id: 'performance',
      label: 'Performance',
      labelAr: 'الأداء',
      subtitle: 'Performance Reviews',
      subtitleAr: 'تقييمات الأداء',
      icon: <Award className="w-4 h-4" />,
      onClick: () => setActiveTab('performance'),
    },
    {
      id: 'skills',
      label: 'Skills',
      labelAr: 'المهارات',
      subtitle: 'Machine Skills',
      subtitleAr: 'مهارات الماكينات',
      icon: <Briefcase className="w-4 h-4" />,
      onClick: () => setActiveTab('skills'),
    },
    {
      id: 'reports',
      label: 'Reports',
      labelAr: 'التقارير',
      subtitle: 'HR Reports',
      subtitleAr: 'تقارير الموارد البشرية',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => setActiveTab('reports'),
    },
  ], []);

  // Filtered employees
  const filteredEmployees = employees.filter(e => {
    if (deptFilter !== 'all' && e.departmentId !== deptFilter) return false;
    if (statusFilter !== 'all' && e.employmentStatus !== statusFilter) return false;
    return true;
  });

  // Handlers
  const handleSaveEmployee = (data: any) => {
    const newEmp: Employee = {
      ...data,
      id: selectedEmployee?.id || generateId(),
      employeeNumber: selectedEmployee?.employeeNumber || `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      employmentStatus: selectedEmployee?.employmentStatus || 'active',
      hireDate: selectedEmployee?.hireDate || new Date().toISOString().split('T')[0],
      departmentName: departments.find(d => d.id === data.departmentId)?.name || '',
      positionTitle: mockPositions.find(p => p.id === data.positionId)?.title || '',
      positionTitleAr: mockPositions.find(p => p.id === data.positionId)?.titleAr || '',
      emergencyContact: selectedEmployee?.emergencyContact || { name: '', relationship: '', phone: '' },
      skills: selectedEmployee?.skills || [],
      certifications: selectedEmployee?.certifications || [],
      documents: selectedEmployee?.documents || [],
      createdAt: selectedEmployee?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    if (selectedEmployee) {
      setEmployees(employees.map(e => e.id === selectedEmployee.id ? newEmp : e));
      toast({ title: isRTL ? 'تم تحديث الموظف' : 'Employee updated' });
    } else {
      setEmployees([...employees, newEmp]);
      toast({ title: isRTL ? 'تم إضافة الموظف' : 'Employee added' });
    }
    setSelectedEmployee(null);
  };

  const handleSaveSchedule = (data: any) => {
    const emp = employees.find(e => e.id === data.employeeId);
    const shift = shifts.find(s => s.id === data.shiftId);
    const newSchedule: ShiftSchedule = {
      ...data,
      id: generateId(),
      employeeName: emp ? getEmployeeName(emp, i18n.language) : '',
      employeeNumber: emp?.employeeNumber || '',
      shiftName: shift?.name || '',
      shiftCode: shift?.code || '',
      status: 'confirmed',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setShiftSchedules([...shiftSchedules, newSchedule]);
    toast({ title: isRTL ? 'تم جدولة الوردية' : 'Shift scheduled' });
  };

  const handleSaveLeave = (data: any) => {
    const emp = employees.find(e => e.id === data.employeeId);
    const newLeave: LeaveRequest = {
      ...data,
      id: generateId(),
      requestNumber: `LV-${new Date().getFullYear()}-${String(leaveRequests.length + 1).padStart(3, '0')}`,
      employeeName: emp ? getEmployeeName(emp, i18n.language) : '',
      employeeNumber: emp?.employeeNumber || '',
      status: 'pending',
      requestedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests([...leaveRequests, newLeave]);
    toast({ title: isRTL ? 'تم إرسال طلب الإجازة' : 'Leave request submitted' });
  };

  // Employee columns
  const employeeColumns: Column<Employee>[] = [
    {
      key: 'employee',
      header: 'Employee',
      headerAr: 'الموظف',
      render: (item) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {item.firstName[0]}{item.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{getEmployeeName(item, i18n.language)}</p>
            <p className="text-sm text-muted-foreground font-mono">{item.employeeNumber}</p>
          </div>
        </div>
      )
    },
    {
      key: 'position',
      header: 'Position / Department',
      headerAr: 'المنصب / القسم',
      render: (item) => (
        <div>
          <p className="font-medium">{isRTL ? item.positionTitleAr : item.positionTitle}</p>
          <p className="text-sm text-muted-foreground">{isRTL ? item.departmentName : item.departmentName}</p>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact',
      headerAr: 'الاتصال',
      render: (item) => (
        <div className="text-sm">
          <p>{item.email}</p>
          <p className="text-muted-foreground">{item.phone}</p>
        </div>
      )
    },
    {
      key: 'salary',
      header: 'Salary',
      headerAr: 'الراتب',
      render: (item) => <span>{item.salary.toLocaleString()} {item.currency}</span>
    },
    {
      key: 'hireDate',
      header: 'Hire Date',
      headerAr: 'تاريخ التعيين',
      render: (item) => <span className="text-sm">{item.hireDate}</span>
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.employmentStatus} />
    },
    {
      key: 'actions',
      header: 'Actions',
      headerAr: 'الإجراءات',
      render: (item) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setSelectedEmployee(item)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setSelectedEmployee(item); setIsEditEmployeeOpen(true); }}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  ];

  // Attendance columns
  const attendanceColumns: Column<Attendance>[] = [
    {
      key: 'employee',
      header: 'Employee',
      headerAr: 'الموظف',
      render: (item) => (
        <div>
          <p className="font-medium">{item.employeeName}</p>
          <p className="text-sm text-muted-foreground font-mono">{item.employeeNumber}</p>
        </div>
      )
    },
    {
      key: 'date',
      header: 'Date',
      headerAr: 'التاريخ',
      render: (item) => <span className="text-sm">{item.date}</span>
    },
    {
      key: 'shift',
      header: 'Shift',
      headerAr: 'الوردية',
      render: (item) => <span className="text-sm">{item.shiftName}</span>
    },
    {
      key: 'checkIn',
      header: 'Check In',
      headerAr: 'الدخول',
      render: (item) => (
        <div className="text-sm">
          <p className="font-medium">{new Date(item.checkIn.time).toLocaleTimeString()}</p>
          <p className="text-xs text-muted-foreground capitalize">{item.checkIn.method}</p>
        </div>
      )
    },
    {
      key: 'checkOut',
      header: 'Check Out',
      headerAr: 'الخروج',
      render: (item) => item.checkOut ? (
        <div className="text-sm">
          <p className="font-medium">{new Date(item.checkOut.time).toLocaleTimeString()}</p>
          <p className="text-xs text-muted-foreground capitalize">{item.checkOut.method}</p>
        </div>
      ) : <span className="text-muted-foreground">-</span>
    },
    {
      key: 'hours',
      header: 'Hours',
      headerAr: 'الساعات',
      render: (item) => (
        <div className="text-sm">
          <p className="font-medium">Total: {item.totalHours.toFixed(1)}h</p>
          {item.overtimeHours > 0 && <p className="text-green-600">OT: {item.overtimeHours.toFixed(1)}h</p>}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status} />
    },
  ];

  return (
    <ModuleLayout>
      <PageHeader
        icon={Users}
        title="Human Resource Management"
        titleAr="إدارة الموارد البشرية"
        subtitle="Employee management, shifts, attendance, payroll, performance evaluation, incentives"
        subtitleAr="إدارة الموظفين والورديات والحضور والرواتب وتقييم الأداء والحوافز"
        colorGradient="from-cyan-500 to-cyan-600"
        actionLabel="Add Employee"
        actionLabelAr="إضافة موظف"
        onAction={() => setIsAddEmployeeOpen(true)}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <StatCard title="Total Employees" titleAr="إجمالي الموظفين" value={totalEmployees} icon={Users} iconColor="text-cyan-500" />
        <StatCard title="Active" titleAr="نشط" value={activeEmployees} icon={UserCheck} iconColor="text-green-500" />
        <StatCard title="Present Today" titleAr="حاضر اليوم" value={todayPresent} icon={Clock} iconColor="text-blue-500" />
        <StatCard title="Avg. Salary" titleAr="متوسط الراتب" value={formatCurrency(convertToDisplay(avgSalaryUSD), displayCurrency)} icon={DollarSign} iconColor="text-purple-500" />
        <StatCard title="Pending Leaves" titleAr="إجازات معلقة" value={pendingLeaves} icon={Calendar} iconColor="text-orange-500" />
        <StatCard title="Total Payroll" titleAr="إجمالي الرواتب" value={formatCurrency(convertToDisplay(totalPayrollAmountUSD), displayCurrency)} icon={FileText} iconColor="text-indigo-500" />
        <StatCard title="Incentives" titleAr="الحوافز" value={incentives.length} icon={Award} iconColor="text-yellow-500" />
        <StatCard title="Departments" titleAr="الأقسام" value={departments.length} icon={TrendingUp} iconColor="text-pink-500" />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="outline" className="gap-2" onClick={() => setIsAddEmployeeOpen(true)}>
          <Plus className="w-4 h-4" />
          {isRTL ? 'إضافة موظف' : 'Add Employee'}
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setIsAddScheduleOpen(true)}>
          <Calendar className="w-4 h-4" />
          {isRTL ? 'جدولة وردية' : 'Schedule Shift'}
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setIsAddLeaveOpen(true)}>
          <Calendar className="w-4 h-4" />
          {isRTL ? 'طلب إجازة' : 'Leave Request'}
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => toast({ title: isRTL ? 'تم تسجيل الحضور بنجاح' : 'Attendance marked successfully' })}>
          <Fingerprint className="w-4 h-4" />
          {isRTL ? 'تسجيل حضور' : 'Mark Attendance'}
        </Button>
      </div>

      {/* Mega Menu Tabs */}
      <MegaMenuTabs
        tabs={megaMenuTabs.map(tab => ({
          ...tab,
          isActive: activeTab === tab.id,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isRTL={isRTL}
        className="mb-6"
      />

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">

        {/* ==================== EMPLOYEES TAB ==================== */}
        <TabsContent value="employees">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'إدارة الموظفين' : 'Employee Management'}</h3>
              <div className="flex gap-2">
                <Select value={deptFilter} onValueChange={setDeptFilter}>
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder={isRTL ? 'القسم' : 'Department'} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'كل الأقسام' : 'All Departments'}</SelectItem>
                    {departments.map(d => (
                      <SelectItem key={d.id} value={d.id}>{isRTL ? d.nameAr : d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'كل الحالات' : 'All Status'}</SelectItem>
                    <SelectItem value="active">{isRTL ? 'نشط' : 'Active'}</SelectItem>
                    <SelectItem value="on_leave">{isRTL ? 'في إجازة' : 'On Leave'}</SelectItem>
                    <SelectItem value="terminated">{isRTL ? 'منتهي' : 'Terminated'}</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="gap-2" onClick={() => setIsAddEmployeeOpen(true)}>
                  <Plus className="w-4 h-4" />{isRTL ? 'إضافة موظف' : 'Add Employee'}
                </Button>
              </div>
            </div>
            <DataTable data={filteredEmployees} columns={employeeColumns} searchKey="firstName" searchPlaceholder="Search employees..." searchPlaceholderAr="بحث في الموظفين..." />
          </div>
        </TabsContent>

        {/* ==================== DEPARTMENTS TAB ==================== */}
        <TabsContent value="departments">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'الأقسام والإدارات' : 'Departments & Divisions'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map(dept => (
                <div key={dept.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">{dept.code}</span>
                        <Badge className={dept.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {dept.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                        </Badge>
                      </div>
                      <h4 className="text-lg font-medium mt-1">{isRTL ? dept.nameAr : dept.name}</h4>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'الموظفين' : 'Employees'}</span>
                      <span className="font-medium">{dept.employeeCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'المدير' : 'Manager'}</span>
                      <span>{dept.managerName || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'الموقع' : 'Location'}</span>
                      <span>{dept.location}</span>
                    </div>
                    {dept.budget && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isRTL ? 'الميزانية' : 'Budget'}</span>
                        <span className="font-medium">{dept.budget.toLocaleString()} AED</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== SHIFTS TAB ==================== */}
        <TabsContent value="shifts">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'إدارة الورديات' : 'Shift Management'}</h3>
              <Button className="gap-2" onClick={() => setIsAddScheduleOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'جدولة جديدة' : 'New Schedule'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {shifts.filter(s => s.isActive).map(shift => (
                <div key={shift.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: shift.color }}></div>
                    <div>
                      <h4 className="font-medium">{isRTL ? shift.nameAr : shift.name}</h4>
                      <p className="text-sm text-muted-foreground font-mono">{shift.code}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'الوقت' : 'Time'}</span>
                      <span className="font-medium">{shift.startTime} - {shift.endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'المدة' : 'Duration'}</span>
                      <span>{shift.duration} {isRTL ? 'ساعة' : 'hours'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'استراحة' : 'Break'}</span>
                      <span>{shift.breakDuration} {isRTL ? 'دقيقة' : 'mins'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <h4 className="text-md font-medium mb-3">{isRTL ? 'جدول الورديات القادمة' : 'Upcoming Shift Schedule'}</h4>
            <div className="space-y-2">
              {shiftSchedules.slice(0, 10).map(sched => (
                <div key={sched.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: shifts.find(s => s.id === sched.shiftId)?.color }}></div>
                    <div>
                      <p className="font-medium">{sched.employeeName}</p>
                      <p className="text-sm text-muted-foreground">{isRTL ? sched.shiftName : sched.shiftName} • {sched.date}</p>
                    </div>
                  </div>
                  <StatusBadge status={sched.status} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== ATTENDANCE TAB ==================== */}
        <TabsContent value="attendance">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'تتبع الحضور' : 'Attendance Tracking'}</h3>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Fingerprint className="w-4 h-4" />
                  {isRTL ? 'تسجيل حضور' : 'Check In'}
                </Button>
                <Button variant="outline" className="gap-2">
                  <Fingerprint className="w-4 h-4" />
                  {isRTL ? 'تسجيل خروج' : 'Check Out'}
                </Button>
              </div>
            </div>
            
            {/* Attendance Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { status: 'present', count: attendances.filter(a => a.status === 'present').length, color: 'bg-green-500' },
                { status: 'late', count: attendances.filter(a => a.status === 'late').length, color: 'bg-yellow-500' },
                { status: 'absent', count: attendances.filter(a => a.status === 'absent').length, color: 'bg-red-500' },
                { status: 'on_leave', count: attendances.filter(a => a.status === 'on_leave').length, color: 'bg-blue-500' },
              ].map(item => (
                <div key={item.status} className="bg-muted/30 rounded-lg p-4 text-center">
                  <StatusBadge status={item.status} />
                  <p className="text-3xl font-bold mt-2">{item.count}</p>
                </div>
              ))}
            </div>

            <DataTable data={attendances} columns={attendanceColumns} searchKey="employeeName" />
          </div>
        </TabsContent>

        {/* ==================== LEAVES TAB ==================== */}
        <TabsContent value="leaves">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{isRTL ? 'طلبات الإجازات' : 'Leave Requests'}</h3>
              <Button className="gap-2" onClick={() => setIsAddLeaveOpen(true)}>
                <Plus className="w-4 h-4" />{isRTL ? 'طلب إجازة' : 'Request Leave'}
              </Button>
            </div>
            <div className="space-y-4">
              {leaveRequests.map(leave => {
                const typeLabels: Record<string, { en: string; ar: string }> = {
                  annual: { en: 'Annual', ar: 'سنوية' },
                  sick: { en: 'Sick', ar: 'مرضية' },
                  emergency: { en: 'Emergency', ar: 'طوارئ' },
                  maternity: { en: 'Maternity', ar: 'أمومة' },
                  paternity: { en: 'Paternity', ar: 'أبوة' },
                };
                return (
                  <div key={leave.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-medium">{leave.requestNumber}</span>
                          <Badge>{isRTL ? typeLabels[leave.leaveType]?.ar : typeLabels[leave.leaveType]?.en}</Badge>
                          <StatusBadge status={leave.status} />
                        </div>
                        <h4 className="font-medium">{leave.employeeName}</h4>
                        <p className="text-sm text-muted-foreground">{leave.startDate} - {leave.endDate} ({leave.totalDays} {isRTL ? 'أيام' : 'days'})</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{leave.requestedDate}</span>
                    </div>
                    <p className="text-sm mb-3">{isRTL ? leave.reasonAr : leave.reason}</p>
                    {leave.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" className="gap-1"><CheckCircle className="w-4 h-4" />{isRTL ? 'موافقة' : 'Approve'}</Button>
                        <Button size="sm" variant="outline" className="gap-1 text-red-600"><XCircle className="w-4 h-4" />{isRTL ? 'رفض' : 'Reject'}</Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ==================== PAYROLL TAB ==================== */}
        <TabsContent value="payroll">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'معالجة الرواتب' : 'Payroll Processing'}</h3>
            <div className="space-y-4">
              {payrolls.map(payroll => (
                <div key={payroll.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-medium">{payroll.payrollNumber}</span>
                        <StatusBadge status={payroll.status} />
                      </div>
                      <h4 className="font-medium">{payroll.employeeName}</h4>
                      <p className="text-sm text-muted-foreground">{payroll.period.month} {payroll.period.year}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'الراتب الأساسي' : 'Base Salary'}</p>
                      <p className="text-lg font-medium">{payroll.baseSalary.toLocaleString()} {payroll.currency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'الإضافي' : 'Overtime'}</p>
                      <p className="text-lg font-medium text-green-600">+{payroll.overtimeAmount.toLocaleString()} {payroll.currency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'الحوافز' : 'Incentives'}</p>
                      <p className="text-lg font-medium text-green-600">+{payroll.incentives.toLocaleString()} {payroll.currency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'الخصومات' : 'Deductions'}</p>
                      <p className="text-lg font-medium text-red-600">-{payroll.totalDeductions.toLocaleString()} {payroll.currency}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-medium">{isRTL ? 'الراتب الصافي' : 'Net Salary'}</span>
                    <span className="text-2xl font-bold text-primary">{payroll.netSalary.toLocaleString()} {payroll.currency}</span>
                  </div>

                  {payroll.allowances.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">{isRTL ? 'البدلات' : 'Allowances'}</p>
                      <div className="flex flex-wrap gap-2">
                        {payroll.allowances.map(a => (
                          <Badge key={a.id} variant="outline">{a.name}: +{a.amount} {payroll.currency}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== INCENTIVES TAB ==================== */}
        <TabsContent value="incentives">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'برامج الحوافز' : 'Incentive Programs'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incentives.map(inc => (
                <div key={inc.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium">{isRTL ? inc.nameAr : inc.name}</span>
                        <Badge className={inc.type === 'production' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>{inc.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{inc.employeeName}</p>
                      <p className="text-sm text-muted-foreground">{inc.period.startDate} - {inc.period.endDate}</p>
                    </div>
                    <StatusBadge status={inc.status} />
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{isRTL ? 'الهدف' : 'Target'}</span>
                      <span className="font-medium">{inc.target.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{isRTL ? 'الفعلي' : 'Actual'}</span>
                      <span className="font-medium">{inc.actual.toLocaleString()}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{isRTL ? 'معدل التحقيق' : 'Achievement Rate'}</span>
                        <span className="font-medium">{inc.achievementRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(inc.achievementRate, 100)} className="h-2" />
                    </div>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{isRTL ? 'المبلغ' : 'Amount'}</span>
                    <span className="text-xl font-bold text-green-600">{inc.calculatedAmount.toLocaleString()} AED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== PERFORMANCE TAB ==================== */}
        <TabsContent value="performance">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'تقييم الأداء' : 'Performance Evaluation'}</h3>
            <div className="space-y-4">
              {performanceReviews.map(review => (
                <div key={review.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-medium">{review.reviewNumber}</span>
                        <Badge>{review.reviewType}</Badge>
                        <StatusBadge status={review.status} />
                      </div>
                      <h4 className="font-medium">{review.employeeName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {review.reviewPeriod.startDate} - {review.reviewPeriod.endDate} • Reviewed by {review.reviewerName}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{review.overallRating.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">/ 5.0</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium mb-2">{isRTL ? 'الإنجازات' : 'Achievements'}</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {review.achievements.map((a, i) => <li key={i}>• {isRTL ? review.achievementsAr[i] : a}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">{isRTL ? 'مجالات التحسين' : 'Areas for Improvement'}</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {review.areasForImprovement.map((a, i) => <li key={i}>• {isRTL ? review.areasForImprovementAr[i] : a}</li>)}
                      </ul>
                    </div>
                  </div>

                  {review.goals.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-2">{isRTL ? 'الأهداف' : 'Goals'}</p>
                      <div className="space-y-2">
                        {review.goals.map(goal => (
                          <div key={goal.id} className="bg-muted/20 rounded p-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">{isRTL ? goal.titleAr : goal.title}</span>
                              <span className="text-sm font-medium">{goal.rating.toFixed(1)}/5</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{isRTL ? 'الهدف' : 'Target'}: {goal.target} | {isRTL ? 'الفعلي' : 'Actual'}: {goal.actual}</span>
                              <span>{goal.weight}% {isRTL ? 'وزن' : 'weight'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== REPORTS TAB ==================== */}
        <TabsContent value="reports">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'تقارير الموارد البشرية' : 'HR Reports'}</h3>
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'قريباً: تقارير الموارد البشرية' : 'Coming soon: HR Reports'}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Forms and Dialogs */}
      <EmployeeForm open={isAddEmployeeOpen || isEditEmployeeOpen} onOpenChange={(open) => { setIsAddEmployeeOpen(open && !selectedEmployee); setIsEditEmployeeOpen(open && !!selectedEmployee); if (!open) setSelectedEmployee(null); }} employee={selectedEmployee} onSave={handleSaveEmployee} />
      <ShiftScheduleForm open={isAddScheduleOpen} onOpenChange={setIsAddScheduleOpen} onSave={handleSaveSchedule} />
      <LeaveRequestForm open={isAddLeaveOpen} onOpenChange={setIsAddLeaveOpen} onSave={handleSaveLeave} />
    </ModuleLayout>
  );
}
