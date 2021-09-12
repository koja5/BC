import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ng2-cookies';

@Injectable()
export class LoggedGuardService implements CanActivate {

    constructor(public router: Router, public http: HttpClient, public cookie: CookieService) { }

    canActivate() {
        if (this.cookie.check('user') === null || this.cookie.check('user') === undefined || !this.cookie.check('user') || localStorage.getItem('idUser') === null) {
            return true;
        } else {
            this.router.navigate(['/home']);
            return false;
        }
    }
}
