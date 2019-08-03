// components/card-comment/index.js
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    comment: {
      type: Object
    }
  },
  methods: {
    replyRoot(e) {
      this.triggerEvent(
        'showReply',
        {
          type: 1,
          comment_id: e.target.dataset.commentid
        },
        {
          bubbles: true
        }
      )
    },
    replyItem(e) {
      this.triggerEvent(
        'showReply',
        {
          type: 2,
          comment_id: e.target.dataset.commentid,
          parent_id: e.target.dataset.parentid
        },
        {
          bubbles: true
        }
      )
    },
    onConfirmReply(e) {

    }
  }
})
