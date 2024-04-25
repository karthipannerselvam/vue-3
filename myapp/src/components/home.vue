<template>
    <div>
        <Header/>
    <h1>Hello User,welcome on home page</h1>
    </div>
</template>
<script>
import Header from './header.vue'
export default{
    name:"Home",
    components:{
        Header
    },
    mounted(){
        let user=localStorage.getItem('user-info');
        if(!user){
            this.$router.push({name:"SignUp"})
        }
        
    }
}
</script>