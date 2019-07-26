import { GetArticlesByCategory } from "../../api/article.js"

Page({
  data: {
    keyword: '',
    articles: []
  },
  onLoad: function (query) {
    let { keyword } = query;
    this.setData({
      keyword
    })
    this.getArticles(keyword)
  },
  getArticles(keyword) {
    GetArticlesByCategory({ keyword }).then(res => {
      this.setData({
        articles: res.data
      })
    })
  },
  onScrollToLower() {}
})