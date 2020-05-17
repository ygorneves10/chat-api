import { Sequelize, sequelize } from './connect'
import { users } from "./user"
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
    create: (roomData: Message): Promise<Message> => messages.create(roomData),
    read: (roomId: Number): Promise<Array<Message>> => messages.findAll({ where: { roomId } }),
    update: ({ text, id }: MessageUpdate): Promise<Array<Number>> => messages.update({ text }, { where: { id } }),
    delete: (id: Number): Promise<Array<Number>> => messages.destroy({ where: { id } })
};