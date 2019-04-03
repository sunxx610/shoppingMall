<template>

  <li class="nav-cart" @mouseenter="showCartHandle" @mouseleave="hideCartHandle">
    <router-link
        class="shop-cart"
        :to="{name:'Cart'}"
        tag="a"
    >Cart</router-link>
    <!--class control color-->
    <span class="cart-empty-num" :class="{'cart-num':totalCount>0}">
								<i>{{totalCount}}</i>
							</span>
    <div class="nav-cart-wrapper" v-show="cartShow">
      <div class="nav-cart-list">
        <div class="empty" v-if="totalCount<=0">
          <h3>Cart is empty</h3>
          <p>You haven't pick any item, go shopping now!</p>
        </div>
        <div class="full" v-else="totalCount>0">
          <div class="nav-cart-items">
            <ul>
              <li class="clear" v-for="item in cartListData">
                <div class="cart-item js-cart-item cart-item-sell">
                  <div class="cart-item-inner">
                    <div class="item-thumb">
                      <img :src="'/static/goodsPic/'+item.ali_image"
                           height="80" width="80"
                      >
                    </div>
                    <div class="item-desc">
                      <div class="cart-cell">
                        <h4>
                          <router-link
                              :to="{name:'Item',query:{itemId:item.sku_id,id:item.sku_id.substr(0,7)}}"
                              tag="a"
                          >{{item.title}}</router-link>
                        </h4>
                        <p class="attrs">
                          <span>{{item.show_name}}</span>
                        </p>
                        <h6>
                          <span class="price-icon"></span><span
                            class="price-num">{{item.price|currency('$')}}</span><span
                            class="item-num"> x {{item.itemCount}}</span>
                        </h6>
                      </div>
                    </div>
                    <div class="del-btn" @click="delCartActHandle(item.sku_id)">Delete</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="nav-cart-total">
            <p>Total <strong class="ng-binding">{{totalCount}}</strong> items</p>
            <h5>Total：<span class="price-icon"></span><span class="price-num ng-binding"
                                                             ng-bind="cartMenu.totalPrice">{{totalPrice|currency('$')}}</span>
            </h5>
            <h6>
              <router-link class="nav-cart-btn" :to="{name:'Cart'}">Go cart</router-link>
            </h6>
          </div>
        </div>
      </div>
    </div>
    <transition
        name="ball"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        :css="true"
    >
      <div class="addcart-mask" v-show="ball.show">
        <img class="ball-item mask-item">
      </div>
    </transition>
  </li>
</template>

<script>
  export default {
    name: "cart-panel",
    computed: {
      cartListData() {
        return this.$store.state.cartListData;
      },
      cartShow() {
        return this.$store.state.cartShow;
      },
      ball() {
        return this.$store.state.ball;
      },
      totalCount() {
        return this.$store.getters.totalCount;
      },
      totalPrice() {
        return this.$store.getters.totalPrice;
      }
    },
    methods: {
      delCartActHandle(id) {
        this.$store.dispatch('delCartAct',id);
      },
      showCartHandle() {
        this.$store.commit('showCart')
      },
      hideCartHandle() {
        this.$store.commit('hideCart')
      },
      beforeEnter(el) {
        // console.log(el)
        let startRect = this.ball.el.getBoundingClientRect();
        let endRect = document.getElementsByClassName('shop-cart')[0].getBoundingClientRect();
        let ball = document.getElementsByClassName('ball-item')[0];
        let x = (startRect.left + startRect.width / 2) - (endRect.left + endRect.width / 2);
        let y = (startRect.top + startRect.height / 2) - (endRect.top + endRect.height / 2);
        el.style.transform = 'translate3d(0,' + y + 'px,0)';
        ball.style.transform = 'translate3d(' + x + 'px,0,0)';
        ball.src = this.ball.img;
      },
      enter(el) {
        let ball = document.getElementsByClassName('ball-item')[0];
        el.a = el.offsetWidth;//let browser run enter function
        el.style.transform = 'translate3d(0,0,0)';
        ball.style.transform = 'translate3d(0,0,0)';
      },
      afterEnter() {
        this.ball.show = false;
      }
    }
  }
</script>

<style scoped>
  .ball-enter-active {
    transition: .5s cubic-bezier(.65, 1.03, .99, 1.23);
  }

  .ball-enter-active .mask-item {
    transition: .5s cubic-bezier(0, 0, 1, 1);
  }
</style>