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

const savedState = loadState();

const state = reactive({
  booking: {
    guests: savedState.booking?.guests ?? 1,
    checkInDate: savedState.booking?.checkInDate ?? '',
    checkOutDate: savedState.booking?.checkOutDate ?? '',
    nights: savedState.booking?.nights ?? 0,
    selectedRoom: savedState.booking?.selectedRoom ?? null,
    contact: savedState.booking?.contact ?? { title: 'Mr', firstName: '', lastName: '', email: '', phoneNumber: '' },
    reservation: savedState.booking?.reservation ?? null
  },
  auth: {
    token: savedState.auth?.token ?? null,
    user: savedState.auth?.user ?? null,
    guest: savedState.auth?.guest ?? null
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
      contact: { title: 'Mr', firstName: '', lastName: '', email: '', phoneNumber: '' },
      reservation: null
    });
    saveState(state);
  },
  logout() {
    Object.assign(state.auth, { token: null, user: null, guest: null });
    saveState(state);
  }
};

