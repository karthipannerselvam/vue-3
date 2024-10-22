<template>
  <div class="main">
    <Sidebar1 />
    <div class="slot-table">
      <h2>Available Slots</h2>
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Venue</th>
            <th>Slots</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in slots" :key="slot._id">
            <td>{{ slot.EventName }}</td>
            <td>{{ formatDate(slot.Date) }}</td>
            <td>
              <select class="styled-select" v-model="selectedVenue[slot._id]" aria-label="Select Venue">
                <option v-for="venue in slot.Venues" :key="venue.venueName" :value="venue.venueName">
                  {{ venue.venueName }}
                </option>
              </select>
            </td>
            <td>
              <select class="styled-select" v-model="selectedSlot[slot._id]" aria-label="Select Slot">
                <option value="" disabled>Select Slot</option>
                <option v-for="(selectedSlot, index) in slot.SelectedSlots" :key="index" :value="selectedSlot">
                  {{ selectedSlot }}
                </option>
              </select>
            </td>
            <td>
              <button 
                :disabled="slot.booked" 
                @click="bookSlot(slot)" 
                :aria-label="slot.booked ? 'Slot already booked' : 'Book this slot'">
                {{ slot.booked ? 'Booked' : 'Book Slot' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Booked Slots</h2>
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Slot</th>
            <th>Venue</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bookedSlot in bookedSlots" :key="bookedSlot._id">
            <td>{{ bookedSlot.eventName }}</td>
            <td>{{ formatDate(bookedSlot.date) }}</td>
            <td>{{ bookedSlot.slot }}</td>
            <td>{{ bookedSlot.venue }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    
  </div>
</template>


<script>
import axios from 'axios';
import Sidebar1 from '../components/sidenav1.vue'




export default {
  name: 'SlotTable',
  components: {
    Sidebar1,
  },
  data() {
    return {
      slots: [],
      bookedSlots: [],
      selectedVenue: {},
      selectedSlot: {}
    };
  },
  async created() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            // Handle missing token (e.g., redirect to login)
            return;
        }

        const userResponse = await axios.get('http://127.0.0.1:3030/get-current-user', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const userData = userResponse.data;

        if (!userData.rollno) {
            alert('Error: Roll number not found. Please log in again.');
            return;
        }

        const response = await axios.get('http://127.0.0.1:3030/slots', {
            params: {
                rollno: userData.rollno
            }
        });
      
        
        this.slots = response.data;

        const bookedResponse = await axios.get('http://127.0.0.1:3030/booked-slots', {
            params: {
                rollno: userData.rollno
            },
            headers: {
              Authorization: `Bearer ${token}`,
            }
        });
        // console.log(bookedResponse.data);
        this.bookedSlots = bookedResponse.data;

        
       
        
        
    } catch (error) {
      
        console.error('Error fetching slots:', error);
    }
},
  methods: {
    async fetchSlots() {
      try {
        const response = await axios.get('http://127.0.0.1:3030/slots');
        this.slots = response.data;
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    },
    async bookSlot(slot) {
      try {
        const token = localStorage.getItem('token');
       
        
        if (!token || this.tokenIsExpired(token)) {
          alert('User not authenticated. Please log in again.');
          this.$router.push('/log-in'); 
          return;
        }



        const userResponse = await axios.get('http://127.0.0.1:3030/get-current-user', {
          headers: {
            Authorization: `Bearer ${token}`, 
          }
        });
        const userData = userResponse.data;

        
        if (!userData.rollno) {
          alert('Error: Roll number not found. Please log in again.');
          return;
        }
        const venueName = this.selectedVenue[slot._id];
        const selectedSlot = this.selectedSlot[slot._id];

        const bookingData = {
          eventName: slot.EventName,
          date: slot.Date,
          venue: venueName,
          rollno: userData.rollno, 
          slot: selectedSlot,
          slotId:slot.slotId
        };

        
        const response = await axios.post('http://127.0.0.1:3030/book-slot', bookingData, {
          headers: {
            Authorization: `Bearer ${token}`, 
          }
        });
        
       
       
        if (response.status === 200 && response.data.success) {
          alert(`You have successfully booked the slot: ${slot.EventName} on ${slot.Date} at ${slot.Venue}`);
          this.slots = this.slots.map(s => s._id === slot._id ? { ...s, booked: true } : s);
          
        } else {
          alert('Failed to book the slot. Please try again later.');
        }
      } catch (error) {
        
        console.error('Error booking slot:', error.response ? error.response.data : error.message);
        alert('Error booking the slot. Please try again later.');
      }
    },
    tokenIsExpired(token){
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; 
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
    

  },
  
};
</script>


<style scoped>
.main{
  background-color: whitesmoke;
}
body, html {
  margin: 0;
  padding: 0;
  height: 100%; 
  background-color: #333;
  
}
.container {
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden; 
}
.slot-table {
  margin-left: 250px;
  margin-top: 50px;
  padding: 20px;
  width: 80%;
  background-color: #aca7cb;
  border-radius: 10px;
  margin-bottom: 50px;
  transition: box-shadow 0.3s, transform 0.3s; /* Added transform transition */
  border: 2px solid rgba(58, 58, 58, 0.2);
  font-weight: 550;
  font-family: 'Poppins';
  font-size: 16px;
  color: #3e3e3e;
  text-align: center;
  letter-spacing: 0.5px;
}


.slot-table table {
  width: 100%;
  border-collapse: collapse;
}

.slot-table th, .slot-table td {
  padding: 10px;
  text-align: left;
}

.slot-table th {
  background-color: rgb(255, 255, 255);
  color: #3e3e3e; 
}
h2 {
  text-align: center;
  color: #3e3e3e;
  margin-bottom: 20px;
  font-family: 'Poppins';
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  border-radius: 5px;
}
thead{
 border-radius: 5px;
}

th {
  background-color: #f2f2f2;
  color: #555;
}


button {
  background-color: #474554; /* Green */
  border: none;
  color: white;
  padding: 8px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  font-family: 'Poppins';
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #3a384a;
  transform: scale(1.05);
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.styled-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  transition: border-color 0.3s;
}

.styled-select:focus {
  border-color: #4CAF50;
  outline: none;
}
.dashboard {
  margin-top: 50px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 500px;
  background-color: black;
  
}

canvas {
  margin: 20px auto;
  max-width: 600px;
  height: 400px;
  
}


@media (max-width: 768px) {
  .slot-table {
    width: 95%;
  }

  th, td {
    padding: 6px;
  }

  button {
    font-size: 12px;
  }
}
</style>

