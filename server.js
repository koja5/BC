// Get dependencies
const compression = require("compression");
const express = require("express");
const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const api = require("./server/api");
const mongo = require("./server/mongodb");
const morgan = require("morgan");
const mail = require("./server/mailAPI");
// const conference = required("./server/conference");
const app = express();
const socketIO = require("socket.io");
const multer = require("multer");
const mysql = require("mysql");
const sha1 = require("sha1");
/*const proxy = require('redbird')({
  port: 80,
  secure: false,
  ssl: {
      port: 443,
      key: "./cert/cert_key.key",
      cert: "./cert/cert_crt.crt",
  }
});*/

var connection = mysql.createPool({
  host: "185.178.193.141",
  user: "appproduction.",
  password: "jBa9$6v7",
  database: "business_circle",
});

// proxy.register("bc-inter.net", "http:/localhost:3000");

app.use(compression());
//for upload image
app.use(function (req, res, next) {
  //allow cross origin requests
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, PUT, OPTIONS, DELETE, GET"
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  // res.header("Access-Control-Allow-Credentials", true);
  next();
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/assets/img/profile_image/");
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + "-" + datetimestamp + ".png");
  },
});

var upload = multer({
  //multer settings
  storage: storage,
}).single("file");

app.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    connection.getConnection(function (err, conn) {
      if (err) {
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return;
      }
      var response = {};
      const file = req.file.originalname.split("-");
      console.log(req.file);
      if (file[1] === "img") {
        conn.query(
          "update users set image = ? where sha1(id) = ?",
          [req.file.filename, file[0]],
          function (err, rows) {
            conn.release();
            if (!err) {
              if (!err) {
                response = {
                  name: req.file.filename,
                  type: "img",
                  info: true,
                };
                res.json(response);
              } else {
                res.json(err);
              }
            } else {
              res.json(err);
            }
          }
        );
      } else {
        conn.query(
          "update users set cover = ? where sha1(id) = ?",
          [req.file.filename, file[0]],
          function (err, rows) {
            conn.release();
            if (!err) {
              if (!err) {
                response = {
                  name: req.file.filename,
                  type: "cover",
                  info: true,
                };
                res.json(response);
              } else {
                res.json(false);
              }
            } else {
              res.json(err);
            }
          }
        );
      }
      conn.on("error", function (err) {
        console.log("[mysql error]", err);
      });
    });
  });
});

var storagePromo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/assets/img/promo_video/");
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + "-" + datetimestamp + ".mp4");
  },
});

var uploadPromo = multer({
  //multer settings
  storage: storagePromo,
}).single("file");

app.post("/uploadPromo", function (req, res) {
  uploadPromo(req, res, function (err) {
    connection.getConnection(function (err, conn) {
      if (err) {
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return;
      }
      var response = {};
      const file = req.file.originalname.split("-");
      console.log(req.file);
      conn.query(
        "update users set promo = ? where sha1(id) = ?",
        [req.file.filename, file[0]],
        function (err, rows) {
          conn.release();
          if (!err) {
            if (!err) {
              response = {
                name: req.file.filename,
                type: "mp4",
                info: true,
              };
              res.json(response);
            } else {
              res.json(err);
            }
          } else {
            res.json(err);
          }
        }
      );
      conn.on("error", function (err) {
        console.log("[mysql error]", err);
      });
    });
  });
});

// Parsers for POST data
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(cookieParser());
app.use(
  session({
    secret: "management",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 300 * 30,
    },
  })
);

// loguje svaki zahtev u konzolurs
// app.use(morgan("dev"));

// Point static path to dist
app.use(express.static(path.join(__dirname, "dist")));

// Set our api routes
app.use("/api", api);
app.use("/api", mail);
app.use("/api", mongo);
// app.use("/", conference);

// Catch all other routes and return the index file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "src/index.html"));
});
/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || "3000";
app.set("port", port);

/**
 * Create HTTP server.
 */

/*let o = {
  format: "urls",
};

let bodyString = JSON.stringify(o);
let https = require("https");

let options = {
  host: "global.xirsys.net",
  path: "/_turn/MyFirstApp",
  method: "PUT",
  headers: {
    Authorization:
      "Basic " +
      Buffer.from("koja:c932da5a-24cc-11eb-9d1e-0242ac150002").toString(
        "base64"
      ),
    "Content-Type": "application/json",
    "Content-Length": bodyString.length,
  },
};
let httpreq = https.request(options, function (httpres) {
  let str = "";
  httpres.on("data", function (data) {
    str += data;
  });
  httpres.on("error", function (e) {
    console.log("error: ", e);
  });
  httpres.on("end", function () {
    console.log("ICE List: ", str);
  });
});
httpreq.on("error", function (e) {
  console.log("request error: ", e);
});
httpreq.end();*/

const server = http.createServer(app);

/* SOCKET START */

var io = require("socket.io").listen(server);
var peers = {};
io.on("connect", (socket) => {
  console.log("a client is connected");
  // console.log(socket);

  peers[socket.id] = socket;

  // Asking all other clients to setup the peer connection receiver
  for (let id in peers) {
    if (id === socket.id) continue;
    console.log("sending init receive to " + socket.id);
    peers[id].emit("initReceive", socket.id);
  }

  /**
   * relay a peerconnection signal to a specific socket
   */
  socket.on("signal", (data) => {
    console.log("sending signal from " + socket.id + " to ", data);
    if (!peers[data.socket_id]) return;
    peers[data.socket_id].emit("signal", {
      socket_id: socket.id,
      signal: data.signal,
    });
  });

  /**
   * remove the disconnected peer connection from all other connected clients
   */
  /*socket.on("disconnect", () => {
    console.log("socket disconnected " + socket.id);
    socket.broadcast.emit("removePeer", socket.id);
    delete peers[socket.id];
  });*/

  /**
   * Send message to client to initiate a connection
   * The sender has already setup a peer connection receiver
   */
  socket.on("initSend", (init_socket_id) => {
    console.log("INIT SEND by " + socket.id + " for " + init_socket_id);
    console.log(peers);
    peers[init_socket_id].emit("initSend1", socket.id);
  });

  /* SEND AND RECEIVE MESSAGE */

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

  socket.on("join", function (data) {
    //joining
    socket.join(data.room);

    console.log(data.sender_id + "joined the room : " + data.room);

    socket.broadcast.to(data.room).emit("new user joined", {
      sender_id: data.sender_id,
      message: "has joined this room.",
    });
  });

  socket.on("leave", function (data) {
    console.log(data.sender_id + "left the room : " + data.room);

    socket.broadcast.to(data.room).emit("left room", {
      sender_id: data.sender_id,
      message: "has left this room.",
    });

    socket.leave(data.room);
  });

  socket.on("message", function (data) {
    console.log(data);

    io.in(data.room).emit("new message", {
      sender_id: data.sender_id,
      message: data.message,
      fullname: data.fullname,
      image: data.image,
      date: data.date,
      not_seen: data.not_seen,
    });

    io.in(data.not_seen).emit("notification", {
      text: "notifikacija!!!",
    });
  });

  socket.on("send_message", (payload) => {
    console.log(payload);
    io.in(payload.roomId).emit("receive_message", payload);
  });

  /* END SEND AND RECEIVE MESSAGE */

  /* ROOM END */
});

/* SOCKET END */

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
