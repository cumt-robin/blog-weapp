const moment = require('../../lib/moment.min.js')

import { GetCommentPeopleNum, GetCommentPage, GetCommentTotal, AddComment } from "../../api/comment.js"

import { AddReply } from "../../api/reply.js"

import Toast from '../../utils/toast.js'

import { throttle } from "weapp-utils"

const app = getApp();

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

// type为1代表是留言，type为2代表是回复
let type;

let comment_id;

let parent_id = null;


Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  data: {
    userCount: 0,
    commentTotal: 0,
    pageNo: 1,
    pageSize: 5,
    comments: [],
    total: 0,
    showTextarea: false,
    dialogTitle: '留言',
    placeholder: '请输入留言',
    content: '',
    isShowScrollIcon: false,
    direction: 'down',
    scrollTopVal: 0,
    acceptEmail: true
  },
  lifetimes: {
    attached() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
      this.getUserCount()
      this.getCommentTotal()
      this.getCommentList()
    },
    ready() {
      this.getContainerHeight();
    }
  },
  methods: {
    getContainerHeight() {
      const selectQuery = this.createSelectorQuery()
      selectQuery.select('.view-scroll').boundingClientRect()
      selectQuery.exec(function(res){
        containerHeight = res[0].height;
      })
    },
    onScroll(e) {
      scrollThrottle(() => {
        let direction = e.detail.scrollTop > lastScrollVal ? 'down' : 'up'
        lastScrollVal = e.detail.scrollTop;
        let currScrollTop = e.detail.scrollTop
        // 预留50px，进入临界区时，自动调整方向
        if (currScrollTop <= 50) {
          direction = 'down'
        } else if (currScrollTop >= scrollMax - 50 && this.data.comments.length === this.data.total) {
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
    setHideTimer() {
      this.clearHideTimer();
      hideTimer = setTimeout(() => {
        this.setData({
          isShowScrollIcon: false
        })
      }, 5000)
    },
    clearHideTimer() {
      if (hideTimer) {
        clearTimeout(hideTimer)
      }
    },
    scrollJump() {
      if (this.data.direction === 'down') {
        // 如果当前滑动方向是向下，设置scrollTop的值为scrollMax
        let data = { scrollTopVal: scrollMax }
        if (this.data.comments.length === this.data.total) {
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
    /**
     * @description 更新内容区域真实高度
     */
    updateContentHeight() {
      const selectQuery = this.createSelectorQuery()
      selectQuery.select('.mt-navbar').boundingClientRect()
      selectQuery.exec(function(res){
        contentHeight = res[0].height;
        scrollMax = contentHeight - containerHeight;
      })
    },
    getUserCount() {
      GetCommentPeopleNum().then(res => {
        this.setData({
          userCount: res.data
        })
      })
    },
    getCommentTotal() {
      GetCommentTotal().then(res => {
        this.setData({
          commentTotal: res.data
        })
      })
    },
    getCommentList(isLoadMore = false) {
      wx.showLoading({
        title: '加载中',
      })
      GetCommentPage({
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize
      }).then(res => {
        let newComments = res.data.map(item => {
          return {
            ...item,
            time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
            replies: item.replies.map(reply => {
              return {
                ...reply,
                time: moment(reply.create_time).fromNow(),
              }
            })
          }
        })
        let data;
        if (isLoadMore) {
          data = {
            comments: this.data.comments.concat(newComments),
            total: res.total
          }
        } else {
          data = {
            comments: newComments,
            total: res.total
          }
        }
        this.setData(data);
        this.updateContentHeight();
      }).finally(() => {
        wx.hideLoading()
      })
    },
    loadMore() {
      if (this.data.comments.length < this.data.total) {
        this.setData({
          pageNo: this.data.pageNo + 1
        })
        this.getCommentList(true)
      }
    },
    onScrollToLower() {
      this.loadMore()
    },
    onShowComment() {
      if (!app.globalData.userInfo) {
        return this.gotoAuthorize()
      }
      type = 0;
      this.setData({
        showTextarea: true,
        dialogTitle: '留言',
        placeholder: '请输入留言'
      })
    },
    onAcceptEmailChange(e) {
      console.log(e)
    },
    onShowReply(e) {
      if (!app.globalData.userInfo) {
        return this.gotoAuthorize()
      }
      type = e.detail.type;
      comment_id = e.detail.comment_id
      parent_id = e.detail.parent_id || null
      this.setData({
        showTextarea: true,
        dialogTitle: '回复',
        placeholder: '请输入回复'
      })
    },
    gotoAuthorize() {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
    },
    onCancel() {
      this.setData({
        showTextarea: false,
        content: ''
      })
    },
    onInput(e) {
      this.setData({
        content: e.detail
      })
    },
    onConfirmReply() {
      if (!this.data.content) {
        Toast.simple('您还未输入内容')
        this.selectComponent('#van-dialog').stopLoading()
      } else {
        let params;
        const userInfo = app.globalData.userInfo
        if (type === 0) {
          // 发起留言
          params = {
            approved: 0,
            nick_name: userInfo.nickName,
            avatar: userInfo.avatarUrl,
            device: app.globalData.systemInfo.model,
            content: this.data.content
          }
          return AddComment(params).then(res => {
            this.setData({
              showTextarea: false,
              pageNo: 1,
              content: ''
            })
            this.getCommentList();
            Toast.simple('留言成功，请耐心等待审核')
          })
        } else if (type === 1) {
          params = {
            approved: 0,
            nick_name: userInfo.nickName,
            avatar: userInfo.avatarUrl,
            device: app.globalData.systemInfo.model,
            content: this.data.content,
            comment_id
          }
        } else {
          params = {
            approved: 0,
            nick_name: userInfo.nickName,
            avatar: userInfo.avatarUrl,
            device: app.globalData.systemInfo.model,
            parent_id,
            content: this.data.content,
            comment_id
          }
        }
        AddReply(params).then(res => {
          this.setData({
            showTextarea: false,
            pageNo: 1,
            content: ''
          })
          this.getCommentList();
          Toast.simple('回复成功，请耐心等待审核')
        })
      }
    }
  }
})
