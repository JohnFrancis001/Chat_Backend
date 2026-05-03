    const Chat = require("../models/chat");
    const Conversation = require("../models/conversationSchema");

    const registerChatHandler = (io, socket) => {

        console.log("User connected:", socket.user.id);

        // =========================
        // JOIN CONVERSATION ROOM
        // =========================
        socket.on("join_room", async (conversationId, callback) => {
    try {
        if (!conversationId) {
            return callback?.({ success: false, message: "conversationId required" });
        }

        
        const convo = await Conversation.findById(conversationId);
        console.log("Trying to join:", socket.user.id);
console.log("Members:", convo.members.map(id => id.toString()));
        
        if (!convo) {
            return callback?.({ success: false, message: "Conversation not found" });
        }

        if (!convo.members.some(id => id.toString() === socket.user.id)) {
            return callback?.({ success: false, message: "Unauthorized access" });
        }

        socket.join(conversationId);

        console.log(`User ${socket.user.id} joined ${conversationId}`);

        // ✅ THIS WAS MISSING
        callback?.({ success: true });

    } catch (err) {
        console.error("join_room error:", err.message);
        callback?.({ success: false, message: "Failed to join room" });
    }
});

        // =========================
        // SEND MESSAGE
        // =========================
        socket.on("send_message", async ({ conversationId, message }) => {
            const senderId = socket.user.id;

            try {
                // ✅ Validation
                if (!conversationId || !message?.trim()) {
                    return socket.emit("chat_error", { message: "conversationId & message required" });
                }

                if (message.length > 1000) {
                    return socket.emit("chat_error", { message: "Message too long" });
                }

                const convo = await Conversation.findById(conversationId);

                if (!convo) {
                    return socket.emit("chat_error", { message: "Conversation not found" });
                }

                // ✅ Authorization again (important)
                if (!convo.members.some(id => id.toString() === senderId)) {
                    return socket.emit("chat_error", { message: "Unauthorized" });
                }

                console.log(conversationId);
                console.log(convo.members);

                // ✅ Save message
                const newMessage = await Chat.create({
                    conversationId,
                    sender: senderId,
                    message: message.trim()
                });

                // ✅ Update last message
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: newMessage._id
                });

                // ✅ Emit to all in room
                io.to(conversationId).emit("receive_message", {
                    _id: newMessage._id,
                    message: newMessage.message,
                    sender: senderId,
                    createdAt: newMessage.createdAt
                });

                newMessage.save();

            } catch (err) {
                console.error("send_message error:", err.message);
                socket.emit("chat_error", { message: "Failed to send message" });
            }
        });

        // =========================
        // TYPING INDICATOR
        // =========================
        socket.on("typing", async (conversationId) => {
            try {
                if (!conversationId) return;

                socket.to(conversationId).emit("user_typing", {
                    user: socket.user.id
                });

            } catch (err) {
                console.error("typing error:", err.message);
            }
        });

        // =========================
        // DISCONNECT
        // =========================
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.user.id);
        });
    };

    module.exports = registerChatHandler;