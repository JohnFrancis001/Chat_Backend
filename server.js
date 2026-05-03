const express = require('express');
const http = require('http');
const app = express();
const { initSocket } = require('./socket/index');
const db = require('./db');
const user = require('./routes/user');
const chat = require('./routes/startSocket');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());

app.use('/user', user);
app.use('/chat', chat);

const server = http.createServer(app);

initSocket(server);

server.listen(3000, () => {
    console.log("Server running on port: 3000");
})
