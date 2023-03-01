<template>
   <div>{{ data }}</div>
</template>

<script>
import {computed, defineComponent, onMounted} from 'vue'
import {FillBeans, spBeans, spTableKey} from '../../store.js'

export default defineComponent({
   props: ['col', 'bean'],
   /** @param {{col: import('types').Col, bean: any}} props */ //@ts-ignore
   setup(props){
      onMounted(() => {
         console.log({props})
         FillBeans(props.col.table_schema, props.col.m2m.table)
      })
      
      let key = spTableKey(props.col.table_schema, props.col.m2m.table)
      const data = computed(() => {
         if (Array.isArray(spBeans[key])) {
            return spBeans[key]
               .filter(el => props.bean[props.col.column_name].includes(el.id))
               .map(el => el[props.col.m2m.title_column])
               .join(',')
         }
         return ''
      })

      return {data}
   }
})
</script>
