import app from './app';
import dynamic from 'redva/dynamic';

export default [
  {
    url: '/counter',
    name: '计数器',
    component: dynamic({
      app: app,
      models: () => [import('../models/counter')],
      component: () => import('../routes/counter'),
    }),
  },
  {
    url: '/todo',
    name: 'todo列表',
    component: dynamic({
      app: app,
      models: () => [import('../models/todo')],
      component: () => import('../routes/todo'),
    }),
  },
];
