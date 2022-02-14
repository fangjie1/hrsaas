// 权限管理的路由规则
import Layout from '@/layout'
export default {
  path: '/permissions',
  permName: 'permissions',
  component: Layout,
  children: [{
    path: '',
    name: 'permissions',
    component: () => import('@/views/permission'),
    meta: {
      title: '权限管理',
      icon: 'lock'
    }
  }]

} 