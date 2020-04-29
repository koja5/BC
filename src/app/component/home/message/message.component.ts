import { Component, OnInit } from "@angular/core";
import { MessageChatService } from "src/app/services/message-chat.service";
import { MessageModel } from "src/app/models/message-model";

@Component({
  selector: "app-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.scss"],
})
export class MessageComponent implements OnInit {
  public messageText: String;
  public messageArray:any = [];
  public id: any;
  public messageData = new MessageModel();
  public allMessages: any;
  public user: any;
  public selectUserForComunication: any;
  public selectedMessage: any;

  constructor(private service: MessageChatService) {
    this.service
      .newUserJoined()
      .subscribe((data) => this.messageArray.push(data));

    this.service
      .userLeftRoom()
      .subscribe((data) => this.messageArray.push(data));

    this.service.newMessageReceived().subscribe((data) => {
      console.log(data);
      this.messageArray.push(data);
    });
  }

  ngOnInit() {
    this.id = localStorage.getItem("id");
    this.user = JSON.parse(localStorage.getItem("user"));
    this.messageData = null;
    this.initilization();
    this.join();
  }

  initilization() {
    this.service.getAllMessagesForUser(this.id).subscribe(
      data => {
        console.log(data);
        this.allMessages = data;
      }
    )
  }

  join() {
    this.service.joinRoom({ sender_id: this.id, room: "1" });
  }

  leave() {
    this.service.leaveRoom({ sender_id: this.id, room: "1" });
  }

  sendMessage() {
    /*if (this.messageData) {
    } else {
      this.messageData = {
        sender1: this.id,
        sender2: "0ade7c2cf97f75d009975f4d720d1fa6c19f4897",
        messages: this.messageArray,
      };
      this.service.createMessage(this.messageData).subscribe((data) => {
        console.log(data);
      });
    }*/
    this.service.sendMessage({
      sender_id: this.id,
      room: "1",
      message: this.messageText,
      name: this.user.fullname,
      image: this.user.image,
      date: new Date(),
    });
    this.messageText = "";
  }

  showMessages(id, image, name, profession) {
    this.selectedMessage = id;
    this.service.getMessageForSelectedUser(id).subscribe(
      data => {
        this.selectUserForComunication = {
          name: name,
          profession: profession,
          image: image
        };
        this.messageArray = data;
      }
    )
  }


}
