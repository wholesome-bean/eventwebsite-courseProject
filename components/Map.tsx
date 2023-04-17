// components/Map.tsx
import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

interface MapProps {
  onClick?: (latlng: L.LatLng) => void;
  invalidateSizeOnNextTick?: boolean;
}

const Map: React.FC<MapProps> = ({ onClick, invalidateSizeOnNextTick }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    leafletMap.current = L.map(mapRef.current).setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap.current);

    if (onClick) {
      leafletMap.current.on('click', (e) => {
        onClick(e.latlng);
      });
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.off();
        leafletMap.current.remove();
      }
    };
  }, [onClick]);

  useEffect(() => {
    if (invalidateSizeOnNextTick && leafletMap.current) {
      setTimeout(() => {
        leafletMap.current?.invalidateSize();
      }, 0);
    }
  }, [invalidateSizeOnNextTick, leafletMap]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default Map;
