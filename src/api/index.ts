import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

// 从环境变量获取API基础URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://push2his.eastmoney.com/api/qt';

// 创建axios实例
const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10秒超时
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加时间戳防止缓存
    if (config.params) {
      config.params._t = Date.now();
    } else {
      config.params = { _t: Date.now() };
    }

    // 可以在这里添加 token 等认证信息
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    console.log('Request:', {
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
    });

    return config;
  },
  (error: any) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    // 处理东方财富API的响应格式
    // API返回格式: { rc: 0, rt: 17, svr: 177617938, lt: 1, full: 0, dlmkts: "", data: { ... } }
    if (response.data && response.data.rc === 0 && response.data.data) {
      console.log('返回data.data:', response.data.data);
      return response.data.data;
    }

    return response.data;
  },
  (error: any) => {
    console.error('Response Error:', error);

    // 错误处理逻辑
    if (error.response) {
      // 服务器返回了错误状态码
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          console.error('请求参数错误:', data);
          break;
        case 401:
          console.error('未授权，请登录');
          // 可以在这里跳转到登录页
          break;
        case 403:
          console.error('拒绝访问');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        case 502:
          console.error('网关错误');
          break;
        case 503:
          console.error('服务不可用');
          break;
        case 504:
          console.error('网关超时');
          break;
        default:
          console.error(`未知错误: ${status}`);
      }

      // 返回统一的错误信息
      return Promise.reject({
        message: data?.message || `请求失败: ${status}`,
        code: status,
        data,
      });
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误，请检查网络连接');
      return Promise.reject({
        message: '网络错误，请检查网络连接',
        code: 0,
      });
    } else {
      // 请求配置错误
      console.error('请求配置错误:', error.message);
      return Promise.reject({
        message: error.message || '请求配置错误',
        code: -1,
      });
    }
  }
);

export default request;
