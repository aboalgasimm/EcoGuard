import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign, 
  Clock,
  MapPin,
  Cloud,
  AlertTriangle
} from 'lucide-react';

interface Detection {
  id: string;
  timestamp: Date;
  confidence: number;
  animalType: string;
}

interface AdvancedAnalyticsProps {
  detections: Detection[];
}

export const AdvancedAnalytics = ({ detections }: AdvancedAnalyticsProps) => {
  // Simulated data for advanced analytics
  const weeklyTrends = [
    { day: 'Mon', detections: 12, prevented: 10, damage: 2 },
    { day: 'Tue', detections: 8, prevented: 7, damage: 1 },
    { day: 'Wed', detections: 15, prevented: 13, damage: 2 },
    { day: 'Thu', detections: 6, prevented: 6, damage: 0 },
    { day: 'Fri', detections: 11, prevented: 9, damage: 2 },
    { day: 'Sat', detections: 18, prevented: 15, damage: 3 },
    { day: 'Sun', detections: 14, prevented: 12, damage: 2 }
  ];

  const threatLevels = [
    { level: 'Low', count: 45, color: '#22c55e' },
    { level: 'Medium', count: 28, color: '#f59e0b' },
    { level: 'High', count: 12, color: '#ef4444' },
    { level: 'Critical', count: 3, color: '#dc2626' }
  ];

  const economicImpact = {
    totalSaved: 2850,
    potentialLoss: 3420,
    systemCost: 580,
    roi: 492
  };

  const hotspots = [
    { location: 'North Field A', incidents: 23, trend: 'up' },
    { location: 'Water Source', incidents: 18, trend: 'down' },
    { location: 'South Gate', incidents: 15, trend: 'stable' },
    { location: 'East Border', incidents: 9, trend: 'up' }
  ];

  const weatherCorrelation = [
    { condition: 'Sunny', detections: 8 },
    { condition: 'Rainy', detections: 15 },
    { condition: 'Cloudy', detections: 12 },
    { condition: 'Windy', detections: 6 }
  ];

  return (
    <div className="space-y-6">
      {/* Economic Impact */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Crop Value Saved</p>
                <p className="text-2xl font-bold text-green-500">${economicImpact.totalSaved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Potential Loss</p>
                <p className="text-2xl font-bold text-red-500">${economicImpact.potentialLoss}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Prevention Rate</p>
                <p className="text-2xl font-bold text-blue-500">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">ROI</p>
                <p className="text-2xl font-bold text-primary">{economicImpact.roi}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Detection & Prevention Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="detections" fill="#ef4444" name="Detections" />
              <Bar dataKey="prevented" fill="#22c55e" name="Prevented" />
              <Bar dataKey="damage" fill="#f59e0b" name="Damage Incidents" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Threat Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={threatLevels}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ level, count }) => `${level}: ${count}`}
                >
                  {threatLevels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weather Correlation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Weather Impact Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weatherCorrelation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="condition" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="detections" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Hotspots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Activity Hotspots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hotspots.map((spot, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="font-medium">{spot.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{spot.incidents} incidents</span>
                  <Badge variant={
                    spot.trend === 'up' ? 'destructive' : 
                    spot.trend === 'down' ? 'default' : 'secondary'
                  }>
                    {spot.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {spot.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {spot.trend}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            AI Insights & Predictions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
              Peak Activity Prediction
            </h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Based on historical data, expect 40% higher animal activity between 5-7 AM tomorrow due to rain forecast.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
              Maintenance Alert
            </h4>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Camera 3 battery level is low (15%). Schedule maintenance within 24 hours.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
              Efficiency Improvement
            </h4>
            <p className="text-sm text-green-600 dark:text-green-400">
              Deterrent effectiveness increased by 23% after adjusting ultrasonic frequency settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};