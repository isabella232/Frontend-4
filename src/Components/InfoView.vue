<template>
<div>
  <!-- <div class="sectionTitle">
      <h2>Guide</h2>
      <span>Make this guide yours</span>
  </div>
  <div class="sectionTitle">
      <h2>Information</h2>
      <span>Know where you are going</span>
  </div>
  <div class="sectionTitle">
      <h2>Gear</h2>
      <span>Pack the right equipement</span>
  </div> -->
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

export default {
    name:'infoView',
    props: ['guide'],
    data () {
        return {
            reports: [],
            selectedBar: {
                object: {},
                color: {},
                id: -1
            },
            currentCloud:false,
            draw: {}
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

</style>
