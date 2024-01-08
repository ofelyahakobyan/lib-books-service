import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';
import Books from './books';

class Files extends Model {}

Files.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    bookId: { type: DataTypes.BIGINT, unique:true },
    coverXS:{ type: DataTypes.STRING },
    coverS: { type: DataTypes.STRING },
    coverM: { type: DataTypes.STRING },
    coverL: { type: DataTypes.STRING },
    previewPDF: { type: DataTypes.STRING },
    fullPDF: { type: DataTypes.STRING },
    audio: { type: DataTypes.STRING },
  },

  {
    sequelize,
    tableName: 'files',
    modelName: 'files',
  },
);

export default Files;

Files.belongsTo(Books, { foreignKey: 'bookId', onDelete: 'CASCADE' });
Books.hasOne(Files, { foreignKey: 'bookId', as: 'bookFiles' });
