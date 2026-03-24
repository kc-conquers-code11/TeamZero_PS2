// src/lib/wasteService.ts
import { WasteSubmission, WasteStatus, User } from './types';

const STORAGE_KEY = 'trackbin_waste_submissions';

export const saveWasteSubmission = (submission: WasteSubmission): void => {
  const submissions = getWasteSubmissions();
  submissions.push(submission);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
};

export const getWasteSubmissions = (): WasteSubmission[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getWasteById = (id: string): WasteSubmission | undefined => {
  return getWasteSubmissions().find(w => w.id === id);
};

export const getWasteByCitizen = (citizenId: string): WasteSubmission[] => {
  return getWasteSubmissions().filter(w => w.citizenId === citizenId);
};

export const getWasteByCollector = (collectorId: string): WasteSubmission[] => {
  return getWasteSubmissions().filter(w => w.collectorId === collectorId);
};

export const updateWasteStatus = (
  wasteId: string, 
  status: WasteStatus, 
  updatedBy: string, 
  location?: { lat: number; lng: number }
): boolean => {
  const submissions = getWasteSubmissions();
  const index = submissions.findIndex(w => w.id === wasteId);
  
  if (index === -1) return false;
  
  submissions[index].status = status;
  submissions[index].timeline.push({
    status,
    timestamp: new Date().toISOString(),
    by: updatedBy,
    location
  });
  
  if (location) {
    submissions[index].currentLocation = {
      lat: location.lat,
      lng: location.lng,
      updatedAt: new Date().toISOString()
    };
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  return true;
};

export const assignCollector = (wasteId: string, collectorId: string): boolean => {
  const submissions = getWasteSubmissions();
  const index = submissions.findIndex(w => w.id === wasteId);
  
  if (index === -1) return false;
  
  submissions[index].collectorId = collectorId;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  return true;
};

export const generateUniqueId = (): string => {
  return `W-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
};