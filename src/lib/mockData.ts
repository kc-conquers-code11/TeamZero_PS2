// Simple hash function for blockchain mock
export function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(12, '0') + 
    Math.random().toString(16).slice(2, 14);
}

export type WasteType = 'wet' | 'dry' | 'plastic' | 'hazardous' | 'ewaste';
export type WasteStatus = 'submitted' | 'collected' | 'in_transit' | 'delivered' | 'recycled' | 'landfill' | 'rejected';

export interface WasteEntry {
  id: string;
  citizenId: string;
  citizenName: string;
  type: WasteType;
  weight: number; // kg
  status: WasteStatus;
  timestamp: string;
  area: string;
  collectorId?: string;
  collectorName?: string;
  facilityId?: string;
  imageUrl?: string;
  qrCode: string;
  timeline: { status: WasteStatus; timestamp: string; by: string }[];
}

export interface Block {
  id: number;
  blockId: string;
  timestamp: string;
  wasteId: string;
  previousHash: string;
  currentHash: string;
  status: WasteStatus;
  data: {
    type: WasteType;
    weight: number;
    area: string;
    citizen: string;
  };
}

export interface Anomaly {
  id: string;
  type: 'missing_step' | 'fake_completion' | 'delayed' | 'suspicious';
  severity: 'high' | 'medium' | 'low';
  description: string;
  wasteId: string;
  timestamp: string;
  area: string;
}

const areas = ['Sector 17', 'Green Valley', 'Downtown', 'Riverside', 'Industrial Zone', 'Tech Park', 'Old Town', 'Harbor District'];
const citizenNames = ['Arjun Patel', 'Priya Sharma', 'Rahul Verma', 'Sneha Gupta', 'Vikram Singh', 'Anita Desai', 'Karan Mehta', 'Neha Joshi'];
const collectorNames = ['Ravi Kumar', 'Suresh Yadav', 'Amit Chauhan', 'Deepak Nair'];

function randomDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  d.setHours(Math.floor(Math.random() * 12) + 7);
  d.setMinutes(Math.floor(Math.random() * 60));
  return d.toISOString();
}

function generateTimeline(status: WasteStatus, baseDate: string): { status: WasteStatus; timestamp: string; by: string }[] {
  const statuses: WasteStatus[] = ['submitted', 'collected', 'in_transit', 'delivered'];
  const endStatuses: WasteStatus[] = ['recycled', 'landfill', 'rejected'];
  const timeline: { status: WasteStatus; timestamp: string; by: string }[] = [];
  
  const base = new Date(baseDate);
  const statusIndex = [...statuses, ...endStatuses].indexOf(status);
  
  for (let i = 0; i <= Math.min(statusIndex, statuses.length - 1); i++) {
    const d = new Date(base);
    d.setHours(d.getHours() + i * 2);
    timeline.push({
      status: statuses[i],
      timestamp: d.toISOString(),
      by: i === 0 ? citizenNames[Math.floor(Math.random() * citizenNames.length)] :
          i <= 2 ? collectorNames[Math.floor(Math.random() * collectorNames.length)] :
          'Processing Facility Alpha',
    });
  }
  
  if (endStatuses.includes(status)) {
    const d = new Date(base);
    d.setHours(d.getHours() + 10);
    timeline.push({ status, timestamp: d.toISOString(), by: 'Processing Facility Alpha' });
  }
  
  return timeline;
}

export function generateWasteEntries(count: number = 50): WasteEntry[] {
  const types: WasteType[] = ['wet', 'dry', 'plastic', 'hazardous', 'ewaste'];
  const allStatuses: WasteStatus[] = ['submitted', 'collected', 'in_transit', 'delivered', 'recycled', 'landfill', 'rejected'];
  
  return Array.from({ length: count }, (_, i) => {
    const status = allStatuses[Math.floor(Math.random() * allStatuses.length)];
    const timestamp = randomDate(30);
    const citizen = citizenNames[Math.floor(Math.random() * citizenNames.length)];
    const id = `W-${(1000 + i).toString()}`;
    return {
      id,
      citizenId: `C-${Math.floor(Math.random() * 8) + 1}`,
      citizenName: citizen,
      type: types[Math.floor(Math.random() * types.length)],
      weight: parseFloat((Math.random() * 10 + 0.5).toFixed(1)),
      status,
      timestamp,
      area: areas[Math.floor(Math.random() * areas.length)],
      collectorId: `COL-${Math.floor(Math.random() * 4) + 1}`,
      collectorName: collectorNames[Math.floor(Math.random() * collectorNames.length)],
      qrCode: `TB-${id}-${Date.now().toString(36)}`,
      timeline: generateTimeline(status, timestamp),
    };
  });
}

export function generateBlockchain(entries: WasteEntry[]): Block[] {
  let previousHash = '0'.repeat(24);
  return entries
    .filter(e => e.status !== 'submitted')
    .slice(0, 30)
    .map((entry, i) => {
      const data = { type: entry.type, weight: entry.weight, area: entry.area, citizen: entry.citizenName };
      const currentHash = simpleHash(`${i}${entry.id}${previousHash}${JSON.stringify(data)}`);
      const block: Block = {
        id: i + 1,
        blockId: `BLK-${(i + 1).toString().padStart(4, '0')}`,
        timestamp: entry.timestamp,
        wasteId: entry.id,
        previousHash,
        currentHash,
        status: entry.status,
        data,
      };
      previousHash = currentHash;
      return block;
    });
}

export function generateAnomalies(): Anomaly[] {
  return [
    { id: 'A-001', type: 'fake_completion', severity: 'high', description: 'Waste W-1023 marked as recycled but no facility verification found', wasteId: 'W-1023', timestamp: randomDate(3), area: 'Industrial Zone' },
    { id: 'A-002', type: 'missing_step', severity: 'high', description: 'Waste W-1015 jumped from "submitted" to "recycled" — collection step missing', wasteId: 'W-1015', timestamp: randomDate(5), area: 'Downtown' },
    { id: 'A-003', type: 'delayed', severity: 'medium', description: 'Waste W-1031 stuck in "in_transit" for over 48 hours', wasteId: 'W-1031', timestamp: randomDate(2), area: 'Old Town' },
    { id: 'A-004', type: 'suspicious', severity: 'medium', description: 'Collector COL-3 has unusually high completion rate in Sector 17', wasteId: 'W-1042', timestamp: randomDate(1), area: 'Sector 17' },
    { id: 'A-005', type: 'missing_step', severity: 'low', description: 'Waste W-1008 missing transit verification step', wasteId: 'W-1008', timestamp: randomDate(7), area: 'Green Valley' },
    { id: 'A-006', type: 'fake_completion', severity: 'high', description: 'Bulk waste from Tech Park marked processed without weight verification', wasteId: 'W-1050', timestamp: randomDate(1), area: 'Tech Park' },
  ];
}

export const wasteTypeColors: Record<WasteType, string> = {
  wet: '#10b981',
  dry: '#f59e0b',
  plastic: '#06b6d4',
  hazardous: '#f43f5e',
  ewaste: '#8b5cf6',
};

export const statusColors: Record<WasteStatus, string> = {
  submitted: '#64748b',
  collected: '#3b82f6',
  in_transit: '#f59e0b',
  delivered: '#8b5cf6',
  recycled: '#10b981',
  landfill: '#6b7280',
  rejected: '#f43f5e',
};

export const weeklyTrends = [
  { day: 'Mon', wet: 120, dry: 85, plastic: 65, total: 270 },
  { day: 'Tue', wet: 150, dry: 95, plastic: 72, total: 317 },
  { day: 'Wed', wet: 110, dry: 88, plastic: 80, total: 278 },
  { day: 'Thu', wet: 180, dry: 102, plastic: 68, total: 350 },
  { day: 'Fri', wet: 140, dry: 78, plastic: 90, total: 308 },
  { day: 'Sat', wet: 90, dry: 60, plastic: 45, total: 195 },
  { day: 'Sun', wet: 70, dry: 55, plastic: 40, total: 165 },
];

export const monthlyData = [
  { month: 'Jan', recycled: 2400, landfill: 800, total: 3200 },
  { month: 'Feb', recycled: 2800, landfill: 700, total: 3500 },
  { month: 'Mar', recycled: 3100, landfill: 650, total: 3750 },
  { month: 'Apr', recycled: 2900, landfill: 720, total: 3620 },
  { month: 'May', recycled: 3400, landfill: 580, total: 3980 },
  { month: 'Jun', recycled: 3800, landfill: 500, total: 4300 },
];

export const areaData = [
  { name: 'Sector 17', efficiency: 87, volume: 450, collectors: 3 },
  { name: 'Green Valley', efficiency: 92, volume: 320, collectors: 2 },
  { name: 'Downtown', efficiency: 78, volume: 580, collectors: 4 },
  { name: 'Riverside', efficiency: 95, volume: 280, collectors: 2 },
  { name: 'Industrial Zone', efficiency: 65, volume: 890, collectors: 5 },
  { name: 'Tech Park', efficiency: 88, volume: 350, collectors: 3 },
  { name: 'Old Town', efficiency: 72, volume: 420, collectors: 3 },
  { name: 'Harbor District', efficiency: 81, volume: 310, collectors: 2 },
];

// Smart insights
export const smartInsights = [
  { type: 'warning' as const, message: 'Industrial Zone has the lowest segregation efficiency at 65%. Recommend additional citizen awareness campaigns.' },
  { type: 'alert' as const, message: 'Collector COL-3 shows suspicious patterns — 98% completion rate with no rejections in Sector 17.' },
  { type: 'success' as const, message: 'Riverside maintains highest efficiency at 95%. Model area for best practices.' },
  { type: 'info' as const, message: 'Plastic waste collection up 15% this month. New recycling partnerships recommended.' },
  { type: 'warning' as const, message: 'Old Town processing delays increased by 23% — facility capacity review needed.' },
];
