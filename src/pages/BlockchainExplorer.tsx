import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Hash, Clock, ArrowRight, ChevronRight, Shield, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import { generateWasteEntries, generateBlockchain, type Block } from '@/lib/mockData';

export default function BlockchainExplorer() {
  const entries = useMemo(() => generateWasteEntries(50), []);
  const blocks = useMemo(() => generateBlockchain(entries), [entries]);
  const [selected, setSelected] = useState<Block | null>(null);

  return (
    <DashboardLayout title="Blockchain Explorer">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gov-card p-8 bg-white text-center">
          <p className="text-4xl font-black text-accent">{blocks.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">Certified Blocks</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="gov-card p-8 bg-white text-center">
          <p className="text-4xl font-black text-secondary">100.0%</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">Audit Integrity</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="gov-card p-8 bg-white text-center flex flex-col items-center justify-center">
          <Shield className="w-8 h-8 text-primary mb-2" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Node Verified</p>
        </motion.div>
      </div>

      {/* Visual Chain */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="gov-card p-8 bg-white mb-10 overflow-x-auto">
        <h3 className="text-lg font-bold text-accent mb-6 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary" /> Lifecycle Audit Chain
        </h3>
        <div className="flex items-center gap-2 min-w-max pb-2">
          {blocks.slice(0, 15).map((block, i) => (
            <div key={block.blockId} className="flex items-center">
              <button
                onClick={() => setSelected(block)}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all min-w-[120px] ${selected?.blockId === block.blockId
                    ? 'border-primary bg-primary/5 shadow-inner'
                    : 'border-border/30 hover:border-primary/30'
                  }`}
              >
                <Hash className="w-5 h-5 text-primary mb-2" />
                <span className="text-[10px] font-black font-mono text-accent">{block.blockId}</span>
                <span className="text-[10px] text-muted-foreground mt-2 uppercase font-bold tracking-tighter">{block.wasteId}</span>
              </button>
              {i < Math.min(blocks.length, 15) - 1 && (
                <ChevronRight className="w-4 h-4 text-primary/40 mx-1 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Block List */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="gov-card p-8 bg-white">
            <h3 className="text-lg font-bold text-accent mb-6">Master Ledger</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {blocks.map((block) => (
                <button
                  key={block.blockId}
                  onClick={() => setSelected(block)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${selected?.blockId === block.blockId ? 'border-primary bg-primary/5' : 'border-border/20 hover:border-border/40'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-mono font-bold text-primary">
                      #{block.id}
                    </div>
                    <div>
                      <p className="text-sm font-mono">{block.blockId}</p>
                      <p className="text-xs text-muted-foreground">{block.wasteId} · {block.data.citizen}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={block.status} />
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Block Detail */}
        <div>
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.blockId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="gov-card p-10 bg-white sticky top-28 border-2 border-primary/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Block Details</h3>
                  <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-muted/50">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <DetailRow label="Block ID" value={selected.blockId} mono />
                  <DetailRow label="Block #" value={`#${selected.id}`} />
                  <DetailRow label="Waste ID" value={selected.wasteId} mono />
                  <DetailRow label="Timestamp" value={new Date(selected.timestamp).toLocaleString()} />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <StatusBadge status={selected.status} />
                  </div>
                  <DetailRow label="Waste Type" value={selected.data.type} />
                  <DetailRow label="Weight" value={`${selected.data.weight} kg`} />
                  <DetailRow label="Area" value={selected.data.area} />
                  <DetailRow label="Citizen" value={selected.data.citizen} />
                  <div className="pt-6 border-t font-mono">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Previous Block Hash</p>
                    <p className="text-[10px] text-muted-foreground break-all bg-muted p-4 rounded-lg leading-relaxed shadow-inner">{selected.previousHash}</p>
                  </div>
                  <div className="pt-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Certified Block Hash</p>
                    <p className="text-[10px] font-black font-mono text-primary break-all bg-primary/5 p-4 rounded-lg leading-relaxed border border-primary/20">{selected.currentHash}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gov-card p-10 bg-white text-center italic border-dashed border-2">
                <Hash className="w-12 h-12 text-muted/30 mx-auto mb-6" />
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Select Block from Ledger</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className={`text-sm ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
