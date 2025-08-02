import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CameraFeed } from './CameraFeed';
import { Plus, Camera, MapPin, Battery, Wifi } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Detection {
  id: string;
  timestamp: Date;
  confidence: number;
  animalType: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface CameraDevice {
  id: string;
  name: string;
  location: string;
  isOnline: boolean;
  batteryLevel: number;
  isMonitoring: boolean;
  lastDetection?: Date;
}

interface CameraGridProps {
  onDetection: (detection: Detection) => void;
}

export const CameraGrid = ({ onDetection }: CameraGridProps) => {
  const [cameras, setCameras] = useState<CameraDevice[]>([
    {
      id: 'cam-001',
      name: 'كاميرا الحقل الشمالي',
      location: 'الحقل أ - المدخل الشمالي',
      isOnline: true,
      batteryLevel: 85,
      isMonitoring: false,
      lastDetection: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'cam-002',
      name: 'كاميرا البوابة الجنوبية',
      location: 'الحقل ب - البوابة الجنوبية',
      isOnline: true,
      batteryLevel: 62,
      isMonitoring: false
    },
    {
      id: 'cam-003',
      name: 'كاميرا مصدر المياه',
      location: 'بالقرب من خزان المياه',
      isOnline: false,
      batteryLevel: 15,
      isMonitoring: false,
      lastDetection: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  ]);

  const [selectedCamera, setSelectedCamera] = useState<string | null>('cam-001');

  const toggleMonitoring = (cameraId: string) => {
    setCameras(prev => prev.map(cam => 
      cam.id === cameraId 
        ? { ...cam, isMonitoring: !cam.isMonitoring }
        : cam
    ));
    
    const camera = cameras.find(cam => cam.id === cameraId);
    toast({
      title: camera?.isMonitoring ? "تم إيقاف المراقبة" : "تم بدء المراقبة",
      description: `${camera?.name} ${camera?.isMonitoring ? 'غير نشطة الآن' : 'تراقب بنشاط الآن'}`,
    });
  };

  const addNewCamera = () => {
    const newCamera: CameraDevice = {
      id: `cam-${String(cameras.length + 1).padStart(3, '0')}`,
      name: `Camera ${cameras.length + 1}`,
      location: 'New Location',
      isOnline: true,
      batteryLevel: 100,
      isMonitoring: false
    };
    setCameras(prev => [...prev, newCamera]);
    toast({
      title: "تم إضافة الكاميرا",
      description: `تم إضافة ${newCamera.name} إلى الشبكة`,
    });
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-farm-green';
    if (level > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusColor = (camera: CameraDevice) => {
    if (!camera.isOnline) return 'destructive';
    if (camera.isMonitoring) return 'default';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Camera Grid Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            شبكة الكاميرات ({cameras.length} جهاز)
          </CardTitle>
          <Button onClick={addNewCamera} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            إضافة كاميرا
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cameras.map((camera) => (
              <Card 
                key={camera.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCamera === camera.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCamera(camera.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-sm">{camera.name}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {camera.location}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(camera)} className="text-xs">
                      {camera.isOnline ? (camera.isMonitoring ? 'نشط' : 'متصل') : 'غير متصل'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Battery className={`h-3 w-3 ${getBatteryColor(camera.batteryLevel)}`} />
                        <span className={getBatteryColor(camera.batteryLevel)}>
                          {camera.batteryLevel}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wifi className={`h-3 w-3 ${camera.isOnline ? 'text-farm-green' : 'text-red-500'}`} />
                        <span className={camera.isOnline ? 'text-farm-green' : 'text-red-500'}>
                          {camera.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {camera.lastDetection && (
                    <p className="text-xs text-muted-foreground mt-2">
                      آخر اكتشاف: {camera.lastDetection.toLocaleTimeString('ar-SA')}
                    </p>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant={camera.isMonitoring ? "destructive" : "default"}
                    className="w-full mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMonitoring(camera.id);
                    }}
                    disabled={!camera.isOnline}
                  >
                    {camera.isMonitoring ? 'إيقاف' : 'بدء'} المراقبة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Camera Feed */}
      {selectedCamera && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            الكاميرا النشطة: {cameras.find(cam => cam.id === selectedCamera)?.name}
          </h3>
          <CameraFeed
            onDetection={onDetection}
            isMonitoring={cameras.find(cam => cam.id === selectedCamera)?.isMonitoring || false}
            onToggleMonitoring={() => toggleMonitoring(selectedCamera)}
          />
        </div>
      )}
    </div>
  );
};