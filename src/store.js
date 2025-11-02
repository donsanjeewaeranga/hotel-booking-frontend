const storageKey = 'hotel_booking_state_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

import { reactive } from 'vue';

const state = reactive({
  ...loadState(),
  booking: {
    guests: 1,
    checkInDate: '',
    checkOutDate: '',
    nights: 0,
    selectedRoom: null,
    contact: { title: 'Mr', firstName: '', lastName: '', email: '' },
    reservation: null
  },
  auth: {
    token: null,
    user: null,
    guest: null
  }
});

export const store = {
  state,
  setBooking(partial) {
    Object.assign(state.booking, partial);
    saveState(state);
  },
  setAuth(partial) {
    Object.assign(state.auth, partial);
    saveState(state);
  },
  clearBooking() {
    Object.assign(state.booking, {
      guests: 1,
      checkInDate: '',
      checkOutDate: '',
      nights: 0,
      selectedRoom: null,
      contact: { title: 'Mr', firstName: '', lastName: '', email: '' },
      reservation: null
    });
    saveState(state);
  },
  logout() {
    Object.assign(state.auth, { token: null, user: null, guest: null });
    saveState(state);
  }
};

