var express = require("express");
var nodemailer = require("nodemailer");
var router = express.Router();
var sha1 = require("sha1");
var hogan = require("hogan.js");
var fs = require("fs");
const mysql = require("mysql");

var link = "http://localhost:3000/api/";
var linkClient = "http://localhost:4200/";

var connection = mysql.createPool({
  host: "185.178.193.141",
  user: "appproduction.",
  password: "jBa9$6v7",
  database: "business_circle",
});

var smtpTransport = nodemailer.createTransport({
  host: "116.203.85.82",
  port: 25,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: "info@app-production.eu",
    pass: "jBa9$6v7",
  },
});

//slanje maila pri registraciji

router.post("/send", function (req, res) {
  var confirmTemplate = fs.readFileSync(
    "./server/templates/confirmMail.hjs",
    "utf-8"
  );
  var compiledTemplate = hogan.compile(confirmTemplate);
  var verificationLinkButton =
    link + "user/verification/" + sha1(req.body.email);
  console.log(req.body);
  var mailOptions = {
    from: '"BCI" info@app-production.eu',
    to: req.body.email,
    subject: req.body.language.confirmMailSubject,
    html: compiledTemplate.render({
      firstName: req.body.firstname,
      verificationLink: verificationLinkButton,
      confirmMailBCITitle: req.body.language.confirmMailBCITitle,
      confirmMailRegardsFirst: req.body.language.confirmMailRegardsFirst,
      confirmMailMessage: req.body.language.confirmMailMessage,
      confirmMailConfirmEmailButton:
        req.body.language.confirmMailConfirmEmailButton,
      confirmMailRegardsEnd: req.body.language.confirmMailRegardsEnd,
      confirmMailBCISignature: req.body.language.confirmMailBCISignature,
      confirmMailThanksForUsing: req.body.language.confirmMailThanksForUsing,
      confirmMailHaveQuestion: req.body.language.confirmMailHaveQuestion,
      confirmMailGenerateMail: req.body.language.confirmMailGenerateMail,
      confirmMailCopyright: req.body.language.confirmMailCopyright,
    }),
  };

  smtpTransport.sendMail(mailOptions, function (error, response) {
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

router.post("/forgotmail", function (req, res) {
  var confirmTemplate = fs.readFileSync(
    "./server/templates/forgotMail.hjs",
    "utf-8"
  );
  var compiledTemplate = hogan.compile(confirmTemplate);
  var verificationLinkButton =
    linkClient + "login/change-password/" + sha1(req.body.email);

  var mailOptions = {
    from: '"BCI" info@app-production.eu',
    to: req.body.email,
    subject: req.body.language.forgotMailSubject,
    html: compiledTemplate.render({
      firstName: req.body.firstname,
      verificationLink: verificationLinkButton,
      forgotMailBCITitle: req.body.language.forgotMailBCITitle,
      forgotMailRegardsFirst: req.body.language.forgotMailRegardsFirst,
      forgotMailMessage: req.body.language.forgotMailMessage,
      forgotMailConfirmEmailButton:
        req.body.language.forgotMailConfirmEmailButton,
      forgotMailRegardsEnd: req.body.language.forgotMailRegardsEnd,
      forgotMailBCISignature: req.body.language.forgotMailBCISignature,
      forgotMailThanksForUsing: req.body.language.forgotMailThanksForUsing,
      forgotMailHaveQuestion: req.body.language.forgotMailHaveQuestion,
      forgotMailGenerateMail: req.body.language.forgotMailGenerateMail,
      forgotMailCopyright: req.body.language.forgotMailCopyright,
    }),
  };

  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
      res.json(error);
    } else {
      console.log("Message sent: " + response);
      res.json("sent");
    }
  });
});

router.post("/inviteFriend", function (req, res) {
  var confirmTemplate = fs.readFileSync(
    "./server/templates/inviteFriend.hjs",
    "utf-8"
  );
  var compiledTemplate = hogan.compile(confirmTemplate);
  var inviteLink =
    linkClient +
    "login/join-to/" +
    req.body.directorId +
    "/" +
    req.body.email +
    "/" +
    req.body.firstname +
    "/" +
    req.body.lastname;

  var mailOptions = {
    from: '"BCI" info@app-production.eu',
    to: req.body.email,
    subject: req.body.language.inviteFriendSubject,
    html: compiledTemplate.render({
      message: req.body.message,
      inviteLink: inviteLink,
      inviteFriendBCITitle: req.body.language.inviteFriendBCITitle,
      inviteFriendJoinTo: req.body.language.inviteFriendJoinTo,
      inviteFriendThanksForUsing: req.body.language.inviteFriendThanksForUsing,
      inviteFriendHaveQuestion: req.body.language.inviteFriendHaveQuestion,
      inviteFriendGenerateMail: req.body.language.inviteFriendGenerateMail,
      inviteFriendCopyright: req.body.language.inviteFriendCopyright,
    }),
  };

  smtpTransport.sendMail(mailOptions, function (error, response) {
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

router.post("/sendQuestion", function (req, res) {
  var confirmTemplate = fs.readFileSync(
    "./server/templates/sendQuestion.hjs",
    "utf-8"
  );
  var compiledTemplate = hogan.compile(confirmTemplate);
  var inviteLink = linkClient + "login/join-to/" + req.body.directorId;

  var mailOptions = {
    from: '"BCI" info@app-production.eu',
    to: "kojaaa95@gmail.com",
    subject: req.body.language.sendQuestionSubjectTitle + " " + req.body.name,
    html: compiledTemplate.render({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      phone: req.body.phone,
      message: req.body.message,
      sendQuestionBCITitle: req.body.language.sendQuestionBCITitle,
      sendQuestionRegardsFirst: req.body.language.sendQuestionRegardsFirst,
      sendQuestionMessage: req.body.language.sendQuestionMessage,
      sendQuestionName: req.body.language.sendQuestionName,
      sendQuestionPhone: req.body.language.sendQuestionPhone,
      sendQuestionEmail: req.body.language.sendQuestionEmail,
      sendQuestionSubject: req.body.language.sendQuestionSubject,
      sendQuestionMessageClient: req.body.language.sendQuestionMessageClient,
      sendQuestionRegardsEnd: req.body.language.sendQuestionRegardsEnd,
      sendQuestionBCISignature: req.body.language.sendQuestionBCISignature,
      sendQuestionThanksForUsing: req.body.language.sendQuestionThanksForUsing,
      sendQuestionHaveQuestion: req.body.language.sendQuestionHaveQuestion,
      sendQuestionGenerateMail: req.body.language.sendQuestionGenerateMail,
      sendQuestionCopyright: req.body.language.sendQuestionCopyright,
    }),
  };

  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      res.send(false);
    } else {
      res.send(true);
    }
  });
});

router.post("/sendNewMemberJoined", function (req, res) {
  var confirmTemplate = fs.readFileSync(
    "./server/templates/newMemberJoined.hjs",
    "utf-8"
  );
  var compiledTemplate = hogan.compile(confirmTemplate);

  var mailOptions = {
    from: '"BCI" info@app-production.eu',
    to: req.body.directorEmail,
    subject: req.body.language.newMemberJoinedSubject,
    html: compiledTemplate.render({
      name: req.body.name,
      email: req.body.email,
      newMemberJoinedTitle: req.body.language.newMemberJoinedTitle,
      newMemberJoinedRegardsFirst:
        req.body.language.newMemberJoinedRegardsFirst,
      newMemberJoinedMessage: req.body.language.newMemberJoinedMessage,
      newMemberJoinedName: req.body.language.newMemberJoinedName,
      newMemberJoinedEmail: req.body.language.newMemberJoinedEmail,
      newMemberJoinedRegardsEnd: req.body.language.newMemberJoinedRegardsEnd,
      newMemberJoinedSignature: req.body.language.newMemberJoinedSignature,
      newMemberJoinedThanksForUsing:
        req.body.language.newMemberJoinedThanksForUsing,
      newMemberJoinedHaveQuestion:
        req.body.language.newMemberJoinedHaveQuestion,
      newMemberJoinedGenerateMail:
        req.body.language.newMemberJoinedGenerateMail,
      newMemberJoinedCopyright: req.body.language.newMemberJoinedCopyright,
    }),
  };

  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      res.send(false);
    } else {
      res.send(true);
    }
  });
});

router.post("/sendFacture", function (req, res) {
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
      confirmMailBCISignature: req.body.premiumConfirmMailBCISignature,
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
      copyRight: req.body.premiumCopyRight,
      fullname: req.body.name,
      street: req.body.street,
      zip: req.body.zip,
      location: req.body.location,
      email: req.body.email,
      phone: req.body.phone,
      mobile1: req.body.mobile1,
      mobile2: req.body.mobile2,
      premiumItemPrice: req.body.premiumItemPrice,
      premiumItemCount: req.body.premiumItemCount,
      premiumItemTotal: req.body.premiumItemTotal,
    }),
  };

  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
      res.json(error);
    } else {
      console.log("Message sent: " + response);
      res.json(true);
    }
  });
});

router.post("/sendRecommended", function (req, res) {
  var confirmTemplate = fs.readFileSync(
    "./server/templates/recommended.hjs",
    "utf-8"
  );
  var recommendedLink = link + "recommendedCount/" + req.body.recommendedId;
  var recommendedMemberProfileLink =
    linkClient + "home/main/profile/" + sha1(req.body.recommendedId.toString());
  var compiledTemplate = hogan.compile(confirmTemplate);

  var mailOptions = {
    from: '"BCI" info@app-production.eu',
    to: req.body.sendRecommendation,
    subject: req.body.language.recommendedSubject,
    html: compiledTemplate.render({
      recommendedName: req.body.recommendedName,
      recommendedEmail: req.body.recommendedEmail,
      recommendedPhone: req.body.recommendedPhone,
      whoRecommended: req.body.whoRecommended,
      recommendedBCITitle: req.body.language.recommendedBCITitle,
      recommendedMessage: req.body.language.recommendedMessage,
      recommendedHelpful: req.body.language.recommendedHelpful,
      recommendedNotHelpful: req.body.language.recommendedNotHelpful,
      recommendedThanksForUsing: req.body.language.recommendedThanksForUsing,
      recommendedHaveQuestion: req.body.language.recommendedHaveQuestion,
      recommendedGenerateMail: req.body.language.recommendedGenerateMail,
      recommendedCopyright: req.body.language.recommendedCopyright,
      recommendedMemberName: req.body.language.recommendedMemberName,
      recommendedMemberEmail: req.body.language.recommendedMemberEmail,
      recommendedMemberPhone: req.body.language.recommendedMemberPhone,
      recommendedWhoRecommendedMember:
        req.body.language.recommendedWhoRecommendedMember,
      recommendedMemberShowProfile:
        req.body.language.recommendedMemberShowProfile,
      recommendedMemberProfileLink: recommendedMemberProfileLink,
      helpfullCount: recommendedLink + "/1",
      notHelpfullCount: recommendedLink + "/0",
    }),
  };

  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      res.send(false);
    } else {
      res.send(true);
    }
  });
});

router.post("/sendInviteForEvent", function (req, res) {
  var confirmTemplate = fs.readFileSync(
    "./server/templates/inviteFriendsForEvent.hjs",
    "utf-8"
  );
  var compiledTemplate = hogan.compile(confirmTemplate);
  var inviteLink =
    linkClient + "/home/main/event/life-event-details/" + req.body.event_id;

  var inviterProfile = linkClient + "/home/main/profile/" + req.body.inviter_id;
  console.log(req.body);
  for (let i = 0; i < req.body.friends.length; i++) {
    var mailOptions = {
      from: '"BCI" info@app-production.eu',
      to: req.body.friends[i].email,
      subject: req.body.language.inviteFriendsForEventSubject,
      html: compiledTemplate.render({
        inviteFriendsForEventRegardsFirst:
          req.body.language.inviteFriendsForEventRegardsFirst,
        fullname: req.body.friends[i].fullname,
        inviteFriendsForEventMessage:
          req.body.language.inviteFriendsForEventMessage,
        inviteLink: inviteLink,
        inviterProvile: inviterProfile,
        inviter_fullname: req.body.inviter_fullname,
        inviteFriendBCITitle: req.body.language.inviteFriendBCITitle,
        inviteFriendsForEventInviteSend:
          req.body.language.inviteFriendsForEventInviteSend,
        inviteFriendsForEventShowEventDetails:
          req.body.language.inviteFriendsForEventShowEventDetails,
        inviteFriendsForEventThanksForUsing:
          req.body.language.inviteFriendsForEventThanksForUsing,
        inviteFriendsForEventHaveQuestion:
          req.body.language.inviteFriendsForEventHaveQuestion,
        inviteFriendsForEventGenerateMail:
          req.body.language.inviteFriendsForEventGenerateMail,
        inviteFriendsForEventCopyright:
          req.body.language.inviteFriendsForEventCopyright,
      }),
    };

    smtpTransport.sendMail(mailOptions, function (error, response) {
      console.log(response);
      if (error) {
        console.log(error);
        res.end("error");
      } else {
        console.log("Message sent: " + response.message);
        res.end("sent");
      }
    });
  }
});

router.post("/sendInviteToVirtualParticipantForEvent", function (req, res) {
  var confirmTemplate = fs.readFileSync(
    "./server/templates/inviteVirtualParticipantForEvent.hjs",
    "utf-8"
  );
  var compiledTemplate = hogan.compile(confirmTemplate);
  var inviteLink =
    linkClient + "/home/main/event/life-event-details/" + req.body.event_id;

  var inviterProfile = linkClient + "/home/main/profile/" + req.body.inviter_id;
  for (let i = 0; i < req.body.friends.length; i++) {
    var mailOptions = {
      from: '"BCI" info@app-production.eu',
      to: req.body.friends[i].email,
      subject: req.body.language.inviteVirtualParticipantForEventSubject,
      html: compiledTemplate.render({
        inviteVirtualParticipantForEventRegardsFirst:
          req.body.language.inviteVirtualParticipantForEventRegardsFirst,
        fullname: req.body.friends[i].fullname,
        inviteVirtualParticipantForEventMessage:
          req.body.language.inviteVirtualParticipantForEventMessage,
        inviteLink: inviteLink,
        inviterProvile: inviterProfile,
        inviter_fullname: req.body.inviter_fullname,
        inviteFriendBCITitle: req.body.language.inviteFriendBCITitle,
        inviteVirtualParticipantForEventInviteSend:
          req.body.language.inviteVirtualParticipantForEventInviteSend,
        inviteVirtualParticipantForEventShowEventDetails:
          req.body.language.inviteVirtualParticipantForEventShowEventDetails,
        inviteVirtualParticipantForEventThanksForUsing:
          req.body.language.inviteVirtualParticipantForEventThanksForUsing,
        inviteVirtualParticipantForEventHaveQuestion:
          req.body.language.inviteVirtualParticipantForEventHaveQuestion,
        inviteVirtualParticipantForEventGenerateMail:
          req.body.language.inviteVirtualParticipantForEventGenerateMail,
        inviteVirtualParticipantForEventCopyright:
          req.body.language.inviteVirtualParticipantForEventCopyright,
      }),
    };

    smtpTransport.sendMail(mailOptions, function (error, response) {
      console.log(response);
      if (error) {
        console.log(error);
        res.end("error");
      } else {
        console.log("Message sent: " + response.message);
        res.end("sent");
      }
    });
  }
});

router.post("/sendReminderForEvent", function (req, res) {
  var confirmTemplate = fs.readFileSync(
    "./server/templates/reminderFriendsForEvent.hjs",
    "utf-8"
  );
  var compiledTemplate = hogan.compile(confirmTemplate);
  var reminderLink =
    linkClient + "/home/main/event/life-event-details/" + req.body.event_id;

  var reminderProfile = linkClient + "/home/main/profile/" + req.body.inviter_id;

  for (let i = 0; i < req.body.friends.length; i++) {
    var mailOptions = {
      from: '"BCI" info@app-production.eu',
      to: req.body.friends[i].email,
      subject: req.body.language.reminderFriendsForEventSubject,
      html: compiledTemplate.render({
        reminderFriendsForEventRegardsFirst:
          req.body.language.reminderFriendsForEventRegardsFirst,
        fullname: req.body.friends[i].fullname,
        reminderFriendsForEventMessage:
          req.body.language.reminderFriendsForEventMessage,
        reminderLink: reminderLink,
        reminderProvile: reminderProfile,
        reminder_fullname: req.body.reminder_fullname,
        reminderFriendBCITitle: req.body.language.reminderFriendBCITitle,
        reminderFriendsForEventSend:
          req.body.language.reminderFriendsForEventSend,
        reminderFriendsForEventShowEventDetails:
          req.body.language.reminderFriendsForEventShowEventDetails,
        reminderFriendsForEventThanksForUsing:
          req.body.language.reminderFriendsForEventThanksForUsing,
        reminderFriendsForEventHaveQuestion:
          req.body.language.reminderFriendsForEventHaveQuestion,
        reminderFriendsForEventGenerateMail:
          req.body.language.reminderFriendsForEventGenerateMail,
        reminderFriendsForEventCopyright:
          req.body.language.reminderFriendsForEventCopyright,
      }),
    };

    smtpTransport.sendMail(mailOptions, function (error, response) {
      console.log(response);
      if (error) {
        console.log(error);
        res.end("error");
      } else {
        console.log("Message sent: " + response.message);
        res.end("sent");
      }
    });
  }
});

module.exports = router;
