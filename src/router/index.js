import Vue from 'vue'
import Router from 'vue-router'
import MemoryFeed from '@/components/MemoryFeed'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Router)
Vue.use(Element, { size: 'small' })

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MemoryFeed',
      component: MemoryFeed
    }
  ]
})
