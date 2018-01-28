<template>
  <div>
    <div class="search-area">
      <div class="search-checkbox">
        <input type="checkbox" id="one" v-model="isEveryMemoryDisplayed">
      </div>
      <div class="search-input" v-if="isEveryMemoryDisplayed">
        <input v-model="search" placeholder="タグ、本文を検索"/>
      </div>
      <div v-for="value in this.availableTags">
        <span class="tag-list">
          {{ value }}
        </span>
      </div>
    </div>
    <div class="title">
      <h1>MemoryFeed</h1>
      <hr/>
      <div class="center-content">
        <div class="add-memory">
          <!--<div class="add-button" v-if="isDisplayed">-->
          <!--<button @click="displayAddForm">閉じる</button>-->
          <!--</div>-->
          <!--<div class="add-button" v-else>-->
          <!--<button @click="displayAddForm">追加する</button>-->
          <!--</div>-->
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
                <button @click.prevent="addTag()">{{ memory.tags }}</button>
              </ul>

              <p>
                <button id="post-button" @click.prevent="post()">追加する</button>
              </p>
            </el-card>
          </div>
        </div>

        <el-card class="box-card add-form">
          <!--<p>{{ memory.reviewedTimes }} / 6</p>-->
          <div class="tag-content-wrapper">
            <div class="editor-tag">
              <!--<p>-->
              <input type="text" id="fixed-tag-input1" class="fixed-tag-input" spellcheck="false" v-model="memory.tag1"
                     placeholder="タグ1を追加"/>
              <input type="text" id="fixed-tag-input2" class="fixed-tag-input" spellcheck="false" v-model="memory.tag2"
                     placeholder="タグ2を追加"/>
              <input type="text" id="fixed-tag-input3" class="fixed-tag-input" spellcheck="false" v-model="memory.tag3"
                     placeholder="タグ3を追加"/>
              <input type="text" id="fixed-tag-input4" class="fixed-tag-input" spellcheck="false" v-model="memory.tag4"
                     placeholder="タグ4を追加"/>
              <input type="text" id="fixed-tag-input5" class="fixed-tag-input" spellcheck="false" v-model="memory.tag5"
                     placeholder="タグ5を追加"/>
              <!--</p>-->
              <div>
          <textarea class="fixed-content" id="fixed-content" type="text" v-model="memory.content"
                    placeholder="本文を入力" :rows="rows" required/>
              </div>
            </div>
          </div>
          <div class="tag-span-wrapper">
            <span class="tag-span" v-for="value in tagCompletionList">{{ value }}</span>
          </div>
          <div v-for="memory in computeTagList" class="tags">
            <button class="tag-button" @click.prevent="addTagByButton(memory.tag)">
              {{ memory.tag1 }}
            </button>
          </div>
          <div>
            <button id="fixed-post-button" @click.prevent="post()">追加する</button>
          </div>
        </el-card>
        <div v-if="isEveryMemoryDisplayed">
          <div id="parent-feed-every" class="parent-feed">
            <div class="clear-fix">
              <!--{{ memory.reviewedTimes }} / 6-->
              <!--内容:{{ memory.content }}-->
              <div class="child-feed" v-for="memory in filteredMemory">
                <el-card class="box-card">
                  <div class="buttons">
                    <button @click="edit(memory)">編集</button>
                    <button @click="delet(memory)">削除</button>
                  </div>
                  <span>{{ memory.addedDate }}〜</span>
                  <span>{{ memory.reviewedTimes }}回目</span>
                  <div class="feed">{{ memory.content }}</div>
                  <div class="">
                    <span class="tag-span" v-for="value in memory.tags">{{ value }}</span>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div id="parent-feed-review" class="parent-feed">
            <div class="clear-fix">
              <!--{{ memory.reviewedTimes }} / 6-->
              <!--内容:{{ memory.content }}-->
              <div class="child-feed" v-for="memory in memoryList" v-if="memory.isToBeReviewedFlag">
                <el-card class="box-card">
                  <div class="buttons">
                    <button @click="review(memory)">復習</button>
                    <button @click="finishReview(memory)">復習終了</button>
                    <button @click="edit(memory)">編集</button>
                    <button @click="delet(memory)">削除</button>
                  </div>
                  <span>{{ memory.addedDate }}〜</span>
                  <span>{{ memory.reviewedTimes }}回目</span>
                  <div class="feed">{{ memory.content }}</div>
                  <div class="">
                    <span class="tag-span" v-for="value in memory.tags">{{ value }}</span>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="tag-wrapper">-->
    <!--</div>-->
    <!--↑v-modelをつけるとボタンを押した瞬間に一瞬だけ文字が入ってその後すぐ消えてしまう。-->

    <!--ちゃんと定義するのを忘れない。memoryはFor文の中だけだからいいがmemoryList needs to be defined properly inside data.-->
    <!--content, addedDateなどは、AddMemory.vueで定義されていて、memoryの中にすでに入ってるものを取り出しているだけなので定義する必要がない。-->
  </div>
</template>

<script>
  import axios from 'axios'
  import Firebase from 'firebase'
  import moment from 'moment'
  import BootstrapVue from 'bootstrap-vue'

  export default {
    name: '',
    data() {
      return {
        memory: {
          reviewedTimes: 0,
          content: '',
          addedDate: moment().format('YYYY/MM/DD HH:mm'),
          tags: [],
          tag1: '',
          tag2: '',
          tag3: '',
          tag4: '',
          tag5: '',
          isToBeReviewedFlag: true,
          isReviewFinishedFlag: true,
          reviewedDate: moment(),
          nextReviewDate: moment(),
          isDeletedFlag: false
        },
        tagCompletionList: [],
        blockMultiPostNum: 0,
        memoryList: [],
        availableTags: [],
        submitted: false,
        isEveryMemoryDisplayed: false,
        search: '',
        isDisplayed: false // これを上のmemoryの中に入れていたら動かなかった。それは当然だ！上に入れていたら、それにアクセスするならmemory.isDisplayedにしないとダメだ。
      }
    },
    computed: {
      updatFeed: function () {
      },
      rows: function () {
        var num = this.memory.content.split("\n").length
        return (num > 4) ? num : 4
      },
      filteredMemory: function () {
        return this.memoryList.filter((memory) => {
          //  tag, contentで検索
          return memory.content.match(this.search) || memory.tag1.match(this.search) || memory.tag2.match(this.search) ||
            memory.tag3.match(this.search) || memory.tag4.match(this.search) || memory.tag5.match(this.search)
        })
      },
      computeTagList: () => {
        if (this.memoryList !== undefined) {
          console.log('taglist')
          return this.memoryList.filter((memory) => {
            return memory.tags
          })
        }
      },
      computeReviewFlag: () => {
        var time = new Date();
        if (this.memoryList !== undefined) {
          return this.memoryList.filter((memory) => {
            return memory.nextReviewDate - time.now() < 0
          })
        }
      }
    },
    filters: {
      excludeDuplicate: () => {
        this.availableTags.filter((x, i, self) => {
          return self.indexOf(x) === i
        })
      }
    },
    created() {
      axios.get('https://memory-manager-dd40d.firebaseio.com/posts.json').then(data => {
        // this.memoryList = data.data これだとオブジェクトなので、配列として扱えない。なのでslice(), reverse()が使えなかった。
        // 配列にするために、Object.values(data.data)を使っている。

        this.memoryList = Object.values(data.data) //  ここのvaluesメソッドがkeyを消してindexに変えている。
        const keys = Object.keys(data.data) // ここをコメントアウトしないと配列が逆にならない。ここは配列。keysにオブジェクトのkeyを入れている。
        this.memoryList.forEach((v, i) => {
          v.key = keys[i]  //  ここで上のmemoryListでは失われたkeyをmemoryのkeyに入れている。これにより、memoryにkeyを残すことに成功した。
          // タグ履歴を追加。
          for (i = 0; i < 5; i++) {
            if (v.tags[i] !== '') {
              this.availableTags.push(v.tags[i])
            }
          }
          if (moment().diff(v.nextReviewDate, 'days') > 0) {
            v.isToBeReviewedFlag = true
          }
        })
        this.availableTags = this.availableTags.filter((x, i, self) => {
          return self.indexOf(x) === i
        })
      })
    },
    methods: {
      post() {
        var postButton = document.getElementById('fixed-post-button')
        postButton.disabled = true
        if (this.blockMultiPostNum === 0) {
          this.blockMultiPostNum += 1
          // let reviewedMonth = new Date().getMonth() + 1
          // let today = reviewedDay.getFullYear().toString() + reviewedMonth.toString() + reviewedDay.getDate().toString()

          this.memory.tags.push(this.memory.tag1)
          this.memory.tags.push(this.memory.tag2)
          this.memory.tags.push(this.memory.tag3)
          this.memory.tags.push(this.memory.tag4)
          this.memory.tags.push(this.memory.tag5)
          console.log(this.memory.tag1)
          this.memory.tags = this.memory.tags.filter((x, i, self) => {
            return self.indexOf(x) === i
          })
          this.memory.tags = this.memory.tags.filter((e) => { //  これで''を配列から削除できる
            return e !== ''
          })
          // this.memory.tags = this.tagCompletionList
          this.memory.addedDate = moment()//  これをpostのなかに入れたらnullになってしまった。then(dataのところで設定されているdataをpostするのだろうな。
          this.memory.nextReviewDate = moment().add(1, 'days')
          //  arrow関数を使えば、thisが上書きされない。arrow関数でない場合、下のaxios.postのところでselfにthisを代入しなければならなかったが、arrow関数を使えばその必要はない。
          axios.post('https://memory-manager-dd40d.firebaseio.com/posts.json', this.memory).then(data => {
            this.submitted = true
            this.memory.content = ''
            this.memory.tags = []
            this.memory.tag1 = ''
            this.memory.tag2 = ''
            this.memory.tag3 = ''
            this.memory.tag4 = ''
            this.memory.tag5 = ''
            this.tagCompletionList = []
            this.isDisplayed = false
          })
          setTimeout(() => {
            axios.get('https://memory-manager-dd40d.firebaseio.com/posts.json').then(data => {
              this.memoryList = Object.values(data.data) //  ここのvaluesメソッドがkeyを消してindexに変えている。
              const keys = Object.keys(data.data) // ここをコメントアウトしないと配列が逆にならない。ここは配列。keysにオブジェクトのkeyを入れている。
              this.memoryList.forEach((v, i) => {
                v.key = keys[i]  //  ここで上のmemoryListでは失われたkeyをmemoryのkeyに入れている。これにより、memoryにkeyを残すことに成功した。
              })
              // console.log(this)
              this.memoryList = Object.values(data.data)
              this.memoryList = this.memoryList.slice().reverse()
            })
          }, 800)
        }
        postButton.disabled = false
        this.blockMultiPostNum = 0
      }
      ,
      delet(memory) {
        // ref = new Firebase("")
        console.log('delete')
        axios.delete('https://memory-manager-dd40d.firebaseio.com/posts/-L3MzG9HFyNTF0TtVpdH', this.memory)
        setTimeout(() => {
          axios.get('https://memory-manager-dd40d.firebaseio.com/posts.json').then(data => {
            // console.log(this)
            this.memoryList = Object.values(data.data)
            this.memoryList = this.memoryList.slice().reverse()
          })
        }, 800)
      }
      ,
      displayAddForm() {
        this.blockMultiPostNum = 0
        this.isDisplayed = !this.isDisplayed // ここ= isDisplayedにしていたら怒られてたけど、今思えば当たり前だ。isDisplayedはローカル変数になるししかもそれはこのメソッドでは定義されていない。
      }
      ,
      review(memory) {
        console.log('review')
        memory.reviewedTimes += 1  // thisのスコープはexport defaultの中。なしだと、reviewの中になる。
        memory.isToBeReviewedFlag = false
        memory.reviewedDate = moment()
        switch (memory.reviewedTimes) {
          case 1:
            memory.nextReviewDate = moment().add(1, 'days')
            break
          case 2:
            memory.nextReviewDate = moment().add(3, 'days')
            break
          case 3:
            console.log('3 review')
            memory.nextReviewDate = moment().add(7, 'days')
            break
          case 4:
            memory.nextReviewDate = moment().add(21, 'days')
            break
          case 5:
            memory.nextReviewDate = moment().add(1, 'months')
            break
          case 6:
            memory.isReviewFinishedFlag = true
            memory.nextReviewDate = ''
            break
        }
        //  postする場所はパス構造になっている。
        axios.put('https://memory-manager-dd40d.firebaseio.com/posts/' + memory.key + '.json', memory).then(function (data) {
        })
      }
      ,
      finishReview(memory) {
        memory.isReviewFinishedFlag = true
      }
      ,
      edit(memory) {
        memory.isToBeEditedFlag = !memory.isToBeEditedFlag
        console.log(memory.key)
        let targetString = memory.tag
        var separatorString = ' '
        this.tagCompletionList = targetString.split(separatorString)
        this.tagCompletionList = this.tag
      }
      ,
      addTag() {
        let targetString = document.getElementById('fixed-tag-input').value
        var separatorString = ' '
        var separatorString2 = '　'
        this.tagCompletionList = targetString.split(separatorString)
        let aaa = this.tagCompletionList.join('')
        this.tagCompletionList = aaa.split(separatorString2)
        // this.tagCompletionList = targetString.split(separatorString2)
        this.tagCompletionList = this.tagCompletionList.filter((e) => { //  これで''を配列から削除できる
          console.log(e)
          return e !== ''  //  このeはinputへの入力。''でないinputを返すのか。filter配列の要素を一つ一つ見てここの式がtrueになる配列を新たに生成するらしい。
        })

        // console.log(this.tagCompletionList)
      }
      ,
      addTagByButton(tag) {
        console.log(tag)
        if (!this.tagCompletionList.includes(tag)) {
          // this.document.getElementById('fixed-tag-input').value = tag
          let targetString = document.getElementById('fixed-tag-input').value
          targetString = '' + tag + ' '
          var separatorString = ' '
          this.tagCompletionList = targetString.split(separatorString)
          this.tagCompletionList = this.tagCompletionList.filter((e) => { //  これで''を配列から削除できる
            console.log(e)
            return e !== ''  //  このeはinputへの入力。''でないinputを返すのか。filter配列の要素を一つ一つ見てここの式がtrueになる配列を新たに生成するらしい。
          })
        }
        console.log(this.memory.tags)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import url("//unpkg.com/element-ui@2.0.7/lib/theme-chalk/index.css");

  .add-memory {
    /*position: fixed;*/
    /*width: 300px;*/
    /*height: 300px;*/
    /*left: 50px;*/
  }

  .add-form {
    background: #f5f5f5;
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
    width: 680px;
    margin-left: auto;
    margin-right: auto;
  }

  .tags {
    /*width: 300px;*/
    position: relative;
    list-style: none;
    /*display: table-cell;*/
    display: inline;
    margin-left: 10px;
  }

  ul {
    display: table;
    table-layout: fixed;
    width: 100%;
  }

  .tag-span-wrapper {
    position: relative;
    width: 0px;
    left: 5px;
    top: 7px;
    /*bottom: 740px;*/
    /*left: 310px;*/
  }

  .editor-tag {
    /*position: absolute;*/
    width: 600px;
    margin-right: auto;
    margin-left: auto;
  }

  .tag-span {
    position: relative;
    background: #e9e9f2;;
    margin-left: 3px;
    margin-right: 3px;
    border-radius: 3px;
    padding-right: 4px;
    padding-left: 4px;
    padding-top: 2px;
    padding-bottom: 2px;
    font-weight: 400;
    font-size: 1.2em;
  }

  .fixed-tag-input {
    /*color: transparent;*/
    width: 400px;
    height: 35px;
    margin-left: 6px;
    margin-top: 5px;
    font-weight: 400;
    font-size: 1.1em;
    border: 1px solid #ccc;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 5px;
    position: relative;
    padding-left: 6px;
    /*bottom: 740px;*/
    /*left: 310px;*/
  }

  .feed {
    margin-top: 10px !important;
    min-height: 120px;
    text-align: left;
    white-space: pre-wrap;
  }

  .buttons {
    float: left;
  }

  .fixed-content {
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-top: 30px;
    width: 600px;
    box-sizing: border-box;
    min-height: 100px;
    font-size: 1.1em;
    padding-left: 6px;
    padding-right: 6px;
    /*line-height: 30px;*/
  }

  .tag-button {
    position: absolute;
  }

  .tag-content-wrapper {
    width: 100%;

  }

  .center-content {
    width: 800px;
    float: left;
  }

  .search-area {
    float: right;
  }

  .search-input {
    float: right;
  }

  .search-checkbox {
    float: left;
  }

  .title {
    margin-right: auto;
    margin-left: auto;
    float: left;
  }

</style>
