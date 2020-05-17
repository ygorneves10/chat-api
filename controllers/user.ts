import { Sequelize, sequelize } from "./connect"

interface User {
    name: String
    email: String
    username: String
}

interface UserUpdate {
    name?: String
    email?: String
    username?: String
}

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

const crud = {
    create: function (attributes: User): Promise<User> {
        return users.create(attributes)
    },
    read: function (email: String): Promise<User> {
        return users.findOne({ where: { email } })
    },
    readAll: function (): Promise<Array<User>> {
        return users.findAll()
    },
    update: function (id: Number, attributes: UserUpdate): Promise<Number> {
        return users.update(attributes, { where: { id } })
    },
    delete: function (id: Number): Promise<Number> {
        return users.destroy({ where: { id } })
    }
}

export const userController = {
    getAllUsers: function (req: any, res: any) {
        crud.readAll().then(response => {
            res.json({
                success: true,
                users: response
            })
        }).catch((error: Object) => {
            res.json({
                success: false,
                error
            })
        })
    },
    getUser: function (req: any, res: any) {
        const { email } = req.query

        crud.read(email).then((response: Object) => {
            res.json({
                success: true,
                user: response
            })
        }).catch((error: Object) => {
            res.json({
                success: false,
                error
            })
        })
    },
    deleteUser: function (req: any, res: any) {
        const { id } = req.params

        crud.delete(id).then((response: Object) => {
            res.json({
                success: true,
                user: response
            })
        }).catch((error: Object) => {
            res.json({
                success: false,
                error
            })
        })
    },
    sendUser: function (req: any, res: any) {
        const { id, email, name, username } = req.body

        if (id) {
            const updateAttributes: UserUpdate = {}

            if (email) {
                updateAttributes.email = email
            }

            if (name) {
                updateAttributes.name = name
            }

            if (username) {
                updateAttributes.username = username
            }

            return crud.update(id, updateAttributes).then((response: Object) => {
                res.json({
                    success: true,
                    user: response
                })
            }).catch((error: Object) => {
                res.json({
                    success: false,
                    error
                })
            })
        }

        const createAttributes: User = {
            email, name, username
        }

        return crud.create(createAttributes).then(response => {
            res.json({
                success: true,
                user: response
            })
        }).catch((error: Object) => {
            res.json({
                success: false,
                error
            })
        })

    }
};