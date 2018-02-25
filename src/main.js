// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
Vue.config.productionTip = false


var config = {
  apiKey: 'AIzaSyCOLHHe788EvMsYI1x6WlJeHLm8GhKM6xA',
  authDomain: 'memory-manager-dd40d.firebaseapp.com',
  databaseURL: 'https://memory-manager-dd40d.firebaseio.com/'
}

firebase.initializeApp(config)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
