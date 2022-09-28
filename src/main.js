import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import _ from 'lodash'; // lodash
import '@/assets/icons'; // svg-icon
import '@/assets/styles/index.less'; // global css
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 全局方法挂载
Vue.prototype._ = _;
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.use(Element);

new Vue({
  el: '#app',
  router,
  render: (h) => h(App)
});
