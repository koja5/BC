import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  public language: any;
  
  constructor() { }

  ngOnInit() {
    this.language = JSON.parse(localStorage.getItem("language"));
  }

}
