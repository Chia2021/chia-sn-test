import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Compass,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Layers,
  Building2,
  CheckCircle2,
  LocateFixed,
  AlertCircle
} from 'lucide-react';
import { Language } from '../types';

interface OfficeLocationInfo {
  id: 'douala' | 'yaounde';
  city: Record<Language, string>;
  name: Record<Language, string>;
  subtitle: Record<Language, string>;
  address: string;
  quarter: string;
  phone: string;
  email: string;
  schedule: Record<Language, string>;
  coordinates: {
    lat: number;
    lng: number;
  };
  googleMapsUrl: string;
  placeId?: string;
}

export const OFFICES_DATA: OfficeLocationInfo[] = [
  {
    id: 'douala',
    city: {
      FR: 'Douala (Siège)',
      EN: 'Douala (HQ)',
    },
    name: {
      FR: 'Douala — Siège Social & Direction Générale',
      EN: 'Douala — Headquarters & Corporate Offices',
    },
    subtitle: {
      FR: 'Centre d’affaires de Bonanjo (Zone Portuaire & Administrative)',
      EN: 'Bonanjo Financial District (Port & Administrative Hub)',
    },
    address: 'Boulevard de la Liberté, Immeuble Horizon (3e étage), Bonanjo, Douala',
    quarter: 'Bonanjo, Douala',
    phone: '+237 670 12 34 56 / +237 233 42 11 00',
    email: 'douala@chia-sn.cm',
    schedule: {
      FR: 'Lundi au Vendredi : 08h00 - 17h30',
      EN: 'Monday to Friday: 8:00 AM - 5:30 PM',
    },
    coordinates: {
      lat: 4.0435,
      lng: 9.6917,
    },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=4.0435,9.6917',
  },
  {
    id: 'yaounde',
    city: {
      FR: 'Yaoundé (Antenne)',
      EN: 'Yaoundé (Regional)',
    },
    name: {
      FR: 'Yaoundé — Antenne Régionale & Relations Publiques',
      EN: 'Yaoundé — Regional Office & Public Affairs',
    },
    subtitle: {
      FR: 'Quartier Bastos (Proche Ministères & Ambassades)',
      EN: 'Bastos District (Near Ministries & Diplomatic Missions)',
    },
    address: 'Avenue Rosa Parks, Face Ambassades, Bastos, Yaoundé',
    quarter: 'Bastos, Yaoundé',
    phone: '+237 699 98 76 54 / +237 222 21 09 88',
    email: 'yaounde@chia-sn.cm',
    schedule: {
      FR: 'Lundi au Vendredi : 08h30 - 17h00',
      EN: 'Monday to Friday: 8:30 AM - 5:00 PM',
    },
    coordinates: {
      lat: 3.8837,
      lng: 11.5126,
    },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=3.8837,11.5126',
  },
];

// Helper: Haversine distance formula in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Controller component to smoothly manipulate the camera
function MapCameraControl({
  selectedOffice,
  userLocation,
  isOverview,
}: {
  selectedOffice: OfficeLocationInfo | null;
  userLocation: { lat: number; lng: number } | null;
  isOverview: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const gMaps = (window as unknown as { google?: typeof google }).google?.maps;

    if (isOverview) {
      if (gMaps) {
        // Fit both Douala and Yaoundé into view
        const bounds = new gMaps.LatLngBounds();
        OFFICES_DATA.forEach((off) => bounds.extend(off.coordinates));
        if (userLocation) {
          bounds.extend(userLocation);
        }
        map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
      } else {
        // Fallback center on Cameroon
        map.panTo({ lat: 3.96, lng: 10.6 });
        map.setZoom(8);
      }
    } else if (selectedOffice) {
      map.panTo(selectedOffice.coordinates);
      map.setZoom(16);
    }
  }, [map, selectedOffice, isOverview, userLocation]);

  return null;
}

interface GoogleMapsLocalizationProps {
  currentLang: Language;
}

export function GoogleMapsLocalization({ currentLang }: GoogleMapsLocalizationProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  if (!apiKey) {
    return (
      <div id="google-maps-localization" className="mt-12 pt-10 border-t border-slate-200">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {currentLang === 'FR'
            ? 'La carte Google Maps est désactivée tant que la variable VITE_GOOGLE_MAPS_API_KEY n’est pas configurée.'
            : 'Google Maps is disabled until VITE_GOOGLE_MAPS_API_KEY is configured.'}
        </div>
      </div>
    );
  }

  const [selectedOfficeId, setSelectedOfficeId] = useState<'douala' | 'yaounde'>('douala');
  const [activeInfoWindowId, setActiveInfoWindowId] = useState<'douala' | 'yaounde' | null>('douala');
  const [isOverview, setIsOverview] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid'>('roadmap');

  // User geolocation state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [distances, setDistances] = useState<Record<string, number> | null>(null);

  const selectedOffice = useMemo(
    () => OFFICES_DATA.find((o) => o.id === selectedOfficeId) || OFFICES_DATA[0],
    [selectedOfficeId]
  );

  // Request user geolocation
  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError(
        currentLang === 'FR'
          ? 'La géolocalisation n’est pas supportée par votre navigateur.'
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userCoords);
        setIsLocating(false);

        // Calculate distances to both offices
        const dists: Record<string, number> = {};
        let closestId: 'douala' | 'yaounde' = 'douala';
        let minDistance = Infinity;

        OFFICES_DATA.forEach((off) => {
          const d = calculateDistance(
            userCoords.lat,
            userCoords.lng,
            off.coordinates.lat,
            off.coordinates.lng
          );
          dists[off.id] = d;
          if (d < minDistance) {
            minDistance = d;
            closestId = off.id;
          }
        });

        setDistances(dists);
        setSelectedOfficeId(closestId);
        setActiveInfoWindowId(closestId);
        setIsOverview(false);
      },
      (error) => {
        setIsLocating(false);
        let errorMsg =
          currentLang === 'FR'
            ? 'Impossible d’accéder à votre position (autorisation requise).'
            : 'Unable to access your location (permission required).';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg =
            currentLang === 'FR'
              ? 'Accès à la position refusé. Veuillez autoriser la géolocalisation dans votre navigateur.'
              : 'Location access denied. Please allow geolocation permissions in your browser.';
        }
        setGeoError(errorMsg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [currentLang]);

  return (
    <div id="google-maps-localization" className="mt-12 pt-10 border-t border-slate-200">
      {/* Section Sub-header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0f4c81] text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {currentLang === 'FR'
                ? 'Localisation Interactive Google Maps'
                : 'Interactive Google Maps Localization'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {currentLang === 'FR'
              ? 'Situer et Visiter nos Cabinets'
              : 'Locate and Visit Our Offices'}
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {currentLang === 'FR'
              ? 'Retrouvez nos implantations stratégiques à Douala Bonanjo et Yaoundé Bastos. Calculez votre itinéraire et trouvez l’antenne la plus proche.'
              : 'Explore our strategic locations in Douala Bonanjo and Yaoundé Bastos. Calculate your route and find the nearest firm office.'}
          </p>
        </div>

        {/* Action button: Locate user */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleLocateUser}
            disabled={isLocating}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            title={currentLang === 'FR' ? 'Détecter mon cabinet le plus proche' : 'Find nearest office'}
          >
            <LocateFixed className={`w-4 h-4 text-[#0f4c81] ${isLocating ? 'animate-spin' : ''}`} />
            <span>
              {isLocating
                ? currentLang === 'FR'
                  ? 'Recherche...'
                  : 'Locating...'
                : currentLang === 'FR'
                ? 'Trouver l’antenne la plus proche'
                : 'Find Nearest Office'}
            </span>
          </button>
        </div>
      </div>

      {/* Geolocation feedback alert if available or error */}
      {geoError && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {userLocation && distances && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {currentLang === 'FR'
                ? `Position détectée ! Vous êtes à ${distances[selectedOfficeId]} km du cabinet sélectionné (${selectedOffice.quarter}).`
                : `Location detected! You are ${distances[selectedOfficeId]} km from the selected office (${selectedOffice.quarter}).`}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
            {distances.douala <= distances.yaounde
              ? currentLang === 'FR'
                ? 'Douala est le plus proche'
                : 'Douala is closest to you'
              : currentLang === 'FR'
              ? 'Yaoundé est le plus proche'
              : 'Yaoundé is closest to you'}
          </span>
        </div>
      )}

      {/* Office Selector Pills & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
        {/* Office tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {OFFICES_DATA.map((office) => {
            const isSelected = selectedOfficeId === office.id && !isOverview;
            return (
              <button
                key={office.id}
                type="button"
                onClick={() => {
                  setSelectedOfficeId(office.id);
                  setActiveInfoWindowId(office.id);
                  setIsOverview(false);
                }}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0f4c81] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Building2 className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-[#0f4c81]'}`} />
                <span>{office.city ? office.city[currentLang] : office.quarter}</span>
                {distances && distances[office.id] !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {distances[office.id]} km
                  </span>
                )}
              </button>
            );
          })}

          {/* Overview button */}
          <button
            type="button"
            onClick={() => {
              setIsOverview(true);
              setActiveInfoWindowId(null);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isOverview
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{currentLang === 'FR' ? 'Vue Cameroun' : 'Cameroon Overview'}</span>
          </button>
        </div>

        {/* Map Type Toggle: Roadmap vs Hybrid */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              mapType === 'roadmap' ? 'bg-slate-100 text-[#0f4c81] font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {currentLang === 'FR' ? 'Plan' : 'Map'}
          </button>
          <button
            type="button"
            onClick={() => setMapType('hybrid')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              mapType === 'hybrid' ? 'bg-slate-100 text-[#0f4c81] font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {currentLang === 'FR' ? 'Satellite' : 'Satellite'}
          </button>
        </div>
      </div>

      {/* Main Container: Map + Active Office Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Google Map Canvas */}
        <div className="lg:col-span-8 h-[400px] sm:h-[460px] lg:h-[480px] rounded-2xl overflow-hidden border border-slate-300/80 shadow-md relative bg-slate-100">
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={selectedOffice.coordinates}
              defaultZoom={15}
              mapId="DEMO_MAP_ID"
              mapTypeId={mapType}
              gestureHandling="cooperative"
              disableDefaultUI={false}
              zoomControl={true}
              streetViewControl={true}
              className="w-full h-full"
            >
              <MapCameraControl
                selectedOffice={selectedOffice}
                userLocation={userLocation}
                isOverview={isOverview}
              />

              {/* Office Markers with customized advanced pin */}
              {OFFICES_DATA.map((office) => {
                const isSelected = selectedOfficeId === office.id;
                return (
                  <AdvancedMarker
                    key={office.id}
                    position={office.coordinates}
                    title={office.name[currentLang]}
                    onClick={() => {
                      setSelectedOfficeId(office.id);
                      setActiveInfoWindowId(office.id);
                      setIsOverview(false);
                    }}
                  >
                    <Pin
                      background={isSelected ? '#e67e22' : '#0f4c81'}
                      borderColor="#ffffff"
                      glyphColor="#ffffff"
                      scale={isSelected ? 1.25 : 1.05}
                    />
                  </AdvancedMarker>
                );
              })}

              {/* User Geolocation Marker (if available) */}
              {userLocation && (
                <AdvancedMarker position={userLocation} title={currentLang === 'FR' ? 'Votre position' : 'Your location'}>
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-sky-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-600 border-2 border-white shadow-md" />
                  </div>
                </AdvancedMarker>
              )}

              {/* Interactive InfoWindow for selected office */}
              {activeInfoWindowId && (
                <InfoWindow
                  position={
                    OFFICES_DATA.find((o) => o.id === activeInfoWindowId)?.coordinates
                  }
                  onCloseClick={() => setActiveInfoWindowId(null)}
                >
                  {(() => {
                    const infoOffice = OFFICES_DATA.find((o) => o.id === activeInfoWindowId)!;
                    return (
                      <div className="p-2 max-w-[260px] text-slate-800 text-xs">
                        <div className="font-bold text-[#0f4c81] text-sm mb-1 leading-snug">
                          {infoOffice.quarter}
                        </div>
                        <p className="text-slate-600 mb-2 leading-tight">
                          {infoOffice.address}
                        </p>
                        <div className="space-y-1 mb-3 pt-1 border-t border-slate-100 text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <Phone className="w-3 h-3 text-[#0f4c81]" />
                            <span>{infoOffice.phone.split('/')[0]}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{infoOffice.schedule[currentLang]}</span>
                          </div>
                        </div>
                        <a
                          href={infoOffice.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-2.5 rounded-lg bg-[#0f4c81] hover:bg-[#0a3557] text-white font-semibold text-xs shadow-xs transition-colors"
                        >
                          <Navigation className="w-3 h-3 text-amber-300" />
                          <span>{currentLang === 'FR' ? 'Itinéraire GPS' : 'Get Directions'}</span>
                        </a>
                      </div>
                    );
                  })()}
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>

        {/* Right Panel: Selected Office Details Card */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
          <div className="space-y-5">
            {/* Header with office name and status */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0f4c81] text-[11px] font-bold">
                  <Building2 className="w-3 h-3" />
                  {selectedOffice.id === 'douala'
                    ? currentLang === 'FR'
                      ? 'Siège Social'
                      : 'Headquarters'
                    : currentLang === 'FR'
                    ? 'Antenne Régionale'
                    : 'Regional Office'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {currentLang === 'FR' ? 'Ouvert' : 'Open'}
                </span>
              </div>

              <h4 className="text-lg font-extrabold text-slate-900 leading-snug">
                {selectedOffice.name[currentLang]}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {selectedOffice.subtitle[currentLang]}
              </p>
            </div>

            {/* Address */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <div className="flex items-start gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-[#0f4c81] shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{selectedOffice.address}</span>
              </div>
            </div>

            {/* Direct Contact information */}
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0f4c81] flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    {currentLang === 'FR' ? 'Téléphone & Standard' : 'Telephone'}
                  </span>
                  <a
                    href={`tel:${selectedOffice.phone.split('/')[0].trim()}`}
                    className="font-semibold text-slate-900 hover:text-[#0f4c81] transition-colors"
                  >
                    {selectedOffice.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0f4c81] flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    {currentLang === 'FR' ? 'Courrier Électronique' : 'Direct Email'}
                  </span>
                  <a
                    href={`mailto:${selectedOffice.email}`}
                    className="font-semibold text-slate-900 hover:text-[#0f4c81] transition-colors"
                  >
                    {selectedOffice.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0f4c81] flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    {currentLang === 'FR' ? 'Horaires d’accueil' : 'Opening Hours'}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedOffice.schedule[currentLang]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-5 mt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <a
              href={selectedOffice.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#0f4c81] hover:bg-[#0a3557] text-white font-bold text-xs shadow-md shadow-[#0f4c81]/20 transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>
                {currentLang === 'FR'
                  ? 'Ouvrir l’itinéraire dans Google Maps'
                  : 'Open Route in Google Maps'}
              </span>
              <ExternalLink className="w-3 h-3 text-white/70 ml-0.5" />
            </a>

            <a
              href={`https://wa.me/237670123456?text=${encodeURIComponent(
                currentLang === 'FR'
                  ? `Bonjour Cabinet Chia-SN, je souhaite prendre rendez-vous au cabinet de ${selectedOffice.quarter}.`
                  : `Hello Chia-SN Firm, I would like to schedule an appointment at your ${selectedOffice.quarter} office.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>{currentLang === 'FR' ? 'Prendre RDV sur place (WhatsApp)' : 'Book On-Site Visit (WhatsApp)'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
