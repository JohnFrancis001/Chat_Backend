const jwt = require('jsonwebtoken')
require('dotenv').config();

const getToken = async(req, res) => {
    try{
        const user = req.user;
        if(!user) return res.status(400).json({message: "user not authenticated"})
        const token = jwt.sign({
            id: user._id,
            email: user.email
        },
        process.env.SIGN,
        {
            expiresIn: "15m"
        }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameStrict: "strict",
        maxAge: 15 * 60 * 1000
    });

        return res.status(200).json({message: "Success"})
    }catch(e){
        return res.status(400).json({message: "Error"})
    }
}

module.exports = getToken;