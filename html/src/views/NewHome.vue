<template>
<el-container>
	<!-- 顶部导航 -->
  <el-header class="header">
	 <el-col :span="22">
		  VUEADMIN
          <p>{{receiveMsg}}</p>
	</el-col>
	<el-col :span="1" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link" style="color:#fff"> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
    <el-col :span="1">
      <div class="img-avatar">
        <img  :src="this.sysUserAvatar"  />
      </div>
    </el-col>
  </el-header>

  <el-container >
    <el-aside >
		<el-menu :default-active="$route.path" class="el-menu-vertical-demo">
			<template v-for="(item,index) in $router.options.routes" >
				<el-submenu	:index="index+''" v-if="!item.hidden" class="el-submenu-vertical-demo">
					<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
					<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" @click="$router.push(child.path)">{{child.name}}</el-menu-item>
				</el-submenu>
			</template>
		</el-menu>
	</el-aside>
    <el-container>
      <el-main >
		  <el-col :span="24" class="breadcrumb-container">
			<el-col :span="4">
            <span class="title">{{$route.name}}</span>
            </el-col>
            <el-col :span="20">
                <el-breadcrumb separator="/" class="breadcrumb-inner">
                <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                    {{ item.name }}
                </el-breadcrumb-item>
            </el-breadcrumb>
            </el-col>
		</el-col>
		<el-col :span="24" class="content-wrapper">
			<transition name="fade" mode="out-in">
				<router-view></router-view>
			</transition>
		</el-col>
	  </el-main>
    </el-container>
  </el-container>
</el-container>

</template>

<script>
export default {
    data(){
        return {
            sysUserName:"",
            sysUserAvatar:"",
        }
    },
	methods:{
        handleopen() {
				//console.log('handleopen');
			},
        handleclose() {
            //console.log('handleclose');
        },
        handleselect: function (a, b) {
        },
        //退出登录
        logout: function () {
            var _this = this;
            this.$confirm('确认退出吗?', '提示', {
                //type: 'warning'
            }).then(() => {
                sessionStorage.removeItem('user');
                _this.$router.push('/login');
            }).catch(() => {

            });
        },
    },
    computed:{
        // 接收全局msg勾子
        receiveMsg(){
            console.log(this.$store.state.msg.message,this.$store.state.msg.type);
            this.$message({message:this.$store.state.msg.message,type:this.$store.state.msg.type});
            if ("请登陆后重试" === this.$store.state.msg.message){
                this.$router.push({ path: '/login' });
            }
            return this.$store.state.msg.count;

        }
    },
    // 启动后勾子
    mounted() {
        var user = sessionStorage.getItem('user');
        if (user) {
            user = JSON.parse(user);
            this.sysUserName = user.username || '';
            this.sysUserAvatar = "https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png";
        };
        // 更新表头
        this.$store.commit("update_table_title","tabletitle");
    }
}
</script>

<style >
/* @import url("//unpkg.com/element-ui@2.9.1/lib/theme-chalk/index.css"); */

.el-header{
	position: absolute;
	top:0px;
	width: 99.1%;
    background-color: rgb(202, 21, 21);
	color: rgb(233, 232, 238);
    text-align: left;
    line-height: 60px;
  }
.img-avatar img{
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 10px 0px 10px 10px;
    /* float: right; */
}
.breadcrumb-inner{
    float:right;
}
.title{
    float:left;
}

  

</style>

