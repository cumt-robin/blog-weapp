const app = getApp()

Page({
  data: {
    isIphonex: app.globalData.isIphonex,
    list: [
      { icon: '/assets/img/wechat.svg', label: '微信号', content: 'ice_lloly' },
      { icon: '/assets/img/subscribe.svg', label: '订阅号', content: '大前端技术沙龙' },
      { icon: '/assets/img/email.svg', label: '邮箱', content: 'cumtrobin@163.com' },
      { icon: '/assets/img/csdn.svg', label: 'CSDN', content: 'blog.csdn.net/weixin_41196185' },
      { icon: '/assets/img/web.svg', label: 'Web版', content: 'blog.wbjiang.cn' }
    ]
  },
  copy(e) {
    wx.setClipboardData({
      data: e.target.dataset.content,
      success(res) {
        wx.showToast({
          title: '复制成功'
        })
      }
    })
  }
})