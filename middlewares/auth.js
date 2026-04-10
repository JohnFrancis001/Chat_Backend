const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async(req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token) return res.status(400).json({msg: "The token hasn't been found"});
        const verify = jwt.verify(token, process.env.SIGN);
        req.user = verify; // This is the verified token to be accessed
        next();
    }catch(e){
        return res.status(400).json({message: 'Failure'});
    }
}

module.exports = auth;

