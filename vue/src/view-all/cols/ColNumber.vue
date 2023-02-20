<template>
   <span>{{bean[col.column_name]}}</span>
</template>

<script>
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
   props: ['bean', 'col'],

   /** @param {{bean: any, col: import('../../../../smart-panel/classes/Col').Col}} props */
   setup({bean, col}){
      onMounted(() => bean[col.column_name] = +bean[col.column_name])
   }
})
</script>