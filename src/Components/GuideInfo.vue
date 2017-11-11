<template>
<section id="guideInfo" v-if="guide!='new'">
    <div id="guideShortInfo">
        <div class="smallMap" v-if="guide.photos.length > 0 && guide.photos.latitude !=0">
            <v-map :zoom=5 :center="[guide.photos[0].latitude, guide.photos[0].longitude]">
                <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
                <v-marker :lat-lng="[guide.photos[0].latitude, guide.photos[0].longitude]"></v-marker>
            </v-map>
        </div>
        <ul>
            <li>{{guide.creation}}</li>
            <li>{{guide.photos.length}}</li>
        </ul>
    </div>
    <div id="guideFullInfo">
        <h2>{{guide.title}}</h2>
    </div>
</section>
<section id="guideInfo" v-else>
    <h2>Let's create a new guide</h2>
</section>
</template>

<script>
import Vue2Leaflet from 'vue2-leaflet';


export default {
    name: 'guideinfo',
    components: {
      'v-map': Vue2Leaflet.Map,
      'v-tilelayer' :Vue2Leaflet.TileLayer,
      'v-marker': Vue2Leaflet.Marker,
    },
    props: ['guide'],
    data () {
        return {
        }
    },
}
</script>

<style lang="scss">
@import "../../node_modules/leaflet/dist/leaflet.css";

#guideInfo {
    display: flex;
    flex-direction: row;

    color: black;

    #guideShortInfo {
        width: 20%;
        border-right: 1px solid black;
        padding-top: 2em;

        .smallMap {
            padding: 1em;
            height: 20em;

            .leaflet-shadow-pane {
            display: none;
            }
        }
    }

    #guideFullInfo {
        color: black;
        text-align: center;
        flex-grow: 1;
        padding: 1em;
    }
}
</style>
