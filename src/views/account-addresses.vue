<template>
  <div class="account-content">
    <div class="account-address">
      <div class="gray-box clear">
        <div class="title pre-title">
          <h2 class="fn-left">Shipping addresses</h2>
          <span class="gray-blue-btn js-add-address" @click="openPop('new')"><a class="add">Add new address</a></span>
        </div>
        <div>
          <div class="box-inner clear" v-for="(shippingAddress,index) in shippingAddresses">
            <div class="address-list-item default-item" data-id="765532"
                 @click="setDefaultAddressHandle(shippingAddress._id)"
                 @mouseenter="showOperate(index)"
                 @mouseleave="hideOperate">
              <div class="name fn-left">
                <div class="name-cell">{{shippingAddress.name}}</div>
              </div>
              <div class="detail fn-left">
                <div class="detail-cell">{{shippingAddress.streetName}},{{shippingAddress.streetName2}}
                  {{shippingAddress.city}}, {{shippingAddress.state}}
                  {{shippingAddress.zipCode}}
                </div>
              </div>
              <div class="operation fn-right">
                <div class="operation-cell" :class="{'address-operation-show':index===operateIndex}">
                  <a class="gray-edit-btn js-edit-address" @click.stop="openPop(shippingAddress._id)">Edit</a>
                  <span class="red-del-btn js-del-address" @click.stop="delAddressActHandle(shippingAddress._id)"> <a>Delete</a><em>Delete</em> </span>
                </div>
              </div>
              <div class="fn-right default-div" :class="{default:shippingAddress.isDefault}"> (Default)</div>
              <div class="telephone fn-right">{{shippingAddress.tel}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <addressPop v-if="popShow" @closePop="closePop"></addressPop>
  </div>
</template>

<script>
  import addressPop from '@/components/address-pop';

  export default {
    name: "account-address",
    data() {
      return {
        operateIndex: '',
        popShow: false,
      }
    },
    components: {
      addressPop
    },
    computed: {
      shippingAddresses() {
        return this.$store.state.shippingAddresses;
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
        console.log('account-address id',_id)
        this.$store.dispatch('delAddressAct', _id)
      },
    }
  }
</script>

