<template>
    <div class="main">
    <div class="login-container">
        
        <div class="login">
            <h1> Admin Login</h1>
            <div class="button-group">
            <button class="user" @click="$router.push('/')">User</button>
            <button class="admin" @click="$router.push('/alog-in')">Admin</button>
            </div>
            <label for="rollno" class="input-label">Enter Email</label>
            <input type="text" v-model="email" 
            :class="{'has-error':submitting&& invalidEmail}"
             @focus="clearStatus"
             @keypress="clearStatus"
             class="border-input">
            <label for="password" class="input-label">Enter Password</label>
            <input type="password" v-model="password" 
            :class="{'has-error':submitting && invalidPassword}"
             @focus="clearStatus"
             @keypress="clearStatus"
             class="border-input">
            <p v-if="error" class="error-message">Please fill out all the required fields!</p>
            <button v-on:click="login" class="full-width-button">Login</button>
            <p class="signup-prompt">Don't have an account already? 
            <span class="signup-link" @click="$router.push('/asign-up')">Sign Up</span>
            </p>
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
html {
  background-color: rgb(255, 255, 255);
}
.main {
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items horizontally */
}
.login-container {
  width: 30%;
  margin: auto;
  height: auto; /* Adjust height based on content */
  border-radius: 8px;
  padding-bottom: 50px;
  transition: all 0.3s ease;
}
.login {
  color: #f2f2f2;
  margin-top: 100px;
  background-color: #aca7cb;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 10px;
}
.input-label {
  color: white;
  margin: 10px 0 5px; /* Space above the label */
}
input {
  color: white;
  width: 100%; /* Full width for input fields */
  padding: 10px;
  border: none; /* Remove default border */
  border-bottom: 2px solid #fff; /* Only bottom border */
  margin-bottom: 20px; /* Space below input */
  background-color: transparent; /* Make background transparent */
}



input:hover {
  border: none;
  border-bottom: 2px solid #fff; /* Keep the bottom border the same on hover */
}

h1 {
  color: #f2f2f2;
  margin-top: 50px;
  text-align: center;
}

.full-width-button {
  width: 100%; /* Full width for login button */
  margin-bottom: 10px; /* Space below button */
}
button {
  background-color: #474554;
  border: none;
}
.button-group {
  display: flex;
  justify-content: space-between; /* Space buttons apart */
  margin-bottom: 20px; /* Space below the button group */
}

.user,
.admin {
  flex: 1; /* Equal width for both buttons */
  margin: 0 5px; /* Small margin between buttons */
  padding: 10px; /* Add padding for buttons */
}

.signup-prompt {
  text-align: center; /* Center text */
  margin-top: 20px; /* Space above the prompt */
}

.signup-link {
  color: #007bff; /* Blue color for the link */
  cursor: pointer; /* Pointer cursor for link */
  text-decoration: underline; /* Underline for link */
}

.error-message {
  color: #d33c40;
  margin-bottom: 15px;
}

/* Media queries for responsiveness */
@media screen and (max-width: 1024px) {
  .login-container {
    width: 50%;
    margin-top: 100px;
  }
}

@media screen and (max-width: 768px) {
  .login-container {
    width: 70%;
    margin-top: 80px;
    padding: 15px;
  }
}

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

  .user,
  .admin {
    padding: 8px; /* Smaller padding for buttons */
  }
}
</style>