
import Letter from "@/games/common/letter"

export default class LetterPool {
   constructor ()   {
      this.pool = []
   }

   hasTilesLeft() {
      return this.pool.length > 0
   }

   pop() {
      return this.pool.pop()
   }

   popScoringLetter() {
      let txt = this.pop() 
      return new Letter(txt, this.value(txt))
   }

   value( letter ) {
      let values = [
         ["A", "E", "I", "N", "O", "R", "S", "T", "U"],  // 1 pt
         ["G", "H", "L", "M", "P", "Y"],                 // 2 pt
         ["B", "C", "D", "F", "K"],                      // 3 pt
         ["J", "V", "W"],                                // 4 pt
         ["Q", "X", "Z"],                                // 5 pt
      ]
      let value = 0
      values.forEach( (letters,idx) => {
         if ( letters.includes(letter)) {
            value = idx+1
         }
      })
      return value
   }

   refill() {
      // fill pool with letters based on distribution rules...
      this.pool = []
      var i,j
      // var dist = {
      //    2: "J,K,Q,X,Z", 3: "B,C,F,H,M,P,V,W,Y",
      //    4: "G", 5: "L", 6: "D,S,U", 8: "N",
      //    9: "T,R", 11: "O,I", 13: "A", 18: "E"}
      var dist = {
         1: "Z,X,W,V,Q,K,J", 2: "G,F,C,B", 3:"Y,U,M,H",
         4: "P,D,L", 7:"T,S,R,O,N", 8: "I,A,E"}
      for ( var key in dist) {
         var letters = dist[key].split(",")
         var cnt = parseInt(key, 10)
         for (i=0; i<letters.length; i++ ) {
            for (j=0; j<cnt; j++) {
               this.pool.push( letters[i])
            }
         }
      }

      // now shuffle the pool...
      for (i = this.pool.length; i; i -= 1) {
         j = Math.floor(Math.random() * i)
         var x = this.pool[i - 1]
         this.pool[i - 1] = this.pool[j]
         this.pool[j] = x
      }
   }
}
