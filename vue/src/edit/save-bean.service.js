import { showMessage } from 'src/messages'
import { UpdateBeans } from 'src/store'
import {ref, watch} from 'vue'
import {api} from '../api'

/** @type {import('./save-bean.service').FCreateSaveData} */
const createSaveData = async (args) =>  {
   try{
      let beanApi = api[args.schema][args.table]
      if (!beanApi) throw new Error('Api for this record type is not found!')
      let colsData = await beanApi.GetCols()
      /** @type {import('../../../common/types').DbRecord} */ let record = {};
      if (args.actionType === 'insert') {
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
      else if (args.actionType === 'update' || args.actionType === 'copy') {
         record = await beanApi.GetBean(args.id)
      }

      const bean = ref(record)
      const cols = ref(colsData)
      const isBeanChanged = ref(false)
      watch(() => bean, a => console.log(a))

      const save = () => new Promise(resolve => {
         if (args.actionType === 'copy' || args.actionType === 'insert'){
            beanApi.InsertBean(bean.value).then(data =>{
               if (data && data.id){
                  UpdateBeans(args.schema, args.table, data)
                  resolve(data)
               }
            })
         }
         if (args.actionType === 'update') {
            beanApi.UpdateBean(args.id, bean.value).then(data =>{
               if (data && data.id){
                  UpdateBeans(args.schema, args.table, data)
                  resolve(data)
               }
            })
         }
      })

      return {bean, cols, save}
   } catch (/** @type {any} */ e){
      console.log(e);
      showMessage(e.message, 5000, 'error')
   }
}