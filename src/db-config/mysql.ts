import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('deliveroo', 'root', '12345678', {
  host: 'localhost',
  dialect: 'mysql',
})

export default sequelize
