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
  <section id="weather">
      <div class="slider">
          <span>Temperature</span>
          <div class="selector" :class="{right:currentCloud}" v-on:click="currentCloud=!currentCloud"></div>
          <span>Cloudiness</span>
      </div>
      <div id="weathergraph"></div>
      <div v-if="selectedBar.id > -1" id="info">
          <div id="date">
            <span>{{formatDate(reports[selectedBar.id].dt_txt)}}</span>
            <span class="time">{{formatTime(reports[selectedBar.id].dt_txt)}}</span>
          </div>
          <i id="picto" class="owf owf-4x" :class="getClass(reports[selectedBar.id])"></i>
        <ul>
            <li><strong>{{reports[selectedBar.id].main.temp}}</strong>°C</li>
            <li>{{reports[selectedBar.id].weather[0].description}}</li>
            <li><strong>{{reports[selectedBar.id].wind.speed}}</strong>m/s {{toCardinalDirection(reports[selectedBar.id].wind.deg)}}</li>
            <li><strong>{{reports[selectedBar.id].clouds.all}}</strong>% cloudiness</li>
        </ul>
      </div>
  </section>
</div>
</template>

<script>
import SVG from 'svg.js'
import api from '../api'
import moment from 'moment'
import lensViewer from './LensViewer.vue'

export default {
    name:'infoView',
    props: ['guide', 'photos'],
    components: {
      lensViewer,
    },
    data () {
        return {
            reports: [],
            selectedBar: {
                object: {},
                color: {},
                id: -1
            },
            currentCloud:false,
            draw: {},
            selectedFocal: [
                // "24 35"
            ],
            userGear: [],
            recommendedRange: [24,85]
        }
    },
    computed: {
        getCloudCoverage: function() {
            var clouds = []

            for(var i=0; i<this.reports.length; i++) {
                clouds.push(this.reports[i].clouds.all)
            }

            return clouds
        },

        getTemperature: function() {
            var temps = {
                max: 30,
                min: -5,
                list: []
            }

            for(var i=0; i<this.reports.length; i++) {
                var temp = this.reports[i].main.temp
                temps.list.push(temp)
                if(temp > temps.max)
                    temps.max = temp
                if(temp < temps.min)
                    temps.min = temp
            }

            return temps
        },
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
        api.GetGuideWeather(
            this,
            data=>{
                this.reports = data.body.list
                this.drawWeather()
            },
            error => {
                console.log(error)
            },
            {id: this.guide.id}
        )

        api.GetUserGear(
            this,
            data=>{
                this.userGear = data.body
            },
            function(){}
        )
    },

    watch: {
        currentCloud: function(){
            this.draw.clear()

            if(this.currentCloud)
                this.drawCloud()
            else
                this.drawTemp()
        }
    },

    methods: {
        drawTemp: function(){
            var tempData = this.getTemperature
            var unit = 150/(tempData.max-tempData.min)
            var day = ""

            for(let i=0; i<tempData.list.length; i++) {
                let fillColor = this.reports[i].sys.pod == "d" ? "#ccc" : "#333"

                let w = 20
                let h = Math.abs(tempData.list[i])*unit
                let x = i*25
                let y = (Math.abs(tempData.max)*unit)-(tempData.list[i]>0?tempData.list[i]*unit:0)

                let bar = this.draw.rect(w, h).move(x, y).attr('fill', fillColor)

                var newDay = moment(this.reports[i].dt_txt).format("DD[/]MM[/]YY")
                if(day == "" || newDay != day) {
                    day = newDay

                    var text = this.draw.text(day).font({anchor:'right', family:'Raleway', size: 10}).move(x, 150)
                }

                bar.mouseover(()=>{
                    if(this.selectedBar.id > -1) {
                        this.selectedBar.object.fill({color: this.selectedBar.color})
                    }
                    bar.fill({color: "#F39C12"})
                    this.selectedBar.object = bar
                    this.selectedBar.color = fillColor
                    this.selectedBar.id = i
                })
            }

        },
        drawCloud: function(){
            var cloudData = this.getCloudCoverage
            var day = ""

            for(let i=0; i<cloudData.length; i++) {
                let fillColor = this.reports[i].sys.pod == "d" ? "#ccc" : "#333"

                let w = 20
                let h = cloudData[i]*1.5
                let x = i*25
                let y = 150-cloudData[i]*1.5

                let bar = this.draw.rect(w, h).move(x, y).attr('fill', fillColor)

                var newDay = moment(this.reports[i].dt_txt).format("DD[/]MM[/]YY")
                if(day == "" || newDay != day) {
                    day = newDay

                    var text = this.draw.text(day).font({anchor:'right', family:'Raleway', size: 10}).move(x, 150)
                }

                bar.mouseover(()=>{
                    if(this.selectedBar.id > -1) {
                        this.selectedBar.object.fill({color: this.selectedBar.color})
                    }
                    bar.fill({color: "#F39C12"})
                    this.selectedBar.object = bar
                    this.selectedBar.color = fillColor
                    this.selectedBar.id = i
                })
            }

        },
        toCardinalDirection: function(deg){
            var directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
            return directions[ Math.round((deg % 360) / 45) % 8 ]
        },
        getClass: function(report){
            return "owf-" + report.weather[0].id + "-" + report.sys.pod
        },
        formatDate: function (date) {
            return moment(date).format("Do MMMM YY");
        },
        formatTime: function (date) {
            return moment(date).format("HH[h]mm");
        },
        drawWeather: function (){
            this.draw = SVG('weathergraph')
            this.draw.viewbox(0,0,1000,170)

            if(this.currentCloud)
                this.drawCloud()
            else
                this.drawTemp()

        }
    }
}
</script>

<style lang="scss">
@import "../styles/colors.scss";
@import "../styles/owfont-regular.min.css";

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

#date {
    display: flex;
    flex-direction: column;
    font-size: 2em;
    margin-right: 3em;

    .time {
        font-size: 2.2em;
    }
}

#picto {
    font-size: 11em;
}

.slider {
    margin-top: 1em;
    color: black;
    display: flex;

    .selector {
        margin: 0 1em;
        width: 3em;
        height: 1.5em;
        background-color: $box-light-2;
        border: 1px solid #999;
        border-radius: 0.5em;
        position: relative;
        cursor: pointer;

        &:after{
            position: absolute;
            content: ' ';
            background-color: $primary-color-1;
            width: 1.5em;
            height: 1.5em;
            border-radius: 0.5em;
            top: 0;
            margin: -1px;
        }

        &.right {

            &:after {
                right: 0;
            }
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
