<template>
  <div id="app">
    <header-nav></header-nav>
    <popUp></popUp>
    <router-view/>
  </div>
</template>

<script>
  import headerNav from '@/components/header-nav'
  import popUp from '@/components/pop-up'

  export default {
    name: 'App',
    components: {
      headerNav,
      popUp
    }
  }
</script>

