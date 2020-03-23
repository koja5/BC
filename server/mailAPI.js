var express = require("express");
var nodemailer = require("nodemailer");
var router = express.Router();
var sha1 = require("sha1");
var hogan = require("hogan.js");
var fs = require("fs");
const mysql = require("mysql");

var link = "http://localhost:3000/api/";

var connection = mysql.createPool({
  host: "185.178.193.141",
  user: "appproduction.",
  password: "jBa9$6v7",
  database: "management_prod"
});

var smtpTransport = nodemailer.createTransport({
  host: "78.47.206.131",
  port: 25,
  secure: false,
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: "info@app-production.eu",
    pass: "jBa9$6v7"
  }
});

//slanje maila pri registraciji

router.post("/send", function(req, res) {
  var confirmTemplate = fs.readFileSync(
    "./server/routes/templates/confirmMail.hjs",
    "utf-8"
  );
  var compiledTemplate = hogan.compile(confirmTemplate);
  var verificationLinkButton =
    link + "korisnik/verifikacija/" + sha1(req.body.email);

  var mailOptions = {
    from: '"ClinicNode" info@app-production.eu',
    to: req.body.email,
    subject: "Confirm registration",
    html: compiledTemplate.render({
      firstName: req.body.shortname,
      verificationLink: verificationLinkButton
    })
  };

  smtpTransport.sendMail(mailOptions, function(error, response) {
    console.log(response);
    if (error) {
      console.log(error);
      res.end("error");
    } else {
      console.log("Message sent: " + response.message);
      res.end("sent");
    }
  });
});

//slanje mail-a kada korisnik zaboravi lozinku

router.post("/forgotmail", function(req, res) {
  var confirmTemplate = fs.readFileSync(
    "./server/routes/templates/forgotMail.hjs",
    "utf-8"
  );
  var compiledTemplate = hogan.compile(confirmTemplate);
  var verificationLinkButton =
    "http://localhost:4200/changePassword/" + sha1(req.body.email);

  var mailOptions = {
    from: '"ClinicNode" info@app-production.eu',
    to: req.body.email,
    subject: "Reset password",
    html: compiledTemplate.render({
      firstName: req.body.shortname,
      verificationLink: verificationLinkButton
    })
  };

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
      res.end(error);
    } else {
      console.log("Message sent: " + response);
      res.end("sent");
    }
  });
});

router.post("/askQuestion", function(req, res) {
  let ime = req.body.ime;
  let naslov = req.body.naslov;
  let email = req.body.email;
  let poruka = req.body.poruka;
  let mail = "Posiljalac: \n" + ime + "\n" + email + "\n\n" + poruka;

  console.log(mail);
  var mailOptions = {
    to: "info@app-production.eu",
    subject: naslov,
    text: mail
  };

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
      res.send({ message: "error" });
    } else {
      console.log("Message sent: " + response.message);
      res.send({ message: "sent" });
    }
  });
});

router.post("/sendConfirmArrivalAgain", function(req, res) {
  connection.getConnection(function(err, conn) {
    var confirmTemplate = fs.readFileSync(
      "./server/routes/templates/confirmArrival.hjs",
      "utf-8"
    );
    var compiledTemplate = hogan.compile(confirmTemplate);
    if (err) {
      res.json({
        code: 100,
        status: "Error in connection database"
      });
      return;
    }
    console.log(req.body);
    conn.query(
      "SELECT c.shortname, c.email, t.start, t.end, u.lastname, u.firstname, th.therapies_title from customers c join tasks t on c.id = t.customer_id join therapy th on t.therapy_id = th.id join users u on t.creator_id = u.id where c.id = '" +
        req.body.customer_id +
        "' and t.id = '" +
        req.body.id +
        "'",
      function(err, rows, fields) {
        if (err) {
          console.error("SQL error:", err);
        }
        console.log(rows);
        rows.forEach(function(to, i, array) {
          var verificationLinkButton =
            link + "task/confirmationArrival/" + req.body.id;
          var convertToDateStart = new Date(to.start);
          var convertToDateEnd = new Date(to.end);
          var startHours = convertToDateStart.getHours();
          var startMinutes = convertToDateStart.getMinutes();
          var endHours = convertToDateEnd.getHours();
          var endMinutes = convertToDateEnd.getMinutes();
          var date =
            convertToDateStart.getDay() +
            "." +
            convertToDateStart.getMonth() +
            "." +
            convertToDateStart.getFullYear();
          var start =
            (startHours < 10 ? "0" + startHours : startHours) +
            ":" +
            (startMinutes < 10 ? "0" + startMinutes : startMinutes);
          var end =
            (endHours < 10 ? "0" + endHours : endHours) +
            ":" +
            (endMinutes < 10 ? "0" + endMinutes : endMinutes);
          var mailOptions = {
            from: '"ClinicNode" info@app-production.eu',
            subject: "Confirm arrival",
            html: compiledTemplate.render({
              firstName: to.shortname,
              verificationLink: verificationLinkButton,
              date: date,
              start: start,
              end: end,
              therapy: to.therapies_title,
              doctor: to.lastname + " " + to.firstname
            })
          };
          mailOptions.to = to.email;
          smtpTransport.sendMail(mailOptions, function(error, response) {
            console.log(response);
            if (error) {
              console.log(error);
            } else {
              console.log("Message sent: " + response.message);
            }
          });
        });
      }
    );
    conn.on("error", function(err) {
      console.log("[mysql error]", err);
    });
  });
});

module.exports = router;
