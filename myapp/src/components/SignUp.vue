<template>
    <div>
        <h1>Sign Up</h1>
        <div class="head">
            <button class="admin" @click="$router.push('/asign-up')">Admin</button>

    </div>
        <div class="register">
            <input type="text" v-model="name" placeholder="Enter Name">
            <input type="text" v-model="email"  placeholder="Enter Email">
            <input type="password" v-model="password"  placeholder="Enter Password">
            <button v-on:click="signUp">Sign Up</button>
            <button class="login" @click="$router.push('/log-in')">Login</button>
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
            password:''
        }
    },
    methods:{
        async signUp(){
            let result= await axios.post("http://127.0.0.1:3030/user",{
                email:this.email,
                password:this.password,
                username:this.name
            });

            console.warn(result);
            if(result.status==200){
                localStorage.setItem("user-info",JSON.stringify(result.data))
                this.$router.push({name:"Home"})
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