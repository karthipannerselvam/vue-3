<template>
    <div>
    <div class="head">
     <img src="" alt="">
    <button v-on:click="logout">Logout</button>
</div>

</div>
</template>
<script>
export default {
    name:'Header',
    methods:{
        logout(){
            localStorage.clear();
            this.$router.push({name:'Login'})
        }
    }
}
</script>
<style scoped>
.head{
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 50px;
    
}
button {
  margin-right: 10px;
}


</style>