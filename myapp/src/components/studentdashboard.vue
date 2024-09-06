<template>
    <div>
        <Sidebar />
      <div class="dashboard">
        <h2>Student Dashboard</h2>
        <input type="text" v-model="rollno" placeholder="Enter Roll Number" />
        <button @click="fetchStudentData">Search</button>
  
        <div v-if="student">
          <h3>Personal Information</h3>
          <p><strong>Name:</strong> {{ student.name }}</p>
          <p><strong>Email:</strong> {{ student.email }}</p>
          <p><strong>Roll Number:</strong> {{ student.rollno }}</p>
  
          <h3>Booked Slots</h3>
          <table v-if="bookedSlots.length">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="slot in bookedSlots" :key="slot._id">
                <td>{{ slot.eventName }}</td>
                <td>{{ slot.date }}</td>
                <td>{{ slot.venue }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else>No slots booked.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Sidebar from './sidenav.vue';
  
  export default {
    name: 'StudentDashboard',
    components: {
        Sidebar
    },
    data() {
      return {
        rollno: '',
        student: null,
        bookedSlots: []
      };
    },
    methods: {
    async fetchStudentData() {
        try {
        const adminToken = localStorage.getItem('adminToken');
        console.log("Token:", adminToken);
        if (!adminToken || this.tokenIsExpired(adminToken)) {
            alert('Admin not authenticated. Please log in again.');
            // this.$router.push('/alog-in');
            return;
        }

        const response = await axios.get(`http://127.0.0.1:3030/student/${this.rollno}`, {
            headers: {
            Authorization: `Bearer ${adminToken}`, // Send the token in the Authorization header
            },
        });
        this.student = response.data.student;
        this.bookedSlots = response.data.bookedSlots;
        } catch (error) {
        console.error('Error fetching student data:', error);
        alert('Failed to retrieve student information. Please try again.');
        }
    },
    tokenIsExpired(adminToken){
        const payload = JSON.parse(atob(adminToken.split('.')[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = new Date().getTime();
        return expiryTime < currentTime;
    }
    }

  };
  </script>
  
  <style scoped>
  .dashboard {
    margin: 20px;
    margin-left: 250px;
    padding: 20px;
    background-color: rgb(210, 239, 255);
    border-radius: 10px;
    box-shadow: 8px 8px 2px rgba(164, 165, 165, 0.379);
  }
  
  input {
    padding: 8px;
    margin-right: 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  
  button {
    padding: 8px 16px;
    background-color: #4CAF50; 
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  @media (max-width: 768px) {
    .dashboard {
      width: 100%;
    }
  }
  </style>
  