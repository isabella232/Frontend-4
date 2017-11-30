<template>
    <div id="places-view">
        <div v-for="place in places" class="place">
            <div class="image" v-bind:style='{backgroundImage: "url(" + place.image + ")"}'></div>
            <span class="name">{{place.name}}</span>
        </div>
    </div>
</template>

<script>
import api from '../api'
export default {
    name: 'placesNear',
    props: [
        "guide"
    ],
    data () {
        return {
            places: []
        }
    },
    mounted() {
        api.GuideNear(
            this,
            data=>{
                this.places = data.body
            },
            error => {
                console.log(error)
            },
            {id: this.guide.id}
        )
    },
}
</script>

<style lang="scss">
@import "../styles/colors.scss";
#places-view{
    color: #333;
    display: flex;
    margin-bottom: 5em;
    flex-wrap: wrap;
    justify-content: center;

    .place{
        width: 12em;
        height: 12em;
        margin: 1em;
        margin-bottom: 6em;
    }
    .image{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-position: center center;
        background-size: cover;
        border: 3px solid $primary-color-1;
        margin-bottom: 0.5em;
    }
    .name {
        display: block;
        text-align: center;
        width: 100%;
        font-size: 1.2em;
    }
}
</style>
