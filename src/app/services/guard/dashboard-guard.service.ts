import { HttpClient } from '@angular/common/http';
import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { CookieService } from "ng2-cookies";

@Injectable()
export class DashboardGuardService implements CanActivate {
  constructor(
    public router: Router,
    public http: HttpClient,
    public cookie: CookieService
  ) { }

  canActivate() {
    if (this.cookie.check("user")) {
      return true;
    } else {
      this.router.navigate(["/login"]);
    }
    return false;
  }
}
