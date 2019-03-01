import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
// import antdPage from './page/test/antd';
import AntDesign from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import routes from "./router/router";
import {routerMode} from './config/env'
import CKEditor from '@ckeditor/ckeditor5-vue';

import store from './store/'

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(AntDesign);
Vue.use(CKEditor);

Vue.config.productionTip = false;

const router = new VueRouter({
    routes,
    mode: routerMode,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(savedPosition)
                }, 10)
            });
        } else {
            if (from.meta.keepAlive) {
                from.meta.savedPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            }
            return { x: 0, y: to.meta.savedPosition || 0 }
        }
    }
});

new Vue({
    router,
  store,
  render: h => h(App),
}).$mount('#app')
