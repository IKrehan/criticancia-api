import { Model, DataTypes, UUIDV4 } from "sequelize";
import db from "../database/index";
import bcrypt from 'bcrypt';


export interface IUser {
  id?: string;
  image?: string;
  name: string;
  email: string;
  password: string;
  is_adm: boolean;
  api_token: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserInstance extends Model<IUser>, IUser {}


const User = db.sequelize.define<UserInstance>(
  'users', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    image: {
        type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_adm: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    api_token: {
        type: DataTypes.STRING,
        unique: true
    }
  });


  User.beforeCreate(async (user, options) => {
    const hashedPassword = (await bcrypt.hash(user.password, 10)).toString();
    user.password = hashedPassword;
  });

export default User;