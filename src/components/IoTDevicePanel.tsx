import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Zap, 
  Volume2, 
  Lightbulb, 
  Droplets, 
  Shield, 
  Settings,
  Play,
  Square
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface IoTDevice {
  id: string;
  name: string;
  type: 'speaker' | 'lights' | 'sprinkler' | 'siren';
  isOnline: boolean;
  isActive: boolean;
  intensity: number;
  batteryLevel?: number;
}

export const IoTDevicePanel = () => {
  const [devices, setDevices] = useState<IoTDevice[]>([
    {
      id: 'speaker-001',
      name: 'Ultrasonic Speaker',
      type: 'speaker',
      isOnline: true,
      isActive: false,
      intensity: 75,
      batteryLevel: 90
    },
    {
      id: 'lights-001',
      name: 'LED Strobe Lights',
      type: 'lights',
      isOnline: true,
      isActive: false,
      intensity: 80
    },
    {
      id: 'sprinkler-001',
      name: 'Water Sprinkler',
      type: 'sprinkler',
      isOnline: false,
      isActive: false,
      intensity: 60,
      batteryLevel: 25
    },
    {
      id: 'siren-001',
      name: 'Emergency Siren',
      type: 'siren',
      isOnline: true,
      isActive: false,
      intensity: 50
    }
  ]);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'speaker': return Volume2;
      case 'lights': return Lightbulb;
      case 'sprinkler': return Droplets;
      case 'siren': return Shield;
      default: return Settings;
    }
  };

  const toggleDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, isActive: !device.isActive }
        : device
    ));
    
    const device = devices.find(d => d.id === deviceId);
    toast({
      title: device?.isActive ? "Device Deactivated" : "Device Activated",
      description: `${device?.name} is now ${device?.isActive ? 'off' : 'active'}`,
    });
  };

  const updateIntensity = (deviceId: string, intensity: number) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, intensity }
        : device
    ));
  };

  const activateEmergencyProtocol = () => {
    setDevices(prev => prev.map(device => ({ 
      ...device, 
      isActive: device.isOnline 
    })));
    
    toast({
      title: "Emergency Protocol Activated",
      description: "All deterrent devices have been activated",
      variant: "destructive"
    });
  };

  const deactivateAllDevices = () => {
    setDevices(prev => prev.map(device => ({ 
      ...device, 
      isActive: false 
    })));
    
    toast({
      title: "All Devices Deactivated",
      description: "All deterrent devices have been turned off",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          IoT Deterrent Devices
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            onClick={activateEmergencyProtocol}
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Emergency Protocol
          </Button>
          <Button 
            onClick={deactivateAllDevices}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Square className="h-4 w-4" />
            Stop All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {devices.map((device) => {
          const Icon = getDeviceIcon(device.type);
          
          return (
            <Card key={device.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{device.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={device.isOnline ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {device.isOnline ? 'Online' : 'Offline'}
                      </Badge>
                      {device.batteryLevel && (
                        <span className="text-xs text-muted-foreground">
                          Battery: {device.batteryLevel}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Switch 
                  checked={device.isActive}
                  onCheckedChange={() => toggleDevice(device.id)}
                  disabled={!device.isOnline}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Intensity</label>
                  <span className="text-sm text-muted-foreground">{device.intensity}%</span>
                </div>
                <Slider
                  value={[device.intensity]}
                  onValueChange={(value) => updateIntensity(device.id, value[0])}
                  max={100}
                  step={5}
                  disabled={!device.isOnline}
                  className="w-full"
                />
              </div>
              
              {device.isActive && (
                <div className="mt-3 p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    ✓ Device is actively deterring animals
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};