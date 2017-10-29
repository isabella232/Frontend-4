import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Search from './Search.vue'

Vue.use(VueRouter);
Vue.use(VueResource)

const routes = [
  { path: '/', component: Search },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  routes
})

const app = new Vue({
  router
}).$mount('#app')
console.log(app)