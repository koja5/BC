const express = require("express");
const router = express.Router();
var sha1 = require("sha1");
const axios = require("axios");
const API = "https://jsonplaceholder.typicode.com";
const mysql = require("mysql");
var fs = require("fs");
const path = require("path");

var connection = mysql.createPool({
  host: "185.178.193.141",
  user: "appproduction.",
  password: "jBa9$6v7",
  database: "business_circle"
});

connection.getConnection(function(err, conn) {
  console.log(conn);
  console.log(err);
});

/* GET api listing. */
router.get("/", (req, res) => {
  res.send("api works");
});

router.get("/posts", (req, res) => {
  axios
    .get(`${API}/posts`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

router.post("/login", (req, res, next) => {
  try {
    var reqObj = req.body;
    connection.getConnection(function(err, conn) {
      if (err) {
        console.error("SQL Connection error: ", err);
        res.json({
          code: 100,
          status: "Error in connection database"
        });
        return next(err);
      } else {
        console.log(req.body.email, sha1(reqObj.password));
        conn.query(
          "SELECT * FROM users WHERE email='" +
            req.body.email +
            "'AND password='" +
            sha1(req.body.password) +
            "'",
          function(err, rows, fields) {
            conn.release();
            console.log(rows);
            if (err) {
              console.error("SQL error:", err);
              res.json({
                code: 100,
                status: "Error in connection database"
              });
              return next(err);
            }
            if (rows.length >= 1 && rows[0].active === 1) {
              res.send({
                login: true,
                user: rows[0]
              });
            } else {
              res.send({
                login: false
              });
            }
          }
        );
      }
    });
  } catch (ex) {
    console.error("Internal error: " + ex);
    return next(ex);
  }
});

router.post("/signUp", function(req, res, next) {
  connection.getConnection(function(err, conn) {
    console.log(conn);
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database"
      });
      return;
    }

    var response = {};
    delete req.body.confirmPassword;
    req.body.password = sha1(req.body.password);

    conn.query("SELECT * FROM users WHERE email=?", [req.body.email], function(
      err,
      rows,
      fields
    ) {
      if (err) {
        console.error("SQL error:", err);
        res.json({
          code: 100,
          status: "Error in connection database"
        });
        return next(err);
      }
      console.log(rows);
      if (rows.length >= 1) {
        response.success = false;
        response.info = "Email already exists!";
        res.json(response);
      } else {
        conn.query("insert into users SET ?", req.body, function(err, rows) {
          conn.release();
          if (!err) {
            if (!err) {
              response.id = rows.insertId;
              response.success = true;
            } else {
              response.success = false;
              response.info = "Error";
            }
            res.json(response);
          } else {
            res.json({
              code: 100,
              status: "Error in connection database"
            });
            console.log(err);
          }
        });
      }
    });
    conn.on("error", function(err) {
      console.log("[mysql error]", err);
    });
  });
});

router.get("/getUserInfo/:id", function(req, res, next) {
  connection.getConnection(function(err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database"
      });
      return;
    }
    var id = req.params.id;
    conn.query("SELECT * from users where id = ?", [id], function(err, rows) {
      conn.release();
      if (!err) {
        res.json(rows);
      } else {
        res.json({
          code: 100,
          status: "Error in connection database"
        });
      }
    });
  });
});

router.post("/updateUserSID", function(req, res, next) {
  connection.getConnection(function(err, conn) {
    console.log(conn);
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database"
      });
      return;
    }

    var response = null;
    console.log(req.body);

    conn.query(
      "update users set sid = '" +
        req.body.sid +
        "' where id = '" +
        req.body.id +
        "'",
      function(err, rows, fields) {
        conn.release();
        if (err) {
          console.error("SQL error:", err);
          res.json({
            code: 100,
            status: "Error in connection database"
          });
          return next(err);
        } else {
          console.log("test");
          response = true;
          res.json(response);
        }
      }
    );
    conn.on("error", function(err) {
      console.log("[mysql error]", err);
    });
  });
});

router.get("/korisnik/verifikacija/:id", (req, res, next) => {
  try {
    var reqObj = req.params.id;

    console.log(reqObj);
    connection.getConnection(function(err, conn) {
      if (err) {
        console.error("SQL Connection error: ", err);
        res.json({
          code: 100,
          status: "Error in connection database"
        });
        return next(err);
      } else {
        conn.query(
          "UPDATE users SET active='1' WHERE SHA1(email)='" + reqObj + "'",
          function(err, rows, fields) {
            conn.release();
            if (err) {
              console.error("SQL error:", err);
              res.json({
                code: 100,
                status: "Error in connection database"
              });
              return next(err);
            } else {
              res.writeHead(302, {
                Location: "/login"
              });
              res.end();
            }
          }
        );
      }
    });
  } catch (ex) {
    console.error("Internal error: " + ex);
    return next(ex);
  }
});

module.exports = router;
