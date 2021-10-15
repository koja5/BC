import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { CookieService } from "ng2-cookies";

@Injectable()
export class LoginGuardService implements CanActivate {
  constructor(
    public router: Router,
    public http: HttpClient,
    public cookie: CookieService
  ) { }

  canActivate() {
    if (
      this.cookie.check("user") !== null &&
      this.cookie.check("user") !== undefined
    ) {
      return true;
    } else {
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
