import { GetAllCategorys } from "../../api/category.js"

const app = getApp();

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  data: {
    isLoading: true,
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
      GetAllCategorys({ getCount: true })
        .then(res => {
          this.setData({
            isLoading: false,
            categoryList: res.data
          })
          wx.hideLoading()
        })
        .catch(failure => {
          this.setData({
            isLoading: false
          })
          wx.hideLoading()
        })
    },
    onCardTab(event) {
      let keyword = event.currentTarget.dataset.categoryname;
      wx.navigateTo({
        url: '/pages/category-detail/index?keyword=' + keyword,
      })
    },
    onScrollToLower() {}
  }
})
