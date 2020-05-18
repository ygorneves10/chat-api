import { Sequelize, sequelize } from './connect'
import { users, User } from "./user"
import { rooms } from "./room"

export interface Message {
    text: String
    senderId: Number
    roomId: Number
}

interface MessageUpdate {
    id: Number
    text: String
}

export const messages = sequelize.define('messages', {
    text: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false
    },
    senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false
    },
    roomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false
    }
});

messages.belongsTo(rooms, {
    foreignKey: {
        name: 'roomId',
        references: {
            field: 'id'
        },
        allowNull: false
    }
})

messages.belongsTo(users, {
    foreignKey: {
        name: 'senderId',
        references: {
            field: 'id'
        },
        allowNull: false
    }
})

export const messageController = {
    create: async (roomData: Message): Promise<Object> => {
        const { senderId, text, roomId }: Message = await messages.create(roomData)
        const { name, email, username }: User = await users.findOne({ attributes: ['name', 'email', 'username'] }, { where: { id: senderId } })

        return {
            text,
            roomId,
            senderId,
            name,
            email,
            username
        }
    },
    read: async (room: Number): Promise<Array<Object>> => {
        const messagesArr: Array<Message> = await messages.findAll({ where: { roomId: room } })

        return Promise.all(messagesArr.map(async ({ roomId, senderId, text }) => {
            const { name, email, username }: User = await users.findOne({ attributes: ['name', 'email', 'username'] }, { where: { id: senderId } })

            return {
                text,
                senderId,
                roomId,
                name,
                email,
                username
            }
        }))
    },
    update: ({ text, id }: MessageUpdate): Promise<Array<Number>> => messages.update({ text }, { where: { id } }),
    delete: (id: Number): Promise<Array<Number>> => messages.destroy({ where: { id } })
};