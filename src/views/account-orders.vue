<template>
  <div class="account-content">
    <div class="account-order">
      <div class="gray-box">
        <div class="title columns-title pre-title">
          <h2>My orders</h2>
          <div
              class="gray-btn-menu sort-status-menu"
              @mouseenter="showStatusFilter"
              @mouseleave="hideStatusFilter">
            <span class="label"><i
                class="arrow"></i> {{statusFilters[statusFilterIndex]}} </span>
            <ul class="menu-list  status-filter-list" v-show="statusFilterIsSHow">
              <li v-for="(filter,index) in statusFilters" :class="{selected:index == statusFilterIndex}"
                  @click="setStatusFilter(index)">
                <a href="javascript:;">{{filter}}</a>
              </li>
            </ul>
          </div>
          <div
              class="gray-btn-menu sort-time-menu -gray-btn-menu-on"
              @mouseenter="showTimeFilter"
              @mouseleave="hideTimeFilter"
          >
            <span class="label"><i class="arrow"></i> {{timeFilters[timeFilterIndex]}} </span>
            <ul class="menu-list time-filter-list" v-show="timeFilterIsShow">
              <li v-for="(filter,index) in timeFilters" :class="{selected:index == timeFilterIndex}"
                  @click="setTimeFilter(index)">
                <a href="javascript:;">{{filter}}</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="js-list-inner">
          <div class="box-inner" v-show="msg">
            <h2 class="no-orders-data-msg">{{msg}}</h2>
          </div>
          <div class="box-inner order-cart order-list-cart clear" v-for="order in ordersData" v-show="!msg">
            <div class="gray-sub-title cart-title">
              <span class="date">{{order.createDate.substr(0,10)}}</span>
              <span class="order-id"> OrderId： <a href="javascript:;">{{order.orderId}}</a> </span>
              <span class="order-detail">Order status</span> <span class="sub-total">Total Price</span>
              <span class="num">Quantity</span>
              <span class="price">Price</span>
            </div>
            <div class="cart">
              <div class="cart-items clear" v-for="item in order.goodsList">
                <div class="prod-info clear">
                  <div class="items-thumb">
                    <a href="javascript:;" target="_blank"><img
                        :src="'/static/goodsPic/'+item.ali_image"
                        height="80" width="80"
                    ></a>
                  </div>
                  <div class="items-params clear">
                    <div class="name vh-center">
                      <a href="javascript:;" :title="item.title+' ('+item.show_name+')'" target="_blank">{{item.title+'('+item.show_name+')'}}</a>
                    </div>
                    <div class="detail"></div>
                  </div>
                  <div class="num">{{item.itemCount}}</div>
                  <div class="price">{{item.price|currency('$')}}</div>
                </div>
              </div>
            </div>
            <div class="prod-operation">
              <div class="total">{{order.orderTotal|currency('$')}}</div>
              <div class="status">{{statusFilters[order.orderStatus]}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "orders-history",
    data() {
      return {
        ordersData: [],
        timeFilterIndex: 0,
        statusFilterIndex: 0,
        statusFilters: [
          'All status',
          'Before shipping',
          'Shipped',
          'Delivered',
          'Returning',
          'Returned'
        ],
        timeFilterIsShow: false,
        statusFilterIsSHow: false,
        msg: ''/*msg of no orders data*/
      }
    },
    computed: {
      timeFilters() {
        let currentYear = new Date().getFullYear();
        console.log(typeof currentYear, currentYear)
        return [
          'Past 3 Month',
          currentYear,
          currentYear - 1,
          'earlier'
        ]
      }
    },
    mounted() {
      this.getFilteredOrderDetails()
    },
    methods: {
      showTimeFilter() {
        this.timeFilterIsShow = !this.timeFilterIsShow;
      },
      setTimeFilter(index) {
        this.timeFilterIndex = index;
        this.hideTimeFilter();
        this.getFilteredOrderDetails()
      },
      hideTimeFilter() {
        this.timeFilterIsShow = false;
      },
      showStatusFilter() {
        this.statusFilterIsSHow = !this.statusFilterIsSHow;
      },
      setStatusFilter(index) {
        this.statusFilterIndex = index;
        this.hideStatusFilter();
        this.getFilteredOrderDetails()
      },
      hideStatusFilter() {
        this.statusFilterIsSHow = false;
      },
      getFilteredOrderDetails() {
        this.axios.get("/users/filteredOrderDetails", {
          params: {
            timeRangeIndex: this.timeFilterIndex,
            status: this.statusFilterIndex
          }
        }).then(response => {
          let res = response.data;

          console.log('address',res.status)
          console.log('res', res.result)

          if (res.status === '0') {
            this.msg = '';
            this.ordersData = res.result.targetOrders.reverse();
          } else if (res.status === '120001' || res.status === '120002') {
            this.ordersData = [];
            this.msg = res.msg;
          }else if(res.status === '10001'){
            this.ordersData = [];
            this.msg = res.msg;
            this.$store.commit('showSign', 'signIn');
          }
        })
      }
    }
  }
</script>
