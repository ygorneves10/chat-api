const dotenv = require('dotenv');

dotenv.config();

export const Sequelize = require("sequelize")
export const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.TYPE
})