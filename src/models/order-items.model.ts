import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../db-config/mysql';
import Dish from './dish.model';
import Orders from './order.model';

export class OrderItem extends Model {
  public id!: number;
  public order_id!: number;
  public dish_id!: number;
  public quantity!: number;
  public price!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Orders,
        key: 'id',
      },
    },
    dish_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Dish,
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'OrderItem',
    timestamps: true,
    underscored: true,
  },
);

export default OrderItem;
