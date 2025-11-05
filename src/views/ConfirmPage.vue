<template>
  <div>
    <div v-if="success" class="success" style="margin-bottom:12px">Booking confirmed!</div>
    <div v-if="error" class="error" style="margin-bottom:12px">{{ error }}</div>

    <div class="card">
      <h3>Review & Confirm</h3>
      <div class="row">
        <div class="col">
          <strong>Stay</strong>
          <div class="hint">{{ bookingSummary }}</div>
        </div>
        <div class="col">
          <strong>Room</strong>
          <div class="hint">#{{ selRoom?.roomNumber }} • {{ selRoom?.roomType?.typeName }}</div>
        </div>
        <div class="col">
          <strong>Guest</strong>
          <div class="hint">{{ contact.title }} {{ contact.firstName }} {{ contact.lastName }} ({{ contact.email }})</div>
        </div>
      </div>
      <div class="actions" style="margin-top:12px">
        <button @click="confirm" :disabled="loading">Confirm booking</button>
        <button class="secondary" @click="$router.push('/contact')">Back</button>
      </div>
    </div>

    <div v-if="reservation" class="card">
      <h3>Reservation</h3>
      <div class="hint">Reservation ID: {{ reservation.reservationId }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { store } from '../store.js';
import { Api } from '../services/api.js';

const loading = ref(false);
const error = ref('');
const success = ref(false);
const reservation = ref(null);

const selRoom = computed(() => store.state.booking.selectedRoom);
const contact = computed(() => store.state.booking.contact);
const bookingSummary = computed(() => {
  const b = store.state.booking;
  return `${b.checkInDate} → ${b.checkOutDate} • ${b.guests} guest(s) • ${b.nights} night(s)`;
});

async function ensureGuest() {
  const auth = store.state.auth;
  if (!auth.token || !auth.user) return null;
  try {
    const g = await Api.getGuestByUser(auth.user.userId);
    return g;
  } catch {
    const payload = {
      userId: auth.user.userId,
      title: contact.value.title,
      firstName: contact.value.firstName,
      lastName: contact.value.lastName,
      email: contact.value.email,
      phoneNumber: ''
    };
    return Api.createGuest(payload);
  }
}

async function confirm() {
  error.value = '';
  success.value = false;
  loading.value = true;
  try {
    const b = store.state.booking;
    const auth = store.state.auth;
    let guestId = null;
    if (auth.token) {
      const guest = await ensureGuest();
      guestId = guest?.guestId ?? null;
    }

    const payload = {
      roomId: selRoom.value.roomId,
      guestId: guestId, // can be null if API allows; else requires login
      checkInDate: b.checkInDate,
      checkOutDate: b.checkOutDate,
      totalAmount: selRoom.value.roomType?.basePrice || 0,
      taxServiceCharge: 0,
      grandTotal: selRoom.value.roomType?.basePrice || 0
    };

    const r = await Api.createReservation(payload);
    reservation.value = r;
    store.setBooking({ reservation: r });
    success.value = true;
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>

