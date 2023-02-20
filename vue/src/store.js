import { reactive, ref } from 'vue'
import { api } from './api.js'
import { showMessage } from './messages.js'

/**
 * @param {string} schema
 * @param {string} table
 * @returns {string}
 */
export const spTableKey = (schema, table) => `${schema}.${table}`

/** @type {{[x:string]: import('vue/types').Col[]}} */
export const spColsData = reactive({})

/** @type {{[x:string]: import('vue/types').DbRecord[] }} */
export const spBeans = reactive({})

/** @type {{[x:string]: boolean}} */
export const spBeansLoading = reactive({})

export const loading = ref(false)

/**
 * @param {string} schema
 * @param {string} table
 * @param {*} spCols
 * @param {*} getMethod
 * @param {boolean} refresh
 * @returns {Promise<import('vue/types').Col[]>}
 */
async function FillCols(schema, table, spCols, getMethod, refresh) {
   const key = spTableKey(schema, table)
   if (spCols[key] && !refresh) return spCols[key];
   if (spCols[key] === 'loading') return [];
   spCols[key] = 'loading'
   spCols[key] = await getMethod()
   return spCols[key]
}

/**
 * @param {string} schema
 * @param {string} table
 * @param {boolean} refresh
 * @returns
 */
export function FillColsData(schema, table, refresh = false) {
   return FillCols(schema, table, spColsData, api[schema][table].GetCols, refresh)
}

/**
 * @param {string} schema
 * @param {string} table
 * @param {boolean} refresh
 * @returns
 */
export async function FillBeans(schema, table, refresh = false) {
   const key = spTableKey(schema, table)
   if (Array.isArray(spBeans[key]) && !refresh) return;
   if (spBeansLoading[key]) return;
   spBeansLoading[key] = true
   spBeans[key] = await api[schema][table].GetBeans()
   spBeansLoading[key] = false
}

/**
 * @param {string} schema
 * @param {string} table
 * @param {import('vue/types').DbRecord} bean
 * @returns
 */
export function UpdateBeans(schema, table, bean) {
   const key = spTableKey(schema, table)
   if (!bean || !bean.id || !Array.isArray(spBeans[key])) return
   const oldBean = spBeans[key].find(el => el.id === bean.id)
   if (oldBean) {
      for (const bkey in oldBean) if (bkey in bean) oldBean[bkey] = bean[bkey]
   } else {
      spBeans[key] = [bean, ...spBeans[key]]
   }
}

/**
 * @param {string} schema
 * @param {string} table
 * @param {string[]} ids
 * @param {Function} callback
 */
export function RemoveBeans(schema, table, ids, callback = () => {}) {
   const key = spTableKey(schema, table)
   api[schema][table].RemoveBeans(ids).then(deletedIds => {
      if (!Array.isArray(deletedIds)) return showMessage('Ошибка при удалении', 5000, 'error')
      if (Array.isArray(spBeans[key])) spBeans[key] = spBeans[key].filter(el => !deletedIds.includes(el.id))
      callback(deletedIds)
   })
}

