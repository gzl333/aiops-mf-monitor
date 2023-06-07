import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/my/monitor',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/my/monitor/service1',
    children: [
      {
        path: 'service1',
        component: () => import('pages/Service1Page.vue')
      },
      {
        path: 'service2',
        component: () => import('pages/Service2Page.vue')
      },
      // @mimas: about, updates, releases...
      {
        path: 'about',
        component: () => import('pages/AboutPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
