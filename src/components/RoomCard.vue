<template>
  <div class="room-card">
    <div class="room-image">
      <img :src="roomImage" :alt="roomName" />
      <span v-if="room.isAvailable" class="room-badge">Available</span>
    </div>
    <div class="room-content">
      <div class="room-header">
        <h3 class="room-title text-uppercase">{{ roomName }}</h3>
        <div class="room-rating" v-if="room.rating">
          <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
          <span>{{ room.rating }}</span>
        </div>
      </div>
     <!-- Dynamic features placed right after the title/subtitle -->
      <div class="room-features">
        <span class="feature-tag" v-if="capacity">
          {{ capacity }} {{ capacity === 1 ? 'Guest' : 'Guests' }}
        </span>
        <span
          v-for="f in room.features || []"
          :key="f.roomFeatureId || f.featureName"
          class="feature-tag"
        >
          {{ f.featureName }}
        </span>
      </div>
      <p class="room-description">
        {{ room.description || room.roomType?.description || 'Comfortable room with modern amenities.' }}
      </p>
    </div>
    <div class="room-pricing">
      <div class="room-price">
        <span class="price-amount">S${{ displayPrice }}</span>
        <span class="price-period">/night</span>
      </div>
      <p class="price-note">Subject to GST and charges</p>
      <button
        class="btn btn-book"
        @click="handleBook"
      >
        BOOK ROOM
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getImageUrl } from '../services/api.js';

const props = defineProps({
  room: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["book"]);

const roomName = computed(() => {
  const rn = props.room.roomNumber || '';
  const type = props.room.roomType?.typeName || props.room.roomType?.name || '';
  const combined = [rn, type].filter(Boolean).join(' ');
  return combined || 'Standard Room';
});

const displayPrice = computed(() => {
  return props.room.price || 
         props.room.roomType?.basePrice || 
         props.room.pricePerNight || 
         120;
});

const capacity = computed(() => {
  return props.room.roomType?.capacity ?? null;
});

const roomImage = computed(() => {
  const imgUrl = props.room.roomType?.imageUrl || props.room.imageUrl;
  return getImageUrl(imgUrl) || 'https://picsum.photos/340/210?random=101';
});

function handleBook() {
  emit('book', props.room);
}
</script>

<style scoped>
.room-card {
  background: #f8f5f0;
  /* border-radius: 1rem; */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 340px 1fr auto;
  overflow: hidden;
  transition: transform 0.3s;
}

.room-card:hover {
  transform: translateY(-5px);
}

.room-image {
  position: relative;
  overflow: hidden;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 210px;
}

.room-image img {
  width: 340px;
  height: 210px;
  object-fit: cover;
}

.room-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #ff6b6b;
  color: white;
  padding: 0.25rem 0.75rem;
  /* border-radius: 0.25rem; */
  font-size: 0.85rem;
  font-weight: 600;
}

.room-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background: #f8f5f0;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.room-title {
  font-size: 1.5rem;
  color: #333;
  font-weight: bold;
  margin: 0;
}

.room-subtitle {
  font-size: 0.85rem;
  color: #666;
  margin: 0.5rem 0;
  font-weight: 500;
}

.room-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffa500;
}

.star-icon {
  width: 1.2rem;
  height: 1.2rem;
}

.room-description {
  color: #666;
  margin-bottom: 1rem;
}

.room-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.feature-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem 0.75rem;
  background: #f0f0f0;
  /* border-radius: 0.5rem; */
  font-size: 0.85rem;
  color: #555;
}

.feature-icon-small {
  width: 1rem;
  height: 1rem;
}

.room-pricing {
  background: #e8e3db;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  min-width: 280px;
}

.room-price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.price-amount {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.price-period {
  color: #666;
  font-size: 1rem;
}

.price-note {
  font-size: 0.85rem;
  color: #666;
  margin: 0 0 1.5rem 0;
}

.btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  /* border-radius: 0.5rem; */
  cursor: pointer;
  transition: all 0.3s;
  grid-column: 1 / -1;
  text-transform: uppercase;
}

.btn-book {
  background: #000;
  color: white;
  width: 100%;
  padding: 0.875rem 1.5rem;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.btn-book:hover {
  background: #333;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

@media (max-width: 968px) {
  .room-card {
    grid-template-columns: 1fr;
  }

  .room-image {
    height: 250px;
  }

  .room-image img {
    width: 100%;
    height: 250px;
  }

  .room-pricing {
    min-width: 100%;
    order: 3;
  }
}

@media (max-width: 768px) {
  .room-pricing {
    min-width: 100%;
  }

  .btn-book {
    width: 100%;
  }

  .rooms-toolbar {
    justify-content: stretch;
  }
}

@media (max-width: 480px) {
  .detail-item {
    justify-content: flex-start !important;
  }

  .summary-details {
    grid-template-columns: 1fr;
  }
}
</style>
