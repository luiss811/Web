import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

interface MapComponentProps {
  apiKey: string;
  lat: number;
  lng: number;
  zoom?: number;
  title?: string;
  address?: string;
}

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1e1e24" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1e1e24" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a8a9e" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#fbbf24" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a5b4fc" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#111827" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#34d399" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2d2d39" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1e1e24" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca3af" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3b3b4f" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#111827" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0f172a" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#475569" }],
  },
];

const lightMapStyle = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#e0f2fe" }]
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f8fafc" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#f1f5f9" }]
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#f1f5f9" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#dcfce7" }]
  }
];

export const MapComponent: React.FC<MapComponentProps> = ({
  apiKey,
  lat,
  lng,
  zoom,
  title,
  address
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { theme } = useApp();

  useEffect(() => {
    const callbackName = 'initGoogleMapCallback';

    // Check if script is already loaded
    if ((window as any).google && (window as any).google.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if script is currently loading
    if ((window as any)[callbackName]) {
      const handleLoad = () => setIsLoaded(true);
      window.addEventListener('google-maps-script-loaded', handleLoad);
      return () => {
        window.removeEventListener('google-maps-script-loaded', handleLoad);
      };
    }

    // Set callback to initialize map once script loads
    (window as any)[callbackName] = () => {
      setIsLoaded(true);
      window.dispatchEvent(new Event('google-maps-script-loaded'));
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setLoadError('Error al cargar Google Maps. Por favor, revisa tu clave de API.');
    };

    document.head.appendChild(script);

    return () => {
      // Keep script in head to prevent reload loops
    };
  }, [apiKey]);

  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || !(window as any).google || !(window as any).google.maps) return;

    const google = (window as any).google;
    const center = { lat, lng };
    const currentStyle = theme === 'dark' ? darkMapStyle : lightMapStyle;

    if (!mapRef.current) {
      // Create new Map instance
      mapRef.current = new google.maps.Map(mapContainerRef.current, {
        center,
        zoom,
        styles: currentStyle,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });

      // Create a marker with a customized red drop pin
      markerRef.current = new google.maps.Marker({
        position: center,
        map: mapRef.current,
        title,
        animation: google.maps.Animation.DROP,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Standard Google red marker pin
        }
      });

      // Simple, elegant InfoWindow content
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: #0f172a; font-family: system-ui, -apple-system, sans-serif; padding: 6px; min-width: 150px;">
            <h4 style="font-weight: 700; margin: 0 0 2px 0; font-size: 13px; color: #0f172a;">${title}</h4>
            <p style="margin: 0; font-size: 11px; color: #475569; line-height: 1.3;">${address}</p>
            <p style="margin: 6px 0 0 0; font-size: 9px; color: #94a3b8;">${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
          </div>
        `
      });

      // Open the InfoWindow on marker click
      markerRef.current.addListener('click', () => {
        infoWindow.open(mapRef.current, markerRef.current);
      });

      // Open immediately on load
      infoWindow.open(mapRef.current, markerRef.current);
    } else {
      // Dynamically update coordinates and style without reloading map instance
      mapRef.current.setCenter(center);
      mapRef.current.setOptions({ styles: currentStyle });
      if (markerRef.current) {
        markerRef.current.setPosition(center);
      }
    }
  }, [isLoaded, lat, lng, zoom, theme, title, address]);

  if (loadError) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-red-950/20 border border-red-500/30 rounded-xl p-4 text-center">
        <p className="text-sm font-semibold text-red-400">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden shadow-lg border border-mineral-200 dark:border-mineral-800 bg-mineral-100 dark:bg-mineral-900 flex items-center justify-center">
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-mineral-50/50 dark:bg-mineral-950/50 backdrop-blur-sm z-10 space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
          <span className="text-xs font-semibold text-mineral-500 dark:text-mineral-400 animate-pulse">Cargando mapa interactivo...</span>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px]" />
    </div>
  );
};
