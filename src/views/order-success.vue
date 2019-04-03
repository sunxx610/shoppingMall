<template>
  <checking-process :step="4">
    <h2 slot="title">Order Success</h2>
    <div slot="content">
      <div class="content page-order-payment">

        <div class="box-inner order-info">
          <h3>Order Submitted Successfully</h3>
          <p class="payment-detail">Your products will be shipped within <span>24 hours</span> and be delivered in the
            estimated time.</p>
          <p class="payment-detail">If your have any questions about the order, please contact us.</p>
        </div>
        <div class="box-inner payment-checkout-panel clear">

          <span class="prices"> Payed：   <em>{{targetOrderData.orderTotal|currency('$')}}</em>   </span>
        </div>
        <div class="confirm-detail">
          <div class="info-title">Order Id</div>
          <p class="info-detail">{{targetOrderId}}</p>
        </div>
        <div class="confirm-detail">
          <div class="info-title">Receiver Information</div>
          <p class="info-detail">Name：{{receiverName}}</p>
          <p class="info-detail">Tel：{{receiverTel}}</p>
          <p class="info-detail">
            Address：{{receiverAdd1}},{{receiverAdd2}}
            {{receiverCity}}, {{receiverState}}
            {{receiverZip}}</p>
        </div>
        <div class="confirm-table-title clear">
          <span class="name fn-left">Item Information</span>
          <span class="subtotal fn-right">Sub-total</span>
          <span class="num fn-right">Quantity</span>
          <span class="price fn-right">Price</span>
        </div>
        <div class="confirm-goods-table">
          <div class="cart-items clear" v-for="item in targetOrderData.goodsList">
            <div class="name fn-left hide-row">
              <div class="name-cell">
                <a :href="item.ali_image+'?x-oss-process=image/resize,w_80/quality,Q_100/format,webp'"
                   :title="item.title+' ('+item.show_name+')'" target="_blank">{{item.title+'('+item.show_name+')'}}</a><br>
              </div>
            </div>
            <div class="subtotal fn-right">
              <div class="subtotal-cell">{{(item.price * item.itemCount)|currency('$')}}</div>
            </div>
            <div class="goods-num fn-right">{{item.itemCount}}</div>
            <div class="price fn-right">{{item.price|currency('$')}}</div>
          </div>
        </div>
        <div class="order-discount-line">
          <p> Total： <span>{{targetOrderData.orderTotal|currency('$')}}</span></p>
          <p> Fee & tax： <span>+{{targetOrderData.shippingFee|currency('$')}}</span></p>
          <p> Coupon： <span>-{{targetOrderData.coupon|currency('$')}}</span></p>
        </div>
      </div>
    </div>
  </checking-process>
</template>

<script>
  import checkingProcess from '@/components/checking-process'

  export default {
    name: "paymentSuccess",
    components: {
      checkingProcess
    },
    data() {
      return {}
    },
    mounted() {
      this.delPayedGoodsActHandle();
      this.getTargetOrderDataActHandle(this.$route.query.orderId);

    },
    computed: {
      targetOrderId() {
        return this.$route.query.orderId
      },
      targetOrderData() {
        return this.$store.state.targetOrderData;
      },
      receiverName() {
        if (this.targetOrderData.addressInfo)
          return this.targetOrderData.addressInfo.name;
        else
          return ''
      },
      receiverTel() {
        if (this.targetOrderData.addressInfo)
          return this.targetOrderData.addressInfo.tel;
        else
          return ''
      },
      receiverAdd1() {
        if (this.targetOrderData.addressInfo)
          return this.targetOrderData.addressInfo.streetName;
        else
          return ''
      },
      receiverAdd2() {
        if (this.targetOrderData.addressInfo)
          return this.targetOrderData.addressInfo.streetName2;
        else
          return ''
      },
      receiverCity() {
        if (this.targetOrderData.addressInfo)
          return this.targetOrderData.addressInfo.city;
        else
          return ''
      },
      receiverState() {
        if (this.targetOrderData.addressInfo)
          return this.targetOrderData.addressInfo.state;
        else
          return ''
      },
      receiverZip() {
        if (this.targetOrderData.addressInfo)
          return this.targetOrderData.addressInfo.zipCode;
        else
          return ''
      }
    },
    methods: {
      delPayedGoodsActHandle() {
        this.$store.dispatch('delAllCheckedItemsAct');
      },
      getTargetOrderDataActHandle(orderId) {
        this.$store.dispatch('getTargetOrderDataAct', orderId);
      }
    }
  }
</script>
