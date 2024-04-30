<template>
    <div>
        <h1>Sign Up</h1>
        <div class="head">
            <button class="admin" @click="$router.push('/asign-up')">Admin</button>

    </div>
        <div class="register">
            <input type="text" v-model="name" 
            :class="{'has-error':submitting&& invalidName}"
             @focus="clearStatus"
             @keypress="clearStatus"
            placeholder="Enter Name">
            <input type="text" v-model="email"
            :class="{'has-error':submitting && invalidEmail}"
             @focus="clearStatus"
             @keypress="clearStatus"
            placeholder="Enter Email">
            <input type="text" v-model="rollno" 
            :class="{'has-error':submitting && invalidrollno}"
             @focus="clearStatus"
             @keypress="clearStatus"
            placeholder="Enter Roll Number">
            <select class="input" v-model="batch">
            <option disabled value="">Please select a year</option>
              <option v-for="batch in batches" :key="batch._id" :value="batch._id">
                {{ batch.year }}
                </option>
            </select>
            <input type="password" v-model="password" 
            :class="{'has-error':submitting && invalidPassword}"
             @focus="clearStatus"
             @keypress="clearStatus"
             placeholder="Enter Password">
             <p v-if="submitting && error" class="error-message">Please fill out all the required fields!</p>
            
            <button v-on:click="signUp">Sign Up</button>
            <button class="login" @click="$router.push('/log-in')">Login</button>
        </div>
    </div>
</template>
<script>

import axios from 'axios';
export default {
    name:'Sign-Up',
    data(){
        return{
            name:'',
            email:'',
            password:'',
            submitting:false,
            success:false,
            error:false,
            rollno:'',
            batch:'',
            batches: [],
        }
    },
    methods:{
        async fetchBatches() {
            try {
                const response = await axios.get('http://127.0.0.1:3030/batches');
                this.batches = response.data;
            } catch (error) {
                console.error('Error fetching batches:', error);
                this.error = true; 
            }
            },
        async signUp(){
            this.submitting=true;
            this.clearStatus();

            if(this.invalidName || this.invalidEmail || this.invalidPassword ){
                this.error=true;
                console.log('Error: Empty fields');
                return;
            }
            let result; // Declare result here
            try{
                result = await axios.post("http://127.0.0.1:3030/user",{
                    email:this.email,
                    password:this.password,
                    username:this.name,
                    rollno:this.rollno,
                    batch:this.batch

                });
                this.success = true;
            }
            catch(error){
                this.error=true;
                console.error('API Error:', error);
            }
            this.submitting = false;

            console.warn(result);
            if(result && result.status==200){ // Check if result is defined before accessing its properties
                localStorage.setItem("user-info",JSON.stringify(result.data))
                this.$router.push({name:"Home"});
                this.success = true;
                this.error = false;
            }else{
                this.error=false;
            }
            this.submitting=false;
        },
        clearStatus(){
            this.success=false;
            this.error=false;
        }
    },
    mounted(){
        let user=localStorage.getItem('user-info');
        if(user){
            this.$router.push({name:"Home"})
        }else {
            this.fetchBatches();
            }
    },
    computed:{
        invalidName(){
            return this.name==='';
        },
        invalidEmail(){
            return this.email==='';
        },
        invalidPassword(){
            return this.password==='';
        },
        invalidrollno(){
            return this.rollno==='';
        }
    }
}
</script>
<style scoped>
h1 {
  text-align: center;
}

.register {
  padding: 50px;
}

button {
  margin-right: 10px;
}

.login {
  background: rgb(169, 201, 228);
  border: rgb(169, 201, 228);
}

.head {
  display: flex; 
  justify-content: center; 
  margin-top: -60px;
  margin-right: 20px;
}

.admin {
  margin-left: auto; 
}
[class*='-message']{
    font-weight: 500;
}
.error-message{
    color: #d33c40;
}
.success-message{
    color:#32a95d;
}
</style>