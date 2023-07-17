import { DataTypes, Model } from 'sequelize';
import sequelize from '../db-config/mysql';

export class Users extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'Users', // Specify the table name as "Users"
    modelName: 'Users',
    timestamps: true,
    underscored: true,
  },
);

export default Users;
