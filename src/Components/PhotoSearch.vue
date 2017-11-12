<template>
<div id="search-view" >
    <searchbar  v-bind:button="true" v-on:search="searchImage"></searchbar>
    <div id="search-results"v-masonry transition-duration="0.3s" item-selector=".item">
        <image-tile  v-masonry-tile v-for="(photo, index) in photos" v-bind:key="index" v-bind:image.sync="photo" v-bind:selection="true" v-on:selected="addImage(photo)"></image-tile>
    </div>
</div>
</template>

<script>
import imageTile from './ImageTile.vue'
import searchbar from './SearchBar.vue'
import Vue from 'vue'
import api from '../api'
import {VueMasonryPlugin} from 'vue-masonry';

Vue.use(VueMasonryPlugin)

export default {
    name: 'searchPhoto',
    components: {
        imageTile,
        searchbar
    },
    props: [
        "guideID"
    ],
    data () {
        return {
            photos: []
        }
    },
    methods: {
        searchImage: function (tags) {
            this.photos = []
            this.$redrawVueMasonry()
            api.SearchPhoto(this, data => {
                // get body data
                this.photos =  data.body.photos.photo
                var that=this
                setTimeout(function(){
                    that.$redrawVueMasonry()
                }, 2000)
            }, function(){}, {keywords: tags.split(" ")})
        },

        addImage:function(photo) {
            api.AddPhoto(this, function(){}, function(){}, {
                "guide": this.guideID,
                "image": {
                "origin": "flickr",
                "id": photo.id
                }
            })
        },
    }

}
</script>

<style lang="scss">

</style>

