<script setup>
import { useRouter } from 'vue-router';
import { store } from '../store.js';

const router = useRouter();

function tryAgain() {
  // Clear booking or at least go back to search
  if (typeof store.clearBooking === 'function') {
    store.clearBooking();
  }
  router.push('/');
}
</script>

<template>
  <section class="confirmation-section">
    <div class="container">
      <div class="confirmation-content">
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 class="confirmation-title text-uppercase">Booking Unsuccessful</h1>
        <p class="confirmation-subtitle">We couldn't complete your reservation right now.</p>
        <p class="confirmation-subtitle">Please try searching again or choose a different room.</p>
        <div class="confirmation-actions">
          <button class="btn btn-primary text-uppercase" @click="tryAgain">Try Again</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.confirmation-section { padding: 2rem 0; margin-bottom: 2rem; min-height: calc(100vh - 200px); }
.confirmation-content { text-align: center; }
.error-icon { width: 80px; height: 80px; margin: 0 auto 2rem; background: #d9534f; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; }
.error-icon svg { width: 50px; height: 50px; }
.confirmation-title { font-size: 2rem; margin-bottom: 0.75rem; color: #333; }
.confirmation-subtitle { font-size: 1rem; color: #666; }
.confirmation-actions { margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; }
.btn { padding: 0.75rem 1.25rem; border: none; cursor: pointer; }
.btn-primary { background: #000; color: #fff; }
.text-uppercase { text-transform: uppercase; }
</style>
