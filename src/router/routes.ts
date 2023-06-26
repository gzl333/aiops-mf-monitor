import { RouteRecordRaw } from 'vue-router'

// @mimas: allocated root path of current app, defined in package.json
const appPath = process.env.appPath as string

const routes: RouteRecordRaw[] = [
  {
    path: appPath,
    component: () => import('layouts/MainLayout.vue'),
    redirect: appPath + '/cstn',
    children: [
      {
        path: 'cstn',
        component: () => import('pages/cstn/CstnIndex.vue')
      },
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
            component: () => import('pages/web/overall/WebOverall.vue')
          },
          {
            path: 'accessibility',
            component: () => import('pages/web/accessibility/WebAccessibility.vue')
          },
          {
            path: 'tamper',
            component: () => import('pages/web/tamper/WebTamper.vue')
          },
          {
            path: 'create',
            component: () => import('pages/web/WebMonitorTaskCreate.vue')
          },
          {
            path: 'detail/:webMonitorTaskId',
            component: () => import('pages/web/accessibility/WebMonitorDetailIndex.vue')
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
      {
        path: 'server',
        component: () => import('pages/server/ServerPage.vue')
      },
      {
        path: 'ceph',
        component: () => import('pages/ceph/CephPage.vue')
      },
      {
        path: 'tidb',
        component: () => import('pages/tidb/TidbPage.vue')
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
