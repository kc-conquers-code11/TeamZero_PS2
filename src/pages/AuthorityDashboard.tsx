import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building2, BarChart3, AlertTriangle, TrendingUp, Recycle, Users, Truck, Shield, Info, CheckCircle2 } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import KPICard from '@/components/KPICard';
import {
  generateWasteEntries, generateAnomalies,
  weeklyTrends, monthlyData, areaData, smartInsights,
  wasteTypeColors,
} from '@/lib/mockData';

const chartStyle = {
  background: 'hsl(0, 0%, 100%)',
  border: '1px solid hsl(214.3, 31.8%, 91.4%)',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'hsl(222, 47% 11%)'
};

const insightIcons = { warning: AlertTriangle, alert: AlertTriangle, success: CheckCircle2, info: Info };
const insightColors = {
  warning: 'text-primary bg-primary/10 border border-primary/20',
  alert: 'text-destructive bg-destructive/10 border border-destructive/20',
  success: 'text-secondary bg-secondary/10 border border-secondary/20',
  info: 'text-accent bg-accent/10 border border-accent/20'
};

export default function AuthorityDashboard() {
  const entries = useMemo(() => generateWasteEntries(50), []);
  const anomalies = useMemo(() => generateAnomalies(), []);
  const totalWeight = entries.reduce((s, e) => s + e.weight, 0);
  const recycled = entries.filter(e => e.status === 'recycled').length;
  const efficiency = Math.round((recycled / entries.length) * 100);

  const typeDistribution = Object.entries(
    entries.reduce((acc, e) => { acc[e.type] = (acc[e.type] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value, color: wasteTypeColors[name as keyof typeof wasteTypeColors] }));

  return (
    <DashboardLayout title="Authority Command Center">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <KPICard title="Total Processed" value={Math.round(totalWeight)} suffix=" kg" icon={Recycle} trend={18} delay={0} />
        <KPICard title="Segregation Efficiency" value={efficiency} suffix="%" icon={BarChart3} trend={5} delay={0.1} />
        <KPICard title="Active Citizens" value={1240} icon={Users} trend={12} delay={0.2} />
        <KPICard title="Anomalies Detected" value={anomalies.length} icon={AlertTriangle} delay={0.3} />
      </div>

      {/* Row 1: Trends + Distribution */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 gov-card p-8 bg-white">
          <h3 className="text-lg font-bold text-accent mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Weekly Processing Audit
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyTrends}>
              <defs>
                <linearGradient id="colorWet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDry" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPlastic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 16%)" />
              <XAxis dataKey="day" stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <Tooltip contentStyle={chartStyle} />
              <Legend />
              <Area type="monotone" dataKey="wet" stroke="#10b981" fill="url(#colorWet)" strokeWidth={2} />
              <Area type="monotone" dataKey="dry" stroke="#f59e0b" fill="url(#colorDry)" strokeWidth={2} />
              <Area type="monotone" dataKey="plastic" stroke="#06b6d4" fill="url(#colorPlastic)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="gov-card p-8 bg-white">
          <h3 className="text-lg font-bold text-accent mb-6">Waste Categorization</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                {typeDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={chartStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {typeDistribution.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="capitalize">{d.name}</span>
                </div>
                <span className="text-muted-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 2: Monthly + Area Performance */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="gov-card p-8 bg-white">
          <h3 className="text-lg font-bold text-accent mb-6">Monthly Volume Statistics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 16%)" />
              <XAxis dataKey="month" stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <Tooltip contentStyle={chartStyle} />
              <Legend />
              <Bar dataKey="recycled" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="landfill" fill="#6b7280" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="gov-card p-8 bg-white">
          <h3 className="text-lg font-bold text-accent mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" /> Zone-wise Compliance
          </h3>
          <div className="space-y-3">
            {areaData.sort((a, b) => b.efficiency - a.efficiency).map((area) => (
              <div key={area.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{area.name}</span>
                  <span className={area.efficiency >= 80 ? 'text-primary' : area.efficiency >= 70 ? 'text-amber-400' : 'text-destructive'}>{area.efficiency}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${area.efficiency}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${area.efficiency >= 80 ? 'bg-primary' : area.efficiency >= 70 ? 'bg-amber-400' : 'bg-destructive'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 3: Anomalies + Smart Insights */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Anomalies */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="gov-card p-8 bg-white">
          <h3 className="text-lg font-bold text-accent mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" /> Real-time Anomaly Alerts
          </h3>
          <div className="space-y-3">
            {anomalies.map((a) => (
              <div key={a.id} className={`p-3 rounded-xl border ${a.severity === 'high' ? 'border-destructive/30 bg-destructive/5' : a.severity === 'medium' ? 'border-amber-500/30 bg-amber-500/5' : 'border-border/30'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm">{a.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {a.area} · {new Date(a.timestamp).toLocaleDateString()} · {a.wasteId}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${a.severity === 'high' ? 'bg-destructive/10 text-destructive' :
                      a.severity === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-muted text-muted-foreground'
                    }`}>{a.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Smart Insights */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="gov-card p-8 bg-white">
          <h3 className="text-lg font-bold text-accent mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Predictive Intelligence (AI)
          </h3>
          <div className="space-y-3">
            {smartInsights.map((insight, i) => {
              const Icon = insightIcons[insight.type];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border/20"
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${insightColors[insight.type]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm">{insight.message}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
