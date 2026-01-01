// ==================== IOT & MACHINE INTEGRATION DATA ====================

import type { BaseEntity } from '@shared/types';

// ==================== CORE TYPES ====================

export interface IoTDevice extends BaseEntity {
  id: string;
  deviceId: string;
  name: string;
  nameAr: string;
  type: 'sensor' | 'actuator' | 'controller' | 'gateway' | 'display';
  category: 'temperature' | 'pressure' | 'motion' | 'power' | 'production' | 'quality' | 'other';
  manufacturer: string;
  model: string;
  serialNumber: string;
  firmwareVersion: string;
  location: string;
  locationAr: string;
  machineId?: string; // Linked machine
  productionLineId?: string; // Linked production line
  status: 'online' | 'offline' | 'maintenance' | 'error';
  lastSeen: string;
  batteryLevel?: number; // 0-100 for wireless devices
  signalStrength?: number; // dBm
  isActive: boolean;
  config: DeviceConfig;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DeviceConfig {
  samplingRate?: number; // Hz
  unit: string;
  minValue?: number;
  maxValue?: number;
  thresholds: ThresholdConfig[];
  calibration?: CalibrationData;
}

export interface ThresholdConfig {
  name: string;
  nameAr: string;
  value: number;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  severity: 'info' | 'warning' | 'critical';
  action?: string; // Action to take when threshold is crossed
}

export interface CalibrationData {
  lastCalibrated: string;
  nextCalibrationDue: string;
  calibratedBy: string;
  offset: number;
  factor: number;
}

export interface SensorReading extends BaseEntity {
  id: string;
  deviceId: string;
  deviceName: string;
  timestamp: string;
  value: number;
  unit: string;
  quality: 'good' | 'warning' | 'error' | 'offline';
  location?: string;
  metadata?: Record<string, any>;
}

export interface Alert extends BaseEntity {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'threshold_exceeded' | 'device_offline' | 'device_error' | 'maintenance_due' | 'calibration_due' | 'anomaly';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  value?: number;
  threshold?: number;
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface MachineMetric extends BaseEntity {
  id: string;
  machineId: string;
  machineName: string;
  machineCode: string;
  timestamp: string;
  // Production Metrics
  status: 'running' | 'idle' | 'maintenance' | 'breakdown';
  speed: number; // RPM or m/min
  cycleCount: number;
  efficiency: number; // percentage
  // Performance Metrics
  temperature?: number; // Celsius
  powerConsumption: number; // Watts
  vibration?: number; // mm/s
  // Quality Metrics
  defectCount?: number;
  qualityRate?: number; // percentage
  // Downtime
  downtimeMinutes?: number;
  downtimeReason?: string;
}

export interface ProductionLineMetrics extends BaseEntity {
  id: string;
  lineId: string;
  lineName: string;
  timestamp: string;
  // Line Performance
  status: 'running' | 'idle' | 'maintenance' | 'breakdown';
  activeWorkers: number;
  targetOutput: number;
  actualOutput: number;
  efficiency: number; // percentage
  // Quality
  qualityRate: number;
  defectRate: number;
  // Energy
  totalPowerConsumption: number; // kW
  // WIP
  wipCount: number;
  completedUnits: number;
}

export interface DeviceGroup extends BaseEntity {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  deviceIds: string[];
  location?: string;
  isActive: boolean;
  tags: string[];
}

export interface DashboardWidget {
  id: string;
  name: string;
  nameAr: string;
  type: 'gauge' | 'chart' | 'metric' | 'alert' | 'status';
  deviceId?: string;
  metric?: string;
  config: WidgetConfig;
  position: { x: number; y: number; w: number; h: number };
}

export interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'pie' | 'area';
  timeRange?: '1h' | '6h' | '24h' | '7d' | '30d';
  refreshInterval?: number; // seconds
  unit?: string;
  min?: number;
  max?: number;
  thresholds?: ThresholdConfig[];
}

// ==================== MOCK DATA ====================

export const mockIoTDevices: IoTDevice[] = [
  {
    id: 'device-1',
    deviceId: 'TEMP-001',
    name: 'Temperature Sensor - Cutting Line 1',
    nameAr: 'مستشعر الحرارة - خط القص 1',
    type: 'sensor',
    category: 'temperature',
    manufacturer: 'Siemens',
    model: 'SITRANS T200',
    serialNumber: 'SN-TEMP-2023-001',
    firmwareVersion: 'v2.1.3',
    location: 'Cutting Line 1 - Zone A',
    locationAr: 'خط القص 1 - المنطقة أ',
    machineId: 'mach-1',
    productionLineId: 'line-1',
    status: 'online',
    lastSeen: new Date().toISOString(),
    batteryLevel: undefined,
    signalStrength: -45,
    isActive: true,
    config: {
      samplingRate: 1,
      unit: '°C',
      minValue: -10,
      maxValue: 150,
      thresholds: [
        { name: 'High Temp Warning', nameAr: 'تحذير درجة حرارة عالية', value: 80, operator: 'gt', severity: 'warning' },
        { name: 'Critical Temp', nameAr: 'درجة حرارة حرجة', value: 100, operator: 'gt', severity: 'critical', action: 'shutdown' },
      ],
      calibration: {
        lastCalibrated: '2024-01-15',
        nextCalibrationDue: '2024-07-15',
        calibratedBy: 'emp-2',
        offset: 0.5,
        factor: 1.0,
      },
    },
    tags: ['temperature', 'cutting', 'critical'],
    createdAt: '2023-06-01',
    updatedAt: '2024-03-20',
  },
  {
    id: 'device-2',
    deviceId: 'POWER-002',
    name: 'Power Monitor - Sewing Line 2',
    nameAr: 'مراقب الطاقة - خط الخياطة 2',
    type: 'sensor',
    category: 'power',
    manufacturer: 'ABB',
    model: 'M2M Power Meter',
    serialNumber: 'SN-PWR-2023-002',
    firmwareVersion: 'v1.8.2',
    location: 'Sewing Line 2 - Main Panel',
    locationAr: 'خط الخياطة 2 - اللوحة الرئيسية',
    machineId: 'mach-3',
    productionLineId: 'line-2',
    status: 'online',
    lastSeen: new Date(Date.now() - 30000).toISOString(),
    isActive: true,
    config: {
      samplingRate: 10,
      unit: 'kW',
      minValue: 0,
      maxValue: 500,
      thresholds: [
        { name: 'High Power', nameAr: 'طاقة عالية', value: 400, operator: 'gt', severity: 'warning' },
      ],
    },
    tags: ['power', 'energy', 'monitoring'],
    createdAt: '2023-07-15',
    updatedAt: '2024-03-20',
  },
  {
    id: 'device-3',
    deviceId: 'MOTION-003',
    name: 'Motion Sensor - Finishing Station',
    nameAr: 'مستشعر الحركة - محطة التشطيب',
    type: 'sensor',
    category: 'motion',
    manufacturer: 'Honeywell',
    model: 'HM-Motion-Detector',
    serialNumber: 'SN-MOT-2023-003',
    firmwareVersion: 'v3.0.1',
    location: 'Finishing Station 3',
    locationAr: 'محطة التشطيب 3',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
    batteryLevel: 15,
    signalStrength: -85,
    isActive: true,
    config: {
      samplingRate: 2,
      unit: 'count/min',
      thresholds: [],
    },
    tags: ['motion', 'finishing'],
    createdAt: '2023-08-20',
    updatedAt: '2024-03-19',
  },
  {
    id: 'device-4',
    deviceId: 'GATEWAY-001',
    name: 'IoT Gateway - Building A',
    nameAr: 'بوابة إنترنت الأشياء - المبنى أ',
    type: 'gateway',
    category: 'other',
    manufacturer: 'Cisco',
    model: 'IoT Gateway 3000',
    serialNumber: 'SN-GW-2023-001',
    firmwareVersion: 'v4.2.0',
    location: 'Building A - Server Room',
    locationAr: 'المبنى أ - غرفة الخوادم',
    status: 'online',
    lastSeen: new Date().toISOString(),
    isActive: true,
    config: {
      unit: '',
      thresholds: [],
    },
    tags: ['gateway', 'network', 'critical'],
    createdAt: '2023-01-10',
    updatedAt: '2024-03-20',
  },
];

export const mockSensorReadings: SensorReading[] = [
  {
    id: 'reading-1',
    deviceId: 'device-1',
    deviceName: 'Temperature Sensor - Cutting Line 1',
    timestamp: new Date().toISOString(),
    value: 72.5,
    unit: '°C',
    quality: 'good',
    location: 'Cutting Line 1 - Zone A',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reading-2',
    deviceId: 'device-2',
    deviceName: 'Power Monitor - Sewing Line 2',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    value: 125.3,
    unit: 'kW',
    quality: 'good',
    createdAt: new Date(Date.now() - 60000).toISOString(),
    updatedAt: new Date(Date.now() - 60000).toISOString(),
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    deviceId: 'device-3',
    deviceName: 'Motion Sensor - Finishing Station',
    type: 'device_offline',
    severity: 'warning',
    title: 'Device Offline',
    titleAr: 'جهاز غير متصل',
    message: 'Motion Sensor - Finishing Station has been offline for 1 hour',
    messageAr: 'مستشعر الحركة - محطة التشطيب غير متصل منذ ساعة',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'alert-2',
    deviceId: 'device-1',
    deviceName: 'Temperature Sensor - Cutting Line 1',
    type: 'threshold_exceeded',
    severity: 'info',
    title: 'High Temperature Warning',
    titleAr: 'تحذير درجة حرارة عالية',
    message: 'Temperature exceeded 80°C threshold (Current: 82.3°C)',
    messageAr: 'تجاوزت درجة الحرارة عتبة 80°C (الحالي: 82.3°C)',
    value: 82.3,
    threshold: 80,
    status: 'acknowledged',
    acknowledgedBy: 'emp-1',
    acknowledgedAt: new Date(Date.now() - 1800000).toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

export const mockMachineMetrics: MachineMetric[] = [
  {
    id: 'metric-1',
    machineId: 'mach-1',
    machineName: 'Cutting Machine 1',
    machineCode: 'CUT-001',
    timestamp: new Date().toISOString(),
    status: 'running',
    speed: 1500,
    cycleCount: 1250,
    efficiency: 95.5,
    temperature: 72.5,
    powerConsumption: 8500,
    vibration: 2.1,
    defectCount: 5,
    qualityRate: 99.6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockDeviceGroups: DeviceGroup[] = [
  {
    id: 'group-1',
    name: 'Cutting Line Sensors',
    nameAr: 'مستشعرات خط القص',
    description: 'All sensors in cutting lines',
    descriptionAr: 'جميع المستشعرات في خطوط القص',
    deviceIds: ['device-1'],
    location: 'Cutting Department',
    isActive: true,
    tags: ['cutting', 'temperature'],
    createdAt: '2023-06-01',
    updatedAt: '2024-03-20',
  },
];

// ==================== HELPER FUNCTIONS ====================

export function getDeviceName(device: IoTDevice, lang: string): string {
  return lang === 'ar' ? device.nameAr : device.name;
}

export function getDeviceStatusColor(status: IoTDevice['status']): string {
  switch (status) {
    case 'online': return 'text-green-500';
    case 'offline': return 'text-red-500';
    case 'maintenance': return 'text-yellow-500';
    case 'error': return 'text-red-600';
    default: return 'text-gray-500';
  }
}

export function getAlertSeverityColor(severity: Alert['severity']): string {
  switch (severity) {
    case 'critical': return 'text-red-600 bg-red-50';
    case 'warning': return 'text-yellow-600 bg-yellow-50';
    case 'info': return 'text-blue-600 bg-blue-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}

export function generateId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getOnlineDevicesCount(devices: IoTDevice[]): number {
  return devices.filter(d => d.status === 'online').length;
}

export function getActiveAlertsCount(alerts: Alert[]): number {
  return alerts.filter(a => a.status === 'active').length;
}

export function getCriticalAlertsCount(alerts: Alert[]): number {
  return alerts.filter(a => a.status === 'active' && a.severity === 'critical').length;
}

