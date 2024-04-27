<template>
    <div>
        <Header/>
        <div class="box1">
            <div class="split1">
            <label for="">Name of the Event</label>
            <input class="input" v-model="eventName" type="text" placeholder="Event Name">
            <label for="">Select Date</label>
            <input class="input" v-model="eventDate" type="date">
            
          
            <label for="">Batch</label>
            <select class="input" v-model="eventBatch">
              <option value="2027">2027</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div class="split1">
            <label for="myDropdown">Slots</label>
            <div>
             
              <vueMultiselect 
                v-model="selectedSlots" 
                :options="options"
                :multiple="true"
                track-by="Slots"
                :custom-label="customLabel"
                ></vueMultiselect>
            </div>
            <label for="">Vanue</label>
            <div class="counter">
            <div class="count" id="count">{{ count }}
                <div class="countbtn">
            <button id="upBtn" @click="incrementCount">&#8593;</button>
            <button id="downBtn" @click="decrementCount">	&#8595;</button>
                </div>
            </div>
            </div>

          </div>
        </div>
        <div class="box2">
          <div v-for="n in count" :key="n" class="slot-container">
        <label for="">Venue {{ n }}</label>
         <div class="slot-details">
          <input class="input" v-model="slots[n - 1].venueName" type="text" placeholder="Venue Name">
          <input class="input" v-model="slots[n - 1].faculty" type="text" placeholder="Faculty">
          <input class="input" v-model="slots[n - 1].studentCapacity" type="number" placeholder="Number of students">
            </div>
          </div>
          <form @submit.prevent="submitSlot">
              <button class="btn" type="submit">Save Slot</button>
              <div v-if="successMessage" class="success-message">
                {{ successMessage }}
              </div>
            </form>
        </div>
        <button @click="$router.push('/slot-table')">Show Table</button>
    
    </div>
</template>



<script>
import axios from 'axios'
import Header from './header.vue'
import VueMultiselect from 'vue-multiselect'

export default {
    name:'SlotMain',
    components:{
        Header,
        VueMultiselect,
        
    },
    computed: {
      eventVenue() {
          return this.count.toString(); 
      },
      selectedSlotValues() {
        return this.selectedSlots.map(slot => slot.Slots);
      }
    },
    data() {
    return {
      eventName: '',
      eventDate: '',
   
      eventBatch:'',
      count: 1,
      successMessage: '', 
      slots: Array(this.count).fill({ venueName: '',faculty: '', studentCapacity: '' }),
      selectedSlots: [],
      options: [
    	{	Timing: '9.00am - 9.30am', Slots: 'Slot-1' },
      { Timing: '9.30am - 10.00am', Slots: 'Slot-2' },
      { Timing: '10.30am - 11.00am', Slots: 'Slot-3' },
      { Timing: '11.00am - 11.30am', Slots: 'Slot-4' },
      { Timing: '11.30am - 12.00pm', Slots: 'Slot-5' },
      { Timing: '2.00pm - 2.30pm', Slots: 'Slot-7' },
      { Timing: '2.30pm - 3.00pm', Slots: 'Slot-8' },
      { Timing: '3.00pm - 3.30pm', Slots: 'Slot-9' },
      { Timing: '4.00pm - 4.30pm', Slots: 'Slot-10' },
      
    ]
    };
 },
 methods: {
  customLabel (option) {
      return `${option.Slots} - ${option.Timing} `
    },
    incrementCount() {
      this.count++;
      this.slots.push({ venueName: '', faculty: '', studentCapacity: 0 });
       this.slots.length = this.count;
    },
    decrementCount() {
      if (this.count > 1) {

        this.count--;

        this.slots.pop();
      }
    },
    async submitSlot() {
    try {
      const venues = this.slots;;
      for (let i = 1; i <= this.count; i++) {
        const venueName = `slot-${i}-venueName`; 
        const faculty = `slot-${i}-faculty`; 
        const studentCapacity = Number(`slot-${i}-studentCapacity`); 
        
      }
      const response = await axios.post('http://localhost:3030/slots', {
        EventName: this.eventName,
        Date: this.eventDate,
        // Duration: this.eventDuration,
        Venue: this.eventVenue, 
        Batch: this.eventBatch, 
        Venues:venues,
        SelectedSlots: this.selectedSlotValues,
      });

      this.successMessage = 'Slot saved successfully!';

      console.log('Slot saved:', response.data);
     
      } catch (error) {
        console.error('Error saving slot:', error);
        console.warn('error in slotmain');
      }
      finally {
        
        setTimeout(() => {
          this.successMessage = '';
        }, 10000);
      }
    }
 },
 
}


</script>
<style  src="vue-multiselect/dist/vue-multiselect.css"></style>
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
.box2{
  margin: 0 auto;
    padding: 50px;
    /* height: 500px; */
    width: 1400px;
    background-color: rgb(210, 239, 255);
    border-radius: 10px;
    box-shadow: 8px 8px 2px rgba(164, 165, 165, 0.379);
    margin-top: 20px;
    margin-bottom: 20px;

}
.slot-details{
  display: flex;
  gap: 10px;
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
.success-message {
  color: green;
  font-weight: bold;
  margin-top: 10px;
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
.box2{
  width: 500px;
}
.slot-details{
  flex-direction: column;
}

}
</style>