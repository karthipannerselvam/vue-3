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
    
    display: flex;
    justify-content: space-between;
    margin-bottom: 50px;
    background-color: black;
    
}
button {
  margin-top: 20px;
  margin-right: 10px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.248);
  border-image: linear-gradient(45deg, #ff8a80, #8a80ff) 1;
}


</style>