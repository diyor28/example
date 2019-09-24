import vuetify from './plugins/vuetify';
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import App from './App.vue'


Vue.use(VueAxios, axios);

Vue.use(require('vue-pusher'), {
    api_key: '277031fd0404e1404911',
    options: {
        cluster: 'ap2',
        encrypted: true,
        forceTLS: true
    }
});

Vue.config.productionTip = false;

new Vue({
    vuetify,
    router,
    render: h => h(App)
}).$mount('#app');
