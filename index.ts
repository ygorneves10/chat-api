import { userController, User, LoginResponse, UserLogin } from "./controllers/user"
import { roomController, Room } from "./controllers/room"
import { messageController, Message } from "./controllers/message"

const port = process.env.PORT || 5000;
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket: any) => {
    socket.on("enter room", (roomId: Number) => {
        messageController.read(roomId).then(roomMessages => socket.emit("room messages", roomMessages))
    })

    socket.on("send message", (message: Message) => {
        messageController.create(message).then(createdMessage => io.emit("received message", createdMessage))
    })

    socket.on("create room", (roomData: Room) => {
        roomController.create(roomData).then(() => socket.emit("created room"))
    })

    socket.on("create user", (userData: User) => {
        userController.create(userData).then(() => socket.emit("created user"))
    })

    socket.on("user login", (loginData: UserLogin) => {
        userController.userLogin(loginData).then((loginResponse: LoginResponse) => socket.emit("login response", loginResponse))
    })

    socket.on("list rooms", () => {
        roomController.getAll().then(rooms => socket.emit("rooms list", rooms))
    })
});

http.listen(port, () => {
    console.log(`Server is running in http://localhost:${port}`)
})