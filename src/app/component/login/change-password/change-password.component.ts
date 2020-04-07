import { Component, OnInit } from "@angular/core";
import { LoginService } from "src/app/services/login.service";
import { Router, ActivatedRoute } from "@angular/router";

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
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.data.email = this.route.snapshot.params.id;
    this.initialization();
  }

  initialization() {
    this.service.checkCountryLocation().subscribe(data => {
      this.service
        .getTranslationByCountryCode(data["countryCode"])
        .subscribe(language => {
          if (language !== null) {
            this.language = language["config"];
          } else {
            this.service.getDefaultLanguage().subscribe(language => {
              this.language = language["config"];
            });
          }
        });
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
