import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';
import Books from './books';

class Carts extends Model { }

Carts.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: 'compositeIndex'
        },
        bookId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: 'compositeIndex'
        },
    },
    {
        sequelize,
        tableName: 'carts',
        modelName: 'carts',
    },
);

Carts.belongsTo(Books, { foreignKey: 'bookId', onDelete: 'CASCADE', onUpdate: 'CASCADE', as: 'book' });
Books.hasMany(Carts, { foreignKey: 'bookId', onDelete: 'CASCADE', as: 'cartItems' });

export default Carts;