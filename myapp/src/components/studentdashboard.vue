<template>
    <div class="main">
        <Sidebar />
      <div class="dashboard">
        <h2>Student Dashboard</h2>
        <input type="text" v-model="rollno" placeholder="Enter Roll Number" />
        <button @click="fetchStudentData">Search</button>
  
        <div v-if="student">
          <h3>Personal Information</h3>
          <p><strong>Name:</strong> {{ student.username }}</p>
          <p><strong>Email:</strong> {{ student.email }}</p>
          <p><strong>Roll Number:</strong> {{ student.rollno }}</p>
  
          <h3>Booked Slots</h3>
          <table v-if="bookedSlots && bookedSlots.length">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Scale (Out of 5)</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="slot in bookedSlots" :key="slot._id">
                <td>{{ slot.eventName }}</td>
                <td>{{ formatDate(slot.date) }}</td>
                <td>{{ slot.venue }}</td>
                <td>
                  <input type="number" v-model="slot.scale" min="1" max="5" placeholder="1-5" />
                </td>
                <td>
                  <input type="text" v-model="slot.remarks" placeholder="Enter remarks" />
                </td>
                <td>
                  <button @click="submitSlotData(slot)">Submit</button>
                </td>
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
import { eventNames } from '@/models/Batch';
  
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
    async submitSlotData(slot) {
      const adminToken = localStorage.getItem('adminToken');
            try {
                const payload = {
                    slotId: slot._id,
                    eventName:slot.eventName,
                    scale: slot.scale,
                    remarks: slot.remarks,
                    rollno: this.student.rollno, 
                    date: slot.date,
                    venue: slot.venue,
                };

                const response = await axios.post('http://127.0.0.1:3030/api/submitSlotData', payload, {
                    headers: {
                    Authorization: `Bearer ${adminToken}`, // Send the token in the Authorization header
                    },
                });
                if (response.data.message === 'Slot feedback saved successfully') {
                    alert('Slot feedback saved!');
                    this.bookedSlots = this.bookedSlots.filter(slotItem => slotItem._id !== slot._id);
                } else {
                    alert('Failed to save slot feedback.');
                }
            } catch (error) {
                console.error('Error submitting slot data:', error);
                alert('Error submitting slot data. Please try again.');
            }
        },
    tokenIsExpired(adminToken){
        const payload = JSON.parse(atob(adminToken.split('.')[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = new Date().getTime();
        return expiryTime < currentTime;
    },
    formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0'); 
      const month = String(d.getMonth() + 1).padStart(2, '0'); 
      const year = d.getFullYear(); // Get full year

      return `${day}/${month}/${year}`;
    },
    
  
    }

  };
  </script>
  
  <style scoped>
  .main{
  background-color: black;
  height: 100%;
  
  }
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
  