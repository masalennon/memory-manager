<template>
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
        },
        isDisplayed: true // これを上のmemoryの中に入れていたら動かなかった。それは当然だ！上に入れていたら、それにアクセスするならmemory.isDisplayedにしないとダメだ。
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
      },
      displayAddForm: function () {
        this.isDisplayed = !this.isDisplayed // ここ= isDisplayedにしていたら怒られてたけど、今思えば当たり前だ。isDisplayedはローカル変数になるししかもそれはこのメソッドでは定義されていない。
        console.log(this.isDisplayed)
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
