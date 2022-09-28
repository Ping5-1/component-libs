import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 公共路由
export const constantRoutes = [
  {
    path: '/',
    name: 'startMenu',
    component: (resolve) => require(['@/views/startMenu/Index'], resolve),
    isHidden: true
  },
  {
    path: '/test',
    name: 'Test',
    component: (resolve) => require(['@/views/startMenu/Test'], resolve),
    isHidden: true
  },
  {
    path: '/table',
    name: 'Table',
    component: (resolve) => require(['@/views/TableDEMO/Index'], resolve),
    isHidden: true
  }
];
export default new Router({
  mode: 'hash', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});
