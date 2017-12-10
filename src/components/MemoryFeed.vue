<template>
  <div id="parent-feed" class="parent-feed">
    <div class="clear-fix">
      <div class="title">
        <h1>MemoryFeed</h1>
        <hr/>
      </div>
      <!--{{ memory.reviewedTimes }} / 6-->
      <!--内容:{{ memory.content }}-->
      <!--<p>追加した日にち: {{ memory.addedDate }}</p>-->
      <div class="child-feed" v-for="memory in memoryList">
        <el-card class="box-card">
          <span>
            追加した日：{{ memory.addedDate }}
            復習回数：{{ memory.reviewedTimes }}
          </span>
          <p>
            {{ memory.content }}
          </p>
          <p>
            タグ
          </p>
          <p>
            {{ memory.tag }}
          </p>
          <button v-bind:click="review">復習</button>
          <button v-bind:click="finishReview">復習終了</button>
          <button v-bind:click="edit">編集</button>
        </el-card>
      </div>
    </div>
    <!--ちゃんと定義するのを忘れない。memoryはFor文の中だけだからいいがmemoryList needs to be defined properly inside data.-->
    <!--content, addedDateなどは、AddMemory.vueで定義されていて、memoryの中にすでに入ってるものを取り出しているだけなので定義する必要がない。-->
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: '',
    data() {
      return {
        memoryList: []
      }
    },
    methods: {
      review () {
        this.memoryList.memory.reviewedTimes += 1
        this.memoryList.memory.isToBeReviewedFlag = false
        this.memoryList.memory.isReviewFinishedFlag = false
      },
      finishReview () {
        this.memoryList.memory.isReviewFinishedFlag = true
      },
      edit () {
      }
    },
    created () {
      let self = this
      axios.get('https://memory-manager-dd40d.firebaseio.com/posts.json').then(data => {
        console.log(data)
        self.memoryList = data.data
      })
    }
  }
</script>


<style scoped>
  .title {
    margin-right: auto;
    margin-left: auto;
  }
  .parent-feed {
    /*width: 400px;*/
    display: inline-block;
  }

  .child-feed {
    margin-left: auto;
    margin-right: auto;
  }

  @import url("//unpkg.com/element-ui@2.0.7/lib/theme-chalk/index.css");
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
