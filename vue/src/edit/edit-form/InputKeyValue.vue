<template>
<div>
   <Card>
      <template #title>Аттрибуты</template>
      <template #content>
         <div class="grid2 mb-2" v-for="k in usedKeys">
            <div>{{ k }}</div>
            <div class="p-inputgroup">
               <InputText v-model="modelValue[k]" />
               <Button icon="pi pi-times" class="p-button-danger" @click="removeAttribute(k)"/>
            </div>
         </div>
         <div class="grid2">
            <Button icon="pi pi-plus" class="p-button-rounded p-button-success m-2" label="Добавить аттрибут" @click="addAttribute"></Button>
            <Dropdown class="w-full" v-model="selectedAttribute" :options="showOptions" optionLabel="title" 
               optionValue="title" :filter="(showOptions.length>8)" placeholder="Выбрать аттрибут" />
         </div>
      </template>
   </Card>
</div>
</template>

<script setup>
import { FillBeans, spBeans, spTableKey } from '../../store';
import { onMounted, ref, computed } from 'vue'
import { showMessage } from '../../messages';


const props = defineProps(['key_schema', 'key_table', 'modelValue'])
const emit = defineEmits(['update:modelValue'])
const selectedAttribute = ref()
const usedKeys = computed(() => {
   if (!props.modelValue) {
      emit('update:modelValue', {})
      return []
   }
   return Object.keys(props.modelValue)
})
const showOptions = computed(() => {
   let tableKey = spTableKey(props.key_schema, props.key_table)
   const beans = spBeans[tableKey]
   if (Array.isArray(beans)) return beans.filter(el => !usedKeys.value.includes(el.title))
   return []
})
onMounted(() => {
   FillBeans(props.key_schema, props.key_table)
   
})
function addAttribute(){
   if (usedKeys.value.includes(selectedAttribute.value)){
      showMessage('Данный аттрибут уже использован', 10000, 'error')
      return
   }
   
   props.modelValue[selectedAttribute.value] = ''
   emit('update:modelValue', props.modelValue)
}
function removeAttribute(name){
   delete props.modelValue[name]
}
</script>

<style scoped>
.grid2 {
   display: grid;
   grid-template-columns: 1fr 1fr;
   align-items: center;
}
</style>
