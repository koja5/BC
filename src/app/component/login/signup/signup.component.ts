import { Component, OnInit } from "@angular/core";
import { LoginService } from "src/app/services/login.service";
import { UserModel } from "src/app/models/user-model";
import { Router, ActivatedRoute } from "@angular/router";
import { MailService } from "src/app/services/mail.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  public language: any;
  public data = new UserModel();
  public notCorrent = false;
  public existMail = false;
  public notEqualPassword = false;
  public passwordIcon = "fa fa-eye";
  public passwordType = "password";
  public directorId: any;
  public agree = false;
  public notAgree = false;
  public successSignUp = false;

  constructor(
    private service: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private mailService: MailService
  ) {}

  ngOnInit() {
    this.packModelFromUrl();
    this.initialization();
  }

  packModelFromUrl() {
    this.directorId = this.route.snapshot.params.id;
    if (this.route.snapshot.params.email !== "null") {
      this.data.email = this.route.snapshot.params.email;
    }
    if (this.route.snapshot.params.firstname !== "null") {
      this.data.firstname = this.route.snapshot.params.firstname;
    }
    if (this.route.snapshot.params.lastname !== "null") {
      this.data.lastname = this.route.snapshot.params.lastname;
    }
  }

  initialization() {
    this.service.checkCountryLocation().subscribe((data) => {
      this.service
        .getTranslationByCountryCode(data["countryCode"])
        .subscribe((language) => {
          if (language !== null) {
            this.language = language["config"];
          } else {
            this.service.getDefaultLanguage().subscribe((language) => {
              this.language = language["config"];
            });
          }
        });
    });
  }

  signup() {
    this.existMail = false;
    this.notEqualPassword = false;
    if (this.data.password !== this.data.confirmPassword) {
      this.notEqualPassword = true;
    } else if (!this.agree) {
      this.notAgree = true;
    } else {
      this.notAgree = false;
      const data = {
        data: this.data,
        directorId: this.directorId,
      };
      if (
        this.route.snapshot.params.email === "null" &&
        this.route.snapshot.params.firstname === "null" &&
        this.route.snapshot.params.lastname === "null"
      ) {
        this.service.joinToFromReferral(data).subscribe((data) => {
          console.log(data);
          if (data["success"]) {
            this.data["language"] = {
            confirmMailSubject: this.language.confirmMailSubject,
            confirmMailBCITitle: this.language.confirmMailBCITitle,
            confirmMailRegardsFirst: this.language.confirmMailRegardsFirst,
            confirmMailMessage: this.language.confirmMailMessage,
            confirmMailConfirmEmailButton: this.language
              .confirmMailConfirmEmailButton,
            confirmMailRegardsEnd: this.language.confirmMailRegardsEnd,
            confirmMailBCISignature: this.language.confirmMailBCISignature,
            confirmMailThanksForUsing: this.language.confirmMailThanksForUsing,
            confirmMailHaveQuestion: this.language.confirmMailHaveQuestion,
            confirmMailGenerateMail: this.language.confirmMailGenerateMail,
            confirmMailCopyright: this.language.confirmMailCopyright,
          };
          this.mailService.sendMail(this.data, function () {});
            this.successSignUp = true;
            setTimeout(() => {
              this.router.navigate(["/login"]);
            }, 4000);
          } else {
            this.existMail = true;
          }
        });
      } else {
        this.service.joinTo(data).subscribe((data) => {
          console.log(data);
          if (data["success"]) {
            /*this.data["language"] = {
            confirmMailSubject: this.language.confirmMailSubject,
            confirmMailBCITitle: this.language.confirmMailBCITitle,
            confirmMailRegardsFirst: this.language.confirmMailRegardsFirst,
            confirmMailMessage: this.language.confirmMailMessage,
            confirmMailConfirmEmailButton: this.language
              .confirmMailConfirmEmailButton,
            confirmMailRegardsEnd: this.language.confirmMailRegardsEnd,
            confirmMailBCISignature: this.language.confirmMailBCISignature,
            confirmMailThanksForUsing: this.language.confirmMailThanksForUsing,
            confirmMailHaveQuestion: this.language.confirmMailHaveQuestion,
            confirmMailGenerateMail: this.language.confirmMailGenerateMail,
            confirmMailCopyright: this.language.confirmMailCopyright,
          };
          this.mailService.sendMail(this.data, function () {});*/
            this.successSignUp = true;
            setTimeout(() => {
              this.router.navigate(["/login"]);
            }, 4000);
          } else {
            this.existMail = true;
          }
        });
      }
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

  agreeWithTerms() {
    this.agree = true;
  }
}
