const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId , ref: "Conversation", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true  },
    message: { type: String, required: true, trim: true, minlength: 1 } 
},{
    timestamps: true
})

module.exports = mongoose.model('Chat', chatSchema);    