export default class Letter {
   #letter = ""
   #value = ""
   constructor (letter, value)   {
      this.#letter = letter 
      this.#value = value
   }

   get text() {
      return this.#letter
   }
   get value() {
      return this.#value
   }
   
   isVowel( ) {
      let vowel = ["A","E","I","O","U","Y"]
      return ( vowel.includes( this.#letter ) )
   }
}