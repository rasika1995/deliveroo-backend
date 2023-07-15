import { Model, DataTypes } from 'sequelize'
import sequelize from '../db-config/mysql'

export class Restaurant extends Model {
  public id!: number
  public name!: string
  public description!: string | null
  public address!: string
  public city!: string
  public state!: string
  public postal_code!: string
  public phone!: string
  public website!: string | null
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

Restaurant.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Restaurant',
    timestamps: true,
    underscored: true,
  },
)

export default Restaurant
