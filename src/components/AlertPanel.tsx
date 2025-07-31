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
      new Notification('Farm Alert!', {
        body: `${latestDetection?.animalType} detected on your property`,
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
          Alert System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestDetection && (
          <div className="p-4 bg-gradient-alert rounded-lg border-2 border-alert-red">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white">ACTIVE ALERT</h4>
              <Badge variant="destructive" className="animate-detection-pulse">
                LIVE
              </Badge>
            </div>
            <p className="text-white text-sm">
              <span className="font-medium capitalize">{latestDetection.animalType}</span> detected at{' '}
              {latestDetection.timestamp.toLocaleTimeString()}
            </p>
            <p className="text-white/80 text-xs mt-1">
              Confidence: {Math.round(latestDetection.confidence * 100)}%
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-farm-green">
              {totalDetections}
            </div>
            <div className="text-xs text-muted-foreground">
              Total Detections
            </div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-farm-green">
              {latestDetection ? '1' : '0'}
            </div>
            <div className="text-xs text-muted-foreground">
              Active Alerts
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Push Notifications</span>
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Alert Sounds</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={soundEnabled ? 'bg-farm-green text-primary-foreground' : ''}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>

        {latestDetection && (
          <Button 
            onClick={sendNotification}
            className="w-full bg-gradient-success text-primary-foreground"
          >
            Send Manual Alert
          </Button>
        )}
      </CardContent>
    </Card>
  );
};