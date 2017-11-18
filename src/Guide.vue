<template>
  <div id="guide-page">
      <navbar></navbar>

    <heroMap :title="guide.title" :guide="guide"></heroMap>

    <nav id="app-nav">
      <ul>
        <li><router-link to="info">Info</router-link></li>
        <li><router-link to="view">View</router-link></li>
        <li><router-link to="search" v-if="authenticated">Search</router-link></li>
        <li><router-link to="map" v-if="hasMapData">Map</router-link></li>
      </ul>
    </nav>
    <div v-if="view=='view'" id="photo" class="flexbin">
      <image-tile v-for="(image, index) in guide.photos" v-bind:key="index" v-bind:image.sync="image" v-bind:selection="true" v-on:removed="removePhoto(image)" view="true"></image-tile>
    </div>

    <photoSearch v-if="view=='search'" :guideID="guide.id" v-on:added="addPhoto" :IDList="photoIDList"></photoSearch>

    <div v-if="view=='map' && hasMapData" id="map-view" >
      <mapView :photos="guide.photos"></mapView>
    </div>


    <div v-if="view=='info'" id="info-view">
      <infoView :guide="guide"></infoView>
    </div>
  </div>
</template>

<script>
import api from './api'
import imageTile from './Components/ImageTile.vue'
import navbar from './Components/Navbar.vue'
import searchbar from './Components/SearchBar.vue'
import auth from './auth'
import Vue from 'vue'
import Vue2Leaflet from 'vue2-leaflet';
import heroMap from './Components/HeroMap.vue'
import photoSearch from './Components/PhotoSearch.vue'
import mapView from './Components/MapView.vue'
import infoView from './Components/InfoView.vue'

export default {
  name: 'guide',
  components:{
      navbar,
      imageTile,
      searchbar,
      'v-map': Vue2Leaflet.Map,
      'v-tilelayer' :Vue2Leaflet.TileLayer,
      'v-marker': Vue2Leaflet.Marker,
      heroMap,
      photoSearch,
      mapView,
      infoView
  },
  props: ['guideID', 'view'],
  data () {
    return {
      guide: {},
      photos: [],
      authenticated: auth.user.authenticated
    }
  },

  mounted: function () {
    api.GetGuidePhoto(this, data => {this.guide = data.body}, function(){}, {id: this.guideID})
  },

  computed: {
    hasMapData: function(){
      // Check that there is any photo
      if(this.guide.photos.length == 0)
          return false

      // Check that there is some position available
      for(var i=0; i<this.guide.photos.length; i++) {
          var photo = this.guide.photos[i]
          if(photo.latitude != ""){
              return true
          }
      }
      return false
    },
    photoIDList: function(){
      var IDList = []

      for(var i=0; i<this.guide.photos.length; i++){
        IDList.push(this.guide.photos[i].flickr_id)
      }

      return IDList
    }
  },

  methods: {
    removePhoto: function(image){
      api.RemovePhoto(this, function(){}, function(){}, {
        "guide": this.guideID,
        "image": {
          "origin": "flickr",
          "id": image.flickr_id
        }
      })

      this.guide.photos.splice(this.guide.photos.indexOf(image), 1)
    },
    addPhoto: function(photo) {
      this.guide.photos.push(photo)
    }
  }
}
</script>


<style lang="scss">
@import "styles/global.scss";
@import "../node_modules/leaflet/dist/leaflet.css";

@import "styles/flexbin.scss";

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
}

#photo, #search-view, #info-view {
  width: 82%;
  margin: 2em auto;
}
</style>
