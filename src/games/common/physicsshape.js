import BasePhysicsItem from "@/games/common/basephysicsitem"
import { Circle, Rectangle } from "pixi.js"
import Matter from 'matter-js'

export default class PhysicsShape extends BasePhysicsItem {
   lineColor = null 
   fillColor = null
   shape = "box"
   isStatic = false
   outlined = true

   static createCircle(x,y, radius, lineColor, fillColor, isStatic=false) {
      let params = {type: "circle", radius: radius, lineColor: lineColor, fillColor: fillColor, isStatic: isStatic }
      return new PhysicsShape(x,y, params)
   }

   static createBox(x,y, w,h, lineColor, fillColor, isStatic = false) {
      let params = {type: "box", w: w, h: h, lineColor: lineColor, fillColor: fillColor, isStatic: isStatic }
      return new PhysicsShape(x,y, params)    
   }

   static createTriangle(x,y, w,h, lineColor, fillColor, isStatic = false) {
      let params = {type: "triangle", w: w, h: h, lineColor: lineColor, fillColor: fillColor, isStatic: isStatic }
      return new PhysicsShape(x,y, params)    
   }

   constructor( x,y, params = {type: "box", w: 40, h:40, lineColor: 0xffffff, fillColor: 0x666666}) {
      super(x,y)
     
      this.shape = params.type
      this.isStatic = false
      if ( params.isStatic ) {
         this.isStatic = params.isStatic 
      }
      if ( this.shape != "circle" && this.shape != "box" && this.shape != "triangle") {
         this.shape = "box"
      }

      this.lineColor = params.lineColor
      this.fillColor = params.fillColor

      if (params.type == "circle") {
         this.w = params.radius*2
         this.h = params.radius*2
         this.radius = params.radius
         this.pivot.set(0,0)
         this.body = Matter.Bodies.circle(x, y, params.radius, {isStatic: this.isStatic})
         this.hitArea = new Circle(0,0, params.radius)
      } else if ( params.type == "triangle") {
         this.w = params.w 
         this.h = params.h
         let v = Matter.Vertices.fromPath(`0,0, ${this.w},0, 0,${this.h}`)
         let c = Matter.Vertices.centre(v) 
         this.pivot.set(c.x, c.y)  
         this.body = Matter.Bodies.fromVertices(x, y, v, {isStatic: this.isStatic})
         Matter.Body.setCentre(this.body, {x:0,y:0}, true)
      } else {
         this.w = params.w 
         this.h = params.h
         this.pivot.set(this.w/2, this.h/2)   
         this.body = Matter.Bodies.rectangle(x, y, this.w, this.h, { isStatic: this.isStatic})
         this.hitArea = new Rectangle(0,0, this.w, this.h)
      }

      this.update()
      this.draw() 
   }

   setOutlined(flag) {
      this.outlined = flag
      this.draw()
   }

   setLabel( val ) {
      let label = new PIXI.Text(val, {fontSize: 12, fill: 0x550000, fontWeight: "bold"})
      label.anchor.set(0.5,0.5)
      this.addChild(label)
   }

   draw() {
      this.gfx.clear() 
      let line = 1 
      if ( this.outlined == false) {
         line = 0
      }
      
      if (this.shape == "circle") {
         this.gfx.circle(0,0,this.radius).fill(this.fillColor).stroke({width:line, color: this.lineColor})
      } else if ( this.shape == "triangle") {
         const pts = [ {x: 0, y: 0 }, {x: this.w, y: 0}, {x: 0, y: this.h} ]
         this.gfx.poly(pts).fill(this.fillColor).stroke({width:line, color: this.fillColor})
      } else {
         this.gfx.rect(0,0,this.w, this.h).fill(this.fillColor).stroke({width:line, color: this.fillColor})
      }
   }
}