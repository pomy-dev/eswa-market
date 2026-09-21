// src/components/providers/location-provider.tsx
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface Coords {
  lat: number;
  lng: number;
}

interface LocationContextType {
  location: Coords | null;
  locationLabel: string | null;
  requestLocation: () => void;
  distanceTo: (lat: number, lng: number) => number | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Coords | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        setLocationLabel("Current location");
      },
      () => {
        setLocationLabel(null);
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    // Try to restore saved location
    const saved = localStorage.getItem("eswa-location");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLocation(parsed);
        setLocationLabel("Saved location");
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    if (location) localStorage.setItem("eswa-location", JSON.stringify(location));
  }, [location]);

  const distanceTo = useCallback(
    (lat: number, lng: number) => {
      if (!location) return null;
      const R = 6371;
      const dLat = ((lat - location.lat) * Math.PI) / 180;
      const dLng = ((lng - location.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((location.lat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    },
    [location]
  );

  return (
    <LocationContext.Provider value={{ location, locationLabel, requestLocation, distanceTo }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocationContext must be used within LocationProvider");
  return ctx;
}