import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Rigester from '../views/Rigester.vue'
import NotFound from '../views/404.vue'
import ResetPassword from '../views/ResetPassword.vue'
import Main from '../views/Main.vue'
// import Table from '../views/nav1/Table.vue'
import Tableview from '../views/nav1/Tableview.vue'
import NewHome from '../views/NewHome.vue'
import UploadExcel from '../views/UploadExcel.vue'
Vue.use(Router)

export default new Router({
  // mode:"history",
  routes: [
    {
      path: '/',
      name: '数据库查询',
      iconCls: 'el-icon-setting',//图标样式class
      component: NewHome,
      hidden: false,
      children: [
        // { path: '/main', component: Main, name: '主页', hidden: false },
        // { path: '/table', component: Table, name: 'Table' },
        { path: '/tabletitle', component: Tableview, name: '数据库字段管理', hidden: false },
        { path: '/block', component: Tableview, name: '区块管理', hidden: false },
        { path: '/wellbase', component: Tableview, name: '井基础数据', hidden: false },
        { path: '/prodmonth', component: Tableview, name: '生产月报', hidden: false },
        { path: '/injemonth', component: Tableview, name: '注水月报', hidden: false },
    ]
    },
    {
      path: '/',
      name: '批量上传',
      iconCls: 'el-icon-setting',//图标样式class
      component: NewHome,
      hidden: false,
      children: [
        // { path: '/main', component: Main, name: '主页', hidden: false },
        // { path: '/table', component: Table, name: 'Table' },
        { path: '/uploadexcel', component: UploadExcel, name: '数据上传数据中心', hidden: false },
    ]
    },
    {
      path: '/login',
      component: Login,
      name: '',
      hidden: true
  },
  {
    path: '/resetpassword',
    component: ResetPassword,
    name: '',
    hidden: true
  },
  {
    path: '/rigester',
    component: Rigester,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
},
  ]
})
