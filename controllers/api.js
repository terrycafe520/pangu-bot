const { Router } = require('express')
const request = require('request')
const pangu = require('pangu')

const router = Router()
router.post('/', (req, res) => {
  const message = req.body.message || req.body.edited_message
  if (!message.text)
    return res.json({ code: -1 })
  // Pangu it
  const panguText = pangu.spacing(message.text)
  if (message.text !== panguText) {
    request.post({
      uri: `${API_URL}/sendMessage`,
      form: {
        chat_id: message.chat.id,
        text: panguText,
        reply_to_message_id: message.message_id
      }
    }, (err, response, body) => {
      if (err) { console.error('[ERROR] Send Message', err) }
    })
  }
  return res.json({ code: 0 })
})

module.exports = router
