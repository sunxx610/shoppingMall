<template>
  <div class="section-404">
    <div class="container">
      <div class="img-box"></div>
      <h2 class="title">Sorry, the page you visit is not exist.</h2> <!----><p class="prompt">Please check the web page address</p>
      <router-link to="/" tag="button"  class="back-btn">Return to home</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "err404",
    mounted(){
    }
  }
</script>

<style scoped>
  .section-404 {
    background: url("../assets/img/error-bg.a948d6bf2606c58f7a715feb7dadc49d.png") repeat;
    padding: 1px 0;
  }
  .section-404 .container {
    width: 314px;
    height: 340px;
    text-align: center;
    margin: 112px auto 220px;
  }
  .section-404 .container .img-box {
    display: inline-block;
    width: 205px;
    height: 205px;
    background: url("../assets/img/icon.2a14d7d2e314e85caf53e654e6c81201.png") 50%;
  }
  .section-404 .container .title {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin: 28px 0 20px;
  }
  .section-404 .container .prompt {
    font-size: 14px;
    color: #999;
    margin-bottom: 20px;
  }
  .section-404 .container .back-btn {
    padding: 6px 10px;
    border: 1px solid #d0d0d0;
    border-radius: 6px;
    font-weight: 700;
    font-size: 14px;
    color: #666;
    margin: 0 auto;
    cursor: pointer;
    transition: all .15s ease-out;
    background-color: transparent;
  }
</style>