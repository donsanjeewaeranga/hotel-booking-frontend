<!-- LoginRegisterModal.vue -->
<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <h3 v-if="modalMode === 'login'">Login</h3>
      <h3 v-else>Create an account</h3>
      
      <div class="modal-body">
        <div class="modal-tabs">
          <button 
            :class="['tab-btn', modalMode === 'login' ? 'active' : '']" 
            @click="modalMode = 'login'"
          >Login</button>
          <button 
            :class="['tab-btn', modalMode === 'register' ? 'active' : '']" 
            @click="modalMode = 'register'"
          >Register</button>
        </div>

        <!-- Login Form -->
        <div v-if="modalMode === 'login'" class="form-content">
          <div class="form-group">
            <label>Email</label>
            <input v-model="login.email" type="email" class="form-input" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="login.password" type="password" class="form-input" required />
          </div>
        </div>

        <!-- Register Form -->
        <div v-else class="form-content">
          <div class="form-row">
            <div class="form-group">
              <label>Title</label>
              <select v-model="reg.title" class="form-input">
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>First Name</label>
              <input v-model="reg.firstName" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input v-model="reg.lastName" class="form-input" required />
            </div>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="reg.email" type="email" class="form-input" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="reg.password" type="password" class="form-input" required />
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input v-model="reg.phoneNumber" type="tel" class="form-input" required />
          </div>
          <div class="form-group">
            <label>Address</label>
            <textarea v-model="reg.address" class="form-input" rows="2"></textarea>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn" @click="closeModal">Cancel</button>
        <button 
          v-if="modalMode === 'login'" 
          class="btn btn-primary" 
          @click="doLogin"
        >Login</button>
        <button 
          v-else 
          class="btn btn-primary" 
          @click="doRegister"
        >Register</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { store } from '../store.js';
import { Api } from '../services/api.js';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  onSuccess: {
    type: Function,
    default: () => {}
  }
});

const emit = defineEmits(['update:show']);

const modalMode = ref('login');
const login = reactive({ email: '', password: '' });
const reg = reactive({ 
  email: '', 
  password: '', 
  title: 'Mr',
  firstName: '', 
  lastName: '', 
  phoneNumber: '',
  address: ''
});

function closeModal() {
  emit('update:show', false);
}

async function doLogin() {
  if (!login.email || !login.password) return alert('Email and password required');
  try {
    const r = await Api.login({ email: login.email, password: login.password });
    store.setAuth({ token: r.token, user: r.user });
    closeModal();
    props.onSuccess?.();
  } catch (e) {
    alert(e.message || 'Login failed');
  }
}

async function doRegister() {
  if (!reg.email || !reg.password || !reg.firstName || !reg.lastName) {
    return alert('Please fill all required fields');
  }
  try {
    await Api.register({ 
      email: reg.email, 
      password: reg.password,
      title: reg.title,
      firstName: reg.firstName,
      lastName: reg.lastName,
      phoneNumber: reg.phoneNumber,
      address: reg.address
    }, true);
    
    // Auto-login after registration
    const r = await Api.login({ email: reg.email, password: reg.password });
    store.setAuth({ token: r.token, user: r.user });
    closeModal();
    props.onSuccess?.();
  } catch (e) {
    alert(e.message || 'Registration failed');
  }
}
</script>

<style scoped>
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

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
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
  min-width: 120px;
}

.btn-primary:hover {
  background: #333;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>