<template>
  <div>
    <div class="card" v-if="selRoom">
      <div><strong>Selected:</strong> Room #{{ selRoom.roomNumber }} • ${{ selRoom.roomType?.basePrice }}</div>
      <div class="hint">{{ bookingSummary }}</div>
    </div>

    <div class="card">
      <h3>Contact information</h3>
      <div class="row">
        <div class="col">
          <label>Title</label>
          <select v-model="contact.title">
            <option>Mr</option>
            <option>Ms</option>
            <option>Mrs</option>
            <option>Dr</option>
          </select>
        </div>
        <div class="col">
          <label>First name</label>
          <input v-model="contact.firstName" />
        </div>
        <div class="col">
          <label>Last name</label>
          <input v-model="contact.lastName" />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label>Email</label>
          <input v-model="contact.email" />
        </div>
      </div>
      <div class="actions" style="margin-top:12px">
        <button @click="continueBooking">Continue</button>
      </div>
      <div class="hint" style="margin-top:10px">
        If not logged in, you may register/login in next step but you can continue.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
import { store } from '../store.js';

const selRoom = computed(() => store.state.booking.selectedRoom);
const contact = reactive({ ...store.state.booking.contact });
const bookingSummary = computed(() => {
  const b = store.state.booking;
  return `${b.checkInDate} → ${b.checkOutDate} • ${b.guests} guest(s) • ${b.nights} night(s)`;
});

function continueBooking() {
  if (!selRoom.value) return alert('Please select a room first.');
  if (!contact.firstName || !contact.lastName || !contact.email) return alert('Please complete contact info.');
  store.setBooking({ contact: { ...contact } });
  location.assign('/confirm');
}
</script>

