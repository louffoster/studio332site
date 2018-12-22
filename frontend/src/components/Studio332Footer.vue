<template>
    <footer>
        <span class="cr">
            <span>&copy; 2018 Studio332</span>
            <img align="middle" class="s332foot" src="../assets/s332small.png"/>
        </span>
    </footer>
</template>

<script>
export default {
    name: "Studio332Footer"
}
</script>

<style scoped>
footer {
    position: relative;
    width: 100%;
    border-top: 3px solid red;
    margin-top: 50px;
    padding-top: 20px;
    height: 90px;
    background-color: white;
}
span.cr {
    position: absolute;
    right: 20px;
}
span.cr span {
    top: 20px;
}
</style>
