const { io } = require("socket.io-client");

// Use a JWT token you got from your login endpoint
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDdhOTYxNWIxMjY1ZTdmZmYzZjU5MSIsImVtYWlsIjoiaXNzYWNAZ21haWwuY29tIiwiaWF0IjoxNzc1ODI4MjIyLCJleHAiOjE3NzU4MjkxMjJ9.rL_CpQ92W8f0AWR1kCcHc4LqsiQiwEpZbY5s-8sTkGo";

// Replace with a real ObjectId from your conversations collection (via Postman GET /conversations)
const conversationId = "69d8fb3d4c2f2acca87c8734";

const socket = io("http://localhost:3000", {
  auth: { token },
  transports: ["websocket", "polling"]
});

// When connection is successful
socket.on("connect", () => {
  console.log("Connected! Socket ID:", socket.id);

  // Join the room first
  socket.emit("join_room", conversationId);
  console.log("Joined room:", conversationId);

  // Send message after a short delay to ensure room join is processed
  setTimeout(() => {
    socket.emit("send_message", {
      conversationId,       
      message: "This is Issac!"
    });
    console.log("Message sent to:", conversationId);
  }, 500);
});

// Listen for incoming messages
socket.on("receive_message", (data) => {
  console.log("Received message:", data);
});

// Server-side error events
socket.on("error", (err) => {
  console.error("Server error:", err.message);
});

// Connection failure (bad token, server down, etc.)
socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});

// Disconnection reason
socket.on("disconnect", (reason) => {
  console.warn("Disconnected:", reason);
});