import Vue from 'vue';
import Router from 'vue-router';

import Layout from 'components/layout'
import Auth from 'pages/auth'
import Home from 'pages/home'
import Customers from 'pages/home/customers'
import ChildCustomer from 'pages/home/customers/_id'
import Oders from 'pages/home/oders'
import Suppliers from 'pages/home/suppliers'
import Products from 'pages/home/products'
import Assets from 'pages/home/assets'
import ChildAssets from 'pages/home/assets/_id'
import Settings from 'pages/home/settings'

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/auth',
        name: 'Auth',
        component: Auth,
      }, {
        path: '/',
        component: Layout,
        children: [
          {
            path: '',
            name: 'Home',
            component: Home,
          }, {
            path: '/customers',
            name: 'Customers',
            component: Customers,
          }, {
            path: '/customers/:_id',
            name: 'customers-id',
            component: ChildCustomer,
          }, {
            path: '/suppliers',
            name: 'Suppliers',
            component: Suppliers,
          }, {
            path: '/oders',
            name: 'Oders',
            component: Oders,
          }, {
            path: '/products',
            name: 'Products',
            component: Products,
          }, {
            path: '/assets',
            name: 'Assets',
            component: Assets,
          }, {
            path: '/users/:_id',
            name: 'assets-id',
            component: ChildAssets,
          }, {
            path: '/settings',
            name: 'Settings',
            component: Settings,
          },
        ],
      },
    ],
  })
}
