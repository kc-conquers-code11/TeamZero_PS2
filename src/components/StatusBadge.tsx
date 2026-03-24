// src/components/StatusBadge.tsx
import { WasteStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: WasteStatus;
  showDot?: boolean;
}

const statusConfig: Record<WasteStatus, { label: string; className: string }> = {
  submitted: { 
    label: 'Submitted', 
    className: 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
  },
  collected: { 
    label: 'Collected', 
    className: 'bg-blue-100 text-blue-800 border border-blue-200' 
  },
  in_transit: { 
    label: 'In Transit', 
    className: 'bg-purple-100 text-purple-800 border border-purple-200' 
  },
  delivered: { 
    label: 'Delivered', 
    className: 'bg-green-100 text-green-800 border border-green-200' 
  },
  processed: { 
    label: 'Processed', 
    className: 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
  },
};

export default function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  if (!config) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />}
        {status}
      </span>
    );
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />}
      {config.label}
    </span>
  );
}