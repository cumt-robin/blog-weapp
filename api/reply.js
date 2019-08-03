import api from "./index";

const namespace = '/reply';

// 新增
export const AddReply = params => api.post(`${namespace}/add`, params);