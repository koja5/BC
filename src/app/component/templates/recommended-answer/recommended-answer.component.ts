import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: "app-recommended-answer",
  templateUrl: "./recommended-answer.component.html",
  styleUrls: ["./recommended-answer.component.scss"],
})
export class RecommendedAnswerComponent implements OnInit {
  public language: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.language = JSON.parse(localStorage.getItem("language"));
  }

  backToHome() {
    this.router.navigate(['/login']);
  }
}
