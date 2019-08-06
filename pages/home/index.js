import Toast from '../../utils/toast.js'

import { GetArticlePage } from '../../api/article.js'
import { GetWeappBanners } from '../../api/banner.js'
import { debounce, throttle } from '../../utils/index.js'

// 监听获得焦点防抖
const focusDebounce = debounce(fc => {
  fc()
}, 100, true)

// 监听滚动节流
const scrollThrottle = throttle(func => func(), 100, { trailing: true })

// 容器高度
let containerHeight = 0;

// 内容高度
let contentHeight = 0;

// 最近一次的scrollTop值
let lastScrollVal = 0;

// 自动隐藏定时器
let hideTimer = null;

// 最大的scrollTop值
let scrollMax = 0;

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
    isShowScrollIcon: false,
    direction: 'down',
    scrollTopVal: 0
  },
  lifetimes: {
    attached() {
      this.getBannerList()
      this.getArticlePage();
    },
    ready() {
      this.getContainerHeight();
    }
  },
  methods: {
    /**
     * @description 获取容器的真实高度
     */
    getContainerHeight() {
      const selectQuery = this.createSelectorQuery()
      selectQuery.select('.view-scroll').boundingClientRect()
      selectQuery.exec(function(res){
        containerHeight = res[0].height;
      })
    },
    /**
     * @description 监听scroll-view组件的滚动事件
     */
    onScroll(e) {
      scrollThrottle(() => {
        let direction = e.detail.scrollTop > lastScrollVal ? 'down' : 'up'
        lastScrollVal = e.detail.scrollTop;
        let currScrollTop = e.detail.scrollTop
        // 预留50px，进入临界区时，自动调整方向
        if (currScrollTop <= 50) {
          direction = 'down'
        } else if (currScrollTop >= scrollMax - 50 && this.data.articles.length === this.data.total) {
          // 底部判断要特殊一点，因为可能数据未加载完
          direction = 'up'
        }
        this.setData({
          isShowScrollIcon: true,
          direction
        })
        this.setHideTimer();
      })
    },
    /**
     * @description 设置自动隐藏定时器，5s
     */
    setHideTimer() {
      this.clearHideTimer();
      hideTimer = setTimeout(() => {
        this.setData({
          isShowScrollIcon: false
        })
      }, 5000)
    },
    /**
     * @description 清除自动隐藏定时器
     */
    clearHideTimer() {
      if (hideTimer) {
        clearTimeout(hideTimer)
      }
    },
    /**
     * @description 滚动至顶部或底部
     */
    scrollJump() {
      if (this.data.direction === 'down') {
        // 如果当前滑动方向是向下，设置scrollTop的值为scrollMax
        let data = { scrollTopVal: scrollMax }
        if (this.data.articles.length === this.data.total) {
          // 如果数据已经加载完毕，最后调整滑动方向为up
          data.direction = 'up'
        }
        this.setData(data)
      } else {
        // 如果当前滑动方向是向上
        this.setData({
          scrollTopVal: 0,
          direction: 'down'
        })
      }
    },
    getBannerList() {
      GetWeappBanners().then(res => {
        this.setData({
          banners: res.data
        })
        this.updateContentHeight();
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
        this.updateContentHeight();
      }).finally(() => {
        wx.hideLoading()
      })
    },
    /**
     * @description 更新内容区域真实高度
     */
    updateContentHeight() {
      const selectQuery = this.createSelectorQuery()
      selectQuery.select('.content-wrap').boundingClientRect()
      selectQuery.exec(function(res){
        contentHeight = res[0].height;
        scrollMax = contentHeight - containerHeight;
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
