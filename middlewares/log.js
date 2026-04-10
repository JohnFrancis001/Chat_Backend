const bcrypt = require('bcrypt')
const User = require('../models/user')

const verifyUser = async (req, res, next) => {
    try{
        const {_id, email, password} = req.body;
        if(!email || !password) return res.status(400).json({message: "All fields are required"})
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "Invalid User"});
        const verifyPass = await bcrypt.compare(password ,user.password);
        if(!verifyPass) return res.status(400).json({message: "Invalid Credentials"});
        req.user = user;
        next();
    }catch(e){
        return res.status(400).json({message: "Error"});
    }
}

module.exports = verifyUser;