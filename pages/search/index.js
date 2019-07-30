import Toast from "../../utils/toast.js"

Page({
  data: {
    wd: '',
    controlBtn: '取消'
  },
  onSearchAction() {
    if (this.data.controlBtn === '搜索') {
      Toast.simple('搜索功能即将上线')
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