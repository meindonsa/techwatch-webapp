import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../../features/home/HomeView.vue'
import { useUserStore } from '@/core/stores/user.ts'
import Main from '@/core/layouts/Main.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/features/auth/Login.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/features/auth/Register.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: Main,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
          meta: { requiresAuth: true },
        },
        {
          path: 'articles',
          name: 'articles',
          props: true,
          component: () => import('@/features/articles/Articles.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'article/:id',
          name: 'article',
          props: true,
          component: () => import('@/features/articles/Article.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth && !userStore.isAuthenticated) {
    if (to.name !== 'login') {
      next({ name: 'login' })
    } else {
      next()
    }
  } else if (!requiresAuth && userStore.isAuthenticated) {
    if (to.name !== 'home') {
      next({ name: 'home' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
