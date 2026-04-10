// const Chat = require("../models/chat");
// const Conversation = require("../models/conversationSchema");

// const registerChatHandler = (io, socket) => {

//     // join room
//     socket.on("join_room", (conversationId) => {
//         socket.join(conversationId);
//     });

//     // send message
//     socket.on("send_message", async ({ conversationId, message }) => {
//         try {
//             // 1. save message in DB
//             const newMessage = await Chat.create({
//                 conversationId,
//                 sender: senderId,
//                 message
//             });

//             // 2. update last message in conversation
//             await Conversation.findByIdAndUpdate(conversationId, {
//                 lastMessage: newMessage._id
//             });

//             // 3. emit to all users in room
//             io.to(conversationId).emit("receive_message", {
//                 _id: newMessage._id,
//                 message: newMessage.message,
//                 sender: senderId,
//                 createdAt: newMessage.createdAt
//             });

//         } catch (err) {
//             console.error(err);
//         }
//     });
// };

// module.exports = registerChatHandler;



const Chat = require("../models/chat");
const Conversation = require("../models/conversationSchema");

const registerChatHandler = (io, socket) => {

    socket.on("join_room", (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.user.id} joined room ${conversationId}`);
    });

    socket.on("send_message", async ({ conversationId, message }) => {
        const senderId = socket.user.id; // ✅ from verified JWT, not client payload

        if (!conversationId || !message?.trim()) {
            return socket.emit("error", { message: "conversationId and message are required" });
        }

        try {
            const newMessage = await Chat.create({
                conversationId,
                sender: senderId, // ✅ always a valid ObjectId
                message: message.trim()
            });

            await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: newMessage._id
            });

            io.to(conversationId).emit("receive_message", {
                _id: newMessage._id,
                message: newMessage.message,
                sender: senderId,
                createdAt: newMessage.createdAt
            });

        } catch (err) {
            console.error("send_message error:", err.message);
            socket.emit("error", { message: "Failed to save message" });
        }
    });
};

module.exports = registerChatHandler;