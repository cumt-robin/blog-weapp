import { GetCategoryCount } from "../../api/category.js"
import { GetCommentTotal } from "../../api/comment.js"

const app = getApp()

Page({
  data: {
    activeTab: 'home',
    panels: [
      { name: 'home', icon: 'home-o', label: '首页' },
      { name: 'category', icon: 'label-o', badge: '', label: '分类' },
      { name: 'msgs', icon: 'comment-o', badge: '', label: '留言' },
      { name: 'my', icon: 'user-o', label: '我的', disabled: true }
    ]
  },
  onLoad(query) {
    if (query.active) {
      this.setData({
        activeTab: query.active
      })
    }
    this.getCategoryCount()
    this.getCommentTotal()
    app.userinfoCallback = this.onUserinfoReady
  },
  onUserinfoReady(flag, res) {
    console.log('userinfo ready:', res)
    if (flag) {
      this.setData({
        'panels[3].disabled': false
      })
    } else {
      this.setData({
        'panels[3].disabled': false
      })
    }
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
    if (event.detail === 'my' && !app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/auth/index?to=my'
      })
    } else {
      this.setData({
        activeTab: event.detail
      })
    }
  }
})
