<template>
  <div class="dashboard-page">
    <div class="container">
      <div class="dashboard-header">
        <h1 class="page-title text-uppercase">My Dashboard</h1>
      </div>

      <!-- Not logged in state -->
      <div v-if="!auth.token" class="auth-prompt">
        <div class="auth-card">
          <svg class="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <h2>Please Login</h2>
          <p>Sign in to view your bookings and reservations</p>
          <router-link to="/auth" class="btn btn-primary text-uppercase">Login / Register</router-link>
        </div>
      </div>

      <!-- Logged in state -->
      <div v-else class="dashboard-content">
        <!-- Tabs -->
        <div class="tabs">
          <button 
            :class="['tab-btn', { active: activeTab === 'upcoming' }]"
            @click="activeTab = 'upcoming'"
          >
            <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Upcoming Bookings
            <span v-if="upcomingReservations.length" class="badge">{{ upcomingReservations.length }}</span>
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'past' }]"
            @click="activeTab = 'past'"
          >
            <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Past Bookings
            <span v-if="pastReservations.length" class="badge">{{ pastReservations.length }}</span>
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'cancelled' }]"
            @click="activeTab = 'cancelled'"
          >
            <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            Cancelled
            <span v-if="cancelledReservations.length" class="badge">{{ cancelledReservations.length }}</span>
          </button>
        </div>

        <!-- Error message -->
        <div v-if="error" class="error-message">
          <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ error }}
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading your reservations...</p>
        </div>

        <!-- Reservations list -->
        <div v-else class="reservations-list">
          <!-- Upcoming tab -->
          <div v-if="activeTab === 'upcoming'">
            <div v-if="upcomingReservations.length === 0" class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <h3>No Upcoming Bookings</h3>
              <p>You don't have any upcoming reservations</p>
              <router-link to="/" class="btn btn-primary text-uppercase">Book Now</router-link>
            </div>
            <div v-else class="reservation-cards">
              <div v-for="r in upcomingReservations" :key="r.reservationId" class="reservation-card">
                <div class="reservation-header">
                  <div class="reservation-id">
                    <span class="label text-uppercase">Booking ID</span>
                    <span class="value">#{{ r.reservationId }}</span>
                  </div>
                  <span :class="['status-badge', getStatusClass(r.reservationStatus)]">
                    {{ getStatusString(r.reservationStatus).toUpperCase() }}
                  </span>
                </div>
                
                <div class="reservation-body">
                  <div class="room-info">
                    <div class="room-image">
                      <img :src="getReservationImage(r)" 
                           :alt="'Room ' + r.roomNumber" />
                    </div>
                    <div class="room-details">
                      <h3 class="room-name">Room {{ r.roomNumber }}</h3>
                      <p class="room-type text-uppercase">{{ r.roomType || 'Standard Room' }}</p>
                    </div>
                  </div>

                  <div class="booking-info">
                    <div class="info-row">
                      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <div class="info-text">
                        <span class="label">Check-in</span>
                        <span class="value">{{ formatDate(r.checkInDate) }}</span>
                      </div>
                    </div>
                    <div class="info-row">
                      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <div class="info-text">
                        <span class="label">Check-out</span>
                        <span class="value">{{ formatDate(r.checkOutDate) }}</span>
                      </div>
                    </div>
                    <div class="info-row">
                      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <div class="info-text">
                        <span class="label">Duration</span>
                        <span class="value">{{ calculateNights(r.checkInDate, r.checkOutDate) }} night(s)</span>
                      </div>
                    </div>
                    <div class="info-row">
                      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <div class="info-text">
                        <span class="label">Duration</span>
                        <span class="value">{{ r.numberOfDays || calculateNights(r.checkInDate, r.checkOutDate) }} night(s)</span>
                      </div>
                    </div>
                    <div class="info-row" v-if="r.grandTotal">
                      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      <div class="info-text">
                        <span class="label">Total Amount</span>
                        <span class="value">${{ r.grandTotal }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="reservation-actions">
                  <button 
                    v-if="canCancel(r)" 
                    class="btn btn-cancel text-uppercase" 
                    @click="confirmCancel(r)"
                    :disabled="cancelling === r.reservationId"
                  >
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    {{ cancelling === r.reservationId ? 'Cancelling...' : 'Cancel Reservation' }}
                  </button>
                  <button class="btn btn-secondary text-uppercase">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Past tab -->
          <div v-if="activeTab === 'past'">
            <div v-if="pastReservations.length === 0" class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <h3>No Past Bookings</h3>
              <p>You don't have any past reservations</p>
            </div>
            <div v-else class="reservation-cards">
              <div v-for="r in pastReservations" :key="r.reservationId" class="reservation-card past">
                <div class="reservation-header">
                  <div class="reservation-id">
                    <span class="label text-uppercase">Booking ID</span>
                    <span class="value">#{{ r.reservationId }}</span>
                  </div>
                  <span :class="['status-badge', getStatusClass(r.reservationStatus)]">
                    {{ getStatusString(r.reservationStatus).toUpperCase() }}
                  </span>
                </div>
                
                <div class="reservation-body">
                  <div class="room-info">
                    <div class="room-image">
                      <img :src="getReservationImage(r)" 
                           :alt="'Room ' + r.roomNumber" />
                    </div>
                    <div class="room-details">
                      <h3 class="room-name">Room {{ r.roomNumber }}</h3>
                      <p class="room-type text-uppercase">{{ r.roomType || 'Standard Room' }}</p>
                    </div>
                  </div>

                  <div class="booking-info">
                    <div class="info-row">
                      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <div class="info-text">
                        <span class="label">Check-in</span>
                        <span class="value">{{ formatDate(r.checkInDate) }}</span>
                      </div>
                    </div>
                    <div class="info-row">
                      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <div class="info-text">
                        <span class="label">Check-out</span>
                        <span class="value">{{ formatDate(r.checkOutDate) }}</span>
                      </div>
                    </div>
                    <div class="info-row">
                      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <div class="info-text">
                        <span class="label">Duration</span>
                        <span class="value">{{ calculateNights(r.checkInDate, r.checkOutDate) }} night(s)</span>
                      </div>
                    </div>
                    <div class="info-row" v-if="r.totalAmount">
                      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      <div class="info-text">
                        <span class="label">Total Amount</span>
                        <span class="value">${{ r.totalAmount }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="reservation-actions">
                  <button class="btn btn-secondary text-uppercase">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Cancelled tab -->
          <div v-if="activeTab === 'cancelled'">
            <div v-if="cancelledReservations.length === 0" class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <h3>No Cancelled Bookings</h3>
              <p>You don't have any cancelled reservations</p>
            </div>
            <div v-else class="reservation-cards">
              <div v-for="r in cancelledReservations" :key="r.reservationId" class="reservation-card cancelled">
                <div class="reservation-header">
                  <div class="reservation-id">
                    <span class="label text-uppercase">Booking ID</span>
                    <span class="value">#{{ r.reservationId }}</span>
                  </div>
                  <span :class="['status-badge', getStatusClass(r.reservationStatus)]">
                    {{ getStatusString(r.reservationStatus).toUpperCase() }}
                  </span>
                </div>
                
                <div class="reservation-body">
                  <div class="room-info">
                    <div class="room-image">
                      <img :src="getReservationImage(r)" 
                           :alt="'Room ' + r.roomNumber" />
                    </div>
                    <div class="room-details">
                      <h3 class="room-name">Room {{ r.roomNumber }}</h3>
                      <p class="room-type text-uppercase">{{ r.roomType || 'Standard Room' }}</p>
                    </div>
                  </div>

                  <div class="booking-info">
                    <div class="info-row">
                      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <div class="info-text">
                        <span class="label">Check-in</span>
                        <span class="value">{{ formatDate(r.checkInDate) }}</span>
                      </div>
                    </div>
                    <div class="info-row">
                      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <div class="info-text">
                        <span class="label">Check-out</span>
                        <span class="value">{{ formatDate(r.checkOutDate) }}</span>
                      </div>
                    </div>
                    <div class="info-row">
                      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <div class="info-text">
                        <span class="label">Duration</span>
                        <span class="value">{{ calculateNights(r.checkInDate, r.checkOutDate) }} night(s)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Modal -->
    <div v-if="showCancelModal" class="modal-overlay" @click="showCancelModal = false">
      <div class="cancel-modal" @click.stop>
        <div class="modal-header">
          <svg class="modal-icon warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h3>Cancel Reservation?</h3>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to cancel this reservation?</p>
          <div class="cancel-details">
            <strong>Booking ID: #{{ reservationToCancel?.reservationId }}</strong>
            <p>Check-in: {{ formatDate(reservationToCancel?.checkInDate) }}</p>
            <p>Check-out: {{ formatDate(reservationToCancel?.checkOutDate) }}</p>
          </div>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary text-uppercase" @click="showCancelModal = false">
            Keep Reservation
          </button>
          <button class="btn btn-cancel text-uppercase" @click="cancelReservation">
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { store } from '../store.js';
import { Api, getImageUrl } from '../services/api.js';

const auth = store.state.auth;
const reservations = ref([]);
const loading = ref(false);
const error = ref('');
const activeTab = ref('upcoming');
const showCancelModal = ref(false);
const reservationToCancel = ref(null);
const cancelling = ref(null);

// Helper function to get room image URL
function getReservationImage(reservation) {
  const imgUrl = reservation.imageUrl || reservation.roomType?.imageUrl;
  return getImageUrl(imgUrl) || `https://picsum.photos/200/150?random=${reservation.reservationId}`;
}

// Helper function to safely get status as lowercase string
function getStatusString(reservationStatus) {
  if (reservationStatus === null || reservationStatus === undefined) return 'confirmed';
  if (typeof reservationStatus === 'string') return reservationStatus.toLowerCase();
  if (typeof reservationStatus === 'number') {
    // Map enum values to status strings
    const statusMap = {
      0: 'confirmed',
      1: 'cancelled',
      2: 'checkedin',
      3: 'checkedout'
    };
    return statusMap[reservationStatus] !== undefined ? statusMap[reservationStatus] : 'confirmed';
  }
  return String(reservationStatus).toLowerCase();
}

// Computed properties to filter reservations by status and date
const upcomingReservations = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return reservations.value.filter(r => {
    const checkInDate = new Date(r.checkInDate);
    checkInDate.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
    const status = getStatusString(r.reservationStatus);
    return status === 'confirmed' && checkInDate >= today;
  }).sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate));
});

const pastReservations = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return reservations.value.filter(r => {
    const checkOutDate = new Date(r.checkOutDate);
    const status = getStatusString(r.reservationStatus);
    return (status === 'checkedin' || status === 'checkedout') && checkOutDate < today;
  }).sort((a, b) => new Date(b.checkOutDate) - new Date(a.checkOutDate));
});

const cancelledReservations = computed(() => {
  return reservations.value.filter(r => {
    const status = getStatusString(r.reservationStatus);
    return status === 'cancelled' || status === 'canceled';
  }).sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));
});

function canCancel(r) {
  const status = getStatusString(r.reservationStatus);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkInDate = new Date(r.checkInDate);
  
  // Can cancel if status is confirmed and check-in is in the future
  return status === 'confirmed' && checkInDate >= today;
}

function getStatusClass(status) {
  const s = getStatusString(status);
  switch(s) {
    case 'confirmed': return 'confirmed';
    case 'cancelled':
    case 'canceled': return 'cancelled';
    case 'checkedin': return 'confirmed';
    case 'checkedout': return 'completed';
    default: return 'default';
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function confirmCancel(reservation) {
  reservationToCancel.value = reservation;
  showCancelModal.value = true;
}

async function cancelReservation() {
  if (!reservationToCancel.value) return;
  
  cancelling.value = reservationToCancel.value.reservationId;
  try {
    await Api.cancelReservation(reservationToCancel.value.reservationId);
    showCancelModal.value = false;
    reservationToCancel.value = null;
    // Reload reservations
    await load();
  } catch (e) {
    error.value = `Failed to cancel reservation: ${e.message}`;
  } finally {
    cancelling.value = null;
  }
}

async function load() {
  if (!auth.token || !auth.user) return;
  loading.value = true;
  error.value = '';
  try {
    let guest = store.state.auth.guest;
    if (!guest) {
      guest = await Api.getGuestByUser(auth.user.userId);
      store.setAuth({ guest });
    }
    const list = await Api.getReservationsByGuest(guest.guestId);
    reservations.value = list || [];
  } catch (e) {
    error.value = e.message;
    reservations.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<style scoped>
.text-uppercase {
  text-transform: uppercase;
}

.dashboard-page {
  min-height: calc(100vh - 80px);
  background: #f8f8f8;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.dashboard-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  color: #333;
  font-weight: bold;
  margin: 0;
}

/* Auth Prompt */
.auth-prompt {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.auth-card {
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 400px;
}

.auth-icon {
  width: 4rem;
  height: 4rem;
  stroke: #666;
  margin-bottom: 1.5rem;
}

.auth-card h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.auth-card p {
  color: #666;
  margin-bottom: 2rem;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
  background: white;
  padding: 0 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  position: relative;
}

.tab-btn:hover {
  color: #333;
  background: #f8f8f8;
}

.tab-btn.active {
  color: #000;
  border-bottom-color: #000;
  background: #fafafa;
}

.tab-icon {
  width: 1.2rem;
  height: 1.2rem;
}

.badge {
  background: #000;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: bold;
  min-width: 1.5rem;
  text-align: center;
}

.tab-btn.active .badge {
  background: #333;
}

/* Error Message */
.error-message {
  background: #fff3f3;
  border-left: 4px solid #e74c3c;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #c0392b;
}

.error-icon {
  width: 1.5rem;
  height: 1.5rem;
  stroke: #e74c3c;
  flex-shrink: 0;
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

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  stroke: #ccc;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 2rem;
}

/* Reservation Cards */
.reservation-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.reservation-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.reservation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.reservation-card.past {
  opacity: 0.85;
}

.reservation-card.cancelled {
  opacity: 0.7;
  border: 1px solid #e0e0e0;
}

/* Reservation Header */
.reservation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f8f5f0;
  border-bottom: 1px solid #e0e0e0;
}

.reservation-id {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.reservation-id .label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
}

.reservation-id .value {
  font-size: 1.25rem;
  color: #333;
  font-weight: bold;
}

/* Status Badge */
.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.confirmed {
  background: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.cancelled {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.completed {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.default {
  background: #e0e0e0;
  color: #666;
}

/* Reservation Body */
.reservation-body {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

/* Room Info */
.room-info {
  display: flex;
  gap: 1rem;
}

.room-image {
  width: 120px;
  height: 90px;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.room-name {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.room-type {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

/* Booking Info */
.booking-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.info-icon {
  width: 1.2rem;
  height: 1.2rem;
  stroke: #666;
  flex-shrink: 0;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-text .label {
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  font-weight: 500;
}

.info-text .value {
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
}

/* Reservation Actions */
.reservation-actions {
  padding: 1rem 1.5rem;
  background: #fafafa;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Buttons */
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
}

.btn-primary {
  background: #000;
  color: white;
}

.btn-primary:hover {
  background: #333;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-cancel {
  background: #e74c3c;
  color: white;
}

.btn-cancel:hover {
  background: #c0392b;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

/* Cancel Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.cancel-modal {
  background: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 2rem 2rem 1rem;
  text-align: center;
}

.modal-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  stroke: #e74c3c;
}

.modal-header h3 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.modal-body {
  padding: 0 2rem 2rem;
}

.modal-body p {
  color: #666;
  margin-bottom: 1.5rem;
  text-align: center;
}

.cancel-details {
  background: #f8f8f8;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.cancel-details strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.cancel-details p {
  margin: 0.25rem 0;
  text-align: left;
  font-size: 0.9rem;
}

.warning-text {
  color: #e74c3c !important;
  font-weight: 500;
  font-size: 0.9rem !important;
}

.modal-actions {
  padding: 1.5rem 2rem;
  background: #fafafa;
  display: flex;
  gap: 1rem;
  justify-content: center;
  border-top: 1px solid #e0e0e0;
}

/* Responsive Design */
@media (max-width: 968px) {
  .reservation-body {
    grid-template-columns: 1fr;
  }

  .tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tab-btn {
    white-space: nowrap;
  }
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 1rem 0;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .reservation-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .room-info {
    flex-direction: column;
  }

  .room-image {
    width: 100%;
    height: 200px;
  }

  .reservation-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>

