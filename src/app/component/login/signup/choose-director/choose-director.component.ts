import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HelpService } from 'src/app/services/help.service';
import { LoginService } from "src/app/services/login.service";
import { MailService } from "../../../../services/mail.service";

@Component({
  selector: "app-choose-director",
  templateUrl: "./choose-director.component.html",
  styleUrls: ["./choose-director.component.scss"],
})
export class ChooseDirectorComponent implements OnInit {
  public id: number;
  public step = "welcome";
  public line = "one";
  public user: any;
  public directorLoading = false;
  public directorList = null;
  public selectedDirector = null;
  public language: any;

  constructor(
    private route: ActivatedRoute,
    private service: LoginService,
    private mailService: MailService,
    private router: Router,
    private helpService: HelpService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.initialization();
  }

  initialization() {
    this.service.getUserInfo(this.id).subscribe((data) => {
      this.user = data[0];
    });
    this.getLanguage();
  }

  getLanguage() {
    this.language = this.helpService.getLanguage();
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
      sid: 1 + "-" + this.id,
      id: this.id,
    };

    this.service.updateUserSID(data).subscribe((data) => {
      console.log(data);
      if (data) {
        this.step = "done";
        this.line = "three";
      }
    });
  }

  updateUserSID() {
    const data = {
      sid: this.selectedDirector.sid + "-" + this.id,
      id: this.id,
    };

    this.service.updateUserSID(data).subscribe((data) => {
      console.log(data);
      if (data) {
        this.step = "done";
        this.line = "three";
      }
    });
  }

  doneSignUp() {
    this.user["language"] = {
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
    this.mailService.sendMail(this.user, function () {
      this.router.navigate(["/login"]);
    });
  }

  onValueChange(event) {
    console.log(event);
    if (event === undefined) {
      this.selectedDirector = null;
    } else {
      this.selectedDirector = event;
    }
  }

  searchDirector(event) {
    if (event !== "" && event.length > 2) {
      this.directorLoading = true;
      const searchFilter = {
        filter: event,
      };
      this.service.searchDirector(searchFilter).subscribe((val: []) => {
        this.directorList = val.sort((a, b) =>
          String(a["fullname"]).localeCompare(String(b["fullname"]))
        );
        this.directorLoading = false;
      });
    } else {
      this.directorList = [];
    }
  }
}
