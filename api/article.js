import api from "./index";

const namespace = '/article';

// 分页查询
export const GetArticlePage = params => api.get(`${namespace}/page`, params);

// 获取详情
export const GetArticleDetail = params => api.get(`${namespace}/detail`, params);

export const GetArticlesByCategory = params => api.get(`${namespace}/page_by_category`, params);
