<template>
    <div class="container">
        <Sidebar />
        <div class="box1">
            <table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Event Name</th>
                        <th>Date</th>
                        <th>Venues</th>
                        <th>Faculty</th>
                        <th>No.of Students</th>
                        <th>Slots</th> 
                        <th>Batch</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(slot,index) in slots" :key="slot._id">
                        <td>{{ index+1}}</td> <td>{{ slot.EventName }}</td>
                        <td>{{ slot.Date.slice(0, 10) }}</td>
                        <td >  <table> 
                            
                            <tr v-for="venue in slot.Venues" :key="venue.venueName">
                                <td >{{ venue.venueName }}</td>
                            </tr>
                        </table>
                    </td>
                        <td > 
                             <table> 
                            
                            <tr v-for="venue in slot.Venues" :key="venue.faculy">
                                <td >{{ venue.faculty }}</td>
                            </tr>
                        </table>
                        </td>
                        <td>  <table> 
                            
                            <tr v-for="venue in slot.Venues" :key="venue.studentCapacity">
                                <td >{{ venue.studentCapacity }}</td>
                            </tr>
                        </table>
                     </td>
                        <td>{{ slot.SelectedSlots.join(', ') }} </td>
                        <td>{{ slot.SelecedBatch }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import Sidebar from './sidenav.vue';
export default {
    name:'SlotTable',
    components:{
        Sidebar
    },
    data() {
    return {
      slots: [],
    };
    },
    created() {
        this.fetchSlots();
    },
    methods: {
    async fetchSlots() {
        try {
            const response = await axios.get('http://localhost:3030/slots'); // Replace with your server URL
            this.slots = response.data;
        } catch (error) {
            console.error('Error fetching slots:', error);
        }
        },
    },
}
</script>

<style scoped>
.container {
  background-color: white;
  height: 100%;
  padding: 30px;
}

.box1 {
  margin-left: 200px; /* Adjusted for a better layout */
  padding: 20px;
  flex-grow: 1; /* Makes it responsive */
  background-color: #aca7cb;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #3e3e3e;
}

.box1 h2 {
  text-align: center;
  margin-bottom: 20px;
  
}

table {
  margin-top: 20px;
  color: #3e3e3e;
}

.box1 table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.box1 th,
.box1 td {
  
  padding: 10px; /* Increased padding for better spacing */
  text-align: left;
  transition: background-color 0.3s; /* Smooth hover transition */
}

.box1 th {
  font-size: large;
  color: black;
}

.box1 td table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

.box1 td th,
.box1 td td {
  border: 1px solid #202020;
  padding: 4px;
  text-align: left;
}

.box1 tr:hover {
  background-color: #9993bd; /* Highlight on hover */
}

.box1 td {
  vertical-align: top; /* Aligns nested tables to the top */
}



@media (max-width: 768px) {
  .box1 {
    width: auto; /* Make the box responsive */
    padding: 10px;
  }

  .box1 table,
  .box1 td table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .box1 th,
  .box1 td {
    padding: 8px; /* Adjust padding for smaller screens */
  }
}
</style>
