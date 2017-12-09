<template>
  <div id="single-blog">
    <hr/>
    add memory
    {{ memory.times }} / 6
    <input type="text" v-model="memory.content" required />
    <p>タグ:<input type="text" v-model="memory.tag"/></p>
    <ul>
      <li v-for="tag in memory.tags">{{ tag }}</li>
    </ul>
    <button v-on:click.prevent="post">Add Memory</button>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      memory: {
        times: 0,
        content: '',
        addedDate: '',
        tag: []
      }
    }
  },
  computed: {
  },
  methods: {
    getAddedDate: () => {
      var addedDate = new Date().getDate()
      return addedDate
    },
    post: function () {
      this.$http.post('https://memory-manager-dd40d.firebaseio.com/posts.json', this.memory).then(function (data) {
        console.log(data)
        this.submitted = true
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
