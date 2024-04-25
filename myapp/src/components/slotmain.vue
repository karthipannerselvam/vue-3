<template>
    <h1>Slot Main Page</h1>
</template>
<script>
export default {
    name:'SlotMain',
    mounted(){
        let user=localStorage.getItem('user-info');
        if(!user){
            this.$router.push({name:"AdminLogin"})
        }
        
    }
}
</script>