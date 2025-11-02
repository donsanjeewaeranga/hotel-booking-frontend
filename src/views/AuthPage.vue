<template>
  <div class="row">
    <div class="col">
      <div class="card">
        <h3>Login</h3>
        <div class="row">
          <div class="col">
            <label>Email</label>
            <input v-model="login.email" />
          </div>
          <div class="col">
            <label>Password</label>
            <input type="password" v-model="login.password" />
          </div>
        </div>
        <div class="actions" style="margin-top:12px">
          <button @click="doLogin">Login</button>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card">
        <h3>Register</h3>
        <div class="row">
          <div class="col">
            <label>First name</label>
            <input v-model="reg.firstName" />
          </div>
          <div class="col">
            <label>Last name</label>
            <input v-model="reg.lastName" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label>Email</label>
            <input v-model="reg.email" />
          </div>
          <div class="col">
            <label>Password</label>
            <input type="password" v-model="reg.password" />
          </div>
        </div>
        <div class="actions" style="margin-top:12px">
          <button @click="doRegister">Register</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { Api } from '../services/api.js';
import { store } from '../store.js';

const login = reactive({ email: '', password: '' });
const reg = reactive({ firstName: '', lastName: '', email: '', password: '' });

async function doLogin() {
  if (!login.email || !login.password) return alert('Email and password required');
  try {
    const r = await Api.login({ email: login.email, password: login.password });
    store.setAuth({ token: r.token, user: r.user });
    alert('Logged in');
  } catch (e) {
    alert(e.message);
  }
}

async function doRegister() {
  if (!reg.email || !reg.password || !reg.firstName || !reg.lastName) return alert('Fill all fields');
  try {
    const u = await Api.register({ email: reg.email, password: reg.password, firstName: reg.firstName, lastName: reg.lastName });
    alert('Registered. You can now log in.');
  } catch (e) {
    alert(e.message);
  }
}
</script>

