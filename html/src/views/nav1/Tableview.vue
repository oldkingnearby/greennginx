<template>
<section>
       <el-row>
        <el-divider></el-divider>
    </el-row>
<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
<el-row>
  <el-button type="primary" @click="handleAdd">添加</el-button>
  <el-button type="primary" @click="downloadPagedata">下载本页</el-button>
</el-row>
</el-col>
    <el-table v-loading="loading" ref="filterTable" :data=tabledata.data border :header-cell-style="{background:'#DCDFE6'}" >
    <el-table-column sortable v-for='(value,key) in tabledata.showtitle' :key='key' 
    :prop='key' :label='value' :column-key='key'></el-table-column>
    <el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
	</el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
        <el-pagination v-model="tabledataChanged"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tabledata.page"
      :page-sizes="[10, 100, 500, 1000]"
      :page-size="tabledata.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tabledata.count">
    </el-pagination>
    </el-col>

    <!-- 编辑界面 -->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm"  label-width="80px"  ref="editForm">
                <el-form-item v-for='(value,key) in editForm' :key="key" :label="tabledata.showtitle[key]+''" :prop="key">
					<el-input v-model="editForm[key]"  auto-complete="off"></el-input>
				</el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" >提交</el-button>
			</div>
        </el-dialog>

    
    <!-- 添加界面 -->
		<el-dialog title="添加" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm"  label-width="80px"  ref="addForm">
                <el-form-item v-for='(value,key) in addForm' :key="key" :label="tabledata.showtitle[key]+''" :prop="key">
					<el-input v-model="addForm[key]"  auto-complete="off"></el-input>
				</el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" >提交</el-button>
			</div>
        </el-dialog>

</section>
</template>

<script>
import { getPageDataFromdb,insertOne2db,deleteOneFromdb,updateOneFromdb } from '../../api/api';
export default {
    data(){
        return {
            loading:false,
            editFormVisible:false,
            addFormVisible:false,
            editForm: {
                },
            addForm: {
                },
            tabledata:{
                database:"tabletitle",
                count:1,
                pagesize:10,//页面大小
                page:1,//当前页面
                pages:1,//总共有多少页
                data:[{"key":"key1","value":"value1"}],//数据库分页后的数据
                toshowtitle:{"key":"关键字","value":"值"},//显示的用户数据表头
                todbtitle:{"关键字":"key","值":"value"},//转化数据库表头
                showtitle:{"key":"关键字","value":"值"},//默认显示的表头
                querystr:"",//查询条件字符串
                sortbystr:"_id:1",//排序条件字符串
            }
        }
    },
    computed:{
        // store 数据变化勾子
        tabledataChanged(){
            this.tabledata=this.$store.state.tabledata;
            return this.$store.state.tabledata.count;
        }
    },
    methods:{
        // 下载本页
        downloadPagedata(){
            const th=[];
            const filterVal=[];
        for (var key in this.tabledata.showtitle){
            th.push(this.tabledata.showtitle[key]);
            filterVal.push(key);
        }
        console.log(th,filterVal);
        // const th = ['姓名', '生日', '性别', '年龄']
        // const filterVal = ['name', 'birthday', 'sex', 'age']
        const data = this.tabledata.data.map(v => filterVal.map(k => v[k]))
        const filename="{0}_下载页面_{1}".format(this.$store.state.databases[this.tabledata.database],this.tabledata.page);
        const [fileName, fileType, sheetName] = [filename, 'xlsx', 'Sheet1']
        this.$toExcel({th, data, fileName, fileType, sheetName})

        },
        handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.tabledata.pagesize=val;
        this.update_page_data();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`,this.tabledata.page);
        this.tabledata.page=val;
        this.update_page_data();
      },
      update_page_data(){
          let params={query:this.tabledata.querystr,page:this.tabledata.page,pagesize:this.tabledata.pagesize,sortby:this.tabledata.sortbystr}
          this.loading=true;
        getPageDataFromdb(this.tabledata.database,params).then(data=>{
            this.loading=false;
            if (data.code!=200){
                this.$store.commit("showInfoMsg",{message:data.msg,type:"error"});
            }else{
                this.$store.commit("showInfoMsg",{message:data.msg,type:"success"});
                this.tabledata.count=data.count;
                this.tabledata.pages=data.pages;
                this.tabledata.data=data.data;
                
            }
        });
      },
    //   删除
      handleDel: function (index, row){
          var _this = this;
            this.$confirm('确认删除吗?', '提示', {
                //type: 'warning'
            }).then(() => {
                this.loading=true;
                let params=JSON.stringify(Object.assign({}, row));
                deleteOneFromdb(this.tabledata.database,params).then(res=>{
                    this.loading=false;
                    let {code,msg}=res;
               if (code==200){
                   console.log("showInfoMsg",msg,"success");
                    this.$store.commit("showInfoMsg",{message:msg,type:"success"});
                    this.editFormVisible=false;
                    this.tabledata.page=1;
                    this.update_page_data();
                }else{
                    this.$store.commit("showInfoMsg",{message:msg,type:"error"});
                }
          });
            }).catch(() => {

            });
          
      },
      //显示编辑界面
        handleEdit: function (index, row) {
            console.log("显示编辑窗口");
            
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
            console.log(this.editForm);
        },
        // 提交修改
      editSubmit(){
          console.log("修改后的form",this.editForm);
          this.loading=true;
            updateOneFromdb(this.tabledata.database,this.editForm).then(res=>{
                this.loading=false;
                if (res.code==200){
                    this.$store.commit("showInfoMsg",{message:res.msg,type:"success"});
                     this.editFormVisible=false;
                }else{
                    this.$store.commit("showInfoMsg",{message:res.msg,type:"error"});
                }
            })
      },
           //显示添加界面
        handleAdd() {
            console.log("显示添加窗口",this.tabledata.showtitle);
            
            this.addFormVisible = true;
            
            var empty={};
            for (var key in this.tabledata.showtitle){
                empty[key]='';
            }
            this.addForm = Object.assign({}, empty);
            
        },
        // 提交添加
      addSubmit(){
        //   console.log("添加的form",this.addForm);
          let params={}
          for (var key in this.addForm){
                params[key]=this.addForm[key];
            }
          insertOne2db(this.tabledata.database,params).then(res=>{
              let {code,msg}=res;
              if (res.code==200){
                   this.$store.commit("showInfoMsg",{message:res.msg,type:"success"});
                     this.addFormVisible=false;
                     this.tabledata.page=1;
                    this.update_page_data();
              }else{
                  this.$store.commit("showInfoMsg",{message:res.msg,type:"error"});
              }
          })
      },
    },
    mounted() {
            // 更新表头
			this.$store.commit("update_table_data");
            // this.tabledata=(this.$store.state.tabledata);
            // console.log("更新后",this.tabledata);
		}
}
</script>

<style>

@import url("//unpkg.com/element-ui@2.9.1/lib/theme-chalk/index.css");

.toolbar{
    /* align:center; */
    top: 50%;
    text-align: left;
    background-color: #DCDFE6;
}
</style>