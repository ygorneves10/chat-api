import { Sequelize, sequelize } from './connect'
import { mainController } from "./main"

export interface User {
    name: String
    email: String
    username: String
    password: String
}

export interface UserLogin {
    email?: String
    username?: String
    password: String
}

export interface LoginResponse {
    valid: Boolean
    error?: String
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
    delete: (id: Number): Promise<Number> => users.destroy({ where: { id } }),
    read: ({ email, username }: UserUpdate): Promise<User> | false => {
        if (!email && !username) {
            return false
        }

        return email ? users.findOne({ where: { email } }) : users.findOne({ where: { username } })
    },
    update: async (id: Number, attributes: UserUpdate): Promise<Number> => {
        if (attributes.password) {
            attributes.password = await mainController.bcryptPassword(attributes.password)
        }

        return users.update(attributes, { where: { id } })
    },
    userLogin: async (loginData: UserLogin): Promise<LoginResponse> => {
        const { email, username, password } = loginData
        const findBy = { email, username }
        const findUser = await userController.read(findBy)

        if (!findUser) {
            return {
                valid: false,
                error: "Can't find user"
            }
        }

        const comparePassword = await mainController.comparePassword(password, findUser.password)

        return comparePassword ? {
            valid: true
        } : {
                valid: false,
                error: "Can't valid password"
            }
    }
}
