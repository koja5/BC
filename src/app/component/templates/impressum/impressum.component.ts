import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-impressum",
  templateUrl: "./impressum.component.html",
  styleUrls: ["./impressum.component.scss"],
})
export class ImpressumComponent implements OnInit {
  public language: any;
  constructor() {}

  ngOnInit() {
    this.language = JSON.parse(localStorage.getItem("language"));
  }
}
