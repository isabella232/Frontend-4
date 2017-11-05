<template>
  <div id="account-page">
    <navbar></navbar>
    <div class="hero">
    </div>
    <div id="account-data">
        <h2>Thomas Poulet</h2>
        <span>username:</span>
    </div>
  </div>
</template>

<script>
import navbar from './Components/Navbar.vue'

export default {
  name: 'account',
  components:{
    navbar
  },
  data () {
    return {
      // {selected: "photo"}
    }
  }
}
</script>

<style lang="scss">
@import "styles/global.scss";

#account-page {
  .hero {
    background: url('assets/account.jpg') no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-position-y: -25em;
    height: 25em;

    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;

    h2 {
      text-align: center;
      width: 100%;
      font-size: 3em;
    }

    &:after {
      content: " ";
      transform: rotate(-3deg);
    background-color: #FCFCFC;
      width: 150%;
      height: 100px;
      position: absolute;
      left: -25%;
      bottom: -50px;
    }
  }

  #account-data {
    color: #333;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
  }
}
</style>
