<template>
  <div id="guide-view">
    <div v-for="(guide, index) in guideByDate" v-bind:key="index" class="guide">
      <router-link :to="{ name: 'guide', params: { guideID: guide.id, view: 'view' }}">
        <div class="bg" v-if="guide.photos[0]" v-bind:style='{backgroundImage: "url(" + guide.photos[0].url + ")", }'></div>
        <h3 class="title">{{guide.title}}</h3>
      </router-link>
    </div>
    <div class="guide new">
      <input type="text" placeholder="Create a new guide" class="title input" v-model="newguide">
      <p v-if="newguide" class="title button" v-on:click="createGuide">Create!</p>
    </div>
  </div>
</template>

<script>
import api from '../api'
import auth from '../auth'

export default {
  name: 'guides',
  components:{
  },

  data () {
    return {
      guides: [],
      newguide: ""
    }
  },

  mounted: function () {
    api.ListGuides(this, data => {this.guides = data.body}, function(){})
  },

  computed: {
    guideByDate: function () {
      return this.guides.sort((a,b) =>
        new Date(a.creation) < new Date(b.creation)
      )
    }
  },

  methods: {
    createGuide: function () {
      api.CreateGuide(this, function(){}, function(){}, {title: this.newguide})
    }
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
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 25em;
    height: 18em;
    margin: 3em;
    border-radius: 0.5em;

    overflow: hidden;

    border: 1px solid #333;

    .bg {
      background: no-repeat center center;
      background-size: cover;
      filter: sepia(70%) saturate(90%) brightness(0.4);
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
      // margin-top: 1em;
      font-size: 2em;
      font-weight: normal;
      position: relative;

      text-align: center;
      width: 100%;
      z-index: 2;
      text-shadow: 0px 0px 4px black;
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

        &.input {
          border: none;
          background: none;
        }

        &.button {
          font-weight: 300;
          font-size: 1.2em;
        }
      }
    }
  }
}


</style>
