import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ng2-cookies";
import { MessageService } from "src/app/services/message.service";
import * as sha1 from "sha1";
import { FindConnectionService } from "src/app/services/find-connection.service";

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
  public superadminInd = false;
  public userListLoading = false;
  public userList: any;
  public selectedUser: any;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private message: MessageService,
    private findConnection: FindConnectionService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("user"));
    if (this.user.type === sha1(0)) {
      this.superadminInd = true;
    }

    this.message.getNewFullname().subscribe((mess) => {
      this.user = JSON.parse(localStorage.getItem("user"));
    });
    this.selectedUser = null;
    console.log(this.selectedUser);
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
      this.router.navigate(['/home/main/profile/' + sha1(this.selectedUser.id.toString())]);
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
}
