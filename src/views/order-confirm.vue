<template>
  <checking-process :step="2">
    <h2 slot="title">Order Confirm</h2>
    <div slot="content">
      <div class="gray-box">
        <div class="box-inner ui-goods-cart">
          <div class="gray-sub-title cart-table-title">
            <span class="name">Item Name</span>
            <span class="subtotal">Sub-total</span>
            <span class="num">Quantity</span>
            <span class="price">Price</span>
          </div>
          <div class="cart-table">
            <div class="cart-group js-cart-group">

              <div class="cart-items" v-for="item in selectedCartListData">
                <div class="items-thumb">
                  <a href="javascript:;" target="_blank"><img
                      :src="'/static/goodsPic/'+item.ali_image"
                      height="80" width="80"
                  ></a>
                </div>
                <div class="name hide-row">
                  <div class="name-cell">
                    <a href="javascript:;" :title="item.title+' ('+item.show_name+')'" target="_blank">{{item.title+'('+item.show_name+')'}}</a>
                  </div>
                </div>
                <div class="subtotal">
                  <div class="subtotal-cell"> {{(item.price * item.itemCount)|currency('$')}}</div>
                </div>
                <div class="goods-num">{{item.itemCount}}</div>
                <div class="price">{{item.price|currency('$')}}</div>
              </div>
            </div>
          </div>

        </div>
        <div class="box-inner">
          <div class="order-discount-line">
            <p> Item total price： <span>{{checkedPrice|currency('$')}}</span></p>
            <p> Shipping $ labor： <span> {{shippingFee|currency('$')}}</span></p>
            <p class="discount-line js-discount-cash"><em>Coupon</em>： <span>  {{coupon|currency('$')}} </span></p>
          </div>
        </div>
        <div class="box-inner">
          <div class="last-payment clear">
            <span
                class="jianguo-blue-main-btn big-main-btn payment-blue-bt fn-right js-checkout" @click="payment"> <a>Pay now</a> </span>
            <span class="prices fn-right should-pay">Total Price： <em>{{orderTotal|currency('$')}}</em></span>
          </div>
        </div>
      </div>
    </div>
  </checking-process>
</template>

<script>
  import checkingProcess from '@/components/checking-process'

  export default {
    name: "order-confirm",
    components: {
      checkingProcess
    },
    mounted() {
      this.$store.dispatch('checkLoginAct');
      this.$store.dispatch('updateCartListDataAct');
    },
    computed: {
      selectedCartListData() {
        let selectedItems = [];
        this.$store.state.cartListData.forEach(item => {
          if (item.checked) {
            selectedItems.push(item)
          }
        });
        return selectedItems
      }
      ,
      checkedPrice() {
        return this.$store.getters.checkedPrice;
      }
      ,
      shippingFee() {
        return Math.sqrt(this.checkedPrice) * 0.3
      }
      ,
      coupon() {
        return 0
      }
      ,
      orderTotal() {
        return this.checkedPrice + this.shippingFee - this.coupon;
      }
    },
    methods: {
      payment() {
        this.axios.post("/users/payment", {
          addressId: this.$route.query.addressId,
          orderTotal: this.orderTotal,
          shippingFee: this.shippingFee,
          coupon: this.coupon
        }).then((response) => {
            let res = response.data;
            if (res.status === '0') {
              // this.$store.commit('setTargetOrderId',res.result.orderId);
              this.$router.push({
                  path: '/orderSuccess?orderId=' + res.result.orderId
                }
              )
            }
          }
        )
      }
    }
  }
</script>

<style scoped>

</style>