<template>
  <div class="container">
      <Sidebar />
        
        <div class="main-contant">
        <div class="box1">
            <div class="split1">
            <label for="">Name of the Event</label>
            <input class="input" v-model="eventName" type="text" placeholder="Event Name">
            <label for="">Select Date</label>
            <input class="input" v-model="eventDate" type="date">
            
          
            <label for="">Batch</label>
            <select class="input" v-model="eventBatch" >
              <option v-for="batch in batches" :key="batch._id" :value="batch._id">
                {{ batch.year }}
                </option>
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
            <label for="">Venue</label>
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
        <!-- <button @click="$router.push('/slot-table')">Show Table</button> -->
      </div>
    </div>
</template>



<script>
import axios from 'axios'
import Sidebar from './sidenav.vue';
import VueMultiselect from 'vue-multiselect'

export default {
    name:'SlotMain',
    components:{
      Sidebar,
        VueMultiselect,
        
    },
    computed: {
      eventVenue() {
          return this.count.toString(); 
      },
      selectedSlotValues() {
        return this.selectedSlots.map(slot => slot.Slots);
      },
      selectedBatchName() {
      const selectedBatch = this.batches.find(batch => batch._id === this.eventBatch);
      return selectedBatch ? selectedBatch.year : '';
  },
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
      batches: [],
      batch:'',
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
  async fetchBatches() {
            try {
                const response = await axios.get('http://127.0.0.1:3030/batches');
                this.batches = response.data;
            } catch (error) {
                console.error('Error fetching batches:', error);
                this.error = true; 
            }
            },
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

      const venues = this.slots;
      for (let i = 1; i <= this.count; i++) {
        const venueName = `slot-${i}-venueName`; 
        const faculty = `slot-${i}-faculty`; 
        const studentCapacity = Number(`slot-${i}-studentCapacity`); 
        
      }
      const response = await axios.post('http://localhost:3030/slots', {
        EventName: this.eventName,
        Date: this.eventDate,
        Venue: this.eventVenue, 
        batch: this.eventBatch, 
        Venues:venues,
        SelectedSlots: this.selectedSlotValues,
        SelecedBatch:this.selectedBatchName,
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
    },
    logout(){
            localStorage.clear();
            this.$router.push({name:'Login'})
        }
 },
 mounted(){
  this.fetchBatches();
 },

 
}


</script>
<style  src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped>
.container{
  font-family: 'Poppins';
  background-color: white;
  height: 100%;
  padding: 30px;
  
}
.box1{
    margin-left: 250px;
    padding: 50px;
    width: 1200px;
    color: #3e3e3e;
    background-color: #aca7cb;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding-top: 30px;
    display: flex;
    justify-content: space-around;
    
   
}
.box2{
    margin-left: 250px;
    padding: 50px;
    width: 1200px;
    color: #3e3e3e;
    background-color: #aca7cb;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    margin-top: 30px;
    

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
    color: #575757;
    align-items: center;
    margin-left:5px ;
    display: flex;
    justify-content: space-between;
    /* flex-direction: row; */
   
}
button{
  background-color: #474554;
  border: none;
  margin: 0 0 0;
  margin-right: 2px;
}
button:hover{
  background-color: #2f2e39;
  border: none;
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




  .sidenav {
    width: 100%; /* Make the sidebar full-width on small screens */
    position: relative; /* Remove fixed positioning on small screens */
  }

  .split1 {
    width: 100%; /* Full width on smaller screens */
    margin-bottom: 20px;
  }
}
</style>