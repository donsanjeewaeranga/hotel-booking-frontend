# Components Directory

This directory contains **reusable Vue components** that can be used across multiple views.

## Views vs Components

- **Views** (`src/views/`) = Route-level pages (SearchPage, RoomsPage, DashboardPage)
- **Components** (`src/components/`) = Reusable UI pieces used in multiple places

## When to Create a Component?

Create a component when:
- ✅ The same UI pattern appears in 2+ views
- ✅ It has its own logic/state that can be isolated
- ✅ It makes views cleaner and easier to maintain

Examples:
- `RoomCard` - Display room info (used in RoomsPage)
- `ErrorMessage` - Show errors (used in multiple views)
- `FormInput` - Label + input wrapper (used everywhere)
- `LoadingSpinner` - Loading states (used in multiple views)

## Usage

Import components in your views:

```vue
<script setup>
import RoomCard from '@/components/RoomCard.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
</script>

<template>
  <ErrorMessage :message="error" />
  <RoomCard 
    v-for="room in rooms" 
    :key="room.roomId"
    :room="room"
    @book="handleBook"
  />
</template>
```

## Component Naming

- Use PascalCase for component files (e.g., `RoomCard.vue`)
- Keep components focused and reusable
- Document props and events in component files

