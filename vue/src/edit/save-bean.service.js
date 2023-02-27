import { UpdateBeans } from '../store'
import {reactive, ref, watch, watchEffect} from 'vue'
import {api} from '../api'

/** @param {import('../../../smart-panel/classes/Col').Col[]} colsData */
async function findBean0(colsData){
   /** @type {import('../../../common/types').DbRecord} */ let record = {};
   for (let col of colsData) if (col.column_default !== null) {
      if (col.data_type === 'date'){
         if (col.column_default.toLowerCase() === 'now()') record[col.column_name] = new Date()
         let date = Date.parse(col.column_default)
         record[col.column_name] = date ? new Date(date) : new Date()
      }
      else if (col.data_type === 'number') record[col.column_name] = +col.column_default 
      else record[col.column_name] = col.column_default
   }
}

/** @type {import('./save-bean.service').FCreateSaveData} */
export const createSaveData = (props, actionType) =>  {
   let bean = ref({})
   /** @type {import('vue').Ref<import('../../../smart-panel/classes/Col').Col[]>} */
   let cols = ref([])
   const isBeanChanged = ref(false)

   watch(() => bean, () => isBeanChanged.value = true, {deep: true})

   const init = async () => {
      cols.value = await api[props.schema][props.table].GetCols()
      if (actionType === 'insert') bean.value = findBean0(cols.value)
      else if ((actionType === 'copy' || actionType === 'update') && props.id !== undefined){
         bean.value = await api[props.schema][props.table].GetBean(props.id)
      }
   }
   
   const save = () => new Promise(resolve => {
      const afterSave = (/** @type {import("../../../common/types").DbRecord | null} */ data) => {
         isBeanChanged.value = false
         if (data && data.id){
            UpdateBeans(props.schema, props.table, data)
            resolve(data)
         }
      }
      if (actionType === 'copy' || actionType === 'insert'){
         api[props.schema][props.table].InsertBean(bean.value).then(afterSave)
      }
      if (actionType === 'update' && props.id !== undefined) {
         api[props.schema][props.table].UpdateBean(props.id, bean.value).then(afterSave)
      }
   })

   return {bean, cols, save, init, isBeanChanged}
   
}