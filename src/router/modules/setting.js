// 公司设置的路由规则
import Layout from '@/layout'
export default {
  path: '/setting',
  permName: 'settings',
  component: Layout,
  children: [{
    path: '',
    name: 'settings',
    component: () => import('@/views/setting'),
    meta: {
      title: '公司设置',
      icon: 'setting'
    }
  }]

} 