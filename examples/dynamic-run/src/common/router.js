import app from './app';
import dynamic from 'redva/dynamic';

const routers = [
  {
    url: '/counter',
    name: '计数器',
    models: ['counter'],
    component: 'counter',
  },
  {
    url: '/todo',
    name: 'todo列表',
    models: ['todo'],
    component: 'todo',
  },
];

export default routers.map(route => {
  return {
    url: route.url,
    name: route.name,
    component: dynamic({
      app: app,
      models: () => {
        return route.models.map(model => {
          return import(`../models/${model}`);
        });
      },
      component: () => {
        return import(`../routes/${route.component}`);
      },
    }),
  };
});
