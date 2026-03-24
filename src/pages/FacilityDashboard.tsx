import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Factory, CheckCircle2, XCircle, Recycle, Trash2, Upload, BarChart3, ScanLine, ShieldCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/DashboardLayout';
import KPICard from '@/components/KPICard';
import StatusBadge from '@/components/StatusBadge';
import WasteTypeBadge from '@/components/WasteTypeBadge';
import { generateWasteEntries, type WasteStatus, wasteTypeColors } from '@/lib/mockData';

export default function FacilityDashboard() {
  const entries = useMemo(() => generateWasteEntries(40).filter(e => ['delivered', 'recycled', 'landfill', 'rejected'].includes(e.status)), []);
  const [processedStatuses, setProcessedStatuses] = useState<Record<string, WasteStatus>>({});
  const [qrInput, setQrInput] = useState('');
  const [verificationNode, setVerificationNode] = useState<string | null>(null);

  const getStatus = (id: string, original: WasteStatus) => processedStatuses[id] || original;
  const updateStatus = (id: string, status: WasteStatus) => setProcessedStatuses(prev => ({ ...prev, [id]: status }));

  const recycled = entries.filter(e => getStatus(e.id, e.status) === 'recycled').length;
  const landfill = entries.filter(e => getStatus(e.id, e.status) === 'landfill').length;
  const rejected = entries.filter(e => getStatus(e.id, e.status) === 'rejected').length;

  const pieData = [
    { name: 'Recycled', value: recycled, color: '#10b981' },
    { name: 'Landfill', value: landfill, color: '#6b7280' },
    { name: 'Rejected', value: rejected, color: '#f43f5e' },
    { name: 'Pending', value: entries.length - recycled - landfill - rejected, color: '#8b5cf6' },
  ];

  const typeBreakdown = Object.entries(
    entries.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + e.weight;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: Math.round(value as number), color: wasteTypeColors[name as keyof typeof wasteTypeColors] }));

  return (
    <DashboardLayout title="Processing Facility">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <KPICard title="Incoming Today" value={entries.length} icon={Factory} delay={0} />
        <KPICard title="Recycled" value={recycled} icon={Recycle} trend={15} delay={0.1} />
        <KPICard title="Landfill" value={landfill} icon={Trash2} trend={-10} delay={0.2} />
        <KPICard title="Efficiency" value={entries.length > 0 ? Math.round((recycled / Math.max(entries.length, 1)) * 100) : 0} suffix="%" icon={BarChart3} delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Verification Terminal */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gov-card p-8 bg-white">
          <h3 className="text-lg font-bold text-accent mb-6 flex items-center gap-2 border-b pb-4">
            <ScanLine className="w-5 h-5 text-primary" /> Verification Terminal
          </h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 italic">Confirm Collector Batch QR</p>
          <div className="relative mb-4 group">
            <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              placeholder="Batch QR / Waste ID"
              className="pl-10 h-10 text-xs font-mono"
            />
          </div>
          <Button
            className="w-full h-10 font-black uppercase tracking-widest text-[10px]"
            onClick={() => {
              const entry = entries.find(e => e.id === qrInput.toUpperCase());
              if (entry) setVerificationNode(entry.id);
            }}
          >
            Verify Node Access
          </Button>

          {verificationNode && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-emerald-600">Batch Verified</p>
                <p className="text-[10px] text-emerald-600/70 font-mono tracking-tighter">NODE-REG: {verificationNode}</p>
              </div>
            </div>
          )}

          <div className="h-[1px] bg-border/20 my-8" />

          <h3 className="text-lg font-bold text-accent mb-6">Processing Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-tighter">
                <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                {d.name.slice(0, 3)}: {d.value}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-bold text-accent mt-8 mb-6">Categorization Audit</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={typeBreakdown} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                {typeBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Queue */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="gov-card p-8 bg-white h-full">
            <h3 className="text-lg font-bold text-accent mb-6">Processing Queue & Verification</h3>
            <div className="space-y-4 max-h-[650px] overflow-y-auto pr-2">
              {entries.slice(0, 15).map((entry) => {
                const currentStatus = getStatus(entry.id, entry.status);
                return (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl border border-border/20">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-mono text-muted-foreground">{entry.id}</span>
                      <WasteTypeBadge type={entry.type} />
                      <span className="text-xs text-muted-foreground">{entry.weight} kg</span>
                      <StatusBadge status={currentStatus} />
                    </div>
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => updateStatus(entry.id, 'recycled')}>
                        <Recycle className="w-3 h-3" /> Recycle
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => updateStatus(entry.id, 'landfill')}>
                        <Trash2 className="w-3 h-3" /> Landfill
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive" onClick={() => updateStatus(entry.id, 'rejected')}>
                        <XCircle className="w-3 h-3" /> Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
