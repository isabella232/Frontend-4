<template>
<section id="guideInfo" v-if="guide!='new'">
    <div id="guideFullInfo">
        <section class="infoSection">
            <h3>Gear</h3>
            <lensViewer :photos="guide.photos"></lensViewer>
        </section>

        <section class="infoSection">
            <h3>Weather</h3>
        </section>

        <section class="infoSection">
            <h3>Sun</h3>
        </section>
    </div>
    <div id="guideShortInfo">
        <div class="smallMap" v-if="guide.photos.length > 0 && guide.photos.latitude !=0">
            <v-map :zoom=4 :options=mapOptions :center="[guide.photos[0].latitude, guide.photos[0].longitude]">
                <v-tilelayer url="http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg "></v-tilelayer>
                <v-marker :lat-lng="[guide.photos[0].latitude, guide.photos[0].longitude]"></v-marker>
            </v-map>
        </div>
        <ul>
            <li>
                <i class="fa fa-calendar-o" aria-hidden="true"></i>
                <strong>Created:</strong>
                {{formatDate(guide.creation)}}
            </li>
            <li>
                <i class="fa fa-calendar-o" aria-hidden="true"></i>
                <strong>Edited:</strong>
                {{formatDate(guide.last_edited)}}
            </li>
            <li>
                <i class="fa fa-users" aria-hidden="true"></i>
                <strong>Visibility:</strong>
                {{guide.visibility ? 'Public' : 'Private'}}
            </li>
            <li>
                <i class="fa fa-picture-o" aria-hidden="true"></i>
                <strong>Pictures:</strong>
                {{guide.photos.length}}
            </li>
        </ul>
        <div id="settings">
            <div class="button" v-on:click="deleteGuide">
                <i class="fa fa-trash-o" aria-hidden="true"></i>
                Remove
            </div>

            <div class="button" v-on:click="changeGuideVisibility">
                <i class="fa fa-users" aria-hidden="true"></i>
                Change to {{!guide.visibility ? 'Public' : 'Private'}}
            </div>
        </div>
    </div>
</section>
<section id="guideInfo" v-else>
    <h2>Let's create a new guide</h2>
</section>
</template>

<script>
import Vue2Leaflet from 'vue2-leaflet';
import moment from 'moment';
import api from '../api'
import lens from '../scripts/lens'
import SVG from 'svg.js'
import lensViewer from './LensViewer.vue'

export default {
    name: 'guideinfo',
    components: {
      'v-map': Vue2Leaflet.Map,
      'v-tilelayer' :Vue2Leaflet.TileLayer,
      'v-marker': Vue2Leaflet.Marker,
      lensViewer
    },
    props: ['guide'],
    data () {
        return {
            mapOptions: {
                attributionControl: false,
                zoomControl: false,
                dragging: false,
                doubleClickZoom: false,
                boxZoom: false,
                scrollWheelZoom: false
            },
            lensFocal: []
        }
    },

    // updated () {
    //     for(let i = 0; i<this.guide.photos.length; i++){
    //         let photo = this.guide.photos[i]
    //         if(photo.lensFocal)
    //             this.lensFocal.push(photo.lensFocal.split(" "))
    //     }

    //     this.lensFocal = lens.remapData(this.lensFocal)

    //         var primeLenses = [
    //     14,
    //     20,
    //     24,
    //     28,
    //     35,
    //     40,
    //     50,
    //     85,
    //     105,
    //     135,
    //     200,
    //     300,
    //     400
    // ]
    // var mappedPrime = lens.remapData(primeLenses)

    //     var draw = SVG('lensDensityPlot').size(1500, 300)
    //     var opacity = 0.1

    // for(let i = 0; i < this.lensFocal.length; i++) {
    //     var idat = this.lensFocal[i];
    //     console.log(idat)
    //     if(idat.length == 1){
    //         var box = draw.rect(10,50).move(idat[0]-5,0).attr('fill-opacity', opacity).bbox()
    //     }
    //     else {
    //         var box = draw.rect((idat[1] - idat[0])+10,50).move(idat[0]-5,0).attr('fill-opacity', opacity).bbox()
    //     }

    // }

    // for(let i = 0; i < mappedPrime.length; i++) {
    //     var idat = mappedPrime[i];
    //     var text = draw.text(String(primeLenses[i])).font('anchor', 'middle').move(idat,60)
    // }

    // },

    methods: {
        formatDate: function (date) {
            return moment(date).format("MMM Do YY");
        },

        deleteGuide: function() {
            api.DeleteGuide(this, function(){}, function(){}, {"id": this.guide.id})
        },

        changeGuideVisibility: function() {
            api.UpdateGuide(this, function(){}, function(){}, {
                "id": this.guide.id,
                "label": "visibility",
                "data": this.guide.visibility == 0 ? 1 : 0
            })
        }
    },
}
</script>

<style lang="scss">
@import "../../node_modules/leaflet/dist/leaflet.css";
@import "../styles/colors.scss";

#guideInfo {
    display: flex;
    flex-direction: row;

    color: $background-dark;

    #guideShortInfo {
        width: 20%;
        // border-right: 3px solid $border-light;
        padding-top: 2em;

        .smallMap {
            margin: 1em;
            height: 20em;
            border-radius: 0.5em;
            overflow: hidden;

            .leaflet-shadow-pane {
            display: none;
            }
        }

        ul {
            margin-top: 2em;
            list-style: none;
            font-size: 1.2em;

            li {
                margin: 0.5em 0;
                font-weight: lighter;

                i {
                    margin-right: 0.5em;
                }

                strong {
                    font-weight: normal;
                }
            }
        }

        #settings {
            width: 100%;
            text-align: center;

            .button {
                background-color: $box-light-2;
                width: 60%;
                margin: 1em auto;
                padding: 1em;

                &:hover {
                    background-color: $background-dark;
                    color: $box-light-2;
                }
            }
        }
    }

    #guideFullInfo {
        color: black;
        text-align: center;
        flex-grow: 1;
        margin-top: 2em;
        padding: 1em;
    }
}
</style>
