import { Model, DataTypes } from 'sequelize';
import sequelize from '../db-config/mysql';
import Restaurant from './restaurant.model';

class DishCategory extends Model {
  public id!: number;
  public name!: string;
  public restaurant_id!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
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
    restaurant_id: {
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
);

export default DishCategory;
