// src/lib/wasteTypes.ts
export type WasteType = 'wet' | 'dry' | 'plastic' | 'hazardous' | 'ewaste';
export type WasteStatus = 'submitted' | 'collected' | 'in_transit' | 'delivered' | 'processed';

export interface WasteSubmission {
  id: string;
  qrCode: string;
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  wasteType: WasteType;
  weight: number;
  imageUrl: string;
  timestamp: string;
  status: WasteStatus;
  currentLocation: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
  timeline: {
    status: WasteStatus;
    timestamp: string;
    by: string;
    location?: { lat: number; lng: number };
  }[];
  collectorId?: string;
  facilityId?: string;
}

export interface LocationUpdate {
  wasteId: string;
  lat: number;
  lng: number;
  timestamp: string;
  status: WasteStatus;
}