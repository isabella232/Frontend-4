<template>
  <div id="travel-page">
    <navbar></navbar>
    <div class="hero">
      <h2>Find your next voyage</h2>
    </div>
    <div id="guides">
      <div id="search">
        <i class="fa fa-search" aria-hidden="true"></i>
        <input type="text" placeholder="Search...">
      </div>
      <guides></guides>
    </div>
    <div id="guide-info">
      <h2>Nontron</h2>
    </div>
  </div>
</template>

<script>
import navbar from './Components/Navbar.vue'
import guides from './Components/Guides.vue'

export default {
  name: 'travel',
  components:{
    navbar,
    guides
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

#travel-page {
  .hero {
    background: url('assets/bg2.jpg') no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    height: 35em;

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
      background-color: #222;
      width: 150%;
      height: 100px;
      position: absolute;
      left: -25%;
      bottom: -50px;
    }
  }

  #guides {
    background-color: #222;
    display: block;
    padding: 0em 2em;

    #search {
      width: 100%;
      padding: 1em 2em;
      text-align: center;
      display: flex;
      color: #ccc;
      font-size: 2em;

      input {
        border: none;
        background: none;
        width: 100%;
        color: #eee;
        font-size: 1em;
        margin-left: 1em;
      }
    }
  }

  #guide-info {
    background-color: #FCFCFC;
    padding: 3em 2em;

    h2 {
      margin: 0;
      color: #222;
    }
  }
}
</style>
