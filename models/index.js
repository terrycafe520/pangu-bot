const path = require('path')
const Sequelize = require('sequelize')

const db = new Sequelize('pangu', null, null, {
  dialect: 'sqlite',
  storage: path.join(ROOT, 'db.sqlite')
})

const User = require('./user')(db)
const Chat = require('./chat')(db)
const ChatUser = require('./chat-user')(db)

User.belongsToMany(Chat, through: ChatUser)

module.exports = {
  db, User, Chat, ChatUser
}
