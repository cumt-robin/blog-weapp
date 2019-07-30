const moment = require('../lib/js/moment.min.js')

moment.locale('zh', {
  relativeTime: {
    future: "%s后",
    past: "%s前",
    s: "%d秒",
    m: "1分钟",
    mm: "%d分钟",
    h: "1小时",
    hh: "%d小时",
    d: "一天",
    dd: "%d天",
    M: "一个月",
    MM: "%d月",
    y: "一年",
    yy: "%d年"
  }
})