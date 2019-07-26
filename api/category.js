import api from "./index";

const namespace = '/category';

// 获取所有
export const GetAllCategorys = params => api.get(`${namespace}/all`, params);

// 获取总数
export const GetCategoryCount = params => api.get(`${namespace}/count`, params);
