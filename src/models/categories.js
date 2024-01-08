import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';

class Categories extends Model {
}

Categories.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        category: { type: DataTypes.STRING, unique: true },
        parentId: { type: DataTypes.INTEGER.UNSIGNED },
    },
    {
        sequelize,
        tableName: 'categories',
        modelName: 'categories',
    },
);
Categories.hasOne(Categories, { foreignKey: 'parentId', as: 'parent', onDelete: 'CASCADE', onUpdate: 'SET NULL' });

export default Categories;