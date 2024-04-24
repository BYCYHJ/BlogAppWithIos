import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

//全局唯一user信息
let uniqueUserInfo = undefined;

export function setUniqueUserInfo(userInfo) {
  uniqueUserInfo = userInfo;
}

export function getUniqueUserInfo() {
  return uniqueUserInfo;
}

// 获取验证码
export function getPhoneTokenCode({ params }) {
  return axios({
    method: 'get',
    url: 'http://132.232.108.176:5211/api/Login/GetPhoneTokenCode',
    params: params
  });
}

//获取用户信息,包含userId、userName、phoneNumber
export async function getUserInfo() {
  const token = await getStorage('token');
  return axios({
    method: 'post',
    url: 'http://132.232.108.176:5211/api/Login/GetUserInfo',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
  });
}

//根据id查找唯一用户
export async function getUniqueUser(userId){
  const token = await getStorage("token");
  return axios({
    method: 'post',
    url: 'http://132.232.108.176:5211/api/Login/GetSingleUserInfo',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    params:{
      userId:userId,
    }
  });
}

//发布博客
export async function publishBlog(blog) {
  const token = await getStorage("token");
  return axios({
    method: 'post',
    // url: 'http://132.232.108.176:5212/api/Blog/CreateBlog',
    url: 'http://192.168.2.117:5211/api/Blog/CreateBlog',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    data: blog
  });
}

//将图片上传到服务器及数据库中
export async function photoUploadToServer({ base64Str }) {
  const userId = uniqueUserInfo == undefined ? "" : uniqueUserInfo.userId;
  return axios({
    method: 'post',
    url: 'http://132.232.108.176:5211/api/User/UploadAvatar',
    data: {
      fileUrl: '/mydata/PlatformResource/',
      fileName: uuidv4() + ".png",
      base64Str: base64Str,
      userId: userId
    },
  });
}

//获取唯一博客
export async function GetUniqueBlog(blogId) {
  const token = await getStorage("token");
  if (!token) { return; }
  return axios({
    method: 'get',
    url: 'http://192.168.2.117:5211/api/Blog/GetUniqueBlog',
    params: {
      blogId: blogId
    },
    headers: {
      Authorization: "Bearer " + token,
    }
  });
}

//根据欢迎程度获取博客
export async function GetRecommendBlogs(index, pageSize) {
  const token = await getStorage("token");
  if (!token) { return; }
  return axios({
    method: 'get',
    url: 'http://192.168.2.117:5211/api/Blog/GetRecommendBlog',
    params: {
      index: index,
      pageSize: pageSize,
    },
    headers: {
      Authorization: "Bearer " + token,
    }
  });
}

//根据关键词查找博客
export async function GetBlogsByKeywords(keyword, page, size) {
  const token = await getStorage("token");
  return axios({
    method: 'get',
    url: 'http://132.232.108.176:5213/api/BlogSearch/GetBlogsWithKeyword',
    params: {
      keyword: keyword,
      index: page,
      pageSize: size,
    },
    headers: {
      Authorization: "Bearer " + token,
    }
  });
}

//获取第一级评论
export async function GetHighestComments(blogId, index, pageSize) {
  const token = await getStorage("token");
  return axios({
    method: 'get',
    url: 'http://192.168.2.117:5211/api/Comments/GetBlogHighestComments',
    params: {
      blogId: blogId,
      index: index,
      pageSize: pageSize,
    },
    headers: {
      Authorization: "Bearer " + token,
    }
  });
}

//获取子评论
export async function GetChildrenComments(commentId, index, pageSize) {
  const token = await getStorage("token");
  return axios({
    method: 'get',
    url: 'http://192.168.2.117:5211/api/Comments/GetChildrenComments',
    params: {
      commentId: commentId,
      index: index,
      pageSize: pageSize,
    },
    headers: {
      Authorization: "Bearer " + token,
    }
  });
}

//持久化存储
export const setStorage = async (key, value) => {
  await AsyncStorage.setItem(key, value)
}

//获取存储的值
export const getStorage = async (key) => {
  return await AsyncStorage.getItem(key)
}