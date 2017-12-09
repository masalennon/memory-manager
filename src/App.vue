<template>
  <div id="app">
    <memory-feed></memory-feed>
    <add-memory></add-memory>

  </div>
</template>

<script>
  import AddMemory from './components/AddMemory.vue'
  import MemoryFeed from './components/MemoryFeed.vue'

  export default {
    name: 'app',
    components: {
      'addMemory': AddMemory,
      'memoryFeed': MemoryFeed
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
