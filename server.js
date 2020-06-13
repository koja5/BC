// Get dependencies
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
const app = express();
const socketIO = require("socket.io");
const multer = require("multer");
const mysql = require("mysql");
const sha1 = require("sha1");

var connection = mysql.createPool({
  host: "185.178.193.141",
  user: "appproduction.",
  password: "jBa9$6v7",
  database: "business_circle",
});

//for upload image
app.use(function (req, res, next) {
  //allow cross origin requests
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, PUT, OPTIONS, DELETE, GET"
  );
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
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
const server = http.createServer(app);

const io = socketIO(server);

let numberOfOnlineUsers = 0;

io.on("connection", (socket) => {
  numberOfOnlineUsers++;
  socket.on("/", (numberOfOnlineUsers) => {
    socket.emit("numberOfOnlineUsers", numberOfOnlineUsers);
  });

  socket.on("disconnect", () => {
    numberOfOnlineUsers--;
    socket.emit("numberOfOnlineUsers", numberOfOnlineUsers);
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
