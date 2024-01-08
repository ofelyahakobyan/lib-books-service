import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';
import Books from './books';

class Reviews extends Model { }

// If a user already has a review, then he can update, otherwise he can create a new one
Reviews.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        bookId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: 'compositeIndex',
        },
        userId: { type: DataTypes.BIGINT, unique: 'compositeIndex' },
        title: { type: DataTypes.STRING },
        content: { type: DataTypes.TEXT },
        rating: { type: DataTypes.INTEGER },
    },
    {
        sequelize,
        tableName: 'reviews',
        modelName: 'reviews',
    },
);

Reviews.belongsTo(Books, { foreignKey: 'bookId', onDelete: 'CASCADE', as: 'book' });
Books.hasMany(Reviews, { foreignKey: 'bookId', onDelete: 'CASCADE', as: 'reviews' });

export default Reviews;