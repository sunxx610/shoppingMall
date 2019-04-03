// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import axios from 'axios'
import {getCookie, setCookie, delCookie} from './api/cookie.js'
import {currency} from "./util/currency";
import infiniteScrooll from 'vue-infinite-scroll'
import Vuex from "vuex";
import 'lib-flexible'

Vue.use(Vuex);
Vue.use(infiniteScrooll);
Vue.prototype.axios = axios;
Vue.filter("currency", currency);

Vue.prototype.$cookieStore = {
  getCookie,
  setCookie,
  delCookie
};

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  store.commit('hideAllList')
  next()
})

new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
