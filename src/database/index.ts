import Sequelize from 'sequelize'
import path from 'path'

const env = process.env.NODE_ENV || 'development'
const config = require(path.join(`${__dirname}/../config/database`))[env]

const sequelize = new Sequelize.Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    logging: false
    }
)

const db = {
  sequelize,
  Sequelize,
}

export default db