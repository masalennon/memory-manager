<template>
  <div class="add-memory">
    <div class="add-button">
      <button>追加する</button>
    </div>
    <div class="add-form">
      <el-card class="box-card">
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
      </el-card>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: '',
    data() {
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
  @import url("//unpkg.com/element-ui@2.0.7/lib/theme-chalk/index.css");

  .add-memory {
  }

  .add-form {
    display: none;
  }

  .add-button {

  }

  .text {
    font-size: 14px;
    width: 100px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: inline-block;
    content: "";
  }

  .clearfix {
    margin-left: auto;
    margin-right: auto;
    width: 400px;
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 580px;
    display: inline-block;
  }

</style>
