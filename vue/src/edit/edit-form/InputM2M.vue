<template>
   <MultiSelect class="w-full" v-model="bean[col.column_name]" :required="!col.is_nullable"
      :options="showOptions" 
      :optionValue="'id'" :filter="(showOptions.length>8)">
      <template #option="slotProps">
        <div class="flex align-items-center">
            <div>{{ findLabel(slotProps.option) }}</div>
        </div>
    </template>
   </MultiSelect>
</template>

<script setup>
import { FillBeans, spTableKey, spBeans } from '../../store.js';
import {computed} from 'vue'
import MultiSelect from 'primevue/multiselect';

/** @type {{bean: any, col: import('types').Col}} */ // @ts-ignore
let props = defineProps(['bean', 'col']) 
FillBeans(props.col.table_schema, props.col.m2m.table)
let key = spTableKey(props.col.table_schema, props.col.m2m.table)
let showOptions = computed(() => {
   if (Array.isArray(spBeans[key])) return spBeans[key].sort((a, b) => {
      if (findLabel(a) > findLabel(b)) return 1
      return -1
   })
   return []
})

function findLabel(bean) {
   const title_column = props.col.m2m.title_column
   if (typeof title_column === 'string') return bean[title_column]
   else if (Array.isArray(title_column)) {
      // @ts-ignore
      return title_column.map(el => bean[el]).join('__')
   } else return 'NoLabel'
}
</script>
