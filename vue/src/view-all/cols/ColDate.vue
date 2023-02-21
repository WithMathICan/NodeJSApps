<!-- eslint-disable vue/no-mutating-props -->
<template>
   <span>{{showDate()}}</span>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
   props: ['bean', 'col'],

   /** @param {{bean: any, col: import('types').Col}} props */
   setup({bean, col}) {
      function showDate() {
         let date = setDate()
         return new Intl.DateTimeFormat("ru", { dateStyle: 'short', timeStyle: 'short' }).format(date)
      }

      function setDate(){
         if (typeof bean[col.column_name] === 'string'){
            bean[col.column_name] = new Date(bean[col.column_name])
         }
         return bean[col.column_name]
      }

      return {showDate}
   }
})


</script>