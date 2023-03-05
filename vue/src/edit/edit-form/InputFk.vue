<template>
   <Dropdown class="w-full" v-model="bean[col.column_name]" :required="!col.is_nullable"
      :options="showOptions" :optionLabel="fk.foreign_title_column_name" 
      :optionValue="fk.foreign_column_name" :filter="(showOptions.length>8)" />
</template>

<script setup>
import { FillBeans, spBeans, spTableKey } from '../../store';
import Dropdown from 'primevue/dropdown'
import { computed } from '@vue/reactivity';

/** @type {{bean: any, col: import('types').Col}} */ // @ts-ignore
let props = defineProps(['bean', 'col']) 
let {fk} = props.col

FillBeans(fk.foreign_table_schema, fk.foreign_table_name)
let key = spTableKey(fk.foreign_table_schema, fk.foreign_table_name)
let showOptions = computed(() => {
   if (Array.isArray(spBeans[key])) {
      let arr = spBeans[key].sort((a, b) => {
         if (a[fk.foreign_title_column_name] > b[fk.foreign_title_column_name]) return 1
         else if (a[fk.foreign_title_column_name] === b[fk.foreign_title_column_name]) return 0
         return -1
      })
      // console.log(props);
      if (props.col.fk.foreign_table_schema === props.col.table_schema && props.col.fk.foreign_table_name === props.col.table_name) {
         arr = arr.filter(el => {
            return el.id != props.bean.id
         })
      }
      return arr
   }
   return []
})
</script>