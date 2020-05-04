import { Component, OnInit } from "@angular/core";
import { LoginService } from "src/app/services/login.service";
import { UserModel } from "../../models/user-model";
import { Router } from "@angular/router";
import { CookieService } from "ng2-cookies";
import { MessageService } from "src/app/services/message.service";
import * as sha1 from "sha1";
import { MailService } from "src/app/services/mail.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public currentForm = "login";
  public language: any;
  public data = new UserModel();
  public passwordIcon = "fa fa-eye";
  public passwordType = "password";
  public notCorrent = false;
  public existMail = false;
  public notExistMail = false;
  public notEqualPassword = false;
  public mailSend = false;
  public agree = false;
  public notAgree = false;

  constructor(
    private service: LoginService,
    public router: Router,
    public cookie: CookieService,
    public message: MessageService,
    public mailService: MailService
  ) {}

  ngOnInit() {
    this.initialization();
  }

  initialization() {
    this.service.checkCountryLocation().subscribe(
      (data) => {
        this.service
          .getTranslationByCountryCode(data["countryCode"])
          .subscribe((language) => {
            if (language !== null) {
              this.language = language["config"];
              localStorage.setItem("language", JSON.stringify(this.language));
            } else {
              this.service.getDefaultLanguage().subscribe((language) => {
                this.language = language["config"];
                localStorage.setItem("language", JSON.stringify(this.language));
              });
            }
          });
      },
      (error) => {
        console.log(error);
        this.service.getDefaultLanguage().subscribe((language) => {
          this.language = language["config"];
          localStorage.setItem("language", JSON.stringify(this.language));
        });
      }
    );
  }

  changeForm(form) {
    this.currentForm = form;
  }

  login(form) {
    console.log(this.data);
    this.service.login(this.data).subscribe((data) => {
      console.log(data);
      if (data["login"]) {
        // localStorage.setItem('id', sha1(1));
        const user = {
          fullname: data["user"]["fullname"],
          type: sha1(data["user"]["type"]),
          image: data["user"]["image"],
        };
        localStorage.setItem("id", sha1(data["user"]["id"].toString()));
        localStorage.setItem("user", JSON.stringify(user));
        this.cookie.set("user", sha1(data["user"]["type"]), 24, "/");
        this.router.navigate(["home"]);
      } else {
        this.notCorrent = true;
      }
    });
  }

  signup(form) {
    this.existMail = false;
    this.notEqualPassword = false;
    if (this.data.password !== this.data.confirmPassword) {
      this.notEqualPassword = true;
    } else if(!this.agree) {
      this.notAgree = true;
    } else {
      this.service.signUp(this.data).subscribe((data) => {
        console.log(data);
        if (data["success"]) {
          this.router.navigate(["/login/choose-director/" + data["id"]]);
        } else {
          this.existMail = true;
        }
      });
    }
  }

  showPass() {
    this.passwordType = "text";
    this.passwordIcon = "fa fa-eye-slash";
  }

  hidePass() {
    this.passwordType = "password";
    this.passwordIcon = "fa fa-eye";
  }

  forgotPassword() {
    const thisObject = this;
    if (this.data.email !== "") {
      this.service.forgotPassword(this.data).subscribe((data) => {
        setTimeout(() => {
          console.log(data);
          if (data["exist"]) {
            thisObject.data["language"] = {
              forgotMailSubject: this.language.forgotMailSubject,
              forgotMailBCITitle: this.language.forgotMailBCITitle,
              forgotMailRegardsFirst: this.language.forgotMailRegardsFirst,
              forgotMailMessage: this.language.forgotMailMessage,
              forgotMailConfirmEmailButton: this.language
                .forgotMailConfirmEmailButton,
              forgotMailRegardsEnd: this.language.forgotMailRegardsEnd,
              forgotMailBCISignature: this.language.forgotMailBCISignature,
              forgotMailThanksForUsing: this.language.forgotMailThanksForUsing,
              forgotMailHaveQuestion: this.language.forgotMailHaveQuestion,
              forgotMailGenerateMail: this.language.forgotMailGenerateMail,
              forgotMailCopyright: this.language.forgotMailCopyright,
            };
            thisObject.mailService
              .sendForgetMail(thisObject.data)
              .subscribe((data) => {
                this.mailSend = true;
              });
          } else {
            this.notExistMail = true;
          }
        }, 100);
      });
    } else {
    }
  }

  agreeWithTerms() {
    this.agree = false;
  }
}
