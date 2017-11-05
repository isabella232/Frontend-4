<template>
  <div id="search-page">
    <navbar></navbar>
    <div id="title-container">

      <div id="title-box">
        <h1>Photo Scout</h1>
        <h2>Where will you go next?</h2>
      </div>

      <loginform></loginform>
    </div>
  </div>
</template>

<script>
import searchbar from './Components/SearchBar.vue'
import loginform from './Components/LoginForm.vue'
import navbar from './Components/Navbar.vue'

export default {
  name: 'search',
  components:{
    searchbar,
    loginform,
    navbar
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
@import "styles/global.scss";

#search-page {
  background: url('assets/bg.jpg') no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;

  #title-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.7) 40%,rgba(0,0,0,0) 100%);
      text-align: center;

      h1, h2 {
          margin: 0em;
      }

      h1 {
          font-weight: 300;
          font-size: 7em;
      }

      h2 {
          font-weight: 100;
          font-size: 3.5em;
      }
  }
}
</style>
