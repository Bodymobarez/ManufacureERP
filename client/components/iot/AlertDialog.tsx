// ==================== ALERT DIALOG ====================

import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Alert } from '@/store/iotData';
import { getAlertSeverityColor } from '@/store/iotData';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: Alert | null;
  onAcknowledge?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  isRTL: boolean;
}

export function AlertDialog({ open, onOpenChange, alert, onAcknowledge, onResolve, onDismiss, isRTL }: AlertDialogProps) {
  if (!alert) return null;

  const handleAction = (action: 'acknowledge' | 'resolve' | 'dismiss') => {
    if (action === 'acknowledge' && onAcknowledge) {
      onAcknowledge(alert.id);
    } else if (action === 'resolve' && onResolve) {
      onResolve(alert.id);
    } else if (action === 'dismiss' && onDismiss) {
      onDismiss(alert.id);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" aria-describedby="alert-dialog-description">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{isRTL ? alert.titleAr : alert.title}</DialogTitle>
            <Badge className={getAlertSeverityColor(alert.severity)}>
              {isRTL 
                ? (alert.severity === 'critical' ? 'حرج' : alert.severity === 'warning' ? 'تحذير' : 'معلومات')
                : alert.severity.toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>{isRTL ? 'الجهاز' : 'Device'}</Label>
            <p className="font-medium mt-1">{alert.deviceName}</p>
          </div>

          <div>
            <Label>{isRTL ? 'الوصف' : 'Description'}</Label>
            <p className="mt-1 text-muted-foreground">{isRTL ? alert.messageAr : alert.message}</p>
          </div>

          {alert.value !== undefined && (
            <div>
              <Label>{isRTL ? 'القيمة' : 'Value'}</Label>
              <p className="font-medium mt-1">
                {alert.value}
                {alert.threshold !== undefined && ` / ${alert.threshold}`}
              </p>
            </div>
          )}

          <div>
            <Label>{isRTL ? 'الحالة' : 'Status'}</Label>
            <Badge variant="outline" className="mt-1">{alert.status}</Badge>
          </div>

          {alert.acknowledgedBy && (
            <div>
              <Label>{isRTL ? 'تم الاعتراف به بواسطة' : 'Acknowledged By'}</Label>
              <p className="mt-1 text-sm text-muted-foreground">
                {alert.acknowledgedBy}
                {alert.acknowledgedAt && ` - ${new Date(alert.acknowledgedAt).toLocaleString()}`}
              </p>
            </div>
          )}

          {alert.resolvedAt && (
            <div>
              <Label>{isRTL ? 'تم الحل في' : 'Resolved At'}</Label>
              <p className="mt-1 text-sm text-muted-foreground">{new Date(alert.resolvedAt).toLocaleString()}</p>
            </div>
          )}

          <div>
            <Label>{isRTL ? 'تاريخ الإنشاء' : 'Created At'}</Label>
            <p className="mt-1 text-sm text-muted-foreground">{new Date(alert.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isRTL ? 'إغلاق' : 'Close'}
          </Button>
          {alert.status === 'active' && onAcknowledge && (
            <Button onClick={() => handleAction('acknowledge')}>
              {isRTL ? 'اعتراف' : 'Acknowledge'}
            </Button>
          )}
          {alert.status === 'acknowledged' && onResolve && (
            <Button onClick={() => handleAction('resolve')}>
              {isRTL ? 'حل' : 'Resolve'}
            </Button>
          )}
          {onDismiss && (
            <Button variant="ghost" onClick={() => handleAction('dismiss')}>
              {isRTL ? 'تجاهل' : 'Dismiss'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

