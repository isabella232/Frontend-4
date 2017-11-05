import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Search from './Search.vue'
import Travel from './Travel.vue'
import Account from './Account.vue'
import Guide from './Guide.vue'
import auth from './auth'

Vue.use(VueRouter);
Vue.use(VueResource)

const routes = [
  { path: '/', component: Search },
  { path: '/travel', component: Travel },
  { path: '/guide/:guideID/:view', name: 'guide', component: Guide, props: true },
  { path: '/account', name: 'account', component: Account}
  // { path: '*', redirect: '/' }
]

export var router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  auth.checkAuth()

  if (to.path !== '/' && !auth.user.authenticated) {
    next('/')
  }
  next()
})

Vue.http.interceptors.push(function(request, next) {

  next(function(response) {
    if(response.body == "Unauthorized Access") {
      auth.logout()
      // next('/')
    }
  });
});

const app = new Vue({
  router
}).$mount('#app')
console.log(app)