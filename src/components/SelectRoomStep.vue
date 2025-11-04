<script setup>
import { onMounted, ref, computed } from "vue";
import { store } from "../store.js";
import { Api } from "../services/api.js";
import RoomCard from './RoomCard.vue';
import LoginRegisterModal from './LoginRegisterModal.vue';

const showAuthModal = ref(false);
const selectedRoomForBooking = ref(null);

const rooms = ref([]);
const loading = ref(false);
const error = ref("");
const sortBy = ref("price");

const summary = computed(() => {
  const b = store.state.booking;
  if (!b.checkInDate || !b.checkOutDate) return "";
  return `${b.checkInDate} → ${b.checkOutDate} • ${b.guests} guest(s) • ${b.nights} night(s)`;
});

const sortedRooms = computed(() => {
  const copy = [...rooms.value];
  if (sortBy.value === "capacity")
    return copy.sort((a, b) => (a.roomType?.capacity ?? 0) - (b.roomType?.capacity ?? 0));
  return copy.sort((a, b) => (a.roomType?.basePrice ?? 0) - (b.roomType?.basePrice ?? 0));
});

async function load() {
  error.value = "";
  loading.value = true;
  try {
    const b = store.state.booking;
    const data = await Api.searchRooms({
      checkIn: b.checkInDate,
      checkOut: b.checkOutDate,
      numberOfGuests: b.guests,
    });
    rooms.value = data;
  } catch (e) {
    error.value = e.message;
    rooms.value = [];
  } finally {
    loading.value = false;
  }
}

function normalizeRoom(room) {
  const id = room?.id ?? room?.roomId ?? room?.roomNumber ?? room?.room?.id ?? room?.room?.roomId ?? room?.room?.roomNumber;
  const roomNumber = room?.roomNumber ?? room?.room?.roomNumber ?? id ?? null;
  const name = room?.name ?? room?.roomType?.name ?? (roomNumber ? `Room ${roomNumber}` : 'Room');
  const price = room?.price ?? room?.roomType?.basePrice ?? 120;
  const capacity = room?.capacity ?? room?.roomType?.capacity ?? null;
  return {
    id,
    roomNumber,
    name,
    price,
    capacity,
    image: room?.image || null,
    raw: room
  };
}

function proceedWithBooking(room) {
  const normalized = normalizeRoom(room);
  store.setBooking({ selectedRoom: normalized });
  emit('room-selected', normalized);
}

function book(room) {
  if (!store.state.auth?.user) {
    selectedRoomForBooking.value = room;
    showAuthModal.value = true;
    return;
  }
  proceedWithBooking(room);
}

function onAuthSuccess() {
  if (selectedRoomForBooking.value) {
    proceedWithBooking(selectedRoomForBooking.value);
  }
}

const emit = defineEmits(['room-selected']);

onMounted(load);
</script>

<template>
  <section class="summary-section">
    <div class="container">
      <div class="summary-details text-uppercase">
        <div class="detail-item">
          <svg
            class="detail-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Jan 15 - Jan 18, 2024</span>
        </div>
        <div class="detail-item flex-end">
          <span> 1 Night</span>
          <span>|</span>
          <svg
            class="detail-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>2 Guests</span>
        </div>
      </div>
    </div>
  </section>
  <section class="rooms-section">
    <div class="container">
      <div class="rooms-toolbar" aria-label="Rooms sorting toolbar">
        <label for="sortBy" class="sort-label text-uppercase">Sort by</label>
        <select id="sortBy" v-model="sortBy" class="sort-select text-uppercase" aria-label="Sort rooms by">
          <option value="price">Price</option>
          <option value="capacity">Capacity</option>
        </select>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading available rooms...</p>
      </div>
      <div v-else-if="error" class="error-state">
        <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>{{ error }}</p>
      </div>
      <div v-else-if="sortedRooms.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <h3>No Rooms Available</h3>
        <p>Sorry, there are no rooms available for your selected dates and guest count.</p>
        <p class="suggestion">Try adjusting your search criteria or selecting different dates.</p>
        <router-link to="/" class="btn btn-primary text-uppercase">Modify Search</router-link>
      </div>
      <div v-else class="rooms-list">
        <RoomCard v-for="room in sortedRooms" :key="room.id || room.roomNumber" :room="room" @book="book" />
      </div>
      
      <LoginRegisterModal 
        v-model:show="showAuthModal"
        :onSuccess="onAuthSuccess"
      />
    </div>
  </section>
</template>

<style>
.text-uppercase {
  text-transform: uppercase;
}

/* Summary Card */
.summary-section {
  /* background: white; */
  padding: 1.5rem;
  /* border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); */
  margin-bottom: 2rem;
}

/* .summary-card h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
} */

.summary-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.detail-item.flex-end {
  justify-content: flex-end;
}

.detail-icon {
  width: 1.2rem;
  height: 1.2rem;
}

/* Rooms Section */
.rooms-section {
  margin-top: 2rem;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #333;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #f0f0f0;
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  font-size: 1rem;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 3rem 2rem;
  background: #fff3f3;
  border: 1px solid #e74c3c;
  border-radius: 0.5rem;
  color: #c0392b;
}

.error-icon {
  width: 3rem;
  height: 3rem;
  stroke: #e74c3c;
  margin: 0 auto 1rem;
}

.error-state p {
  font-size: 1rem;
  margin: 0;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  width: 5rem;
  height: 5rem;
  stroke: #ccc;
  margin: 0 auto 1.5rem;
}

.empty-state h3 {
  font-size: 1.75rem;
  color: #333;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.empty-state p {
  color: #666;
  font-size: 1rem;
  margin: 0.5rem 0;
  line-height: 1.6;
}

.empty-state .suggestion {
  color: #888;
  font-size: 0.95rem;
  font-style: italic;
  margin-bottom: 2rem;
}

.empty-state .btn {
  margin-top: 1rem;
}

/* Rooms List */
.rooms-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Rooms toolbar (sort by) */
.rooms-toolbar {
  margin-bottom: 1.25rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
}

.sort-label {
  color: #666;
  font-size: 0.95rem;
}

.sort-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border: none;
  /* border-radius: 0.5rem; */
  font-size: 0.95rem;
  background: #fff
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>')
    no-repeat right 0.5rem center;
  background-size: 1rem;
  color: #333;
}

.sort-select:focus {
  outline: none;
  border-color: #e8e3db;
}


/* Button Styles */
.btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.25rem;
  text-decoration: none;
}

.btn-primary {
  background: #000;
  color: white;
}

.btn-primary:hover {
  background: #333;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .container {
    padding: 1rem;
  }
}

@media (max-width: 968px) {
  .room-card {
    grid-template-columns: 1fr;
  }

  .room-image {
    height: 250px;
  }

  .room-image img {
    width: 100%;
    height: 250px;
  }

  .room-pricing {
    min-width: 100%;
    order: 3;
  }
}

@media (max-width: 768px) {
  .room-pricing {
    min-width: 100%;
  }

  .btn-book {
    width: 100%;
  }

  .rooms-toolbar {
    justify-content: stretch;
  }
}

@media (max-width: 480px) {
  .detail-item {
    justify-content: flex-start !important;
  }

  .summary-details {
    grid-template-columns: 1fr;
  }
}

/* Auth Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 1.5rem;
  width: 480px;
  max-width: 90vw;
  border-radius: 8px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
}

.modal h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.modal-body {
  margin: 1rem 0;
}

.modal-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #666;
  cursor: pointer;
}

.tab-btn.active {
  background: #000;
  color: #fff;
  border-color: #000;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
</style>
