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

    <div class="dashboard">
      <h2>Slot Performance Dashboard</h2>
      <canvas id="scaleChart" aria-label="Scale Rating Chart" aria-describedby="scaleChartDesc"></canvas>
      
      
      
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import Header from './header.vue';
import Chart from 'chart.js/auto';



export default {
  name: 'SlotTable',
  components: {
    Header
  },
  data() {
    return {
      scaleChart: null,
      slots: [],
      bookedSlots: [],
      feedbackData: [],
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

        
        const feedbackResponse = await axios.get('http://127.0.0.1:3030/slot-feedback',{
          headers: {
              Authorization: `Bearer ${token}`,
            }
        });
        
        this.feedbackData = feedbackResponse.data;
        
        
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
    renderCharts() {
        const canvas = document.getElementById('scaleChart');
        if (canvas) {
          const ctx = canvas.getContext('2d');

          // Clear the previous chart content
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // If a previous chart exists, destroy it
          if (this.scaleChart) {
            this.scaleChart.destroy();
          }

          // Create a new chart instance
          this.scaleChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: this.feedbackData.map(f => f.eventName),
              datasets: [{
                label: 'Scale Rating (1-5)',
                data: this.feedbackData.map(f => f.scale),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                borderRadius: 5,
              }],
            },
            options: {
              layout: {
                padding: {
                  left: 0, // Remove left padding
                  right: 0,
                  top: 0,
                  bottom: 0
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 5,
                },
              },
              plugins: {
              tooltip: {
                enabled: true, // Enable tooltip
                backgroundColor: 'rgba(0, 0, 0, 0.7)', // Tooltip background color
                titleColor: '#fff', // Tooltip title text color
                bodyColor: '#fff', // Tooltip body text color
                borderWidth: 1, // Tooltip border width
                borderColor: '#fff', // Tooltip border color
                displayColors: false, // Disable color box next to the tooltip text
                callbacks: {
                  // Customize tooltip labels
                  label: function (tooltipItem) {
                                const dataIndex = tooltipItem.dataIndex; // Get the index of the tooltip item
                                const dataPoint = this.feedbackData[dataIndex];
                                const formattedDate = new Date(dataPoint.date).toISOString().split('T')[0];
                                return [
                                    `Rating: ${tooltipItem.raw}`, // Display 'Rating: <value>'
                                    `Remark: ${dataPoint.remarks}`, // Display remark
                                    `Date: ${formattedDate}`, // Display date
                                    `Venue: ${dataPoint.venue}`, // Display venue
                                ];
                            }.bind(this), 
                  title: function (tooltipItems) {
                    const item = tooltipItems[0]; // Display the event name as title
                    return `Event: ${item.label}`;
                  },
                }
              },
            },          
            },
          });
        }
      }

  },
  watch: {
    feedbackData(newData) {
      if (newData && newData.length > 0) {
        this.renderCharts();
      }
    }
  },
  mounted() {
    if (this.feedbackData.length > 0) {
      this.renderCharts();
    }
  }
};
</script>


<style scoped>
body, html {
  margin: 0;
  padding: 0;
  height: 100%; 
  
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden; 
}
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
.dashboard {
  margin-top: 50px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 500px;
  
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

