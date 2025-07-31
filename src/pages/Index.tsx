import { useState } from 'react';
import { CameraGrid } from '@/components/CameraGrid';
import { DetectionHistory } from '@/components/DetectionHistory';
import { AlertPanel } from '@/components/AlertPanel';
import { FarmStats } from '@/components/FarmStats';
import { IoTDevicePanel } from '@/components/IoTDevicePanel';
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tractor, Shield, Camera, BarChart3, Zap } from 'lucide-react';

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

const Index = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const handleNewDetection = (detection: Detection) => {
    setDetections(prev => [detection, ...prev.slice(0, 49)]); // Keep last 50 detections
  };

  const latestDetection = detections[0] || null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-success text-primary-foreground shadow-farm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/20 rounded-lg">
              <Tractor className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Farm Guardian</h1>
              <p className="text-primary-foreground/80">AI-Powered Animal Detection System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Status Banner */}
        <div className="bg-gradient-earth rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-farm-green/20 rounded-lg">
                {isMonitoring ? (
                  <Camera className="h-6 w-6 text-farm-green" />
                ) : (
                  <Shield className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  System Status: {isMonitoring ? 'Active Monitoring' : 'Standby'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isMonitoring 
                    ? 'AI is actively scanning for animals on your property'
                    : 'Click "Start Monitoring" to begin animal detection'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Devices
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-6">
            <CameraGrid onDetection={handleNewDetection} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FarmStats detections={detections} />
              </div>
              <div>
                <AlertPanel
                  latestDetection={latestDetection}
                  totalDetections={detections.length}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <IoTDevicePanel />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AdvancedAnalytics detections={detections} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DetectionHistory detections={detections} />
              </div>
              <div>
                <AlertPanel
                  latestDetection={latestDetection}
                  totalDetections={detections.length}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-muted text-center py-4 text-sm text-muted-foreground">
        <p>Farm Guardian © 2024 - Protecting your harvest with AI</p>
      </footer>
    </div>
  );
};

export default Index;
