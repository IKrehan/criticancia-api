import { Model, DataTypes } from "sequelize";
import db from "../database/index";


export interface ICategory {
  id?: string;
  title: string;
  path: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryInstance extends Model<ICategory>, ICategory {}


const Category = db.sequelize.define<CategoryInstance>(
  'categories', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
        type: DataTypes.STRING
    },
    path: {
        type: DataTypes.STRING
    },
  });


export default Category;