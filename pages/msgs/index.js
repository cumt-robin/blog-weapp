import { GetCommentPeopleNum, GetCommentPage, GetCommentTotal } from "../../api/comment.js"

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
    total: 0
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
    getCommentList() {
      wx.showLoading({
        title: '加载中',
      })
      GetCommentPage({
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize
      }).then(res => {
        this.setData({
          comments: res.data,
          total: res.total
        })
      }).finally(() => {
        wx.hideLoading()
      })
    },
    onScrollToLower() {}
  }
})
