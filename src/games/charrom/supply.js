
import Letter from "@/games/common/letter"

export default class Supply {
   consonants = []
   static NUM_VOWELS = 2
   static NUM_CONSONANTS = 5

   get rackSize() {
      return Supply.NUM_VOWELS + Supply.NUM_CONSONANTS
   }

   getRack() {
      let out = [] 
      let vowels = this.shuffle( ["A", "E", "I", "O", "U"] )
      for ( let v = 0; v< Supply.NUM_VOWELS; v++)  {
         let newV = vowels.pop()
         out.push( new Letter(newV, this.value(newV)))
      }

      if ( this.consonants.length < Supply.NUM_CONSONANTS) {
         this.refill()
      }

      for ( let c = 0; c < Supply.NUM_CONSONANTS; c++) {
         let txt = this.consonants.pop()
         out.push( new Letter(txt, this.value(txt)))
      }
      return out
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
      this.consonants = []
      var i,j
      var dist = {
         1: "Z,X,W,V,Q,K,J", 2: "G,F,C,B,Y", 3:"M,H",
         4: "P,D,L", 7:"T,S,R,N"}
      for ( var key in dist) {
         var letters = dist[key].split(",")
         var cnt = parseInt(key, 10)
         for (i=0; i<letters.length; i++ ) {
            for (j=0; j<cnt; j++) {
               this.consonants.push( letters[i])
            }
         }
      }

      this.consonants = this.shuffle(this.consonants)
   }

   shuffle( array ) {
      let currentIndex = array.length,  randomIndex
      while (currentIndex != 0) {
         randomIndex = Math.floor(Math.random() * currentIndex)
         currentIndex--
         [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]]
      }

      return array;
   }
}
