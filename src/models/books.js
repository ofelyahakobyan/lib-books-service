import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';
import Authors from './authors';
import Languages from './languages';

class Books extends Model { }

Books.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        authorId: {
            type: DataTypes.BIGINT,
            allowNull:false
        },
        price: { type: DataTypes.DOUBLE },
        description: { type: DataTypes.TEXT },
        coverM: { type: DataTypes.STRING },
        languageId: { type: DataTypes.INTEGER.UNSIGNED, allowNull:false },
        lang: { type: DataTypes.STRING },
        audio: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        status: {
            type: DataTypes.ENUM('available', 'unavailable', 'upcoming'),
            defaultValue: 'available',
            allowNull: false,
        },
        new: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        popular: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        bestseller: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    },
    {
        sequelize,
        tableName: 'books',
        modelName: 'books',
    },
);

Books.belongsTo(Authors, { foreignKey: 'authorId', as: 'author' });
Authors.hasMany(Books, { foreignKey: 'authorId', as: 'books' });

Books.belongsTo(Languages, { foreignKey: 'languageId', as: 'language' });
Languages.hasMany(Books, { foreignKey: 'languageId', as: 'languages' });

export default Books;