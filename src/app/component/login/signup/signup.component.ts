import { Component, OnInit } from "@angular/core";
import { LoginService } from "src/app/services/login.service";
import { UserModel } from "src/app/models/user-model";
import { Router, ActivatedRoute } from "@angular/router";
import { MailService } from "src/app/services/mail.service";
import { ProfileService } from "src/app/services/profile.service";
import { HelpService } from "src/app/services/help.service";
import { TranslationService } from "src/app/services/translation.service";

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
    private profileService: ProfileService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mailService: MailService,
    private helpService: HelpService,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    this.packModelFromUrl();
    this.initialization();
  }

  packModelFromUrl() {
    this.directorId = this.activatedRoute.snapshot.params.id;
    if (this.activatedRoute.snapshot.params.email !== "null") {
      this.data.email = this.activatedRoute.snapshot.params.email;
    }
    if (this.activatedRoute.snapshot.params.firstname !== "null") {
      this.data.firstname = this.activatedRoute.snapshot.params.firstname;
    }
    if (this.activatedRoute.snapshot.params.lastname !== "null") {
      this.data.lastname = this.activatedRoute.snapshot.params.lastname;
    }
  }

  initialization() {
    let languageCode = this.activatedRoute.snapshot.paramMap.get('languageCode');

    if (languageCode) {
      languageCode = languageCode.toLowerCase();

      const regex = new RegExp('^[a-z]{2}');
      // means languageCode has only 2 letters - ISO 639-1 standard
      if (regex.test(languageCode)) {

        this.service.checkLanguageCode(languageCode).subscribe((data) => {

          //alpha2Code is two-letter country code
          //for sr, use data[3]['alpha2Code'] because we are still missing array of countries in DB
          this.service.getTranslationByCountryCode(data[3]['alpha2Code'].toUpperCase()).subscribe(
            (translation) => {
              if (translation !== null) {
                this.language = translation["config"];
                this.helpService.setLanguage(this.language);
              } else {
                this.translationService.getDefaultTranslation().subscribe((data) => {
                  this.language = data;
                });
              }
            },
            (error) => {
              console.log(error);
              this.router.navigate(["/maintence"]);
            }
          );
        },
          (error) => {
            if (error.status === 404) {
              this.translationService.getDefaultTranslation().subscribe((data) => {
                this.language = data;
              });
            }
          }
        )
      }
      else {
        this.translationService.getDefaultTranslation().subscribe((data) => {
          this.language = data;
        });
      }
    }
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
        this.activatedRoute.snapshot.params.email === "null" &&
        this.activatedRoute.snapshot.params.firstname === "null" &&
        this.activatedRoute.snapshot.params.lastname === "null"
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
              confirmMailThanksForUsing: this.language
                .confirmMailThanksForUsing,
              confirmMailHaveQuestion: this.language.confirmMailHaveQuestion,
              confirmMailGenerateMail: this.language.confirmMailGenerateMail,
              confirmMailCopyright: this.language.confirmMailCopyright,
            };
            this.mailService.sendMail(this.data, function () { });
            this.successSignUp = true;
            setTimeout(() => {
              this.router.navigate(["/login"]);
              this.sendMailToDirectorAfterRegistration();
            }, 4000);
          } else {
            this.existMail = true;
          }
        });
      } else {
        this.service.joinTo(data).subscribe((data) => {
          console.log(data);
          if (data["success"]) {
            this.successSignUp = true;
            setTimeout(() => {
              this.router.navigate(["/login"]);
              this.sendMailToDirectorAfterRegistration();
            }, 4000);
          } else {
            this.existMail = true;
          }
        });
      }
    }
  }

  sendMailToDirectorAfterRegistration() {
    this.profileService.getUserInfoSHA1(this.directorId).subscribe((data) => {
      const dataForRequest = this.generateDataForJoinedMember(data[0].email);
      this.mailService.sendNewMemberJoined(dataForRequest).subscribe((data) => {
        console.log(data);
      });
    });
  }

  generateDataForJoinedMember(directorEmail) {
    let data = {
      language: {
        newMemberJoinedSubject: this.language.newMemberJoinedSubject,
        newMemberJoinedTitle: this.language.newMemberJoinedTitle,
        newMemberJoinedRegardsFirst: this.language.newMemberJoinedRegardsFirst,
        newMemberJoinedMessage: this.language.newMemberJoinedMessage,
        newMemberJoinedName: this.language.newMemberJoinedName,
        newMemberJoinedEmail: this.language.newMemberJoinedEmail,
        newMemberJoinedRegardsEnd: this.language.newMemberJoinedRegardsEnd,
        newMemberJoinedSignature: this.language.newMemberJoinedSignature,
        newMemberJoinedThanksForUsing: this.language
          .newMemberJoinedThanksForUsing,
        newMemberJoinedHaveQuestion: this.language.newMemberJoinedHaveQuestion,
        newMemberJoinedGenerateMail: this.language.newMemberJoinedGenerateMail,
        newMemberJoinedCopyright: this.language.newMemberJoinedCopyright,
      },
      name: this.data.lastname + " " + this.data.firstname,
      email: this.data.email,
      directorEmail: directorEmail,
    };
    return data;
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
