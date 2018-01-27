<template>
  <div id="app">
    <div class="parent-feed">
      <!--<memory-header></memory-header>-->
      <add-memory></add-memory>
      <memory-feed></memory-feed>
    </div>
  </div>
</template>

<script>
  import AddMemory from './components/AddMemory.vue'
  import MemoryFeed from './components/MemoryFeed.vue'
  import MemoryHeader from './components/MemoryHeader.vue'

  export default {
    name: 'app',
    components: {
      'addMemory': AddMemory,
      'memoryFeed': MemoryFeed,
      'memory-header': MemoryHeader
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

  .parent-feed {
    display: inline-block;
  }
</style>
