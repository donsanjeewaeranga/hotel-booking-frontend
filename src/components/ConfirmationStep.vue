<script setup>
import { computed } from "vue";
import { useRouter } from 'vue-router';
import { store } from "../store.js";
import { getImageUrl } from "../services/api.js";

const router = useRouter();

const booking = computed(() => store.state?.booking || {});
const selectedRoom = computed(() => booking.value?.selectedRoom || { 
  name: 'Standard Room',
  price: 120
});

const roomImage = computed(() => {
  const imgUrl = selectedRoom.value?.imageUrl || selectedRoom.value?.image;
  return getImageUrl(imgUrl) || 'https://picsum.photos/140/80?random=101';
});

const contact = computed(() => {
  const bookingContact = store.state?.booking?.contact;
  return {
    title: bookingContact?.title || 'Mr',
    firstName: bookingContact?.firstName || '',
    lastName: bookingContact?.lastName || '',
    email: bookingContact?.email || '',
    phone: bookingContact?.phoneNumber || ''
  };
});

const bookingNumber = computed(() => {
  const id = store.state?.booking?.reservation?.reservationId;
  if (id) return `RES${String(id).padStart(6, '0')}`;
  // fallback random
  return "RES" + Math.random().toString(36).substr(2, 9).toUpperCase();
});

const basePrice = computed(() => {
  const price = selectedRoom.value?.price || 120;
  return price * (booking.value?.nights || 1);
});

const taxAmount = computed(() => {
  return Math.round(basePrice.value * 0.09);
});

const totalAmount = computed(() => {
  return basePrice.value + taxAmount.value;
});

const bookingDates = computed(() => ({
  checkIn: booking.value?.checkInDate || 'TBD',
  checkOut: booking.value?.checkOutDate || 'TBD',
  nights: booking.value?.nights || 1,
  guests: booking.value?.guests || 1
}));

const cancellationDate = computed(() => {
  const checkIn = new Date(booking.value?.checkInDate || new Date());
  const cancelDate = new Date(checkIn);
  cancelDate.setDate(cancelDate.getDate() - 5); // 5 days before check-in
  return cancelDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
});

function bookAnother() {
  // Clear booking state and go back to the search page
  if (typeof store.clearBooking === 'function') {
    store.clearBooking();
  } else if (typeof store.resetBooking === 'function') {
    // fallback if older API exists
    store.resetBooking();
  }
  router.push('/');
}

function printConfirmation() {
  window.print();
}

function goToDashboard() {
  router.push('/dashboard');
}
</script>

<template>
  <section class="confirmation-section">
    <div class="container">
      <div class="confirmation-content">
        <div class="success-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>

        <h1 class="confirmation-title text-uppercase">
          Your booking has been confirmed!
        </h1>
          <p v-if="contact.email" class="confirmation-subtitle">
          We have sent your booking confirmation to your email address
            {{ contact.email }}.
        </p>
          <p v-else class="confirmation-subtitle">
            Your booking has been confirmed.
          </p>
        <p class="confirmation-subtitle">
          Checkin-in/Check-out:
          <span class="text-uppercase text-bold"
            >{{ bookingDates.checkIn }} -
            {{ bookingDates.checkOut }}</span
          >
        </p>
        <p class="confirmation-subtitle">
          Booking Confirmation Number
          <span class="text-uppercase text-bold">{{ bookingNumber }}</span>
        </p>
        <p class="confirmation-subtitle">
          Total Price for {{ bookingDates.nights }} Night(s):
          <span class="text-uppercase text-bold"
            >S${{ totalAmount }}</span>
        </p>

        <div class="confirmation-booking-summary">
          <div class="booking-summary-columns">
            <div class="booking-left-column">
              <div class="room-image-info-wrapper">
                <div class="room-image-wrapper">
                  <img
                    :src="roomImage"
                    :alt="selectedRoom.name || 'Deluxe Room'"
                    class="summary-image"
                  />
                </div>
                <div class="room-info">
                  <p class="room-label text-uppercase">
                    Room:
                    <span class="text-bold">{{ selectedRoom.name || 'Standard Room' }}</span>
                  </p>
                  <p class="guest-count">
                    {{ bookingDates.guests || 1 }} Guest(s)
                  </p>
                </div>
              </div>
              <div class="package-section">
                <h4 class="package-title text-uppercase">Package:</h4>
                <div class="package-items">
                  <div class="package-row">
                    <span
                      >Room (S${{ selectedRoom.price || 120 }} ×
                        {{ bookingDates.nights }} nights)</span
                    >
                    <span class="package-price">S${{ basePrice }}</span>
                  </div>
                  <div class="package-row">
                    <span>Tax & Service Charges (9%)</span>
                    <span class="package-price">S${{ taxAmount }}</span>
                  </div>
                  <div class="package-row total-price text-uppercase">
                    <span>Total Price</span>
                    <span class="package-price">S${{ totalAmount }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="booking-right-column">
              <div class="guest-details-section">
                <h3 class="guest-details-title text-uppercase">
                  Guest Details
                </h3>
                <div class="guest-info-list">
              <p><strong>Title:</strong> {{ contact.title }}</p>
              <p><strong>Name:</strong> {{ contact.firstName }} {{ contact.lastName }}</p>
              <p><strong>Email:</strong> {{ contact.email || '--' }}</p>
              <p><strong>Phone:</strong> {{ contact.phone || '--' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="confirmation-actions">
          <button
            class="btn btn-primary text-uppercase"
            @click="goToDashboard"
          >
            Manage Bookings
          </button>
          <button
            class="btn btn-secondary text-uppercase"
            @click="bookAnother"
          >
            Book Another Room
          </button>
          <button
            class="btn btn-secondary text-uppercase"
            @click="printConfirmation"
          >
            Print Confirmation
          </button>
        </div>

        <div class="additional-info">
          <h3 class="text-uppercase">Important Information</h3>
          <ul>
            <li>Please arrive at the hotel between 2:00 PM - 11:00 PM</li>
            <li>Check-out time is 11:00 AM</li>
            <li>Free cancellation before {{ cancellationDate }}</li>
          <li v-if="contact.email">Your booking confirmation has been sent to {{ contact.email }}</li>
          <li v-else>Please check your booking details carefully</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
/* Confirmation Section */
.confirmation-section {
  padding: 2rem 0;
  margin-bottom: 2rem;
  min-height: calc(100vh - 200px);
}

.confirmation-content {
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  background: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.success-icon svg {
  width: 50px;
  height: 50px;
}

.confirmation-title {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  color: #333;
}

.confirmation-subtitle {
  font-size: 1rem;
  color: #666;
}

/* Confirmation Booking Summary */
.confirmation-booking-summary {
  background: #f8f5f0;
  padding: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  text-align: left;
}

.booking-summary-columns {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

/* Left Column */
.booking-left-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.room-image-info-wrapper {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.room-image-wrapper {
  flex-shrink: 0;
}

.summary-image {
  width: 140px;
  height: 80px;
  object-fit: cover;
}

.room-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.room-label {
  font-size: 1rem;
  color: #333;
  margin: 0;
  font-weight: 500;
}

.guest-count {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
}

.package-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.package-title {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.package-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.package-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  color: #666;
}

.package-price {
  font-weight: 500;
  color: #333;
}

.package-row.total-price {
  border-top: 1px solid #e0e0e0;
  padding-top: 0.75rem;
  margin-top: 0.25rem;
  font-weight: bold;
  font-size: 1rem;
  color: #333;
}

.package-row.total-price .package-price {
  font-weight: bold;
  font-size: 1.1rem;
}

/* Right Column */
.booking-right-column {
  display: flex;
  align-items: flex-start;
}

.guest-details-section {
  width: 100%;
  height: 100%;
  background: #e8e3db;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.guest-details-title {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.guest-info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.guest-info-list p {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
}

.guest-info-list p strong {
  color: #333;
  font-weight: 500;
}

.payment-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: #666;
}

.payment-row.total {
  border-top: 2px solid #e0e0e0;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}

/* Actions */
.confirmation-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
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

.btn-secondary {
  background: white;
  color: #000;
  border: 2px solid #000;
}

.btn-secondary:hover {
  background: #f0f0f0;
  border-color: #333;
}

/* Additional Info */
.additional-info {
  text-align: left;
  background: #f8f9fa;
  padding: 2rem;
  margin-top: 2rem;
}

.additional-info h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #333;
}

.additional-info ul {
  list-style-position: inside;
  color: #666;
}

.additional-info li {
  margin-bottom: 0.5rem;
}
@media (max-width: 768px) {
  .btn {
    width: 100%;
  }

  .booking-summary-columns {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .room-image-info-wrapper {
    flex-direction: column;
  }

  .summary-image {
    width: 100%;
    max-width: 140px;
    height: auto;
    aspect-ratio: 140/80;
  }
}

@media (max-width: 480px) {
  .confirmation-title {
    font-size: 1.5rem;
  }

  .success-icon {
    width: 60px;
    height: 60px;
  }

  .success-icon svg {
    width: 40px;
    height: 40px;
  }
}
</style>
