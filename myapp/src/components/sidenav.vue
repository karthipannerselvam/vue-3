<template>
    <nav class="sidenav">
      <ul>
        
        <li @click="$router.push('/student-dash')">Student Dashboard</li>
        <li @click="$router.push('/slot-main')">Slot Booking</li>
        <li @click="$router.push('/slot-table')">Slot Table</li>
      </ul>
      <div class="logout-section">
        <button class="logout-btn" v-on:click="logout">Logout</button>
      </div>
    </nav>
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
    width: 200px;
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
  
  .sidenav ul li a {
    color: white;
    text-decoration: none;
  }
  
  .sidenav ul li a:hover {
    background-color: #575757;
  }
  
  .logout-btn {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 15px 20px;
    margin-left: 20px;
    cursor: pointer;
    text-align: left;
    margin-bottom: 50px;
  }
  
  .logout-btn:hover {
    background-color: #5d4242;
  }
  </style>
  