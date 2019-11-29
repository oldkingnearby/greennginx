import axios from 'axios';

let base = '/api';
// 请求登陆
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };
// 请求注册
export const requestRigester = params => { return axios.post(`${base}/rigester`, params).then(res => res.data); };
// 请求修改密码
export const requestResetpassword = params => { return axios.post(`${base}/resetpassword`, params).then(res => res.data); };
// 验证用户名邮箱是否一致
export const requestCheckuseremail = params => { return axios.post(`${base}/checkuseremail`, params).then(res => res.data); };
// 获取登陆状态
export const getLoginStatus = params => { return axios.get(`${base}/login`, { params: params }); };
// 获取图片验证码
export const getVertifyCode = params => { return axios.get(`${base}/identifycode/pic`, { params: params }); };
// 验证验证码
export const postVertifyCode = params => { return axios.post(`${base}/identifycode/pic`, params ).then(res=>res.data); };
// 获取邮箱验证码
export const getEmailVertifyCode = params => { return axios.get(`${base}/identifycode/email`, { params: params } ).then(res=>res.data); };

// 标准数据库增删查改API  分页查询
export const getPageDataFromdb = (dbname,params) => { return axios.get(`${base}/${dbname}`, { params: params } ).then(res=>res.data); };
// 标准数据库增删查改API 添加单个
export const insertOne2db = (dbname,params) => { return axios.post(`${base}/${dbname}`, params ).then(res=>res.data); };
// 标准数据库增删查改API 删除单个
export const deleteOneFromdb = (dbname,params) => { return axios.delete(`${base}/${dbname}`, {data:params} ).then(res=>res.data); };
// 标准数据库增删查改API 修改单个
export const updateOneFromdb = (dbname,params) => { return axios.put(`${base}/${dbname}`, params ).then(res=>res.data); };

// 标准数据库上传多条数据
export const insertMany2db = (dbname,params) => { return axios.post(`${base}/${dbname}/upload`, params ).then(res=>res.data); };

// 数据库基本信息获取数据库名
export const getDatabaseName = () => { return axios.get(`${base}/databaseinfo` ).then(res=>res.data); };
