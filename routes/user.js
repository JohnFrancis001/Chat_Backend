const express = require('express');
const route = express.Router();
const User = require('../models/user')
const verifyUser = require('../middlewares/log')
const getToken = require('../controller/log')
const auth = require('../middlewares/auth')

route.post('/reg', async (req, res) => {
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password) return res.status(400).json({message: "All fields required"});
        const userSave = await User.create({
            name,
            email,
            password
        })
        return res.status(200).json({message: "User Recorded!", userSave});
    }catch(e){
    console.log("User Save Error:", e);

    return res.status(500).json({
        message: "Error saving the record",
        error: e.message
    });
}
})

route.post('/log', verifyUser, getToken)

route.get('/auth', auth, async(req, res) => {
    try{
        return res.status(200).json({message: "Authorized!"});
    }catch(e){
        return res.status(400).json({msg: "failed"})      
    }
})

module.exports = route;