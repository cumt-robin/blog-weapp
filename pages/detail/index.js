import { GetArticleDetail } from "../../api/article.js"
import { GetCommentPage, AddComment } from "../../api/comment.js"
import { AddReply } from "../../api/reply.js"

const moment = require('../../lib/js/moment.min.js')

import Toast from '../../utils/toast.js'

const app = getApp();

// type为1代表是发起一级回复（即回复评论），type为2代表是发起二级回复（即对回复进行回复）
let type;

let comment_id;

let parent_id = null;

let id;

Page({
  data: {
    isIphonex: app.globalData.isIphonex,
    md: '',
    title: '',
    comments: [],
    total: 0,
    pageNo: 1,
    pageSize: 5,
    isLoadingComments: true,
    showTextarea: false,
    dialogTitle: '评论',
    placeholder: '请输入评论',
    content: ''
  },
  onLoad(query) {
    id = query.id
    this.getArticle(id, query.title)
  },
  getArticle(id, title) {
    GetArticleDetail({ id }).then(res => {
      let md = res.data.article_text;
      this.setData({
        md,
        title
      })
      this.getCommentList()
    })
  },
  getCommentList(isLoadMore = false) {
    wx.showLoading({
      title: '加载中',
    })
    GetCommentPage({
      id,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    }).then(res => {
      let newComments = res.data.map(item => {
        return {
          ...item,
          time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
          replies: item.replies.map(reply => {
            return {
              ...reply,
              time: moment(reply.create_time).fromNow(),
            }
          })
        }
      })
      let data;
      if (isLoadMore) {
        data = {
          comments: this.data.comments.concat(newComments),
          total: res.total
        }
      } else {
        data = {
          comments: newComments,
          total: res.total,
          isLoadingComments: false
        }
      }
      this.setData(data);
    }).finally(() => {
      wx.hideLoading()
    })
  },
  loadMore() {
    if (this.data.comments.length < this.data.total) {
      this.setData({
        pageNo: this.data.pageNo + 1
      })
      this.getCommentList(true)
    }
  },
  onScrollToLower() {
    this.loadMore()
  },
  onShowComment() {
    if (!app.globalData.userInfo) {
      return this.gotoAuthorize()
    }
    type = 0;
    this.setData({
      showTextarea: true,
      dialogTitle: '评论',
      placeholder: '请输入评论'
    })
  },
  onShowReply(e) {
    if (!app.globalData.userInfo) {
      return this.gotoAuthorize()
    }
    type = e.detail.type;
    comment_id = e.detail.comment_id
    parent_id = e.detail.parent_id || null
    this.setData({
      showTextarea: true,
      dialogTitle: '回复',
      placeholder: '请输入回复'
    })
  },
  gotoAuthorize() {
    wx.navigateTo({
      url: '/pages/auth/index'
    })
  },
  onCancel() {
    this.setData({
      showTextarea: false,
      content: ''
    })
  },
  onInput(e) {
    this.setData({
      content: e.detail
    })
  },
  onConfirmReply() {
    if (!this.data.content) {
      Toast.simple('您还未输入内容')
      this.selectComponent('#van-dialog').stopLoading()
    } else {
      let params;
      const userInfo = app.globalData.userInfo
      if (type === 0) {
        // 发起评论
        params = {
          approved: 0,
          nick_name: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          device: app.globalData.systemInfo.model,
          article_id: id,
          content: this.data.content
        }
        return AddComment(params).then(res => {
          this.setData({
            showTextarea: false,
            pageNo: 1,
            content: ''
          })
          this.getCommentList();
          Toast.simple('评论成功，请耐心等待审核')
        })
      } else if (type === 1) {
        // 发起一级回复
        params = {
          approved: 0,
          nick_name: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          device: app.globalData.systemInfo.model,
          content: this.data.content,
          comment_id
        }
      } else {
        // 发起二级回复
        params = {
          approved: 0,
          nick_name: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          device: app.globalData.systemInfo.model,
          parent_id,
          content: this.data.content,
          comment_id
        }
      }
      AddReply(params).then(res => {
        this.setData({
          showTextarea: false,
          pageNo: 1,
          content: ''
        })
        this.getCommentList();
        Toast.simple('回复成功，请耐心等待审核')
      })
    }
  },
  onBack() {
    wx.navigateBack()
  }
})
