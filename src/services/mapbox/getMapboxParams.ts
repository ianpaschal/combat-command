import { v4 } from 'uuid';

export const getMapboxSessionToken = (): string => {
  let existingToken = localStorage.getItem('mapbox_session_token');
  if (!existingToken) {
    existingToken = v4();
    localStorage.setItem('mapbox_session_token', existingToken);
  }
  return existingToken;
};

export const getMapboxParams = (query?: string): string => new URLSearchParams({
  ...(query ? { q: encodeURIComponent(query) } : {}),
  session_token: getMapboxSessionToken(),
  access_token: import.meta.env.VITE_MAPBOX_TOKEN,
}).toString();