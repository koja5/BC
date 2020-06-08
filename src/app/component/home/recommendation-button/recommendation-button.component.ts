import {
  Component,
  OnInit,
  Input,
  HostListener,
  Output,
  EventEmitter,
} from "@angular/core";
import { LoginService } from "src/app/services/login.service";
import { InviteModel } from "src/app/models/invite-model";
import { MailService } from "src/app/services/mail.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-recommendation-button",
  templateUrl: "./recommendation-button.component.html",
  styleUrls: ["./recommendation-button.component.scss"],
})
export class RecommendationButtonComponent implements OnInit {
  @Input() id: string;
  @Input() name: string;
  @Input() email: string;
  @Input() phone: string;
  @Input() recommendedWindow: boolean;
  @Output() recommendedWindowEmitter = new EventEmitter<null>();

  public windowHeight: any;
  public windowWidth: any;
  public language: any;
  public directorLoading = false;
  public directorList: any;
  public selectedDirector = null;
  public contactFormWindow = false;
  public recommendationData = new InviteModel();
  public me: any;
  public recommendationSelection = 'system-member';

  constructor(
    private loginService: LoginService,
    private mailService: MailService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
    this.language = JSON.parse(localStorage.getItem("language"));
    this.me = JSON.parse(localStorage.getItem("user"));
    this.recommendationData.message = this.language.recommendedMessage;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    } else {
      this.windowWidth = null;
      this.windowHeight = null;
    }
  }

  closeWindow() {
    this.recommendedWindowEmitter.emit();
    this.recommendedWindow = false;
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
    console.log(event);
    if (event !== "" && event.length > 2) {
      this.directorLoading = true;
      const searchFilter = {
        filter: event,
      };
      this.loginService.searchDirector(searchFilter).subscribe((val: []) => {
        this.directorList = val.sort((a, b) =>
          String(a["fullname"]).localeCompare(String(b["fullname"]))
        );
        this.directorLoading = false;
      });
    } else {
      this.directorList = [];
    }
  }

  sendRecommendation() {
    if (this.selectedDirector) {
      const data = this.packData();

      this.mailService.sendRecommended(data).subscribe((data) => {
        console.log(data);
      });
      this.toastr.success("", this.language.successSendRecommendedText, {
        timeOut: 7000,
        positionClass: "toast-bottom-right",
      });
      this.recommendedWindow = false;
      this.recommendedWindowEmitter.emit();
    }
  }

  packData() {
    let data = {
      sendRecommendation: this.selectedDirector.email,
      recommendedId: this.id,
      recommendedName: this.name,
      recommendedEmail: this.email,
      recommendedPhone: this.phone,
      whoRecommended: this.me.fullname,
    };

    data["language"] = this.packLanguageForRecommended();

    return data;
  }

  packLanguageForRecommended() {
    const language = {
      recommendedSubject: this.language.recommendedSubject,
      recommendedBCITitle: this.language.recommendedBCITitle,
      recommendedMessage: this.recommendationData.message,
      recommendedHelpful: this.language.recommendedHelpful,
      recommendedNotHelpful: this.language.recommendedNotHelpful,
      recommendedThanksForUsing: this.language.recommendedThanksForUsing,
      recommendedHaveQuestion: this.language.recommendedHaveQuestion,
      recommendedGenerateMail: this.language.recommendedGenerateMail,
      recommendedCopyright: this.language.recommendedCopyright,
      recommendedMemberName: this.language.recommendedMemberName,
      recommendedMemberEmail: this.language.recommendedMemberEmail,
      recommendedMemberPhone: this.language.recommendedMemberPhone,
      recommendedWhoRecommendedMember: this.language
        .recommendedWhoRecommendedMember,
    };

    return language;
  }

  sendRecommendationByMail() {
    if (this.recommendationData.email) {
      const data = this.packDataByMail();

      this.mailService.sendRecommended(data).subscribe((data) => {
        console.log(data);
      });
      this.toastr.success("", this.language.successSendRecommendedText, {
        timeOut: 7000,
        positionClass: "toast-bottom-right",
      });
      this.contactFormWindow = false;
      this.recommendedWindow = false;
      this.recommendedWindowEmitter.emit();
    }
  }

  packDataByMail() {
    let data = {
      sendRecommendation: this.recommendationData.email,
      recommendedId: this.id,
      recommendedName: this.name,
      recommendedEmail: this.email,
      recommendedPhone: this.phone,
      whoRecommended: this.me.fullname,
    };

    data["language"] = this.packLanguageForRecommendedByMail();

    return data;
  }

  packLanguageForRecommendedByMail() {
    const language = {
      recommendedSubject: this.language.recommendedSubject,
      recommendedBCITitle: this.language.recommendedBCITitle,
      recommendedMessage: this.recommendationData.message,
      recommendedHelpful: this.language.recommendedHelpful,
      recommendedNotHelpful: this.language.recommendedNotHelpful,
      recommendedThanksForUsing: this.language.recommendedThanksForUsing,
      recommendedHaveQuestion: this.language.recommendedHaveQuestion,
      recommendedGenerateMail: this.language.recommendedGenerateMail,
      recommendedCopyright: this.language.recommendedCopyright,
      recommendedMemberName: this.language.recommendedMemberName,
      recommendedMemberEmail: this.language.recommendedMemberEmail,
      recommendedMemberPhone: this.language.recommendedMemberPhone,
      recommendedWhoRecommendedMember: this.language
        .recommendedWhoRecommendedMember,
    };

    return language;
  }
}
