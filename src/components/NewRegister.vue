<template>
  <div class="newRegister">
    <div class="inside">
      <h3><b>Mix Lunch</b></h3>
      <!-- <div style="text-align:center">
        <ul style="text-align:left; margin-left: auto; margin-right: auto;width: 500px;list-style-type: none">
         <li><p><el-input type="email" placeholder="Please input email" v-model="email">
           <template slot="prepend" style="width:100px">e-mail</template>
         </el-input></p></li>
         <li><p><el-input onpaste="return false" oncontextmenu="return false" type="email" placeholder="Please input email" v-model="email_confirm">
           <template slot="prepend">confirm e-mail</template>
         </el-input><span v-if="email!=email_confirm"> email is not same</span></p></li>
         <li><p><el-input type="password" placeholder="Please input passward" v-model="passward">
           <template slot="prepend">passward</template>
         </el-input></p></li>
         <li><p><el-input onpaste="return false" oncontextmenu="return false" type="password" placeholder="Please input passward" v-model="passward_confirm">
           <template slot="prepend">confirm passward</template>
         </el-input><span v-if="passward!=passward_confirm"> passward is not same</span></p></li>
        </ul>
        <el-button @click="register" type="primary">Register</el-button>
      </div> -->

      <el-form :model="formData" :rules="rules" ref="formData" label-width="110px" style="padding-right:110px" class="demo-ruleForm">
        <el-form-item label="Name or Nickname" prop="name">
          <el-input v-model="formData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="formData.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Confirm E-mail" prop="checkEmail">
          <el-input onpaste="return false" oncontextmenu="return false" v-model="formData.checkEmail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="pass">
          <el-input type="password" v-model="formData.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Confirm Paassward" prop="checkPass">
          <el-input onpaste="return false" oncontextmenu="return false" type="password" v-model="formData.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('formData')" :loading="registerClicked">Register</el-button>
          <el-button @click="resetForm('formData')">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  // var usersRef = firebase.database().ref('users')

  export default {
    name: 'newRegister',
    data () {
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the name'))
        } else {
          callback()
        }
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password'))
        } else if (value.length < 8) {
          callback(new Error('Password must be at least 8 characters'))
        } else {
          if (this.formData.checkPass !== '') {
            this.$refs.formData.validateField('checkPass')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password again'))
        } else if (value !== this.formData.pass) {
          callback(new Error('two passward does not match'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the email'))
        } else if (value.match(/.+@.+\..+/) == null) {
          callback(new Error('The email format is incorrect'))
        } else {
          if (this.formData.checkEmail !== '') {
            this.$refs.formData.validateField('checkEmail')
          }
          callback()
        }
      }
      var validateEmail2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the email again'))
        } else if (value !== this.formData.email) {
          callback(new Error('two email does not match'))
        } else {
          callback()
        }
      }
      return {
        registerClicked: false,
        formData: {
          name: '',
          pass: '',
          checkPass: '',
          email: '',
          checkEmail: ''
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          email: [
            { validator: validateEmail, trigger: 'blur' }
          ],
          checkEmail: [
            { validator: validateEmail2, trigger: 'blur' }
          ],
          name: [
            { validator: validateName, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.registerClicked = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            firebase.auth().createUserWithEmailAndPassword(this.formData.email, this.formData.pass).then(user => {
              this.$router.push({name: 'top'})
              firebase.database().ref('users/' + user.uid).set({
                username: this.formData.name,
                email: this.formData.email
              })
              this.$message({message: 'welcom ' + this.formData.name + '!', type: 'success'})
            }, error => {
              var errorCode = error.code
              var errorMessage = error.message
              if (errorCode === 'auth/weak-password') {
                this.$notify({title: 'error', message: 'The password is too weak.'})
              } else {
                this.$notify({title: 'error', message: errorMessage})
              }
              this.registerClicked = false
            })
          } else {
            this.registerClicked = false
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*.el-input {
    width: 300px;
  }*/
  h3{
    font-size: 3em;
    color: white;
    padding-top: 20px;
  }
  .newRegister {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    margin-top: 0px;
    height: 100%;

    background: #FF8008;
    background: -webkit-linear-gradient(to right, #FFC837, #FF8008);
    background: linear-gradient(to right, #FFC837, #FF8008);
  }
  .inside{
    /*position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);*/
  }
</style>
