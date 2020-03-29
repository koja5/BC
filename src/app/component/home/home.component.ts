import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from "ng2-cookies";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public dropDownProfile = '';

  constructor(private router: Router, private cookie: CookieService) { }

  ngOnInit() {
  }

  logout() {
    this.cookie.delete('user', '/home/main');
    this.cookie.delete('user', '/');
    this.router.navigate(['login']);
  }
}
