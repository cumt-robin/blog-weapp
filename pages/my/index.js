import Toast from '../../utils/toast.js'

const app = getApp()

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  data: {
    userInfo: null
  },
  lifetimes: {
    attached() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
      // 获取授权信息是异步的，这里再setData一下
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
  },
  methods: {
    onClickCell(e) {
      switch (e.target.dataset.type) {
        case 'comment':
        case 'msg':
          Toast.simple('程序猿小哥哥加班玩命中')
          break
      }
    }
  }
})
