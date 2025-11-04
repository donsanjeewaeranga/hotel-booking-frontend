<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { store } from "../store.js";

const router = useRouter();

// Helper function to get date in YYYY-MM-DD format
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Only use stored dates if there's an active booking in progress (no reservation completed)
// If reservation exists or selectedRoom is null, start with empty dates
const hasActiveBooking = store.state.booking.selectedRoom && !store.state.booking.reservation;

const guests = ref(store.state.booking.guests || 1);
const checkInDate = ref(hasActiveBooking ? store.state.booking.checkInDate : '');
const checkOutDate = ref(hasActiveBooking ? store.state.booking.checkOutDate : '');

// Today's date for min attribute on date pickers
const today = formatDate(new Date());

// When check-in date changes, automatically set checkout to checkIn + 1 day
watch(checkInDate, (newCheckIn) => {
  if (newCheckIn) {
    const checkInDateObj = new Date(newCheckIn);
    const nextDay = new Date(checkInDateObj);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Only update checkout if it's not set or if it's before/equal to the new check-in
    const currentCheckOut = checkOutDate.value ? new Date(checkOutDate.value) : null;
    if (!currentCheckOut || currentCheckOut <= checkInDateObj) {
      checkOutDate.value = formatDate(nextDay);
    }
  }
});

watch([guests, checkInDate, checkOutDate], () => {
  // Only update store if dates are actually selected
  if (checkInDate.value && checkOutDate.value) {
    const nights = nightsBetween(checkInDate.value, checkOutDate.value);
    store.setBooking({
      guests: guests.value,
      checkInDate: checkInDate.value,
      checkOutDate: checkOutDate.value,
      nights,
    });
  }
});

function nightsBetween(a, b) {
  if (!a || !b) return 0;
  const ms = new Date(b) - new Date(a);
  return ms > 0 ? Math.ceil(ms / (1000 * 60 * 60 * 24)) : 0;
}

function goRooms() {
  if (!checkInDate.value || !checkOutDate.value)
    return alert("Please select check-in and check-out dates.");
  if (new Date(checkOutDate.value) <= new Date(checkInDate.value))
    return alert("Check-out must be after check-in.");
  router.push("/booking");
}
</script>

<template>
  <section id="search">
  <div class="container">
      <div class="search-section">
        <h2 class="search-title">BOOK A ROOM</h2>
        <form id="searchForm" @submit.prevent="goRooms">
          <div class="search-form">
            <div class="form-group">
              <label for="guests" class="form-label">
                <svg
                  class="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path
                    d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                  />
                </svg>
                Guests
              </label>
              <select id="guests" class="form-input" v-model.number="guests">
                <option :value="1">1 Guest</option>
                <option :value="2">2 Guests</option>
                <option :value="3">3 Guests</option>
                <option :value="4">4 Guests</option>
                <option :value="5">5+ Guests</option>
              </select>
            </div>

            <div class="form-group">
              <label for="checkin" class="form-label">
                <svg
                  class="icon"
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
                Check In
              </label>
              <input type="date" id="checkin" class="form-input" v-model="checkInDate" :min="today" required />
            </div>

            <div class="form-group">
              <label for="checkout" class="form-label">
                <svg
                  class="icon"
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
                Check Out
              </label>
              <input type="date" id="checkout" class="form-input" v-model="checkOutDate" :min="checkInDate || today" required />
            </div>
          </div>

          <div class="search-form-button">
            <button type="submit" class="btn btn-primary">
              SEARCH FOR ROOMS
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>

  <section class="features">
    <div class="container">
      <h3 class="features-title">Why Choose Us</h3>
      <div class="features-grid">
        <div class="feature-card">
          <svg
            class="feature-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
          <h4>Best Price</h4>
          <p>We guarantee the best rates for your stay</p>
        </div>
        <div class="feature-card">
          <svg
            class="feature-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="4" y="6" width="16" height="10" rx="1" />
            <line x1="4" y1="10" x2="20" y2="10" />
            <circle cx="9" cy="14" r="1" />
            <circle cx="15" cy="14" r="1" />
          </svg>
          <h4>Secure Booking</h4>
          <p>Your information is safe and secure</p>
        </div>
        <div class="feature-card">
          <svg
            class="feature-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h4>Instant Confirmation</h4>
          <p>Get confirmed bookings instantly</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
/* Search Section */
.search-section {
    padding: 0rem 2rem;
    margin-bottom: 3rem;
}

.search-title {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
    color: #333;
}

.search-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    color: #555;
    font-size: 0.9rem;
}

.icon {
    width: 1.2rem;
    height: 1.2rem;
    stroke: #333;
}

.form-input,
select.form-input {
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.form-input:focus,
select.form-input:focus {
    outline: none;
    border-color: #000;
}

.btn {
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    grid-column: 1 / -1;
    text-transform: uppercase;
}

.btn-primary {
    background: #000;
    color: white;
}

.btn-primary:hover {
    background: #333;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.btn-primary:active {
    transform: translateY(0);
}

.search-form-button {
    text-align: center;
    padding-top: 2rem;
}

/* Features Section */
.features {
    margin: 4rem 0;
    padding-bottom: 40px
}

.features-title {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 2rem;
    color: #333;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-icon {
    width: 3rem;
    height: 3rem;
    stroke: #333;
    margin-bottom: 1rem;
}

.feature-card h4 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #333;
}

.feature-card p {
    color: #666;
    font-size: 0.95rem;
}

@media (max-width: 768px) {
    .search-section {
        padding: 0rem 1rem;
    }

    .search-form {
        grid-template-columns: 1fr;
    }

    .search-title {
        font-size: 1.5rem;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .search-title {
        font-size: 1.3rem;
    }

    .features-title {
        font-size: 1.4rem;
    }
}
</style>
