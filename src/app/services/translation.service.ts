import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { HelpService } from './help.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(
    private loginService: LoginService,
    public router: Router,
    private helpService: HelpService
  ) { }

  public getDefaultTranslation(): Observable<any> {
    const subject = new Subject<any>();

    this.loginService.getDefaultLanguage().subscribe(
      (translation) => {
        if (translation !== null) {
          this.helpService.setLanguage(translation["config"]);
          subject.next(translation["config"]);
        } else {
          this.router.navigate(["/maintence"]);
        }
      },
      (error) => {
        this.router.navigate(["/maintence"]);
      }
    );

    return subject.asObservable();
  }

}
