<template>
  <div class="content">
    <h2>Welcome</h2>
    <p>
      Studio332 is dedicated to the creation of high quality apps for the web and mobile devices. We have
      decades of experience in a wide range of technologies including
      gaming, backend services, database desgn, educational software and web app development. Some of our core
      skills are: Go, Ruby on Rails, Vue.js, Java, Andriod development, Neo4j, MySQL and PostgresSQL.
    </p>
    <p>
      Check out some of our publicly released code here:
      <ul>
        <li><a href="https://github.com/louffoster/BlastWords">Android game: BlastWords</a></li>
        <li><a href="https://github.com/louffoster/flickit">Android game: FlickIt Alley</a></li>
        <li><a href="https://github.com/louffoster/studio332-site">This site</a></li>
      </ul>
    </p>
    <p>
      Do you have an idea for an app, and need an experienced team to make your idea a reality? 
      We can help. Contact us at louffoster@gmail.com for more information.
    </p>
    <router-link :to="{ name: 'latticewords'}"><span>Play LatticeWords</span></router-link>
  </div>
</template>

<script>
  export default {
    name: 'home',
  }
</script>

<style scoped>
div.content {
  text-align: left;
  width: 60%;
  margin: 0 auto;
  color: #444;
  font-size: 1.1em;
}
h2 {
  text-align: center;
  border-bottom: 1px solid crimson; 
  padding-bottom: 10px;
}
a {
  color:crimson;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>

