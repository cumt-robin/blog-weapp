// pages/search/index.js
Page({
  data: {
    wd: '',
    controlBtn: '取消'
  },
  onSearchAction() {
    if (this.data.controlBtn === '搜索') {
      wx.showToast({
        title: '搜索功能即将上线...',
        icon: 'none'
      })
    } else {
      wx.navigateBack()
    }
  },
  onSearchChange(event) {
    if (event.detail !== '') {
      this.setData({
        controlBtn: '搜索'
      })
    } else {
      this.setData({
        controlBtn: '取消'
      })
    }
  }
})