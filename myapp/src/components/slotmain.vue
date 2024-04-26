<template>
    <div>
        <Header/>
        <div class="box1">
            <div class="split1">
            <label for="">Name of the Event</label>
            <input class="input" v-model="eventName" type="text" placeholder="Event Name">
            <label for="">Select Date</label>
            <input class="input" v-model="eventDate" type="date">
            
            <label for="myDropdown">Duration</label>
            <select class="input" v-model="eventDuration" id="myDropdown">
            <option value="5">5 min</option>
            <option value="10">10 min</option>
            <option value="15">15 min</option>
            <option value="20">20 min</option>
            <option value="25">25 min</option>
            <option value="30">30 min</option>
            <option value="45">45 min</option>
            <option value="60">60 min</option>
            </select>
            </div>
            <div class="split1">
            <label for="">Batch</label>
            <select class="input" v-model="eventBatch">
              <option value="2027">2027</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
            <label for="">Vanue</label>
            <div class="counter">
            <div class="count" id="count">{{ count }}
                <div class="countbtn">
            <button id="upBtn" @click="incrementCount">&#8593;</button>
            <button id="downBtn" @click="decrementCount">	&#8595;</button>
                </div>
            </div>
            </div>
          
            <form @submit.prevent="submitSlot">
              <button class="btn" type="submit">Save Slot</button>
            </form>
          </div>
        </div>
        <div class="box2">
          
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Header from './header.vue';

export default {
    name:'SlotMain',
    components:{
        Header
    },
    computed: {
      eventVenue() {
          return this.count.toString(); // Convert count to a string if needed
      }
    },
    data() {
    return {
      eventName: '',
      eventDate: '',
      eventDuration: '',
      eventBatch:'',
      count: 0,
    };
 },
 methods: {
    incrementCount() {
      this.count++;
    },
    decrementCount() {
      if (this.count > 0) {
        this.count--;
      }
    },
    async submitSlot() {
    try {
      const response = await axios.post('http://localhost:3030/slots', {
        EventName: this.eventName,
        Date: this.eventDate,
        Duration: this.eventDuration,
        Venue: this.eventVenue, 
        Batch: this.eventBatch, 
      });

      console.log('Slot saved:', response.data);
     
      } catch (error) {
        console.error('Error saving slot:', error);
        console.warn('error in slotmain');
      }
    }
 }
}


</script>
<style scoped>
.box1{
    margin: 0 auto;
    padding: 50px;
    /* height: 500px; */
    width: 1400px;
    background-color: rgb(210, 239, 255);
    border-radius: 10px;
    box-shadow: 8px 8px 2px rgba(164, 165, 165, 0.379);
    padding-top: 30px;
    display: flex;
    justify-content: space-around;
}
.input{
    background-color: rgb(253, 253, 253);
    
}
.counter{
  padding: 2px;
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
}
.count{
  
    align-items: center;
    margin-left:5px ;
    display: flex;
    justify-content: space-between;
    /* flex-direction: row; */
   
}
button{
  margin: 0 0 0;
  margin-right: 2px;
}
.btn{
  margin-top:20px ;
}
.split1{
  width: 400px;
}
@media (max-width: 768px) {
  .head {
    margin-bottom: 20px;   /* Reduce bottom margin for smaller screens */
  }
  .box1{
    margin: 0 auto;
    width: 500px;
    background-color: rgb(210, 239, 255);
    border-radius: 10px;
    padding: 50px;
    padding-top: 50px;
    align-items: center;
    display: flex;
    flex-direction: column
}

}
</style>