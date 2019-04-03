<template>
  <div>
    <div class="dialog dialog-shadow" style="display: block; margin-top: -323.5px;">
      <span class="signClose" @click="childClose">x</span>
      <div class="title">
        <slot name="title"></slot>
      </div>
      <div class="content-sign" style="height: auto; opacity: 1;">
        <slot name="form"></slot>
      </div>
    </div>
  </div>


</template>

<script>
  export default {
    name: "sign-panel",
    methods: {
      childClose() {
        this.$emit('signClose')
      }
    }
  }
</script>
