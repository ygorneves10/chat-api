import { userController, User } from "./controllers/user"
import { roomController, Room } from "./controllers/room"
import { messageController, Message } from "./controllers/message"

const port = process.env.PORT || 5000;
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket: any) => {
    socket.on("send message", (message: Message) => {
        messageController.create(message).then(createdMessage => io.emit("received message", createdMessage))
    })

    socket.on("create room", (roomData: Room) => {
        roomController.create(roomData).then(() => socket.emit("created room"))
    })

    socket.on("create user", (userData: User) => {
        userController.create(userData).then(() => socket.emit("created user"))
    })
});

http.listen(port, () => {
    console.log(`Server is running in http://localhost:${port}`)
})