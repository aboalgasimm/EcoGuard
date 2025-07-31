import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, Shield } from 'lucide-react';

interface Detection {
  id: string;
  timestamp: Date;
  confidence: number;
  animalType: string;
}

interface FarmStatsProps {
  detections: Detection[];
}

export const FarmStats = ({ detections }: FarmStatsProps) => {
  // Calculate stats
  const animalCounts = detections.reduce((acc, detection) => {
    acc[detection.animalType] = (acc[detection.animalType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const count = detections.filter(d => 
      d.timestamp.getHours() === hour
    ).length;
    return {
      hour: `${hour}:00`,
      count
    };
  });

  const pieData = Object.entries(animalCounts).map(([animal, count]) => ({
    name: animal,
    value: count,
    color: getAnimalColor(animal)
  }));

  function getAnimalColor(animal: string) {
    const colors: Record<string, string> = {
      deer: '#8B5A3C',
      rabbit: '#A0522D',
      bird: '#228B22',
      fox: '#FF4500'
    };
    return colors[animal] || '#666666';
  }

  const averageConfidence = detections.length > 0 
    ? detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-farm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Activity className="h-5 w-5" />
            Hourly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyData}>
              <XAxis 
                dataKey="hour" 
                tick={{ fontSize: 12 }}
                interval={3}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--farm-green))"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-farm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <TrendingUp className="h-5 w-5" />
            Animal Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No data to display
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-farm md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-earth rounded-lg">
              <div className="text-2xl font-bold text-farm-green">
                {Math.round(averageConfidence * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Avg. Confidence
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-earth rounded-lg">
              <div className="text-2xl font-bold text-farm-green">
                {detections.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Detections
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-earth rounded-lg">
              <div className="text-2xl font-bold text-farm-green">
                {Object.keys(animalCounts).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Species Detected
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};