import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Smartphone, Volume2 } from 'lucide-react';
import { useState } from 'react';

interface Detection {
  id: string;
  timestamp: Date;
  confidence: number;
  animalType: string;
}

interface AlertPanelProps {
  latestDetection: Detection | null;
  totalDetections: number;
}

export const AlertPanel = ({ latestDetection, totalDetections }: AlertPanelProps) => {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const sendNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('تنبيه المزرعة!', {
        body: `تم اكتشاف ${latestDetection?.animalType} في ممتلكاتك`,
        icon: '/favicon.ico',
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  return (
    <Card className="shadow-farm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Bell className="h-5 w-5" />
          نظام التنبيهات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestDetection && (
          <div className="p-4 bg-gradient-alert rounded-lg border-2 border-alert-red">
            <div className="flex items-center justify-end mb-2" style={{flexDirection: 'row-reverse'}}>
              <h4 className="font-semibold text-white" style={{textAlign: 'right'}}>تنبيه نشط</h4>
              <Badge variant="destructive" className="animate-detection-pulse" style={{marginLeft: '0.5rem'}}>
                مباشر
              </Badge>
            </div>
            <p className="text-white text-sm">
              تم اكتشاف <span className="font-medium capitalize">{latestDetection.animalType}</span> في{' '}
              {latestDetection.timestamp.toLocaleTimeString()}
            </p>
            <p className="text-white/80 text-xs mt-1">
              مستوى الثقة: {Math.round(latestDetection.confidence * 100)}%
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-farm-green">
              {totalDetections}
            </div>
            <div className="text-xs text-muted-foreground">
              إجمالي الاكتشافات
            </div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-farm-green">
              {latestDetection ? '1' : '0'}
            </div>
            <div className="text-xs text-muted-foreground">
              التنبيهات النشطة
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-end" style={{flexDirection: 'row-reverse'}}>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">الإشعارات الفورية</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAlertsEnabled(!alertsEnabled);
                if (!alertsEnabled) {
                  requestNotificationPermission();
                }
              }}
              className={alertsEnabled ? 'bg-farm-green text-primary-foreground' : ''}
            >
              {alertsEnabled ? <Bell className="h-3 w-3" /> : <BellOff className="h-3 w-3" />}
            </Button>
          </div>

          <div className="flex items-center justify-end" style={{flexDirection: 'row-reverse'}}>
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">أصوات التنبيه</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={soundEnabled ? 'bg-farm-green text-primary-foreground' : ''}
            >
              {soundEnabled ? 'مفعل' : 'مطفأ'}
            </Button>
          </div>
        </div>

        {latestDetection && (
          <Button 
            onClick={sendNotification}
            className="w-full bg-gradient-success text-primary-foreground"
          >
            إرسال تنبيه يدوي
          </Button>
        )}
      </CardContent>
    </Card>
  );
};