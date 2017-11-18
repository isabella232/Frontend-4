<template>
<div id="search-view" >
    <searchbar v-bind:button="true" v-on:search="searchImage"></searchbar>
    <div id="search-results" class="flexbin">
        <image-tile v-for="(photo, index) in photos" v-bind:key="index" v-bind:image.sync="photo" v-bind:selection="alreadyIn(photo)" v-on:selected="addImage(photo)"></image-tile>
    </div>
</div>
</template>

<script>
import imageTile from './ImageTile.vue'
import searchbar from './SearchBar.vue'
import Vue from 'vue'
import api from '../api'

export default {
    name: 'searchPhoto',
    components: {
        imageTile,
        searchbar
    },
    props: [
        "guideID",
        "IDList"
    ],
    data () {
        return {
            photos: []
        }
    },
    methods: {
        searchImage: function (tags) {
            this.photos = []
            api.SearchPhoto(this, data => {
                // get body data
                this.photos =  data.body.photos.photo
            }, function(){}, {keywords: tags.split(" ")})
        },

        addImage:function(photo) {
            api.AddPhoto(
                this,
                data => {
                    // Send the image to the parent for a smoother experience
                    this.$emit("added", data.body)
                }
                , function(){}, {
                    "guide": this.guideID,
                    "image": {
                        "origin": "flickr",
                        "id": photo.id
                    }
                }
            )
        },

        alreadyIn:function(image) {
            if(this.IDList.indexOf(image.id) != -1)
                return true
            else
                return false
        }
    }

}
</script>

<style lang="scss">
@import "../styles/flexbin.scss";
</style>

