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
         let date = new Date(bean[col.column_name])
         bean[col.column_name] = date
         return new Intl.DateTimeFormat("ru", { dateStyle: 'short', timeStyle: 'short' }).format(date)
      }

      return {showDate}
   }
})


</script>