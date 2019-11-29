// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './vuex/store'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import SIdentify from './views/identify.vue'
import toExcel from '@/excel/json2excel'
import sleep from '@/utils/utils'
Vue.prototype.$toExcel = toExcel
Vue.prototype.$sleep = sleep
Vue.use(SIdentify)
Vue.config.productionTip = false
Vue.use(ElementUI)


router.beforeEach((to, from, next) => {
  //NProgress.start();
  console.log(to.path);
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  };
  next()
  
  let user = JSON.parse(sessionStorage.getItem('user'));
  let database=to.path.replace("/","");
  // console.log(store.state.databases);
  if (store.state.databases.hasOwnProperty(database)){
    console.log("发现数据库数据",database);
    store.commit("update_table_title",database);
  }
  if (to.path == '/rigester' || to.path == '/resetpassword'  ) {
    next()
  }else if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

