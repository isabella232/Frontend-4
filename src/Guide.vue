<template>
  <div id="guide-page">
      <navbar></navbar>
    <div class="hero">
      <h2>{{guide.title}}</h2>
    </div>
    <nav id="app-nav">
      <ul>
        <li><router-link to="view">View</router-link></li>
        <li><router-link to="search">Search</router-link></li>
        <li><router-link to="map">Map</router-link></li>
      </ul>
    </nav>
    <div v-if="view=='view'" id="photo" v-masonry transition-duration="0.3s" item-selector=".item">
      <image-tile  v-masonry-tile v-for="(image, index) in guide.photos" v-bind:key="index" v-bind:image.sync="image" v-bind:selection="true" v-on:selected="removePhoto(image)"></image-tile>
    </div>
    <div v-if="view=='search'" id="search-view" >
      <searchbar  v-bind:button="true" v-on:search="searchImage"></searchbar>
      <div id="search-results"v-masonry transition-duration="0.3s" item-selector=".item">
        <image-tile  v-masonry-tile v-for="(photo, index) in photos" v-bind:key="index" v-bind:image.sync="photo" v-bind:selection="true" v-on:selected="addImage(photo)"></image-tile>
      </div>
    </div>
    <div v-if="view=='map'" id="map-view" >
      <v-map :zoom=13 :center="[guide.photos[3].latitude, guide.photos[3  ].longitude]">
        <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
        <v-marker v-for="(photo, index) in guide.photos" v-bind:key="index" v-if="photo.latitude!=0" :lat-lng="[photo.latitude, photo.longitude]"></v-marker>
      </v-map>
    </div>
  </div>
</template>

<script>
import imageTile from './Components/ImageTile.vue'
import navbar from './Components/Navbar.vue'
import searchbar from './Components/SearchBar.vue'
import auth from './auth'
import Vue from 'vue'
import {VueMasonryPlugin} from 'vue-masonry';
import Vue2Leaflet from 'vue2-leaflet';

Vue.use(VueMasonryPlugin)

export default {
  name: 'guide',
  components:{
      navbar,
      imageTile,
      searchbar,
      'v-map': Vue2Leaflet.Map,
      'v-tilelayer' :Vue2Leaflet.TileLayer,
      'v-marker': Vue2Leaflet.Marker
  },
  props: ['guideID', 'view'],
  data () {
    return {
      guide: {},
      photos: []
    }
  },

  mounted: function () {
      this.$http.get('http://127.0.0.1:5000/api/v1/guide?id=' + this.guideID, {
        headers: auth.getAuthHeader()
      }).then(response => {

          // get body data
          this.guide =  response.body;

      }, response => {
          // error callback
      });


      this.$http.get('http://127.0.0.1:5000/api/v1/photos/search?keywords=arifat', {
        headers: auth.getAuthHeader()
      }).then(response => {

          // get body data
          this.photos =  response.body.photos.photo;

      }, response => {
          // error callback
      });
  },

  methods: {
    removePhoto: function(id){
      this.$http.delete('http://127.0.0.1:5000/api/v1/photos/selected', {
        headers: auth.getAuthHeader(),
        body: {
          "guide": this.guideID,
          "image": {
            "origin": "flickr",
            "id": id.flickr_id
          }
        }
      }).then(response => {

          // get body data
          console.log(response.body)
          // this.photos =  response.body.photos.photo;

      }, response => {
          // error callback
      });
    },

    addImage:function(photo) {
      console.log(photo)
      this.$http.put('http://127.0.0.1:5000/api/v1/photos/selected', {
          "guide": this.guideID,
          "image": {
            "origin": "flickr",
            "id": photo.id
          }
        },{
        headers: auth.getAuthHeader()
      }).then(response => {

          // get body data
          console.log(response.body)
          // this.photos =  response.body.photos.photo;

      }, response => {
          // error callback
      });
    },

    searchImage:function(tags) {
      console.log(tags)
      this.$http.get('http://127.0.0.1:5000/api/v1/photos/search?keywords='+tags.replace(/ /g,"+"), {
        headers: auth.getAuthHeader()
      }).then(response => {

          // get body data
          this.photos =  response.body.photos.photo;
          console.log("redraw")
          var that=this
          setTimeout(function(){
          that.$redrawVueMasonry();
}, 2000);

      }, response => {
          // error callback
      });
    }
  }
}
</script>

<style lang="scss">
@import "styles/global.scss";
@import "../node_modules/leaflet/dist/leaflet.css";

#guide-page {
  .hero {
    background: url('assets/bg.jpg') no-repeat center center fixed;
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
      transform: rotate(3deg);
      background-color: #FCFCFC;
      width: 150%;
      height: 100px;
      position: absolute;
      left: -25%;
      bottom: -50px;
    }
  }
}

#app-nav {
  background-color: #FCFCFC;
  display: block;
  padding: 1em 2em;
  height: 3em;

  ul  {
    margin: 0;
    list-style: none;

    li {
      float: right;
      color: #333;
      line-height: 2em;
      font-size: 1.5em;
      margin-right: 1em
    }
  }
}
#map-view {
    width: 82%;
    margin: 2em auto;
    height: 40em;

    .leaflet-shadow-pane {
      display: none;
    }
}

#photo, #search-view {
  width: 82%;
  margin: 2em auto;
  .item {
      width: 33.3%;
      margin: 0;
      padding: 0.3em;
  }
}
</style>
