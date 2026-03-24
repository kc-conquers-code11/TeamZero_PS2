import { type WasteStatus } from '@/lib/mockData';

const statusConfig: Record<WasteStatus, { label: string; className: string }> = {
  submitted: { label: 'Assigned', className: 'bg-muted text-muted-foreground' },
  collected: { label: 'Collected', className: 'bg-secondary/10 text-secondary border border-secondary/20' },
  in_transit: { label: 'In Transit', className: 'bg-primary/10 text-primary border border-primary/20' },
  delivered: { label: 'Verified', className: 'bg-accent/10 text-accent border border-accent/20' },
  recycled: { label: 'Processed', className: 'bg-secondary/20 text-secondary border border-secondary/30' },
  landfill: { label: 'Storage', className: 'bg-muted text-muted-foreground' },
  rejected: { label: 'Flagged', className: 'bg-destructive/10 text-destructive border border-destructive/20' },
};

export default function StatusBadge({ status }: { status: WasteStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {config.label}
    </span>
  );
}
