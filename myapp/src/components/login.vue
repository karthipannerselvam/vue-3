<template>
  <div class="main">
    <div class="login-container">
      
      <div class="login">
        <h1>Login</h1>
        <input type="text" v-model="rollno" 
          :class="{'has-error':submitting && invalidRollno}"
          @focus="clearStatus"
          @keypress="clearStatus"
          placeholder="Enter Roll Number">
        <input type="password" v-model="password" 
          :class="{'has-error':submitting && invalidPassword}"
          @focus="clearStatus"
          @keypress="clearStatus"
          placeholder="Enter Password">
        <p v-if="submitting && error" class="error-message">{{ errorMessage }}</p>
  
        <button v-on:click="login">Login</button>
        <button class="signin" @click="$router.push('/sign-up')">Sign Up</button>
        <button class="admin" @click="$router.push('/alog-in')">Admin</button>
      </div>
    </div>
  </div>
  </template>
  

  <script>
  import axios from 'axios'
  
  export default {
    name: 'Login',
    data() {
      return {
        rollno: '',
        password: '',
        submitting: false,
        success: false,
        error: false,
        errorMessage: ''
      }
    },
    
    methods: {
      clearStatus() {
        this.success = false;
        this.error = false;
      },
      async login() {
        this.submitting = true;
        this.clearStatus();
        if (this.invalidRollno || this.invalidPassword) {
          this.error = true;
          this.errorMessage = 'Please enter your roll number and password.';
          console.log('Error: Empty fields');
          return;
        }
  
        try {
          const response = await axios.post('http://localhost:3030/api/login', {
            rollno: this.rollno,
            password: this.password
          });
          console.log('API Response:', response);
          if (response.status === 200 && response.data.success) { 
            const token = response.data.token;
            if (token) {
              localStorage.setItem('token', token);
              console.log('Token stored:', token);  
              this.$router.push({ name: 'Home' });
            } else {
              console.error('No token returned from login');
            }
          } else if (response.status === 401) {
            this.error = true;
            this.errorMessage = 'Invalid Roll Number or password';
          }
        } catch (error) {
          this.error = true;
          this.errorMessage = error.response?.data?.message || 'An error occurred during login.';
          console.error('Error logging in:', error);
        }
  
        this.submitting = false;
      }
    },
    
    mounted() {
      let user = localStorage.getItem('token');
      if (user) {
        this.$router.push({ name: 'Home' });
      }
    },
    
    computed: {
      invalidRollno() {
        return this.rollno === '';
      },
      invalidPassword() {
        return this.password === '';
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
  input{
    color: white;
  }
  
  h1 {
    color: #f2f2f2;
    margin-top: 50px;
    text-align: center;
  }
  
  button {
    margin-right: 10px;
  }
  
  .signin {
    background: rgb(169, 201, 228);
    border: rgb(169, 201, 228);
    cursor: pointer;
  }
  
  .admin {
    margin-left: 100px;
  }
  
  [class*='-message'] {
    font-weight: 500;
  }
  
  .error-message {
    color: #d33c40;
    margin-bottom: 15px;
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
  