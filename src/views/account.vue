<template>
  <div id="main">
    <div class="content clear">
      <div class="account-wrapper">
        <div class="account-sidebar">
          <div class="avatar gray-box clear">
            <div class="js-account-sidebar-info">
              <img src="http://static.smartisanos.cn/account/asset/img/default-user-avatar.png">
            </div>
            <div class="box-inner">
              <ul class="account-nav">
                <router-link to="/account" exact tag="li"><a href="javascript:;">My orders</a></router-link>
                <router-link to="/account/addresses" exact tag="li"><a href="javascript:;">My addresses</a></router-link>
                <router-link to="/account/coupons" exact tag="li"><a href="javascript:;">My coupons</a></router-link>
              </ul>
            </div>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "accoount",
    data(){
      return {
      }
    },
    mounted(){
    }
  }
</script>

