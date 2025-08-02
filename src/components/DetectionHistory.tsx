import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Clock } from 'lucide-react';

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

interface DetectionHistoryProps {
  detections: Detection[];
}

export const DetectionHistory = ({ detections }: DetectionHistoryProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getAnimalIcon = (animalType: string) => {
    const icons: { [key: string]: string } = {
      deer: '🦌',
      rabbit: '🐰',
      bird: '🐦',
      fox: '🦊',
      default: '🐾'
    };
    return icons[animalType] || icons.default;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-farm-green text-primary-foreground';
    if (confidence >= 0.7) return 'bg-accent text-accent-foreground';
    return 'bg-secondary text-secondary-foreground';
  };

  return (
    <Card className="shadow-farm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <AlertTriangle className="h-5 w-5" />
          الاكتشافات الأخيرة
        </CardTitle>
      </CardHeader>
      <CardContent>
        {detections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">🏞️</div>
            <p>لم يتم اكتشاف أي حيوانات بعد</p>
            <p className="text-sm">مزرعتك آمنة</p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {detections.map((detection) => (
                <div
                  key={detection.id}
                  className="flex items-center justify-between p-3 bg-gradient-earth rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getAnimalIcon(detection.animalType)}
                    </span>
                    <div>
                      <p className="font-medium capitalize text-foreground">
                        {detection.animalType}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTime(detection.timestamp)}
                      </div>
                    </div>
                  </div>
                  <Badge className={getConfidenceColor(detection.confidence)}>
                    {Math.round(detection.confidence * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};