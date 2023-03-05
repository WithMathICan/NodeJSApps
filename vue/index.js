// ------------------------------------- CSS
// import 'primevue/resources/themes/saga-purple/theme.css'
import 'primevue/resources/themes/lara-light-blue/theme.css'
// import 'primevue/resources/themes/saga-purple/theme.css'
// import 'primevue/resources/themes/lara-light-purple/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import './index.scss'

// -------------------------------------- JS
import { createApp } from 'vue';
import App from './src/App.vue';
import { CreateMenuItems } from './src/menu-items';
import { API_PATH } from './config'
import { createRouter, createWebHistory } from 'vue-router'
import { CreateRoutes } from './src/router';
import { CreateApi } from './src/api';
import { ClearMessages } from './src/messages'

import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Calendar from 'primevue/calendar';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Card from 'primevue/card'
import Image from 'primevue/image'
import Dropdown from 'primevue/dropdown'

const primevueComponents = [DataTable, Column, Calendar, MultiSelect, Button, InputText, InputNumber, Card, Image, Dropdown]


async function start() {
   try {
      const data = await fetch(`${API_PATH}/init`, { method: 'POST', body: '{}', headers: { 'Accept': 'application/json' } })
      if (!data.ok) return;
      // console.log(data);
      const { result } = await data.json()
      if (!result) return console.log('Ошибка при получении данных с сервера');
      CreateMenuItems(result)
      CreateApi(result, API_PATH)
      const routes = CreateRoutes(result)
      const router = createRouter({ history: createWebHistory(), routes })
      router.beforeEach(() => {
         ClearMessages()
      })
      const app = createApp(App)
      app.use(PrimeVue);
      app.use(ConfirmationService);
      app.use(router);
      primevueComponents.forEach(el => {
         app.component(el.name, el)
      })
      app.mount('#root');
   } catch (e) {
      console.log(e);
   }
}

start()




