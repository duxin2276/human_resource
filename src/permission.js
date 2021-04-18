import router from '@/router'
import store from '@/store'
import nprogress from 'nprogress'
import 'nprogress/nprogress'

const whiteList = ['/login', '/404']

router.beforeEach(async(to, from, next) => {
  // 开启加载条
  nprogress.start()
  // 判断是否有token
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      // 是否有用户信息
      (!store.getters.userId) && await store.dispatch('user/getuserInfo')
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }

  // 手动关闭加载条
  nprogress.done()
})

router.afterEach((to, from, next) => {
  nprogress.done()
})
