<template>
   <div>
      <div class="content">
         <h2>Welcome</h2>
         <p>
            Studio332 likes to make games for mobile and web, but mostly web.
         </p>
         <p><router-link to="/virus">pixi test game</router-link>
         <p>Check out some old mobile game code here (and this site):</p>
         <ul>
            <li>
               <a href="https://github.com/louffoster/BlastWords">Android game: BlastWords</a>
            </li>
            <li>
               <a href="https://github.com/louffoster/flickit">Android game: FlickIt Alley</a>
            </li>
            <li>
               <a href="https://github.com/louffoster/studio332-site">This site</a>
            </li>
         </ul>
      </div>
   </div>
</template>

<script>
export default {
   name: "home",
   components: {
   }
};
</script>

<style scoped>
div.content {
   text-align: left;
   margin: 0 auto;
   color: #444;
   font-size: 1.1em;
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

