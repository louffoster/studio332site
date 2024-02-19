import BasePhysicsItem from "@/games/common/basephysicsitem"
import * as PIXI from "pixi.js"
import Matter from 'matter-js'

export default class Rock extends BasePhysicsItem {
   letter = null 
   extra = null
   static WIDTH = 55
   static HEIGHT = 55

   constructor( x,y, letter, listener) {
      super(x,y)
      console.log(letter)

      this.letter = letter
      
      let letterColor = "#efefef"
      this.lineColor = new PIXI.Color( 0x582F0E )
      if ( letter.isVowel()) {
         this.fillColor = new PIXI.Color( 0x6F3F14 )
      } else  {
         this.fillColor = new PIXI.Color( 0x7F4F24 )
      }

      let style = new PIXI.TextStyle({
         fill: letterColor,
         fontFamily: "Arial",
         fontSize: 18,
      })
      let smallStyle = new PIXI.TextStyle({
         fill: letterColor,
         fontFamily: "Arial",
         fontSize: 15,
      })

      let txt = new PIXI.Text(letter.text, style)
      txt.anchor.set(0.5)
      txt.x = 0
      txt.y = 0
      this.addChild(txt)
      if (letter.text == "Q") {
         let uTxt = new PIXI.Text("U", smallStyle)
         uTxt.anchor.set(0.5)
         uTxt.x = 8
         uTxt.y = 4    
         txt.x-= 4
         this.addChild(uTxt)
      }

      let polyPts = [ 
         {x: -Rock.WIDTH/2, y: -Rock.HEIGHT/4}, 
         {x: -Rock.WIDTH/4, y: -Rock.HEIGHT/2},
         {x: +Rock.WIDTH/4, y: -Rock.HEIGHT/2},
         {x: +Rock.WIDTH/2, y: -Rock.HEIGHT/4},
         {x: +Rock.WIDTH/2, y: +Rock.HEIGHT/4}, 
         {x: +Rock.WIDTH/4, y: +Rock.HEIGHT/2},
         {x: -Rock.WIDTH/4, y: +Rock.HEIGHT/2},
         {x: -Rock.WIDTH/2, y: +Rock.HEIGHT/4},
      ]

      // let v = Matter.Vertices.fromPath(`0,0, ${this.w},0, 0,${this.h}`)
      let c = Matter.Vertices.centre(polyPts) 
      this.pivot.set(c.x, c.y)  
      this.body = Matter.Bodies.fromVertices(x, y, polyPts, {isStatic: this.isStatic})
      // Matter.Body.setCentre(this.body, {x:0,y:0}, true)
      this.body.label = "rock-"+letter.text
      this.setAirFriction(0.02)
      this.setRestitution( 0 )

      this.polygon = new PIXI.Polygon(polyPts)


      this.update()
      this.draw()

      this.hitArea = this.polygon
      this.cursor ="pointer"
      this.eventMode = 'static'
      this.on('pointerdown', ()=> {
         listener(this)
      })
   }

   remove() {
      this.body.isSensor = true
      this.gfx.alpha = 0
   }

   draw() {
      super.draw() 
      this.gfx.clear()
      this.gfx.lineStyle(1, this.lineColor, 1)
      this.gfx.beginFill(this.fillColor)
      this.gfx.drawPolygon( this.polygon )
      this.gfx.endFill()
   }

   get text() {
      let out = this.letter.text 
      if ( out == "Q") {
         out += "U"
      }
      return out
   }

   get value() {
      return this.letter.value
   }
}