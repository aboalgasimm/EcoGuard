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
    <div className="min-h-screen bg-background" dir="rtl">
      
      <header className="bg-gradient-success text-primary-foreground shadow-farm" dir="rtl" style={{textAlign: 'right', direction: 'rtl'}}>
        <div className="container mx-auto px-4 py-6" style={{textAlign: 'right'}}>
          <div className="flex items-center gap-3" style={{justifyContent: 'flex-end', flexDirection: 'row-reverse'}}>
            <div className="flex items-center gap-2">
              {/* Logo Image */}
              <img 
                src="/logo.jpg" 
                alt="EcoGuard Logo" 
                className="h-10 w-10 rounded-lg object-contain bg-white/10 p-1"
                onError={(e) => {
                  // Fallback to Tractor icon if logo image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              {/* Fallback Tractor Icon */}
              <div className="p-2 bg-primary-foreground/20 rounded-lg" style={{display: 'none'}}>
                <Tractor className="h-8 w-8" />
              </div>
            </div>
            <div style={{textAlign: 'right'}}>
              <h1 className="text-2xl font-bold" style={{textAlign: 'right'}}>الحارس البيئي | EcoGuard</h1>
              <p className="text-primary-foreground/80" style={{textAlign: 'right'}}>نظام كشف الحيوانات بالذكاء الاصطناعي</p>
            </div>
          </div>
        </div>
      </header>

   
      <main className="container mx-auto px-4 py-6 space-y-6">
        
        <div className="bg-gradient-earth rounded-lg p-4" dir="rtl" style={{textAlign: 'right', direction: 'rtl'}}>
          <div style={{textAlign: 'right'}}>
            <div className="flex items-center gap-3" style={{justifyContent: 'flex-end', flexDirection: 'row-reverse'}}>
              <div style={{textAlign: 'right'}}>
                <h2 className="font-semibold text-foreground" style={{textAlign: 'right'}}>
                  حالة النظام: {isMonitoring ? 'مراقبة نشطة' : 'في الانتظار'}
                </h2>
                <p className="text-sm text-muted-foreground" style={{textAlign: 'right'}}>
                  {isMonitoring 
                    ? 'الذكاء الاصطناعي يقوم بمسح نشط للحيوانات في ممتلكاتك'
                    : 'انقر على "بدء المراقبة" لبدء كشف الحيوانات'
                  }
                </p>
              </div>
              <div className="p-2 bg-farm-green/20 rounded-lg">
                {isMonitoring ? (
                  <Camera className="h-6 w-6 text-farm-green" />
                ) : (
                  <Shield className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="monitoring" className="space-y-6" dir="rtl">
          <TabsList className="grid w-full grid-cols-4" style={{direction: 'rtl'}}>
            <TabsTrigger value="monitoring" className="flex items-center gap-2" style={{flexDirection: 'row-reverse'}}>
              <Camera className="h-4 w-4" />
              المراقبة
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2" style={{flexDirection: 'row-reverse'}}>
              <Zap className="h-4 w-4" />
              الأجهزة
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2" style={{flexDirection: 'row-reverse'}}>
              <BarChart3 className="h-4 w-4" />
              التحليلات
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2" style={{flexDirection: 'row-reverse'}}>
              <Shield className="h-4 w-4" />
              السجل
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
      <footer className="bg-muted py-4 text-sm text-muted-foreground" dir="rtl">
        <div className="container mx-auto px-4">
          <p className="text-center" style={{textAlign: 'center'}}>
            الحارس البيئي | EcoGuard © 2024 - حماية محصولك بالذكاء الاصطناعي
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
