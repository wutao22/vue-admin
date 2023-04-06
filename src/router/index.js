import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/login',
    alwaysShow: true,
    children: [{
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '控制台', icon: 'dashboard' }
    }]
  },
// 系统管理
  {
    path: '/system',
    component: Layout,
    redirect: '/file',
    name: 'system',
    meta: { title: '常规管理'},
    children: [
      {
        path: '/file',
        name: 'file',
        component: () => import('@/views/system/file'),
        meta: { title: '附件管理'},
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('@/views/profile/index'),
        meta: { title: '个人资料'},
      },
      {
        path: '/banner',
        name: 'banner',
        component: () => import('@/views/system/banner'),
        meta: { title: 'banner管理'},
      },
      {
        path: '/sysconf',
        name: 'sysconf',
        component: () => import('@/views/system/sysconf'),
        meta: { title: '系统配置'},
      }
    ]
  },
  // 权限管理
  {
    path: '/power',
    component: Layout,
    redirect: '/admin',
    name: 'power',
    meta: { title: '权限管理'},
    children: [
      {
        path: '/admin',
        name: 'admin',
        component: () => import('@/views/power/admin'),
        meta: { title: '管理员管理'},
      },
      {
        path: '/role',
        name: 'role',
        component: () => import('@/views/power/role'),
        meta: { title: '角色组'},
      }
    ]
  },
  // 会员管理
  {
    path: '/member',
    component: Layout,
    redirect: '/govern',
    name: 'member',
    meta: { title: '会员管理'},
    children: [
      {
        path: '/govern',
        name: 'govern',
        component: () => import('@/views/member/govern'),
        meta: { title: '会员列表'},
      }
    ]
  },
  // 订单管理
  {
    path: '/order',
    component: Layout,
    redirect: '/direction',
    name: 'order',
    meta: { title: '订单管理'},
    children: [
      {
        path: '/direction',
        name: 'direction',
        component: () => import('@/views/order/direction'),
        meta: { title: '订单列表'},
      }
    ]
  },
  //交友盲盒
  {
    path: '/friends',
    component: Layout,
    redirect: '/listing',
    name: 'friends',
    meta: { title: '交友盲盒管理'},
    children: [
      {
        path: '/listing',
        name: 'listing',
        component: () => import('@/views/friends/listing'),
        meta: { title: '交友盲盒列表'},
      }
    ]
  },
  // 盲盒管理
  {
    path: '/boxs',
    component: Layout,
    redirect: '/tabulation',
    name: 'boxs',
    meta: { title: '盲盒管理'},
    children: [
      {
        path: '/tabulation',
        name: 'tabulation',
        component: () => import('@/views/boxs/tabulation'),
        meta: { title: '盲盒列表'},
      },
      {
        path: '/tabulate',
        name: 'tabulate',
        component: () => import('@/views/boxs/tabulate'),
        meta: { title: '盲盒产品列表'},
      }
    ]
  },
  // 开心抢购管理
  {
    path: '/shopping',
    component: Layout,
    redirect: '/organize',
    name: 'shopping',
    meta: { title: '开心抢购管理'},
    children: [
      {
        path: '/organize',
        name: 'organize',
        component: () => import('@/views/shopping/organize'),
        meta: { title: '开心抢购商品分类管理'},
      },
      {
        path: '/officer',
        name: 'officer',
        component: () => import('@/views/shopping/officer'),
        meta: { title: '开心抢购商品管理'},
      }
    ]
  },
  // 任务管理
  {
    path: '/assignment',
    component: Layout,
    redirect: '/entry',
    name: 'assignment',
    meta: { title: '任务管理'},
    children: [
      {
        path: '/entry',
        name: 'entry',
        component: () => import('@/views/assignment/entry'),
        meta: { title: '任务列表'},
      }
    ]
  },
  // 提现申请管理
  {
    path: '/withdrawal',
    component: Layout,
    redirect: '/subscribe',
    name: 'withdrawal',
    meta: { title: '提现申请管理'},
    children: [
      {
        path: '/subscribe',
        name: 'subscribe',
        component: () => import('@/views/withdrawal/subscribe'),
        meta: { title: '提现申请列表'},
      }
    ]
  },
  // 信息管理
  {
    path: '/trends',
    component: Layout,
    redirect: '/message',
    name: 'trends',
    meta: { title: '动态信息管理'},
    children: [
      {
        path: '/message',
        name: 'message',
        component: () => import('@/views/trends/message'),
        meta: { title: '动态信息列表'},
      }
    ]
  },
    // 商品管理
    {
      path: '/products',
      component: Layout,
      redirect: '/itemize',
      name: 'products',
      meta: { title: '动态信息管理'},
      children: [
        {
          path: '/itemize',
          name: 'itemize',
          component: () => import('@/views/goods/itemize'),
        },
        {
          path: '/product',
          name: 'product',
          component: () => import('@/views/goods/products'),
        },
        {
          path: '/blind',
          name: 'blind',
          component: () => import('@/views/goods/blind'),
        },
        {
          path: '/blindMall',
          name: 'blindMall',
          component: () => import('@/views/goods/blindMall'),
        },
        {
          path: '/integral',
          name: 'integral',
          component: () => import('@/views/goods/integral'),
        },
        {
          path: '/integralSort',
          name: 'integralSort',
          component: () => import('@/views/goods/integralSort'),
        },
      ]
    },
  // 个人资料
  {
    path: '/profile',
    component: Layout,
    children: [
      {
        path: '/profile',
        name: '个人资料',
        component: () => import('@/views/profile/index'),
        meta: { title: '个人资料', icon: 'form' }
      }
    ]
  },
  // 公告
  {
    path: '/insertList',
    component: Layout,
    redirect: '/create',
    name: '公告',
    meta: {
      title: '公告',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: '/create',
        component: () => import('@/views/notice/create'),
        name: 'CreateArticle',
        meta: { title: '新增公告', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/notice/edit'),
        name: 'EditArticle',
        meta: { title: '编辑公告', noCache: true, activeMenu: '/notice/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/notice/list'),
        name: 'ArticleList',
        meta: { title: '公告列表', icon: 'list' }
      }
    ]
  },
// 任务管理
{
  path: '/merchant',
  component: Layout,
  redirect: '/settlement',
  name: 'merchant',
  meta: { title: '商家入驻'},
  children: [
    {
      path: '/settlement',
      name: 'settlement',
      component: () => import('@/views/merchant/settlement'),
      meta: { title: '商家入驻审核'},
    }
  ]
},


  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/department',
  //   name: '部门管理',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: '/department',
  //       component: () => import('@/views/system/department') // Parent router-view

  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'hash', // require service support
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
