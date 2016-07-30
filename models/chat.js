const Sequelize = require('sequelize')

module.exports = function (db) {
  db.define('chat', {
    id: { type: Sequelize.INTEGER },
    title: { type: Sequelize.STRING }
  })
}
