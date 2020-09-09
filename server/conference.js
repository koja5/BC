var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;

var otherUsers = {};
var firstUser = {};

io.on("connection", (socket) => {
  socket.on("room_join_request", (payload) => {
    socket.join(payload.roomName, (err) => {
      if (!err) {
        io.in(payload.roomName).clients((err, clients) => {
          if (!err) {
            io.in(payload.roomName).emit("room_users", clients);
          }
        });
      }
    });
  });

  socket.on("room_join_request_broadcast", (payload) => {
    socket.join(payload.roomName, (err) => {
      if (!err) {
        io.in(payload.roomName).clients((err, clients) => {
          if (!err) {
            console.log(clients);
            if (clients.length === 1) {
              firstUser[payload.roomName] = clients[0];
              io.in(payload.roomName).emit(
                "first_user",
                firstUser[payload.roomName]
              );
            } else {
              /*if(otherUsers[payload.roomName]) {
                                otherUsers[payload.roomName] = socket.id;
                            } else {
                                otherUsers[payload.roomName].push(socket.id);
                            }*/
              io.in(payload.roomName).emit("listen_user", clients);
            }
          }
        });
      }
    });
  });

  socket.on("startConnection", (payload) => {
    console.log("Listen ID is: " + payload.listenId);
    socket.broadcast.emit("startConnection", { listenId: payload.listenId });
  });

  socket.on("callFirst", (payload) => {
    console.log("Listen ID is: " + payload.listenId);
    socket.broadcast.emit("callFirst", { listenId: payload.listenId });
  });

  socket.on("signal", (data) => {
    console.log("-----------SIGNAL---------");
    console.log(data);
    socket.broadcast.emit("signal", data);
    // io.to(data.listenId).emit("signal", data.signal);
  });

  socket.on("callFirstUser", (payload) => {
    console.log("calleee " + payload.calleeId);
    io.to(payload.calleeId).emit("listenerUserOn", {
      signalData: payload.signalData,
      callerId: payload.callerId,
    });
  });

  socket.on("offer_signal", (payload) => {
    io.to(payload.calleeId).emit("offer", {
      signalData: payload.signalData,
      callerId: payload.callerId,
    });
  });

  socket.on("answer_signal", (payload) => {
    console.log("answer signal " + payload.callerId);
    io.to(payload.callerId).emit("answer", {
      signalData: payload.signalData,
      calleeId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    io.emit("room_left", { type: "disconnected", socketId: socket.id });
  });
});

http.listen(port, () => console.log("listening on *:" + port));
