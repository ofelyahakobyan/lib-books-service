import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';

class Authors extends Model { }


Authors.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: { type: DataTypes.STRING },
        bio: { type: DataTypes.TEXT },
        dob: { type: DataTypes.DATEONLY },
        avatar: { type: DataTypes.STRING },
        avatarSmall: { type: DataTypes.STRING },
        fullName: {
            type: DataTypes.VIRTUAL,
            get() {
                if (!this.lastName) {
                    return this.firstName;
                }
                return `${this.firstName} ${this.lastName}`;
            },
            set(value) {
                throw new Error('Do not try to set the `fullName` value!');
            },
        },
    },
    {
        sequelize,
        tableName: 'authors',
        modelName: 'authors',
    },
);

export default Authors;