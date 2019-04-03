<template>
  <div class="account-content">
    <div class="account-address">
      <div class="gray-box clear">
        <div class="title pre-title">
          <h2 class="fn-left">Coupons</h2>
        </div>
        <div>
          <h2 class="no-coupon-msg">You don't have coupons now.</h2>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
  export default {
    name: "account-coupons",
    mounted() {
      this.$store.dispatch('checkLoginAct');
      this.$store.dispatch('updateCartListDataAct');
    },
  }
</script>

<style scoped>
  .no-coupon-msg {
    margin: 60px 30px;
    font-size: 18px;
  }
</style>