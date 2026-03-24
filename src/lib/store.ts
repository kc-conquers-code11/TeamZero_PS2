import { generateWasteEntries, generateBlockchain, generateAnomalies, type WasteEntry, type Block, type Anomaly } from './mockData';

// Simple store using module state (no external dependency needed)
const wasteEntries = generateWasteEntries(50);
const blockchain = generateBlockchain(wasteEntries);
const anomalies = generateAnomalies();

export type UserRole = 'citizen' | 'collector' | 'facility' | 'authority';

interface AppState {
  currentRole: UserRole;
  isLoggedIn: boolean;
  userName: string;
  wasteEntries: WasteEntry[];
  blockchain: Block[];
  anomalies: Anomaly[];
  greenScore: number;
  setRole: (role: UserRole) => void;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
}

// Using a simple React context approach - but for simplicity, 
// we'll use a global state with event emitter pattern
let state: AppState = {
  currentRole: 'citizen',
  isLoggedIn: false,
  userName: '',
  wasteEntries,
  blockchain,
  anomalies,
  greenScore: 725,
  setRole: () => {},
  login: () => {},
  logout: () => {},
};

const listeners = new Set<() => void>();

function setState(partial: Partial<AppState>) {
  state = { ...state, ...partial };
  listeners.forEach(l => l());
}

export function useAppState() {
  // This is a simplified approach - in production use Zustand or Context
  return {
    ...state,
    setRole: (role: UserRole) => setState({ currentRole: role }),
    login: (name: string, role: UserRole) => setState({ isLoggedIn: true, userName: name, currentRole: role }),
    logout: () => setState({ isLoggedIn: false, userName: '', currentRole: 'citizen' }),
  };
}
