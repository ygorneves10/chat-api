import { Sequelize, sequelize } from "./connect"

const users = sequelize.define('users', {
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

users.sync()