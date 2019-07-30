import Toast from '../../utils/toast.js'

import { GetArticlePage } from '../../api/article.js'
import { GetWeappBanners } from '../../api/banner.js'
import { debounce } from '../../utils/index.js'

const app = getApp();

const focusDebounce = debounce(fc => {
  fc()
}, 100, true)

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    userInfo: {
      type: Object
    }
  },
  data: {
    pageNo: 1,
    pageSize: 6,
    wd: '',
    articles: [],
    total: 0,
    banners: [],
    isIphonex: app.globalData.isIphonex
  },
  lifetimes: {
    attached() {
      this.getBannerList()
      this.getArticlePage();
    }
  },
  methods: {
    getBannerList() {
      GetWeappBanners().then(res => {
        this.setData({
          banners: res.data
        })
      })
    },
    getArticlePage(isLoadMore = false) {
      wx.showLoading({
        title: '加载中',
      })
      GetArticlePage({
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize
      }).then(res => {
        let data;
        if (isLoadMore) {
          data = {
            articles: this.data.articles.concat(res.data),
            total: res.total
          }
        } else {
          data = {
            articles: res.data,
            total: res.total
          }
        }
        this.setData(data);
      }).finally(() => {
        wx.hideLoading()
      })
    },
    onSearchFocus() {
      focusDebounce(() => {
        wx.navigateTo({
          url: '/pages/search/index'
        })
      })
    },
    onScrollToLower(event) {
      this.loadMore()
    },
    loadMore() {
      if (this.data.articles.length < this.data.total) {
        this.setData({
          pageNo: this.data.pageNo + 1
        })
        this.getArticlePage(true)
      }
    },
    onTabChange(index, title) {
      console.log(index, title)
    },
    onClickDisabledTab(index, title) {
      console.log(index, title)
      Toast.simple('功能即将开放...')
    }
  }
})
