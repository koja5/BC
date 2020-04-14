import { Component, OnInit } from "@angular/core";
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

  constructor(private service: ConnectionService, private router: Router) {}

  ngOnInit() {
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
}
