import { Component, OnInit } from "@angular/core";
import { LoginService } from "src/app/services/login.service";
import { Router, ActivatedRoute } from "@angular/router";
import { HelpService } from "src/app/services/help.service";
import { TranslationService } from "src/app/services/translation.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"]
})
export class ChangePasswordComponent implements OnInit {
  public data = {
    email: "",
    password: "",
    confirmPassword: ""
  };
  public passwordIcon = "fa fa-eye";
  public passwordType = "password";
  public language: any;

  constructor(
    private service: LoginService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private helpService: HelpService,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    this.data.email = this.activatedRoute.snapshot.params.id;
    this.initialization();
  }

  initialization() {
    let languageCode = this.activatedRoute.snapshot.paramMap.get('languageCode').toLowerCase();

    this.translationService.getTranslation(languageCode).subscribe((data) => {
      this.language = data;
    });
  }

  showPass() {
    this.passwordType = "text";
    this.passwordIcon = "fa fa-eye-slash";
  }

  hidePass() {
    this.passwordType = "password";
    this.passwordIcon = "fa fa-eye";
  }

  changePassword() {
    if (this.data.password !== this.data.confirmPassword) {
      /*this.passMatch = false;
      this.errorInfo = 'The email is not the same';*/
    } else {
      this.service.changePassword(this.data).subscribe(data => {
        if (data["code"]) {
          // document.getElementById('changeInfoSuccess').innerHTML = data.message;
          setTimeout(() => {
            this.router.navigate(["login"]);
          }, 2000);
        }
      });
    }
  }
}
