import { Model, DataTypes } from 'sequelize';
import sequelize from '../db-config/mysql';
import Restaurant from './restaurant.model';
import DishCategory from './dish-category.model';

export class Dish extends Model {
  public id!: number;
  public restaurant_id!: number;
  public category_id!: number;
  public name!: string;
  public description!: string | null;
  public price!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Dish.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Restaurant,
        key: 'id',
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DishCategory,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Dish',
    timestamps: true,
    underscored: true,
  },
);

export default Dish;
