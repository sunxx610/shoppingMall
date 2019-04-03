import Vue from 'vue'
import Router from 'vue-router'
import '@/assets/css/header.css'
import '@/assets/css/reset.css'
import '@/assets/css/signPanel.css'
import '@/assets/css/popUp.css'
import '@/assets/css/checkingProcess.css'
import '@/assets/css/account.css'
import '@/assets/css/account-orders.css'
import '@/assets/css/account-addresses.css'


import Shop from '@/views/shop.vue'
import Item from '@/views/item.vue'
import Cart from '@/views/cart.vue'
import Payment from '@/views/payment.vue'
import Err from '@/views/err404.vue'
import Address from '@/views/address.vue'
import OrderConfirm from '@/views/order-confirm.vue'
import OrderSuccess from '@/views/order-success'
import Account from '@/views/account'
import AccountOrders from '@/views/account-orders'
import AccountAddresses from '@/views/account-addresses'
import AccountCoupons from '@/views/account-coupons'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Shop,
      name: 'Shop'
    },
    {
      path: '/item',
      component: Item,
      name: 'Item'
    },
    {
      path: '/cart',
      component: Cart,
      name: 'Cart'
    },
    {
      path: '/address',
      component: Address,
      name: 'Address'
    },

    {
      path: '/orderConfirm',
      component: OrderConfirm,
      name: 'OrderConfirm'
    },
    {
      path: '/payment',
      component: Payment,
      name: 'Payment'
    },
    {
      path: '/orderSuccess',
      component: OrderSuccess,
      name: 'OrderSuccess'
    },
    {
      path: '/account',
      component: Account,
      children:[
        {
          path:'/',
          component: AccountOrders,
          name: 'AccountOrders'
        }
      ]
    },
    {
      path: '/account',
      component: Account,
      children:[
        {
          path:'addresses',
          component: AccountAddresses,
          name: 'AccountAddresses'
        }
      ]
    },
    {
      path: '/account',
      component: Account,
      children:[
        {
          path:'coupons',
          component: AccountCoupons,
          name: 'AccountCoupons'
        }
      ]
    },
    {
      path: '*',
      component: Err,
      name: 'Err'
    }

  ]
})
