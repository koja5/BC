import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoginService } from "src/app/services/login.service";
import { MailService } from "../../../../services/mail.service";

@Component({
  selector: "app-choose-director",
  templateUrl: "./choose-director.component.html",
  styleUrls: ["./choose-director.component.scss"]
})
export class ChooseDirectorComponent implements OnInit {
  public id: number;
  public step = "welcome";
  public line = "one";
  public user: any;

  constructor(
    private route: ActivatedRoute,
    private service: LoginService,
    private mailService: MailService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.initialization();
  }

  initialization() {
    this.service.getUserInfo(this.id).subscribe(data => {
      this.user = data[0];
    });
  }

  next(step, line) {
    this.step = step;
    this.line = line;
  }

  previous(step, line) {
    this.step = step;
    this.line = line;
  }

  doNotHave() {
    const data = {
      sid: 0 + "-" + this.id,
      id: this.id
    };

    this.service.updateUserSID(data).subscribe(data => {
      console.log(data);
      if (data) {
        this.step = "done";
        this.line = "three";
      }
    });
  }

  doneSignUp() {
    this.mailService.sendMail(this.user, function() {
      this.router.navigate(["/login"]);
    });
  }
}
