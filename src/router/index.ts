import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/TablePersons.vue')
    },
    {
      path: '/raffle-result',
      name: 'raffle-result',
      component: () => import('../views/RaffleResult.vue')
    }
  ]
});

export default router;
