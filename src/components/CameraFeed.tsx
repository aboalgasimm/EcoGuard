import { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AIDetection } from './AIDetection';

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

interface CameraFeedProps {
  onDetection: (detection: Detection) => void;
  isMonitoring: boolean;
  onToggleMonitoring: () => void;
}

export const CameraFeed = ({ onDetection, isMonitoring, onToggleMonitoring }: CameraFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [lastDetection, setLastDetection] = useState<Detection | null>(null);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        // Get available video devices first
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);

        // Define video constraints with webcam preference
        const constraints: MediaStreamConstraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          }
        };

        // If a specific camera is selected, use it
        if (selectedCamera) {
          (constraints.video as MediaTrackConstraints).deviceId = { exact: selectedCamera };
        } else {
          // Auto-select webcam by looking for desktop camera indicators
          const webcam = videoDevices.find(device => {
            const label = device.label.toLowerCase();
            return (
              label.includes('webcam') ||
              label.includes('usb') ||
              label.includes('integrated') ||
              label.includes('built-in') ||
              (!label.includes('front') && 
               !label.includes('back') && 
               !label.includes('selfie') &&
               !label.includes('facetime'))
            );
          });

          if (webcam) {
            (constraints.video as MediaTrackConstraints).deviceId = { exact: webcam.deviceId };
            setSelectedCamera(webcam.deviceId);
          }
          // If no webcam found, don't set facingMode to avoid mobile camera preference
        }

        stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreamActive(true);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        
        // Fallback: try basic video request without constraints
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsStreamActive(true);
          }
        } catch (fallbackError) {
          toast({
            variant: 'destructive',
            title: 'خطأ في الكاميرا',
            description: 'غير قادر على الوصول للكاميرا. يرجى التحقق من الأذونات.',
          });
        }
      }
    };

    if (isMonitoring) {
      startCamera();
    } else {
      setIsStreamActive(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isMonitoring, selectedCamera, toast]);

  const playAlertSound = () => {
    // Create audio context for alert sound
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
  };

  const handleDetection = useCallback((detection: Detection) => {
    setLastDetection(detection);
    onDetection(detection);
    playAlertSound();
    
    // Clear detection indicator after 3 seconds
    setTimeout(() => setLastDetection(null), 3000);
    
    toast({
      title: "تم اكتشاف حيوان!",
      description: `تم اكتشاف ${detection.animalType} بنسبة ثقة ${(detection.confidence * 100).toFixed(1)}%`,
      variant: "destructive",
    });
  }, [onDetection, toast]);

  // Fallback simulation for demo purposes
  useEffect(() => {
    if (!isMonitoring || !isStreamActive) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.98) { // 2% chance per check for demo
        const detection: Detection = {
          id: `demo-${Date.now()}`,
          timestamp: new Date(),
          confidence: 0.85 + Math.random() * 0.15,
          animalType: ['deer', 'rabbit', 'bird', 'fox'][Math.floor(Math.random() * 4)],
        };
        handleDetection(detection);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isMonitoring, isStreamActive, handleDetection]);

  return (
    <Card className="shadow-farm">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">تغذية الكاميرا المباشرة</h3>
          <div className="flex gap-2">
            {availableCameras.length > 1 && (
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="px-3 py-1 text-sm border rounded-md bg-background"
                style={{ minWidth: '150px' }}
              >
                <option value="">اختيار تلقائي (ويب كام)</option>
                {availableCameras.map((camera, index) => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `كاميرا ${index + 1}`}
                  </option>
                ))}
              </select>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={playAlertSound}
              className="text-accent"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button
              variant={isMonitoring ? "destructive" : "default"}
              onClick={onToggleMonitoring}
              className="flex items-center gap-2"
            >
              {isMonitoring ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
              {isMonitoring ? 'إيقاف' : 'بدء'} المراقبة
            </Button>
          </div>
        </div>

        <div className="relative bg-muted rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-64 object-cover"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
          
          <AIDetection
            videoRef={videoRef}
            canvasRef={canvasRef}
            isActive={isMonitoring && isStreamActive}
            onDetection={handleDetection}
          />
          
          {lastDetection && (
            <div className="absolute top-2 right-2 bg-alert-red text-white px-3 py-1 rounded-lg text-sm font-medium animate-alert-flash">
              {lastDetection.animalType.toUpperCase()} تم الاكتشاف!
            </div>
          )}
          
          {!isStreamActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isMonitoring ? 'بدء تشغيل الكاميرا...' : 'الكاميرا مطفأة'}
                </p>
              </div>
            </div>
          )}
        </div>

        {isStreamActive && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-farm-green rounded-full animate-detection-pulse"></div>
              <span className="text-muted-foreground">المراقبة نشطة</span>
            </div>
            <span className="text-muted-foreground">
              الدقة: 1280x720
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};