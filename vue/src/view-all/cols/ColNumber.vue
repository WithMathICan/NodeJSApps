<template>
   <span>{{bean[col.column_name]}}</span>
</template>

<script>
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
   props: ['bean', 'col'],

   /** @param {{bean: any, col: import('types').Col}} props */
   setup({bean, col}){
      function setNumber(){
         // if (bean[col.column_name]){
            bean[col.column_name] = +bean[col.column_name]
         // }
      }
      onMounted(setNumber)
   }
})
</script>