import Layout from '@/layout'

export default {
  // 一级路由
  path: '/approvals',
  name: 'approvals',
  component: Layout,
  // 二级路由  layout组件中的二级路由
  children: [
    {
      path: '',
      component: () => import('@/views/approvals'),
      meta: {
        title: '审批'
      }
    }
  ]
}
