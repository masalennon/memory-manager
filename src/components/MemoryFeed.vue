<template>
  <div id="single-blog">
    <hr/>
    memory feed
    {{ memory.times }} / 6
    <content>内容:{{ memory.content }}</content>
    <p>追加した日にち: {{ memory.addedDate }}</p>
    {{ memory}}
    <p>タグ:{{memory.tag}}</p>
    <ul>
      <li v-for="tag in memory">{{ tag }}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        memory: [],
        search: '',
        content: ''
      }
    },
    created () {
      this.$http.get('https://memory-manager-dd40d.firebaseio.com/posts/' + this.id + '.json').then(function (data) {
        console.log('got data =>' + data.json)
        return data.json()
      }).then(function (data) {
        var memoryArray = []
        for (let key in data) {
          data[key].id = key
          memoryArray.push(data[key])  // これでidを紐づけている
        }
        this.memory = memoryArray
        this.content = 'afaw'
        // this.memory = data
      })
    }
  }
</script>


<style scoped>

</style>
