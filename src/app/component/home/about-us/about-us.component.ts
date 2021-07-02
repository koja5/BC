import { Component, OnInit } from "@angular/core";
import { HelpService } from 'src/app/services/help.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: "app-about-us",
  templateUrl: "./about-us.component.html",
  styleUrls: ["./about-us.component.scss"],
})
export class AboutUsComponent implements OnInit {
  public language: any;

  constructor(private helpService: HelpService) {}

  ngOnInit() {
    this.language = this.helpService.getLanguage();
  }
}
