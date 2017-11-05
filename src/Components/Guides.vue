<template>
  <div id="guide-view">
    <div v-for="(guide, index) in guides" v-bind:key="index" class="guide">
      <router-link :to="{ name: 'guide', params: { guideID: guide.id, view: 'view' }}">
        <div class="bg" v-bind:style='{backgroundImage: "url(" + guide.photos[0].url + ")", }'></div>
        <h3 class="title">{{guide.title}}</h3>
      </router-link>
    </div>
    <div class="guide new">
      <h3 class="title">Create a new guide</h3>
    </div>
  </div>
</template>

<script>
import auth from '../auth'

export default {
  name: 'guides',
  components:{
  },

  data () {
    return {
      guides: []
    }
  },

  mounted: function () {
      this.$http.get('http://127.0.0.1:5000/api/v1/guides', {
        headers: auth.getAuthHeader()
      }).then(response => {

          // get body data
          this.guides =  response.body;

      }, response => {
          // error callback
      });
  }
}
</script>

<style lang="scss">
// @import "styles/global.scss";

#guide-view {
  display: flex;
  position: relative;
  width: 100%;
  overflow: auto;
  align-items: center;

  .guide {
    display: flex;
    align-items: center;

    flex: 10 0 auto;
    position: relative;
    flex-grow: 0;

    width: 25em;
    height: 18em;
    margin: 3em;
    border-radius: 0.5em;

    overflow: hidden;

    .bg {
      background: no-repeat center center;
      background-size: cover;
      filter: sepia(70%) saturate(60%) brightness(0.8);
      position: absolute;
      width: 110%;
      height: 110%;
      top: -5%;
      left: -5%;
      z-index: 1;
    }

    .title {
      color: white;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-align: center;
      margin-top: 1em;
      font-size: 2em;
      font-weight: normal;

      text-align: center;
      width: 100%;
      z-index: 2;
    }

    &.new {
      border: 2px dashed #ccc;

      &:hover {
        background-color: #252525;
      }

      .title {
        font-size: 2em;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: normal;
      }
    }
  }
}


</style>
