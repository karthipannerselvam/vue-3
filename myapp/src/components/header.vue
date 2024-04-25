<template>
    <div>
    <h1>Header</h1>
    <button v-on:click="logout">Logout</button>
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