var express = require("express");
var nodemailer = require("nodemailer");
var router = express.Router();
var sha1 = require("sha1");
var hogan = require("hogan.js");
var fs = require("fs");
const mysql = require("mysql");

var link = "http://localhost:3000/api/";
var linkClinet = "http://localhost:4200/";

var connection = mysql.createPool({
  host: "185.178.193.141",
  user: "appproduction.",
  password: "jBa9$6v7",
  database: "business_circle"
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
    "./server/templates/confirmMail.hjs",
    "utf-8"
  );
  var compiledTemplate = hogan.compile(confirmTemplate);
  var verificationLinkButton =
    link + "user/verification/" + sha1(req.body.email);

  var mailOptions = {
    from: '"BCI" info@app-production.eu',
    to: req.body.email,
    subject: "Confirm registration",
    html: compiledTemplate.render({
      firstName: req.body.firstname,
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
    "./server/templates/forgotMail.hjs",
    "utf-8"
  );
  var compiledTemplate = hogan.compile(confirmTemplate);
  var verificationLinkButton =
    "http://localhost:4200/change-password/" + sha1(req.body.email);

  var mailOptions = {
    from: '"BCI" info@app-production.eu',
    to: req.body.email,
    subject: "Reset password",
    html: compiledTemplate.render({
      firstName: req.body.firstname,
      verificationLink: verificationLinkButton
    })
  };

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
      res.json(error);
    } else {
      console.log("Message sent: " + response);
      res.json("sent");
    }
  });
});

router.post("/inviteFriend", function(req, res) {
  var confirmTemplate = fs.readFileSync(
    "./server/templates/inviteFriend.hjs",
    "utf-8"
  );
  var compiledTemplate = hogan.compile(confirmTemplate);
  var inviteLink =
   linkClinet + "login/join-to/" + req.body.directorId;

  var mailOptions = {
    from: '"BCI" info@app-production.eu',
    to: req.body.email,
    subject: "Join to my team!",
    html: compiledTemplate.render({
      message: req.body.message,
      inviteLink: inviteLink
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

router.post("/sendQuestion", function(req, res) {
  var confirmTemplate = fs.readFileSync(
    "./server/templates/sendQuestion.hjs",
    "utf-8"
  );
  var compiledTemplate = hogan.compile(confirmTemplate);
  var inviteLink =
   linkClinet + "login/join-to/" + req.body.directorId;

  var mailOptions = {
    from: '"BCI" info@app-production.eu',
    to: "kojaaa95@gmail.com",
    subject: "Message from " + req.body.name,
    html: compiledTemplate.render({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      phone: req.body.phone,
      message: req.body.message
    })
  };
  /*let ime = req.body.name;
  let naslov = req.body.subject;
  let email = req.body.email;
  let poruka = req.body.message;
  let mail = "Sent: \n" + ime + "\n" + email + "\n\n" + poruka;

  console.log(mail);
  var mailOptions = {
    // to: "info@app-production.eu",
    from: '"BCI" info@app-production.eu',
    to: "kojaaa95@gmail.com",
    subject: naslov,
    text: mail
  };*/

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      res.send(false);
    } else {
      res.send(true);
    }
  });
});

router.post("/sendFacture", function(req, res) {
  var confirmTemplate = fs.readFileSync(
    "./server/templates/facture.hjs",
    "utf-8"
  );
  var compiledTemplate = hogan.compile(confirmTemplate);

  var mailOptions = {
    from: '"BCI" info@app-production.eu',
    to: req.body.email,
    subject: req.body.premiumSubject,
    html: compiledTemplate.render({
      invoice: req.body.premiumInvoice,
      id: req.body.id,
      regardsFirst: req.body.premiumRegardsFirst,
      regardsEnd: req.body.premiumRegardsEnd,
      name: req.body.name,
      message: req.body.premiumMessage,
      status: req.body.premiumStatus,
      pending: req.body.premiumPending,
      bankAccount: req.body.premiumBankAccount,
      or: req.body.premiumOr,
      screenQRCode: req.body.premiumScreenQRCode,
      item: req.body.premiumItem,
      unitCost: req.body.premiumUnitCost,
      qty: req.body.premiumQty,
      total: req.body.premiumTotal,
      premiumAccount: req.body.premiumPremiumAccount,
      thanksForUsing: req.body.premiumThanksForUsing,
      haveQuestion: req.body.premiumHaveQuestion,
      automateMail: req.body.premiumAutomateMail,
      copyRight: req.body.premiumCopyRight
    })
  };

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
      res.json(error);
    } else {
      console.log("Message sent: " + response);
      res.json(true);
    }
  });
});

module.exports = router;
