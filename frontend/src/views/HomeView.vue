<script setup>
</script>

<template>
   <div class="content">
      <h2>Games</h2>
      <ul>
         <li>
            <router-link to="/latticewords">LatticeWords</router-link>
         </li>
         <li>
            <router-link to="virus">Virus</router-link>
         </li>
      </ul>
   </div>
</template>

<style lang="scss" scoped>
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

