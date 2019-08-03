const moment = require('../../lib/js/moment.min.js')

import { GetCommentPeopleNum, GetCommentPage, GetCommentTotal, AddComment } from "../../api/comment.js"

import { AddReply } from "../../api/reply.js"

import Toast from '../../utils/toast.js'

const app = getApp();

// type为1代表是留言，type为2代表是回复
let type;

let comment_id;

let parent_id = null;

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  data: {
    userCount: 0,
    commentTotal: 0,
    pageNo: 1,
    pageSize: 5,
    comments: [],
    total: 0,
    showTextarea: false,
    dialogTitle: '留言',
    placeholder: '请输入留言',
    content: ''
  },
  lifetimes: {
    attached() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
      this.getUserCount()
      this.getCommentTotal()
      this.getCommentList()
    }
  },
  methods: {
    getUserCount() {
      GetCommentPeopleNum().then(res => {
        this.setData({
          userCount: res.data
        })
      })
    },
    getCommentTotal() {
      GetCommentTotal().then(res => {
        this.setData({
          commentTotal: res.data
        })
      })
    },
    getCommentList(isLoadMore = false) {
      wx.showLoading({
        title: '加载中',
      })
      GetCommentPage({
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
            total: res.total
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
        dialogTitle: '留言',
        placeholder: '请输入留言'
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
          // 发起留言
          params = {
            approved: 0,
            nick_name: userInfo.nickName,
            avatar: userInfo.avatarUrl,
            device: app.globalData.systemInfo.model,
            content: this.data.content
          }
          return AddComment(params).then(res => {
            this.setData({
              showTextarea: false,
              pageNo: 1,
              content: ''
            })
            this.getCommentList();
            Toast.simple('留言成功，请耐心等待审核')
          })
        } else if (type === 1) {
          params = {
            approved: 0,
            nick_name: userInfo.nickName,
            avatar: userInfo.avatarUrl,
            device: app.globalData.systemInfo.model,
            content: this.data.content,
            comment_id
          }
        } else {
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
    }
  }
})
