import BasePhysicsItem from "@/games/common/basephysicsitem"
import * as PIXI from "pixi.js"
import Matter from 'matter-js'

export default class Rock extends BasePhysicsItem {
   letter = null 
   extra = null
   selected = false 
   pushTarget = false
   letters = []
   static WIDTH = 55
   static HEIGHT = 55
   static FRICTION = 0.05

   constructor( x,y, letter, listener) {
      super(x,y)

      this.letter = letter
      
      this.letterColor = "#efefef"
      this.lineColor = new PIXI.Color( 0x582F0E )
      if ( letter.isVowel()) {
         this.fillColor = new PIXI.Color( 0x6F3F14 )
      } else  {
         this.fillColor = new PIXI.Color( 0x7F4F24 )
      }
      this.selectColor = new PIXI.Color( 0xffd046 )
      this.selLetterColor = new PIXI.Color(0x414833)

      let style = new PIXI.TextStyle({
         fill: this.letterColor,
         fontFamily: "Arial",
         fontSize: 18,
      })
      let smallStyle = new PIXI.TextStyle({
         fill: this.letterColor,
         fontFamily: "Arial",
         fontSize: 15,
      })

      let txt = new PIXI.Text(letter.text, style)
      txt.anchor.set(0.5)
      txt.x = 0
      txt.y = 0
      this.addChild(txt)
      this.letters.push( txt )
      if (letter.text == "Q") {
         let uTxt = new PIXI.Text("U", smallStyle)
         uTxt.anchor.set(0.5)
         uTxt.x = 8
         uTxt.y = 4    
         txt.x-= 4
         this.addChild(uTxt)
         this.letters.push( uTxt )
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

      let c = Matter.Vertices.centre(polyPts) 
      this.pivot.set(c.x, c.y)  
      this.body = Matter.Bodies.fromVertices(x, y, polyPts, {isStatic: this.isStatic})
      this.body.label = "rock-"+letter.text
      this.setAirFriction( 0.02)
      this.setFriction(Rock.FRICTION)
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

   pushLeft() {
      this.setFriction(0)
      this.applyForce(-0.05,0)
      setTimeout( ()=>{
         this.setFriction(Rock.FRICTION)
      }, 100)
   }
   pushRight() {
      this.setFriction(0)
      this.applyForce(0.05,0)
      setTimeout( ()=>{
         this.setFriction(Rock.FRICTION)
      }, 100)
   }

   toggleSelected(  ) {
      this.selected = !this.selected
      if ( this.selected ) {
         this.letters.forEach( l => l.style.fill = this.selLetterColor )
      } else {
         this.letters.forEach( l => l.style.fill = this.letterColor )  
      }
      this.draw()
   }

   deselect() {
      this.pushTarget = false 
      this.selected = false   
      this.letters.forEach( l => l.style.fill = this.letterColor ) 
      this.draw()
   }

   setPushTarget(flag) {
      this.pushTarget = flag
      this.draw()
   }

   remove() {
      this.body.isSensor = true
      this.gfx.alpha = 0
   }

   draw() {
      super.draw() 
      this.gfx.clear()
      this.gfx.lineStyle(1, this.lineColor, 1)
      if ( this.pushTarget ) {
         this.gfx.lineStyle(5, this.selectColor, 1)      
      }
      this.gfx.beginFill(this.fillColor)
      if ( this.selected ) {
         this.gfx.beginFill(this.selectColor)
      }
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