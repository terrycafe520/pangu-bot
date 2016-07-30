const path = require('path')
const Sequelize = require('sequelize')

const db = new Sequelize('pangu', null, null, {
  dialect: 'sqlite',
  pool: {
    max: 100,
    min: 0,
    idle: 10000
  },
  storage: path.join(ROOT, 'db.sqlite')
})

const User = require('./user')(db)
const Chat = require('./chat')(db)
const ChatUser = require('./chat-user')(db)

User.belongsToMany(Chat, { through: ChatUser })
Chat.belongsToMany(User, { through: ChatUser })

if (process.env.SYNC_DATABASE) {
  User.sync({ force: true })
  Chat.sync({ force: true })
  ChatUser.sync({ force: true })
}

module.exports = {
  db, User, Chat, ChatUser
}
