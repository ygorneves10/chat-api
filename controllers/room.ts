import { Sequelize, sequelize } from './connect'
import { users } from "./user"
import { mainController } from "./main"

export interface Room {
    name: String
    slug?: String
    ownerId: Number
    password?: String
}

interface RoomUpdate {
    name?: String
    slug?: String
    password?: String
}

interface SlugReturn {
    exists: Boolean
    suggestion?: String
}

export const rooms = sequelize.define('rooms', {
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false
    }
});

rooms.belongsTo(users, {
    foreignKey: {
        name: 'ownerId',
        references: {
            field: 'id'
        },
        allowNull: false
    }
})

export const roomController = {
    getAll: (): Promise<Array<Room>> => rooms.findAll(),
    read: (slug: String): Promise<Room> => rooms.findOne({ where: { slug } }),
    update: (id: Number, attributes: RoomUpdate): Promise<Array<Number>> => rooms.update(attributes, { where: { id } }),
    delete: (id: Number): Promise<Array<Number>> => rooms.destroy({ where: { id } }),
    create: async (roomData: Room): Promise<Room> => {
        const { name, password, slug } = roomData

        roomData.slug = slug ? mainController.generateSlug(slug) : mainController.generateSlug(name)

        const { exists, suggestion } = await roomController.verifySlug(roomData.slug)

        if (exists) {
            roomData.slug = suggestion
        }

        if (password) {
            roomData.password = await mainController.bcryptPassword(password)
        }

        return rooms.create(roomData)
    },
    verifySlug: async (slug: String): Promise<SlugReturn> => {
        const slugExists = await roomController.read(slug)
        const suggestion = slug + "_" + Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);

        return slugExists ? { exists: true, suggestion } : { exists: false }
    }
};