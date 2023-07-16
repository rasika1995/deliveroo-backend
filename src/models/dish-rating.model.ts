import { Model, DataTypes } from 'sequelize';
import sequelize from '../db-config/mysql';
import Dish from './dish.model';

class DishRating extends Model {
  public id!: number;
  public dish_id!: number;
  public customer_name!: string;
  public rating!: number;
  public comment!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

DishRating.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dish_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Dish,
        key: 'id',
      },
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'DishRating',
    timestamps: true,
    underscored: true,
  },
);

export default DishRating;
