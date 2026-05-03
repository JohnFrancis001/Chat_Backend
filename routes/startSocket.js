const express = require('express');
const router = express.Router(); // not `route`
const Chat = require('../models/chat'); // keep Chat model if needed
const Conversation = require('../models/conversationSchema'); // Conversation model
const User = require('../models/user')
const mongoose = require('mongoose')
const auth = require('../middlewares/auth')

// POST /startChat
router.post('/startChat', auth, async (req, res) => {
    try {
        const { name } = req.body;  

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        const senderId = req.user?.id;

        if (!name) {
            return res.status(400).json({ error: "Empty receiver name" });
        }

        if(!mongoose.Types.ObjectId.isValid(senderId)){
            return res.status(400).json({error: "Invalid SenderId"})
        }

        let receiver = await User.findOne({name});

        if(!receiver) return res.status(400).json({message: "the username did not found"});

        receiver = receiver._id;

        if (senderId.toString() === receiver.toString()) {
            return res.status(400).json({ error: "Cannot chat with yourself" });
        }

        // 1. Check if conversation already exists (1-on-1)
        let conversation = await Conversation.findOne({
            isGroup: false,
            members: { $all: [senderId, receiver] },
            $expr: { $eq: [{ $size: "$members" }, 2] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                members: [senderId, receiver]
            });
        }
        
        res.status(200).json(conversation._id);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/conversation/:id', auth, async (req, res) => {
    try{
        const user_id = req.user.id;

        if(!user_id) return res.status(400).json({msg: "not working"})

        const conversations_Id = await Conversation.find({members: user_id}); 

        if(!conversations_Id) return res.status(400).json({message: "NO Conversation is found"});

        const conversations = await conversations_Id.map(c => c._id);

        if(!conversations) return res.status(400).json({message: "no id detected"});

        const chats = await Chat.find({conversationId: { $in : conversations}}).sort({ createdAt: 1 });

        if(!chats) return res.status(400).json({message: "No chats found"})

        return res.status(200).json({message: "Chats Retrieved", chats})
    }catch(e){
        return res.status(400).json({error: "Failed to retrieve chats"});
    }
})

module.exports = router;


