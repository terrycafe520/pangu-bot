const { Router } = require('express')
const request = require('request')
const pangu = require('pangu')
const { User, Chat, ChatUser } = require('../models')

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

function apiRequest(action, options) {
  return new Promise(function (resolve, reject) {
    request.post({
      uri: `${API_URL}/${action}`,
      form: options
    }, (err, response, body) => {
      if (err) { return reject(err) }
      else { return resolve(response) }
    })
  })
}

router.post('/', (req, res) => {
  const message = req.body.message || req.body.edited_message
  if (!message.text)
    return res.json({ code: -1 })
  if (message.text === '/rank@pangu_bot') {
    if (message.chat.type === 'private') {
      User.find({ where: { id: message.from.id } }).then(user => {
        const reply = `${user.firstName} ${user.lastName}(@${user.username}) 一共 <b>${user.count}</b> 次`
        return apiRequest('sendMessage', {
          chat_id: message.chat.id,
          text: reply,
          parse_mode: 'HTML'
        })
      }).catch(err => {
        console.error(err)
      })
    } else {
      Chat.find({ where: { id: message.chat.id } }).then(chat => {
        if (!chat) { return Promise.resolve([]) }
        return chat.getUsers({ order: 'count DESC' })
      }).then(users => {
        const reply = `<b>Rank</b>
${users.map((user, i) => `${i + 1}. ${user.firstName}${user.lastName ? ' ' + user.lastName : ''}(@${user.username}) ${user.count}`).join('\n')}`
        return apiRequest('sendMessage', {
          chat_id: message.chat.id,
          text: reply,
          parse_mode: 'HTML'
        })
      }).catch(err => {
        console.error(err)
      })
    }
    return res.json({ code: 1 })
  }
  // Pangu it
  const panguText = pangu.spacing(message.text)
  if (message.text !== panguText) {
    const reply = `<b>${getHello()}！請跟我讀：</b>
${panguText}`
    // Send reply
    apiRequest('sendMessage', {
      chat_id: message.chat.id,
      text: reply,
      parse_mode: 'HTML',
      reply_to_message_id: message.message_id
    }).then(response => {
      // Update database
      return Promise.all([
      // Get user
        User.find({
          where: { id: message.from.id },
          attribute: ['id']
        }).then(res => {
          if (res) {
            return Promise.resolve(res)
          } else {
            return User.create({
              id: message.from.id,
              username: message.from.username,
              firstName: message.from.first_name,
              lastName: message.from.last_name
            })
          }
        }),
        // Get chat
        Chat.find({
          where: { id: message.chat.id },
          attribute: ['id']
        }).then(res => {
          if (res) {
            return Promise.resolve(res)
          } else {
            return Chat.create({
              id: message.chat.id,
              title: message.chat.title
            })
          }
        })
      ])
    }).then(res => {
      const [user, chat] = res
      return Promise.all([
        user.increment('count', { by: 1 }),
        chat.addUser(user)
      ])
    }).catch(err => {
      console.error(err)
    })
  }
  return res.json({ code: 0 })
})

module.exports = router
