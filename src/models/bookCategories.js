import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';
import Books from './books';
import Categories from './categories';

class BookCategories extends Model { }

BookCategories.init(
    {
        bookId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: { model: Books, key: 'id' },
        },
        categoryId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: { model: Categories, key: 'id' },
        },
    },
    {
        sequelize,
        tableName: 'book_categories',
        modelName: 'book_categories',
    },
);

Books.belongsToMany(Categories, { through: BookCategories, as: 'categories', foreignKey: 'bookId', onDelete: 'CASCADE' });
Categories.belongsToMany(Books, { through: BookCategories, as: 'books', foreignKey: 'categoryId' });

export default BookCategories;