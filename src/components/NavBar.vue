<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { store } from "../store.js";
import LoginRegisterModal from "./LoginRegisterModal.vue";

const showAuthModal = ref(false);
const isLoggedIn = computed(() => !!store.state.auth?.user);

// Mobile menu state and behavior
const isMenuOpen = ref(false);
const navMenuRef = ref(null);
const menuToggleRef = ref(null);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
}

function onDocumentClick(event) {
  if (!isMenuOpen.value) return;
  const menuEl = navMenuRef.value;
  const toggleEl = menuToggleRef.value;
  if (!menuEl || !toggleEl) return;
  const target = event.target;
  const clickedInsideMenu = menuEl.contains(target);
  const clickedToggle = toggleEl.contains(target);
  if (!clickedInsideMenu && !clickedToggle) {
    closeMenu();
  }
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
});

function logout() {
  store.logout();
}
</script>

<template>
  <header class="header">
    <h1 class="logo">Hotel Booking</h1>
    <button
      class="menu-toggle"
      aria-label="Toggle menu"
      id="menuToggle"
      :class="{ active: isMenuOpen }"
      :aria-expanded="isMenuOpen.toString()"
      aria-controls="navMenu"
      @click="toggleMenu"
      ref="menuToggleRef"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
    <nav
      class="nav"
      id="navMenu"
      :class="{ active: isMenuOpen }"
      ref="navMenuRef"
    >
      <router-link class="nav-link" to="/" @click="closeMenu"
        >Search</router-link
      >
      <template v-if="isLoggedIn">
        <router-link class="nav-link" to="/dashboard" @click="closeMenu"
          >Dashboard</router-link
        >
        <button
          class="nav-link logout"
          @click="
            () => {
              logout();
              closeMenu();
            }
          "
        >
          Logout
        </button>
      </template>
      <button
        v-else
        class="nav-link login"
        @click="
          () => {
            showAuthModal = true;
            closeMenu();
          }
        "
      >
        Login/Register
      </button>
    </nav>
  </header>

  <LoginRegisterModal v-model:show="showAuthModal" />

</template>

<style scoped>
.nav-link.login,
.nav-link.logout {
  color: black;
}
</style>
