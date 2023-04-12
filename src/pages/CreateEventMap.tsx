// pages/CreateEventMap.tsx
import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const CreateEventMap = ({ position, setPosition }) => {
  const mapRef = useRef<L.Map | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const updatePosition = () => {
    const marker = mapRef.current?.getBounds().getCenter();
    if (marker) {
      setPosition([marker.lat, marker.lng]);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchInput });
    if (results.length > 0) {
      setPosition([results[0].y, results[0].x]);
      if (mapRef.current) {
        mapRef.current.flyTo([results[0].y, results[0].x], 13);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter address"
        />
        <button type="submit">Search</button>
      </form>
      <MapContainer
        style={{ flexGrow: 1, width: '100%', border: '2px solid black' }}
        center={position}
        zoom={13}
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={position}
          draggable={true}
          eventHandlers={{ dragend: updatePosition }}
        >
          <Popup>
            Selected Location <br /> {position.toString()}.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default CreateEventMap;
