import { userController } from "./controllers/user"

const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = express.Router()
const PORT = process.env.PORT || 5000;
const io = require('socket.io')(http);

io.on('connection', function (socket: { id: String; }) {
    console.log("CONNECTED", socket.id)
});

routes.get('/', function (req: any, res: { sendFile: (arg0: string) => void; }) {
    res.sendFile(__dirname + '/public/index.html');
});

// Users
routes.post('/user', userController.sendUser)
routes.get('/user', userController.getUser)
routes.get('/users', userController.getAllUsers)
routes.delete('/user/:id', userController.deleteUser)

// Rooms

// Messages

app.use(bodyParser.json());
app.use(routes)

http.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
})