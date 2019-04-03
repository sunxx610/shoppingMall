<template>
  <div id="main">
    <!-- process step -->
    <div class="check-step">
      <ul>
        <li :class="{cur:step>=1}"><span>Confirm</span> address</li>
        <li :class="{cur:step>=2}"><span>View your</span> order</li>
        <li :class="{cur:step>=3}"><span>Make</span> payment</li>
        <li :class="{cur:step>=4}"><span>Order</span> confirmation</li>
      </ul>
    </div>

    <!--shipping information-->
    <div class="content page-order-checkout checkout">
      <div class="js-checkout-address-box">
        <div class="gray-box clear">
          <div class="title columns-title pre-title">
            <slot name="title"></slot>
          </div>
          <slot name="content"></slot>
          <slot name="iFooter"></slot>
        </div>
      </div>
      <slot name="popUp"></slot>
    </div>

  </div>
</template>

<script>
  export default {
    name: "checking-process",
    props:['step']
  }
</script>

