import { Model, DataTypes } from 'sequelize'
import sequelize from '../db-config/mysql'
import Restaurant from './restaurant.model'

class DishCategory extends Model {
  public id!: number
  public name!: string
  public restaurantId!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

DishCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Restaurant,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'DishCategory',
    timestamps: true,
    underscored: true,
  },
)

export default DishCategory
