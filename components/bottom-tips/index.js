// components/bottom-tips/index.js
Component({
  properties: {
    content: {
      type: String
    },
    customClass: {
      type: String
    },
    top: {
      type: String,
      value: '15px'
    },
    bottom: {
      type: String,
      value: '15px'
    },
    fontSize: {
      type: String
    },
    line: {
      type: Boolean,
      value: true
    }
  }
})
