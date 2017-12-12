<template>
  <div id="parent-feed" class="parent-feed">
    <div class="clear-fix">
      <!--{{ memory.reviewedTimes }} / 6-->
      <!--内容:{{ memory.content }}-->
      <div class="child-feed" v-for="memory in memoryList">
        <el-card class="box-card" v-if="memory.isToBeReviewedFlag">
          <span>
            {{ memory.addedDate }}〜
          </span>
          <span>
            {{ memory.reviewedTimes }}回目
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
          <button @click="review">復習</button>
          <button @click="finishReview">復習終了</button>
          <button @click="edit">編集</button>
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
    data () {
      return {
        memoryList: [],
        isDisplayed: true
      }
    },
    methods: { // メソッドの中のスコープがどうなっているのかわからない。
      review () {
        console.log(this.memoryList.memory.isReviewFinishedFlag)
        this.memoryList.memory.reviewedTimes += 1  // thisのスコープはexport defaultの中。なしだと、reviewの中になる。
        this.memoryList.memory.isToBeReviewedFlag = true
        this.memoryList.memory.isReviewFinishedFlag = false
        console.log(this.memoryList.memory.isReviewFinishedFlag)
      },
      finishReview () {
        this.memoryList.memory.isReviewFinishedFlag = true
      },
      edit () {
      },
      displayAddForm: function () {
        this.isDisplayed = !this.isDisplayed
      }
    },
    created () {
      axios.get('https://memory-manager-dd40d.firebaseio.com/posts.json').then(data => {
        console.log(data)
        // this.memoryList = data.data これだとオブジェクトなので、配列として扱えない。なのでslice(), reverse()が使えなかった。
        // 配列にするために、Object.values(data.data)を使っている。

        this.memoryList = Object.values(data.data)
        // this.keys = Object.keys()
        // console.log(this.memoryList)
        // let keyss = Object.keys(this.memoryList)
        // console.log(keyss[0])
        this.memoryList = this.memoryList.slice().reverse()
      })
    }
  }
</script>


<style scoped>
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
