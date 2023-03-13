<template>
   <Menubar :model="menuItems" />
   <div class="container p-2 main-container">
      <router-view />
      <div id="toast-container">
         <transition-group name="p-message" tag="div">
            <Message
               v-for="msg of messages"
               :key="msg.id"
               :life="msg.life"
               :closable="msg.closable"
               :severity="msg.severity"
               @close="msgClose(msg.id)"
            >
               <b>{{ msg.content }}</b>
            </Message>
         </transition-group>
      </div>
   </div>
</template>

<script setup>
import { menuItems } from './menu-items'
import Menubar from 'primevue/menubar';
import { messages, msgClose } from './messages'
import Message from 'primevue/message'
</script>

<style lang="scss">
#toast-container{
   position: fixed;
   bottom: 0;
   left: 0;
   width: 100%;
   padding: 0 10px;
}
.main-container {
   margin-bottom: 16rem;
}
</style>

