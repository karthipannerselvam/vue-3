<template>
    <div class="main">
        <div class="register">
            <h1>Sign Up</h1>
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
            <button class="admin" @click="$router.push('/asign-up')">Admin</button>
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
  color:white;
}
.main{
    background-color: black;
    display: flex;
    height: 1000px;
    flex-direction: column;
  }

.register {
    color: #f2f2f2;
    margin: auto;
    width: 30%;
    margin-top: 150px;
    background-color: black;
    border: 2px solid rgba(255, 255, 255, 0.2);
    padding: 20px;
    border-image: linear-gradient(45deg, #ff8a80, #8a80ff) 1;
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
input{
    color: white;
}

.admin {
    margin-left: 100px;
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
@media screen and (max-width: 1024px) {
    .login-container {
      width: 50%;
      margin-top: 100px;
    }
  }
  
  /* For mobile devices (landscape) */
  @media screen and (max-width: 768px) {
    .login-container {
      width: 70%;
      margin-top: 80px;
      padding: 15px;
    }
  
    .admin {
      margin-left: 60px; /* Adjust for better button alignment */
    }
  }
  
  /* For mobile devices (portrait) */
  @media screen and (max-width: 480px) {
    .login-container {
      width: 90%;
      margin-top: 60px;
      padding: 10px;
    }
  
    h1 {
      margin-top: 30px;
      font-size: 20px;
    }
  
    button {
      margin-right: 5px;
      padding: 10px 15px;
    }
  
    .admin {
      margin-left: 40px; /* Adjust for smaller screens */
    }
  }
  
</style>