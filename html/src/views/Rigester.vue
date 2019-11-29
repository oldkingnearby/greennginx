<template>
  <div> 
    <div class="register-wrapper"> 
      <div id="register">
        <p class="title">注册</p>
        <el-form
          :model="ruleForm2"
          status-icon
          :rules="rules2"
          ref="ruleForm2"
          label-width="0"
          class="demo-ruleForm"
        >
          <el-form-item prop="username">
            <el-input v-model="ruleForm2.username" auto-complete="off" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="ruleForm2.email" auto-complete="off" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="emailcode" class="code">
            <el-input v-model="ruleForm2.emailcode" placeholder="验证码"></el-input>
            <el-button type="primary" :disabled='isDisabled' @click="sendCode">{{buttonText}}</el-button>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" placeholder="输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="确认密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm2')" style="width:100%;">注册</el-button>
            <p class="login" @click="gotoLogin">已有账号？立即登录</p>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script> 
import { getEmailVertifyCode,requestRigester } from '../api/api';
import crypto from 'crypto';
export default {
  name: "Register", 
  data() {
        // <!--验证用户名是否合法-->
    let checkUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (!this.checkUsername(value)) {
        callback(new Error('用户名不合法'))
      } else {
        callback()
      }
    }
    // <!--验证邮箱是否合法-->
    let checkEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (!this.checkEmail(value)) {
        callback(new Error('邮箱不合法'))
      } else {
        callback()
      }
    }
    //  <!--验证码是否为空-->
    let checkEmailcode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱验证码'))
      } else {
        callback()
      }
    }
    // <!--验证密码-->
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"))
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback()
      }
    }
    // <!--二次验证密码-->
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {  
      ruleForm2: {
        username:"",
        pass: "",
        checkPass: "",
        email: "",
        emailcode: ""
      },
      rules2: {
        username: [{ validator: checkUsername, trigger: 'change' }],
        pass: [{ validator: validatePass, trigger: 'change' }],
        checkPass: [{ validator: validatePass2, trigger: 'change' }],
        email: [{ validator: checkEmail, trigger: 'change' }],
        emailcode: [{ validator: checkEmailcode, trigger: 'change' }],
      },
      buttonText: '发送验证码',
      isDisabled: false, // 是否禁止点击发送验证码按钮
      flag: true
    }
  }, 
  methods: {
    // <!--发送验证码-->
    sendCode () {
      let email = this.ruleForm2.email
      if (this.checkEmail(email)) {
        let time = 120
        this.buttonText = '已发送'
        this.isDisabled = true
        getEmailVertifyCode({email:this.ruleForm2.email}).then(data=>{
          let {code,msg}=data;
          if (code !== 200) {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              } else
              {
                this.$message({
                  message: msg,
                  type: 'success'
                });
              }
           });

        if (this.flag) {
          this.flag = false;
          let timer = setInterval(() => {
            time--;
            this.buttonText = time + ' 秒'
            if (time === 0) {
              clearInterval(timer);
              this.buttonText = '重新获取'
              this.isDisabled = false
              this.flag = true;
            }
          }, 1000)
        }
      }
    },
    // <!--提交注册-->
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var md5 = crypto.createHash("md5")
          md5.update(this.ruleForm2.pass)//this.pw2这是你要加密的密码
          var pwd = md5.digest('hex')//this.pw这就是你加密完的密码，这个往后台传就行了
          let rigesterParams={username:this.ruleForm2.username,password:pwd,email:this.ruleForm2.email,vertifycode:this.ruleForm2.emailcode}
          // console.log(rigesterParams);
          requestRigester(rigesterParams).then(data=>{
            let {code,msg}=data;
            if (code !== 200) {
                  this.$message({
                    message: msg,
                    type: 'error'
                  });
                } else
                {
                  this.$message({
                    message: msg,
                    type: 'success'
                  });
                  this.gotoLogin();
                }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    },
    // <!--进入登录页-->
    gotoLogin() {
      this.$router.push({
        path: "/login"
      });
    },
    // 验证用户名
    checkUsername(str) {
      let re = /^[a-zA-Z0-9_]{3,16}$/ ;
      if (re.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    // 验证手机号
    checkMobile(str) {
      let re = /^1\d{10}$/
      if (re.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    // 验证邮箱
    checkEmail(str) {
      console.log("邮箱验证")
      let re = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
      if (re.test(str)) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped>
.loading-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #aedff8;
  display: flex;
  align-items: center;
  justify-content: center;
}
.register-wrapper img {
  position: absolute;
  z-index: 1;
}
.register-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
#register {
  max-width: 340px;
  margin: 60px auto;
  background: #fff;
  padding: 20px 40px;
  border-radius: 10px;
  position: relative;
  z-index: 9;
}
.title {
  font-size: 26px;
  line-height: 50px;
  font-weight: bold;
  margin: 10px;
  text-align: center;
}
.el-form-item {
  text-align: center;
}
.login {
  margin-top: 10px;
  font-size: 14px;
  line-height: 22px;
  color: #1ab2ff;
  cursor: pointer;
  text-align: left;
  text-indent: 8px;
  width: 160px;
}
.login:hover {
  color: #2c2fd6;
}
.code >>> .el-form-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.code button {
  margin-left: 20px;
  width: 140px;
  text-align: center;
}
.el-button--primary:focus {
  background: #409EFF;
  border-color: #409EFF;
  color: #fff;
}
</style>