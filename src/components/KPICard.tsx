import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  trend?: number;
  delay?: number;
  decimals?: number;
}

export default function KPICard({ title, value, prefix, suffix, icon: Icon, trend, delay = 0, decimals = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="gov-card p-6 bg-white"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          {trend !== undefined && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} className="text-3xl font-bold tracking-tight" />
      </div>
    </motion.div>
  );
}
