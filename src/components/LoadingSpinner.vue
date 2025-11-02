<template>
  <div v-if="show" class="loading">
    {{ text }}
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: 'Loading...'
  }
});
</script>

<style scoped>
.loading {
  padding: var(--spacing-md);
  text-align: center;
  color: var(--text-secondary);
}
</style>

