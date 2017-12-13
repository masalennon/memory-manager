<template>
  <div>
    <div class="add-memory">
      <div class="add-button" v-if="isDisplayed">
        <button @click="displayAddForm">閉じる</button>
      </div>
      <div class="add-button" v-else>
        <button @click="displayAddForm">追加する</button>
      </div>
      <div v-if="isDisplayed">
        <el-card class="box-card add-form">
          メモの追加
          {{ memory.reviewedTimes }} / 6
          <textarea type="text" v-model="memory.content" required/>
          <p>
            タグ:<input type="text" v-model="memory.tag"/>
          </p>
          <ul>
            <li v-for="tag in memory.tags">{{ tag }}</li>
          </ul>
          <button @click.prevent="post">追加する</button>
        </el-card>
      </div>
    </div>

    <div id="parent-feed" class="parent-feed">
      <div class="clear-fix">
        <!--{{ memory.reviewedTimes }} / 6-->
        <!--内容:{{ memory.content }}-->
        <div class="child-feed" v-for="memory in memoryList">
          <el-card class="box-card">
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
          tags: [],
          tag: '',
          isToBeReviewedFlag: '',
          isReviewFinishedFlag: ''
        },
        memoryList: [],
        submitted: false,
        isDisplayed: true // これを上のmemoryの中に入れていたら動かなかった。それは当然だ！上に入れていたら、それにアクセスするならmemory.isDisplayedにしないとダメだ。
      }
    },
    computed: {},
    watch: {
      memoryList: function () {
        axios.get('https://memory-manager-dd40d.firebaseio.com/posts.json').then(data => {
          this.memoryList = Object.values(data.data)
          this.memoryList = this.memoryList.slice().reverse()
          // console.log(data) ここにコンソールを仕込むとログがで続けて不気味なんだけどそれはなぜだ。
        })
      }
    },
    created () {
      axios.get('https://memory-manager-dd40d.firebaseio.com/posts.json').then(data => {
        console.log(data)
        // this.memoryList = data.data これだとオブジェクトなので、配列として扱えない。なのでslice(), reverse()が使えなかった。
        // 配列にするために、Object.values(data.data)を使っている。

        this.memoryList = Object.values(data.data)
        // this.keys = Object.keys() ここをコメントアウトしないと配列が逆にならない。
        // console.log(this.memoryList)
        // let keyss = Object.keys(this.memoryList)
        // console.log(keyss[0])
        this.memoryList = this.memoryList.slice().reverse()
      })
    },
    methods: {
      getAddedDate: () => {
        var addedDate = new Date().getDate().toString()
        this.addedDate = addedDate
        return addedDate
      },
      post: function () {
        let self = this
        axios.post('https://memory-manager-dd40d.firebaseio.com/posts.json', this.memory).then(function (data) {
          console.log(data)
          self.submitted = true
          self.memory.content = ''
          self.memory.tag = ''
        })
      },
      displayAddForm: function () {
        this.isDisplayed = !this.isDisplayed // ここ= isDisplayedにしていたら怒られてたけど、今思えば当たり前だ。isDisplayedはローカル変数になるししかもそれはこのメソッドでは定義されていない。
        console.log(this.isDisplayed)
      },
      review() {
        console.log(this.memoryList.memory.isReviewFinishedFlag)
        this.memoryList.memory.reviewedTimes += 1  // thisのスコープはexport defaultの中。なしだと、reviewの中になる。
        this.memoryList.memory.isToBeReviewedFlag = true
        this.memoryList.memory.isReviewFinishedFlag = false
        console.log(this.memoryList.memory.isReviewFinishedFlag)
      },
      finishReview() {
        this.memoryList.memory.isReviewFinishedFlag = true
      },
      edit() {
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
    background: lightblue;
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
