<template>
   <div>
      <Studio332Header page="home" />
      <div class="content">
         <h2>Welcome</h2>
         <p>
            Studio332 is dedicated to the creation of high quality apps for the web and mobile devices. We have
            decades of experience in a wide range of technologies including
            gaming, backend services, database desgn, educational software and web app development. Some of our core
            skills include:
         </p>
         <p class="list">Go, Vue.js, Ruby on Rails, Java, Neo4j, MySQL and PostgresSQL</p>
         <p>Check out some of our publicly released code here:</p>
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
         <p>
            Do you have an idea for an app, and need an experienced team to make your idea a reality?
            We can help. Contact us at
            <a
               href="mailto:louffoster@gmail.com"
            >louffoster@gmail.com</a> for more information.
         </p>
      </div>
   </div>
</template>

<script>
import Studio332Header from "@/components/Studio332Header.vue";
export default {
   name: "home",
   components: {
      Studio332Header
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

