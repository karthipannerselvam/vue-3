<template>
    <div>
        <h1>Login</h1>
        <div class="head">
        <button class="admin" @click="$router.push('/alog-in')">Admin</button>
        </div>
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
            <p v-if="submitting && error" class="error-message">{{ errorMessage }}</p>

            <button v-on:click="login">Login</button>
            <button class="signin" @click="$router.push('/sign-up')">Sign Up</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name:'Login',
    data(){
        return{
            email:'',
            password:'',
            submitting:false,
            success:false,
            error:false,
            errorMessage: ''
        }
    },
   
    methods: {
                async login() {
            this.submitting=true;
            this.clearStatus();
            if(this.invalidEmail || this.invalidPassword){
                this.error=true;
                this.errorMessage = 'Please enter your email and password.';
                console.log('Error: Empty fields');
                return;
            }

                try {
                    const response = await axios.post('http://localhost:3030/api/login', {
                    email: this.email,
                    password: this.password
                    });
                    this.success = true;
                    if (response.status === 200 && response.data.success) {
                    localStorage.setItem("user-info",JSON.stringify(response.data[0]))
                    this.$router.push({ name: "Home" }); 
                    } 
                    if(response.status===401) {
                        this.error = true;
                        this.errorMessage = 'Invalid Email or password';

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
            this.$router.push({name:"Home"})
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
    text-align: center;
}
.login{
    padding: 50px;
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
</style>