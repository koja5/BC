import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { CookieService } from 'ng2-cookies';

@Injectable()
export class LoggedGuard implements CanActivate {

    constructor(public router: Router, public http: Http, public cookie: CookieService) { }

    canActivate() {
        if (this.cookie.check('user') === null || this.cookie.check('user') === undefined || !this.cookie.check('user') || localStorage.getItem('idUser') === null) {
            return true;
        } else {
            this.router.navigate(['/home']);
            return false;
        }


    }

}
