// src/lib/locationService.ts
export interface NearbyLocation {
  id: string;
  name: string;
  type: 'recycling_center' | 'collection_point' | 'ewaste_center' | 'hazardous_facility';
  lat: number;
  lng: number;
  address?: string;
  phone?: string;
  openingHours?: string;
  distance: number;
  rating?: number;
  acceptedWaste?: string[];
}

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  tags?: {
    name?: string;
    'name:en'?: string;
    brand?: string;
    amenity?: string;
    phone?: string;
    'contact:phone'?: string;
    opening_hours?: string;
    'addr:full'?: string;
    'addr:street'?: string;
    recycling?: string;
    'recycling:electronics'?: string;
    'recycling:e-waste'?: string;
    'recycling:hazardous_waste'?: string;
    hazardous_waste?: string;
    rating?: string;
  };
}

// Mock data for when API fails
const getMockLocations = (lat: number, lng: number): NearbyLocation[] => {
  return [
    {
      id: 'mock-1',
      name: 'Green Earth Recycling Center',
      type: 'recycling_center',
      lat: lat + 0.01,
      lng: lng + 0.008,
      address: 'Sector 17, Near City Mall',
      phone: '+91 22 2765 4321',
      openingHours: 'Mon-Sat: 9:00 AM - 6:00 PM',
      distance: calculateDistance(lat, lng, lat + 0.01, lng + 0.008),
      rating: 4.5,
      acceptedWaste: ['plastic', 'dry', 'wet']
    },
    {
      id: 'mock-2',
      name: 'E-Waste Collection Hub',
      type: 'ewaste_center',
      lat: lat - 0.005,
      lng: lng + 0.012,
      address: 'MIDC Area, Industrial Estate',
      phone: '+91 22 2876 5432',
      openingHours: 'Mon-Fri: 10:00 AM - 7:00 PM',
      distance: calculateDistance(lat, lng, lat - 0.005, lng + 0.012),
      rating: 4.2,
      acceptedWaste: ['ewaste']
    },
    {
      id: 'mock-3',
      name: 'Hazardous Waste Facility',
      type: 'hazardous_facility',
      lat: lat + 0.015,
      lng: lng - 0.003,
      address: 'Taloja Industrial Area',
      phone: '+91 22 2741 2345',
      openingHours: 'Mon-Sat: 8:00 AM - 5:00 PM',
      distance: calculateDistance(lat, lng, lat + 0.015, lng - 0.003),
      rating: 4.0,
      acceptedWaste: ['hazardous']
    },
    {
      id: 'mock-4',
      name: 'Community Collection Point',
      type: 'collection_point',
      lat: lat - 0.008,
      lng: lng - 0.01,
      address: 'Near Main Market, Sector 12',
      phone: '+91 22 2654 7890',
      openingHours: 'Daily: 7:00 AM - 8:00 PM',
      distance: calculateDistance(lat, lng, lat - 0.008, lng - 0.01),
      rating: 4.3,
      acceptedWaste: ['plastic', 'dry', 'wet']
    },
    {
      id: 'mock-5',
      name: 'Plastic Recycling Plant',
      type: 'recycling_center',
      lat: lat + 0.02,
      lng: lng + 0.005,
      address: 'Industrial Zone, Phase 2',
      phone: '+91 22 2828 9999',
      openingHours: 'Mon-Sat: 9:30 AM - 6:30 PM',
      distance: calculateDistance(lat, lng, lat + 0.02, lng + 0.005),
      rating: 4.7,
      acceptedWaste: ['plastic']
    }
  ];
};

// Overpass API query
const buildOverpassQuery = (lat: number, lng: number, radius: number = 3000): string => {
  return `
    [out:json][timeout:25];
    (
      node["amenity"="recycling"](around:${radius},${lat},${lng});
      way["amenity"="recycling"](around:${radius},${lat},${lng});
      node["amenity"="waste_disposal"](around:${radius},${lat},${lng});
      node["amenity"="recycling_container"](around:${radius},${lat},${lng});
      node["recycling:electronics"="yes"](around:${radius},${lat},${lng});
    );
    out body;
    >;
    out skel qt;
  `;
};

const getWasteTypeFromTags = (tags: OverpassElement['tags']): string[] => {
  const acceptedTypes: string[] = [];
  
  if (tags) {
    if (tags.recycling) {
      const recyclingVal = tags.recycling.toLowerCase();
      if (recyclingVal === 'plastic' || recyclingVal.includes('plastic')) acceptedTypes.push('plastic');
      if (recyclingVal === 'glass' || recyclingVal.includes('glass')) acceptedTypes.push('dry');
      if (recyclingVal === 'paper' || recyclingVal.includes('paper')) acceptedTypes.push('dry');
      if (recyclingVal === 'organic' || recyclingVal.includes('organic')) acceptedTypes.push('wet');
      if (recyclingVal === 'electronics' || recyclingVal.includes('electronics')) acceptedTypes.push('ewaste');
      if (recyclingVal === 'hazardous') acceptedTypes.push('hazardous');
    }
    
    if (tags['recycling:electronics'] === 'yes') acceptedTypes.push('ewaste');
    if (tags['recycling:e-waste'] === 'yes') acceptedTypes.push('ewaste');
    if (tags['recycling:hazardous_waste'] === 'yes') acceptedTypes.push('hazardous');
    if (tags.hazardous_waste === 'yes') acceptedTypes.push('hazardous');
  }
  
  if (acceptedTypes.length === 0) {
    acceptedTypes.push('dry', 'plastic');
  }
  
  return acceptedTypes;
};

const getLocationType = (tags: OverpassElement['tags']): NearbyLocation['type'] => {
  if (tags) {
    if (tags['recycling:electronics'] === 'yes' || tags['recycling:e-waste'] === 'yes') {
      return 'ewaste_center';
    }
    if (tags['recycling:hazardous_waste'] === 'yes' || tags.hazardous_waste === 'yes') {
      return 'hazardous_facility';
    }
    if (tags.amenity === 'recycling_center' || tags.amenity === 'waste_transfer_station') {
      return 'recycling_center';
    }
    if (tags.amenity === 'recycling_container') {
      return 'collection_point';
    }
  }
  return 'collection_point';
};

const getDefaultName = (tags: OverpassElement['tags']): string => {
  if (tags) {
    if (tags.amenity === 'recycling') return 'Recycling Center';
    if (tags.amenity === 'waste_disposal') return 'Waste Disposal Site';
    if (tags.amenity === 'recycling_container') return 'Recycling Container';
    if (tags['recycling:electronics'] === 'yes') return 'E-Waste Collection Point';
    if (tags['recycling:hazardous_waste'] === 'yes') return 'Hazardous Waste Facility';
  }
  return 'Waste Management Facility';
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return Math.round(R * c);
};

export const fetchNearbyLocations = async (
  lat: number, 
  lng: number, 
  radius: number = 3000
): Promise<NearbyLocation[]> => {
  try {
    // Try to fetch from Overpass API
    const query = buildOverpassQuery(lat, lng, radius);
    const encodedQuery = encodeURIComponent(query);
    
    // Use a CORS proxy to avoid CORS issues
    const proxyUrl = 'https://corsproxy.io/?';
    const url = `${proxyUrl}https://overpass-api.de/api/interpreter?data=${encodedQuery}`;
    
    console.log('Fetching nearby locations from Overpass API...');
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const locations: NearbyLocation[] = [];
    
    if (data.elements && data.elements.length > 0) {
      data.elements.forEach((element: OverpassElement) => {
        if (element.lat && element.lon) {
          const tags = element.tags;
          const name = tags?.name || 
                      tags?.['name:en'] || 
                      tags?.brand || 
                      getDefaultName(tags);
          
          const distance = calculateDistance(lat, lng, element.lat, element.lon);
          
          if (distance <= radius) {
            locations.push({
              id: `${element.type}-${element.id}`,
              name: name,
              type: getLocationType(tags),
              lat: element.lat,
              lng: element.lon,
              address: tags?.['addr:full'] || tags?.['addr:street'],
              phone: tags?.phone || tags?.['contact:phone'],
              openingHours: tags?.opening_hours,
              distance: distance,
              rating: tags?.rating ? parseFloat(tags.rating) : undefined,
              acceptedWaste: getWasteTypeFromTags(tags)
            });
          }
        }
      });
    }
    
    if (locations.length > 0) {
      console.log(`Found ${locations.length} locations from Overpass API`);
      return locations.sort((a, b) => a.distance - b.distance);
    } else {
      console.log('No locations found from API, using mock data');
      return getMockLocations(lat, lng);
    }
  } catch (error) {
    console.error('Error fetching nearby locations:', error);
    console.log('Using mock location data as fallback');
    return getMockLocations(lat, lng);
  }
};

export const openGoogleMaps = (lat: number, lng: number, name: string): void => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
  window.open(url, '_blank');
};