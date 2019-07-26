import { GetAllCategorys } from "../../api/category.js"

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  data: {
    categoryList: []
  },
  attached() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.getCategoryList()
  },
  methods: {
    getCategoryList() {
      wx.showLoading({
        title: '加载中',
      })
      GetAllCategorys({ getCount: true }).then(res => {
        this.setData({
          categoryList: res.data
        })
      }).finally(() => {
        wx.hideLoading()
      })
    },
    onCardTab(event) {
      let keyword = event.currentTarget.dataset.categoryname;
      wx.navigateTo({
        url: '/pages/category-detail/index?keyword=' + keyword,
      })
    }
  }
})
