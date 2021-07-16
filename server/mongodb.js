const express = require("express");
const router = express.Router();
const mongo = require("mongodb").MongoClient;
// var assert = require('assert');
const Schema = mongo.Schema;
// const url = 'mongodb://localhost:27017/management_mongodb';
// const url = 'mongodb://appprodu_appproduction_prod:CJr4eUqWg33tT97mxPFx@vps.app-production.eu:42526/management_mongodb'
// const url = "mongodb://116.203.85.82:27017/management_mongo?gssapiServiceName=mongodb";
// const url = "mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb";
// const url = "mongodb://admin:1234@localhost:27017/business_circle_mongodb?authSource=admin";
// const url = "mongodb://clinic_node:ClinicNode#2019@localhost:27017/business_circle_mongodb?authSource=admin";
const url =
    "mongodb+srv://clinic_node:1234@cluster0.54i4v.mongodb.net/test?authSource=admin&replicaSet=atlas-8om2st-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true";
const database_name = "business_circle_mongodb";
var ObjectId = require("mongodb").ObjectID;
const mysql = require("mysql");
var sha1 = require("sha1");

var connection = mysql.createPool({
    host: "185.178.193.141",
    user: "appproduction.",
    password: "jBa9$6v7",
    database: "business_circle",
});

connection.getConnection(function(err, conn) {
    console.log(conn);
    console.log(err);
});

router.get("/", (req, res) => {
    res.send("Initialize mongodb!");
});

router.post("/updateLanguage", function(req, res, next) {
    mongo.connect(url, function(err, db, res) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("user_configuration")
            .updateOne({ user_id: req.body.user_id }, { $set: { language: req.body.language } },
                function(err, res) {
                    if (err) throw err;
                }
            );
    });
    res.json({ code: 201 });
});

router.post("/updateTheme", function(req, res, next) {
    var item = {
        user_id: req.body.user_id,
        theme: req.body.theme,
    };

    mongo.connect(url, function(err, db, res) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("user_configuration")
            .updateOne({ user_id: item.user_id }, { $set: { theme: req.body.theme } },
                function(err, res) {
                    if (err) throw err;
                }
            );
    });
    res.json({ code: 201 });
});

router.post("/setSelectedStore", function(req, res, next) {
    var item = {
        user_id: req.body.user_id,
        selectedStore: req.body.selectedStore,
    };

    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("user_configuration")
            .findOne({ user_id: Number(req.body.user_id) }, function(err, rows) {
                if (err) throw err;
                console.log(rows);
                if (rows === null || rows.length === 0) {
                    dbo
                        .collection("user_configuration")
                        .updateOne({ user_id: item.user_id }, { $push: { selectedStore: req.body.selectedStore } },
                            function(err, res) {
                                if (err) throw err;
                            }
                        );
                } else {
                    dbo
                        .collection("user_configuration")
                        .updateOne({ user_id: req.body.user_id }, { $set: { "selectedStore.0": req.body.selectedStore } },
                            function(err, res) {
                                if (err) throw err;
                            }
                        );
                }
            });
    });
    res.json({ code: 201 });
});

router.post("/setUsersFor", function(req, res, next) {
    var item = {
        key: req.body.key,
        value: req.body.value,
    };
    console.log(req.body.user_id);
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("user_configuration")
            .findOne({ usersFor: { $elemMatch: { key: item.key } } },
                function(err, rows) {
                    console.log(rows);
                    if (err) throw err;
                    if (rows === null || rows.length === 0) {
                        dbo
                            .collection("user_configuration")
                            .updateOne({ user_id: Number(req.body.user_id) }, { $push: { usersFor: item } },
                                function(err, res) {
                                    if (err) throw err;
                                }
                            );
                    } else {
                        dbo
                            .collection("user_configuration")
                            .updateOne({ usersFor: { $elemMatch: { key: item.key } } }, { $set: { "usersFor.$": item } },
                                function(err, res) {
                                    if (err) throw err;
                                }
                            );
                    }
                    res.json(201);
                }
            );
    });
});

router.get("/getConfiguration/:id", function(req, res, next) {
    const id = req.params.id;

    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("user_configuration")
            .findOne({ user_id: Number(id) }, function(err, rows) {
                if (err) throw err;
                if (rows !== null) {
                    res.json(rows);
                } else {
                    var item = {
                        user_id: Number(id),
                        language: "english",
                        theme: "Theme1",
                        selectedStore: [],
                        usersFor: [],
                    };
                    dbo
                        .collection("user_configuration")
                        .insertOne(item, function(err, result) {
                            res.json(item);
                        });
                }
            });
    });
});

router.post("/createTranslation", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo.collection("translation").insertOne(req.body, function(err, result) {
            console.log("Item inserted!" + result);
            if (err) {
                throw err;
            } else {
                res.send(true);
            }
        });
    });
});

router.get("/getTranslation", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("translation")
            .find()
            .toArray(function(err, rows) {
                if (err) throw err;
                console.log(rows);
                res.json(rows);
            });
    });
});

router.get("/getTranslationWithId/:id", function(req, res, next) {
    const id = req.params.id;
    console.log(id);
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        console.log(db);
        dbo
            .collection("translation")
            .findOne({ _id: ObjectId(id) }, function(err, rows) {
                if (err) throw err;
                console.log(rows);
                res.json(rows);
            });
    });
});

router.get("/getTranslationByLanguageCode/:code", function(req, res, next) {
    const code = req.params.code;
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        console.log(dbo);
        dbo
            .collection("translation")
            .findOne({ languageCode: code, active: true }, function(err, rows) {
                if (err) throw err;
                console.log(rows);
                res.json(rows);
            });
    });
});

router.get("/deleteTranslation/:id", function(req, res, next) {
    const id = req.params.id;
    console.log(id);
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo.collection("translation").deleteOne({
                _id: ObjectId(id),
            },
            function(err, rows) {
                if (err) throw err;
                console.log(rows);
                res.json(true);
            }
        );
    });
});

router.post("/updateTranslation", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        console.log(req.body);
        dbo.collection("translation").updateOne({ _id: ObjectId(req.body._id) }, {
                $set: {
                    language: req.body.language,
                    countryCode: req.body.countryCode,
                    active: req.body.active,
                    config: req.body.config,
                },
            }, { upsert: true },
            function(err, rows) {
                if (err) throw err;

                res.json(true);
            }
        );
    });
    // res.json({ code: 201 });
});

router.post("/createPost", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        console.log(req.body);
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo.collection("posts").insertOne(req.body, function(err, result) {
            console.log("Item inserted!" + result);
            if (err) {
                throw err;
            } else {
                const respose = {
                    info: true,
                    insertId: result["ops"][0]._id,
                };
                res.send(respose);
            }
        });
    });
});

var mergePostWithUsers = (posts, res) => {
    connection.getConnection(function(err, conn) {
        if (err) {
            res.json({
                code: 100,
                status: "Error in connection database",
            });
            return;
        }
        var arrayPosts = [];
        conn.query("SELECT * from users", function(err, rows) {
            conn.release();
            if (!err) {
                for (let user of rows) {
                    for (let post of posts) {
                        if (sha1(user.id.toString()) === post.user_id) {
                            var recommentArray = [];
                            for (comm of post.recomment) {
                                for (let userComm of rows) {
                                    if (sha1(userComm.id.toString()) === comm.user_id) {
                                        var itemComm = {
                                            _id: comm._id,
                                            user_id: comm.user_id,
                                            image: user.image,
                                            name: user.fullname,
                                            image: userComm.image,
                                            name: userComm.fullname,
                                            date: comm.date,
                                            comment: comm.comment,
                                        };
                                        recommentArray.push(itemComm);
                                    }
                                }
                            }
                            var likesArray = [];
                            for (like of post.likes) {
                                for (let userLike of rows) {
                                    if (sha1(userLike.id.toString()) === like.user_id) {
                                        var itemLike = {
                                            _id: like._id,
                                            user_id: like.user_id,
                                            image: user.image,
                                            name: user.fullname,
                                        };
                                        likesArray.push(itemLike);
                                    }
                                }
                            }
                            /*for (like of post.likes) {
                              if (sha1(user.id.toString()) === like.user_id) {
                                var itemLike = {
                                  _id: like._id,
                                  user_id: like.user_id,
                                  image: user.image,
                                  name: user.fullname
                                };
                                likesArray.push(itemLike);
                              }
                            }*/
                            console.log(likesArray);

                            const item = {
                                _id: post._id,
                                user_id: post.user_id,
                                image: user.image,
                                name: user.fullname,
                                proffesion: user.proffesion,
                                sid: post.sid,
                                date: post.date,
                                post: post.post,
                                likes: post.likes,
                                recomment: recommentArray,
                            };
                            arrayPosts.push(item);
                        }
                    }
                }
                console.log(arrayPosts);
                res.json(arrayPosts);
            } else {
                res.json({
                    code: 100,
                    status: "Error in connection database",
                });
            }
        });
    });
};

router.get("/getAllPostsForUser/:id", function(req, res, next) {
    let id = req.params.id;
    if (id !== "1") {
        id = "-" + id + "-";
    }
    console.log(id);
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("posts")
            .find({
                sid: new RegExp(id),
            })
            .toArray(function(err, rows) {
                if (err) throw err;
                // res.json(rows);
                console.log(rows);
                mergePostWithUsers(rows, res);
                // res.json(arrayResponse);
                db.close();
            });
    });
});

router.get("/deletePost/:id", function(req, res, next) {
    const id = req.params.id;
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo.collection("posts").deleteOne({
                _id: ObjectId(id),
            },
            function(err, rows) {
                if (err) throw err;
                res.json(true);
            }
        );
    });
});

router.post("/likePost", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo.collection("posts").findOne({
                _id: ObjectId(req.body.id),
                likes: { $elemMatch: { user_id: req.body.user_id } },
            },
            function(err, rows) {
                if (err) throw err;
                if (rows === null || rows.length === 0) {
                    dbo
                        .collection("posts")
                        .updateOne({ _id: ObjectId(req.body.id) }, { $push: { likes: req.body } },
                            function(err, rows) {
                                if (err) throw err;
                                const response = {
                                    info: 201,
                                };
                                res.json(response);
                            }
                        );
                } else {
                    const deleteLikePostUserId = rows.user_id;
                    dbo.collection("posts").updateOne({
                            _id: ObjectId(req.body.id),
                        }, {
                            $pull: {
                                likes: { user_id: req.body.user_id },
                            },
                        },
                        function(err, rows) {
                            if (err) throw err;
                            const response = {
                                info: 202,
                                user_id: deleteLikePostUserId,
                            };
                            res.json(response);
                        }
                    );
                }
            }
        );
    });
});

router.get("/getLikesForPost/:id", function(req, res, next) {
    const id = req.params.id;
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("posts")
            .findOne({ _id: ObjectId(id) }, function(err, rows) {
                if (err) throw err;
                res.json(rows);
            });
    });
});

router.post("/commentPost", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        var generateId = ObjectId();
        req.body._id = generateId;
        dbo
            .collection("posts")
            .updateOne({ _id: ObjectId(req.body.id) }, { $push: { recomment: req.body } },
                function(err, result) {
                    if (err) throw err;
                    const response = {
                        info: 201,
                        insertId: generateId,
                    };
                    res.json(response);
                }
            );
    });
});

router.post("/createMessage", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo.collection("messages").insertOne(req.body, function(err, result) {
            console.log("Item inserted!" + result);
            if (err) {
                throw err;
            } else {
                res.send(result["ops"][0]["_id"]);
            }
        });
    });
});

var mergeMessageWithUsers = (messages, id, res) => {
    connection.getConnection(function(err, conn) {
        if (err) {
            res.json({
                code: 100,
                status: "Error in connection database",
            });
            return;
        }
        var arrayMessages = [];
        conn.query("SELECT * from users", function(err, rows) {
            conn.release();
            if (!err) {
                console.log(rows);
                for (let mess of messages) {
                    var receiveId = null;
                    if (mess["sender1"] !== id) {
                        receiveId = mess["sender1"];
                    } else {
                        receiveId = mess["sender2"];
                    }
                    for (let user of rows) {
                        if (sha1(user.id.toString()) == receiveId) {
                            var messageItem = {
                                _id: mess._id,
                                receiveId: receiveId,
                                name: user.fullname,
                                image: user.image,
                                profession: user.profession,
                                message: mess.messages.length > 0 ?
                                    mess.messages[mess.messages.length - 1] :
                                    [],
                                not_seen: mess.not_seen,
                            };
                            arrayMessages.push(messageItem);
                        }
                    }
                }
                console.log(arrayMessages);
                res.json(arrayMessages);
            } else {
                res.json({
                    code: 100,
                    status: "Error in connection database",
                });
            }
        });
    });
};

router.get("/getAllMessagesForUser/:id", function(req, res, next) {
    let id = req.params.id;
    console.log(id);
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("messages")
            .find({
                $or: [{
                        sender1: id,
                    },
                    { sender2: id },
                ],
            })
            .toArray(function(err, rows) {
                if (err) throw err;
                // res.json(rows);
                console.log(rows);
                mergeMessageWithUsers(rows, id, res);
                // res.json(arrayResponse);
                db.close();
            });
    });
});

router.get("/getMessageForSelectedUser/:id", function(req, res, next) {
    let id = req.params.id;
    console.log(id);
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("messages")
            .find({
                _id: ObjectId(id),
            })
            .toArray(function(err, rows) {
                if (err) throw err;
                console.log(rows);
                res.json(rows[0].messages);
                // mergeMessageWithUsers(rows, id, res);
                // res.json(arrayResponse);
                db.close();
            });
    });
});

router.post("/getOrCreate", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("messages")
            .find({
                $or: [{
                        sender1: req.body.sender1,
                        sender2: req.body.sender2,
                    },
                    {
                        sender1: req.body.sender2,
                        sender2: req.body.sender1,
                    },
                ],
            })
            .toArray(function(err, rows) {
                if (err) throw err;
                if (rows.length !== 0) {
                    const response = {
                        info: "get",
                        messages: rows,
                    };
                    res.json(response);
                    db.close();
                } else {
                    dbo
                        .collection("messages")
                        .insertOne(req.body, function(err, result) {
                            console.log("Item inserted!" + result);
                            if (err) {
                                throw err;
                            } else {
                                const response = {
                                    info: "create",
                                    id: result["ops"][0]._id,
                                };
                                res.send(response);
                            }
                        });
                }
            });
    });
});

router.post("/pushNewMessage", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        console.log(req.body);
        var dbo = db.db(database_name);
        dbo.collection("messages").updateOne({ _id: ObjectId(req.body._id) }, {
                $push: { messages: req.body.message },
                $set: { not_seen: req.body.receiveId },
            },
            function(err, rows) {
                if (err) throw err;
                res.json(201);
            }
        );
    });
});

router.post("/updateSeen", function(req, res, next) {
    mongo.connect(url, function(err, db, res) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("messages")
            .updateOne({ _id: ObjectId(req.body._id) }, { $set: { not_seen: req.body.not_seen } },
                function(err, res) {
                    if (err) throw err;
                }
            );
    });
    res.json({ code: 201 });
});

router.post("/createEventData", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo.collection("events").insertOne(req.body, function(err, result) {
            if (err) {
                throw err;
            } else {
                const response = {
                    create: true,
                    id: result["ops"][0]._id,
                };
                res.send(response);
            }
        });
    });
});

router.get("/getEventData/:id", function(req, res, next) {
    const id = req.params.id;
    console.log(id);
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("events")
            .findOne({ _id: ObjectId(id) }, function(err, rows) {
                if (err) throw err;
                res.json(rows);
            });
    });
});

// moras da menjas ovu metodu, nije optimizovana uopste!!! spakuj speakers-e i spekaersConfigur u isti property samo dodeli razliciti indikator
var getFullSignInUsersData = (
    speakers,
    listeners,
    res
) => {
    connection.getConnection(function(err, conn) {
        if (err) {
            res.json({
                code: 100,
                status: "Error in connection database",
            });
            return;
        }
        var arrayMessages = [];
        conn.query("SELECT * from users", function(err, rows) {
            conn.release();
            if (!err) {
                console.log(rows);
                for (let item of speakers) {
                    for (let user of rows) {
                        if (user.id == item.id) {
                            arrayMessages.push(user);
                        }
                    }
                }
                for (let item of listeners) {
                    for (let user of rows) {
                        if (user.id == item.id) {
                            arrayMessages.push(user);
                        }
                    }
                }
                console.log(arrayMessages);
                res.json(arrayMessages);
            } else {
                res.json({
                    code: 100,
                    status: "Error in connection database",
                });
            }
        });
    });
};

router.get("/getSignInForLifeEvent/:id", function(req, res, next) {
    const id = req.params.id;
    console.log("room: " + id);
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("events")
            .findOne({ _id: ObjectId(id) }, function(err, rows) {
                if (err) throw err;
                console.log(rows);
                getFullSignInUsersData(
                    rows.speakers,
                    rows.listeners,
                    res
                );
            });
    });
});

router.get("/getAllEvents/:user", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("events")
            .find()
            .toArray(function(err, rows) {
                if (err) throw err;
                const events = {
                    data: rows,
                    user: req.params.user,
                };
                checkEventStatusForCurrentUser(events, res);
                // res.json(rows);
            });
    });
});

var checkEventStatusForCurrentUser = (events, res) => {
    for (let i = 0; i < events.data.length; i++) {
        if (events.data[i].id_user === events.user) {
            events.data[i]["eventStatus"] = 0;
        } else {
            let registered = 1;
            for (let j = 0; j < events.data[i].signIn.length; j++) {
                console.log(events.data[i].signIn[j].user_id + "    dsadasdas");
                if (events.data[i].signIn[j].user_id === events.user) {
                    events.data[i]["eventStatus"] = 1;
                    registered = 0;
                    break;
                }
            }
            if (registered) {
                events.data[i]["eventStatus"] = 2;
            }
        }
    }
    res.json(events.data);
};

router.get("/getMyEvents/:id", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("events")
            .find({
                id_user: req.params.id,
            })
            .toArray(function(err, rows) {
                if (err) throw err;
                res.json(rows);
            });
    });
});

router.get("/getEventsByEventType/:type", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("events")
            .find({
                eventType: req.params.type,
            })
            .toArray(function(err, rows) {
                if (err) throw err;
                res.json(rows);
            });
    });
});

router.post("/updateEventData", function(req, res, next) {
    mongo.connect(url, function(err, db, res) {
        if (err) throw err;
        console.log(req.body);
        var dbo = db.db(database_name);
        if (req.body.eventType === 1) {
            dbo.collection("events").updateOne({ _id: ObjectId(req.body._id) }, {
                    $set: {
                        id_user: req.body.id_user,
                        date: req.body.date,
                        time: req.body.time,
                        event: req.body.event,
                        comment: req.body.comment,
                        organizer: req.body.organizer,
                        attendees: req.body.attendees,
                        eventType: req.body.eventType,
                        nameOfEvent: req.body.nameOfEvent,
                        nameOfLocation: req.body.nameOfLocation,
                        location: req.body.location,
                        zip: req.body.zip,
                        street: req.body.street,
                        online: req.body.online,
                        numberOfSpeakers: req.body.numberOfSpeakers,
                        numberOfListeners: req.body.numberOfListeners,
                        eventType: req.body.eventType,
                        speakers: req.body.speakers,
                        listeners: req.body.listeners,
                        chargeable: req.body.chargeable,
                        price: req.body.price,
                        isPrivate: req.body.isPrivate,
                    },
                },
                function(err, res) {
                    if (err) throw err;
                }
            );
        } else {
            dbo.collection("events").updateOne({ _id: ObjectId(req.body._id) }, {
                    $set: {
                        id_user: req.body.id_user,
                        nameOfEvent: req.body.nameOfEvent,
                        date: req.body.date,
                        time: req.body.time,
                        event: req.body.event,
                        comment: req.body.comment,
                        organizer: req.body.organizer,
                        numberOfSpeakers: req.body.numberOfSpeakers,
                        numberOfListeners: req.body.numberOfListeners,
                        eventType: req.body.eventType,
                        speakers: req.body.speakers,
                        listeners: req.body.listeners,
                        life: req.body.listeners,
                        attendees: req.body.attendees,
                        chargeable: req.body.chargeable,
                        price: req.body.price,
                        isPrivate: req.body.isPrivate,
                    },
                },
                function(err, res) {
                    if (err) throw err;
                }
            );
        }
    });
    res.json(true);
});

/* status code
0 - owner
1 - sign in
2 - unsign in
*/
router.post("/checkEventStatusForUser", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo
            .collection("events")
            .findOne({ _id: ObjectId(req.body._id), id_user: req.body.id_user },
                function(err, rows) {
                    if (err) throw err;
                    console.log(rows);
                    if (rows) {
                        res.json(0);
                    } else {
                        dbo.collection("events").findOne({
                                _id: ObjectId(req.body._id),
                                signIn: { $elemMatch: { user_id: req.body.id_user } },
                            },
                            function(err, rows) {
                                if (err) throw err;
                                if (rows === null || rows.length === 0) {
                                    res.json(2);
                                } else {
                                    res.json(1);
                                }
                            }
                        );
                    }
                }
            );
    });
});

router.get("/deleteEventData/:id", function(req, res, next) {
    const id = req.params.id;
    console.log("ID: " + id);
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo.collection("events").deleteOne({
                _id: ObjectId(id),
            },
            function(err, rows) {
                if (err) throw err;
                res.json(true);
            }
        );
    });
});

router.post("/signInForEvent", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        dbo.collection("events").findOne({
                _id: ObjectId(req.body.id),
                signIn: { $elemMatch: { user_id: req.body.user_id } },
            },
            function(err, rows) {
                if (err) throw err;
                console.log(rows);
                if (rows === null || rows.length === 0) {
                    dbo
                        .collection("events")
                        .updateOne({ _id: ObjectId(req.body.id) }, { $push: { signIn: { user_id: req.body.user_id } } },
                            function(err, rows) {
                                if (err) throw err;
                                res.json(1);
                            }
                        );
                } else {
                    const unSignIn = rows.user_id;
                    dbo.collection("events").updateOne({
                            _id: ObjectId(req.body.id),
                        }, {
                            $pull: {
                                signIn: { user_id: req.body.user_id },
                            },
                        },
                        function(err, rows) {
                            if (err) throw err;
                            res.json(2);
                        }
                    );
                }
            }
        );
    });
});

router.post("/signInVirtualParticipant", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        if (req.body.type === "speaker") {
            dbo
                .collection("events")
                .updateOne({ _id: ObjectId(req.body.id) }, { $push: { speakers: req.body.participant } },
                    function(err, result) {
                        if (err) throw err;

                        res.json(true);
                    }
                );
        } else {
            dbo.collection("events");
            dbo
                .collection("events")
                .updateOne({ _id: ObjectId(req.body.id) }, { $push: { listeners: req.body.participant } },
                    function(err, result) {
                        if (err) throw err;

                        res.json(true);
                    }
                );
        }
    });
});

router.post("/signOutVirtualParticipant", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        if (req.body.type === "speaker") {
            dbo
                .collection("events")
                .updateOne({ _id: ObjectId(req.body.id) }, { $pull: { speakers: { id: req.body.participant.id } } },
                    function(err, result) {
                        if (err) throw err;

                        res.json(true);
                    }
                );
        } else {
            dbo.collection("events");
            dbo
                .collection("events")
                .updateOne({ _id: ObjectId(req.body.id) }, { $pull: { listeners: { id: req.body.participant.id } } },
                    function(err, result) {
                        if (err) throw err;

                        res.json(true);
                    }
                );
        }
    });
});

router.post("/pushNewParticipant", function(req, res, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database_name);
        if (req.body.type === "speakers") {
            dbo
                .collection("events")
                .updateOne({ _id: ObjectId(req.body.id) }, { $push: { speakers: req.body.participant } },
                    function(err, result) {
                        if (err) throw err;
                        const response = {
                            info: 201,
                        };
                        res.json(response);
                    }
                );
        } else {
            dbo
                .collection("events")
                .updateOne({ _id: ObjectId(req.body.id) }, { $push: { listeners: req.body.participant } },
                    function(err, result) {
                        if (err) throw err;
                        const response = {
                            info: 201,
                        };
                        res.json(response);
                    }
                );
        }
    });
});

module.exports = router;