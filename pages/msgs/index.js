const moment = require('../../lib/js/moment.min.js')

import { GetCommentPeopleNum, GetCommentPage, GetCommentTotal } from "../../api/comment.js"

import Toast from '../../utils/toast.js'


const app = getApp();

let content = ''

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
    isIphonex: app.globalData.isIphonex,
    showTextarea: false
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
                time: moment(item.create_time).fromNow(),
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
    onShowReply(e) {
      let { type, comment_id } = e.detail
      this.setData({
        showTextarea: true
      })
      console.log(e)
    },
    onCancel() {
      this.setData({
        showTextarea: false
      })
    },
    onInput(e) {
      content = e.detail
    },
    onConfirmReply() {
      if (!content) {
        Toast.simple('您还未输入内容')
        this.selectComponent('#van-dialog').stopLoading()
      } else {
        console.log(content)
      }
    }
  }
})
