import BaseGame from "@/games/common/basegame"
import Matter from 'matter-js'

export default class BasePhysicsGame extends BaseGame {
   physics = null 
   items = [] 

   constructor(gameW, gameH, backgroundColor) {
      super(gameW, gameH, backgroundColor)
      this.physics = Matter.Engine.create()
   }

   addPhysicsItem( item ) {
      this.addChild(item)
      Matter.Composite.add(this.physics.world, item.body)
      this.items.push( item )
   }

   removePhysicsItem( item ) {
      console.log("remove item")
      console.log(item)
      Matter.Composite.remove(this.physics.world, item.body)
      this.removeChild(item)
      let idx = this.items.findIndex( s => s == item )
      this.items.splice(idx,1)
   }

   update() {
      Matter.Engine.update(this.physics, 1000 / 60) // 60 fps
      this.items.forEach( physicsItem => {
         physicsItem.update() 
      })
   }
}