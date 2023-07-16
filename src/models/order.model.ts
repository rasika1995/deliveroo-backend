import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../db-config/mysql';
import OrderItem from './order-items.model';
import Restaurant from './restaurant.model';

export class Orders extends Model {
  public id!: number;
  public restaurant_id!: number;
  public customer_name!: string;
  public customer_email!: string;
  public status!: string;
  public total_amount?: number;
  public orderItems?: OrderItem[];
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public static associations: {
    orderItems: Association<Orders, OrderItem>;
  };
}

Orders.init(
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
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'delivered'),
      defaultValue: 'pending',
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Orders',
    timestamps: true,
    underscored: true,
  },
);

export default Orders;
