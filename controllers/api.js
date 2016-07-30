const { Router } = require('express')
const request = require('request')
const pangu = require('pangu')

const router = Router()

const SAY_HELLOS = [
  '空格之神顯靈了！',
  '空格之神準備好了！',
  '空格之神這不是來了嗎！',
  '空格之神給您拜個晚年',
  '空格之神 到此一遊',
  '空格之神 在此！',
  '空格之神 參見！',
  '空格之神 參上！',
  '空格之神 參戰！',
  '空格之神 登場！',
  '空格之神 來也！',
  '空格之神 來囉！',
  '空格之神 駕到！',
  '空格之神 報到！',
  '空格之神 合流！',
  '空格之神 久違了',
  '空格之神 作用中',
  '空格之神 接近中',
  '空格之神 小別勝新婚',
  '空格之神 姍姍來遲',
  '空格之神 完美落地',
  '空格之神 粉墨登場！',
  '空格之神 颯爽登場！',
  '空格之神 強勢登場！',
  '空格之神 強勢回歸！',
  '空格之神 在此聽候差遣',
  '空格之神 射出！',
  '空格之神：寶傑好，大家好，各位觀眾朋友晚安',
  '空格之神：歐啦歐啦歐啦歐啦歐啦',
  '空格之神：你知不知道什麼是噹噹噹噹噹噹噹？',
  '空格之神：悄悄的我走了，正如我悄悄的來',
  '有請...... 空格之神！',
  '遭遇！野生的空格之神！',
  '就決定是你了！空格之神！',
  '正直、善良和空格都回來了'
]

function getHello() {
  return SAY_HELLOS[parseInt(Math.random() * SAY_HELLOS.length)]
}

router.post('/', (req, res) => {
  const message = req.body.message || req.body.edited_message
  if (!message.text)
    return res.json({ code: -1 })
  // Pangu it
  const panguText = pangu.spacing(message.text)
  if (message.text !== panguText) {
    const reply = `
<b>${getHello()}！請跟我讀：</b>
${panguText}
`
    request.post({
      uri: `${API_URL}/sendMessage`,
      form: {
        chat_id: message.chat.id,
        text: reply,
        parse_mode: 'HTML',
        reply_to_message_id: message.message_id
      }
    }, (err, response, body) => {
      if (err) { console.error('[ERROR] Send Message', err) }
      console.log(body)
    })
  }
  return res.json({ code: 0 })
})

module.exports = router
