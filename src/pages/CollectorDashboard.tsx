import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Truck, ScanLine, MapPin, CheckCircle2, Clock, Package, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/DashboardLayout';
import KPICard from '@/components/KPICard';
import StatusBadge from '@/components/StatusBadge';
import WasteTypeBadge from '@/components/WasteTypeBadge';
import { generateWasteEntries, type WasteStatus } from '@/lib/mockData';

const statusFlow: WasteStatus[] = ['collected', 'in_transit', 'delivered'];

export default function CollectorDashboard() {
  const entries = useMemo(() => generateWasteEntries(30).filter(e => ['submitted', 'collected', 'in_transit'].includes(e.status)), []);
  const [qrInput, setQrInput] = useState('');
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [updatedStatuses, setUpdatedStatuses] = useState<Record<string, WasteStatus>>({});

  const handleScan = () => {
    if (!qrInput) return;

    // Check if input is a TB QR (format: TB|ID|...) or just an ID
    const searchId = qrInput.includes('|') ? qrInput.split('|')[1] : qrInput.toUpperCase();
    const entry = entries.find(e => e.id === searchId || e.id.includes(searchId));

    if (entry) {
      setScannedId(entry.id);
      updateStatus(entry.id, 'collected');
    } else {
      setScannedId('NOT_FOUND');
    }
  };

  const updateStatus = (id: string, status: WasteStatus) => {
    setUpdatedStatuses(prev => ({ ...prev, [id]: status }));
  };

  const getStatus = (id: string, original: WasteStatus) => updatedStatuses[id] || original;

  const collected = entries.filter(e => getStatus(e.id, e.status) !== 'submitted').length;
  const delivered = entries.filter(e => getStatus(e.id, e.status) === 'delivered').length;

  return (
    <DashboardLayout title="Collector Interface">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <KPICard title="Assigned Today" value={entries.length} icon={Package} delay={0} />
        <KPICard title="Collected" value={collected} icon={CheckCircle2} trend={5} delay={0.1} />
        <KPICard title="Delivered" value={delivered} icon={Truck} delay={0.2} />
        <KPICard title="Avg. Time" value={42} suffix=" min" icon={Clock} trend={-8} delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Scanner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gov-card p-8 bg-white">
          <h3 className="text-lg font-bold text-accent mb-6 flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-primary" /> Multi-Scan Terminal
          </h3>
          <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center mb-4 bg-primary/5">
            <ScanLine className="w-12 h-12 text-primary mx-auto mb-3 animate-pulse" />
            <p className="text-sm text-muted-foreground">Camera scanner simulated</p>
          </div>
          <Input
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            placeholder="QR Code / Waste ID"
            className="mb-3 bg-background/50"
          />
          <Button className="w-full h-12 font-bold uppercase tracking-widest" onClick={handleScan}>
            Launch Camera Scanner
          </Button>
          {scannedId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-6 p-4 rounded-lg border-2 flex items-center gap-3 ${scannedId === 'NOT_FOUND'
                  ? 'bg-destructive/10 border-destructive/20 text-destructive'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                }`}
            >
              {scannedId === 'NOT_FOUND' ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-wider">Invalid Token</p>
                    <p className="text-[10px] opacity-70">Entry not found in blockchain registry</p>
                  </div>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-wider">Verified Identity</p>
                    <p className="text-[10px] opacity-70">Node verified: {scannedId}</p>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Route Simulation */}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Route Progress
            </h4>
            <div className="space-y-2">
              {['Sector 17', 'Green Valley', 'Downtown', 'Riverside'].map((area, i) => (
                <div key={area} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${i < 2 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                  <span className={`text-sm ${i < 2 ? 'text-foreground' : 'text-muted-foreground'}`}>{area}</span>
                  {i < 2 && <CheckCircle2 className="w-3.5 h-3.5 text-primary ml-auto" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Waste Queue */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="gov-card p-8 bg-white h-full">
            <h3 className="text-lg font-bold text-accent mb-6">Active Collection Queue</h3>
            <div className="space-y-3">
              {entries.slice(0, 12).map((entry) => {
                const currentStatus = getStatus(entry.id, entry.status);
                return (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl border border-border/20 hover:border-border/40 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-muted-foreground">{entry.id}</span>
                      <WasteTypeBadge type={entry.type} />
                      <span className="text-xs text-muted-foreground hidden sm:inline">{entry.area}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={currentStatus} />
                      <div className="flex gap-1">
                        {statusFlow.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(entry.id, s)}
                            className={`px-2 py-1 rounded text-xs transition-all ${currentStatus === s ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                              }`}
                          >
                            {s === 'collected' ? '📦' : s === 'in_transit' ? '🚛' : '✅'}
                          </button>
                        ))}
                      </div>
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
