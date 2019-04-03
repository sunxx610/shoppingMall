<template>
  <div id="prompt" v-if="pop.show">
    <div class="module-dialog-layer" style="display: block;" ></div>
    <div class="clear module-dialog module-dialog-confirm module-dialog-show" style="display: block; opacity: 1;" @click="hidePopHandle">
      <div class="dialog-panel">
        <div class="topbar">
          <div class="dialog-tit clear">
            <slot name="title"></slot>
            <h4 class="js-dialog-title">{{pop.title}}</h4>
          </div>
          <span class="dialog-close png" @click="hidePopHandle"></span>
        </div>
        <div class="dialog-con js-dialog-container">
          <slot name="msg"></slot>
          <div class="confirm-msg"><p style="text-align: left">{{pop.msg}}</p></div>
        </div>
        <div class="dialog-btn-wrap clear">
          <div class="blue-main-btn normal-main-btn js-dialog-done" @click="hidePopHandle">
            <slot name="confirm"></slot>
            <a href="javascript:;" @click="hidePopHandle">{{pop.confirm}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "pop-up",
    computed: {
      pop() {
        return this.$store.state.pop
      }
    },
    methods: {
      hidePopHandle() {
        this.$store.commit('hidePop');
      }
    }
  }
</script>
