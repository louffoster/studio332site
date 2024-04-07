import ToggleButton from "@/games/wordmine/togglebutton"

export default class RotateButton extends ToggleButton {
   angleIdx = 0
   angles = [0, 90, 270]

   setListener( listener ) {
      this.on('pointerdown', () => {
         if (this.enabled == true)
            if ( this.selected == false) {
               this.selected = !this.selected 
               this.draw()   
               listener(this.name)
            } else {
               if (this.angleIdx < this.angles.length-1) {
                  this.angleIdx++
               } else {
                  this.angleIdx = 0
               }
               this.btnImage.angle = this.angles[this.angleIdx]
            }
      })
   }

   get angle() {
      return this.angles[this.angleIdx]
   }
}