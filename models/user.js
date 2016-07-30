const Sequelize = require('sequelize')

module.exports = function (db) {
  db.define('user', {
    id: { type: Sequelize.INTEGER },
    firstName: { type: Sequelize.STRING },
    lastName: { type: Sequelize.STRING },
    username: { type: Sequelize.STRING },
    count: { type: Sequelize.INTEGER }
  })
}
