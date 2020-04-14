import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-premium",
  templateUrl: "./premium.component.html",
  styleUrls: ["./premium.component.scss"],
})
export class PremiumComponent implements OnInit {
  public language: any;

  constructor() {}

  ngOnInit() {
    this.language = JSON.parse(localStorage.getItem("language"));
  }

  initialize() {
    
  }
}
