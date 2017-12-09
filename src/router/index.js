import Vue from 'vue'
import Router from 'vue-router'
import MemoryFeed from '@/components/MemoryFeed'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MemoryFeed',
      component: MemoryFeed
    }
  ]
})
