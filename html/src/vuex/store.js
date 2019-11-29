import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { getPageDataFromdb,getDatabaseName,deleteOneFromdb,updateOneFromdb } from '../api/api';

String.prototype.format = function(args) {
    var result = this;
    if (arguments.length < 1) {
        return result;
    }
 
    var data = arguments;       //如果模板参数是数组
    if (arguments.length == 1 && typeof (args) == "object") {
        //如果模板参数是对象
        data = args;
    }
    for (var key in data) {
        var value = data[key];
        if (undefined != value) {
            result = result.replace("{" + key + "}", value);
        }
}
    return result;
}

// 应用初始状态
const state = {
    databases:{
        "tabletitle":"数据库字段",
        "wellbase":"井基础",
        "prodmonth":"生产月报"
    },
    // 需要显示的提示信息
    msg:{
        message:"初始化...",
        type:"success",
        count:0,
    },
    // 用户数据初始化
    userdata:{
        // 用户名
        username:"", 
        // 用户管理区块
        blocks:[],
    },
    tabledata:{
        // 数据表名，也是API地址 /tabletitle
        database:"tabletitle",
        pagesize:10,//页面大小
        page:1,//当前页面
        pages:1,//总共有多少页
        data:[],//数据库分页后的数据
        toshowtitle:[],//显示的用户数据表头
        todbtitle:[],//转化数据库表头
        showtitle:[],//默认显示表头
        querystr:"",//查询条件字符串
        sortbystr:"_id:1",//排序条件字符串
        count:1,
    }
}

// 定义所需的 mutations
const mutations = {
    // 显示消息后的回调函数
    showInfoMsg(state,msg){
        state.msg.type = msg.type;
        state.msg.message = msg.message;
        state.msg.count = state.msg.count + 1;
    },
    // 更新当前数据表的表头对应
    update_table_title(state,database){
        console.log("update_table_title");
        state.tabledata.database = database;
        // dbtitle 转 为用户表头
        getPageDataFromdb("tabletitle",{query:"{0}:{1}:str:".format("database",database),pagesize:1000}).then(data=>{
            let {code,msg}=data;
            if (code!=200){
                this.commit("showInfoMsg",{message:msg,type:"error"});
                state.tabledata.toshowtitle=[];
                state.tabledata.todbtitle=[];
                state.tabledata.showtitle=[];
                state.tabledata.data=[];
            }else{
                this.commit("showInfoMsg",{message:msg,type:"success"});
                var toshowtitle = {};
                var todbtitle = {};
                var showtitle = {};
                data.data.forEach(function(item){
                    if (parseInt(item.type)==1){
                        toshowtitle[item.fromtitle]=item.totitle;
                        if (parseInt(item.show)==1){
                            showtitle[item.fromtitle]=item.totitle;
                        }
                    }else if (parseInt(item.type)==0){
                        todbtitle[item.fromtitle]=item.totitle;
                    }
                });
                state.tabledata.toshowtitle=toshowtitle;
                state.tabledata.todbtitle=todbtitle;
                state.tabledata.showtitle=showtitle;

                
            }
        });
    },
    // 更新当前数据表的第一页查询结果
    update_table_data(state){
        console.log("update_table_data");
        let params={query:state.tabledata.querystr,page:state.tabledata.page,pagesize:state.tabledata.pagesize,sortby:state.tabledata.sortbystr}
        getPageDataFromdb(state.tabledata.database,params).then(data=>{
            if (data.code!=200){
                console.log("showInfoMsg update_table_data",data.msg,"error");
                this.commit("showInfoMsg",{message:data.msg,type:"error"});
                state.tabledata.count=1;
                state.tabledata.pages=1;
                state.tabledata.data=[];
            }else{
                this.commit("showInfoMsg",{message:data.msg,type:"success"});
                state.tabledata.count=data.count;
                state.tabledata.pages=data.pages;
                state.tabledata.data=data.data;
                
            }
        });
    },
    // 更新数据库名
    updata_database_name(state){
        console.log("updata_database_name");
        let params={}
        getDatabaseName().then(data=>{
            if (data.code!=200){
                console.log(data);
                console.log("showInfoMsg updata_database_name",data.msg,"error");
                this.commit("showInfoMsg",{message:data.msg,type:"error"});
                
            }else{
                this.commit("showInfoMsg",{message:data.msg,type:"success"});
                state.databases=data.data;
            }
        });
    }
}
// 定义所需的 getters
const getters = {
    
}
// 定义所需的 actions
const actions = {
    
}
// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})