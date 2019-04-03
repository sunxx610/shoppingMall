<template>
  <div>
    <checking-process :step="1">
      <h2 slot="title">Shipping</h2>
      <div slot="content">
        <div class="box-inner js-checkout-address-panel ">
          <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1"
               xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
              <symbol id="icon-edit" viewBox="0 0 32 32">
                <title>edit</title>
                <path class="path1"
                      d="M28.287 8.51l-4.805-4.806 0.831-0.831c0.472-0.472 1.086-0.777 1.564-0.777 0.248 0 0.452 0.082 0.622 0.253l3.143 3.144c0.539 0.54 0.133 1.529-0.524 2.186l-0.831 0.831zM26.805 9.992l-1.138 1.138-4.805-4.806 1.138-1.138 4.805 4.806zM24.186 12.612l-14.758 14.762-4.805-4.806 14.758-14.762 4.805 4.806zM7.379 28.288l-4.892 1.224 1.223-4.894 3.669 3.67zM31.123 4.011l-3.143-3.144c-0.567-0.567-1.294-0.867-2.103-0.867-1.036 0-2.174 0.52-3.045 1.391l-20.429 20.436c-0.135 0.134-0.23 0.302-0.276 0.487l-2.095 8.385c-0.089 0.355 0.017 0.736 0.276 0.995 0.198 0.198 0.461 0.307 0.741 0.307 0.085 0 0.171-0.010 0.254-0.031l8.381-2.096c0.185-0.047 0.354-0.142 0.487-0.276l20.43-20.436c1.409-1.41 2.042-3.632 0.524-5.15v0z"></path>
              </symbol>
              <symbol id="icon-del" viewBox="0 0 32 32">
                <title>delete</title>
                <path class="path1"
                      d="M11.355 4.129v-2.065h9.29v2.065h-9.29zM6.194 29.935v-23.742h19.613v23.742h-19.613zM30.968 4.129h-8.258v-3.097c0-0.569-0.463-1.032-1.032-1.032h-11.355c-0.569 0-1.032 0.463-1.032 1.032v3.097h-8.258c-0.569 0-1.032 0.463-1.032 1.032s0.463 1.032 1.032 1.032h3.097v24.774c0 0.569 0.463 1.032 1.032 1.032h21.677c0.569 0 1.032-0.463 1.032-1.032v-24.774h3.097c0.569 0 1.032-0.463 1.032-1.032s-0.463-1.032-1.032-1.032v0z"></path>
                <path class="path2"
                      d="M10.323 9.806c-0.569 0-1.032 0.463-1.032 1.032v14.452c0 0.569 0.463 1.032 1.032 1.032s1.032-0.463 1.032-1.032v-14.452c0-0.569-0.463-1.032-1.032-1.032z"></path>
                <path class="path3"
                      d="M16 9.806c-0.569 0-1.032 0.463-1.032 1.032v14.452c0 0.569 0.463 1.032 1.032 1.032s1.032-0.463 1.032-1.032v-14.452c0-0.569-0.463-1.032-1.032-1.032z"></path>
                <path class="path4"
                      d="M21.677 9.806c-0.569 0-1.032 0.463-1.032 1.032v14.452c0 0.569 0.463 1.032 1.032 1.032s1.032-0.463 1.032-1.032v-14.452c0-0.569-0.463-1.032-1.032-1.032z"></path>
              </symbol>
            </defs>
          </svg>
          <div class="page-title-normal checkout-title">
            <h2><span>Shipping address</span></h2>
          </div>
          <div class="address-common-table js-multiple-address-panel">
            <ul class="address-item-list clear js-address-item-list">

              <!--address list-->
              <li
                  v-for="(shippingAddress,index) in shippingAddresses"
                  class="js-choose-address"
                  :class="{'selected-address-item':shippingAddress._id===defAddressId}"
                  @click="setDefaultAddressHandle(shippingAddress._id)"
                  @mouseenter="showOperate(index)"
                  @mouseleave="hideOperate"
              >
                <div class="address-item">
                  <div class="name-section"> {{shippingAddress.name}}</div>
                  <div class="mobile-section">{{shippingAddress.tel}}</div>
                  <div class="detail-section">
                    {{shippingAddress.streetName}},
                    {{shippingAddress.streetName2}}<br>
                    {{shippingAddress.city}},
                    {{shippingAddress.state}}
                    {{shippingAddress.zipCode}}<br> {{shippingAddress.add}}
                  </div>
                </div>
                <div class="addr-opration addr-edit" :class="{'addr-opration-show':index===operateIndex}">
                  <a href="javascript:;" class="addr-edit-btn" @click.stop="openPop(shippingAddress._id)">
                    <svg class="icon icon-edit">
                      <use xlink:href="#icon-edit"></use>
                    </svg>
                  </a>
                </div>
                <div class="addr-opration addr-del" :class="{'addr-opration-show':index===operateIndex}">
                  <a href="javascript:;" class="addr-del-btn" @click.stop="delAddressActHandle(shippingAddress._id)">
                    <svg class="icon icon-del">
                      <use xlink:href="#icon-del"></use>
                    </svg>
                  </a>
                </div>

              </li>
              <!--add new address-->
              <li class="add-address-item js-add-address" @click="openPop('new')">
                <p>Add new shipping address</p>
              </li>
            </ul>
          </div>
        </div>
        <!-- shipping method-->
        <div class="page-title-normal checkout-title">
          <h2><span>Shipping method</span></h2>
        </div>
        <div class="shipping-method-wrap">
          <div class="shipping-method">
            <ul class="shipping-method-ul shipping-method">
              <li class="selected-method-item selected-method-item-checked">
                <div class="shipping-method-padding">
                  <div class="selected-method-item-checked-title">Standard shipping</div>
                  <div class="selected-method-item-checked-fee">Free</div>
                  <div class="selected-method-item-checked-content">
                    <p>Once shipped, order should arrive in the destination in 1-7 business days</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div slot="iFooter">
      <span class="checkout-next-btn" @click="nextStep">
            <a src="javascript:;">Next >></a>
      </span>
      </div>
    </checking-process>
    <addressPop v-if="popShow" @closePop="closePop"></addressPop>
  </div>

</template>

<script>
  import addressPop from '@/components/address-pop';
  import checkingProcess from '@/components/checking-process'

  export default {
    name: "checkout",
    data() {
      return {
        operateIndex: '',
        selectAddress: {},
        popShow: false,
      }
    },
    components: {
      addressPop,
      checkingProcess
    },
    computed: {
      shippingAddresses() {
        return this.$store.state.shippingAddresses;
      },
      defAddressId() {
        return this.$store.getters.defAddressId;
      },

    },
    mounted() {
      this.getShippingAddressesActHandle();
      this.$store.dispatch('checkLoginAct');
      this.$store.dispatch('updateCartListDataAct');
    },
    methods: {
      getShippingAddressesActHandle() {
        this.$store.dispatch("getShippingAddressesAct");
      },
      setDefaultAddressHandle(id) {
        this.$store.dispatch('setDefaultAddressAct', id);
      },
      showOperate(index) {
        this.operateIndex = index;
      },
      hideOperate() {
        this.operateIndex = ''
      },
      openPop(id) {
        this.$store.commit('setSelectedAddressData', id);
        this.popShow = true;
      },
      closePop() {
        this.popShow = false;
      },
      delAddressActHandle(_id) {
        this.$store.dispatch('delAddressAct', _id)
      },
      nextStep() {
        if (this.defAddressId) {
          this.$router.push({
            name: "OrderConfirm",
            query:{
              addressId: this.defAddressId
            }
          })
        }
      }
    }
  }
</script>

