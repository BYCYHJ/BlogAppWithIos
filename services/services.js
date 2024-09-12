import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

const BaseUrl = 'http://132.232.108.176:5200';
const DevUrl = "http://192.168.2.117:5046";

//全局唯一user信息
let uniqueUserInfo = undefined;

export function setUniqueUserInfo(userInfo) {
  uniqueUserInfo = userInfo;
}

export function getUniqueUserInfo() {
  if (uniqueUserInfo) {
    console.log(uniqueUserInfo);
    return uniqueUserInfo;
  }
}

// 获取验证码
export function getPhoneTokenCode({ params }) {
  return axios({
    method: 'get',
    url: BaseUrl + '/api/Login/GetPhoneTokenCode',
    params: params
  });
}

//获取用户信息,包含userId、userName、phoneNumber
export async function getUserInfo() {
  const token = await getStorage('token');
  return axios({
    method: 'post',
    url: BaseUrl + '/api/Login/GetUserInfo',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
  });
}

//根据id查找唯一用户
export async function getUniqueUser(userId) {
  const token = await getStorage("token");
  return axios({
    method: 'post',
    url: BaseUrl + '/api/Login/GetSingleUserInfo',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    params: {
      userId: userId,
    }
  });
}

//发布博客
export async function publishBlog(blog) {
  const token = await getStorage("token");
  return axios({
    method: 'post',
    // url: 'http://132.232.108.176:5212/api/Blog/CreateBlog',
    url: DevUrl + '/api/Blog/CreateBlog',
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
    url: BaseUrl + '/api/User/UploadAvatar',
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
    url: DevUrl + '/api/Blog/GetUniqueBlog',
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
    url: DevUrl + '/api/Blog/GetRecommendBlog',
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
    url: BaseUrl + '/api/BlogSearch/GetBlogsWithKeyword',
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

export async function GetPersonalBlogs(userId, index, pageSize) {
  const token = await getStorage("token");
  return axios({
    method: 'get',
    url: DevUrl + '/api/Blog/GetAllPersonalBlogs',
    params: {
      userId: userId,
      index: index,
      pageSize: pageSize,
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
    url: DevUrl + '/api/Comments/GetBlogHighestComments',
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
    url: DevUrl + '/api/Comments/GetChildrenComments',
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

//发表评论
export async function PublishComment(content, blogId, userId, parentId = null, highestCommentId = null) {
  const token = await getStorage("token");
  return axios({
    method: 'post',
    url: DevUrl + '/api/Comments/CreateComment',
    data: {
      content: content,
      blogId: blogId,
      userId: userId,
      parentId: parentId,
      highestCommentId: highestCommentId
    },
    headers: {
      Authorization: "Bearer " + token,
    }
  });
}

//对评论标记为喜欢
export async function AddCommentLike(commentId) {
  const token = await getStorage("token");
  return axios({
    method: 'get',
    url: DevUrl + '/api/Comments/AddLike',
    params: {
      commentId: commentId,
    },
    headers: {
      Authorization: "Bearer " + token,
    }
  });
}

//移除评论的喜欢标记
export async function RemoveCommentLike(commentId) {
  const token = await getStorage("token");
  return axios({
    method: 'get',
    url: DevUrl + '/api/Comments/RemoveLike',
    params: {
      commentId: commentId,
    },
    headers: {
      Authorization: "Bearer " + token,
    }
  });
}

//获取获赞记录
export async function GetAllPersonalNotification(index, pageSize) {
  const token = await getStorage("token");
  return axios({
    method: 'get',
    url: DevUrl + '/api/Notification/GetAllPersonalNotification',
    params: {
      index: index,
      pageSize: pageSize
    },
    headers: {
      Authorization: "Bearer " + token,
    }
  });
}

export async function GetAIAnswer(question) {
  return axios({
    responseType: 'stream',//流式返回
    method: 'get',
    url: DevUrl + '/api/Chat/AIChat',
    params: {
      content: question
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