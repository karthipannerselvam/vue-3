<template>
  <div class="main">
    <nav class="sidenav">
      <ul>
        
        <li @click="$router.push('/student-dash')">Student Remark</li>
        <li @click="$router.push('/slot-main')">Slot Booking</li>
        <li @click="$router.push('/chart1')">Slot Dashboard</li>
        <li @click="$router.push('/slot-table')">Slot Table</li>
      </ul>
      
        <button class="logout-btn" v-on:click="logout">Logout</button>
      
    </nav>
  </div>
  </template>
  
  <script>
  export default {
    name: 'Sidebar',
    methods: {
      logout() {
        localStorage.clear();
        this.$router.push({ name: 'Login' });
      }
    }
  }
  </script>
  
<style scoped>

.sidenav {
  width: 200px; /* Make sure the width is flexible */
  background-color: #333;
  color: white;
  height: 100vh;
  padding-top: 20px;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease; /* For a smoother transition */
}

.sidenav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidenav ul li {
  padding: 15px 20px;
  cursor: pointer;
}

.sidenav ul li:hover {
  background-color: #575757;
}

.logout-btn {
  background-color: rgba(0, 0, 0, 0.248);
  border-image: linear-gradient(45deg, #ff8a80, #8a80ff) 1;
  color: white;
  width:100px;
  cursor: pointer;
  text-align: left;
  padding: 15px 20px;
  margin-left: 40px;
}

.logout-btn:hover {
  background-color: #5d4242;
}

@media (max-width: 768px) {
  .sidenav {
    width: 100%; /* Expand the sidebar to full width */
    height: auto; /* Adjust the height */
    position: relative; /* Remove fixed position */
    flex-direction: row; /* Align items in a row */
    justify-content: space-around;
  }

  .sidenav ul li {
    padding: 10px;
  }

  .logout-btn {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .sidenav {
    width: 100%;
    padding: 10px;
  }

  .sidenav ul li {
    padding: 8px;
  }

  .logout-btn {
    padding: 8px;
    font-size: 14px; /* Adjust font size for smaller screens */
  }
}
</style>


  