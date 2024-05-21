<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import OverlayPanel from 'primevue/overlaypanel'

const charromhelp = ref()
const dwhelp = ref()
const vhelp = ref()
const mosaichelp = ref()
const sweephelp = ref()
const wmhelp = ref()

const toggleDWHelp = ((event) => {
   dwhelp.value.toggle(event)
})
const toggleVirusHelp = ((event) => {
   vhelp.value.toggle(event)
})
const toggleSweepHelp = ((event) => {
   sweephelp.value.toggle(event)
})
const toggleMosiacHelp = ((event) => {
   mosaichelp.value.toggle(event)
})
const toggleCharromHelp = ((event) => {
   charromhelp.value.toggle(event)
})
const toggleWMHelp = ((event) => {
   wmhelp.value.toggle(event)
})
</script>

<template>
   <div class="content">
      <h2>Games</h2>
      <ul>
         <li>
            <div class="game-info">
               <router-link to="/wordmine">WordMine</router-link>
               <Button  icon="pi pi-question" class="p-button-sm p-button-rounded p-button-info"  @click="toggleWMHelp" />
            </div>
            <OverlayPanel ref="wmhelp">
               <div class="rules">
                  <h3>WordMine</h3>
                  <p>Its a physics based word game. Maybe.</p>
               </div>
            </OverlayPanel>
         </li>
         <li>
            <div class="game-info">
               <router-link to="/charrom">Charrom</router-link>
               <Button  icon="pi pi-question" class="p-button-sm p-button-rounded p-button-info"  @click="toggleCharromHelp" />
            </div>
            <OverlayPanel ref="charromhelp">
               <div class="rules">
                  <h3>Charrom</h3>
                  <p>Charrom is a cross between Carrom and a word game.</p>
               </div>
            </OverlayPanel>
         </li>
         <li>
            <div class="game-info">
               <router-link to="/letterdrop">Letter Drop</router-link>
               <Button  icon="pi pi-question" class="p-button-sm p-button-rounded p-button-info"  @click="toggleDWHelp" />
            </div>
            <OverlayPanel ref="dwhelp">
               <div class="rules">
                  <h3>Letter Drop</h3>
                  <p>Drop letters onto the board then join adjacent letters to form words.</p>
                  <ul>
                     <li>Select a letter from the row above the board, then tap an arrow button to drop it onto the board in that column.</li>
                     <li>If you wait too long to drop a letter, the entire row will drop.</li>
                     <li>Select adjacent letters on the board to create 4-10 letter words.</li>
                     <li>Any selected letters can also be trashed by tapping the red X button.</li>
                     <li>Successful words remove those letters from the board.</li>
                     <li>Invalid words will cause the entire row of letter options to drop on the board.</li>
                  </ul>
               </div>
            </OverlayPanel>
         </li>
         <li>
            <div class="game-info">
               <router-link to="/mosaic">Mosaic</router-link>
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
               <router-link to="/virus">Virus</router-link>
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
         <li>
            <div class="game-info">
               <router-link to="/sweep">Sweep</router-link>
               <Button  icon="pi pi-question" class="p-button-sm p-button-rounded p-button-info"  @click="toggleSweepHelp" />
            </div>
            <OverlayPanel ref="sweephelp">
               <div class="rules">
                  <h3>Sweep</h3>
                  <p>Clear all letters from the board by uing them in 3-10 letter words.</p>
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
      font-size: 0.9em;
   }
   li {
      font-size: 0.85em;
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
a, .game-start {
   color: crimson;
   font-weight: bold;
   cursor: pointer;
   text-decoration: none;
   &:hover {
      text-decoration: underline;
   }
}
div.tests {
   font-size: 0.85em;
   border-top: 1px solid #999;
   margin-top: 20px;
   padding-top: 20px;
}

</style>

