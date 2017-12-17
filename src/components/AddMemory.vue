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

          <!--<div class="tag-wrapper">-->
            タグ:<input type="text" id="tag" v-model="memory.tag" v-on:keyup.enter="post"/>
          <!--</div>-->
          <!--↑v-modelをつけるとボタンを押した瞬間に一瞬だけ文字が入ってその後すぐ消えてしまう。-->

          <ul v-for="memory in memoryList" class="tags">
            <button @click.prevent="addTag(memory.tag)">{{ memory.tag }}</button>
          </ul>
          <button @click.prevent="post">追加する</button>
        </el-card>
      </div>
    </div>

    <div id="parent-feed" class="parent-feed">
      <div class="clear-fix">
        <!--{{ memory.reviewedTimes }} / 6-->
        <!--内容:{{ memory.content }}-->
        <div class="child-feed" v-for="memory in memoryList" v-if="memory.isToBeReviewedFlag">


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
            <button @click="review(memory)">復習</button>
            <button @click="finishReview(memory)">復習終了</button>
            <button @click="edit(memory)">編集</button>
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
    data () {
      return {
        memory: {
          reviewedTimes: 0,
          content: '',
          addedDate: '',
          tags: [],
          tag: '',
          isToBeReviewedFlag: true,
          isReviewFinishedFlag: false,
          reviewedDate: ''
        },
        memoryList: [],
        submitted: false,
        isDisplayed: false // これを上のmemoryの中に入れていたら動かなかった。それは当然だ！上に入れていたら、それにアクセスするならmemory.isDisplayedにしないとダメだ。
      }
    },
    computed: {
      filterCard: function (memory) {
        return memory.isToBeReviewedFlag === true
      }
    },
    watch: {
      memoryList () {
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
        console.log(this)
        // this.memoryList = data.data これだとオブジェクトなので、配列として扱えない。なのでslice(), reverse()が使えなかった。
        // 配列にするために、Object.values(data.data)を使っている。

        this.memoryList = Object.values(data.data) //  ここのvaluesメソッドがkeyを消してindexに変えている。
        const keys = Object.keys(data.data) // ここをコメントアウトしないと配列が逆にならない。ここは配列。keysにオブジェクトのkeyを入れている。
        this.memoryList.forEach((v, i) => {
          v.key = keys[i]  //  ここで上のmemoryListでは失われたkeyをmemoryのkeyに入れている。これにより、memoryにkeyを残すことに成功した。
        })
        console.log(this.memoryList)
        // console.log(this.memoryList)
        // let keyss = Object.keys(this.memoryList)
        this.memoryList = this.memoryList.slice().reverse()
      })
    },
    methods: {
      post () {
        let self = this
        let reviewedDay = new Date()
        let reviewedMonth = new Date().getMonth() + 1
        //  arrow関数を使えば、thisが上書きされない。arrow関数でない場合、下のaxios.postのところでselfにthisを代入しなければならなかったが、arrow関数を使えばその必要はない。
        axios.post('https://memory-manager-dd40d.firebaseio.com/posts.json', this.memory).then(data => {
          console.log(data)
          console.log(this)
          console.log(self)
          this.submitted = true
          this.memory.content = ''
          this.memory.tag = ''
          this.isDisplayed = false
          this.addedDate = (reviewedDay.getFullYear() + '/' + reviewedMonth + '/' + reviewedDay.getDate() + '/' + reviewedDay.getDay())
        })
      },
      displayAddForm () {
        this.isDisplayed = !this.isDisplayed // ここ= isDisplayedにしていたら怒られてたけど、今思えば当たり前だ。isDisplayedはローカル変数になるししかもそれはこのメソッドでは定義されていない。
      },
      review (memory) {
        let reviewedDay = new Date()
        let reviewedMonth = new Date().getMonth() + 1
        memory.reviewedTimes += 1  // thisのスコープはexport defaultの中。なしだと、reviewの中になる。
        memory.isToBeReviewedFlag = false
        memory.isReviewFinishedFlag = false
        memory.reviewedDate = (reviewedDay.getFullYear() + '/' + reviewedMonth + '/' + reviewedDay.getDate() + '/' + reviewedDay.getDay())

        //  postする場所はパス構造になっている。
        axios.put('https://memory-manager-dd40d.firebaseio.com/posts/' + memory.key + '.json', memory).then(function (data) {
          console.log(data)
        })
      },
      finishReview (memory) {
        memory.isReviewFinishedFlag = true
      },
      edit (memory) {
      },
      addTag (tag) {
        // document.getElementById('tag').value = tag
        // document.getElementById('taga').value = tag
        let tagForm = document.getElementById('tag-form')
        tagForm.innerHTML = '<span>' + tag + '</span>'

        console.log(tag)
        console.log(document.getElementById('tag').innerText)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import url("//unpkg.com/element-ui@2.0.7/lib/theme-chalk/index.css");

  .add-memory {
    position: fixed;
    width: 300px;
    left: 50px;
  }

  .add-form {
    background: lightblue;
    left: 50px;
    margin-top: 25px;
    /*margin-right: auto;*/
  }

  .add-button {
    /*left: 500px;*/
    position: fixed;
    left: 580px;
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

  .tags {
    /*width: 300px;*/
    list-style: none;
    display: table-cell;
  }

  ul {
    display: table;
    table-layout: fixed;
    width: 100%;
  }

  .tag-form {

  }

</style>
