<template>
  <section class="steps-section">
    <div class="container">
      <nav class="steps">
        <div
          v-for="(s, idx) in steps"
          :key="s.label"
          :class="['step-item', itemClass(idx + 1)]"
        >
          <div class="step-number">{{ idx + 1 }}</div>
          <div class="step-label">{{ s.label }}</div>
        </div>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  step: { type: Number, default: 1 }
});

const steps = [
  { label: 'Search' },
  { label: 'Select Room' },
  { label: 'Contact Information' },
  { label: 'Confirmation' }
];

function itemClass(stepNumber) {
  if (stepNumber < props.step) return 'completed';
  if (stepNumber === props.step) return 'active';
  return '';
}
</script>

<style>
/* Steps Navigation Styles */
.steps-section {
  margin-top: 2rem;
}

.steps-section .container {
  background: #f8f5f0;
  color: #333;
  padding: 1.5rem 2rem;
}

.steps {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.step-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
}

.step-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #d0d0d0;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.step-item.active .step-number {
  background: #000;
  color: #fff;
}

.step-item.completed .step-number {
  background: #000;
  color: #fff;
}

.step-label {
  font-size: 0.85rem;
  color: #d0d0d0;
  text-transform: uppercase;
  white-space: nowrap;
  font-weight: 500;
}

.step-item.active .step-label {
  color: #333;
  font-weight: 600;
}

.step-item.completed .step-label {
  color: #333;
  font-weight: 600;
}

@media (max-width: 768px) {
  .steps-section .container {
    padding: 1rem;
  }

  .steps {
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .step-item {
    gap: 0.5rem;
    flex-shrink: 1;
    min-width: auto;
  }

  .step-number {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.8rem;
  }

  .step-label {
    font-size: 0.75rem;
    display: none;
  }

  .step-item.active .step-label {
    display: block;
  }
}

@media (max-width: 480px) {
  .steps {
    gap: 0.25rem;
  }

  .step-item {
    gap: 0.4rem;
  }

  .step-number {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
  }

  .steps-section .container {
    padding: 0.75rem 1rem;
  }
}
</style>
