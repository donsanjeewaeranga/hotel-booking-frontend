<template>
  <div>
    <div class="card">
      <div class="row" style="align-items:center">
        <div class="col"><h3 style="margin:0">My Reservations</h3></div>
        <div class="actions" style="margin-left:auto">
          <button v-if="auth.token" class="secondary" @click="logout">Logout</button>
          <router-link v-else to="/auth">Login/Register</router-link>
        </div>
      </div>
    </div>
    <div v-if="!auth.token" class="hint">Please login to see your bookings.</div>
    <div v-else>
      <div v-if="error" class="error" style="margin:10px 0">{{ error }}</div>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <div v-for="r in reservations" :key="r.reservationId" class="card">
          <div class="row" style="align-items:center">
            <div class="col">
              <strong>#{{ r.reservationId }}</strong>
              <div class="hint">Room #{{ r.room?.roomNumber }} • {{ r.checkInDate?.slice(0,10) }} → {{ r.checkOutDate?.slice(0,10) }} • {{ r.reservationStatus }}</div>
            </div>
            <div class="col" style="max-width:220px; text-align:right">
              <button v-if="canCancel(r)" @click="cancel(r)">Cancel</button>
            </div>
          </div>
        </div>
        <div v-if="!reservations.length" class="hint">No reservations.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { store } from '../store.js';
import { Api } from '../services/api.js';

const auth = store.state.auth;
const reservations = ref([]);
const loading = ref(false);
const error = ref('');

function logout() { store.logout(); location.reload(); }

function canCancel(r) { return r.reservationStatus && r.reservationStatus.toLowerCase() === 'confirmed'; }

async function load() {
  if (!auth.token || !auth.user) return;
  loading.value = true; error.value = '';
  try {
    let guest = store.state.auth.guest;
    if (!guest) {
      guest = await Api.getGuestByUser(auth.user.userId);
      store.setAuth({ guest });
    }
    const list = await Api.getReservationsByGuest(guest.guestId);
    reservations.value = list;
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

async function cancel(r) {
  try {
    await Api.cancelReservation(r.reservationId);
    await load();
  } catch (e) {
    alert(e.message);
  }
}

onMounted(load);
</script>

