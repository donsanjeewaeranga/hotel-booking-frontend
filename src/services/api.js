import { store } from '../store.js';

// Prefer explicit base from window for dev overrides, then Vite env, then proxy '/api'
const BASE = (typeof window !== 'undefined' && window.__API_BASE__) || import.meta.env.VITE_API_BASE || '/api';

// Helper to construct full image URL pointing to S3 bucket, regardless of API host
// Target format: https://hotel-booking-don.s3.eu-west-1.amazonaws.com/images/standard-room.jpg
const S3_IMAGE_BASE = 'https://hotel-booking-don.s3.eu-west-1.amazonaws.com';
export function getImageUrl(imageUrl) {
  if (!imageUrl) return null;

  // Derive a path from the provided URL or relative path
  let path = imageUrl;
  try {
    // If it's an absolute URL, extract pathname (e.g., "/api/images/foo.jpg" or "/images/foo.jpg")
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      const u = new URL(imageUrl);
      path = u.pathname || '';
    }
  } catch {
    // Fallback: treat as relative path
    path = imageUrl;
  }

  // Normalize common API prefixes (e.g., "/api/images/..." -> "/images/...")
  // Remove any leading optional "api/" segment at the start
  path = path.replace(/^\/?api\//, '/');

  // Ensure leading slash
  if (!path.startsWith('/')) path = '/' + path;

  // Return S3 URL with normalized path
  return `${S3_IMAGE_BASE}${path}`;
}

async function http(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && store.state.auth.token) {
    headers['Authorization'] = `Bearer ${store.state.auth.token}`;
  }
  
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  
  if (!res.ok) {
    const text = await res.text();
    let errorMessage = text || `HTTP ${res.status}`;
    
    try {
      const errorJson = JSON.parse(text);
      errorMessage = 
        errorJson.message || 
        errorJson.error || 
        errorJson.title || 
        errorJson.detail ||
        text;
    } catch (e) {
      // Use text as-is
    }
    
    throw new Error(errorMessage);
  }
  
  return res.json();
}

export const Api = {
  // Auth
  async register(payload, isGuest = false) {
    const endpoint = isGuest ? '/Auth/register/guest' : '/Auth/register';
    return http(endpoint, { method: 'POST', body: payload });
  },
  async login(payload) { return http('/Auth/login', { method: 'POST', body: payload }); },

  // Rooms
  async searchRooms(params) {
    const usp = new URLSearchParams(params);
    return http(`/Rooms/search?${usp.toString()}`);
  },
  async getRoom(id) { return http(`/Rooms/${id}`); },

  // Guests
  async getGuest(guestId) { return http(`/Guests/${guestId}`, { auth: true }); },
  async getGuestByUser(userId) { return http(`/Guests/user/${userId}`, { auth: true }); },
  async createGuest(payload) { return http('/Guests', { method: 'POST', body: payload, auth: true }); },

  // Reservations
  async createReservation(payload) {
    return http('/Reservations', { method: 'POST', body: payload, auth: true });
  },
  async getReservation(id) { return http(`/Reservations/${id}`, { auth: true }); },
  async getReservationsByGuest(guestId) { return http(`/Reservations/guest/${guestId}`, { auth: true }); },
  async cancelReservation(id) { return http(`/Reservations/${id}/cancel`, { method: 'PUT', auth: true }); }
};

