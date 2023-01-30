const express = require("express");
const cors = require('cors');
const socketIo = require("socket.io");
const http = require("http");
const dotenv = require('dotenv').config()
require('./config/database');
const { findOrCreateDocument } = require('./controllers/documentController')

const PORT = process.env.PORT || 3001;
let userCount = 0

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
});

io.on("connection", (socket) => {
  userCount++;
  console.log("New User Connected.  ID : " + socket.id, ", Total users: " + userCount);

  // Get room and send back the code
  socket.on("get-document", async roomName => {
    const document = await findOrCreateDocument(roomName);
    socket.join(roomName);
    socket.emit("load-document", document);

    // Code changes handler
    socket.on("send-changes", code => {
      socket.broadcast.to(roomName).emit("receive-changes", code);
    });

    // Save code in DB
    socket.on("save-document", async code => {
      await findByIdAndUpdate(roomName, { code });
    });

    // Sent number of users
    socket.emit("users-counter", userCount);
  });

  socket.on("disconnect", function () {
    userCount--;
    console.log("User disconnect, total user left", userCount);
  });

});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", PORT);
});
