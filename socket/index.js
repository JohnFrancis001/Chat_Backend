const { Server } = require('socket.io');
const registerChatHandler = require("./chat.socket");
const SocketAuth = require('../middlewares/socketAuth');

const initSocket = (server) => { // the function to initialize the socket for two way communication
    const io = new Server(server, { // attaching socket.io to the existing server
        cors: {  // configure cors to allow client connections
            origin: "*", // allow all the origins ( not recommended for production )
            credentials: true // allow cookies/auth headers
        }
    });

    io.use(SocketAuth);

    io.on("connection", (socket) => { // listen for new client connections
        console.log("user connected");

        registerChatHandler(io, socket); // attach chat logic
    })
}

module.exports = {initSocket}; // export the initializer