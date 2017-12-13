<template>
</template>

<script>
  import axios from 'axios'

  export default {
    name: '',
    data () {
      return {
        isDisplayed: true
      }
    },
    methods: { // メソッドの中のスコープがどうなっているのかわからない。
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
