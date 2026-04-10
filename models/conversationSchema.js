const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    isGroup: { type: Boolean, default: false },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }
}, {
    timestamps: true
})

module.exports = mongoose.model('Conversation', conversationSchema);