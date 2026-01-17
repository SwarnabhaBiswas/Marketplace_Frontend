import React, { useState, useEffect, useRef } from 'react';


export default function AddressAutocomplete({ 
  onPlaceSelected, 
  placeholder = 'Type address...',
  className = '',
  disabled = false
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside 
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search for addresses - prioritizing India-specific results using Photon + Nominatim (free, OSM-based)
  const searchAddress = async (searchQuery) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      // Append India to query for better Indian results
      const indiaQuery = searchQuery.toLowerCase().includes('india')
        ? searchQuery
        : `${searchQuery}, India`;

      // Photon API (OpenStreetMap data, free)
      let response = await fetch(
        `https://photon.komoot.io/api/?` +
        `q=${encodeURIComponent(indiaQuery)}&` +
        `limit=10&` +
        `lang=en`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        // Fallback to Nominatim with India filter
        response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(searchQuery)}&` +
          `format=json&` +
          `addressdetails=1&` +
          `limit=8&` +
          `countrycodes=in`,
          {
            headers: {
              'Accept-Language': 'en'
            }
          }
        );

        if (!response.ok) throw new Error('Search failed');

        const data = await response.json();
        setSuggestions(data.map(item => ({ ...item, source: 'nominatim' })));
        setShowDropdown(data.length > 0);
      } else {
        const data = await response.json();
        const features = data.features || [];
        
        // Filter to prioritize Indian results
        const indianResults = features.filter(f => {
          const country = f.properties?.country || f.properties?.countrycode;
          return !country || country.toLowerCase().includes('india') || country.toLowerCase() === 'in';
        });
        
        const resultsToShow = indianResults.length > 0 ? indianResults : features.slice(0, 8);
        setSuggestions(resultsToShow.map(item => ({ ...item, source: 'photon' })));
        setShowDropdown(resultsToShow.length > 0);
      }
    } catch (error) {
      console.error('Address search error:', error);
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);
    debounceRef.current = setTimeout(() => {
      searchAddress(value);
    }, 500);
  };

  // Handle place selection - supports Photon and Nominatim formats
  const handleSelectPlace = (place) => {
    let addressData;

    if (place.source === 'photon') {
      // Photon API format (OpenStreetMap)
      const props = place.properties || {};
      const coords = place.geometry?.coordinates || [0, 0];
      
      addressData = {
        formattedAddress: props.name 
          ? `${props.name}, ${props.city || props.county || ''}, ${props.state || ''}, ${props.country || ''}`
          : `${props.street || ''}, ${props.city || props.county || ''}, ${props.state || ''}`.replace(/^,\s*/, ''),
        latitude: coords[1], // Photon uses [lng, lat]
        longitude: coords[0],
        state: props.state || '',
        district: props.county || props.city || props.district || '',
        area: props.locality || props.suburb || '',
        address: [
          props.housenumber,
          props.street,
          props.postcode
        ].filter(Boolean).join(', ') || props.name || `${props.city || ''}, ${props.state || ''}`,
        landmark: props.name || ''
      };

      setQuery(addressData.formattedAddress);
    } else {
      // Nominatim API format
      const address = place.address || {};
      
      addressData = {
        formattedAddress: place.display_name,
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
        state: address.state || address.state_district || '',
        district: address.county || address.city || address.town || address.village || '',
        area: address.suburb || address.neighbourhood || address.hamlet || '',
        address: [
          address.house_number,
          address.road || address.street,
          address.postcode
        ].filter(Boolean).join(', ') || place.display_name,
        landmark: address.building || address.shop || ''
      };

      setQuery(place.display_name);
    }

    setShowDropdown(false);
    setSuggestions([]);
    if (addressData) onPlaceSelected?.(addressData);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        autoComplete="off"
      />
      
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 rounded-full border-2 border-brand border-t-transparent animate-spin"></div>
        </div>
      )}

      {showDropdown && query.length >= 3 && (
        <ul className="absolute z-[1000] w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading && suggestions.length === 0 && (
            <li className="px-3 py-2 text-sm text-slate-500 border-b last:border-b-0">
              Searching locations...
            </li>
          )}
          {!loading && suggestions.length === 0 && (
            <li className="px-3 py-2 text-sm text-slate-500 border-b last:border-b-0">
              No locations found. Try a different spelling.
            </li>
          )}
          {suggestions.map((place, index) => {
            // Handle Photon and Nominatim formats
            const isPhoton = place.source === 'photon';
            const props = isPhoton ? place.properties : {};
            const displayName = isPhoton 
              ? (props.name 
                  ? `${props.name}, ${props.city || props.county || ''}, ${props.state || ''}` 
                  : `${props.street || ''}, ${props.city || ''}, ${props.state || ''}`.replace(/^,\s*/, ''))
              : place.display_name;
            const type = isPhoton ? props.type : place.type;

            return (
              <li
                key={place.place_id || place.properties?.osm_id || index}
                onClick={() => handleSelectPlace(place)}
                className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm border-b last:border-b-0"
              >
                <div className="font-medium text-slate-900">{displayName}</div>
                {type && (
                  <div className="text-xs text-slate-500 mt-0.5 capitalize">{type}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
