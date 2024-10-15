import Home from './components/home.vue';
import SignUp from './components/SignUp.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/login.vue';
import AdminLogin from './components/adminlogin.vue';
import AdminSignup from './components/adminsignup.vue';
import SlotMain from './components/slotmain.vue';
import SlotTable from './components/slottable.vue'
import Studentdashboard from './components/studentdashboard.vue';
import Chart from './components/chart.vue';
import Chart1 from './components/chart1.vue';


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
        requiresAuth: true,
      },
  },
  {
    name:"SlotTable",
    component:SlotTable,
    path:'/slot-table',
  },
  {
    name:"StudentDashboard",
    component:Studentdashboard,
    path:'/student-dash',
  },
  {
    name:"Chart",
    component:Chart,
    path:'/chart'

  },
  {
    name:"Chart1",
    component:Chart1,
    path:'/chart1'

  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//     const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
//     const isAdmin = this.$store?.state.isAdmin || localStorage.getItem('user-info')?.includes('admin'); // (Replace with actual admin check)
  
//     if (requiresAuth && !isAdmin) {
//       next({ name: 'AdminLogin' }); // Redirect to login page if not admin
//     } else {
//       next(); 
//     }
//   });


export default router;
