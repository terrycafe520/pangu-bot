const Sequelize = require('sequelize')

module.exports = (db) => (
  db.define('user', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    firstName: { type: Sequelize.STRING },
    lastName: { type: Sequelize.STRING },
    username: { type: Sequelize.STRING },
    count: { type: Sequelize.INTEGER, defaultValue: 0 }
  })
)
