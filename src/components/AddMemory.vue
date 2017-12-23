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
          タグ:<input type="text" id="tag-input" v-model="memory.tag" v-on:keyup.enter="post" @input="addTag"/>
          <!--</div>-->
          <!--↑v-modelをつけるとボタンを押した瞬間に一瞬だけ文字が入ってその後すぐ消えてしまう。-->

          <ul v-for="memory in memoryList" class="tags">
            <button @click.prevent="addTag()">{{ memory.tag }}</button>
          </ul>
          <button id="post-button" @click.prevent="post()">追加する</button>
        </el-card>
      </div>
    </div>

    <el-card class="box-card add-form">
      <p>{{ memory.reviewedTimes }} / 6</p>
      <p>
        <textarea type="text" v-model="memory.content" placeholder="本文を入力" required/>
      </p>

      <p>
        <input type="text" id="fixed-tag-input" class="fixed-tag-input" v-model="memory.tag" v-on:keyup.enter="post"
               @input="addTag"
               placeholder="タグを追加"/>
      </p>
      <div class="tag-span-wrapper">
        <span class="tag-span" v-for="value in tagCompletionList">{{ value }}</span>
      </div>
      <ul v-for="memory in memoryList" class="tags">
        <button @click.prevent="addTagByButton(memory.tag)">
          {{ memory.tag }}
        </button>
      </ul>
      <!--<div class="tag-wrapper">-->
      <!--</div>-->
      <!--↑v-modelをつけるとボタンを押した瞬間に一瞬だけ文字が入ってその後すぐ消えてしまう。-->

      <p>
        <button id="fixed-post-button" @click.prevent="post()">追加する</button>
      </p>
    </el-card>
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
    data() {
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
        tagCompletionList: [],
        blockMultiPostNum: 0,
        memoryList: [],
        submitted: false,
        isDisplayed: false // これを上のmemoryの中に入れていたら動かなかった。それは当然だ！上に入れていたら、それにアクセスするならmemory.isDisplayedにしないとダメだ。
      }
    },
    computed: {
      filterCard: function (memory) {
        return memory.isToBeReviewedFlag === true
      },
      updatFeed: function () {

      }
    },
    created() {
      this.memoryList.forEach((v, i) => {
        let reviewedDate = new Date()
        let reviewedMonth = new Date().getMonth() + 1
        if (v.nextReviewDate.equal((reviewedDate.getFullYear() + '/' +
            reviewedMonth + '/' + reviewedDate.getDate()))) {
          v.isToBeReviewedFlag = true
        }
      })
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
        this.memoryList = this.memoryList.slice().reverse()
      })
    },
    methods: {
      post() {
        var postButton = document.getElementById('post-button')
        postButton.disabled = true
        console.log(this.blockMultiPostNum)
        if (this.blockMultiPostNum === 0) {
          this.blockMultiPostNum += 1
          console.log(this.blockMultiPostNum)
          let reviewedDay = new Date()
          let reviewedMonth = new Date().getMonth() + 1
          this.memory.addedDate = (reviewedDay.getFullYear() + '/' + reviewedMonth + '/' + reviewedDay.getDate() + '/' + reviewedDay.getDay())//  これをpostのなかに入れたらnullになってしまった。then(dataのところで設定されているdataをpostするのだろうな。
          //  arrow関数を使えば、thisが上書きされない。arrow関数でない場合、下のaxios.postのところでselfにthisを代入しなければならなかったが、arrow関数を使えばその必要はない。
          axios.post('https://memory-manager-dd40d.firebaseio.com/posts.json', this.memory).then(data => {
            console.log('aaaa')
            this.submitted = true
            this.memory.content = ''
            this.memory.tag = ''
            this.isDisplayed = false
          })
          setTimeout(() => {
            axios.get('https://memory-manager-dd40d.firebaseio.com/posts.json').then(data => {
              // console.log(this)
              this.memoryList = Object.values(data.data)
              this.memoryList = this.memoryList.slice().reverse()
            })
          }, 800)
        }
        postButton.disabled = false
      },
      displayAddForm() {
        this.blockMultiPostNum = 0
        this.isDisplayed = !this.isDisplayed // ここ= isDisplayedにしていたら怒られてたけど、今思えば当たり前だ。isDisplayedはローカル変数になるししかもそれはこのメソッドでは定義されていない。
      },
      review(memory) {
        let reviewedDate = new Date()
        let reviewedMonth = new Date().getMonth() + 1
        memory.reviewedTimes += 1  // thisのスコープはexport defaultの中。なしだと、reviewの中になる。
        memory.isToBeReviewedFlag = false
        memory.isReviewFinishedFlag = false
        memory.reviewedDate = (reviewedDate.getFullYear() + '/' + reviewedMonth + '/' + reviewedDate.getDate())
        var i
        switch (memory.reviewedTimes) {
          case '1':
            i = 1
            break
          case '2':
            i = 3
            break
          case '3':
            i = 7
            break
          case '4':
            i = 21
            break
          case '5':
            i = 30
            break
          case '6':
            memory.isReviewFinishedFlag = true
            break
        }
        memory.nextReviewDate = new Date(reviewedDate.getTime() + i * 24 * 60 * 60 * 1000).toString()
        //  postする場所はパス構造になっている。
        axios.put('https://memory-manager-dd40d.firebaseio.com/posts/' + memory.key + '.json', memory).then(function (data) {
        })
      },
      finishReview(memory) {
        memory.isReviewFinishedFlag = true
      },
      edit(memory) {
      },
      addTag() {
        let targetString = document.getElementById('fixed-tag-input').value
        var separatorString = ' '
        this.tagCompletionList = targetString.split(separatorString)
        this.tagCompletionList = this.tagCompletionList.filter((e) => { //  これで''を配列から削除できる
          console.log(e)
          return e !== ''  //  このeはinputへの入力。''でないinputを返すのか。filter配列の要素を一つ一つ見てここの式がtrueになる配列を新たに生成するらしい。
        })

        // console.log(this.tagCompletionList)
      },
      addTagByButton(tag) {
        console.log(tag)
        if (!this.tagCompletionList.includes(tag)) {
          this.tagCompletionList.push(tag)
        }
        console.log(this.tagCompletionList)
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
    /*display: table-cell;*/
    display: inline;
  }

  ul {
    display: table;
    table-layout: fixed;
    width: 100%;
  }

  .fixed-tag-input {
    color: transparent;
    width: 520px;
  }

  .tag-span {
    background: antiquewhite;
    margin-left: 2px;
    margin-right: 2px;
    border-radius: 3px;
    padding-right: 2px;
    padding-left: 2px;
  }

  .tag-span-wrapper {
    position: absolute;

  }

</style>
