import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  public language: any;

  constructor() { }

  ngOnInit() {
    this.language = JSON.parse(localStorage.getItem("language"));
  }

}
