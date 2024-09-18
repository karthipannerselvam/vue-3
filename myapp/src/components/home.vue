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
            <th>Action</th> <!-- New column for the Book button -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in slots" :key="slot._id">
            <td>{{ slot.EventName }}</td>
            <td>{{ formatDate(slot.Date) }}</td>
            <td>
              <tr v-for="venue in slot.Venues" :key="venue.venueName">
                  <td >{{ venue.venueName }}</td>
              </tr>
            </td>
            <td>
              <ul>
                <li v-for="(selectedSlot, index) in slot.SelectedSlots" :key="index">
                  {{ selectedSlot }}
                </li>
              </ul>
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
      bookedSlots: []
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
      
        console.log(response.data);
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

        const bookingData = {
          eventName: slot.EventName,
          date: slot.Date,
          venue: slot.Venue,
          rollno: userData.rollno, 
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
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}

button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .slot-table {
    width: 100%;
  }
}
</style>
