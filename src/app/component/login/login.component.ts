import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { UserModel } from '../../models/user-model';
import { Router } from '@angular/router';
import { CookieService } from 'ng2-cookies';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public currentForm = 'login';
  public language: any;
  public data = new UserModel();
  public passwordIcon = 'fa fa-eye';
  public passwordType = 'password';

  constructor(
    private service: LoginService,
    public router: Router,
    public cookie: CookieService,
    public message: MessageService
  ) {}

  ngOnInit() {
    this.initialization();
  }

  initialization() {
    this.service.checkCountryLocation().subscribe(data => {
      this.service
        .getTranslationByCountryCode(data['countryCode'])
        .subscribe(language => {
          if (language !== null) {
            this.language = language['config'];
          } else {
            this.service.getDefaultLanguage().subscribe(defaultLang => {
              this.language = defaultLang['config'];
            });
          }
        });
    });
  }

  changeForm(form) {
    this.currentForm = form;
  }

  login(form) {
    console.log(this.data);
    this.service.login(this.data).subscribe(data => {
      console.log(data);
      if (data['login']) {
        // localStorage.setItem('id', sha1(1));
        localStorage.setItem('id', data['user']['id']);
        this.cookie.set('user', data['user']['type'], 24, '/');
        this.router.navigate(['home']);
      }
    });
  }

  signup(form) {
    console.log(this.data);
    if (this.data.password !== this.data.confirmPassword) {
    } else {
      this.service.signUp(this.data).subscribe(data => {
        console.log(data);
        if (data['success']) {
          this.router.navigate(['/login/choose-director/' + data['id']]);
        }
      });
    }
  }

  showPass() {
    this.passwordType = 'text';
    this.passwordIcon = 'fa fa-eye-slash';
  }

  hidePass() {
    this.passwordType = 'password';
    this.passwordIcon = 'fa fa-eye';
  }
}
