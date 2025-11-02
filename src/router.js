import SearchPage from './views/SearchPage.vue';
import BookingPage from './views/BookingPage.vue';
import AuthPage from './views/AuthPage.vue';
import DashboardPage from './views/DashboardPage.vue';

export default [
  { path: '/', component: SearchPage },
  { path: '/booking', component: BookingPage },
  { path: '/auth', component: AuthPage },
  { path: '/dashboard', component: DashboardPage }
];

