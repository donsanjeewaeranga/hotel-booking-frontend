<template>
  <div class="container">
    <header class="topbar">
      <h1 class="brand">Hotel Booking</h1>
      <nav>
        <router-link to="/">Search</router-link>
        <router-link to="/rooms">Rooms</router-link>
        <router-link to="/contact">Contact</router-link>
        <router-link to="/confirm">Confirm</router-link>
        <router-link to="/auth">Login/Register</router-link>
        <router-link to="/dashboard">Dashboard</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
  
</template>

<script setup>
</script>

<style>
html, body, #app { height: 100%; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }
.container { max-width: 980px; margin: 0 auto; padding: 16px; }
.topbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.brand { margin: 8px 0; font-size: 20px; }
nav { display: flex; gap: 12px; }
nav a { text-decoration: none; color: #1f2937; padding: 6px 10px; border-radius: 6px; }
nav a.router-link-active { background: #efefef; }
main { margin-top: 16px; }
.card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin: 10px 0; }
.row { display: flex; gap: 12px; flex-wrap: wrap; }
.col { flex: 1 1 240px; }
.actions { display: flex; gap: 8px; }
button { background: #0ea5e9; color: white; border: 0; padding: 8px 12px; border-radius: 8px; cursor: pointer; }
button.secondary { background: #6b7280; }
input, select { padding: 8px; border-radius: 8px; border: 1px solid #d1d5db; width: 100%; box-sizing: border-box; }
label { font-size: 12px; color: #6b7280; display: block; margin-bottom: 6px; }
.hint { font-size: 12px; color: #6b7280; }
.success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 10px; border-radius: 8px; }
.error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; padding: 10px; border-radius: 8px; }
</style>

