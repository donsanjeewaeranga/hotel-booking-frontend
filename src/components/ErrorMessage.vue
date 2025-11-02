<template>
  <div v-if="message" class="error" style="margin:10px 0">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  }
});
</script>

