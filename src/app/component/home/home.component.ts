import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ng2-cookies";
import { MessageService } from "src/app/services/message.service";
import * as sha1 from "sha1";
import { FindConnectionService } from "src/app/services/find-connection.service";
import { ProfileService } from "src/app/services/profile.service";
import { HelpService } from "src/app/services/help.service";

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
  public height: any;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private message: MessageService,
    private findConnection: FindConnectionService,
    private profileService: ProfileService,
    private helpService: HelpService
  ) {}

  ngOnInit() {
    this.height = window.innerHeight - 81;
    this.height += "px";
    this.id = localStorage.getItem("id");
    this.language = JSON.parse(localStorage.getItem("language"));
    this.initialization();
    this.selectedUser = null;

    this.message.getUserInfo().subscribe((data) => {
      this.initialization();
    });
  }

  initialization() {
    this.getUserProfile();
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

  openProfileWithoutSHA1() {
    this.router.navigate(["/home/main/profile/" + this.id]);
  }
}
