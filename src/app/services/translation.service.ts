import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
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

  public getTranslation(languageCode: string): Observable<any> {
    const regex = new RegExp('^[a-z]{2}');
    const subject = new Subject<any>();

    if (languageCode && regex.test(languageCode) && this.loginService.checkLanguageCode(languageCode)) {
      this.loginService.getTranslationByLanguageCode(languageCode).subscribe(
        (translation) => {
          if (translation !== null) {

            this.helpService.setLanguage(translation["config"]);
            this.helpService.setLanguageCode(languageCode);
            subject.next(translation["config"]);

          } else {
            this.useDefaultTranslation().subscribe((data) => {
              subject.next(data);
            });
          }
        },
        (error) => {
          console.log(error);
          this.router.navigate(["/maintence"]);
        }
      );
    }
    else {
      this.useDefaultTranslation().subscribe((data) => {
        subject.next(data);
      });
    }

    return subject.asObservable();
  }

  public useDefaultTranslation(): Observable<any> {
    const subject = new Subject<any>();

    this.loginService.getDefaultLanguage().subscribe(
      (translation) => {
        if (translation !== null) {
          this.helpService.setLanguage(translation["config"]);
          this.helpService.setLanguageCode('en');
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
