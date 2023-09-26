
export default class Pool {
   constructor ()   {
      this.pool = []
   }

   hasTilesLeft() {
      return this.pool.length > 0
   }

   pop() {
      return this.pool.pop()
   }

   refill() {
      // fill pool with letters based on distribution rules...
      this.pool = []
      var i,j
      var dist = {
         1: "J,K,Q,X,Z", 3: "B,C,F,H,M,P,V,W,Y",
         4: "G", 5: "L", 6: "D,S,U", 7: "N",
         8: "T,R", 9: "O,I,A,E"}
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