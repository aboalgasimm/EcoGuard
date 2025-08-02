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
    { day: 'الاثنين', detections: 12, prevented: 10, damage: 2 },
    { day: 'الثلاثاء', detections: 8, prevented: 7, damage: 1 },
    { day: 'الأربعاء', detections: 15, prevented: 13, damage: 2 },
    { day: 'الخميس', detections: 6, prevented: 6, damage: 0 },
    { day: 'الجمعة', detections: 11, prevented: 9, damage: 2 },
    { day: 'السبت', detections: 18, prevented: 15, damage: 3 },
    { day: 'الأحد', detections: 14, prevented: 12, damage: 2 }
  ];

  const threatLevels = [
    { level: 'منخفض', count: 45, color: '#22c55e' },
    { level: 'متوسط', count: 28, color: '#f59e0b' },
    { level: 'عالي', count: 12, color: '#ef4444' },
    { level: 'خطير', count: 3, color: '#dc2626' }
  ];

  const economicImpact = {
    totalSaved: 2850,
    potentialLoss: 3420,
    systemCost: 580,
    roi: 492
  };

  const hotspots = [
    { location: 'الحقل الشمالي أ', incidents: 23, trend: 'up' },
    { location: 'مصدر المياه', incidents: 18, trend: 'down' },
    { location: 'البوابة الجنوبية', incidents: 15, trend: 'stable' },
    { location: 'الحدود الخلفية', incidents: 9, trend: 'up' }
  ];

  const weatherCorrelation = [
    { condition: 'مشمس', detections: 8 },
    { condition: 'ماطر', detections: 15 },
    { condition: 'غائم', detections: 12 },
    { condition: 'عاصف', detections: 6 }
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
                <p className="text-sm text-muted-foreground">قيمة المحاصيل المحفوظة</p>
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
                <p className="text-sm text-muted-foreground">الخسائر المحتملة</p>
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
                <p className="text-sm text-muted-foreground">معدل الوقاية</p>
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
                <p className="text-sm text-muted-foreground">عائد الاستثمار</p>
                <p className="text-2xl font-bold text-primary">{economicImpact.roi}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>اتجاهات الكشف والوقاية الأسبوعية</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="detections" fill="#ef4444" name="الاكتشافات" />
              <Bar dataKey="prevented" fill="#22c55e" name="تم منعها" />
              <Bar dataKey="damage" fill="#f59e0b" name="حوادث الضرر" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع مستويات التهديد</CardTitle>
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
              تحليل تأثير الطقس
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
            نقاط النشاط الساخنة
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
                  <span className="text-sm text-muted-foreground">{spot.incidents} حوادث</span>
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
            رؤى وتوقعات الذكاء الاصطناعي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
              توقع ذروة النشاط
            </h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              بناءً على البيانات التاريخية، توقع زيادة نشاط الحيوانات بنسبة 40% بين الساعة 5-7 صباحاً غداً بسبب توقعات الأمطار.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
              تنبيه الصيانة
            </h4>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              مستوى البطارية في الكاميرا 3 منخفض (15%). جدولة الصيانة خلال 24 ساعة.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
              تحسين الكفاءة
            </h4>
            <p className="text-sm text-green-600 dark:text-green-400">
              ازدادت فعالية الردع بنسبة 23% بعد تعديل إعدادات التردد فوق الصوتي.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};