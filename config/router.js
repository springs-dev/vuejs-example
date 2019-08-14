import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'

Vue.use(Router)

let router = new Router({
  linkExactActiveClass: 'is-active',
  mode: 'history',
  routes: [
    {
      path: '/products',
      alias: '/',
      name: 'products',
      component: () => import(/* webpackChunkName: "product" */ './components/Products.vue'),
      props: true,
    },
    {
      path: '/products/:category',
      name: 'productsByCategory',
      component: () => import(/* webpackChunkName: "product" */ './components/Products.vue'),
      props: true,
    },
    {
      path: '/product/:productId',
      name: 'product',
      props: true,
      component: () => import(/* webpackChunkName: "product" */ './components/Product.vue'),
    },
    {
      path: '/account',
      name: 'account',
      component: () => import(/* webpackChunkName: "user" */ './views/Account.vue'),
      children: [
        {
          path: 'profile',
          name: 'profile',
          component: () => import(/* webpackChunkName: "user" */ './components/Profile.vue'),
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import(/* webpackChunkName: "user" */ './components/Orders.vue'),
        },
        {
          path: 'credentials',
          name: 'credentials',
          component: () => import(/* webpackChunkName: "user" */ './components/Credentials.vue'),
          props: true,
        },
        {
          path: 'shipping',
          name: 'shipping',
          component: () => import(/* webpackChunkName: "user" */ './components/ShippingDetails.vue'),
          props: true,
        },
      ],
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import(/* webpackChunkName: "admin" */ './views/Dashboard.vue'),
      children: [
        {
          path: 'profile',
          name: 'adminProfile',
          component: () => import(/* webpackChunkName: "admin" */ './components/Profile.vue'),
          props: true,
        },
        {
          path: 'users',
          name: 'users',
          component: () => import(/* webpackChunkName: "admin" */ './components/UsersList.vue'),
        },
        {
          path: 'create-user',
          name: 'createUser',
          component: () => import(/* webpackChunkName: "admin" */ './components/CreateUser.vue'),
          props: true,
        },
        {
          path: 'users/:id',
          name: 'user',
          component: () => import(/* webpackChunkName: "admin" */ './components/EditUser.vue'),
          props: true,
        },
        {
          path: 'upload',
          name: 'uploadUsers',
          component: () => import(/* webpackChunkName: "admin" */ './components/UploadUsers.vue'),
          props: true,
        },
        {
          path: 'credentials',
          name: 'adminCredentials',
          component: () => import(/* webpackChunkName: "admin" */ './components/Credentials.vue'),
          props: true,
        },
        {
          path: 'vouchers',
          name: 'vouchers',
          component: () => import(/* webpackChunkName: "admin" */ './components/VouchersList.vue'),
        },
        {
          path: 'vouchers/:id',
          name: 'voucher',
          component: () => import(/* webpackChunkName: "admin" */ './components/VoucherDetails.vue'),
        },
      ],
      meta: {
        requiresAuth: true,
        is_admin: true,
      },
    },
    {
      path: '/create-voucher',
      name: 'createVoucher',
      component: () => import(/* webpackChunkName: "user" */ './components/CreateVoucher.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "auth" */ './components/Login.vue'),
      meta: {
        guest: true,
      },
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: () => import(/* webpackChunkName: "auth" */ './components/ForgotPassword.vue'),
      meta: {
        guest: true,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "auth" */ './components/Register.vue'),
      meta: {
        guest: true,
      },
    },
    {
      path: '/reset-password/:token',
      name: 'resetPassword',
      component: () => import(/* webpackChunkName: "auth" */ './components/ResetPassword.vue'),
      props: true,
      meta: {
        guest: true,
      },
    },
    {
      path: '/invite/:token',
      name: 'invite',
      component: () => import(/* webpackChunkName: "auth" */ './components/Invite.vue'),
      props: true,
      meta: {
        guest: true,
      },
    },
  ],
})

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (store.getters.isLoggedIn) {
//       next()
//       return
//     }
//     next('/login')
//   } else {
//     next()
//   }
// })

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token') == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath },
      })
    } else {
      if (to.matched.some(record => record.meta.is_admin)) {
        if (['admin_shop', 'super_user'].includes(store.getters.currentUser.group)) {
          next() // { name: 'admin' }
        } else {
          next({ name: 'account' })
        }
      } else {
        next()
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('token') == null) {
      next()
    } else {
      next({ name: 'account' })
    }
  } else {
    next()
  }
})

export default router
