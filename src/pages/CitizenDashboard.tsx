import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Leaf, Upload, Clock, Trophy, Star, Flame, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import KPICard from '@/components/KPICard';
import StatusBadge from '@/components/StatusBadge';
import WasteTypeBadge from '@/components/WasteTypeBadge';
import { generateWasteEntries, type WasteType, type WasteEntry } from '@/lib/mockData';

const wasteOptions: { type: WasteType; label: string; emoji: string }[] = [
  { type: 'wet', label: 'Wet Waste', emoji: '💧' },
  { type: 'dry', label: 'Dry Waste', emoji: '📦' },
  { type: 'plastic', label: 'Plastic', emoji: '♻️' },
  { type: 'hazardous', label: 'Hazardous', emoji: '⚠️' },
  { type: 'ewaste', label: 'E-Waste', emoji: '🔌' },
];

const badges = [
  { name: 'First Submit', icon: Star, earned: true },
  { name: '7-Day Streak', icon: Flame, earned: true },
  { name: 'Eco Warrior', icon: Award, earned: true },
  { name: '100 Submissions', icon: Trophy, earned: false },
];

export default function CitizenDashboard() {
  const entries = useMemo(() => generateWasteEntries(20), []);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedType, setSelectedType] = useState<WasteType>('wet');
  const [qrData, setQrData] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<WasteEntry | null>(null);

  const handleSubmit = () => {
    const id = `W-${Date.now().toString(36).toUpperCase()}`;
    const qr = `TB-${id}-${selectedType}`;
    setQrData(qr);
  };

  return (
    <DashboardLayout title="Citizen Dashboard">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <KPICard title="Green Score" value={725} icon={Leaf} trend={12} delay={0} />
        <KPICard title="Total Submissions" value={entries.length} icon={Upload} trend={8} delay={0.1} />
        <KPICard title="Current Streak" value={7} suffix=" days" icon={Flame} delay={0.2} />
        <KPICard title="Badges Earned" value={3} icon={Trophy} delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Submit + QR */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upload Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="gov-card p-8 bg-white">
            <h3 className="text-lg font-bold text-accent mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" /> New Waste Submission
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {wasteOptions.map((w) => (
                <button
                  key={w.type}
                  onClick={() => setSelectedType(w.type)}
                  className={`p-3 rounded-xl border text-sm text-left transition-all ${selectedType === w.type ? 'border-primary bg-primary/10' : 'border-border/30 hover:border-border/60'
                    }`}
                >
                  <span className="text-lg">{w.emoji}</span>
                  <p className="text-xs mt-1">{w.label}</p>
                </button>
              ))}
            </div>
            <div className="border-2 border-dashed border-border/30 rounded-xl p-6 text-center mb-4">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Upload waste image (simulated)</p>
            </div>
            <Button className="w-full h-12 font-black uppercase tracking-widest text-sm" onClick={handleSubmit}>
              Verify & Generate QR
            </Button>
          </motion.div>

          {/* QR Result */}
          {qrData && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="gov-card p-8 bg-white text-center border-2 border-primary/20">
              <h3 className="text-lg font-bold text-accent mb-6">Official Waste QR</h3>
              <div className="bg-muted p-6 rounded-xl inline-block mb-4 shadow-inner">
                <QRCodeSVG value={qrData} size={180} bgColor="transparent" fgColor="hsl(27, 100%, 50%)" />
              </div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{qrData}</p>
            </motion.div>
          )}

          {/* Badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" /> Badges
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((b) => (
                <div key={b.name} className={`p-3 rounded-xl text-center ${b.earned ? 'bg-primary/10' : 'bg-muted/50 opacity-50'}`}>
                  <b.icon className={`w-6 h-6 mx-auto mb-1 ${b.earned ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="text-xs font-medium">{b.name}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Timeline + History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Journey Timeline */}
          {selectedEntry && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gov-card p-8 bg-white">
              <h3 className="text-lg font-bold text-accent mb-8 flex items-center gap-2 border-b pb-4">
                <Clock className="w-5 h-5 text-primary" /> Lifecycle Audit — {selectedEntry.id}
              </h3>
              <div className="relative ml-6">
                {selectedEntry.timeline.map((step, i) => (
                  <div key={i} className="flex gap-6 mb-10 last:mb-0">
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-primary mt-1 shadow-lg shadow-primary/30" />
                      {i < selectedEntry.timeline.length - 1 && (
                        <div className="absolute top-5 left-2 w-0.5 h-full bg-border" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <StatusBadge status={step.status} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verification Node</span>
                      </div>
                      <p className="text-xs font-bold text-accent">
                        {new Date(step.timestamp).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground lowercase mt-1 italic">Authorized by node: {step.by}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* History */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="gov-card p-8 bg-white h-full">
            <h3 className="text-lg font-bold text-accent mb-6">Submission Audit Trail</h3>
            <div className="space-y-3">
              {entries.slice(0, 10).map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${selectedEntry?.id === entry.id ? 'border-primary bg-primary/5' : 'border-border/20 hover:border-border/50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-muted-foreground">{entry.id}</span>
                    <WasteTypeBadge type={entry.type} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{entry.weight} kg</span>
                    <StatusBadge status={entry.status} />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
