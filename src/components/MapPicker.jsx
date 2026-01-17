import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AddressAutocomplete from './AddressAutocomplete';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

function ChangeView({ center, zoom }) {
  const map = useMap();

  React.useEffect(() => {
    if (center) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);

  return null;
}

export default function MapPicker({ onLocationSelect, initialPosition = null, onClose }) {
  const [position, setPosition] = useState(initialPosition || [22.9734, 78.6569]); // Default to India center
  const [zoom, setZoom] = useState(initialPosition ? 11 : 5);
  const [loading, setLoading] = useState(false);
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileAttribution = '&copy; OpenStreetMap contributors';

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat, lng) => {
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (!resp.ok) throw new Error('Reverse geocoding failed');
      const data = await resp.json();
      const address = data.address || {};
      return {
        formattedAddress: data.display_name || '',
        state: address.state || '',
        district: address.county || address.city || address.town || address.village || '',
        area: address.suburb || address.neighbourhood || address.hamlet || '',
        pincode: address.postcode || '',
        address: [
          address.house_number,
          address.road || address.street,
          address.postcode
        ].filter(Boolean).join(', ') || data.display_name || '',
        landmark: address.building || address.shop || ''
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    const addressData = await reverseGeocode(position[0], position[1]);
    setLoading(false);

    if (addressData) {
      onLocationSelect({
        latitude: position[0],
        longitude: position[1],
        ...addressData
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Select Your Location</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        
        <div className="p-4 bg-blue-50 border-b border-blue-100 space-y-3">
          <p className="text-sm text-slate-700">
            <span className="font-medium">Click anywhere on the map</span> to set your location, or search for a nearby place in India to quickly jump closer.
          </p>
          <AddressAutocomplete
            placeholder="Search for a nearby place"
            onPlaceSelected={(place) => {
              if (!place || typeof place.latitude !== 'number' || typeof place.longitude !== 'number') return;
              setPosition([place.latitude, place.longitude]);
              setZoom(13); // Zoom in when a place is selected from search
            }}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="flex-1 relative min-h-[400px]">
          <MapContainer
            center={position}
            zoom={zoom}
            className="w-full h-full"
            style={{ minHeight: '400px' }}
          >
            <ChangeView center={position} zoom={zoom} />
            <TileLayer
              attribution={tileAttribution}
              url={tileUrl}
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>

        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            Selected: {position[0].toFixed(4)}, {position[1].toFixed(4)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-brand text-white hover:bg-opacity-90 disabled:opacity-60 inline-flex items-center gap-2"
            >
              {loading && (
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              )}
              {loading ? 'Getting Address...' : 'Confirm Location'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
