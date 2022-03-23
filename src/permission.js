// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面

// 权限拦截流程
// 1.判断是否有token,如果有，判断是否是去登录页，如果是则跳到主页，如果不是则判断是否有用户信息，如果有直接放行，没有则去获取用户信息，再放行。
// 2.如果没有token，判断跳转路由是否在白名单上，如果不在则直接跳到登录页，如果在直接放行
router.beforeEach(async function (to, from, next) {
  NProgress.start() // 开启进度条
  //  首先判断有无token
  if (store.getters.token) {
    //   如果有token 继续判断是不是去登录页
    if (to.path === '/login') {
      //  表示去的是登录页
      next('/') // 跳到主页
    } else {
      if (!store.getters.userId) {
        // 没有用户id,则去获取用户资料
        const { roles } = await store.dispatch('user/getUserInfo')
        console.log(roles.menus)
        const routes = await store.dispatch(
          'permission/filterRoutes',
          roles.menus,
        )
        // 404页面必须添加到路由最后
        router.addRoutes([
          ...routes,
          { path: '*', redirect: '/404', hidden: true },
        ])
        next(to.path)
      } else {
        next() // 直接放行
      }
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
router.afterEach(function () {
  NProgress.done() // 关闭进度条
})
