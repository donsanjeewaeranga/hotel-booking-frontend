import SearchPage from './views/SearchPage.vue';
import RoomsPage from './views/RoomsPage.vue';
import ContactPage from './views/ContactPage.vue';
import ConfirmPage from './views/ConfirmPage.vue';
import AuthPage from './views/AuthPage.vue';
import DashboardPage from './views/DashboardPage.vue';

export default [
  { path: '/', component: SearchPage },
  { path: '/rooms', component: RoomsPage },
  { path: '/contact', component: ContactPage },
  { path: '/confirm', component: ConfirmPage },
  { path: '/auth', component: AuthPage },
  { path: '/dashboard', component: DashboardPage }
];

