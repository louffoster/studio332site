import axios from 'axios'

const DICT_URL = import.meta.env.VITE_S332_DICT

export default class Dictionary {
   dictionary = []

   constructor() { 
      axios.get(DICT_URL).then( (resp) => {
         this.dictionary = resp.data
      })
   }

   isValid(word) {
      return this.dictionary.includes( word.toLowerCase())
   }
}