const express = require('express');
const router = express.Router(); // not `route`
const Chat = require('../models/chat'); // keep Chat model if needed
const Conversation = require('../models/conversationSchema'); // Conversation model
const User = require('../models/user')

// POST /startChat
router.post('/startChat', async (req, res) => {
    try {
        const { senderId, name } = req.body;

        if (!senderId || !name) {
            return res.status(400).json({ error: "senderId and sender name are required" });
        }

        let receiver = await User.findOne({name});

        if(!receiver) return res.status(400).json({message: "the username did not found"});

        receiver = receiver._id;

        // 1. Check if conversation already exists (1-on-1)
        let conversation = await Conversation.findOne({
            isGroup: false,
            participants: { $all: [senderId, receiver] },
            $expr: { $eq: [{ $size: "$participants" }, 2] }
        });

        // 2. If not, create new conversation
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiver]
            });
        }

        // 3. Return conversationId to frontend
        res.status(200).json(conversation);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;