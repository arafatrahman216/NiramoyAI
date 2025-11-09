import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import './NearbyHospitalsMap.css';

// Mapbox access token - get from https://account.mapbox.com/
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWZoYW0tYWRpYW4iLCJhIjoiY2x6Y2JoZ3Q2MDhpejJxcXphazZ3YXlyNyJ9.sQLUbawuv1ctp4WCOTLeSw';

const NearbyHospitalsMap = ({ onHospitalsFound, mapRef }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 90.4125,
    latitude: 23.8103,
    zoom: 12,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [searchingSuggestions, setSearchingSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const internalMapRef = useRef(null);

  const LOCATIONIQ_API_KEY = 'pk.30cb8e735ea3a708aa98397a90c6fa29';

  // Resilient Overpass API wrapper with retry logic
  const callOverpassAPI = async (query, maxRetries = 3, retryDelay = 2000) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Check if API returned an error
        if (data.error) {
          throw new Error(`Overpass API Error: ${data.error.message || 'Unknown error'}`);
        }

        // Success - return data
        return data;
      } catch (err) {
        lastError = err;
        console.warn(`Overpass API attempt ${attempt}/${maxRetries} failed:`, err.message);
        
        // If not last attempt, wait before retrying
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    // All retries exhausted
    throw new Error(`Overpass API failed after ${maxRetries} attempts: ${lastError.message}`);
  };

  // Auto-load hospitals on component mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          setViewState({
            longitude,
            latitude,
            zoom: 12,
          });
          fetchNearbyHospitals(latitude, longitude);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Use default coordinates if geolocation fails
          setUserLocation({ lat: 23.8103, lon: 90.4125 });
          fetchNearbyHospitals(23.8103, 90.4125);
        }
      );
    } else {
      // Fallback if geolocation not supported
      setUserLocation({ lat: 23.8103, lon: 90.4125 });
      fetchNearbyHospitals(23.8103, 90.4125);
    }
  }, []);

  // Get user location
  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          setViewState({
            longitude,
            latitude,
            zoom: 12,
          });
          console.log("ok");
          
          fetchNearbyHospitals(latitude, longitude);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setError('Unable to get your location. Using default location (Dhaka).');
          // Use default coordinates if geolocation fails
          fetchNearbyHospitals(23.8103, 90.4125);
          console.log("shit");
          
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  // Fetch hospitals from Overpass API with retry logic
  const fetchNearbyHospitals = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);

      // Build Overpass API query for hospitals within 5km radius
      const query = `[out:json];node(around:5000,${lat},${lon})["amenity"="hospital"];out;`;
      
      // Use resilient API wrapper with retry logic
      const data = await callOverpassAPI(query);
      
      if (data.elements && data.elements.length > 0) {
        const hospitalsData = data.elements.map((hospital, index) => ({
          id: hospital.id || index,
          name: hospital.tags?.name || 'Hospital',
          lat: hospital.lat,
          lon: hospital.lon,
          amenity: hospital.tags?.amenity,
          healthcare: hospital.tags?.healthcare,
        }));

        setHospitals(hospitalsData);
        if (onHospitalsFound) {
          onHospitalsFound(hospitalsData);
        }

        setError(null);
      } else {
        setHospitals([]);
        setError('No hospitals found in your area. Try a different location.');
      }
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      setError(`Error fetching hospitals: ${err.message}`);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  // Search locations using LocationIQ API
  const searchLocations = async (query) => {
    if (!query.trim()) {
      setLocationSuggestions([]);
      return;
    }

    try {
      setSearchingSuggestions(true);
      const url = `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(query)}&format=json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions');
      }

      const data = await response.json();
      setLocationSuggestions(data || []);
    } catch (err) {
      console.error('Error searching locations:', err);
      setLocationSuggestions([]);
    } finally {
      setSearchingSuggestions(false);
    }
  };

  // Handle location selection from suggestions
  const handleLocationSelect = (location) => {
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);
    
    setLocationSearchTerm(location.display_name);
    setLocationSuggestions([]);
    setViewState({
      longitude: lon,
      latitude: lat,
      zoom: 12,
    });
    
    fetchNearbyHospitals(lat, lon);
  };

  // Handle location search input change
  const handleLocationSearchChange = (value) => {
    setLocationSearchTerm(value);
    if (value.trim().length > 2) {
      searchLocations(value);
    } else {
      setLocationSuggestions([]);
    }
  };

  // Add route to map when it's fetched
  useEffect(() => {
    if (!route || !internalMapRef.current) return;

    const map = internalMapRef.current.getMap();
    
    // Remove existing route layer and source if they exist
    if (map.getSource('route')) {
      map.removeLayer('route-layer');
      map.removeSource('route');
    }

    // Add source for the route
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: route.geometry,
      },
    });

    // Add layer to draw the route
    map.addLayer({
      id: 'route-layer',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#10b981',
        'line-width': 4,
        'line-opacity': 0.8,
      },
    });

    return () => {
      // Cleanup on unmount or when route changes
      if (map.getSource('route')) {
        map.removeLayer('route-layer');
        map.removeSource('route');
      }
    };
  }, [route]);

  // Fetch route/directions from user location to hospital
  const fetchDirections = async (hospital) => {
    if (!userLocation) {
      setError('User location not available. Please enable location or search for a location first.');
      return;
    }

    try {
      setRouteLoading(true);
      
      // Format: longitude,latitude for Mapbox Directions API
      const start = `${userLocation.lon},${userLocation.lat}`;
      const end = `${hospital.lon},${hospital.lat}`;
      
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch directions');
      }

      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        setRoute({
          geometry: data.routes[0].geometry,
          distance: data.routes[0].distance,
          duration: data.routes[0].duration,
          hospital: hospital,
        });
      } else {
        setError('No route found to this hospital');
      }
    } catch (err) {
      console.error('Error fetching directions:', err);
      setError(`Error fetching directions: ${err.message}`);
    } finally {
      setRouteLoading(false);
    }
  };

  return (
    <div className="nearby-hospitals-container">
      <div className="map-header">
        <h3 className="map-title">🗺️ Nearby Hospitals</h3>
      </div>

      {/* Location Search Box */}
      <div className="location-search-box">
        <div className="location-search-input-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            className="location-search-input"
            placeholder="Search location (e.g., Dhaka, Chittagong...)"
            value={locationSearchTerm}
            onChange={(e) => handleLocationSearchChange(e.target.value)}
          />
          {searchingSuggestions && <span className="search-spinner"></span>}
          <button
            className="location-refresh-btn"
            onClick={getUserLocation}
            disabled={loading}
            title="Load nearby hospitals from current location"
          >
            {loading ? (
              <span className="spinner-tiny-inline"></span>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M3 21v-5h5"></path>
              </svg>
            )}
          </button>
        </div>

        {/* Location suggestions dropdown */}
        {locationSuggestions.length > 0 && (
          <div className="location-suggestions">
            {locationSuggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.place_id}-${index}`}
                className="location-suggestion-item"
                onClick={() => handleLocationSelect(suggestion)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div className="suggestion-info">
                  <p className="suggestion-name">{suggestion.display_name}</p>
                  <p className="suggestion-coords">{parseFloat(suggestion.lat).toFixed(4)}, {parseFloat(suggestion.lon).toFixed(4)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <svg className="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      {route && (
        <div className="route-info-panel">
          <div className="route-info-header">
            <h4>📍 Route to {route.hospital.name}</h4>
            <button className="route-close-btn" onClick={() => setRoute(null)}>✕</button>
          </div>
          <div className="route-details">
            <div className="route-detail-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              <span className="route-detail-label">Distance:</span>
              <span className="route-detail-value">{(route.distance / 1000).toFixed(2)} km</span>
            </div>
            <div className="route-detail-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className="route-detail-label">Duration:</span>
              <span className="route-detail-value">{Math.round(route.duration / 60)} min</span>
            </div>
          </div>
        </div>
      )}

      {hospitals.length > 0 && (
        <div className="map-wrapper">
          <Map
            ref={internalMapRef}
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            style={{ width: '100%', height: '400px' }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            {/* User location marker */}
            {userLocation && (
              <Marker
                longitude={userLocation.lon}
                latitude={userLocation.lat}
                anchor="bottom"
                onClick={() => setSelectedMarker({ type: 'user' })}
              >
                <div className="user-marker" title="Your Location">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    {/* Google Maps style teardrop */}
                    <path d="M20 2C11.7 2 5 8.7 5 17c0 10 15 23 15 23s15-13 15-23c0-8.3-6.7-15-15-15z" fill="#EA4335" stroke="white" strokeWidth="1.5"/>
                    {/* Inner circle */}
                    <circle cx="20" cy="17" r="5" fill="white"/>
                  </svg>
                </div>
              </Marker>
            )}

            {/* Hospital markers */}
            {hospitals.map((hospital) => (
              <Marker
                key={hospital.id}
                longitude={hospital.lon}
                latitude={hospital.lat}
                anchor="bottom"
                onClick={() => {
                  setSelectedMarker(hospital);
                  // Automatically fetch directions when hospital is clicked
                  fetchDirections(hospital);
                }}
              >
                <div className="hospital-marker" title={hospital.name}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4 L16 28 M4 16 L28 16" stroke="white" strokeWidth="3" />
                    <circle cx="16" cy="16" r="12" fill="#10b981" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
              </Marker>
            ))}

            {/* Popup for selected marker */}
            {selectedMarker && selectedMarker.type === 'user' && userLocation && (
              <Popup
                longitude={userLocation.lon}
                latitude={userLocation.lat}
                anchor="bottom"
                onClose={() => setSelectedMarker(null)}
              >
                <div className="popup-content">
                  <strong>📍 Your Location</strong>
                  <p>{userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}</p>
                </div>
              </Popup>
            )}

            {selectedMarker && selectedMarker.type !== 'user' && (
              <Popup
                longitude={selectedMarker.lon}
                latitude={selectedMarker.lat}
                anchor="bottom"
                onClose={() => setSelectedMarker(null)}
              >
                <div className="popup-content">
                  <strong className="hospital-name">🏥 {selectedMarker.name}</strong>
                  <p className="hospital-coords">
                    {selectedMarker.lat.toFixed(4)}, {selectedMarker.lon.toFixed(4)}
                  </p>
                  <button
                    className="direction-btn"
                    onClick={() => fetchDirections(selectedMarker)}
                    disabled={routeLoading}
                  >
                    {routeLoading ? (
                      <>
                        <span className="spinner-tiny"></span>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                        <span>Direction</span>
                      </>
                    )}
                  </button>
                </div>
              </Popup>
            )}

            {/* Route line on map */}
            {route && route.geometry && (
              <div key="route-layer">
                {/* You can use a GeoJSON layer or draw line - we'll draw programmatically */}
              </div>
            )}
          </Map>

          <div className="hospitals-list">
            <h4>Found {hospitals.length} Hospitals</h4>
            <div className="hospitals-grid">
              {hospitals.map((hospital, index) => (
                <div 
                  key={hospital.id} 
                  className="hospital-card"
                  onClick={() => {
                    setSelectedMarker(hospital);
                    setViewState({
                      longitude: hospital.lon,
                      latitude: hospital.lat,
                      zoom: 12,
                    });
                    // Automatically fetch directions when hospital card is clicked
                    fetchDirections(hospital);
                  }}
                >
                  <div className="hospital-number">{index + 1}</div>
                  <div className="hospital-info">
                    <h5>{hospital.name}</h5>
                    <p className="hospital-distance">
                      Lat: {hospital.lat.toFixed(4)}, Lon: {hospital.lon.toFixed(4)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && hospitals.length === 0 && !error && (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <p>Click "See Nearby Hospitals" to find hospitals near you</p>
        </div>
      )}
    </div>
  );
};

export default NearbyHospitalsMap;
