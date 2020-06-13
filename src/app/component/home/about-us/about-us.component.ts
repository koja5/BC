import { Component, OnInit } from "@angular/core";
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: "app-about-us",
  templateUrl: "./about-us.component.html",
  styleUrls: ["./about-us.component.scss"],
})
export class AboutUsComponent implements OnInit {
  public language: any;

  constructor(private message: MessageService) {}

  ngOnInit() {
    this.language = JSON.parse(localStorage.getItem("language"));
    this.message.sendNavigationItemFeed();
  }
}
