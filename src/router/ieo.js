const routes = [
  {
    path: '/sparkle',
    name: 'ieo_index',
    component: () => import('@/ieo/')
  },
  {
    path: '/sparkle/detail/:id',
    name: 'ieo_detail',
    component: () => import('@/ieo/detail')
  },
  {
    path: '/sparkle/agreement',
    name: 'ieo_agreement',
    component: () => import('@/ieo/agreement')
  },
]

export default routes
