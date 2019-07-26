import { GetArticleDetail } from "../../api/article.js"

Page({
  data: {
    id: '',
    md: '',
    title: ''
  },
  onLoad(query) {
    GetArticleDetail({ id: query.id }).then(res => {
      let md = res.data.article_text;
      this.setData({
        md,
        title: query.title
      })
    })
  },
  onBack() {
    wx.navigateBack()
  }
})
