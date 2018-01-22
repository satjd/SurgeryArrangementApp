import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import DataTables from 'vue-data-tables'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import FullCalendar from 'vue-full-calendar'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale })
Vue.use(FullCalendar)
Vue.use(DataTables)

Vue.config.productionTip = false

window.jQuery = window.$ = require('jquery')
require('webpack-jquery-ui')

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
