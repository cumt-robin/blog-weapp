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
          bubbles: true,
          composed: true
        }
      )
    },
    replyItem(e) {

    },
    onConfirmReply(e) {

    }
  }
})
