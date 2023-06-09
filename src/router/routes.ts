import { RouteRecordRaw } from 'vue-router'

// @mimas: allocated root path of current app, defined in package.json
const appPath = process.env.appPath as string

const routes: RouteRecordRaw[] = [
  {
    path: appPath,
    component: () => import('layouts/MainLayout.vue'),
    redirect: appPath + '/meeting',
    children: [
      {
        path: 'meeting',
        component: () => import('pages/meeting/VideoMeetingIndex.vue')
      },
      {
        path: 'web',
        component: () => import('pages/web/WebGroupIndex.vue'),
        redirect: appPath + '/web/overall',
        children: [
          {
            path: 'overall',
            component: () => import('pages/web/WebOverall.vue')
          },
          {
            path: 'accessibility',
            component: () => import('pages/web/WebAccessibility.vue')
          },
          {
            path: 'tamper',
            component: () => import('pages/web/WebTamper.vue')
          }
        ]
      },
      {
        path: 'mail',
        component: () => import('pages/mail/MailSystemIndex.vue'),
        redirect: appPath + '/mail/system',
        children: [
          {
            path: 'system',
            component: () => import('pages/mail/MailSystemList.vue')
          }
        ]
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
