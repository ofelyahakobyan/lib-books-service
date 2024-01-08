import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';

class Languages extends Model {
}

Languages.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        language: {
            type: DataTypes.STRING,
            unique: 'language',
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'languages',
        modelName: 'languages',
    },
);

export default Languages;