import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api/api';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon paths for Leaflet - use CDN URLs to avoid bundling issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const DEFAULT_CENTER = [22.9734, 78.6569]; // Approx center of India
const DEFAULT_ZOOM = 5;

function ChangeView({ center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

export default function DealersMap() {
  const [dealers, setDealers] = React.useState([]);
  const [nearest, setNearest] = React.useState([]);
  const [userLocation, setUserLocation] = React.useState(null);
  const [center, setCenter] = React.useState(DEFAULT_CENTER);
  const [zoom, setZoom] = React.useState(DEFAULT_ZOOM);
  const [loading, setLoading] = React.useState(true);
  const [geoStatus, setGeoStatus] = React.useState('Click "Enable Location" to see nearby dealers');
  const [error, setError] = React.useState('');
  const [showLocationPrompt, setShowLocationPrompt] = React.useState(true);
  const [locationRequested, setLocationRequested] = React.useState(false);
  const [pin, setPin] = React.useState('');
  const [pinSearching, setPinSearching] = React.useState(false);
  const [pinError, setPinError] = React.useState('');
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileAttribution = '&copy; OpenStreetMap contributors';

  // Function to request user location
  const requestLocation = React.useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus('Your browser does not support location. Showing all dealers.');
      setShowLocationPrompt(false);
      return;
    }

    setLocationRequested(true);
    setGeoStatus('Detecting your location...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setCenter([coords.lat, coords.lng]);
        setZoom(11); // Zoom to city level
        setGeoStatus('Showing dealers near your location.');
        setShowLocationPrompt(false);
        setLocationRequested(false);

        try {
          const res = await api.get('/dealers/approved/nearest', {
            params: { lat: coords.lat, lng: coords.lng, limit: 20 },
            noSpinner: true,
          });
          const list = res.data?.data || [];
          setNearest(list);
        } catch (e) {
          console.error(e);
        }
      },
      (err) => {
        console.warn('Geolocation error', err);
        if (err.code === 1) {
          setGeoStatus('Location permission denied. Please enable location to see nearby dealers.');
        } else {
          setGeoStatus('Unable to detect your location. Please try again or view all dealers.');
        }
        setShowLocationPrompt(true);
        setLocationRequested(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    async function loadApprovedDealers() {
      try {
        const res = await api.get('/dealers/approved', { noSpinner: true });
        const list = (res.data?.data || []).filter((d) => {
          const loc = d.dealerLocation || {};
          const lat = Number(loc.latitude);
          const lng = Number(loc.longitude);
          return Number.isFinite(lat) && Number.isFinite(lng);
        });
        if (!cancelled) setDealers(list);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError('Failed to load dealers. Please try again later.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadApprovedDealers();

    return () => {
      cancelled = true;
    };
  }, []);

  const nearestIds = React.useMemo(() => new Set(nearest.map((d) => String(d._id))), [nearest]);

  // Utility: haversine distance (km)
  function haversineKm(lat1, lon1, lat2, lon2) {
    function toRad(x) { return x * Math.PI / 180; }
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Geocode PIN to lat/lng using Nominatim
  async function geocodePin(pinCode) {
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(pinCode)}&countrycodes=in&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (!resp.ok) return null;
      const data = await resp.json();
      const first = Array.isArray(data) ? data[0] : null;
      if (first && first.lat && first.lon) {
        return { lat: parseFloat(first.lat), lng: parseFloat(first.lon), display: first.display_name || '' };
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async function handlePinSearch(e) {
    e?.preventDefault?.();
    setPinError('');
    const pinCode = String(pin).trim();
    if (!/^\d{6}$/.test(pinCode)) {
      setPinError('Please enter a valid 6-digit PIN code.');
      return;
    }
    setPinSearching(true);
    const geo = await geocodePin(pinCode);
    setPinSearching(false);
    if (!geo || !Number.isFinite(geo.lat) || !Number.isFinite(geo.lng)) {
      setPinError('Could not locate this PIN code. Please try another.');
      return;
    }

    // Recenter map to PIN location
    setCenter([geo.lat, geo.lng]);
    setZoom(12);
    setGeoStatus(`Showing dealers for PIN ${pinCode}.`);
    setShowLocationPrompt(false);

    // Filter dealers that include PIN in address fields (best-effort)
    const filtered = dealers.filter((d) => {
      const addr = [d.address, d?.dealerLocation?.address].filter(Boolean).join(' \n ');
      return addr && addr.includes(pinCode);
    });

    const baseList = filtered.length > 0 ? filtered : dealers;
    // Compute distance to PIN location and sort ascending
    const withDistance = baseList
      .map((d) => {
        const dl = d.dealerLocation || {};
        const lat = Number(dl.latitude);
        const lng = Number(dl.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        const distanceKm = Math.round(haversineKm(geo.lat, geo.lng, lat, lng) * 10) / 10;
        return { ...d, distanceKm };
      })
      .filter(Boolean)
      .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));

    setNearest(withDistance);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mt-20">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">Our Dealer Network</h1>
          <p className="text-sm md:text-base text-slate-700 mb-3">
            Explore approved Swasti dealers on the map. Share your location, to find the nearest dealers around you.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <p className="text-xs text-slate-600 max-w-xl">{geoStatus}</p>
            <button
              onClick={requestLocation}
              disabled={locationRequested}
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-opacity-90 disabled:opacity-60"
            >
              {locationRequested ? 'Detecting...' : (userLocation ? 'Detect again' : 'Enable Location')}
            </button>
          </div>
          {/* PIN code search */}
          <form onSubmit={handlePinSearch} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit PIN code (e.g., 560001)"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full sm:w-64 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              type="submit"
              disabled={pinSearching || pin.length !== 6}
              className="inline-flex items-center gap-2 rounded-md border border-brand px-4 py-2 text-sm text-brand hover:bg-brand hover:text-white disabled:opacity-60"
            >
              {pinSearching ? 'Searching…' : 'Search PIN'}
            </button>
            {pinError && <span className="text-xs text-red-600">{pinError}</span>}
          </form>
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        </div>

        <section className="container mx-auto px-4 pb-8 flex flex-col lg:flex-row gap-4">
          <div className="flex-1 rounded-lg overflow-hidden border border-slate-200">
            <MapContainer
              center={center}
              zoom={zoom}
              className="w-full h-[320px] sm:h-[380px] lg:h-[520px]"
            >
              <ChangeView center={center} zoom={zoom} />
              <TileLayer
                attribution={tileAttribution}
                url={tileUrl}
              />

              {userLocation && (
                <CircleMarker
                  center={[userLocation.lat, userLocation.lng]}
                  radius={8}
                  pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.7 }}
                >
                  <Popup>You are here</Popup>
                </CircleMarker>
              )}

              {dealers.map((d) => {
                const loc = d.dealerLocation || {};
                const lat = Number(loc.latitude);
                const lng = Number(loc.longitude);
                const position = [lat, lng];
                const isNearest = nearestIds.has(String(d._id));
                return (
                  <Marker key={d._id} position={position}>
                    <Popup>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm md:text-base">{d.companyName || d.contactName}</h3>
                        <p className="text-xs text-slate-700">
                          {[d.city, d.district, d.state].filter(Boolean).join(', ') || loc.address}
                        </p>
                        {d.phone && (
                          <p className="text-xs">
                            <span className="font-semibold">Phone:</span> {d.phone}
                          </p>
                        )}
                        {Number.isFinite(lat) && Number.isFinite(lng) && (
                          <div className="pt-1">
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md border border-brand px-2 py-1 text-xs text-brand hover:bg-brand hover:text-white"
                              aria-label="Open in Google Maps"
                              title="Open in Google Maps"
                            >
                              📍 google maps
                            </a>
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* Optional side list of nearest dealers */}
          <aside className="w-full lg:w-80 max-h-[320px] sm:max-h-[400px] lg:max-h-[520px] overflow-y-auto border border-slate-200 rounded-lg bg-white p-3 text-sm mt-2 lg:mt-0">
            <h2 className="font-semibold mb-2 text-base">Dealers Available <h4>(click on pinpoint for more information)</h4></h2>
            {nearest.length === 0 && (
              <p className="text-xs text-slate-600">
                {userLocation
                  ? 'We could not determine the nearest dealers yet, but you can still use the map.'
                  : 'Share your location to see the nearest dealers, or browse the map on the left.'}
              </p>
            )}
            <ul className="space-y-2">
              {nearest.map((d) => {
                const loc = d.dealerLocation || {};
                return (
                  <li key={d._id} className="border-b last:border-b-0 border-slate-200 pb-2">
                    <div className="font-medium text-sm">{d.companyName || d.contactName}</div>
                    <div className="text-xs text-slate-700">
                      {[d.city, d.district, d.state].filter(Boolean).join(', ') || loc.address}
                    </div>
                    {d.distanceKm != null && (
                      <div className="text-[11px] text-slate-500">Approx. {d.distanceKm} km away</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
