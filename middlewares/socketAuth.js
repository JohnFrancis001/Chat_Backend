const jwt = require('jsonwebtoken');
require("dotenv").config();

const socketVerify = (socket, next) => {
    const token = socket.handshake.auth.token;
    
    if(!token){
        return next(new Error("no Token"));
    }

    try{
        const user = jwt.verify(token, process.env.SIGN);
        socket.user = user;
        next();
    }catch(e){
        return next(new Error("invalid Token"));
    }
}

module.exports = socketVerify;