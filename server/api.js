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
  database: "business_circle",
});

connection.getConnection(function (err, conn) {
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
    .then((posts) => {
      res.status(200).json(posts.data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.post("/login", (req, res, next) => {
  try {
    var reqObj = req.body;
    connection.getConnection(function (err, conn) {
      if (err) {
        console.error("SQL Connection error: ", err);
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return next(err);
      } else {
        console.log(req.body.email, sha1(reqObj.password));
        conn.query(
          "SELECT * FROM users WHERE active = 1 and email='" +
            req.body.email +
            "'AND password='" +
            sha1(req.body.password) +
            "'",
          function (err, rows, fields) {
            conn.release();
            console.log(rows);
            if (err) {
              console.error("SQL error:", err);
              res.json({
                code: 100,
                status: "Error in connection database",
              });
              return next(err);
            }
            if (rows.length >= 1 && rows[0].active === 1) {
              res.send({
                login: true,
                user: rows[0],
              });
            } else {
              res.send({
                login: false,
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

router.post("/signUp", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    console.log(conn);
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }

    var response = {};
    delete req.body.confirmPassword;
    req.body.password = sha1(req.body.password);

    conn.query("SELECT * FROM users WHERE email=?", [req.body.email], function (
      err,
      rows,
      fields
    ) {
      if (err) {
        console.error("SQL error:", err);
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return next(err);
      }

      if (rows.length >= 1) {
        response.success = false;
        response.info = "Email already exists!";
        res.json(response);
      } else {
        req.body.fullname = req.body.lastname + " " + req.body.firstname;
        conn.query("insert into users SET ?", req.body, function (err, rows) {
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
              status: "Error in connection database",
            });
            console.log(err);
          }
        });
      }
    });
    conn.on("error", function (err) {
      console.log("[mysql error]", err);
    });
  });
});

router.get("/getUserInfo/:id", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    var id = req.params.id;
    conn.query("SELECT * from users where id = ?", [id], function (err, rows) {
      conn.release();
      if (!err) {
        res.json(rows);
      } else {
        res.json({
          code: 100,
          status: "Error in connection database",
        });
      }
    });
  });
});

router.get("/getUserInfoSHA1/:id", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    var id = req.params.id;
    conn.query("SELECT * from users where sha1(id) = '" + id + "'", function (
      err,
      rows
    ) {
      conn.release();
      if (!err) {
        res.json(rows);
      } else {
        res.json({
          code: 100,
          status: "Error in connection database",
        });
      }
    });
  });
});

router.get("/getAllUsers", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    var id = req.params.id;
    conn.query(
      "SELECT u.*, b.bankAccount, b.iban, b.bic from users u left join bankAccount b on sha1(u.id) = b.id_user",
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(rows);
        } else {
          res.json({
            code: 100,
            status: "Error in connection database",
          });
        }
      }
    );
  });
});

router.post("/updateUserSID", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    console.log(conn);
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
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
      function (err, rows, fields) {
        conn.release();
        if (err) {
          console.error("SQL error:", err);
          res.json({
            code: 100,
            status: "Error in connection database",
          });
          return next(err);
        } else {
          console.log("test");
          response = true;
          res.json(response);
        }
      }
    );
    conn.on("error", function (err) {
      console.log("[mysql error]", err);
    });
  });
});

router.get("/user/verification/:id", (req, res, next) => {
  try {
    var reqObj = req.params.id;

    console.log(reqObj);
    connection.getConnection(function (err, conn) {
      if (err) {
        console.error("SQL Connection error: ", err);
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return next(err);
      } else {
        var activeDate = new Date().toDateString();
        conn.query(
          "UPDATE users SET activeDate='" +
            activeDate +
            "', active=1 WHERE SHA1(email)='" +
            reqObj +
            "'",
          function (err, rows, fields) {
            conn.release();
            if (err) {
              console.error("SQL error:", err);
              res.json({
                code: 100,
                status: "Error in connection database",
              });
              return next(err);
            } else {
              res.writeHead(302, {
                Location: "/login",
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

router.post("/searchDirector", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    console.log(req.body);
    conn.query(
      "SELECT * from users where type != 2 and active = 1 and (fullname like '%" +
        req.body.filter +
        "%' or email like '%" +
        req.body.filter +
        "%')",
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(rows);
        } else {
          res.json(null);
        }
      }
    );

    conn.on("error", function (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    });
  });
});

router.get("/getDirectors", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    conn.query(
      "SELECT * from users where (type != 2) and active = 1",
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(rows);
        } else {
          res.json(null);
        }
      }
    );

    conn.on("error", function (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    });
  });
});

router.post("/editUser", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }

    var id = req.body.id;
    req.body.fullname = req.body.lastname + " " + req.body.firstname;
    conn.query(
      "update users SET ? where id = '" + id + "'",
      req.body,
      function (err, rows) {
        conn.release();
        if (!err) {
          if (!err) {
            response = true;
          } else {
            response = false;
          }
          res.json(response);
        } else {
          res.json({
            code: 100,
            status: "Error in connection database",
          });
          console.log(err);
        }
      }
    );
    conn.on("error", function (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    });
  });
});

router.post("/forgotPassword", (req, res, next) => {
  try {
    var reqObj = req.body;
    connection.getConnection(function (err, conn) {
      if (err) {
        console.error("SQL Connection error: ", err);
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return next(err);
      } else {
        conn.query(
          "SELECT * FROM users u WHERE u.email=?",
          [reqObj.email],
          function (err, rows, fields) {
            if (err) {
              console.error("SQL error:", err);
              res.json({
                code: 100,
                status: "Error in connection database",
              });
              return next(err);
            }

            if (rows.length >= 1 && rows[0].active == "1") {
              conn.release();
              res.send({
                exist: true,
                notVerified: true,
              });
            } else if (rows.length >= 1 && rows[0].active != "1") {
              conn.release();
              res.send({
                exist: true,
                notVerified: true,
              });
            } else {
              conn.release();
              res.send({
                exist: false,
                notVerified: false,
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

router.post("/changePassword", (req, res, next) => {
  try {
    var reqObj = req.body;
    console.log(reqObj);
    var email = reqObj.email;
    var password = reqObj.password;

    connection.getConnection(function (err, conn) {
      if (err) {
        console.error("SQL Connection error: ", err);
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return next(err);
      }
      conn.query(
        "UPDATE users SET password='" +
          sha1(password) +
          "' WHERE sha1(email)='" +
          email +
          "'",
        function (err, rows, fields) {
          conn.release();
          if (err) {
            console.error("SQL error:", err);
            res.json({
              code: 100,
              status: "Error in connection database",
            });
            return next(err);
          } else {
            res.send({
              code: "true",
              message: "The password is success change!",
            });
          }
        }
      );
    });
  } catch (ex) {
    console.error("Internal error: " + ex);
    return next(ex);
  }
});

router.get("/getMyOwnConnection/:id", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    var id = req.params.id;
    console.log(id);
    conn.query(
      "SELECT id from users where active = 1 and (type != 2) and sha1(id) = '" +
        id +
        "'",
      function (err, rows) {
        if (!err) {
          console.log(rows);
          if (rows.length === 0) {
            conn.release();
            res.json(rows);
          } else {
            console.log(rows[0].id);
            if (rows[0].id !== 1) {
              var directorId = "-" + rows[0].id + "-";
            } else {
              var directorId = rows[0].id;
            }
            console.log(directorId);
            conn.query(
              "SELECT u.*, lo.looking, lo.offer, rTrue.help, rFalse.notHelp from users u left join lookingOffer lo on sha1(u.id) = lo.id_user left join (SELECT id_user, count(*) as help from recommendation where status = 1 group by id_user)rTrue on rTrue.id_user = sha1(u.id) left join (SELECT id_user, count(*) as notHelp from recommendation where status = 0 group by id_user)rFalse on rFalse.id_user = sha1(u.id) where active = 1 and sid like '%" +
                directorId +
                "%'",
              function (err, rows1) {
                console.log(rows1);
                conn.release();
                if (!err) {
                  res.json(rows1);
                } else {
                  console.log(err);
                  res.json({
                    code: 100,
                    status: "Error in connection database",
                  });
                }
              }
            );
          }
        } else {
          conn.release();
          res.json({
            code: 100,
            status: "Error in connection database",
          });
        }
      }
    );
  });
});

router.get("/getOtherConnections/:id", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    var id = req.params.id;
    console.log(id);
    conn.query(
      "SELECT sid, id from users where active = 1 and sha1(id) = '" + id + "'",
      function (err, rows) {
        if (!err) {
          console.log(rows);
          if (rows.length === 0) {
            conn.release();
            res.json(rows);
          } else {
            var directorId = rows[0].sid.split(rows[0].id)[0];
            var countLevel = (rows[0].sid.match(new RegExp("-", "g")) || [])
              .length;
            console.log(countLevel);
            conn.query(
              "SELECT * from users where active = 1 and sid != '" +
                rows[0].sid +
                "' and sid like '%" +
                directorId +
                "%' and length(sid) - length(replace(sid, '-', '')) = '" +
                countLevel +
                "'",
              function (err, rows) {
                console.log(rows);
                conn.release();
                if (!err) {
                  res.json(rows);
                } else {
                  console.log(err);
                  res.json({
                    code: 100,
                    status: "Error in connection database",
                  });
                }
              }
            );
          }
        } else {
          conn.release();
          res.json({
            code: 100,
            status: "Error in connection database",
          });
        }
      }
    );
  });
});

// automatically set active on 1 and don't want to send confirm mail
router.post("/joinTo", (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        console.error("SQL Connection error: ", err);
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return next(err);
      }
      conn.query(
        "SELECT * from users where sha1(id) = '" + req.body.directorId + "'",
        function (err, rows, fields) {
          // conn.release();
          if (err) {
            conn.release();
            return res.json(err);
          }
          if (rows.length !== 0) {
            var directorSID = rows[0].sid;
            req.body.data.password = sha1(req.body.data.password);
            req.body.data.fullname =
              req.body.data.lastname + " " + req.body.data.firstname;
            delete req.body.data.confirmPassword;
            conn.query(
              "SELECT * FROM users WHERE email=?",
              [req.body.data.email],
              function (err, rows, fields) {
                if (err) {
                  console.error("SQL error:", err);
                  res.json({
                    code: 100,
                    status: "Error in connection database",
                  });
                  return next(err);
                }
                var response = {};
                if (rows.length >= 1) {
                  response.success = false;
                  response.info = "Email already exists!";
                  res.json(response);
                } else {
                  conn.query(
                    "insert into users SET ?",
                    req.body.data,
                    function (err, rows) {
                      if (err) {
                        conn.release();
                        return res.json(err);
                      }

                      var newUserSID = directorSID + "-" + rows.insertId;
                      console.log(newUserSID);
                      conn.query(
                        "update users set sid = '" +
                          newUserSID +
                          "', active = 1 where id = '" +
                          rows.insertId +
                          "'",
                        function (err, rows, fields) {
                          conn.release();
                          if (!err) {
                            response.id = rows.insertId;
                            response.success = true;
                          } else {
                            response.success = false;
                            response.info = "Error";
                          }
                          res.json(response);
                        }
                      );
                    }
                  );
                }
              }
            );
          } else {
            conn.release();
            res.json(rows);
          }
        }
      );
    });
  } catch (ex) {
    console.error("Internal error: " + ex);
    return next(ex);
  }
});

// NOT automatically set active on 1 and want to send confirm mail
router.post("/joinToFromReferral", (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        console.error("SQL Connection error: ", err);
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return next(err);
      }
      conn.query(
        "SELECT * from users where sha1(id) = '" + req.body.directorId + "'",
        function (err, rows, fields) {
          // conn.release();
          if (err) {
            conn.release();
            return res.json(err);
          }
          if (rows.length !== 0) {
            var directorSID = rows[0].sid;
            req.body.data.password = sha1(req.body.data.password);
            req.body.data.fullname =
              req.body.data.lastname + " " + req.body.data.firstname;
            delete req.body.data.confirmPassword;
            conn.query(
              "SELECT * FROM users WHERE email=?",
              [req.body.data.email],
              function (err, rows, fields) {
                if (err) {
                  console.error("SQL error:", err);
                  res.json({
                    code: 100,
                    status: "Error in connection database",
                  });
                  return next(err);
                }
                var response = {};
                if (rows.length >= 1) {
                  response.success = false;
                  response.info = "Email already exists!";
                  res.json(response);
                } else {
                  conn.query(
                    "insert into users SET ?",
                    req.body.data,
                    function (err, rows) {
                      if (err) {
                        conn.release();
                        return res.json(err);
                      }

                      var newUserSID = directorSID + "-" + rows.insertId;
                      console.log(newUserSID);
                      conn.query(
                        "update users set sid = '" +
                          newUserSID +
                          "' where id = '" +
                          rows.insertId +
                          "'",
                        function (err, rows, fields) {
                          conn.release();
                          if (!err) {
                            response.id = rows.insertId;
                            response.success = true;
                          } else {
                            response.success = false;
                            response.info = "Error";
                          }
                          res.json(response);
                        }
                      );
                    }
                  );
                }
              }
            );
          } else {
            conn.release();
            res.json(rows);
          }
        }
      );
    });
  } catch (ex) {
    console.error("Internal error: " + ex);
    return next(ex);
  }
});

router.post("/signUp", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    console.log(conn);
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }

    var response = {};
    delete req.body.confirmPassword;
    req.body.password = sha1(req.body.password);

    conn.query("SELECT * FROM users WHERE email=?", [req.body.email], function (
      err,
      rows,
      fields
    ) {
      if (err) {
        console.error("SQL error:", err);
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return next(err);
      }

      if (rows.length >= 1) {
        response.success = false;
        response.info = "Email already exists!";
        res.json(response);
      } else {
        req.body.fullname = req.body.lastname + " " + req.body.firstname;
        conn.query("insert into users SET ?", req.body, function (err, rows) {
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
              status: "Error in connection database",
            });
            console.log(err);
          }
        });
      }
    });
    conn.on("error", function (err) {
      console.log("[mysql error]", err);
    });
  });
});

router.post("/searchUser", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    console.log(req.body);
    conn.query(
      "SELECT * from users where active = 1 and fullname like '%" +
        req.body.filter +
        "%'",
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(rows);
        } else {
          res.json(null);
        }
      }
    );

    conn.on("error", function (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    });
  });
});

router.get("/getPeopleYouMightKnow", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    var id = req.params.id;
    conn.query("SELECT *, rTrue.help, rFalse.notHelp from users u left join (SELECT id_user, count(*) as help from recommendation where status = 1 group by id_user)rTrue on rTrue.id_user = sha1(u.id) left join (SELECT id_user, count(*) as notHelp from recommendation where status = 0 group by id_user)rFalse on rFalse.id_user = sha1(u.id) order by RAND() limit 5", function (
      err,
      rows
    ) {
      conn.release();
      if (!err) {
        res.json(rows);
      } else {
        res.json({
          code: 100,
          status: "Error in connection database",
        });
      }
    });
  });
});

router.get("/deleteMember/:id", (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        console.error("SQL Connection error: ", err);
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return next(err);
      } else {
        conn.query(
          "delete from users where id = '" + req.params.id + "'",
          function (err, rows, fields) {
            conn.release();
            if (err) {
              res.send(err);
            } else {
              res.send(true);
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

router.post("/updateMember", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    response = {};
    req.body.fullname = req.body.lastname + " " + req.body.firstname;
    delete req.body.bankAccount;
    delete req.body.iban;
    delete req.body.bic;
    conn.query(
      "UPDATE users SET ? where id = '" + req.body.id + "'",
      [req.body],
      function (err, rows) {
        conn.release();
        if (err) {
          res.send(err);
        } else {
          res.send(true);
        }
      }
    );
    conn.on("error", function (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    });
  });
});

router.post("/createMember", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    console.log(conn);
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }

    response = {};

    conn.query("insert into users SET ?", req.body, function (err, rows) {
      conn.release();
      if (!err) {
        if (!err) {
          response.id = rows.insertId;
          response.success = true;
        } else {
          response.success = false;
        }
        res.json(response);
      } else {
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        console.log(err);
      }
    });
    conn.on("error", function (err) {
      console.log("[mysql error]", err);
    });
  });
});

router.post("/updatePaymentStatus", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    console.log(req.body.id);
    const activePremiumDate = new Date();
    conn.query(
      "UPDATE users SET type = 3, activePremiumDate = '" +
        activePremiumDate +
        "' where id = '" +
        req.body.id +
        "'",
      function (err, rows) {
        conn.release();
        if (err) {
          res.send(err);
        } else {
          res.send(true);
        }
      }
    );
    conn.on("error", function (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    });
  });
});

router.post("/uploadImage", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    test = {};
    var id = req.body.id;
    console.log(req.body);
    // console.log(fs);
    var img = fs.readFileSync(
      "C:\\Users\\Aleksandar\\Pictures\\" + "468739.jpg"
    );

    conn.query(
      "UPDATE users SET img = ? where id = '" + id + "'",
      [img],
      function (err, rows) {
        conn.release();
        if (!err) {
          if (!err) {
            test = {
              img: img,
            };
          } else {
            test.success = false;
          }
          res.json(test);
          console.log("Usao sam u DB!!!!");
        } else {
          res.json({
            code: 100,
            status: "Error in connection database",
          });
          console.log(err);
        }
      }
    );
  });
});

router.post("/uploadImage1", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    test = {};
    conn.query(
      "UPDATE users SET img = '" + req.body.myFile + "' where id = 1",
      function (err, rows) {
        conn.release();
        if (!err) {
          if (!err) {
            test = {
              img: img,
            };
          } else {
            test.success = false;
          }
          res.json(test);
        } else {
          res.json({
            code: 100,
            status: "Error in connection database",
          });
          console.log(err);
        }
      }
    );
  });
});

router.post("/createExperience", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    console.log(conn);
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }

    response = {};

    conn.query("insert into experience SET ?", req.body, function (err, rows) {
      conn.release();
      if (!err) {
        if (!err) {
          response.id = rows.insertId;
          response.success = true;
        } else {
          response.success = false;
        }
        res.json(response);
      } else {
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        console.log(err);
      }
    });
    conn.on("error", function (err) {
      console.log("[mysql error]", err);
    });
  });
});

router.get("/getExperience/:id", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    var id = req.params.id;
    conn.query(
      "SELECT * from experience where id_user = ? order by toDate asc",
      [id],
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(rows);
        } else {
          res.json({
            code: 100,
            status: "Error in connection database",
          });
        }
      }
    );
  });
});

router.post("/updateExperience", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }

    var id = req.body.id;
    conn.query(
      "update experience SET ? where id = '" + id + "'",
      req.body,
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(true);
        } else {
          res.json({
            code: 100,
            status: "Error in connection database",
          });
          console.log(err);
        }
      }
    );
    conn.on("error", function (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    });
  });
});

router.get("/deleteExperience/:id", (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        console.error("SQL Connection error: ", err);
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return next(err);
      } else {
        conn.query(
          "delete from experience where id = '" + req.params.id + "'",
          function (err, rows, fields) {
            conn.release();
            if (err) {
              res.send(err);
            } else {
              res.send(true);
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

router.post("/createEducation", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    console.log(conn);
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }

    response = {};

    conn.query("insert into education SET ?", req.body, function (err, rows) {
      conn.release();
      if (!err) {
        if (!err) {
          response.id = rows.insertId;
          response.success = true;
        } else {
          response.success = false;
        }
        res.json(response);
      } else {
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        console.log(err);
      }
    });
    conn.on("error", function (err) {
      console.log("[mysql error]", err);
    });
  });
});

router.get("/getEducation/:id", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    var id = req.params.id;
    conn.query(
      "SELECT * from education where id_user = ? order by toDate asc",
      [id],
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(rows);
        } else {
          res.json({
            code: 100,
            status: "Error in connection database",
          });
        }
      }
    );
  });
});

router.post("/updateEducation", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }

    var id = req.body.id;
    conn.query(
      "update education SET ? where id = '" + id + "'",
      req.body,
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(true);
        } else {
          res.json({
            code: 100,
            status: "Error in connection database",
          });
          console.log(err);
        }
      }
    );
    conn.on("error", function (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    });
  });
});

router.get("/deleteEducation/:id", (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        console.error("SQL Connection error: ", err);
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return next(err);
      } else {
        conn.query(
          "delete from education where id = '" + req.params.id + "'",
          function (err, rows, fields) {
            conn.release();
            if (err) {
              res.send(err);
            } else {
              res.send(true);
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

router.post("/createLookingOffer", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    console.log(conn);
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }

    response = {};

    conn.query("insert into lookingOffer SET ?", req.body, function (
      err,
      rows
    ) {
      conn.release();
      if (!err) {
        if (!err) {
          response.id = rows.insertId;
          response.success = true;
        } else {
          response.success = false;
        }
        res.json(response);
      } else {
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        console.log(err);
      }
    });
    conn.on("error", function (err) {
      console.log("[mysql error]", err);
    });
  });
});

router.get("/getLookingOffer/:id", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    var id = req.params.id;
    conn.query("SELECT * from lookingOffer where id_user = ?", [id], function (
      err,
      rows
    ) {
      conn.release();
      if (!err) {
        res.json(rows);
      } else {
        res.json({
          code: 100,
          status: "Error in connection database",
        });
      }
    });
  });
});

router.post("/updateLookingOffer", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }

    var id = req.body.id;
    conn.query(
      "update lookingOffer SET ? where id = '" + id + "'",
      req.body,
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(true);
        } else {
          res.json({
            code: 100,
            status: "Error in connection database",
          });
          console.log(err);
        }
      }
    );
    conn.on("error", function (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    });
  });
});

router.get("/deleteLookingOffer/:id", (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        console.error("SQL Connection error: ", err);
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return next(err);
      } else {
        conn.query(
          "delete from lookingOffer where id = '" + req.params.id + "'",
          function (err, rows, fields) {
            conn.release();
            if (err) {
              res.send(err);
            } else {
              res.send(true);
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

router.post("/createAdditionalInfo", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    console.log(conn);
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }

    response = {};

    conn.query("insert into additionalInfo SET ?", req.body, function (
      err,
      rows
    ) {
      conn.release();
      if (!err) {
        if (!err) {
          response.id = rows.insertId;
          response.success = true;
        } else {
          response.success = false;
        }
        res.json(response);
      } else {
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        console.log(err);
      }
    });
    conn.on("error", function (err) {
      console.log("[mysql error]", err);
    });
  });
});

router.get("/getAdditionalInfo/:id", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    var id = req.params.id;
    conn.query(
      "SELECT * from additionalInfo where id_user = ?",
      [id],
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(rows);
        } else {
          res.json({
            code: 100,
            status: "Error in connection database",
          });
        }
      }
    );
  });
});

router.post("/updateAdditionalInfo", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }

    var id = req.body.id;
    conn.query(
      "update additionalInfo SET ? where id = '" + id + "'",
      req.body,
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(true);
        } else {
          res.json({
            code: 100,
            status: "Error in connection database",
          });
          console.log(err);
        }
      }
    );
    conn.on("error", function (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    });
  });
});

router.get("/deleteAdditionalInfo/:id", (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        console.error("SQL Connection error: ", err);
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return next(err);
      } else {
        conn.query(
          "delete from additionalInfo where id = '" + req.params.id + "'",
          function (err, rows, fields) {
            conn.release();
            if (err) {
              res.send(err);
            } else {
              res.send(true);
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

router.post("/createBankAccount", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    console.log(conn);
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }

    response = {};

    conn.query("insert into bankAccount SET ?", req.body, function (err, rows) {
      conn.release();
      if (!err) {
        if (!err) {
          response.id = rows.insertId;
          response.success = true;
        } else {
          response.success = false;
        }
        res.json(response);
      } else {
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        console.log(err);
      }
    });
    conn.on("error", function (err) {
      console.log("[mysql error]", err);
    });
  });
});

router.get("/getBankAccount/:id", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    var id = req.params.id;
    conn.query("SELECT * from bankAccount where id_user = ?", [id], function (
      err,
      rows
    ) {
      conn.release();
      if (!err) {
        res.json(rows);
      } else {
        res.json({
          code: 100,
          status: "Error in connection database",
        });
      }
    });
  });
});

router.post("/updateBankAccount", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }

    var id = req.body.id;
    conn.query(
      "update bankAccount SET ? where id = '" + id + "'",
      req.body,
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(true);
        } else {
          res.json({
            code: 100,
            status: "Error in connection database",
          });
          console.log(err);
        }
      }
    );
    conn.on("error", function (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    });
  });
});

router.get("/deleteBankAccount/:id", (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        console.error("SQL Connection error: ", err);
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return next(err);
      } else {
        conn.query(
          "delete from bankAccount where id = '" + req.params.id + "'",
          function (err, rows, fields) {
            conn.release();
            if (err) {
              res.send(err);
            } else {
              res.send(true);
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

router.post("/updatePassword", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    console.log(conn);
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }

    var response = null;

    conn.query(
      "update users set password = '" +
        sha1(req.body.new) +
        "' where id = '" +
        req.body.id +
        "'",
      function (err, rows, fields) {
        conn.release();
        if (err) {
          console.error("SQL error:", err);
          res.json({
            code: 100,
            status: "Error in connection database",
          });
          return next(err);
        } else {
          response = true;
          res.json(response);
        }
      }
    );
    conn.on("error", function (err) {
      console.log("[mysql error]", err);
    });
  });
});

router.get("/recommendedCount/:id/:status", (req, res, next) => {
  try {
    var reqObj = req.params.id;

    console.log(reqObj);
    connection.getConnection(function (err, conn) {
      if (err) {
        console.error("SQL Connection error: ", err);
        res.json({
          code: 100,
          status: "Error in connection database",
        });
        return next(err);
      } else {
        var date = new Date().toDateString();
        const data = {
          id_user: sha1(req.params.id),
          status: req.params.status,
          date: new Date().toDateString(),
        };
        conn.query("insert into recommendation SET ?", data, function (
          err,
          rows,
          fields
        ) {
          conn.release();
          if (err) {
            res.json(err);
            return next(err);
          } else {
            res.writeHead(302, {
              Location: "/recommended-answer",
            });
            res.end();
          }
        });
      }
    });
  } catch (ex) {
    console.error("Internal error: " + ex);
    return next(ex);
  }
});

router.get("/getRecommendation/:id", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database",
      });
      return;
    }
    var id = req.params.id;
    console.log(id);
    conn.query("SELECT status, count(*) as count from recommendation where id_user = '" + req.params.id +  "' group by status", function (err, rows) {
      conn.release();
      if (!err) {
        res.json(rows);
      } else {
        res.json(err);
      }
    });
  });
});

module.exports = router;
