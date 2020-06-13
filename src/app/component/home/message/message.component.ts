import { Component, OnInit, HostListener } from "@angular/core";
import { MessageChatService } from "src/app/services/message-chat.service";
import { MessageModel } from "src/app/models/message-model";
import { FindConnectionService } from "src/app/services/find-connection.service";
import * as sha1 from "sha1";
import { MessageService } from "src/app/services/message.service";

@Component({
  selector: "app-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.scss"],
})
export class MessageComponent implements OnInit {
  public messageText: String;
  public messageArray: any = [];
  public id: any;
  public messageData = new MessageModel();
  public allMessages: any;
  public user: any;
  public selectUserForComunication: any;
  public selectedMessage: any;
  public windowWidth: any;
  public windowHeight: any;
  public messageWindow = false;
  public mobile = false;
  public userListLoading = false;
  public userList: any;
  public selectedUser: any;
  public room: any;

  constructor(
    private service: MessageChatService,
    private findConnection: FindConnectionService,
    private message: MessageService
  ) {
    this.service
      .newUserJoined()
      .subscribe((data) => this.messageArray.push(data));

    this.service
      .userLeftRoom()
      .subscribe((data) => this.messageArray.push(data));

    this.service.newMessageReceived().subscribe((data) => {
      console.log(data);
      this.messageArray.push(data);
      this.initilization();
    });

    this.service.getNotification().subscribe((data) => {
      console.log("dosla je notifikacija!!!!");
    });

    this.message.getMessageForThisUser().subscribe((data) => {
      this.getOrCreate(data);
    });
  }


  ngOnInit() {
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      this.mobile = true;
    }
    this.id = localStorage.getItem("id");
    this.user = JSON.parse(localStorage.getItem("user"));
    this.messageData = null;
    this.initilization();
    // this.join();
  }

  initilization() {
    this.service.getAllMessagesForUser(this.id).subscribe((data) => {
      console.log(data);
      this.allMessages = data;
    });

    this.getMessageItem();
  }

  getMessageItem() {
    if (sessionStorage.getItem("message_item")) {
      const message = JSON.parse(sessionStorage.getItem("message_item"));
      this.showMessages(
        message.id,
        message.image,
        message.name,
        message.profession,
        message.index,
        message.receiveId
      );
      sessionStorage.removeItem("message_item");
    } else if (sessionStorage.getItem("message_user")) {
      const user = JSON.parse(sessionStorage.getItem("message_user"));
      this.getOrCreate(user);
      sessionStorage.removeItem("message_user");
    }
  }

  join(room) {
    this.service.joinRoom({ sender_id: this.id, room: room });
    this.room = room;
  }

  leave(room) {
    this.service.leaveRoom({ sender_id: this.id, room: room });
  }

  updateGlobalMessageData(message) {
    let ind = 1;
    for (let i = 0; i < this.allMessages.length; i++) {
      if (this.allMessages[i].message.sender_id === message.sender_id) {
        this.allMessages[i].message.message = message.message;
        this.allMessages[i].message.date = message.date;
        ind = 0;
      }
    }
    this.allMessages.push();
  }

  sendMessage() {
    const data = {
      _id: this.room,
      message: {
        sender_id: this.id,
        message: this.messageText,
        date: new Date(),
      },
      receiveId: this.selectUserForComunication.receiveId,
    };
    this.service.pushNewMessage(data).subscribe((data) => {
      console.log(data);
    });
    this.service.sendMessage({
      sender_id: this.id,
      room: this.room,
      message: this.messageText,
      name: this.user.fullname,
      image: this.user.image,
      date: new Date(),
      not_seen: this.selectUserForComunication.receiveId,
    });
    this.messageText = "";
  }

  clickOnTextArea() {
    const index = this.selectUserForComunication.index;
    if (this.allMessages[index].not_seen === this.id) {
      this.allMessages[index].not_seen = "";
    }
  }

  showMessages(id, image, name, profession, index, receiveId) {
    this.selectedMessage = id;
    this.room = id;
    this.join(id);
    this.service.getMessageForSelectedUser(id).subscribe((data) => {
      console.log(data);
      this.selectUserForComunication = {
        name: name,
        profession: profession,
        image: image,
        receiveId: receiveId,
        index: index,
      };
      this.messageArray = data;
      if (this.mobile) {
        this.messageWindow = true;
      }
      if (this.allMessages[index].not_seen === this.id) {
        const notSeenData = {
          _id: id,
          not_seen: "",
        };
        this.service.updateSeen(notSeenData).subscribe((data) => {
          console.log(data);
        });
      }
    });
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      this.mobile = true;
    } else {
      this.windowWidth = null;
      this.windowHeight = null;
      this.mobile = false;
    }
    this.messageWindow = false;
  }

  onValueChange(event) {
    console.log(event);
    if (event === undefined) {
      this.selectUserForComunication = null;
    } else {
      /*this.selectUserForComunication = {
        name: event.fullname,
        profession: event.profession,
        image: event.image
      };*/
      this.getOrCreate(event);
    }
  }

  searchUser(event) {
    console.log(event);
    if (event !== "" && event.length > 2) {
      this.userListLoading = true;
      const searchFilter = {
        filter: event,
      };
      this.findConnection.searchUser(searchFilter).subscribe((val: []) => {
        this.userList = val.sort((a, b) =>
          String(a["fullname"]).localeCompare(String(b["fullname"]))
        );
        this.userListLoading = false;
      });
    } else {
      this.userList = [];
    }
  }

  selectionChangeUser(event) {
    console.log(event);
  }

  getOrCreate(user) {
    const data = {
      sender1: this.id,
      sender2: sha1(user.id.toString()),
      messages: [],
    };

    this.service.getOrCreate(data).subscribe((data) => {
      if (data["info"] === "get") {
        this.messageArray = data["messages"][0]["messages"];
        this.join(data["messages"][0]["_id"]);
      } else {
        this.join(data["id"]);
        this.messageArray = [];
      }

      this.selectUserForComunication = {
        name: user.fullname,
        profession: user.profession,
        image: user.image,
      };
    });
  }
}
