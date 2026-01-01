import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ModuleLayout } from '@/components/shared/ModuleLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MegaMenuTabs } from '@/components/shared/MegaMenuTabs';
import { Cpu, Activity, Zap, Wrench, AlertTriangle, Eye, Edit, Plus, Bell, Radio, BarChart3, Filter, Download, RefreshCw, Calendar, TrendingUp, Clock, CheckCircle, XCircle, Info, Network, Settings, Database } from 'lucide-react';
import { mockMachines, Machine } from '@/store/machineData';
import { mockProductionLines, getLineName } from '@/store/productionData';
import { 
  mockIoTDevices, mockAlerts, mockSensorReadings, mockMachineMetrics, mockDeviceGroups,
  getDeviceName, getDeviceStatusColor, getAlertSeverityColor, getOnlineDevicesCount, 
  getActiveAlertsCount, getCriticalAlertsCount, generateId,
  IoTDevice, Alert, SensorReading, MachineMetric, DeviceGroup
} from '@/store/iotData';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DeviceForm } from '@/components/iot/IoTForms';
import { AlertDialog } from '@/components/iot/AlertDialog';
import { DeviceGroupForm } from '@/components/iot/DeviceGroupForm';

export default function IoT() {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';

  // State
  const [devices, setDevices] = useState<IoTDevice[]>(mockIoTDevices);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [readings] = useState<SensorReading[]>(mockSensorReadings);
  const [metrics] = useState<MachineMetric[]>(mockMachineMetrics);
  const [groups, setGroups] = useState<DeviceGroup[]>(mockDeviceGroups);

  // Dialog states
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<DeviceGroup | null>(null);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [isEditDeviceOpen, setIsEditDeviceOpen] = useState(false);
  const [isViewAlertOpen, setIsViewAlertOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);

  // Filters
  const [alertFilter, setAlertFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved' | 'critical' | 'warning' | 'info'>('all');
  const [readingTimeRange, setReadingTimeRange] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h');
  const [selectedMachine, setSelectedMachine] = useState<string>('all');

  // Active tab
  const [activeTab, setActiveTab] = useState<string>('devices');
  
  // Stats
  const totalDevices = devices.length;
  const onlineDevices = getOnlineDevicesCount(devices);
  const activeAlerts = getActiveAlertsCount(alerts);
  const criticalAlerts = getCriticalAlertsCount(alerts);
  const avgResponseTime = 45; // ms (mock)

  // Mega Menu Tabs Configuration
  const megaMenuTabs = useMemo(() => [
    {
      id: 'devices',
      label: 'Devices',
      labelAr: 'الأجهزة',
      subtitle: 'IoT Devices',
      subtitleAr: 'أجهزة إنترنت الأشياء',
      icon: <Cpu className="w-4 h-4" />,
      onClick: () => setActiveTab('devices'),
    },
    {
      id: 'alerts',
      label: 'Alerts',
      labelAr: 'التنبيهات',
      subtitle: 'System Alerts',
      subtitleAr: 'تنبيهات النظام',
      icon: <Bell className="w-4 h-4" />,
      onClick: () => setActiveTab('alerts'),
    },
    {
      id: 'readings',
      label: 'Sensor Readings',
      labelAr: 'قراءات المستشعرات',
      subtitle: 'Real-time Data',
      subtitleAr: 'البيانات الفورية',
      icon: <Activity className="w-4 h-4" />,
      onClick: () => setActiveTab('readings'),
    },
    {
      id: 'metrics',
      label: 'Metrics',
      labelAr: 'المقاييس',
      subtitle: 'Machine Metrics',
      subtitleAr: 'مقاييس الماكينات',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => setActiveTab('metrics'),
    },
    {
      id: 'groups',
      label: 'Groups',
      labelAr: 'المجموعات',
      subtitle: 'Device Groups',
      subtitleAr: 'مجموعات الأجهزة',
      icon: <Network className="w-4 h-4" />,
      onClick: () => setActiveTab('groups'),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      labelAr: 'التحليلات',
      subtitle: 'Data Analytics',
      subtitleAr: 'تحليل البيانات',
      icon: <TrendingUp className="w-4 h-4" />,
      onClick: () => setActiveTab('analytics'),
    },
    {
      id: 'settings',
      label: 'Settings',
      labelAr: 'الإعدادات',
      subtitle: 'Device Settings',
      subtitleAr: 'إعدادات الأجهزة',
      icon: <Settings className="w-4 h-4" />,
      onClick: () => setActiveTab('settings'),
    },
  ], []);
  
  // Filtered alerts
  const filteredAlerts = alerts.filter(alert => {
    if (alertFilter === 'all') return true;
    if (alertFilter === 'active') return alert.status === 'active';
    if (alertFilter === 'acknowledged') return alert.status === 'acknowledged';
    if (alertFilter === 'resolved') return alert.status === 'resolved';
    if (alertFilter === 'critical') return alert.severity === 'critical' && alert.status === 'active';
    if (alertFilter === 'warning') return alert.severity === 'warning' && alert.status === 'active';
    if (alertFilter === 'info') return alert.severity === 'info' && alert.status === 'active';
    return true;
  });
  
  // Filtered readings by time range
  const getFilteredReadings = () => {
    const now = new Date();
    let startDate = new Date();
    switch (readingTimeRange) {
      case '1h': startDate.setHours(now.getHours() - 1); break;
      case '6h': startDate.setHours(now.getHours() - 6); break;
      case '24h': startDate.setHours(now.getHours() - 24); break;
      case '7d': startDate.setDate(now.getDate() - 7); break;
      case '30d': startDate.setDate(now.getDate() - 30); break;
    }
    return readings.filter(r => new Date(r.timestamp) >= startDate);
  };
  
  const filteredReadings = getFilteredReadings();
  
  // Filtered machines
  const filteredMachines = selectedMachine === 'all' 
    ? mockMachines.filter(m => devices.some(d => d.machineId === m.id))
    : mockMachines.filter(m => m.id === selectedMachine && devices.some(d => d.machineId === m.id));

  // Device columns
  const deviceColumns: Column<IoTDevice>[] = [
    {
      key: 'deviceId',
      header: 'Device ID',
      headerAr: 'معرف الجهاز',
      render: (item) => <span className="font-mono text-sm font-medium">{item.deviceId}</span>
    },
    {
      key: 'name',
      header: 'Device Name',
      headerAr: 'اسم الجهاز',
      render: (item) => (
        <div>
          <p className="font-medium">{getDeviceName(item, i18n.language)}</p>
          <p className="text-xs text-muted-foreground">{item.manufacturer} {item.model}</p>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      headerAr: 'النوع',
      render: (item) => <Badge variant="outline" className="capitalize">{item.type}</Badge>
    },
    {
      key: 'category',
      header: 'Category',
      headerAr: 'الفئة',
      render: (item) => <span className="capitalize text-sm">{item.category}</span>
    },
    {
      key: 'location',
      header: 'Location',
      headerAr: 'الموقع',
      render: (item) => isRTL ? item.locationAr : item.location
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={item.status} />
          <span className={`w-2 h-2 rounded-full ${getDeviceStatusColor(item.status).replace('text-', 'bg-')}`} />
        </div>
      )
    },
    {
      key: 'lastSeen',
      header: 'Last Seen',
      headerAr: 'آخر ظهور',
      render: (item) => {
        const date = new Date(item.lastSeen);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return <span className="text-green-600 text-sm">{isRTL ? 'الآن' : 'Now'}</span>;
        if (diffMins < 60) return <span className="text-sm">{diffMins} {isRTL ? 'د' : 'm'}</span>;
        const diffHours = Math.floor(diffMins / 60);
        return <span className="text-sm">{diffHours} {isRTL ? 'س' : 'h'}</span>;
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      headerAr: 'الإجراءات',
      render: (item) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedDevice(item); setIsEditDeviceOpen(true); }}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Alert columns
  const alertColumns: Column<Alert>[] = [
    {
      key: 'deviceName',
      header: 'Device',
      headerAr: 'الجهاز',
      render: (item) => <span className="font-medium">{item.deviceName}</span>
    },
    {
      key: 'type',
      header: 'Type',
      headerAr: 'النوع',
      render: (item) => <Badge variant="outline" className="capitalize">{item.type.replace('_', ' ')}</Badge>
    },
    {
      key: 'severity',
      header: 'Severity',
      headerAr: 'الأهمية',
      render: (item) => (
        <Badge className={getAlertSeverityColor(item.severity)}>
          {isRTL 
            ? (item.severity === 'critical' ? 'حرج' : item.severity === 'warning' ? 'تحذير' : 'معلومات')
            : item.severity.toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'title',
      header: 'Alert',
      headerAr: 'التنبيه',
      render: (item) => (
        <div>
          <p className="font-medium">{isRTL ? item.titleAr : item.title}</p>
          <p className="text-xs text-muted-foreground">{isRTL ? item.messageAr : item.message}</p>
        </div>
      )
    },
    {
      key: 'value',
      header: 'Value',
      headerAr: 'القيمة',
      render: (item) => item.value ? `${item.value}${item.threshold ? ` / ${item.threshold}` : ''}` : '-'
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'createdAt',
      header: 'Created',
      headerAr: 'تاريخ الإنشاء',
      render: (item) => {
        const date = new Date(item.createdAt);
        return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      headerAr: 'الإجراءات',
      render: (item) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedAlert(item); setIsViewAlertOpen(true); }}>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Handlers
  const handleSaveDevice = (data: any) => {
    const newDevice: IoTDevice = {
      ...data,
      id: selectedDevice?.id || generateId(),
      lastSeen: selectedDevice?.lastSeen || new Date().toISOString(),
      batteryLevel: selectedDevice?.batteryLevel,
      signalStrength: selectedDevice?.signalStrength,
      createdAt: selectedDevice?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    if (selectedDevice) {
      setDevices(devices.map(d => d.id === selectedDevice.id ? newDevice : d));
      toast({ title: isRTL ? 'تم تحديث الجهاز' : 'Device updated' });
    } else {
      setDevices([...devices, newDevice]);
      toast({ title: isRTL ? 'تم إضافة الجهاز' : 'Device added' });
    }
    setSelectedDevice(null);
    setIsAddDeviceOpen(false);
    setIsEditDeviceOpen(false);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(a => a.id === alertId ? { ...a, status: 'acknowledged' as const, acknowledgedBy: 'current-user', acknowledgedAt: new Date().toISOString() } : a));
    toast({ title: isRTL ? 'تم الاعتراف بالتنبيه' : 'Alert acknowledged' });
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(alerts.map(a => a.id === alertId ? { ...a, status: 'resolved' as const, resolvedAt: new Date().toISOString() } : a));
    toast({ title: isRTL ? 'تم حل التنبيه' : 'Alert resolved' });
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.map(a => a.id === alertId ? { ...a, status: 'dismissed' as const } : a));
    toast({ title: isRTL ? 'تم تجاهل التنبيه' : 'Alert dismissed' });
  };

  const handleSaveGroup = (data: any) => {
    const newGroup: DeviceGroup = {
      ...data,
      id: selectedGroup?.id || generateId(),
      createdAt: selectedGroup?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    if (selectedGroup) {
      setGroups(groups.map(g => g.id === selectedGroup.id ? newGroup : g));
      toast({ title: isRTL ? 'تم تحديث المجموعة' : 'Group updated' });
    } else {
      setGroups([...groups, newGroup]);
      toast({ title: isRTL ? 'تم إضافة المجموعة' : 'Group added' });
    }
    setSelectedGroup(null);
    setIsAddGroupOpen(false);
    setIsEditGroupOpen(false);
  };

  return (
    <ModuleLayout>
      <PageHeader
        icon={Cpu}
        title="IoT & Machine Integration"
        titleAr="إنترنت الأشياء والآلات"
        subtitle="IoT Devices, Real-time Monitoring, Alerts, Machine Metrics, Production Integration"
        subtitleAr="أجهزة إنترنت الأشياء، المراقبة الفورية، التنبيهات، مقاييس الماكينات، التكامل مع الإنتاج"
        colorGradient="from-purple-500 to-purple-600"
        actionLabel="Add Device"
        actionLabelAr="إضافة جهاز"
        onAction={() => setIsAddDeviceOpen(true)}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Devices"
          titleAr="إجمالي الأجهزة"
          value={totalDevices}
          icon={Cpu}
          iconColor="text-purple-500"
        />
        <StatCard
          title="Online Devices"
          titleAr="الأجهزة المتصلة"
          value={onlineDevices}
          change={totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0}
          changeType="increase"
          icon={Activity}
          iconColor="text-green-500"
        />
        <StatCard
          title="Active Alerts"
          titleAr="التنبيهات النشطة"
          value={activeAlerts}
          change={criticalAlerts}
          changeType="decrease"
          icon={Bell}
          iconColor={criticalAlerts > 0 ? "text-red-500" : "text-yellow-500"}
        />
        <StatCard
          title="Avg Response"
          titleAr="متوسط الاستجابة"
          value={`${avgResponseTime}ms`}
          icon={Zap}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Connected Machines"
          titleAr="الماكينات المتصلة"
          value={devices.filter(d => d.machineId).length}
          icon={Wrench}
          iconColor="text-orange-500"
        />
      </div>

      {/* Real-time Alerts Banner */}
      {criticalAlerts > 0 && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold text-red-900 dark:text-red-100">
                {isRTL ? `${criticalAlerts} تنبيه حرج نشط` : `${criticalAlerts} Critical Alert${criticalAlerts > 1 ? 's' : ''} Active`}
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                {isRTL ? 'يرجى مراجعة التنبيهات الحرجة فوراً' : 'Please review critical alerts immediately'}
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
              {isRTL ? 'عرض التنبيهات' : 'View Alerts'}
            </Button>
          </div>
        </div>
      )}

      {/* Real-time Monitoring Dashboard */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-500 animate-pulse" />
          {isRTL ? 'المراقبة الفورية' : 'Real-time Monitoring'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {devices.filter(d => d.status === 'online' && d.isActive).slice(0, 8).map(device => {
            const latestReading = readings.filter(r => r.deviceId === device.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            return (
              <div key={device.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-sm">{getDeviceName(device, i18n.language)}</p>
                    <p className="text-xs text-muted-foreground">{device.deviceId}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${getDeviceStatusColor(device.status).replace('text-', 'bg-')} animate-pulse`} />
                </div>
                {latestReading && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{isRTL ? 'القيمة الحالية' : 'Current Value'}</span>
                      <span className="text-lg font-bold">{latestReading.value} {device.config.unit}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">{isRTL ? 'الحالة' : 'Quality'}</span>
                      <Badge variant={latestReading.quality === 'good' ? 'default' : latestReading.quality === 'warning' ? 'secondary' : 'destructive'} className="text-xs">
                        {latestReading.quality}
                      </Badge>
                    </div>
                  </div>
                )}
                {device.signalStrength && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {isRTL ? 'قوة الإشارة' : 'Signal'}: {device.signalStrength} dBm
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">

        <TabsContent value="devices">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isRTL ? 'أجهزة إنترنت الأشياء' : 'IoT Devices'}</h3>
              <Button onClick={() => setIsAddDeviceOpen(true)}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'جهاز جديد' : 'New Device'}
              </Button>
            </div>
            <DataTable
              data={devices}
              columns={deviceColumns}
              searchKey="name"
              searchPlaceholder={isRTL ? 'البحث في الأجهزة...' : 'Search devices...'}
              searchPlaceholderAr="البحث في الأجهزة..."
            />
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">{isRTL ? 'التنبيهات' : 'Alerts'}</h3>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{isRTL ? `نشط: ${activeAlerts}` : `Active: ${activeAlerts}`}</Badge>
                  {criticalAlerts > 0 && (
                    <Badge variant="destructive">{isRTL ? `حرج: ${criticalAlerts}` : `Critical: ${criticalAlerts}`}</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={alertFilter} onValueChange={(v: any) => setAlertFilter(v)}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 me-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
                    <SelectItem value="active">{isRTL ? 'نشط' : 'Active'}</SelectItem>
                    <SelectItem value="critical">{isRTL ? 'حرج' : 'Critical'}</SelectItem>
                    <SelectItem value="warning">{isRTL ? 'تحذير' : 'Warning'}</SelectItem>
                    <SelectItem value="info">{isRTL ? 'معلومات' : 'Info'}</SelectItem>
                    <SelectItem value="acknowledged">{isRTL ? 'معترف به' : 'Acknowledged'}</SelectItem>
                    <SelectItem value="resolved">{isRTL ? 'محلول' : 'Resolved'}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => {/* Export */}}>
                  <Download className="w-4 h-4 me-2" />
                  {isRTL ? 'تصدير' : 'Export'}
                </Button>
              </div>
            </div>
            
            {/* Alert Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'إجمالي' : 'Total'}</p>
                      <p className="text-2xl font-bold">{alerts.length}</p>
                    </div>
                    <Bell className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'نشط' : 'Active'}</p>
                      <p className="text-2xl font-bold text-orange-600">{activeAlerts}</p>
                    </div>
                    <Activity className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'حرج' : 'Critical'}</p>
                      <p className="text-2xl font-bold text-red-600">{criticalAlerts}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'محلول' : 'Resolved'}</p>
                      <p className="text-2xl font-bold text-green-600">{alerts.filter(a => a.status === 'resolved').length}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <DataTable
              data={filteredAlerts}
              columns={alertColumns}
              searchKey="deviceName"
              searchPlaceholder={isRTL ? 'البحث في التنبيهات...' : 'Search alerts...'}
              searchPlaceholderAr="البحث في التنبيهات..."
            />
          </div>
        </TabsContent>

        <TabsContent value="readings">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-lg font-semibold">{isRTL ? 'قراءات المستشعرات' : 'Sensor Readings'}</h3>
              <div className="flex gap-2">
                <Select value={readingTimeRange} onValueChange={(v: any) => setReadingTimeRange(v)}>
                  <SelectTrigger className="w-32">
                    <Calendar className="w-4 h-4 me-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">{isRTL ? 'ساعة' : '1 Hour'}</SelectItem>
                    <SelectItem value="6h">{isRTL ? '6 ساعات' : '6 Hours'}</SelectItem>
                    <SelectItem value="24h">{isRTL ? '24 ساعة' : '24 Hours'}</SelectItem>
                    <SelectItem value="7d">{isRTL ? '7 أيام' : '7 Days'}</SelectItem>
                    <SelectItem value="30d">{isRTL ? '30 يوم' : '30 Days'}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => {/* Export */}}>
                  <Download className="w-4 h-4 me-2" />
                  {isRTL ? 'تصدير' : 'Export'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => {/* Refresh */}}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Readings Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'إجمالي القراءات' : 'Total Readings'}</p>
                      <p className="text-2xl font-bold">{filteredReadings.length}</p>
                    </div>
                    <Radio className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'جيدة' : 'Good'}</p>
                      <p className="text-2xl font-bold text-green-600">{filteredReadings.filter(r => r.quality === 'good').length}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'تحذير' : 'Warning'}</p>
                      <p className="text-2xl font-bold text-yellow-600">{filteredReadings.filter(r => r.quality === 'warning').length}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'خطأ' : 'Error'}</p>
                      <p className="text-2xl font-bold text-red-600">{filteredReadings.filter(r => r.quality === 'error').length}</p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <DataTable
              data={filteredReadings}
              columns={[
                { key: 'deviceName', header: 'Device', headerAr: 'الجهاز', render: (item) => <span className="font-medium">{item.deviceName}</span> },
                { key: 'timestamp', header: 'Timestamp', headerAr: 'الوقت', render: (item) => (
                  <div>
                    <p className="font-medium">{new Date(item.timestamp).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleTimeString()}</p>
                  </div>
                )},
                { key: 'value', header: 'Value', headerAr: 'القيمة', render: (item) => (
                  <div>
                    <span className="font-bold text-lg">{item.value}</span>
                    <span className="text-sm text-muted-foreground ms-1">{item.unit}</span>
                  </div>
                )},
                { key: 'quality', header: 'Quality', headerAr: 'الجودة', render: (item) => <StatusBadge status={item.quality} /> },
                { key: 'location', header: 'Location', headerAr: 'الموقع', render: (item) => item.location || '-' },
              ]}
              searchKey="deviceName"
              searchPlaceholder={isRTL ? 'البحث في القراءات...' : 'Search readings...'}
              searchPlaceholderAr="البحث في القراءات..."
            />
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-lg font-semibold">{isRTL ? 'الماكينات المتصلة' : 'Connected Machines'}</h3>
              <div className="flex gap-2">
                <Select value={selectedMachine} onValueChange={setSelectedMachine}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={isRTL ? 'اختر ماكينة...' : 'Select machine...'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'الكل' : 'All Machines'}</SelectItem>
                    {mockMachines.filter(m => devices.some(d => d.machineId === m.id)).map(machine => (
                      <SelectItem key={machine.id} value={machine.id}>
                        {isRTL ? machine.nameAr : machine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Machine Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'إجمالي الماكينات' : 'Total Machines'}</p>
                      <p className="text-2xl font-bold">{filteredMachines.length}</p>
                    </div>
                    <Wrench className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'قيد التشغيل' : 'Running'}</p>
                      <p className="text-2xl font-bold text-green-600">
                        {filteredMachines.filter(m => m.status === 'running').length}
                      </p>
                    </div>
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'متوسط الكفاءة' : 'Avg Efficiency'}</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {filteredMachines.length > 0 
                          ? Math.round(metrics.filter(m => filteredMachines.some(fm => fm.id === m.machineId)).reduce((sum, m) => sum + m.efficiency, 0) / Math.max(metrics.filter(m => filteredMachines.some(fm => fm.id === m.machineId)).length, 1))
                          : 0}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'صيانة' : 'Maintenance'}</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {filteredMachines.filter(m => m.status === 'maintenance').length}
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMachines.map(machine => {
                const deviceMetrics = metrics.filter(m => m.machineId === machine.id);
                const latestMetric = deviceMetrics.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                const avgEfficiency = deviceMetrics.length > 0 
                  ? deviceMetrics.reduce((sum, m) => sum + m.efficiency, 0) / deviceMetrics.length 
                  : 0;
                return (
                  <Card key={machine.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{isRTL ? machine.nameAr : machine.name}</CardTitle>
                          <CardDescription className="text-xs">{machine.code}</CardDescription>
                        </div>
                        <StatusBadge status={machine.status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {latestMetric ? (
                        <>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'السرعة' : 'Speed'}</p>
                              <p className="font-bold text-lg">{latestMetric.speed} <span className="text-xs font-normal">{isRTL ? 'دورة/د' : 'RPM'}</span></p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'الكفاءة' : 'Efficiency'}</p>
                              <p className="font-bold text-lg">{latestMetric.efficiency}%</p>
                              <Progress value={latestMetric.efficiency} className="h-2 mt-1" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'الطاقة' : 'Power'}</p>
                              <p className="font-bold text-lg">{latestMetric.powerConsumption} <span className="text-xs font-normal">W</span></p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'الدورات' : 'Cycles'}</p>
                              <p className="font-bold text-lg">{latestMetric.cycleCount}</p>
                            </div>
                          </div>
                          {latestMetric.temperature !== undefined && (
                            <div className="pt-3 border-t">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{isRTL ? 'درجة الحرارة' : 'Temperature'}</span>
                                <span className="font-semibold">{latestMetric.temperature}°C</span>
                              </div>
                            </div>
                          )}
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                              <span>{isRTL ? 'آخر تحديث' : 'Last Update'}</span>
                              <span>{new Date(latestMetric.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          {isRTL ? 'لا توجد بيانات' : 'No metrics available'}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-lg font-semibold">{isRTL ? 'التحليلات والتقارير' : 'Analytics & Reports'}</h3>
              <div className="flex gap-2">
                <Select value={readingTimeRange} onValueChange={(v: any) => setReadingTimeRange(v)}>
                  <SelectTrigger className="w-32">
                    <Calendar className="w-4 h-4 me-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">{isRTL ? 'ساعة' : '1 Hour'}</SelectItem>
                    <SelectItem value="6h">{isRTL ? '6 ساعات' : '6 Hours'}</SelectItem>
                    <SelectItem value="24h">{isRTL ? '24 ساعة' : '24 Hours'}</SelectItem>
                    <SelectItem value="7d">{isRTL ? '7 أيام' : '7 Days'}</SelectItem>
                    <SelectItem value="30d">{isRTL ? '30 يوم' : '30 Days'}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => {/* Export */}}>
                  <Download className="w-4 h-4 me-2" />
                  {isRTL ? 'تصدير' : 'Export'}
                </Button>
              </div>
            </div>
            
            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'متوسط الاستجابة' : 'Avg Response'}</p>
                      <p className="text-2xl font-bold">{avgResponseTime}ms</p>
                    </div>
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'معدل الإتاحة' : 'Uptime Rate'}</p>
                      <p className="text-2xl font-bold text-green-600">
                        {totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0}%
                      </p>
                    </div>
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'إجمالي القراءات' : 'Total Readings'}</p>
                      <p className="text-2xl font-bold">{filteredReadings.length}</p>
                    </div>
                    <Radio className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'متوسط الكفاءة' : 'Avg Efficiency'}</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {metrics.length > 0 ? Math.round(metrics.reduce((sum, m) => sum + m.efficiency, 0) / metrics.length) : 0}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'أجهزة نشطة' : 'Active Devices'}</p>
                      <p className="text-2xl font-bold text-blue-600">{onlineDevices}/{totalDevices}</p>
                    </div>
                    <Cpu className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'التنبيهات النشطة' : 'Active Alerts'}</p>
                      <p className="text-2xl font-bold text-red-600">{activeAlerts}</p>
                    </div>
                    <Bell className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts and Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{isRTL ? 'الأجهزة حسب الفئة' : 'Devices by Category'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['temperature', 'pressure', 'motion', 'power', 'production', 'quality', 'other'].map(category => {
                      const count = devices.filter(d => d.category === category).length;
                      if (count === 0) return null;
                      const percentage = (count / totalDevices) * 100;
                      return (
                        <div key={category}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="capitalize text-sm font-medium">{category}</span>
                            <span className="font-bold text-sm">{count} <span className="text-muted-foreground font-normal">({percentage.toFixed(0)}%)</span></span>
                          </div>
                          <Progress value={percentage} className="h-3" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{isRTL ? 'التنبيهات حسب الأهمية' : 'Alerts by Severity'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['critical', 'warning', 'info'].map(severity => {
                      const count = alerts.filter(a => a.severity === severity && a.status === 'active').length;
                      const totalActive = alerts.filter(a => a.status === 'active').length;
                      const percentage = totalActive > 0 ? (count / totalActive) * 100 : 0;
                      return (
                        <div key={severity}>
                          <div className="flex justify-between items-center mb-1">
                            <Badge className={getAlertSeverityColor(severity as any)}>
                              {isRTL 
                                ? (severity === 'critical' ? 'حرج' : severity === 'warning' ? 'تحذير' : 'معلومات')
                                : severity.toUpperCase()}
                            </Badge>
                            <span className="font-bold text-sm">{count} <span className="text-muted-foreground font-normal">({percentage.toFixed(0)}%)</span></span>
                          </div>
                          <Progress value={percentage} className="h-3" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{isRTL ? 'حالة الأجهزة' : 'Device Status'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['online', 'offline', 'maintenance', 'error'].map(status => {
                      const count = devices.filter(d => d.status === status).length;
                      const percentage = (count / totalDevices) * 100;
                      return (
                        <div key={status}>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={status} />
                              <span className="text-sm capitalize">{status}</span>
                            </div>
                            <span className="font-bold text-sm">{count} <span className="text-muted-foreground font-normal">({percentage.toFixed(0)}%)</span></span>
                          </div>
                          <Progress value={percentage} className="h-3" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{isRTL ? 'جودة القراءات' : 'Reading Quality'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['good', 'warning', 'error', 'offline'].map(quality => {
                      const count = filteredReadings.filter(r => r.quality === quality).length;
                      const percentage = filteredReadings.length > 0 ? (count / filteredReadings.length) * 100 : 0;
                      return (
                        <div key={quality}>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={quality} />
                              <span className="text-sm capitalize">{quality}</span>
                            </div>
                            <span className="font-bold text-sm">{count} <span className="text-muted-foreground font-normal">({percentage.toFixed(0)}%)</span></span>
                          </div>
                          <Progress value={percentage} className="h-3" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="groups">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-lg font-semibold">{isRTL ? 'مجموعات الأجهزة' : 'Device Groups'}</h3>
              <Button onClick={() => setIsAddGroupOpen(true)}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'مجموعة جديدة' : 'New Group'}
              </Button>
            </div>
            
            {/* Groups Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'إجمالي المجموعات' : 'Total Groups'}</p>
                      <p className="text-2xl font-bold">{groups.length}</p>
                    </div>
                    <Radio className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'نشطة' : 'Active'}</p>
                      <p className="text-2xl font-bold text-green-600">{groups.filter(g => g.isActive).length}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'إجمالي الأجهزة' : 'Total Devices'}</p>
                      <p className="text-2xl font-bold">{groups.reduce((sum, g) => sum + g.deviceIds.length, 0)}</p>
                    </div>
                    <Cpu className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'متوسط الأجهزة' : 'Avg Devices'}</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {groups.length > 0 ? Math.round(groups.reduce((sum, g) => sum + g.deviceIds.length, 0) / groups.length) : 0}
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map(group => {
                const groupDevices = devices.filter(d => group.deviceIds.includes(d.id));
                const onlineInGroup = groupDevices.filter(d => d.status === 'online').length;
                return (
                  <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setSelectedGroup(group); setIsEditGroupOpen(true); }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{isRTL ? group.nameAr : group.name}</CardTitle>
                        <Badge variant={group.isActive ? 'default' : 'secondary'}>
                          {isRTL ? (group.isActive ? 'نشط' : 'غير نشط') : (group.isActive ? 'Active' : 'Inactive')}
                        </Badge>
                      </div>
                      {group.description && (
                        <CardDescription className="text-xs mt-2">{isRTL ? group.descriptionAr : group.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{isRTL ? 'عدد الأجهزة' : 'Total Devices'}</span>
                          <span className="font-bold">{group.deviceIds.length}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{isRTL ? 'أجهزة متصلة' : 'Online Devices'}</span>
                          <span className="font-bold text-green-600">{onlineInGroup}/{group.deviceIds.length}</span>
                        </div>
                        {group.location && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                            <Radio className="w-3 h-3" />
                            <span>{group.location}</span>
                          </div>
                        )}
                        {group.tags && group.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap pt-2 border-t">
                            {group.tags.slice(0, 4).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                            {group.tags.length > 4 && (
                              <Badge variant="outline" className="text-xs">+{group.tags.length - 4}</Badge>
                            )}
                          </div>
                        )}
                        <div className="pt-2">
                          <Progress value={group.deviceIds.length > 0 ? (onlineInGroup / group.deviceIds.length) * 100 : 0} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {isRTL ? 'معدل الإتاحة' : 'Availability'} {group.deviceIds.length > 0 ? Math.round((onlineInGroup / group.deviceIds.length) * 100) : 0}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ==================== SETTINGS TAB ==================== */}
        <TabsContent value="settings">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">{isRTL ? 'إعدادات الأجهزة' : 'Device Settings'}</h3>
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'قريباً: إعدادات الأجهزة' : 'Coming soon: Device Settings'}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Device Form */}
      <DeviceForm
        open={isAddDeviceOpen || isEditDeviceOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDeviceOpen(false);
            setIsEditDeviceOpen(false);
            setSelectedDevice(null);
          }
        }}
        device={selectedDevice}
        onSave={handleSaveDevice}
        isRTL={isRTL}
      />

      {/* Alert Dialog */}
      <AlertDialog
        open={isViewAlertOpen}
        onOpenChange={setIsViewAlertOpen}
        alert={selectedAlert}
        onAcknowledge={handleAcknowledgeAlert}
        onResolve={handleResolveAlert}
        onDismiss={handleDismissAlert}
        isRTL={isRTL}
      />

      {/* Device Group Form */}
      <DeviceGroupForm
        open={isAddGroupOpen || isEditGroupOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddGroupOpen(false);
            setIsEditGroupOpen(false);
            setSelectedGroup(null);
          }
        }}
        group={selectedGroup}
        devices={devices}
        onSave={handleSaveGroup}
        isRTL={isRTL}
      />
    </ModuleLayout>
  );
}
