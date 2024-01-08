import {Sequelize, Op} from 'sequelize';

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_NAME } = process.env;

const operatorsAliases = {
  $and: Op.and,
  $or: Op.or,
  $not: Op.not,
  $gte: Op.gte,
  $lte: Op.lte,
  $eq: Op.eq,
  $like: Op.like,
  $iLike:Op.iLike,
  $in: Op.in,
  $contains: Op.contains,
  $is: Op.is,
};
const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    operatorsAliases,
    dialect: 'postgres',
});


export default sequelize;