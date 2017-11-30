<template>
<div>
  <!-- <div class="sectionTitle">
      <h2>Guide</h2>
      <span>Make this guide yours</span>
  </div>
  <div class="sectionTitle">
      <h2>Information</h2>
      <span>Know where you are going</span>
  </div>-->
  <div class="sectionTitle">
      <h2>Gear</h2>
      <span>Pack the right equipement</span>
  </div>
  <section id="gear">
      <div id="useraccessories">
          <div id="flash" class="accessory active">
              <div class="tag"><i class="fa fa-bolt" aria-hidden="true"></i></div>
                <p>You might need a flash. <strong>25%</strong> of the photos in your guide are taken using a flash</p>
          </div>

          <div id="tripod" class="accessory">
              <div class="tag"><i class="fa fa-spoon" aria-hidden="true"></i></div>
                <p>You might not need to take your tripod. Selected photos are taken at <strong>high speed</strong> and <strong>the sky looks clear</strong></p>
          </div>
      </div>
    <lensViewer :photos="photos" :selected="selectedFocal"></lensViewer>
    <div id="userGear">
        <ul v-if="userGear.length > 0">
            <li v-for="gear in selectedGear" :class="{active:gear.active}">{{gear.display_name}}</li>
        </ul>
        <p v-else>Add your lenses to your account to get cusom gear advises</p>
    </div>
  </section>
  <div class="sectionTitle">
      <h2>Weather</h2>
      <span>The sky at a glance</span>
  </div>

    <weatherFull :guide="guide"></weatherFull>

</div>
</template>

<script>
import SVG from 'svg.js'
import api from '../api'
import moment from 'moment'
import lensViewer from './LensViewer.vue'
import weatherFull from './WeatherFull.vue'

export default {
    name:'infoView',
    props: ['guide', 'photos'],
    components: {
      lensViewer,
      weatherFull
    },
    data () {
        return {
            selectedFocal: [
                // "24 35"
            ],
            userGear: [],
            recommendedRange: [24,85]
        }
    },
    computed: {
        selectedGear: function(){
            var selectedGear = this.userGear

            for(var i=0; i < this.userGear.length; i++) {
                var range = selectedGear[i].focal_range.split(" ")
                console.log(range)
                if(range[0]>=this.recommendedRange[0] && range[0]<=this.recommendedRange[1]){
                    selectedGear[i].active = true
                    this.selectedFocal.push(selectedGear[i].focal_range)
                }
                else
                    selectedGear[i].active = false
            }

            return selectedGear
        }
    },
    mounted: function() {
        // Get the report

        api.GetUserGear(
            this,
            data=>{
                this.userGear = data.body
            },
            function(){}
        )
    }
}
</script>

<style lang="scss">
@import "../styles/colors.scss";

.sectionTitle {
    display: flex;
    flex-direction: row;
    align-items: center;

    h2 {
        color: $background-dark;
        font-weight: bold;
        margin: 0;
        padding: 0.5em 0.5em 0.5em 0;
        margin-right: 0.5em;
        font-size: 2em;
        border-right: 1px solid $background-dark;
    }
    span {
        color: $primary-color-1;
        font-weight: light;
        font-size: 1.2em;
    }
}

#info {
    width: 50%;
    margin: 2em auto;

    display: flex;
    align-items: center;
    color: black;

    ul {
        list-style: none;
        font-size: 1.3em;

        li strong {
            color: $primary-color-1;
        }
    }
}

#gear{
    #userGear{
        >p{
            color: black;
            text-align: center;
            font-size: 1.2em;
            margin: 2em 0;
        }
    }
    ul{
        list-style: none;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        width: 50%;
        margin: auto;

        li{
            width: 10em;
            height: 10em;
            border-radius: 5em;
            line-height: 10em;
            text-align: center;
            background-color: #aaa;
            font-weight: bold;
            margin: 2em;

            &.active{
                background-color: $primary-color-1;
            }
        }
    }
}

#useraccessories{
    display: flex;
    align-items: center;
    justify-content: center;

    .accessory{
        display: flex;
        align-items: center;
        margin: 1em;

        &.active .tag{
            background-color: $primary-color-1;

        }
        .tag{
            font-size: 1em;
            width: 6rem;
            height: 6rem;
            border-radius: 3em;
            background-color: #aaa;
            color: white;
            text-align: center;

            i{
                line-height: 1.5em;
                font-size: 4em;
            }
        }

        p{
            color: black;
            border-left: 1px solid black;
            width: 20em;
            padding: 1em;
            margin-left: 1em;

            strong{
                color: $primary-color-1;
            }
        }
    }
}

</style>
