import { showMessage } from './messages';
import { loading } from './store';


/** @type {import("./api").TSpApi} */
export const api = {}

/**
 *
 * @param {string} url
 * @param {any} body
 * @returns
 */
export const post = async (url, body = '') => {
   loading.value = true
   try {
      const data = await fetch(url, { method: 'POST', body, headers: { 'Accept': 'application/json' } })
      if (!data.ok) {
         const { message } = await data.json()
         throw new Error(message ?? 'Ошибка сервера')
      } else {
         const { result, message } = await data.json()
         if (message) showMessage(message, 5000, 'success')
         return result
      }
   } catch (/** @type {any} */ e) {
      showMessage(e.message, 15000, 'error')
      throw e
   } finally {
      loading.value = false
   }
}

/**
 *
 * @param {Record<string, string[]>} tables
 * @param {string} API_PATH
 */
export function CreateApi(tables, API_PATH) {
   for (const schema in tables) {
      api[schema] = {}
      for (const table of tables[schema]) {
         api[schema][table] = {
            GetCols: () => post(`${API_PATH}/${schema}/${table}/cols`),
            GetBeans: () => post(`${API_PATH}/${schema}/${table}/beans`),
            GetBean: id => post(`${API_PATH}/${schema}/${table}/bean`, JSON.stringify({ id })),
            InsertBean: bean => post(`${API_PATH}/${schema}/${table}/insert`, JSON.stringify(bean)),
            UpdateBean: (id, bean) =>  post(`${API_PATH}/${schema}/${table}/update`, JSON.stringify({ id, bean })),
            RemoveBeans: ids => post(`${API_PATH}/${schema}/${table}/remove-many`, JSON.stringify({ ids })),
         }
      }
   }
}
