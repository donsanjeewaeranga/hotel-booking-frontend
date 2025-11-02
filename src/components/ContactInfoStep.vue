<template>
  <section class="booking-section">
    <div class="container booking-container">
      <div class="form-section">
        <form class="contact-form" @submit.prevent="continueBooking">
          <h2 class="form-title text-uppercase">Contact Information</h2>
          
          <div class="form-group">
            <label for="title" class="form-label">Title</label>
            <select id="title" v-model="contact.title" class="form-input select-input" required>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
              <option value="Prof">Prof</option>
            </select>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                v-model="contact.firstName" 
                class="form-input" 
                placeholder="John" 
                required
              >
            </div>
            <div class="form-group">
              <label for="lastName" class="form-label">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                v-model="contact.lastName" 
                class="form-input" 
                placeholder="Doe" 
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              v-model="contact.email" 
              class="form-input" 
              placeholder="john.doe@example.com" 
              required
            >
          </div>

          <div class="form-group">
            <label for="phone" class="form-label">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Phone Number
            </label>
            <input 
              type="tel" 
              id="phone" 
              v-model="contact.phone" 
              class="form-input" 
              placeholder="+1 234 567 8900" 
              required
            >
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-back text-uppercase" @click="$emit('back')">
              Back to Rooms
            </button>
            <button type="submit" class="btn btn-primary text-uppercase" :disabled="!isValid">
              Proceed
            </button>
          </div>
          <!-- Login modal shown when user is not authenticated and tries to proceed -->
          <div v-if="showLoginModal" class="modal-overlay">
            <div class="modal">
              <h3 v-if="modalMode === 'login'">Login to continue</h3>
              <h3 v-else>Register an account</h3>
              <div class="modal-body">
                <div class="modal-tabs">
                  <button :class="['btn', modalMode === 'login' ? 'active' : '']" @click="modalMode = 'login'">Login</button>
                  <button :class="['btn', modalMode === 'register' ? 'active' : '']" @click="modalMode = 'register'">Register</button>
                </div>

                <div v-if="modalMode === 'login'">
                  <div class="form-group">
                    <label>Email</label>
                    <input v-model="login.email" type="email" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Password</label>
                    <input v-model="login.password" type="password" class="form-input" />
                  </div>
                </div>

                <div v-else>
                  <div class="form-row">
                    <div class="form-group">
                      <label>First name</label>
                      <input v-model="reg.firstName" class="form-input" />
                    </div>
                    <div class="form-group">
                      <label>Last name</label>
                      <input v-model="reg.lastName" class="form-input" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Email</label>
                    <input v-model="reg.email" type="email" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Password</label>
                    <input v-model="reg.password" type="password" class="form-input" />
                  </div>
                </div>

              </div>
              <div class="modal-actions">
                <button class="btn" @click="showLoginModal = false">Cancel</button>
                <button v-if="modalMode === 'login'" class="btn btn-primary" @click="doLoginInModal">Login</button>
                <button v-else class="btn btn-primary" @click="doRegisterInModal">Register</button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="booking-summary">
        <div class="summary-content">
          <div class="booking-details text-uppercase">
            <div class="detail-row">
              <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>{{ bookingSummary }}</span>
            </div>
            <div class="detail-row">
              <span>{{ store.state.booking.nights }} Night(s)</span>
              <span class="separator">|</span>
              <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>{{ store.state.booking.guests }} Guest(s)</span>
            </div>
          </div>

          <div v-if="selRoom" class="room-summary">
            <div class="room-image-wrapper">
              <img :src="selRoom.image || 'https://picsum.photos/400/300?random=101'" 
                   :alt="selRoom.name" 
                   class="summary-image">
            </div>
            <div class="room-title">
              <h3 class="text-uppercase">{{ selRoom.name || 'Standard Room' }}</h3>
            </div>
          </div>

          <div class="price-summary">
            <div class="price-row">
              <span>${{ selRoom?.price || '120' }} × {{ store.state.booking.nights }} night(s)</span>
              <span>${{ basePrice }}</span>
            </div>
            <div class="price-row">
              <span>Taxes & Service Charges(9%)</span>
              <span>${{ taxAmount }}</span>
            </div>
            <div class="price-row total text-uppercase">
              <span>Total</span>
              <span>${{ totalPrice }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from "vue";
import { store } from "../store.js";
import { Api } from "../services/api.js";

const selRoom = computed(() => store.state.booking.selectedRoom);
// Initialize contact from booking state; will be overwritten if user is logged in
const contact = reactive({ 
  title: store.state.booking.contact?.title || 'Mr',
  firstName: store.state.booking.contact?.firstName || '',
  lastName: store.state.booking.contact?.lastName || '',
  email: store.state.booking.contact?.email || '',
  phone: store.state.booking.contact?.phoneNumber || '' 
});

// Login/register modal state
const showLoginModal = ref(false);
const modalMode = ref('login'); // 'login' | 'register'
const login = reactive({ email: '', password: '' });
const reg = reactive({ firstName: '', lastName: '', email: '', password: '' });

const bookingSummary = computed(() => {
  const b = store.state.booking;
  return `${b.checkInDate} → ${b.checkOutDate}`;
});

const basePrice = computed(() => {
  const price = selRoom.value?.price || 120;
  const nights = store.state.booking.nights || 1;
  return price * nights;
});

const taxAmount = computed(() => {
  return Math.round(basePrice.value * 0.09);
});

const totalPrice = computed(() => {
  return basePrice.value + taxAmount.value;
});

// Helper function to check if a value is valid (not empty, not "string" placeholder)
const isValidValue = (val) => {
  return val && val !== '' && val !== 'string' && val !== '0';
};

// Fetch guest data and auto-fill form if user is logged in
onMounted(async () => {
  if (store.state.auth?.user) {
    const u = store.state.auth.user;
  console.log('Full user object:', JSON.stringify(u, null, 2));
  console.log('User ID:', u.userId);
    
    // First, check if we have a guest stored in auth state
    if (store.state.auth.guest) {
      const g = store.state.auth.guest;
      console.log('Using cached guest data from store:', JSON.stringify(g, null, 2));
      if (isValidValue(g.title)) contact.title = g.title;
      if (isValidValue(g.firstName)) contact.firstName = g.firstName;
      if (isValidValue(g.lastName)) contact.lastName = g.lastName;
      // Guest object may not contain email; prefer user email
      if (u.email) contact.email = u.email;
      if (isValidValue(g.phoneNumber)) contact.phone = g.phoneNumber;
      console.log('Form populated from stored guest data');
      return;
    }
    
    // Fetch guest data from API using userId
    if (u.userId) {
      try {
        console.log('Fetching guest data from API for userId:', u.userId);
        const guestData = await Api.getGuestByUser(u.userId);
        console.log('API Response - Guest data:', JSON.stringify(guestData, null, 2));
        
        if (guestData) {
          // Only use values that are not placeholders
          if (isValidValue(guestData.title)) contact.title = guestData.title;
          if (isValidValue(guestData.firstName)) contact.firstName = guestData.firstName;
          if (isValidValue(guestData.lastName)) contact.lastName = guestData.lastName;
          // Guest object doesn't include email; use user's email
          if (u.email) contact.email = u.email;
          if (isValidValue(guestData.phoneNumber)) contact.phone = guestData.phoneNumber;
          
          // Store guest data for future use
          store.setAuth({ guest: guestData });
          console.log('Form populated from API guest data:', { 
            title: contact.title, 
            firstName: contact.firstName, 
            lastName: contact.lastName, 
            phone: contact.phone,
            email: contact.email 
          });
          return;
        }
      } catch (e) {
        console.error('Failed to fetch guest data:', e);
        console.error('Error details:', e.message);
      }
    }
    
    // Fallback to email only
    contact.email = u.email || contact.email;
    console.log('No guest data available. Only email populated:', contact.email);
  }
});

const isValid = computed(() => {
  return contact.firstName && 
         contact.lastName && 
         contact.email &&
         contact.phone;
});

const emit = defineEmits(['back', 'contact-submitted']);

function proceedWithBooking() {
  store.setBooking({ 
    contact: { 
      title: contact.title,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phoneNumber: contact.phone
    },
    totalAmount: totalPrice.value
  });
  emit('contact-submitted', contact);
}

function continueBooking() {
  // If user not logged in, show login modal first
  if (!store.state.auth?.user) {
    showLoginModal.value = true;
    return;
  }

  if (!isValid.value) return alert("Please complete all required fields.");
  proceedWithBooking();
}

async function doLoginInModal() {
  if (!login.email || !login.password) return alert('Email and password required');
  try {
    const r = await Api.login({ email: login.email, password: login.password });
  console.log('Login response:', JSON.stringify(r, null, 2));
    store.setAuth({ token: r.token, user: r.user });
    
  const u = r.user;
  console.log('Logged in user ID:', u.userId);
    
    // Fetch guest data using userId
    if (u.userId) {
      try {
        console.log('Fetching guest data for userId:', u.userId);
        const guestData = await Api.getGuestByUser(u.userId);
        console.log('Guest data received:', JSON.stringify(guestData, null, 2));
        
        if (guestData) {
          // Only use values that are not placeholders
          if (isValidValue(guestData.title)) contact.title = guestData.title;
          if (isValidValue(guestData.firstName)) contact.firstName = guestData.firstName;
          if (isValidValue(guestData.lastName)) contact.lastName = guestData.lastName;
          // Guest object doesn't include email; use user's email
          if (u.email) contact.email = u.email;
          if (isValidValue(guestData.phoneNumber)) contact.phone = guestData.phoneNumber;
          
          store.setAuth({ guest: guestData });
          console.log('Form populated from guest data after login:', {
            title: contact.title,
            firstName: contact.firstName,
            lastName: contact.lastName,
            phone: contact.phone,
            email: contact.email
          });
        }
      } catch (e) {
        console.error('Failed to fetch guest data:', e.message);
        // Only email is available from user object
        contact.email = u.email || contact.email;
      }
    }
    
    // Ensure email is populated
    if (!contact.email) contact.email = u.email;
    
    showLoginModal.value = false;
    // automatically continue booking after successful login if form is valid
    if (!isValid.value) return alert("Please complete all required fields.");
    proceedWithBooking();
  } catch (e) {
    alert(e.message || 'Login failed');
  }
}

async function doRegisterInModal() {
  if (!reg.email || !reg.password || !reg.firstName || !reg.lastName) return alert('Please fill all registration fields');
  try {
    await Api.register({ email: reg.email, password: reg.password, firstName: reg.firstName, lastName: reg.lastName });
    // After successful register, attempt to login automatically
    const r = await Api.login({ email: reg.email, password: reg.password });
  console.log('Login after registration response:', JSON.stringify(r, null, 2));
    store.setAuth({ token: r.token, user: r.user });
    
  const u = r.user;
  console.log('User ID after registration:', u.userId);
    
    // Fetch guest data using userId
    if (u.userId) {
      try {
        console.log('Fetching guest data for userId:', u.userId);
        const guestData = await Api.getGuestByUser(u.userId);
        console.log('Guest data received:', JSON.stringify(guestData, null, 2));
        
        if (guestData) {
          // Only use values that are not placeholders
          if (isValidValue(guestData.title)) contact.title = guestData.title;
          if (isValidValue(guestData.firstName)) contact.firstName = guestData.firstName;
          if (isValidValue(guestData.lastName)) contact.lastName = guestData.lastName;
          // Guest object doesn't include email; use user's email
          if (u.email) contact.email = u.email;
          if (isValidValue(guestData.phoneNumber)) contact.phone = guestData.phoneNumber;
          
          store.setAuth({ guest: guestData });
          console.log('Form populated from guest data after registration');
        }
      } catch (e) {
        console.error('Failed to fetch guest data:', e.message);
      }
    }
    
    // Fallback: Use registration data if guest data is not valid
    if (!contact.firstName) contact.firstName = reg.firstName;
    if (!contact.lastName) contact.lastName = reg.lastName;
    if (!contact.email) contact.email = u.email || reg.email;
    
    console.log('Final form values after registration:', {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email
    });
    
    showLoginModal.value = false;
    // continue booking
    if (!isValid.value) return alert("Please complete all required fields.");
    proceedWithBooking();
  } catch (e) {
    alert(e.message || 'Registration failed');
  }
}
</script>

<style scoped>
.booking-section {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

/* Booking Container */
.booking-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 1.5rem;
}

/* Form Section */
.form-section {
  background: white;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #000;
}

.select-input {
  width: 9rem;
}

/* Booking Summary */
.booking-summary {
  background: #f8f5f0;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.booking-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.detail-icon {
  width: 1.2rem;
  height: 1.2rem;
  stroke: #666;
}

.separator {
  color: #ccc;
  margin: 0 0.5rem;
}

.room-image-wrapper {
  width: 100%;
}

.summary-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.room-title {
  margin-top: 0.5rem;
}

.room-title h3 {
  font-size: 1.2rem;
  margin: 0;
  color: #333;
}

.price-summary {
  border-top: 1px solid #e0e0e0;
  padding-top: 1.5rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: #666;
}

.price-row.total {
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
  margin-top: 1rem;
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}

/* Buttons */
.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-back {
  background: #f0f0f0;
  color: #333;
}

.btn-back:hover {
  background: #e0e0e0;
}

.btn-primary {
  background: #000;
  color: white;
  min-width: 200px;
}

.btn-primary:hover {
  background: #333;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Simple modal styles for inline login */
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
  padding: 1.25rem;
  width: 420px;
  border-radius: 8px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
}
.modal h3 { margin-top: 0; }
.modal-body { margin: 0.5rem 0 1rem; }
.modal-actions { display:flex; justify-content:flex-end; gap:0.5rem; }

@media (max-width: 968px) {
  .booking-container {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .booking-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .booking-section {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}
</style>