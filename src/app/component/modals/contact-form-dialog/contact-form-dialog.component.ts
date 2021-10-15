import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InviteModel } from 'src/app/models/invite-model';
import { HelpService } from 'src/app/services/help.service';
import { MailService } from 'src/app/services/mail.service';

@Component({
  selector: 'app-contact-form-dialog',
  templateUrl: './contact-form-dialog.component.html',
  styleUrls: ['./contact-form-dialog.component.scss']
})
export class ContactFormDialogComponent implements OnInit {
  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() id: string;
  @Input() name: string;
  @Input() email: string;
  @Input() phone: string;
  public language;
  public recommendationData = new InviteModel();
  public me: any;
  public recommendationSelection = "system-member";

  constructor(private helpService: HelpService,
    private mailService: MailService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.me = JSON.parse(localStorage.getItem("user"));
    this.recommendationData.message = this.language.recommendedMessage;
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

      this.modal.close();
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
      recommendedMemberProfileLink: this.language.recommendedMemberShowProfile,
    };

    return language;
  }
}
