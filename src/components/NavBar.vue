<script setup>
import { ref, computed } from 'vue';
import { store } from '../store.js';
import LoginRegisterModal from './LoginRegisterModal.vue';
import SearchHeroImageWebp from "@/assets/images/SearchHeroImageWebp.webp";
import SearchHeroImageJpg from "@/assets/images/SearchHeroImageJpg.jpg";

const showAuthModal = ref(false);
const isLoggedIn = computed(() => !!store.state.auth?.user);

function logout() {
  store.logout();
}
</script>

<template>
  <header class="header">
    <h1 class="logo">Hotel Booking</h1>
    <button class="menu-toggle" aria-label="Toggle menu" id="menuToggle">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <nav class="nav" id="navMenu">
      <router-link class="nav-link" to="/">Search</router-link>
      <template v-if="isLoggedIn">
        <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
        <button class="nav-link" @click="logout">Logout</button>
      </template>
      <button v-else class="nav-link" @click="showAuthModal = true">Login/Register</button>
    </nav>
  </header>

  <LoginRegisterModal 
    v-model:show="showAuthModal"
  />

  <section class="hero-section">
    <div class="container">
      <picture>
        <source :srcset="SearchHeroImageWebp" type="image/webp" />
        <img
          :src="SearchHeroImageJpg"
          alt="Beautiful Hotel"
          class="hero-image"
          width="1200"
          height="400"
        />
      </picture>
    </div>
  </section>
</template>
