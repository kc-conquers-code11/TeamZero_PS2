import { type WasteType } from '@/lib/mockData';

const typeConfig: Record<WasteType, { label: string; emoji: string; className: string }> = {
  wet: { label: 'Wet', emoji: '💧', className: 'bg-primary/10 text-primary' },
  dry: { label: 'Dry', emoji: '📦', className: 'bg-amber-500/10 text-amber-400' },
  plastic: { label: 'Plastic', emoji: '♻️', className: 'bg-cyan-500/10 text-cyan-400' },
  hazardous: { label: 'Hazardous', emoji: '⚠️', className: 'bg-destructive/10 text-destructive' },
  ewaste: { label: 'E-Waste', emoji: '🔌', className: 'bg-purple-500/10 text-purple-400' },
};

export default function WasteTypeBadge({ type }: { type: WasteType }) {
  const config = typeConfig[type];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.emoji} {config.label}
    </span>
  );
}
