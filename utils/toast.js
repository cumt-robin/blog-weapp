const Toast = {
  native: function (option) {
    wx.showToast(option)
  },
  success: function(msg = '操作成功') {
    this.custom(msg, 'success')
  },
  error: function (msg = '出错了，请稍后重试') {
    this.custom(msg, 'error')
  },
  custom: function(msg, imageName) {
    wx.showToast({
      title: msg,
      icon: 'none',
      image: `/assets/img/${imageName}.svg`
    })
  }
}

export default Toast
