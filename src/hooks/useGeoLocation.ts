import { useState, useEffect } from 'react';

interface Location {
  lat: number;
  lng: number;
  loaded: boolean;
  error?: { code: number; message: string };
}

// [Team Comment 반영]: 기본 좌표 설정 (서울 시청)
const DEFAULT_COORDS = { lat: 37.5665, lng: 126.9780 };

export const useGeoLocation = () => {
  const [location, setLocation] = useState<Location>({
    loaded: false,
    lat: DEFAULT_COORDS.lat,
    lng: DEFAULT_COORDS.lng,
  });

  const onSuccess = (location: GeolocationPosition) => {
    setLocation({
      loaded: true,
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  };

  const onError = (error: GeolocationPositionError) => {
    setLocation({
      loaded: true,
      lat: DEFAULT_COORDS.lat,
      lng: DEFAULT_COORDS.lng,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      } as GeolocationPositionError);
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
};