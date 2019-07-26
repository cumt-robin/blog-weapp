import { GetCategoryCount } from "../../api/category.js"
import { GetCommentTotal } from "../../api/comment.js"

Page({
  data: {
    activeTab: 'home',
    panels: [
      { name: 'home', icon: 'home-o', label: '首页' },
      { name: 'category', icon: 'label-o', badge: '', label: '分类' },
      { name: 'msgs', icon: 'comment-o', badge: '', label: '留言' },
      { name: 'my', icon: 'user-o', label: '我的' }
    ]
  },
  onLoad() {
    this.getCategoryCount()
    this.getCommentTotal()
  },
  getCategoryCount() {
    GetCategoryCount().then(res => {
      this.setData({
        'panels[1].badge': res.data
      })
    })
  },
  getCommentTotal() {
    GetCommentTotal().then(res => {
      this.setData({
        'panels[2].badge': res.data >= 99 ? '99+' : res.data
      })
    })
  },
  onTabChange(event) {
    this.setData({
      activeTab: event.detail
    })
  },
  
})
