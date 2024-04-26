<template>
    <div>
        <h1> Admin Login</h1>
        <div class="head">
        <button class="admin" @click="$router.push('/log-in')">User</button>
        </div>
        <div class="login">
  
            <input type="text" v-model="email"  placeholder="Enter Email">
            <input type="password" v-model="password"  placeholder="Enter Password">
            <button v-on:click="login">Login</button>
            <button class="signin" @click="$router.push('/asign-up')">Sign Up</button>
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
            password:''
        }
    },
    methods:{
        async login(){
            let result = await axios.get(`http://localhost:3000/admin?email=${this.email}&password=${this.password}`)

            console.warn(result)
            if(result.status==200 && result.data.length>0){
                localStorage.setItem("user-info",JSON.stringify(result.data[0]))
                this.$router.push({name:"SlotMain"})
            }
        }
    },
    mounted(){
        let user=localStorage.getItem('user-info');
        if(user){
            this.$router.push({name:"SlotMain"})
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
</style>