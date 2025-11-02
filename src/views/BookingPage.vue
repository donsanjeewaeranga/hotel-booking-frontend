<template>
  <div class="booking-flow">
    <StepIndicator :step="step" />
    <div class="booking-content">
      <component 
        :is="currentComponent" 
        @room-selected="handleRoomSelected"
        @contact-submitted="handleContactSubmitted"
        @back="handleBack"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store } from '../store.js';
import StepIndicator from '../components/StepIndicator.vue';
import SelectRoomStep from '../components/SelectRoomStep.vue';
import ContactInfoStep from '../components/ContactInfoStep.vue';
import ConfirmationStep from '../components/ConfirmationStep.vue';

const step = ref(2);

const currentComponent = computed(() => {
  switch (step.value) {
    case 2:
      return SelectRoomStep;
    case 3:
      return ContactInfoStep;
    case 4:
      console.log("Returning ConfirmationStep");
      return ConfirmationStep;
    default:
      return SelectRoomStep;
  }
});

function handleRoomSelected(room) {
  store.setBooking({ selectedRoom: room });
  step.value = 3;
}

function handleContactSubmitted(contactInfo) {
  store.setBooking({ contact: contactInfo });
  step.value = 4;
}

function handleBack() {
  if (step.value > 2) {
    step.value--;
  }
}
</script>

<style scoped>
.booking-flow {
  min-height: calc(100vh - 80px);
  background: #f8f8f8;
}

.booking-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>