const { io } = require("socket.io-client");

// -------------------- TOKENS --------------------
const tokenA = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjRmMmI3NDA3Nzc3NTVjMjUzZDk1ZiIsImVtYWlsIjoiYWRhbUBnbWFpbC5jb20iLCJpYXQiOjE3Nzc2NjA1OTksImV4cCI6MTc3NzY2MTQ5OX0.KJNIDD_JsCOZcAi1ujdA1N4Lei_NMLzgZNO7BDa0_po";

const tokenB = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjRmMjc0NDA3Nzc3NTVjMjUzZDk1YyIsImVtYWlsIjoicGF1bEBnbWFpbC5jb20iLCJpYXQiOjE3Nzc2NjA2NzAsImV4cCI6MTc3NzY2MTU3MH0.eyg_SWFxw4agXv9Boqejx97Xn5C7QDsBO--ukFGiZF4";

const conversationId = "69f4f2b740777755c253d964";

// -------------------- USER A Token --------------------
const userA = io("http://localhost:3000", {
  auth: { token: tokenA }
});

// -------------------- USER B Token--------------------
const userB = io("http://localhost:3000", {
  auth: { token: tokenB }
});

// -------------------- USER A Connection/Joining --------------------
userA.on("connect", () => {
  console.log("User A connected");

  userA.emit("join_room", conversationId, (res) => {
    console.log("User A join response:", res);

    userA.emit("send_message", {
      conversationId,
      message: "Hello this is adam",
    });
  });
});

userA.on("receive_message", (data) => {
  console.log("User A received:", data);
});

userA.on("connect_error", (err) => {
  console.log("User A error:", err.message);
});

// -------------------- USER B Connection/Joining --------------------
userB.on("connect", () => {
  console.log("User B connected");

  userB.emit("join_room", conversationId, (res) => {
    console.log("User B join response:", res);

    setTimeout(() => {
      userB.emit("send_message", {
        conversationId,
        message: "Hey Adam, nice to meet you. i am paul",
      });
    }, 1000);
  });
});

userB.on("receive_message", (data) => {
  console.log("User B received:", data);
});

userB.on("connect_error", (err) => {
  console.log("User B error:", err.message);
});