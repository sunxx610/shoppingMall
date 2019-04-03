import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);

let store = new Vuex.Store({
  state: {
    userName: '',
    cartListData: [],
    shippingAddresses: [],
    selectedAddressData: {},
    maskFlag: false,
    signFlag: '',
    logErrorTip: false,
    regErrorTip: false,
    regErrorMsg: '',
    pop: {
      show: false,
      title: '',
      msg: '',
      confirm: ''
    },
    // maxMountOff: false,
    cartShow: false,
    cartTimer: null,
    ball: {
      show: false,
      el: null,
      img: ''
    },
    targetOrderData: {},
    headerNavLiShow: false,
    categoryShow: false,
    priceShow: false,
    sortShow: false
  },
  getters: {
    defAddressId(state) {
      let id = '';
      state.shippingAddresses.forEach(item => {
        if (item.isDefault) {
          id = item._id
        }
      });
      return id;
    },

    totalCount(state) {
      let totalCount = 0;
      state.cartListData.forEach(item => {
        totalCount += item.itemCount;
      });
      return totalCount;
    },
    totalPrice(state) {
      let totalPrice = 0;
      state.cartListData.forEach(item => {
        totalPrice += item.price * item.itemCount;
      });
      return totalPrice;
    },
    allChecked(state) {
      let allChecked = true;
      state.cartListData.forEach(item => {
        if (item.checked == false) {
          allChecked = false;
          return;
        }
      });
      return allChecked;
    },
    checkedCount(state) {
      let count = 0;
      state.cartListData.forEach(item => {
        if (item.checked) count += item.itemCount;
      });
      return count;
    },
    checkedPrice(state) {
      let checkedPrice = 0;
      state.cartListData.forEach(item => {
        if (item.checked) checkedPrice += item.itemCount * item.price;
      });
      return checkedPrice;
    },
    /*checkedItemsInfo(state) {
      let checkedItemsInfo = [];
      state.cartListData.forEach(item => {
        if (item.checked) checkedItemsInfo.push(item);
      });
      return checkedItemsInfo;
    }*/
  },
  mutations: {
    showHeaderNavLi(state) {
      if(!state.headerNavLiShow)this.commit('hideAllList')
      state.headerNavLiShow = !state.headerNavLiShow;
      state.maskFlag = state.headerNavLiShow;
    },
    hideHeaderNavLi(state) {
      state.headerNavLiShow = false;
      state.maskFlag = false;
    },
    showCategoryHandle(state) {
      if(!state.categoryShow)this.commit('hideAllList')
      state.categoryShow = !state.categoryShow;
      state.maskFlag = state.categoryShow;
      console.log(this.state.maskFlag)
    },
    hideCategoryHandle(state) {
      state.categoryShow = false;
      state.maskFlag = false;
    },
    showPriceHandle(state) {
      if(!state.priceShow)this.commit('hideAllList')
      state.priceShow = !state.priceShow;
      state.maskFlag = state.priceShow;
      console.log(this.state.priceShow)
    },
    hidePriceHandle(state) {
      state.priceShow = false;
      state.maskFlag = false;
    },
    showSortHandle(state) {
      if(!state.sortShow)this.commit('hideAllList')
      state.sortShow = !state.sortShow;
      state.maskFlag = state.sortShow;
      console.log(this.state.sortShow)
    },
    hideSortHandle(state) {
      state.sortShow = false;
      state.maskFlag = false;
    },
    hideAllList() {
      this.commit('hideHeaderNavLi');
      this.commit('hideCategoryHandle');
      this.commit('hidePriceHandle');
      this.commit('hideSortHandle');
    },

    showLogErrorTip(state) {
      state.logErrorTip = true;
    },
    hideLogErrorTip(state) {
      state.logErrorTip = false;
    },
    showRegErrorTip(state, msg) {
      state.regErrorTip = true;
      state.regErrorMsg = msg;
    },
    hideRegErrorTip(state) {
      state.regErrorTip = false;
      state.regErrorMsg = '';
    },

    showSign(state, flag) {
      state.maskFlag = true;
      state.signFlag = flag;
      state.logErrorTip = false;
      state.regErrorTip = false;
    },
    hideSign(state) {
      state.maskFlag = false;
      state.signFlag = '';
    },
    showPop(state, props) {
      state.pop = {
        show: true,
        ...props
      };
    },
    hidePop(state) {
      state.pop = {
        show: false,
        title: '',
        msg: '',
        confirm: ''
      }
    },
    showCart(state) {
      clearTimeout(state.cartTimer);
      state.cartShow = true
    },
    hideCart(state, flag) {
      if (flag) {
        state.cartShow = false;
      }
      else (
        state.cartTimer = setTimeout(() => {
          state.cartShow = false
        }, 600)
      )
    },
    addGoodsToCartList(state, cartListDate) {
      state.cartListData = cartListDate;
    },
    updateCartListData(state, cartListDate) {
      state.cartListData = cartListDate
    },
    updateUserInfoData(state, userName) {
      state.userName = userName
    },

    getShippingAddresses(state, shippingAddressData) {
      state.shippingAddresses = shippingAddressData;
    },
    setSelectedAddressData(state, id) {
      if (id == 'new') {
        state.selectedAddressData = {};
      } else {
        state.shippingAddresses.forEach(address => {
          if (address._id == id) {
            state.selectedAddressData = address;
            return;
          }
        })
      }
    },
    getTargetOrderData(state, orderData) {
      state.targetOrderData = orderData;
    }


    /*addCartPanelData(state, data) {
      if (!state.ball.show) {
        let bOff = true;
        state.cartListData.forEach(item => {
          if (Number(item.sku_id) === Number(data.itemInfo.sku_id)) {
            item.count += data.count;
            bOff = false;
            if (item.count > item.limit_num) {
              item.count -= data.count;
              state.maxMountOff = true;
              return
            }
            state.cartShow = true;
            state.ball.show = true;
            state.ball.el = event.path[0];
            state.ball.img = data.itemInfo.ali_image + '?x-oss-process=image/resize,w_32/format,webp';
          }
        });
        if (bOff) {
          let itemData = data.itemInfo;
          Vue.set(itemData, 'count', data.count);
          Vue.set(itemData, 'checked', true);
          state.cartListData.push(itemData);
          state.cartShow = true;
          state.ball.show = true;
          state.ball.el = event.path[0];
          state.ball.img = data.itemInfo.ali_image;
        }
      }
    },*/
    /*delCartPanelData(state, id) {
      state.cartListData.forEach((item, index) => {
        if (Number(item.sku_id) === Number(id)) {
          state.cartListData.splice(index, 1);
          return;
        }
      })
    },
    closeMaxMountReminder(state) {
      state.maxMountOff = false;
    },
    showCart(state) {
      clearTimeout(state.cartTimer);
      state.cartShow = true
    },
    hideCart(state) {
      state.cartTimer = setTimeout(() => {
        state.cartShow = false
      }, 600)
    },
    addItemCount(state, id) {
      state.cartListData.forEach(item => {
        if (Number(item.sku_id) === Number(id)) {
          if (item.count >= item.limit_num) return;
          item.count++;
          return;
        }
      })
    },
    subItemCount(state, id) {
      state.cartListData.forEach(item => {
        if (Number(item.sku_id) === Number(id)) {
          if (item.count <= 1) return;
          item.count--;
          return;
        }
      })
    },
    checkItem(state, id) {
      state.cartListData.forEach(item => {
        if (Number(item.sku_id) === Number(id)) {
          item.checked = !item.checked;
          return;
        }
      })
    },
    checkAllItems(state, allChecked) {
      state.cartListData.forEach(item => {
        item.checked = !allChecked;
      })
    },
    delAllSelectedItem(state) {
      let n = state.cartListData.length;
      while (n--) {
        if (state.cartListData[n].checked)
          state.cartListData.splice(n, 1);
      }
    },
    saveNewAddress(state, newReceiverInfo) {
      if (newReceiverInfo.default) {
        state.receiverInfo.forEach(address => {
          address.default = false;
        })
      }
      state.receiverInfo.push(newReceiverInfo);
    },
    submitOrder(state, orderData) {
      state.orderData.unshift(orderData);
      let n = state.cartListData.length;
      while (n--) {
        if (state.cartListData[n].checked)
          state.cartListData.splice(n, 1);
      }
    },
    payNow(state, id) {
      state.orderData.forEach(order => {
        if (order.orderId === id) {
          order.isPay = true;
          return;
        }
      })
    }*/
  },
  actions: {
    loginAct({commit, dispatch}, {userName, userPwd, rememberSign}) {
      axios.post("/users/login", {
        userName,
        userPwd,
        rememberSign
      }).then((response) => {
        let res = response.data;

        if (res.status === '0') {
          commit('hideSign');
          dispatch('updateCartListDataAct');
          dispatch('checkLoginAct');
        } else {
          commit('showLogErrorTip')
        }
      })
    },
    registerAct({commit, dispatch}, {userName, userPwd, rememberSign}) {
      axios.post("/users/register", {
        userName,
        userPwd,
        rememberSign
      }).then((response) => {
        let res = response.data;

        if (res.status === '0') {
          commit('hideSign');
          dispatch('updateCartListDataAct');
          dispatch('checkLoginAct');
        } else {
          commit('showRegErrorTip', res.msg)
        }
      })
    },
    logoutAct({commit, dispatch}) {
      axios.post("/users/logout", {}).then((response) => {
        let res = response.data;
        if (res.status === '0') {
          commit('updateUserInfoData', '')
          commit('updateCartListData', []);
        }
      })
    },
    checkLoginAct({commit}) {
      axios.get("/users/checkLogin").then(response => {
        let res = response.data;
        if (res.status === '0') {
          commit('updateUserInfoData', res.result.userName);
        } else {
          commit('updateUserInfoData', '');
        }
      })
    },
    addGoodsToCartListAct({commit}, {itemId, addCount}) {
      axios.post("/goods/addCart", {
        itemId,
        addCount
      }).then(response => {
        let res = response.data;
        if (res.status === '0') {
          commit('addGoodsToCartList', res.result.list);
          if (res.result.exceedFlag)
            commit('showPop', {
              title: 'Alert',
              msg: `Sorry, we don't have enough inventory, the maximum quantities of this product you can add to cart is: ${res.result.limit_num}`,
              confirm: 'Confirm'
            });
        } else if (res.status === '10001') {
          commit('showSign', 'signIn');
        } else {
          alert('msg: ' + res.msg)
        }
      })
    },
    updateCartListDataAct({commit}) {
      axios.get("/users/cartList").then(response => {
        let res = response.data;
        if (res.status === '0') {
          commit('updateCartListData', res.result);
        }
      })
    },
    delCartAct({dispatch}, itemId) {
      axios.post("users/delCart", {
        itemId
      }).then(response => {
        let res = response.data;
        if (res.status === '0')
          dispatch('updateCartListDataAct')
      })
    },
    editCartAct({commit, dispatch}, params) {
      if (params.checked === 1 || params.checked === -1) {
        params.itemCount += params.checked;
        if (params.itemCount < 1) {
          return
        }
      }
      axios.post("users/editCart", params).then(response => {
        let res = response.data;
        if (res.status === '0') {
          if (res.result.exceedFlag) {
            commit('showPop', {
              title: 'Alert',
              msg: `Sorry, we don't have enough inventory, the maximum quantities of this product you can add to cart is: ${res.result.limit_num}`,
              confirm: 'Confirm'
            });
          }
          dispatch('updateCartListDataAct');
        }
      })
    },
    checkAllItemsAct({dispatch}, allChecked) {
      axios.post("/users/checkAll", {allChecked}).then(response => {
        let res = response.data;
        if (res.status === '0') {
          dispatch('updateCartListDataAct');
        }
      })
    },
    delAllCheckedItemsAct({dispatch}) {
      axios.post("/users/delAllChecked").then(response => {
        let res = response.data;
        if (res.status === '0') {
          dispatch('updateCartListDataAct');
        }
      })
    },

    getShippingAddressesAct({commit}) {
      axios.get("/users/addressList").then(response => {
        let res = response.data;
        console.log('address', res.status)
        if (res.status === '0') {
          commit('getShippingAddresses', res.result);
        } else if (res.status === '10001') {
          commit('showSign', 'signIn');
        }
      })
    },

    setDefaultAddressAct({commit}, addressId) {
      axios.post("/users/setDefaultAddress", {addressId}).then(response => {
        let res = response.data;
        if (res.status === '0') {
          commit('getShippingAddresses', res.result)
        }
      })
    },

    addNewAddressAct({commit}, newAddressInfo) {
      axios.post("/users/addNewAddress", {newAddressInfo}).then(response => {
        let res = response.data;
        if (res.status === '0') {
          commit('getShippingAddresses', res.result)
        }
      })
    },

    editAddressAct({commit}, newAddressInfo) {
      axios.post("/users/editAddress", {newAddressInfo}).then(response => {
        let res = response.data;
        if (res.status === '0') {
          commit('getShippingAddresses', res.result)
        }
      })
    },

    delAddressAct({dispatch, commit, state}, _id) {
      if (state.shippingAddresses.length < 2)
        return
      axios.post("/users/delAddress", {_id}).then(response => {
        let res = response.data;
        if (res.status === '0') {
          dispatch('getShippingAddressesAct')
        }
      })
    },

    getTargetOrderDataAct({commit}, orderId) {
      axios.get("/users/orderDetails", {params: {orderId}}).then(response => {
        let res = response.data;
        if (res.status === '0') {
          commit('getTargetOrderData', res.result.targetOrder)
        } else if (res.status === '10001') {
          commit('showSign', 'signIn');
        }
      })
    }
  }
});

export default store