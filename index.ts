const express = require('express');
const app = express();
const http = require('http').Server(app);
const PORT = process.env.PORT || 5000;
const io = require('socket.io')(http);

io.on('connection', function (socket: any) {
    socket.on("message", (message: any) => {
        io.emit("received", message)
    })
});

http.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
})