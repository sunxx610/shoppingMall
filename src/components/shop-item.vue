<template>
  <div class="item">
    <div>
      <div class="item-img">
        <router-link
            :to="{name:'Item',query:{itemId:item.sku_list[index].sku_id,id:item.id}}"
        >
          <img alt="item.name"
               :src="'/static/goodsPic/'+item.sku_list[index].ali_images[0]"
               style="opacity: 1;">
        </router-link>

      </div>
      <h6>{{item.sku_list[index].title}}</h6>
      <h3>{{item.sku_list[index].sub_title}}</h3>
      <div class="params-colors">
        <ul class="colors-list">
          <li v-for="(sku,skuIndex) in item.sku_list">
            <a :title="sku.spec_json.show_name" href="javascript:;" @click="selectColor(skuIndex)"
               :class="{'active':skuIndex==index}"><img
                :src="'/static/goodsPic/'+sku.spec_json.image"></a>
          </li>
        </ul>
      </div>
      <div class="item-btns clearfix">
        <span class="item-gray-btn">
          <router-link
              :to="{name:'Item',query:{itemId:item.sku_list[index].sku_id,id:item.id}}"
          >Details</router-link> </span>
        <span
            class="item-blue-btn"
            @click="addCart(item.sku_list[index].sku_id,1)"
        >Add to cart</span>
      </div>
      <div class="item-price clearfix">
        <i></i><span>{{(item.sku_list[index].price)|currency('$')}}</span>
      </div>
      <div class="discount-icon">false</div>
      <div class="item-cover">
        <router-link
            :to="{name:'Item',query:{itemId:item.sku_list[index].sku_id,id:item.id}}"
        ></router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "shop-item",
    components: {},
    data() {
      return {
        index: 0,
      }
    },
    computed: {
      cartListData() {
        return this.$store.state.cartListData;
      }
    },
    props: {
      item: {
        type: Object
      }
    },
    methods: {
      selectColor(index) {
        this.index = index;
      },
      addCart(itemId, addCount) {
        this.$store.dispatch('addGoodsToCartListAct', {itemId, addCount});
      },
      showSignHandle() {
        this.$store.commit('showSign', 'signIn');
      }
    }
  }
</script>

<style scoped>

</style>