const Toast = {
  native: function (option) {
    wx.showToast(option)
  },
  simple: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'none'
    })
  },
  success: function(msg = '操作成功') {
    // this.custom(msg, 'success')
    wx.showToast({
      title: msg
    })
  },
  error: function (msg = '出错了，请稍后重试') {
    this.simple(msg)
  },
  custom: function(msg, imageName) {
    wx.showToast({
      title: msg,
      image: '/assets/img/' + imageName + '.svg'
    })
  }
}

export default Toast
