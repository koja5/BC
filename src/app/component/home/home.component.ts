import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ng2-cookies";
import { MessageService } from "src/app/services/message.service";
import * as sha1 from "sha1";
import { FindConnectionService } from "src/app/services/find-connection.service";
import { ProfileService } from "src/app/services/profile.service";
import { HelpService } from "src/app/services/help.service";
import { MessageChatService } from "src/app/services/message-chat.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  public dropDownProfile = "";
  public type: any;
  public fullname: any;
  public user: any;
  public id: any;
  public superadminInd = false;
  public userListLoading = false;
  public userList: any;
  public selectedUser: any;
  public language: any;
  public messageCenter = "";
  public allMessages: any;
  public newMessageCounter = 0;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private message: MessageService,
    private findConnection: FindConnectionService,
    private profileService: ProfileService,
    private helpService: HelpService,
    private messageService: MessageChatService
  ) {}

  ngOnInit() {
    this.id = localStorage.getItem("id");
    this.language = JSON.parse(localStorage.getItem("language"));
    this.initialization();
    this.selectedUser = null;

    this.message.getUserInfo().subscribe((data) => {
      this.initialization();
    });

    this.messageService.newMessageReceived().subscribe((data) => {
      console.log(data);
      if (data.not_seen === this.id) {
        this.newMessageCounter++;
      }
    });
  }

  initialization() {
    this.getUserProfile();
    this.getAllMessageForUser();
  }

  notificationCounter(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].not_seen && data[i].not_seen === this.id) {
        this.newMessageCounter++;
      }
    }
  }

  getUserProfile() {
    this.profileService.getUserInfoSHA1(this.id).subscribe((data) => {
      this.user = data[0];
      // this.user.img = this.helpService.getImage(data[0].img);
      if (this.user.type === 0) {
        this.superadminInd = true;
      }
    });
  }

  logout() {
    this.cookie.delete("user", "/home/main");
    this.cookie.delete("user", "/");
    this.router.navigate(["login"]);
  }

  onValueChange(event) {
    console.log(event);
    if (event === undefined) {
      this.selectedUser = null;
    } else {
      this.selectedUser = event;
      this.router.navigate([
        "/home/main/profile/" + sha1(this.selectedUser.id.toString()),
      ]);
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

  showMessageCenter() {
    if (this.messageCenter === "") {
      this.messageCenter = "show";
      this.messageService.getAllMessagesForUser(this.id).subscribe((data) => {
        console.log(data);
        this.allMessages = data;
      });
    } else {
      this.messageCenter = "";
    }
    this.newMessageCounter = 0;
  }

  getAllMessageForUser() {
    this.messageService.getAllMessagesForUser(this.id).subscribe((data) => {
      this.notificationCounter(data);
    });
  }

  openItemMessage(item, index) {
    const data = {
      id: item._id,
      image: item.image,
      name: item.name,
      profession: item.profession,
      index: index,
      receiveId: item.receiveId,
    };
    sessionStorage.setItem("message_item", JSON.stringify(data));
    this.router.navigate(["/home/main/message"]);
    this.messageCenter = "";
  }
}
