import Vue from 'vue';
import App from './App.vue';
import Toasted from 'vue-toasted';

require('@/assets/sass/main.scss');

const toastOptions = {
  position: 'top-center',
  duration: 500,
  fullWidth: false,
};

Vue.use(Toasted, toastOptions);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
