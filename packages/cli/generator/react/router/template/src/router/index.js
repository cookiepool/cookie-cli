import React from 'react';

const Home = React.lazy(() => import('../views/Home'));
const About = React.lazy(() => import('../views/About'));

const routes = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/about',
    exact: true,
    component: About
  }
];

export default routes;
