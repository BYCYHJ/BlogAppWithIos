import axios from 'axios';

// 获取验证码
export function getPhoneTokenCode(params) {
  return axios({
    method: 'get',
    url: 'http://47.109.141.21:5211/api/Login/GetPhoneTokenCode',
    params: params
  });
}