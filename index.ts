import { roomController, Room } from "./controllers/room"

const express = require('express');
const app = express();
const http = require('http').Server(app);
const PORT = process.env.PORT || 5000;
const io = require('socket.io')(http);

interface Message {
    user: Number,
    message: String
}

io.on('connection', function (socket: any) {
    socket.on("message", (message: Message) => {
        io.emit("received", message)
    })

    socket.on("create room", (roomData: Room) => {
        roomController.create(roomData).then(() => socket.emit("created room"))
    })
});

http.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
})