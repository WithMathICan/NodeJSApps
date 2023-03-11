<template>
   <MultiSelect class="w-full" v-model="bean[col.column_name]" :required="!col.is_nullable"
      :options="showOptions" display="chip" optionLabel="___m2m_title"
      optionValue="id" :filter="(showOptions.length>1)">
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
   if (Array.isArray(spBeans[key])) return spBeans[key].map(wrapBeanByProxy).sort((a, b) => {
      if (a['___m2m_title'] > b['___m2m_title']) return 1
      return -1
   })
   return []
})

function wrapBeanByProxy(el) {
   return new Proxy(el, {
      get: (target, key) => {
         if (key in target) return target[key]
         if (key === '___m2m_title') {
            const title_column = props.col.m2m.title_column
            if (typeof title_column === 'string') return target[title_column]
            if (Array.isArray(title_column)) return title_column.map(el => target[el]).join('__')
            return 'NoLabel'
         }
      }
   })
}
</script>
