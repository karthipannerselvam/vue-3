<template>
    <div class="login-container">
        <h1> Admin Login</h1>
       
        <div class="login">
  
            <input type="text" v-model="email" 
            :class="{'has-error':submitting&& invalidEmail}"
             @focus="clearStatus"
             @keypress="clearStatus"
            placeholder="Enter Email">
            <input type="password" v-model="password" 
            :class="{'has-error':submitting && invalidPassword}"
             @focus="clearStatus"
             @keypress="clearStatus"
            placeholder="Enter Password">
            <p v-if="submitting && error" class="error-message">Please fill out all the required fields!</p>
            <button v-on:click="login">Login</button>
            <button class="signin" @click="$router.push('/asign-up')">Sign Up</button>
            <button class="admin" @click="$router.push('/log-in')">User</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name:'AdminLogin',
    data(){
        return{
            email:'',
            password:'',
            submitting:false,
            success:false,
            error:false
        }
    },
    methods: {
                async login() {
                    this.submitting=true;
                    this.clearStatus();
                    if(this.invalidEmail || this.invalidPassword){
                        this.error=true;
                        console.log('Error: Empty fields');
                        return;
                    }
                try {
                    const response = await axios.post('http://localhost:3030/api/alogin', {
                    email: this.email,
                    password: this.password
                    });
                    
                    
                   
                    if (response.status === 200 && response.data.success) {
                    const token = response.data.adminToken;
                    
                        if (token) {
                            localStorage.setItem('adminToken', token);
                            this.$router.push({ name: "SlotMain" });
                        } else {
                            console.warn('Token is undefined');
                        } 
                    } else {
                 
                        console.warn("Login failed");
                    }
                } catch (error) {
                    this.error=true;
                    console.error('Error logging in:', error);
    
                }
                this.submitting = false;
                },
                clearStatus(){
                    this.success=false;
                    this.error=false;
                }
            },
    mounted(){
        let user=localStorage.getItem('user-info');
        if(user){
            this.$router.push({name:"SlotMain"})
        }
        
    },
    computed:{
        invalidEmail(){
            return this.email==='';
        },
        invalidPassword(){
            return this.password==='';
        }
    }
}
</script>
<style scoped>
h1{
    margin-top: 50px;
    text-align: center;
}
.login-container {
  width: 30%;
  margin: auto;
  margin-top: 150px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  padding-bottom: 50px;
}
button{
    margin-right: 10px;
}
.head {
  display: flex; 
  justify-content: center; 
  margin-top: -60px;
  margin-right: 20px;
}
.signin{
    background: rgb(169, 201, 228);
    border: rgb(169, 201, 228);
    cursor: pointer;
}
.admin {
    margin-left: 112px; 

}
[class*='-message']{
    font-weight: 500;
}
.error-message{
    color: #d33c40;
}
</style>