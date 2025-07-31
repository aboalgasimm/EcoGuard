import { useEffect, useRef, useState } from 'react';
import { pipeline } from '@huggingface/transformers';

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

interface AIDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isActive: boolean;
  onDetection: (detection: Detection) => void;
}

export const AIDetection = ({ videoRef, canvasRef, isActive, onDetection }: AIDetectionProps) => {
  const [detector, setDetector] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const detectionInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isActive && !detector && !isLoading) {
      initializeDetector();
    }
  }, [isActive, detector, isLoading]);

  const initializeDetector = async () => {
    try {
      setIsLoading(true);
      const objectDetector = await pipeline(
        'object-detection',
        'hustvl/yolos-tiny',
        { device: 'webgpu' }
      );
      setDetector(objectDetector);
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU');
      try {
        const objectDetector = await pipeline(
          'object-detection',
          'hustvl/yolos-tiny'
        );
        setDetector(objectDetector);
      } catch (fallbackError) {
        console.error('Failed to initialize AI detector:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const runDetection = async () => {
    if (!detector || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Get image data from canvas
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Run AI detection
      const detections = await detector(imageData);
      
      // Filter for animals
      const animalLabels = ['bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe'];
      const animalDetections = detections.filter((det: any) => 
        animalLabels.some(animal => det.label.toLowerCase().includes(animal))
      );

      if (animalDetections.length > 0) {
        animalDetections.forEach((det: any) => {
          const detection: Detection = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            confidence: det.score,
            animalType: det.label,
            boundingBox: {
              x: det.box.xmin,
              y: det.box.ymin,
              width: det.box.xmax - det.box.xmin,
              height: det.box.ymax - det.box.ymin,
            }
          };
          
          onDetection(detection);
          
          // Draw bounding box
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.strokeRect(det.box.xmin, det.box.ymin, 
            det.box.xmax - det.box.xmin, det.box.ymax - det.box.ymin);
          
          // Draw label
          ctx.fillStyle = '#ef4444';
          ctx.font = '16px Arial';
          ctx.fillText(`${det.label} (${(det.score * 100).toFixed(1)}%)`, 
            det.box.xmin, det.box.ymin - 5);
        });
      }
    } catch (error) {
      console.error('Detection error:', error);
    }
  };

  useEffect(() => {
    if (isActive && detector) {
      detectionInterval.current = setInterval(runDetection, 2000); // Run every 2 seconds
      return () => {
        if (detectionInterval.current) {
          clearInterval(detectionInterval.current);
        }
      };
    }
  }, [isActive, detector]);

  return null; // This is a logic-only component
};