// 员工的路由规则
import Layout from '@/layout'
export default {
  path:'/employees',
  permName:'employees',
  component:Layout,
  children:[
    {
    path:'',
    name: 'employees',
    component:()=>import('@/views/employees'),
    meta:{
      title:'员工',
      icon: 'people'
    },
  },
  {
    path: 'detail/:id', // query传参 动态路由传参
    component: () => import('@/views/employees/detail'),
    hidden: true, // 不在左侧菜单显示
    meta: {
      title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时使用
    }
    },
  {
    path: 'print/:id', // query传参 动态路由传参
    component: () => import('@/views/employees/print'),
    hidden: true, // 不在左侧菜单显示
    meta: {
      title: '员工打印' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
    }
  },
  ]

} 


