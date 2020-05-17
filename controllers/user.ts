import { Sequelize, sequelize } from './connect'
import { mainController } from "./main"

export interface User {
    name: String
    email: String
    username: String
    password: String
}

interface UserUpdate {
    name?: String
    email?: String
    username?: String
    password?: String
}

export const users = sequelize.define('users', {
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
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
    }
});

export const userController = {
    getAll: (): Promise<Array<User>> => users.findAll(),
    create: async (attributes: User): Promise<User> => users.create({ ...attributes, password: await mainController.bcryptPassword(attributes.password) }),
    read: (email: String): Promise<User> => users.findOne({ where: { email } }),
    delete: (id: Number): Promise<Number> => users.destroy({ where: { id } }),
    update: async (id: Number, attributes: UserUpdate): Promise<Number> => {
        if (attributes.password) {
            attributes.password = await mainController.bcryptPassword(attributes.password)
        }

        return users.update(attributes, { where: { id } })
    }
}
