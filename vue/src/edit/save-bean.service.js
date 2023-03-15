import { UpdateBeans } from '../store'
import { ref, watch } from 'vue'
import { api } from '../api'

/** @param {import('../../../sp-core/types').Col[]} colsData */
function findBean0(colsData) {
   /** @type {import('../../../common/types').DbRecord} */ const record = {};
   for (const col of colsData) if (col.column_default !== null) {
      if (col.data_type === 'date') {
         if (col.column_default.toLowerCase() === 'now()') record[col.column_name] = new Date()
         const date = Date.parse(col.column_default)
         record[col.column_name] = date ? new Date(date) : new Date()
      } else if (col.data_type === 'number') record[col.column_name] = +col.column_default
      else record[col.column_name] = col.column_default
   }
   return record
}

/** @type {import('./save-bean.service').FCreateSaveData} */
export const createSaveData = (props, actionType) =>  {
   /** @type {import('vue').Ref<import('../../../common/types').DbRecord>} */
   const bean = ref({})
   /** @type {import('vue').Ref<import('../../../sp-core/types').Col[]>} */
   const cols = ref([])
   const isBeanChanged = ref(false)

   let isExecuting = false
   watch(() => bean, () => { if (!isExecuting) isBeanChanged.value = true; }, { deep: true })

   const init = async () => {
      cols.value = (await api[props.schema][props.table].GetCols())
      if (actionType === 'insert') bean.value = findBean0(cols.value)
      else if ((actionType === 'copy' || actionType === 'update') && props.id !== undefined) {
         bean.value = await api[props.schema][props.table].GetBean(props.id)
         delete bean.value.id
      }
   }

   const save = () => new Promise(resolve => {
      const afterSave = (/** @type {import("../../../common/types").DbRecord | null} */ data) => {
         if (data && data.id) {
            bean.value = data
            UpdateBeans(props.schema, props.table, data)
            resolve(data)
         }
         setTimeout(() => { isBeanChanged.value = false; isExecuting = false; }, 0)
      }
      isExecuting = true
      if (actionType === 'copy' || actionType === 'insert') {
         api[props.schema][props.table].InsertBean(bean.value).then(afterSave)
      }
      if (actionType === 'update' && props.id !== undefined) {
         api[props.schema][props.table].UpdateBean(props.id, bean.value).then(afterSave)
      }
   })

   return { bean, cols, save, init, isBeanChanged }
}
