import api from "./index";

const namespace = '/comment';

// 获取小程序Banner
export const GetCommentPeopleNum = params => api.get(`${namespace}/number_of_people`, params);

// 分页查询
export const GetCommentPage = params => api.get(`${namespace}/page`, params);

export const GetCommentTotal = params => api.get(`${namespace}/total`, params);

// 新增
export const AddComment = params => api.post(`${namespace}/add`, params);