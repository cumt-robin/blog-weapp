import api from "./index";

const namespace = '/banner';

// 获取小程序Banner
export const GetWeappBanners = params => api.get(`${namespace}/weapp`, params);
