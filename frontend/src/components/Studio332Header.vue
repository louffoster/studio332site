<template>
   <div class="header">
      <router-link :to="{ name: 'home'}"><span><img class="s332" src="../assets/s332logotype.png"/></span></router-link>
       <ul class="menu">
         <router-link :to="{ name: 'home'}"><li :class="className('home')">Home</li></router-link>
         <router-link :to="{ name: 'games'}"><li :class="className('games')">Games</li></router-link>
       </ul>
   </div>
</template>

<script>
export default {
  name: "Studio332Header",
  props: {
    page: String
  },
  methods: {
    className: function(menu) {
      console.log("classNme: page =["+this.page+"]")
      if (menu === this.page ) {
        return "active"
      } 
    }
  }
}
</script>

<style scoped>
  div.header {
     background-color: white;
     color: #666;
     padding:2px 5px 0 5px;
     border-bottom: 3px solid red;
     text-align: left;
     position: relative;
  }
  .menu {
    overflow: hidden;
    position: absolute;
    right: 0;
    bottom: 0;
    list-style: none;
    font-weight: bold;
    margin: 0;
  }
  .menu li {
    float: left;
    text-align: center;
    margin: 10px 20px;
    cursor: pointer;
    color: #444;
    border-bottom: 1px solid white;
  }
  .menu li.active {
    border-bottom: 1px solid crimson;
  }
  .menu li a {
    color: #444;
  }
  .menu li:hover,  .menu li a:hover{
    opacity: 1;
  }
  a {
    color: #444;
    text-decoration: none;
  }
  div.header img.s332 {
    position: relative;
  }
</style>
