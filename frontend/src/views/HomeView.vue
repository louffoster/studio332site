<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import OverlayPanel from 'primevue/overlaypanel'

const lwhelp = ref()
const vhelp = ref()
const mosaichelp = ref()

const toggleLWHelp = ((event) => {
   lwhelp.value.toggle(event)
})

const toggleVirusHelp = ((event) => {
   vhelp.value.toggle(event)
})

const toggleMosiacHelp = ((event) => {
   mosaichelp.value.toggle(event)
})
</script>

<template>
   <div class="content">
      <h2>Games</h2>
      <ul>
         <li>
            <div class="game-info">
               <router-link to="/latticewords">LatticeWords</router-link>
               <Button  icon="pi pi-question" class="p-button-sm p-button-rounded p-button-info"  @click="toggleLWHelp" />
            </div>
            <OverlayPanel ref="lwhelp">
               <div class="rules">
                  <h3>LatticeWords</h3>
                  <p>Slide the rows and columns of the letter lattice to form words.</p>
                  <p>Longer words (up to 6 letters) score more points. Forming multiple words adds bonuses.</p>
                  <p>Score as many points as possible before time runs out!</p>
               </div>
            </OverlayPanel>
         </li>
         <li>
            <div class="game-info">
               <router-link to="mosaic">Mosaic</router-link>
               <Button  icon="pi pi-question" class="p-button-sm p-button-rounded p-button-info"  @click="toggleMosiacHelp" />
            </div>
            <OverlayPanel ref="mosaichelp">
               <div class="rules">
                  <h3>Mosaic</h3>
                  <p>Match mosaic patterns by rotating groups of tiles.</p>
                  <ul>
                     <li>
                        Tap the circular area on the large mosaic to rotate groups of 4 tiles.
                     </li>
                     <li>
                        Match the layout of the mosaic in the lower left to ge biven a new pattern.
                     </li>
                     <li>
                        Match as many layouts as possible before time runs out!
                     </li>
                  </ul>
               </div>
            </OverlayPanel>
         </li>
         <li>
            <div class="game-info">
               <router-link to="virus">Virus</router-link>
               <Button  icon="pi pi-question" class="p-button-sm p-button-rounded p-button-info"  @click="toggleVirusHelp" />
            </div>
            <OverlayPanel ref="vhelp">
               <div class="rules">
                  <h3>Virus</h3>
                  <p>The system has a virus! Repel it by entering codewords.</p>
                  <ul>
                     <li>
                        Tap letters to form a codeword then tap the enter key to submit it.
                     </li>
                     <li>
                        Tap the Randomize key to replace all letters.
                     </li>
                     <li>
                        Each codeword you successfully submit clears a number of infected letters matching 
                        the length of the codeword and fills a segment the corresponding gauge.
                     </li>
                     <li>
                        Once all gauges are filled, the virus is removed.
                     </li>
                     <li>
                        If the virus takes over too many letters, the system fails and you lose.
                     </li>
                  </ul>
               </div>
            </OverlayPanel>
         </li>
      </ul>
   </div>
</template>

<style lang="scss" scoped>
div.rules {
   font-size: 0.85;
   h3 {
      margin: 0 0 16px 0;
      border-bottom: 1px solid;
      padding-bottom: 10px;
   }
   p {
      margin: 5px 0;
   }
}
div.content {
   text-align: left;
   margin: 0 auto;
   color: #444;
   font-size: 1.1em;
   ul {
      margin:0;
      padding: 0;
      list-style: none;
      li {
         padding: 2px 0;
      }
   }
   .game-info {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      button.p-button-rounded  {
         margin-left: 10px;
         width: 28px;
         height: 28px;
         padding: 0;
      }
   }
}
@media only screen and (min-width: 768px) {
   div.content {
      width: 60%;
   }
}
@media only screen and (max-width: 768px) {
   div.content {
      width: 90%;
   }
}
h2 {
   text-align: center;
   border-bottom: 1px solid crimson;
   padding-bottom: 10px;
}
a {
   color: crimson;
   font-weight: bold;
   cursor: pointer;
   text-decoration: none;
}
a:hover {
   text-decoration: underline;
}
p.list {
   margin: 0 40px;
   font-size: 0.8em;
   font-style: italic;
}

</style>

