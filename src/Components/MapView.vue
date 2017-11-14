<template>
    <v-map :zoom=13 :center="[this.featuredPosition.latitude, this.featuredPosition.longitude]">
        <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
        <v-marker v-for="(photo, index) in photos" v-bind:key="index" v-if="photo.latitude!=0" :lat-lng="[photo.latitude, photo.longitude]"></v-marker>
    </v-map>
</template>

<script>
import Vue2Leaflet from 'vue2-leaflet';

export default {
    name: 'mapView',
    props: ['photos'],
    data (){
        return {
            featuredPosition: {
                latitude: "",
                longitude: ""
            }
        }
    },
    components: {
        'v-map': Vue2Leaflet.Map,
        'v-tilelayer' :Vue2Leaflet.TileLayer,
        'v-marker': Vue2Leaflet.Marker,
    },
    mounted: function() {
        this.setFeaturePosition()
    },
    methods: {
        setFeaturePosition: function(){
            // Check that there is any photo
            if(this.photos.length == 0)
                return

            // Check that there is some position available
            for(var i=0; i<this.photos.length; i++) {
                var photo = this.photos[i]
                if(photo.latitude != ""){
                    this.featuredPosition.latitude = photo.latitude
                    this.featuredPosition.longitude = photo.longitude
                    return
                }
            }
        }
    }
}
</script>

<style lang="scss">
.vue2leaflet-map{
    height: 700px;

    .leaflet-shadow-pane {
        display: none;
    }
}
</style>
