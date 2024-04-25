<template>
    <div>
        <h1>Admin Sign Up</h1>
        <div class="head">
            <button class="admin" @click="$router.push('/sign-up')">User</button>
    </div>
        <div class="register">
            <input type="text" v-model="name" placeholder="Enter Name">
            <input type="text" v-model="email"  placeholder="Enter Email">
            <input type="password" v-model="password"  placeholder="Enter Password">
            <input type="text" v-model="secretkey" placeholder="Enter Secret key">
            <button v-on:click="signUp">Sign Up</button>
            <button class="login" @click="$router.push('/alog-in')">Login</button>
            
            <p  v-if="invalidSecretKey" style="color: red;">Invalid secret key!</p>
            
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
        }
    },
    methods:{
        async signUp()
        {
        this.invalidSecretKey = false;
        if (this.secretkey !== 'abcd') {
        this.invalidSecretKey = true;
        console.error('Invalid secret key.');
        return;
        }

        try{

            let result= await axios.post("http://localhost:3000/admin",{
                email:this.email,
                password:this.password,
                name:this.name
            });

            console.warn(result);
            if(result.status==201){
                localStorage.setItem("user-info",JSON.stringify(result.data))
                this.$router.push({name:"Home"})
            }
        }
        catch(error){
            console.error('Error during signup:', error);
        }
            
        }
    },
    mounted(){
        let user=localStorage.getItem('user-info');
        if(user){
            this.$router.push({name:"Home"})
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
</style>