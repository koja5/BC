import { Component, OnInit, HostListener } from "@angular/core";
import { ConnectionService } from "src/app/services/connection.service";
import { Router } from "@angular/router";
import * as sha1 from "sha1";

@Component({
  selector: "app-connection",
  templateUrl: "./connection.component.html",
  styleUrls: ["./connection.component.scss"],
})
export class ConnectionComponent implements OnInit {
  public selectTab = "myConnection";
  public allUsers: any;
  public language: any;
  public searchTerm: any;
  public height: any;
  public recommendedWindow = false;
  public hover = "fa fa-heart-o";
  public recommendedItem: any;
  public hoverItem: any;

  constructor(private service: ConnectionService, private router: Router) {}

  ngOnInit() {
    if (window.innerWidth > 1000) {
      this.height = window.innerHeight - 104;
    } else {
      this.height = window.innerHeight - 121;
    }
    this.height += "px";
    this.language = JSON.parse(localStorage.getItem("language"));
    this.initialization();
  }

  initialization() {
    this.getUsers(this.selectTab);
  }

  changeTab(tab) {
    this.selectTab = tab;
    this.getUsers(tab);
  }

  getUsers(tab) {
    this.allUsers = undefined;
    if (tab === "myConnection") {
      this.service
        .getMyOwnConnection(localStorage.getItem("id"))
        .subscribe((data) => {
          console.log(data);
          this.allUsers = data;
        });
    } else {
      this.service
        .getOtherConnections(localStorage.getItem("id"))
        .subscribe((data) => {
          console.log(data);
          this.allUsers = data;
        });
    }
  }

  openProfile(id) {
    console.log(id);
    this.router.navigate(["/home/main/profile/" + sha1(id.toString())]);
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth > 1000) {
      this.height = window.innerHeight - 104;
    } else {
      this.height = window.innerHeight - 121;
    }
    this.height += "px";
  }

  recommendedWindowEmitter() {
    this.recommendedWindow = false;
    this.recommendedItem = null;
  }

  heartHoverIn(index) {
    this.hover = "fa fa-heart";
    this.hoverItem = index;
  }

  heartHoverOut() {
    this.hover = "fa fa-heart-o";
    this.hoverItem = null;
  }

  recommended(id, name, email, phone) {
    this.recommendedItem = {
      id: id,
      name: name,
      email: email,
      phone: phone
    };
    this.recommendedWindow = true;
  }

  sendMessageForThisUser(data) {
    sessionStorage.setItem("message_user", JSON.stringify(data));
    this.router.navigate(["/home/main/message"]);
  }

}
