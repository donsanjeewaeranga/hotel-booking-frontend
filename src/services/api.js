import { store } from '../store.js';

// Prefer explicit base from window for dev overrides, then Vite env, then proxy '/api'
const BASE = (typeof window !== 'undefined' && window.__API_BASE__) || import.meta.env.VITE_API_BASE || '/api';

async function http(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && store.state.auth.token) headers['Authorization'] = `Bearer ${store.state.auth.token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

export const Api = {
  // Auth
  async register(payload) { return http('/Auth/register', { method: 'POST', body: payload }); },
  async login(payload) { return http('/Auth/login', { method: 'POST', body: payload }); },

  // Rooms
  async searchRooms(params) {
    const usp = new URLSearchParams(params);
    return http(`/Rooms/search?${usp.toString()}`);
  },
  async getRoom(id) { return http(`/Rooms/${id}`); },

  // Guests
  async getGuestByUser(userId) { return http(`/Guests/user/${userId}`, { auth: true }); },
  async createGuest(payload) { return http('/Guests', { method: 'POST', body: payload, auth: true }); },

  // Reservations
  async createReservation(payload) { return http('/Reservations', { method: 'POST', body: payload, auth: true }); },
  async getReservation(id) { return http(`/Reservations/${id}`, { auth: true }); },
  async getReservationsByGuest(guestId) { return http(`/Reservations/guest/${guestId}`, { auth: true }); },
  async cancelReservation(id) { return http(`/Reservations/${id}/cancel`, { method: 'PUT', auth: true }); }
};

