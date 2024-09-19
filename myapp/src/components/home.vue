<template>
  <div>
    <Header />
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
              
              <select  class="styled-select" v-model="selectedVenue[slot._id]">
 
                <option v-for="venue in slot.Venues" :key="venue.venueName" :value="venue.venueName">
                  {{ venue.venueName }}
                </option>
                
              </select>
            </td>
            <td>
              <select class="styled-select" v-model="selectedSlot[slot._id]">
                <option value="" disabled>Select Slot</option> 
                <option v-for="(selectedSlot, index) in slot.SelectedSlots" :key="index" :value="selectedSlot">
                  {{ selectedSlot }}
                </option>
              </select>
            </td>

            <td>
              <button 
              :disabled="slot.booked" 
              @click="bookSlot(slot)">
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
            <th>Venue</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bookedSlot in bookedSlots" :key="bookedSlot._id">
            <td>{{ bookedSlot.eventName }}</td>
            <td>{{ formatDate(bookedSlot.date) }}</td>
            <td>{{ bookedSlot.venue }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Header from './header.vue';

export default {
  name: 'SlotTable',
  components: {
    Header
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
.slot-table {
  margin: 0 auto;
  padding: 20px;
  width: 80%;
  background-color: rgb(210, 239, 255);
  border-radius: 10px;
  box-shadow: 8px 8px 2px rgba(164, 165, 165, 0.379);
  margin-bottom: 50px;
  transition: box-shadow 0.3s;
}

.slot-table:hover {
  box-shadow: 12px 12px 15px rgba(164, 165, 165, 0.5);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
  transition: background-color 0.3s;
}

th {
  background-color: #f2f2f2;
  color: #555;
}

tr:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 8px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #45a049;
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

