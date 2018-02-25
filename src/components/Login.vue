<template>
  <div class="login">
    <div class="inside">
      <h3><b>Mix Lunch</b></h3>
      <p><el-input type="email" placeholder="Please input email" v-model="email">
        <template slot="prepend">E-mail</template>
      </el-input></p>
      <p><el-input type="password" placeholder="Please input password" v-model="password">
        <template slot="prepend">Passward</template>
      </el-input></p>
      <p><el-button @click="login" type="primary" :loading="loginClicked">Login</el-button></p>
      <p><el-button @click="newRegister" type="secondary">new register</el-button></p>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  // var usersRef = firebase.database().ref('users')

  export default {
    name: 'login',
    data () {
      return {
        email: '',
        password: '',
        loginClicked: false
      }
    },
    methods: {
      login () {
        this.loginClicked = true
        // var self = this
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(user => {
          this.$router.push({name: 'top'})
          // this.$message({message: 'login success!', type: 'success'})
        }, error => {
          this.loginClicked = false
          var errorCode = error.code
          var errorMessage = error.message
          if (errorCode === 'auth/wrong-password') {
            // alert('Wrong password.')
            this.$notify({title: 'error', message: 'wrong passward'})
          } else {
            // alert('Login failed')
            this.$notify({title: 'error', message: errorMessage})
          }
        })
      },
      newRegister () {
        this.$router.push({name: 'newRegister'})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-input {
    width: 240px;
  }
  h3{
    font-size: 3em;
    color: white;
  }
  .login {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin-top: 0px;
    height: 100%;

    background: #FF8008;
    background: -webkit-linear-gradient(to right, #FFC837, #FF8008);
    background: linear-gradient(to right, #FFC837, #FF8008);
  }
  .inside{
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
  }

  /*background-image: url(../assets/lunch.jpeg);
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-color: #464646;*/
</style>
