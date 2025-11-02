<template>
  <div class="col">
    <label>{{ label }}</label>
    <input
      v-if="type !== 'select'"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="input"
    />
    <select
      v-else
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="input"
    >
      <slot></slot>
    </select>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);
</script>

