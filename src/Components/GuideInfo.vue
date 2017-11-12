<template>
<section id="guideInfo" v-if="guide!='new'">
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
import moment from 'moment';
import api from '../api'

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
            mapOptions: {
                attributionControl: false,
                zoomControl: false,
                dragging: false,
                doubleClickZoom: false,
                boxZoom: false,
                scrollWheelZoom: false
            }
        }
    },

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
        border-right: 3px solid $border-light;
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
        padding: 1em;
    }
}
</style>
