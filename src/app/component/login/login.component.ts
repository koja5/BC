import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public currentForm = 'login';

  constructor() { }

  ngOnInit() {
  }

  changeForm(form) {
    this.currentForm = form;
  }

}
