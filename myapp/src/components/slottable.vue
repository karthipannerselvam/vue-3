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
  display: flex;
}

.box1{
    margin-left: 100px !important;
   padding: 20px;
  
    width: 2000px;
    margin: 0 auto;
}
table{
    margin-top: 20px;
}
.box1 table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

.box1 th, .box1 td {
    border: 1px solid #9ccacf;
    padding: 8px;
    text-align: left;
}

.box1 th {
    background-color: #a2c2d2;
    color: black;
}
.box1 td table {
    width: 100%;
    border-collapse: collapse;
    margin: 0;
}

.box1 td th, .box1 td td {
    border: 1px solid #9ccacf;
    padding: 4px;
    text-align: left;
}


.box1 tr:hover {
    background-color: #cfe5ec;
}





@media (max-width: 768px) {
    .box1{
        width: 700px;
    }
    .box1 table, .box1 td table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
    }
}
</style>