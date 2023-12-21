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
}