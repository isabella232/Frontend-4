<template>
    <div id="lensDensityPlot"></div>
</template>

<script>
import lens from '../scripts/lens'
import SVG from 'svg.js'

export default {
    name: 'lensViewer',
    props: [
        'photos'
    ],
    data () {
        return {
            primeLenses: [
                14,
                20,
                24,
                28,
                35,
                40,
                50,
                85,
                105,
                135,
                200,
                300,
                400
            ],
            mappedPrime: [],
            lensFocal: [],
            draw: {}
        }
    },
    methods: {
        computeLens: function(){
            // Clear any existing
            this.lensFocal = []

            // Find all the lens focals
            for(let i = 0; i<this.photos.length; i++){
                let photo = this.photos[i]
                if(photo.lensFocal)
                    this.lensFocal.push(photo.lensFocal.split(" "))
            }

            // Remap all the focal length to the exponential counterparts
            this.lensFocal = lens.remapData(this.lensFocal)
        },

        renderView: function(){
            // Clear the svg space
            this.draw.clear()

            // Draw the view
            var opacity = 0.1

            for(let i = 0; i < this.lensFocal.length; i++) {
                var idat = this.lensFocal[i];
                console.log(idat)
                if(idat.length == 1){
                    var box = this.draw.rect(10,50).move(idat[0]-5,0).attr('fill-opacity', opacity).bbox()
                }
                else {
                    var box = this.draw.rect((idat[1] - idat[0])+10,50).move(idat[0]-5,0).attr('fill-opacity', opacity).bbox()
                }

            }

            for(let i = 0; i < this.mappedPrime.length; i++) {
                var idat = this.mappedPrime[i];
                var text = this.draw.text(String(this.primeLenses[i])).font('anchor', 'middle').move(idat,60)
            }
        }
    },
    mounted () {
        this.draw = SVG('lensDensityPlot')
        this.mappedPrime = lens.remapData(this.primeLenses)

        // Compute & render
        this.computeLens()
        this.renderView()
    },
    watch: {
        photos(){
            // Compute & render
            this.computeLens()
            this.renderView()
        }
    }
}
</script>

<<style lang="scss">

</style>
