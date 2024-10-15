<template>
    <div class="main">
    <div class="login-container">
        
        <div class="login">
            <h1> Admin Login</h1>
  
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
            <p v-if="error" class="error-message">Please fill out all the required fields!</p>
            <button v-on:click="login">Login</button>
            <button class="signin" @click="$router.push('/asign-up')">Sign Up</button>
            <button class="admin" @click="$router.push('/log-in')">User</button>
        </div>
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
html{
    background-color: black;
  }
  .main{
    background-color: black;
    display: flex;
    height: 1000px;
    flex-direction: column;
  }
h1{
    color: white;
    margin-top: 50px;
    text-align: center;
}
.login-container {
    width: 30%;
    margin: auto;
    height: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding-bottom: 50px;
    transition: all 0.3s ease;
}
.login{
    color: #f2f2f2;
    margin-top: 150px;
    background-color: black;
    border: 2px solid rgba(255, 255, 255, 0.2);
    padding: 20px;
    border-image: linear-gradient(45deg, #ff8a80, #8a80ff) 1;
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
input{
    color: white;
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