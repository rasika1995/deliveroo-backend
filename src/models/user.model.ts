import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../db-config/mysql';

export class User extends Model {
  // Fields of the User model
  public id!: number;
  public email!: string;
  public password!: string; // Temporary field for sign-up (not stored in the database)
  public password_hash!: string; // The hashed password will be stored in this field
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Hash the password before saving it to the database
  public async hashPassword() {
    if (this.password) {
      this.password_hash = await bcrypt.hash(this.password, 10);
    }
  }

  // Check if the provided password matches the hashed password
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.VIRTUAL, // This is not stored in the database
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Users',
    modelName: 'User',
    timestamps: true,
    underscored: true,
  },
);

// Before saving the user to the database, hash the password
User.beforeSave(async (user, options) => {
  await user.hashPassword();
});

export default User;
