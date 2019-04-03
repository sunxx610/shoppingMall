<template>
  <div id="main">
    <div class="mobile-filters">
      <div @click="showCategory">Category</div>
      <div @click="showPrice">Price</div>
      <div @click="showSort">Sort</div>
    </div>
    <div class="nav-sub nav-sub-mobile" v-show="categoryShow">
      <div class="nav-sub-wrapper nav-sub-wrapper-mobile">
        <div class="container">
          <ul class="nav-list nav-list-mobile">
            <li v-for="(cate,index) in cateFilter"
                :class="{active:index===cateIndex}"
            >
              <a href="javascript:;"
                 @click="actCateFilter(index)"
              >{{cate}}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>


    <div class="sku-box store-content">
      <div class="sort-option mobile-sort-option" v-show="sortShow">
        <ul class="line clear mobile-line">
          <li v-for="filter in filters">
            <a href="javascript:;" :class="{active:filter.title ===sortTitle}"
               @click="actFilter(filter.value,filter.attr,filter.title)">{{filter.title}}</a>
          </li>
        </ul>
      </div>


      <div class="mainFlexBox">
        <div class="filter mobile-price-filter" id="filter" v-show="priceShow">
          <dl class="filter-price">
            <dt>Price:</dt>
            <dd><a href="javascript:;" @click="setPriceFilter('all')" v-bind:class="{'cur':priceRange=='all'}">All</a>
            </dd>
            <dd v-for="(item,index) in priceFilter">
              <a href="javascript:;" @click="setPriceFilter(index)" v-bind:class="{'cur':priceRange==index}">{{item.startPrice}}
                - {{item.endPrice}}</a>
            </dd>
            <dd><a href="javascript:;" @click="setPriceFilter('>1,000')" v-bind:class="{'cur':priceRange=='>1,000'}">>
              1000</a>
            </dd>
          </dl>
        </div>
        <div class="occupy-fix"></div>

        <div class="flexBoxRight">
          <div class="gray-box">
            <div class="item-box">
              <shop-item v-for="item in goodsData" :key="item.id" :item="item"></shop-item>
            </div>
          </div>
          <div v-show="loading" class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy"
               infinite-scroll-distance="100">
            <img src="./../assets/img/loading-spinning-bubbles.svg" alt="loading">
          </div>
        </div>
      </div>


    </div>

  </div>
</template>

<script>

  import shopItem from '@/components/shop-item'

  export default {
    data() {
      return {
        cateFilter: [
          'All products',
          'Cellphone',
          'Cellphone case',
          'Official accessories',
          'Smart small appliances',
          'Travel'
        ],
        cateIndex: 0,
        filters: [
          {
            title: 'Featured',
            attr: 'price',
            value: ''
          },
          {
            title: 'Sales volume',
            attr: 'xxxxxx',
            value: '-1'
          },
          {
            title: 'Price: Low to high',
            attr: 'price',
            value: '1'
          },
          {
            title: 'Price: High to low',
            attr: 'price',
            value: '-1'
          },
        ],
        goodsData: [],
        page: 1,
        limit: 8,
        sort: '',
        sortTitle: 'Featured',
        attr: '',
        busy: true,
        priceFilter: [
          {
            startPrice: '0.00',
            endPrice: '250.00'
          },
          {
            startPrice: '250.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '725.00'
          },
          {
            startPrice: '725.00',
            endPrice: '1,000.00'
          }
        ],
        priceRange: 'all',
        loading: false
      }
    },
    mounted() {
      this.getGoodsList(false);
      this.$store.dispatch('checkLoginAct');
      this.$store.dispatch('updateCartListDataAct');
      this.$store.commit('hideHeaderNavLi')
    },
    computed: {
      categoryShow() {
        return this.$store.state.categoryShow;
      },
      priceShow() {
        return this.$store.state.priceShow;
      },
      sortShow() {
        return this.$store.state.sortShow;
      }

    },
    components: {
      shopItem
    },
    methods: {
      getGoodsList(addFlag) {
        this.loading = true;
        this.axios.get("/goods", {
          params: {
            page: this.page,
            limit: this.limit,
            sort: this.sort,
            attr: this.attr,
            cate: this.cateIndex,
            priceRange: this.priceRange
          }
        }).then(response => {
          let res = response.data;
          if (res.status == '0') {
            if (!addFlag) {
              this.goodsData = res.result.list;
              this.busy = false;
            } else {
              this.goodsData.push(...res.result.list);
              if (res.result.count < this.limit) {
                this.busy = true
              } else {
                this.busy = false;
              }
            }
          } else {
          }
        });
        setTimeout(() => {
          this.loading = false;
        }, 1500)
      },
      actFilter(value, attr, title) {
        this.sort = value;
        this.sortTitle = title;
        this.attr = attr;
        this.page = 1;
        this.getGoodsList();
        this.$store.commit('hideSortHandle')
      },
      loadMore() {
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 500);
      },
      setPriceFilter(index) {
        this.priceRange = index;
        this.page = 1;
        this.getGoodsList();
        this.$store.commit('hidePriceHandle')
      },
      actCateFilter(index) {
        this.cateIndex = index;
        this.page = 1;
        this.getGoodsList();
        this.$store.commit('hideCategoryHandle');
      },
      showCategory() {
        this.$store.commit('showCategoryHandle');
      },
      showPrice() {
        this.$store.commit('showPriceHandle');
      },
      showSort() {
        this.$store.commit('showSortHandle');
      }
    }
  }
</script>

<style>
  .mobile-filters {
    z-index: 1001;
    display: none;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100px;
    text-align: center;
  }

  .mobile-filters div {
    flex: 1 1;
    display: flex;
    background: rgba(225, 225, 225, 1);
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    font-size: 26px;
    width: 100%;
    -webkit-tap-highlight-color: rgb(248, 248, 248);
    background: #fff;

  }

  /*sub nav*/
  .nav-sub {
    display: block;
    position: relative;
    z-index: 20;
    width: 100%;
    height: 90px;
  }

  .nav-sub .nav-list {
    float: left;
    height: 28px;
    line-height: 28px;
  }

  .nav-sub .nav-list li {
    position: relative;
    float: left;
    padding-left: 2px;
  }

  .nav-sub .nav-list li:first-child {
    padding-left: 0;
  }

  .nav-sub .nav-list li:before {
    content: ' ';
    position: absolute;
    left: 0;
    top: 13px;
    width: 2px;
    height: 2px;
    background: #bdbdbd;
  }

  .nav-sub .nav-list li:first-child:before {
    display: none;
  }

  .nav-sub .nav-list li a {
    display: block;
    padding: 0 20px;
    color: #666;
  }

  /*  .nav-sub .nav-list li:first-child a {
      padding-left: 10px;
    }*/

  .nav-sub .nav-list li.active a {
    font-weight: 700;
  }

  .nav-sub .nav-list li a:hover {
    color: #6b95ea;
  }

  .nav-sub-wrapper {
    margin-left: 10%;
    padding: 31px 0;
    height: 28px;
    position: relative;
  }

  .sku-box {
    position: relative;
  }

  .sku-box, .store-content {
    width: 80%;
    /*max-width: 1220px;*/
  }

  .sort-option {
    margin-left: 200px;
    border-top: 1px solid #D8D8D8;
    color: #999;
  }

  .sort-option ul {
    height: 60px;
    line-height: 60px;
  }

  .sort-option li {
    position: relative;
    float: left;
    padding-left: 42px;
  }

  .sort-option li:first-child {
    padding-left: 9px;
  }

  .mainFlexBox {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }

  .filter {
    position: fixed;
    width: 10%;
    padding-right: 2%;
    color: #605F5F;
    -webkit-transition: right .5s ease-out;
    transition: right .5s ease-out;
  }

  .occupy-fix {
    width: 10%;
    padding-right: 2%;
  }

  .filter dl {
    min-height: 180px;
    margin-bottom: 50px;
  }

  .filter dt {
    margin-bottom: 30px;
    font-family: "moderat", sans-serif;
    letter-spacing: .25em;
    text-transform: uppercase;
    font-weight: bold;
  }

  .filter dd {
    line-height: 1.2em;
    margin: 20px 0;
  }

  .filter dd a {
    display: block;
    padding: 5px 0;
    -webkit-transition: padding-left .3s ease-out;
    transition: padding-left .3s ease-out;
  }

  .filter dd a:hover, .filter dd .cur {
    color: #ee7a23;
  }

  .filter .filter-price dd a:hover, .filter .filter-price dd .cur {
    -webkit-transition: padding-left .3s ease-out;
    transition: padding-left .3s ease-out;
    border-left: 2px solid #ee7a23;
    padding-left: 15px;
  }

  .filter .filter-price dd .cur {
    font-weight: bold;
  }

  .sort-option li:before {
    content: ' ';
    display: block;
    position: absolute;
    left: 10%;
    top: 50%;
    width: 2px;
    height: 2px;
    margin-top: -1px;
    background: #C7C7C7;
  }

  .sort-option li:first-child:before {
    display: none;
  }

  .sort-option a {
    display: block;
    font-size: 18px;
    color: #999;
  }

  .sort-option a.active, .sort-option a:hover {
    color: #5683EA;
  }

  .flexBoxRight {
    margin-bottom: 100px;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }

  .gray-box {
    overflow: hidden;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #dcdcdc;
    border-color: rgba(0, 0, 0, .14);
    box-shadow: 0 3px 8px -6px rgba(0, 0, 0, .1);
  }

  .sku-box .item-box {
    clear: both;
    overflow: hidden;
    margin: 0 -1px -1px -1px;
  }

  .sku-box .item {
    position: relative;
    float: left;
    border-right: 1px solid #efefef;
    border-bottom: 1px solid #efefef;
    width: 25%;
    height: auto;
    background: #fff;
    box-sizing: border-box
  }

  .sku-box .item:hover {
    box-shadow: 0 0 38px rgba(0, 0, 0, .08) inset;
    transition: all .15s ease;
  }

  .sku-box .item .item-img img {
    display: block;
    /*width: 206px;
    height: 206px;
    margin: 50px auto 10px;*/

    width: 70%;
    height: auto;
    margin: 10% auto 2%;
  }

  .sku-box .item h3, .sku-box .item h6 {
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sku-box .item h6 {
    line-height: 1.2;
    font-size: 16px;
    color: #424242;
    margin: 0 auto;
    padding: 0 14px;
  }

  .sku-box .item h3 {
    line-height: 1.2;
    font-size: 12px;
    color: #d0d0d0;
    margin: 8px auto 14px;
  }

  .sku-box .item .params-colors {
    margin-top: 23px;
    text-align: center;
  }

  .sku-box .item .colors-list {
    display: inline-block;
    overflow: hidden;
  }

  .sku-box .item .colors-list li {
    float: left;
    margin: 0 5px;
  }

  .sku-box .item .colors-list > li a {
    width: 8px;
    height: 8px;
    border: 1px solid #e5e5e5;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    padding: 2px;
    display: block;
  }

  .sku-box .item .colors-list > li a.active {
    box-shadow: inset 0 0 0 1px #b2b2b2;
    border-color: #b2b2b2;
  }

  .sku-box .item .colors-list > li img {
    width: inherit;
    height: inherit;
    border-radius: 50%;
    display: block;
  }

  .sku-box .item .item-btns {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 29px;
    text-align: center;
    opacity: 0;
    z-index: 10;
  }

  .sku-box .item:hover .item-btns {
    opacity: 1;
    transition: all .2s ease-in;
  }

  .sku-box .item .item-btns .item-blue-btn, .sku-box .item .item-btns .item-disabled-btn, .sku-box .item .item-btns .item-gray-btn, .sku-box .item .item-btns .item-green-btn {
    display: inline-block;
    box-sizing: border-box;
    width: 100px;
    height: 30px;
    font-size: 12px;
    line-height: 28px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 200;
    transition: all .1s ease;
  }

  .sku-box .item .item-btns .item-gray-btn {
    border: 1px solid #d5d5d5;
    color: #646464;
  }

  .sku-box .item .item-btns .item-gray-btn a {
    display: block;
    color: #a1a1a1;
  }

  .sku-box .item .item-btns .item-gray-btn:hover {
    background-image: linear-gradient(#f6f6f6, #ededed);
  }

  .sku-box .item .item-btns .item-blue-btn {
    background-color: #5c85e5;
    background-image: linear-gradient(#779ae9, #5078df);
    border: 1px solid #5c81e3;
    color: #fff;
    margin-left: 10px;
  }

  .sku-box .item .item-btns .item-blue-btn:hover {
    border: 1px solid #5374c8;
    background-color: #5074db;
    background-image: linear-gradient(#6e8ed5, #4769c2);
  }

  .sku-box .item .item-btns .item-blue-btn:active {
    border: 1px solid #3e61d7;
    background-color: #5c85e5;
    background-image: linear-gradient(#4d72de, #6189e6);
  }

  .sku-box .item .item-price {
    font-family: Arial;
    color: #c30a18;
    margin-top: 24px;
    margin-bottom: 18%;
    text-align: center;
    opacity: 1;
  }

  .sku-box .item .item-price i {
    font-size: 16px;
  }

  .sku-box .item .item-price span {
    font-size: 18px;
    padding-left: 4px;
  }

  .sku-box .item:hover .item-price {
    opacity: 0;
    transition: all .1s ease-out;
  }

  .sku-box .item .discount-icon {
    display: none;
  }

  .sku-box .item .item-cover a {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 20;
    width: 80%;
    height: auto;
  }

  .sku-box .load-more {
    height: 100px;
    line-height: 100px;
  }

  .sku-box .load-more img {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

  @media all and (min-width: 768.1px) and (max-width: 1000px) {
    .sku-box .item {
      width: 33.333%;
    }
  }

  @media all and (max-width: 768px) {
    #main .store-content {
      margin: 0;
      width: 100%;
    }

    .sku-box .item {
      width: 50%;
    }

    .sku-box .filter, .sku-box .occupy-fix, .nav-sub, .sort-option {
      display: none;
    }

    .mobile-filters {
      display: flex;
    }

    .mobile-filters div.actived {
      -webkit-transform: scale(.66667);
      transform: scale(.66667);
      background: linear-gradient(0deg, hsla(0, 0%, 100%, .03), rgba(0, 0, 0, .03));
    }

    #main .nav-sub-mobile {
      display: block;
      position: fixed;
      height: auto;
      bottom: 100px;
      z-index: 1001;
    }

    #main .mobile-sort-option {
      display: block;
      position: fixed;
      width: 100%;
      height: auto;
      bottom: 100px;
      margin-left: 0;
      z-index: 1001;
    }

    #main .mobile-price-filter {
      display: block;
      position: fixed;
      width: 100%;
      height: auto;
      bottom: 100px;
      margin-left: 0;
      z-index: 1001;
    }
    #main .mobile-price-filter dl {
      margin: 0;
    }
    #main .mobile-price-filter dt {
      display: none;
    }

    #main .mobile-sort-option ul {
      height: auto;
    }

    #main .nav-list-mobile {
      z-index: 1001;
      float: none;
      height: auto;
    }

    #main .nav-sub-mobile .nav-sub-wrapper-mobile {
      margin-left: 0;
      height: auto;
      padding-bottom: 0;
    }

    #main .nav-sub-mobile .nav-list-mobile li {
      float: none;
      width: 100%;
      height: 80px;
      line-height: 100px;
      font-size: 26px;
      background: #fff;
      border: 0.013333rem solid #d6d6d6;
      border-color: rgba(0, 0, 0, .08);
      border-radius: 0.106667rem;
      -webkit-box-shadow: 0 0.266667rem 0.533333rem rgba(0, 0, 0, .15);
      box-shadow: 0 0.266667rem 0.533333rem rgba(0, 0, 0, .15);
    }

    #main .mobile-line li {
      float: none;
      width: 100%;
      height: 80px;
      padding-left: 0.266667rem;
      line-height: 100px;
      font-size: 0.346667rem;
      background: #fff;
      border: 0.013333rem solid #d6d6d6;
      border-color: rgba(0, 0, 0, .08);
      border-radius: 0.106667rem;
      -webkit-box-shadow: 0 0.266667rem 0.533333rem rgba(0, 0, 0, .15);
      box-shadow: 0 0.266667rem 0.533333rem rgba(0, 0, 0, .15);
    }

    #main .mobile-price-filter dd {
      float: none;
      width: 100%;
      height: 80px;
      margin: 0;
      padding-left: 0.266667rem;
      line-height: 100px;
      font-size: 0.346667rem;
      background: #fff;
      border: 0.013333rem solid #d6d6d6;
      border-color: rgba(0, 0, 0, .08);
      border-radius: 0.106667rem;
      -webkit-box-shadow: 0 0.266667rem 0.533333rem rgba(0, 0, 0, .15);
      box-shadow: 0 0.266667rem 0.533333rem rgba(0, 0, 0, .15);
    }
  }

  @media all and (max-width: 400px) {
    .sku-box .item {
      width: 100%;
    }

    .sku-box .filter, .sku-box .occupy-fix, .nav-sub nav-sub-mobile, .sort-option {
      display: none;
    }

    .mobile-filters {
      display: flex;
    }
  }

  @media all and (min-width: 768.1px) {
    #main .nav-sub-mobile, .mobile-sort-option, .mobile-price-filter {
      display: block !important;
    }
  }


</style>