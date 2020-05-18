import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-maintence",
  templateUrl: "./maintence.component.html",
  styleUrls: ["./maintence.component.scss"],
})
export class MaintenceComponent implements OnInit {
  public language: any;
  public maintenceText1: any;
  public maintenceText2: any

  constructor() {}

  ngOnInit() {
      this.maintenceText1 = "Page is currently being maintained.";
      this.maintenceText2 = "Try again later.";
    
  }
}
