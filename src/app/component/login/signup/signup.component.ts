import { Component, OnInit } from "@angular/core";
import { LoginService } from "src/app/services/login.service";
import { UserModel } from "src/app/models/user-model";
import { Router, ActivatedRoute } from "@angular/router";

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

  constructor(
    private service: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.directorId = this.route.snapshot.params.id;
    this.initialization();
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
    } else {
      const data = {
        data: this.data,
        directorId: this.directorId,
      };
      this.service.joinTo(data).subscribe((data) => {
        console.log(data);
        if (data) {
          this.router.navigate(["/login"]);
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
}
