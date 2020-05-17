const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = express.Router()
const PORT = process.env.PORT || 5000;

// Users

// Rooms

// Messages

app.use(bodyParser.json());
app.use(routes)

app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
})