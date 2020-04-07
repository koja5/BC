import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ng2-cookies";
import { MessageService } from "src/app/services/message.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  public dropDownProfile = "";
  public type: any;
  public fullname: any;
  public user: any;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private message: MessageService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("user"));

    this.message.getNewFullname().subscribe(mess => {
      this.user = JSON.parse(localStorage.getItem("user"));
    });
  }

  logout() {
    this.cookie.delete("user", "/home/main");
    this.cookie.delete("user", "/");
    this.router.navigate(["login"]);
  }
}
