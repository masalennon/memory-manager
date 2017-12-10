<template>
  <div id="single-blog">
    メモの追加
    {{ memory.reviewedTimes }} / 6
    <input type="text" v-model="memory.content" required/>
    <p>
      タグ:<input type="text" v-model="memory.tag"/>
    </p>
    <ul>
      <li v-for="tag in memory.tags">{{ tag }}</li>
    </ul>
    <button v-on:click.prevent="post">追加する</button>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: '',
    data () {
      return {
        memory: {
          reviewedTimes: 0,
          content: '',
          addedDate: '',
          tag: [],
          isToBeReviewedFlag: true,
          isReviewFinishedFlag: false
        }
      }
    },
    computed: {},
    methods: {
      getAddedDate: () => {
        var addedDate = new Date().getDate().toString()
        this.addedDate = addedDate
        return addedDate
      },
      post: function () {
        axios.post('https://memory-manager-dd40d.firebaseio.com/posts.json', this.memory).then(function (data) {
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
