import { GetArticleDetail } from "../../api/article.js"
import { GetCommentPage } from "../../api/comment.js"

const moment = require('../../lib/js/moment.min.js')

let id;

Page({
  data: {
    md: '',
    title: '',
    comments: [],
    total: 0,
    pageNo: 1,
    pageSize: 5,
    isLoadingComments: true
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
  onBack() {
    wx.navigateBack()
  }
})
