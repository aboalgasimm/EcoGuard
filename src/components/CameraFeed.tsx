import { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use back camera on mobile
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreamActive(true);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast({
          variant: 'destructive',
          title: 'Camera Error',
          description: 'Unable to access camera. Please check permissions.',
        });
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
  }, [isMonitoring, toast]);

  // Simulate animal detection (in real app, this would use AI model)
  useEffect(() => {
    if (!isMonitoring || !isStreamActive) return;

    const detectAnimals = () => {
      // Simulate random detection for demo
      if (Math.random() > 0.95) { // 5% chance per check
        const detection: Detection = {
          id: `detection-${Date.now()}`,
          timestamp: new Date(),
          confidence: 0.85 + Math.random() * 0.15,
          animalType: ['deer', 'rabbit', 'bird', 'fox'][Math.floor(Math.random() * 4)],
          boundingBox: {
            x: Math.random() * 200,
            y: Math.random() * 200,
            width: 50 + Math.random() * 100,
            height: 50 + Math.random() * 100,
          }
        };
        
        setLastDetection(detection);
        onDetection(detection);
        
        // Play alert sound
        playAlertSound();
      }
    };

    const interval = setInterval(detectAnimals, 1000);
    return () => clearInterval(interval);
  }, [isMonitoring, isStreamActive, onDetection]);

  const playAlertSound = () => {
    // Create audio context for alert sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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

  return (
    <Card className="shadow-farm">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">Live Camera Feed</h3>
          <div className="flex gap-2">
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
              {isMonitoring ? 'Stop' : 'Start'} Monitoring
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
          
          {lastDetection && (
            <div className="absolute top-2 right-2 bg-alert-red text-white px-3 py-1 rounded-lg text-sm font-medium animate-alert-flash">
              {lastDetection.animalType.toUpperCase()} DETECTED!
            </div>
          )}
          
          {!isStreamActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isMonitoring ? 'Starting camera...' : 'Camera off'}
                </p>
              </div>
            </div>
          )}
        </div>

        {isStreamActive && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-farm-green rounded-full animate-detection-pulse"></div>
              <span className="text-muted-foreground">Monitoring active</span>
            </div>
            <span className="text-muted-foreground">
              Resolution: 1280x720
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};