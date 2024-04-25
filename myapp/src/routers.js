import Home from './components/home.vue';
import SignUp from './components/SignUp.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/login.vue';
import AdminLogin from './components/adminlogin.vue';
import AdminSignup from './components/adminsignup.vue';
import SlotMain from './components/slotmain.vue';

const routes = [
  {
    name: "Home",
    component: Home,
    path: '/',
  },
  {
    name: "SignUp",
    component: SignUp,
    path: '/sign-up',
  },
  {
    name: "Login",
    component: Login,
    path: '/log-in',
  },
  {
    name: "AdminLogin",
    component: AdminLogin,
    path: '/alog-in',
  },
  {
    name: "AdminSignup",
    component: AdminSignup,
    path: '/asign-up',
  },
  {
    name: "SlotMain",
    component: SlotMain,
    path: '/slot-main',
    meta: {
      requiresAuth: false, // Explicitly set to false for non-protected routes
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user') !== null; // Check for login status
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    next('/log-in'); // Redirect to login for protected routes if not logged in
  } else {
    next(); // Allow access
  }
});

export default router;
