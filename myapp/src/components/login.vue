<template>
    <div>
        <h1>Login</h1>
        <div class="head">
        <button class="admin" @click="$router.push('/alog-in')">Admin</button>
        </div>
        <div class="login">
  
            <input type="text" v-model="email"  placeholder="Enter Email">
            <input type="password" v-model="password"  placeholder="Enter Password">
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
            password:''
        }
    },
    methods:{
        async login(){
            let result = await axios.get(`http://localhost:3030/user?email=${this.email}&password=${this.password}`)

            console.warn(result)
            if(result.status==200 && result.data.length>0){
                localStorage.setItem("user-info",JSON.stringify(result.data[0]))
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