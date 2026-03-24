// src/components/WasteTypeBadge.tsx
import { WasteType } from '@/lib/types';

interface WasteTypeBadgeProps {
  type: WasteType;
}

const typeConfig: Record<WasteType, { label: string; className: string; icon: string }> = {
  wet: { label: 'Wet Waste', className: 'bg-green-100 text-green-800', icon: '💧' },
  dry: { label: 'Dry Waste', className: 'bg-orange-100 text-orange-800', icon: '📦' },
  plastic: { label: 'Plastic', className: 'bg-cyan-100 text-cyan-800', icon: '♻️' },
  hazardous: { label: 'Hazardous', className: 'bg-red-100 text-red-800', icon: '⚠️' },
  ewaste: { label: 'E-Waste', className: 'bg-purple-100 text-purple-800', icon: '🔌' },
};

export default function WasteTypeBadge({ type }: WasteTypeBadgeProps) {
  const config = typeConfig[type];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
}