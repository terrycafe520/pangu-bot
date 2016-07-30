const Sequelize = require('sequelize')

module.exports = (db) => (
  db.define('chat', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    title: { type: Sequelize.STRING }
  })
)
