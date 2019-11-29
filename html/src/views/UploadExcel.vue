<template>
<!-- <input type="file" ref="upload" accept=".xls,.xlsx" class="outputlist_upload"> -->
<section>
    <el-row>
        <el-divider></el-divider>
    </el-row>
<el-row>
<el-col :span="4">
<el-row>
<!-- 选择要上传的数据库 -->

  <el-select v-model="selectdatabase" @change="databaseChanged" class ="database-select-combox" filterable placeholder="选择数据库">
    <el-option
      v-for="(value,key) in databases"
      :key="key"
      :label="value"
      :value="key">
    </el-option>
  </el-select>
</el-row>
    

<!-- 显示缺少的表头 必须表头-->
<el-row>
<el-divider class="title-el-divider"></el-divider>
</el-row>
<el-row>
<el-card v-model="showtitleChanged" class="title-box-card">
  <div v-for="(value,key) in lacktitle" :key="key" class="text-item">
    {{value+""}}
  </div>
</el-card>
</el-row>


</el-col>
<el-col :span="1">
<el-divider direction="vertical"></el-divider>
</el-col>
<!-- 上传按钮 -->
<el-col :span="19">
    <!-- 工具条 -->
    <el-row>
        <el-col :span="3">
        <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        accept=".xls,.xlsx" 
        :auto-upload="false"
        :show-file-list="false"
        :on-change="upload">
        <el-button size="small" type="primary">点击上传</el-button>
        
        </el-upload>

        </el-col>
        
        <el-col :span="3">
            <el-button size="small" type="primary" @click="convertdbtitleExcel">智能转换</el-button>
        </el-col>

        <el-col :span="3">
            <el-button size="small" type="primary" @click="upload_page_data">上传本页</el-button>
        </el-col>

    </el-row>


<el-row>
    <!-- 上传表格的数据 -->
    <el-table v-loading="loading" ref="filterTable" :data=tabledata.data border :header-cell-style="{background:'#DCDFE6'}" >
        <el-table-column sortable v-for='(value,key) in tabledata.showtitle' :key='key' 
        :prop='key' :label='value' :column-key='key'></el-table-column>
        </el-table>

</el-row>
<!--工具条-->
    <el-col :span="24" class="toolbar">
        <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tabledata.page"
      :page-sizes="[10, 100, 500, 1000]"
      :page-size="tabledata.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tabledata.count">
    </el-pagination>
    </el-col>

</el-col>
</el-row>

    




  
</section>
</template>

<script>
import XLSX from 'xlsx'
import { insertMany2db } from '../api/api';
export default {
    data(){
        return {
            loading:false,
            selectdatabase:"",
            databases:{
        "tabletitle":"数据库字段"
    },
            showtitle:{},
            lacktitle:{},
            tabledata:{
                count:1,
                pagesize:10,
                pages:1,
                page:1,
                totaldata:[{"key":"key1","value":"value1"}],
                data:[
                    {"key":"key1","value":"value1"}
                ],
                showtitle:{"key":"关键字","value":"值"},
                todbtitle:{},
                toshowtitle:{},

            },
            outputs: []
        }
    },

// 启动后勾子
    mounted() {
        // 把数据库信息加载进来
        this.databases=this.$store.state.databases;
        for (var key in this.databases){
            this.selectdatabase=key;
            return 
        }
    },
    computed:{
        // 数据库变化了，更新表头信息
        showtitleChanged(){
            console.log("showtitleChanged")
            this.showtitle=this.$store.state.tabledata.showtitle;
            this.lacktitle=Object.assign({}, this.$store.state.tabledata.showtitle);
            this.tabledata.todbtitle=this.$store.state.tabledata.todbtitle;
            this.tabledata.toshowtitle=this.$store.state.tabledata.toshowtitle;
            // console.log(this.tabledata.todbtitle);
            return this.$store.state.tabledata.showtitle;
        }
    },
methods: {
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.tabledata.pagesize=val;
        this.split_page_data();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`,this.tabledata.page);
        this.tabledata.page=val;
        this.split_page_data();
      },
    databaseChanged(database){
        console.log("变化了",database);
        this.$store.commit("update_table_title",database);
    },
    // 分页数据
    split_page_data(){
        this.tabledata.pages=Math.ceil(this.tabledata.count/this.tabledata.pagesize);
        let start=(this.tabledata.page-1)*this.tabledata.pagesize;
        let end=Math.min(this.tabledata.count,(this.tabledata.page)*this.tabledata.pagesize)
        this.tabledata.data= this.tabledata.totaldata.slice(start,end);
    },
    // 上传本页数据到数据库
    upload_page_data(){
        let params=this.tabledata.data;
        insertMany2db(this.$store.state.tabledata.database,params).then(res=>{
            if (res.code==200){
                this.$store.commit("showInfoMsg",{message:res.msg,type:"success"});
            }else{
                this.$store.commit("showInfoMsg",{message:res.msg,type:"error"});
            }
        })
    },
    // 智能识别数据列
    convertdbtitleExcel(){
        this.loading=true;
        // 遍历所有目前的列
        let newkeys={}
        for (var key in this.tabledata.showtitle){
            // console.log(key);
            if (this.tabledata.todbtitle.hasOwnProperty(key)){
                // console.log("找到能转化的列",key);
                newkeys[this.tabledata.todbtitle[key]]=key;
            }
        }
        this.tabledata.showtitle=newkeys;
        
        // console.log("开始转化excel数据");
        // console.log(this.tabledata.totaldata);
        // 开始转化excel数据
        for(var key in newkeys) {
            delete this.lacktitle[key];
            for (var i in this.tabledata.totaldata){
                this.tabledata.totaldata[i][key]=this.tabledata.totaldata[i][newkeys[key]];
            }
        }
        // console.log(this.tabledata.totaldata);
        this.split_page_data();
        this.loading=false;
    },
    upload(file,fileList){
        // console.log("file",file);
        // console.log("fileList",fileList);
        let files={0:file.raw};
        this.readExcel1(files);
    },
    convert2tabledata(excelres){
        // console.log("来转化数据了");
        this.tabledata.totaldata=excelres;
        this.tabledata.count=excelres.length;
        if (this.tabledata.count>0){
            // console.log(this.tabledata.count);
            // console.log(excelres[0]);
            let titles={};
            for (var key in excelres[0]){
                // console.log(key);
                titles[key]=key;
            }
            // console.log(titles);
            this.tabledata.showtitle=titles;
        }
        this.split_page_data();
    },
    readExcel1(files) {
        //表格导入
            var that = this;
            if(files.length<=0){//如果没有文件名
                return false;
            }else if(!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())){
                this.$Message.error('上传格式不正确，请上传xls或者xlsx格式');
                return false;
            }
    
            const fileReader = new FileReader();
            fileReader.onload = (ev) => {
                try {
                    const data = ev.target.result;
                    const workbook = XLSX.read(data, {
                        type: 'binary'
                    });
                    const wsname = workbook.SheetNames[0];//取第一张表
                    const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
                    // console.log(ws);
                    this.convert2tabledata(ws);
                    // that.peopleArr = [];//清空接收数据
                    // if(that.peopleArr.length == 1 && that.peopleArr[0].roleName == "" && that.peopleArr[0].enLine == ""){
                    //     that.peopleArr = [];
                    // }
                    //重写数据
                    try{
                        
                    }catch(err){
                        console.log(err)
                    }
                    
                    this.$refs.upload.value = '';
        
                } catch (e) {
        
                    return false;
                }
            };
            fileReader.readAsBinaryString(files[0]);
        },

}
}
    

</script>
<style>

@import url("//unpkg.com/element-ui@2.9.1/lib/theme-chalk/index.css");
.database-select-combox{
    float:left;
}
.title-el-divider{
    margin-top: 100px;
    margin-bottom: 100px;
}
.title-box-card{
    float:left;
}
.title-box-card{
    width: 97%;
    border: 20px;
}
.text-item{
    text-align: left;
    top:5px;
    margin-top: 20px;    
}
</style>