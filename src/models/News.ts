import { Model, DataTypes, UUIDV4 } from "sequelize";
import db from "../database/index";
import Category from "./Category";
import User from "./User";


export interface INews {
  id?: string;
  slug?: string;
  url?: string;
  thumbnail: string;
  title: string;
  content: string;
  categoryId?: number;
  category?: string;
  categoryPath?: string;
  userId?: string
  createdAt?: Date;
  updatedAt?: Date;
}

interface NewsInstance extends Model<INews>, INews { }


const News = db.sequelize.define<NewsInstance>(
  'news', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  slug: {
    type: DataTypes.STRING,
    unique: true
  },
  url: {
    type: DataTypes.STRING,
    unique: true
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
});

News.belongsTo(User);
User.hasMany(News);

News.belongsTo(Category);
Category.hasMany(News);

function slugify(str) {
  var map = {
    '-': ' ' || '_',
    'a': 'á|à|ã|â|À|Á|Ã|Â',
    'e': 'é|è|ê|É|È|Ê',
    'i': 'í|ì|î|Í|Ì|Î',
    'o': 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
    'u': 'ú|ù|û|ü|Ú|Ù|Û|Ü',
    'c': 'ç|Ç',
    'n': 'ñ|Ñ'
  };

  for (var pattern in map) {
    str = str.replace(new RegExp(map[pattern], 'g'), pattern);
  };

  return str;
};

News.beforeSave(async (news, options) => {
  const newId = slugify(news.title).toLowerCase();
  news.slug = newId;
});


export default News;