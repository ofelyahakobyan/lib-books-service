import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';
import Books from './books';

class Wishes extends Model { }

Wishes.init(
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
        tableName: 'wishes',
        modelName: 'wishes',
    },
);

Wishes.belongsTo(Books, { foreignKey: 'bookId', onDelete: 'CASCADE', onUpdate: 'CASCADE', as: 'book' });
Books.hasMany(Wishes, { foreignKey: 'bookId', onDelete: 'CASCADE', as: 'wishItems' });

export default Wishes;