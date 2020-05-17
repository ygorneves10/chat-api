import { userController } from "./controllers/user"

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = express.Router()
const PORT = process.env.PORT || 5000;

// Users
routes.post('/user', userController.sendUser)
routes.get('/user', userController.getUser)
routes.get('/users', userController.getAllUsers)
routes.delete('/user/:id', userController.deleteUser)

// Rooms

// Messages

app.use(bodyParser.json());
app.use(routes)

app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
})