import { GetArticlesByCategory } from "../../api/article.js"

const app = getApp();

Page({
  data: {
    keyword: '',
    isLoading: true,
    articles: [],
    isIphonex: app.globalData.isIphonex
  },
  onLoad: function (query) {
    let { keyword } = query;
    this.setData({
      keyword
    })
    this.getArticles(keyword)
  },
  getArticles(keyword) {
    wx.showLoading({
      title: '加载中',
    })
    GetArticlesByCategory({ keyword })
      .then(res => {
        this.setData({
          isLoading: false,
          articles: res.data
        })
        wx.hideLoading()
      })
      .catch(failure => {
        this.setData({
          isLoading: false
        })
        wx.hideLoading()
      })
  },
  onScrollToLower() {}
})