<template>
    <div class="main">
        
        <div class="register">
            <h1>Admin Sign Up</h1>
            <div class="button-group">
              <button class="user" @click="$router.push('/sign-up')">User</button>
              <button class="admin" @click="$router.push('/asign-up')">Admin</button>
            </div>
            <label for="name" class="input-label">Enter Name</label>
            <input type="text" v-model="name" 
            :class="{'has-error':submitting&& invalidName}"
             @focus="clearStatus"
             @keypress="clearStatus"
             class="border-input" />
             <label for="email" class="input-label">Enter Email</label>
            <input type="text" v-model="email" 
            :class="{'has-error':submitting && invalidEmail}"
             @focus="clearStatus"
             @keypress="clearStatus"
             class="border-input" />
             <label for="password" class="input-label">Enter Password</label>
            <input type="password" v-model="password"
            :class="{'has-error':submitting && invalidPassword}"
             @focus="clearStatus"
             @keypress="clearStatus"
             class="border-input" />
            <label for="secretkey" class="input-label">Enter SecretKey</label>
            <input type="text" v-model="secretkey"
            :class="{'has-error':submitting && invalidSecret}"
             @focus="clearStatus"
             @keypress="clearStatus"
             class="border-input" />
            <p v-if="submitting && error" class="error-message">Please fill out all the required fields!</p>
            <p  v-if="invalidSecretKey" style="color: red;">Invalid secret key!</p>
            <button v-on:click="signUp" class="full-width-button">Sign Up</button>
            <p class="login-prompt">Do you have an account already? 
              <span class="login-link" @click="$router.push('/alog-in')">Log In</span>
            </p>
            
        </div>
    </div>
</template>
<script>
import axios  from 'axios';
export default {
    name:'Sign-Up',
    data(){
        return{
            name:'',
            email:'',
            password:'',
            secretkey:'',
            invalidSecretKey: false,
            submitting:false,
            success:false,
            error:false
        }
    },
    methods:{
        async signUp()
        {
            this.submitting=true;
            this.clearStatus();
            if(this.invalidName || this.invalidEmail || this.invalidPassword || this.invalidSecret ){
                this.error=true;
                console.log('Error: Empty fields');
                return;
            }
        this.invalidSecretKey = false;
        if (this.secretkey !== 'abcd') {
        this.invalidSecretKey = true;
        console.error('Invalid secret key.');
        return;
        }

        try{

            let result= await axios.post("http://localhost:3030/admin",{
                email:this.email,
                password:this.password,
                username:this.name
            });
            this.success = true;

            console.warn(result);
            if(result.status==200){
                localStorage.setItem("user-info",JSON.stringify(result.data))
                this.$router.push({name:"SlotMain"})
            }
        }
        catch(error){
            this.error=true;
            console.error('Error during signup:', error);
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
        invalidName(){
            return this.name==='';
        },
        invalidEmail(){
            return this.email==='';
        },
        invalidPassword(){
            return this.password==='';
        },
        invalidSecret(){
            return this.secretkey==='';
        }
    }
}
</script>
<style scoped>
html, body {
   background-color: rgb(255, 255, 255);
   margin: 0;
   padding: 0;
   font-family: Arial, sans-serif;
   height: 100%;
   overflow: hidden; /* Prevent scrolling */
}

.main {
   display: flex;
   flex-direction: column;
   justify-content: center; /* Center content vertically */
   align-items: center;
   height: 100vh; /* Full viewport height */
   padding: 20px;
   box-sizing: border-box;
}

.register {
   color: #f2f2f2;
   background-color: #aca7cb;
   width: 100%;
   max-width: 450px; 
   padding-right: 30px;
   padding-left: 30px;
   border-radius: 10px;
   box-sizing: border-box;
   margin: 0 auto; 
}

input, select {
   color: white;
   width: 100%;
   padding: 8px; /* Reduced padding */
   border: none;
   border-bottom: 2px solid #fff;
   margin-bottom: 12px; /* Reduced space between fields */
   background-color: transparent;
}

button {
   background-color: #474554;
   color: white;
   padding: 10px;
   width: 100%;
   border: none;
   border-radius: 5px;
   margin-bottom: 10px; /* Reduced button margin */
   transition: background-color 0.3s ease;
}

.full-width-button {
   width: 100%;
}

.button-group {
   display: flex;
   justify-content: space-between;
   margin-bottom: 15px;
}

.button-group button {
   width: 48%; /* Adjust the width to fit two buttons side by side */
}

h1 {
   text-align: center;
   color: white;
   margin-bottom: 20px; 
}

.error-message {
   color: #d33c40;
   margin-bottom: 10px;
}

.login-link {
   color: #007bff;
   text-decoration: underline;
   cursor: pointer;
}

@media screen and (max-width: 768px) {
   .register {
       width: 90%;
   }

   .button-group {
       flex-direction: column;
       gap: 10px;
   }

   .button-group button {
       width: 100%;
   }
}

@media screen and (max-width: 480px) {
   .register {
       width: 100%;
   }

   h1 {
       font-size: 20px;
   }
}
</style>