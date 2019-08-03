import Toast from '../../utils/toast.js'

const app = getApp()

let toPage;

Page({
  data: {

  },
  onLoad(query) {
    toPage = query.to
  },
  onGetUserinfo(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
    } else {
      Toast.simple('取消了授权')
    }
    wx.navigateBack()
  }
})