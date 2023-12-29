const { Server } = require("socket.io");
const io = new Server();

let Sockets = {};
let SocketArray = {};

let Socket = {
  sendMessage: function (event, data) {
    let socketId = Sockets["admin"];
    console.log("==== socket found =====", socketId, event);
    if (socketId) {
      if (io.sockets && io.sockets.connected[socketId]) {
        io.sockets.connected[socketId].emit(event, data);
      }
    } else {
      console.log("======= not login ======");
    }
  },


  joinChat: function ({ chatId }) {
    SocketArray["admin"].join(chatId);
    console.log("======== Joined chat:", chatId);
  },

  leaveChat: function ({ chatId }) {
    SocketArray["admin"].leave(chatId);
    console.log("======== Left chat:", chatId);
  },
};

io.on("connection", function (socket) {
  console.log("======== Handshake successful. Name:", socket.handshake.query.name || "Guest");
  if (socket.handshake.query.name === "admin") {
    Sockets[socket.handshake.query.name] = socket.id;
    SocketArray[socket.handshake.query.name] = socket;
    return;
  }

  socket.on("join-chat", ({ chatId }) => {
    socket.join(chatId);
    console.log("======== Joined chat:", chatId);
  });

  socket.on("leave-chat", ({ chatId }) => {
    socket.leave(chatId);
    console.log("======== Left chat:", chatId);
  });

  socket.on("disconnect", function (data) {
    console.log("======= Socket disconnected =======");
    delete Sockets[socket.id];
    delete SocketArray[socket.id];
  });
});

exports.Socket = Socket;
exports.io = io;
