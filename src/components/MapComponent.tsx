// src/components/MapComponent.tsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchNearbyLocations, NearbyLocation, openGoogleMaps } from '@/lib/locationService';

// Fix Leaflet default icons
delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  center: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    popup?: string | React.ReactNode;
    type?: string;
  }>;
  polyline?: Array<[number, number]>;
  showNearbyLocations?: boolean;
  onLocationSelect?: (location: NearbyLocation) => void;
}

// Extended marker interface to track marker type
interface ExtendedMarker extends L.Marker {
  _isNearby?: boolean;
}

// Custom marker icons
const createCustomIcon = (color: string, isUser: boolean = false): L.DivIcon => {
  const size = isUser ? 40 : 32;
  const iconSize = isUser ? 36 : 32;
  
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid white; ${isUser ? 'animation: pulse 1.5s ease-in-out infinite;' : ''}">
            <svg width="${iconSize - 12}" height="${iconSize - 12}" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              ${isUser ? '<circle cx="12" cy="8" r="4"/><path d="M5 20v-2a7 7 0 0 1 14 0v2"/>' : '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'}
            </svg>
           </div>`,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size / 2]
  });
};

// Loading overlay component
const MapLoadingOverlay = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-10 rounded-xl">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
      <p className="text-xs text-muted-foreground">Loading nearby facilities...</p>
    </div>
  </div>
);

export default function MapComponent({ 
  center, 
  zoom = 13, 
  markers = [], 
  polyline,
  showNearbyLocations = true
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<ExtendedMarker[]>([]);
  const nearbyMarkersRef = useRef<ExtendedMarker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);
  const [nearbyLocations, setNearbyLocations] = useState<NearbyLocation[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Fetch nearby locations
  useEffect(() => {
    if (!showNearbyLocations || !center || !mapReady) return;
    
    setIsLoadingLocations(true);
    fetchNearbyLocations(center[0], center[1], 3000)
      .then(locations => {
        setNearbyLocations(locations);
        console.log(`📍 Found ${locations.length} nearby locations`);
      })
      .catch(error => {
        console.error('Failed to fetch locations:', error);
      })
      .finally(() => {
        setIsLoadingLocations(false);
      });
  }, [center, showNearbyLocations, mapReady]);

  // Initialize map - run once on mount
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
      fadeAnimation: true,
      zoomAnimation: true
    }).setView(center, zoom);
    mapInstanceRef.current = map;

    // Set map container styling
    if (mapRef.current) {
      mapRef.current.style.zIndex = '1';
      mapRef.current.style.position = 'relative';
    }

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Add zoom control
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add scale control
    L.control.scale({ metric: true, imperial: false, position: 'bottomleft' }).addTo(map);

    setMapReady(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapReady(false);
      }
    };
  }, [center, zoom]); // Empty dependency array - run once on mount

  // Update map view when center/zoom changes
  useEffect(() => {
    if (mapInstanceRef.current && mapReady) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom, mapReady]);

  // Update user/waste markers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;

    // Clear only non-nearby markers
    const nonNearbyMarkers = markersRef.current.filter(m => !m._isNearby);
    nonNearbyMarkers.forEach(marker => marker.remove());
    markersRef.current = markersRef.current.filter(m => m._isNearby === true);

    // Add new markers
    markers.forEach((markerData) => {
      let marker: ExtendedMarker;
      if (markerData.type === 'user') {
        marker = L.marker(markerData.position, {
          icon: createCustomIcon('#10b981', true)
        }) as ExtendedMarker;
        marker.addTo(mapInstanceRef.current!);
      } else {
        marker = L.marker(markerData.position, {
          icon: createCustomIcon('#f59e0b', false)
        }) as ExtendedMarker;
        marker.addTo(mapInstanceRef.current!);
      }
      
      if (markerData.popup && typeof markerData.popup === 'string') {
        marker.bindPopup(markerData.popup);
      }
      
      marker._isNearby = false;
      markersRef.current.push(marker);
    });
  }, [markers, mapReady]);

  // Add nearby locations markers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady || !showNearbyLocations) return;

    // Clear existing nearby markers
    nearbyMarkersRef.current.forEach(marker => marker.remove());
    nearbyMarkersRef.current = [];
    markersRef.current = markersRef.current.filter(m => !m._isNearby);

    // Add new nearby markers
    nearbyLocations.forEach((location) => {
      const color = location.type === 'recycling_center' ? '#3b82f6' :
                   location.type === 'ewaste_center' ? '#8b5cf6' :
                   location.type === 'hazardous_facility' ? '#ef4444' : '#10b981';
      
      // Create popup content
      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-3 min-w-[260px] max-w-[320px]';
      popupDiv.innerHTML = `
        <div class="space-y-2">
          <div class="flex items-start justify-between">
            <h4 class="font-bold text-sm text-accent">${escapeHtml(location.name)}</h4>
            <span class="text-xs px-2 py-0.5 rounded-full ${
              location.type === 'recycling_center' ? 'bg-blue-100 text-blue-800' :
              location.type === 'ewaste_center' ? 'bg-purple-100 text-purple-800' :
              location.type === 'hazardous_facility' ? 'bg-red-100 text-red-800' :
              'bg-green-100 text-green-800'
            }">${location.type.replace('_', ' ')}</span>
          </div>
          
          <div class="flex items-center gap-1 text-xs text-muted-foreground">
            <span>📍</span>
            <span>${location.distance}m away</span>
          </div>
          
          ${location.address ? `
            <div class="flex items-start gap-1 text-xs">
              <span>📌</span>
              <span class="text-muted-foreground">${escapeHtml(location.address)}</span>
            </div>
          ` : ''}
          
          ${location.phone ? `
            <div class="flex items-center gap-1 text-xs">
              <span>📞</span>
              <a href="tel:${location.phone}" class="text-primary hover:underline">${location.phone}</a>
            </div>
          ` : ''}
          
          ${location.openingHours ? `
            <div class="flex items-start gap-1 text-xs">
              <span>🕒</span>
              <span class="text-muted-foreground">${escapeHtml(location.openingHours)}</span>
            </div>
          ` : ''}
          
          ${location.acceptedWaste && location.acceptedWaste.length > 0 ? `
            <div class="flex flex-wrap gap-1 mt-2 pt-1 border-t">
              <span class="text-xs font-medium">♻️ Accepts:</span>
              ${location.acceptedWaste.map(w => 
                `<span class="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">${w}</span>`
              ).join('')}
            </div>
          ` : ''}
          
          ${location.rating ? `
            <div class="flex items-center gap-1 text-xs">
              <span>⭐</span>
              <span>${location.rating} / 5</span>
            </div>
          ` : ''}
          
          <button 
            class="directions-btn w-full mt-2 bg-primary text-white text-xs px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            data-lat="${location.lat}" 
            data-lng="${location.lng}" 
            data-name="${escapeHtml(location.name)}"
          >
            Get Directions 🗺️
          </button>
        </div>
      `;
      
      const marker = L.marker([location.lat, location.lng], {
        icon: createCustomIcon(color, false)
      }) as ExtendedMarker;
      marker.addTo(mapInstanceRef.current!);
      
      marker.bindPopup(popupDiv);
      marker.on('popupopen', () => {
        const btn = popupDiv.querySelector('.directions-btn');
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const lat = parseFloat(btn.getAttribute('data-lat') || '0');
            const lng = parseFloat(btn.getAttribute('data-lng') || '0');
            const name = btn.getAttribute('data-name') || '';
            openGoogleMaps(lat, lng, name);
          });
        }
      });
      
      marker._isNearby = true;
      nearbyMarkersRef.current.push(marker);
      markersRef.current.push(marker);
    });
  }, [nearbyLocations, showNearbyLocations, mapReady]);

  // Update polyline
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;

    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (polyline && polyline.length > 0) {
      polylineRef.current = L.polyline(polyline, {
        color: '#f59e0b',
        weight: 4,
        opacity: 0.8,
        lineJoin: 'round',
        lineCap: 'round',
        dashArray: '5, 10'
      }).addTo(mapInstanceRef.current);
      
      // Fit bounds to show the entire polyline
      if (polyline.length > 1) {
        const bounds = L.latLngBounds(polyline);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [polyline, mapReady]);

  // Add pulse animation CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }
      .custom-marker {
        background: transparent;
        border: none;
      }
      .leaflet-popup-content-wrapper {
        border-radius: 12px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      }
      .leaflet-popup-tip {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        style={{ 
          height: '100%', 
          width: '100%',
          position: 'relative',
          zIndex: 1,
          borderRadius: '0.75rem',
          overflow: 'hidden'
        }}
      />
      {isLoadingLocations && <MapLoadingOverlay />}
    </div>
  );
}

// Helper function to escape HTML
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}